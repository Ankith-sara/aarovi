import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Palette, Trash2, Undo, Redo,
  Move, Info, Settings, CheckCircle2, X, Menu, Wand2, Send, Sparkles
} from 'lucide-react';
import { assets } from '../assets/assets';
import {
  SVG_TEMPLATES,
  EMBROIDERY_PATTERNS as IMPORTED_EMBROIDERY,
  FABRIC_PRINTS as IMPORTED_PRINTS
} from '../data/svg_templates';
import { toast } from 'react-toastify';
import { generateDesignChat, editDesignChat } from '../context/GeminiConfig';

// EMBROIDERY PATTERNS & FABRIC PRINTS
const EMBROIDERY_PATTERNS = IMPORTED_EMBROIDERY;

const FABRIC_PRINTS = {
  block: {
    img: assets.block_img,
    name: 'Block Pattern',
    description: 'Traditional block stamp pattern',
    createPattern: IMPORTED_PRINTS.geometric?.createPattern || ((color = '#8B0000') => {
      const c = document.createElement('canvas');
      c.width = c.height = 120;
      const ctx = c.getContext('2d');
      ctx.fillStyle = color;
      for (let x = 10; x < 120; x += 40) {
        for (let y = 10; y < 120; y += 40) {
          ctx.fillRect(x, y, 22, 22);
        }
      }
      return c;
    })
  },
  bagru: {
    img: assets.bagru_img,
    name: 'Bagru Pattern',
    description: 'Rajasthani Bagru hand-block print',
    createPattern: IMPORTED_PRINTS.dots?.createPattern || ((color = '#5C4033') => {
      const c = document.createElement('canvas');
      c.width = c.height = 120;
      const ctx = c.getContext('2d');
      ctx.fillStyle = color;
      for (let i = 0; i < 25; i++) {
        const x = Math.random() * 120;
        const y = Math.random() * 120;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      return c;
    })
  },
  floral: {
    img: assets.floral_img,
    name: 'Floral Pattern',
    description: 'Soft floral motifs',
    createPattern: IMPORTED_PRINTS.floral?.createPattern || ((color = '#E91E63') => {
      const c = document.createElement('canvas');
      c.width = c.height = 120;
      const ctx = c.getContext('2d');
      const drawFlower = (x, y) => {
        ctx.fillStyle = color;
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3;
          ctx.beginPath();
          ctx.arc(x + Math.cos(a) * 12, y + Math.sin(a) * 12, 6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
      };
      for (let x = 20; x < 120; x += 40) {
        for (let y = 20; y < 120; y += 40) {
          drawFlower(x, y);
        }
      }
      return c;
    })
  },
  kalamkari: {
    img: assets.kalamkari_img,
    name: 'Kalamkari Pattern',
    description: 'Hand-painted kalamkari art',
    createPattern: IMPORTED_PRINTS.paisley?.createPattern || ((color = '#3B2F2F') => {
      const c = document.createElement('canvas');
      c.width = c.height = 140;
      const ctx = c.getContext('2d');
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(10, 70);
      for (let x = 10; x < 130; x += 20) {
        ctx.quadraticCurveTo(x + 10, 50 + Math.random() * 40, x + 20, 70);
      }
      ctx.stroke();
      return c;
    })
  },
  shibori: {
    img: assets.shibori_img,
    name: 'Shibori Pattern',
    description: 'Indigo resist-dye pattern',
    createPattern: ((color = '#1E3A8A') => {
      const c = document.createElement('canvas');
      c.width = c.height = 120;
      const ctx = c.getContext('2d');
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      for (let i = 0; i < 6; i++) {
        const x = Math.random() * 120;
        const y = Math.random() * 120;
        ctx.beginPath();
        ctx.arc(x, y, 15 + Math.random() * 10, 0, Math.PI * 2);
        ctx.stroke();
      }
      return c;
    })
  },
  painting: {
    img: assets.painting_img,
    name: 'Painting Pattern',
    description: 'Abstract modern painting',
    createPattern: IMPORTED_PRINTS.stripes?.createPattern || ((color = '#4F46E5') => {
      const c = document.createElement('canvas');
      c.width = c.height = 120;
      const ctx = c.getContext('2d');
      ctx.strokeStyle = color;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * 120, Math.random() * 120);
        ctx.lineTo(Math.random() * 120, Math.random() * 120);
        ctx.stroke();
      }
      return c;
    })
  }
};

// HELPER FUNCTIONS
const getEssentialZones = (zones, dressType) => {
  if (!zones) return [];

  const essentialPatterns = {
    core: ['body', 'bodice', 'top'],
    neck: ['neckline', 'collar'],
    sleeves: ['sleeve_left', 'sleeve_right', 'sleeve'],
    buttons: ['button', 'buttons'],
    lehenga: ['blouse', 'skirt', 'waist', 'border'],
    sherara: ['top', 'pants', 'sharara'],
    anarkali: ['bodice', 'waist_band', 'upper_flare', 'lower_flare', 'border']
  };

  return zones.filter(zone => {
    const id = zone.id.toLowerCase();

    if (essentialPatterns.core.some(pattern => id === pattern)) return true;
    if (essentialPatterns.neck.some(pattern => id.includes(pattern))) return true;
    if (essentialPatterns.sleeves.some(pattern => id.includes(pattern))) return true;
    if (essentialPatterns.buttons.some(pattern => id === pattern)) return true;

    if (dressType === 'Lehenga' && essentialPatterns.lehenga.some(pattern => id.includes(pattern))) {
      return true;
    }

    if (dressType === 'Sherara' && essentialPatterns.sherara.some(pattern => id.includes(pattern))) {
      return true;
    }

    if (dressType === 'Anarkali' && essentialPatterns.anarkali.some(pattern => id.includes(pattern))) {
      return true;
    }

    if ((dressType === 'Kurta Sets' || dressType === 'Kurti Sets') && id === 'pants') {
      return true;
    }

    return false;
  });
};

// Color name to hex mapping
const COLOR_MAP = {
  'red': '#DC2626', 'blue': '#3B82F6', 'green': '#10B981',
  'yellow': '#F59E0B', 'orange': '#F97316', 'purple': '#A855F7',
  'pink': '#EC4899', 'brown': '#A52A2A', 'black': '#1F2937',
  'white': '#FFFFFF', 'gray': '#9CA3AF', 'grey': '#9CA3AF',
  'maroon': '#800000', 'navy': '#1E40AF', 'gold': '#D4AF37',
  'silver': '#C0C0C0', 'beige': '#F5F5DC', 'ivory': '#FFFFF0',
  'teal': '#14B8A6', 'turquoise': '#06B6D4', 'lavender': '#E9D5FF',
  'magenta': '#D946EF', 'olive': '#84CC16', 'coral': '#FB7185',
  'peach': '#FBBF24', 'mint': '#6EE7B7', 'cream': '#FEF3C7',
  'burgundy': '#991B1B', 'mustard': '#EAB308', 'emerald': '#10B981',
  'crimson': '#DC2626', 'indigo': '#6366F1', 'cyan': '#06B6D4'
};

// MAIN COMPONENT
const DesignCanvas = ({
  onDesignChange,
  dressType = 'Kurta',
  selectedColor = '#ffffff',
  gender = 'Women',
  fabric = 'Cotton'
}) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [zoneColors, setZoneColors] = useState({});
  const [zonePatterns, setZonePatterns] = useState({});
  const [activeTab, setActiveTab] = useState('colors');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentColor, setCurrentColor] = useState(selectedColor);
  const [embroideryMetadata, setEmbroideryMetadata] = useState({});
  const [sleeveStyle, setSleeveStyle] = useState('full');
  const [initialized, setInitialized] = useState(false);
  const [aiGenerateMode, setAiGenerateMode] = useState(false);
  const [aiGeneratePrompt, setAiGeneratePrompt] = useState('');
  const [aiGenerateLoading, setAiGenerateLoading] = useState(false);
  const [aiEditMode, setAiEditMode] = useState(false);
  const [aiEditPrompt, setAiEditPrompt] = useState('');
  const [aiEditLoading, setAiEditLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Get template
  const rawTemplate = SVG_TEMPLATES[dressType] || SVG_TEMPLATES.Kurta;
  const template = {
    ...rawTemplate,
    zones: getEssentialZones(rawTemplate.zones, dressType)
  };

  // AI FUNCTIONS - CLIENT SIDE
  // Parse AI response and clean JSON
  const parseAIResponse = (text) => {
    try {
      // Remove markdown code blocks
      let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      // Try to find JSON object in the text
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleaned = jsonMatch[0];
      }

      return JSON.parse(cleaned);
    } catch (error) {
      console.error('JSON parse error:', error);
      throw new Error('Failed to parse AI response');
    }
  };

  // AI GENERATE FULL DESIGN
  const handleAIGenerate = async () => {
    if (!aiGeneratePrompt.trim()) {
      toast.error('Please describe the design you want');
      return;
    }

    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      toast.error('Gemini API key not configured');
      return;
    }

    setAiGenerateLoading(true);

    try {
      const chat = generateDesignChat();

      const userPrompt = `Generate a ${gender}'s ${dressType} made of ${fabric}.

User Request: "${aiGeneratePrompt}"

AVAILABLE ZONES:
${template.zones.map(z => `- ${z.id}: ${z.label}`).join('\n')}

Consider traditional Indian aesthetics and the fabric properties.`;

      const result = await chat.sendMessage(userPrompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      const design = JSON.parse(text);

      // Apply the design
      applyAIDesign(design);

      toast.success('AI design generated successfully!');
      setAiGeneratePrompt('');
      setAiGenerateMode(false);

    } catch (error) {
      console.error('AI Generate Error:', error);
      toast.error(error.message || 'AI generation failed. Please try again.');
    } finally {
      setAiGenerateLoading(false);
    }
  };

  // Apply AI generated design to canvas
  const applyAIDesign = (design) => {
    // Apply colors
    if (design.colorPalette?.[0]) {
      const baseColor = design.colorPalette[0];
      setCurrentColor(baseColor);

      const updatedColors = {};
      template.zones.forEach(zone => {
        updatedColors[zone.id] = baseColor;
      });
      setZoneColors(updatedColors);
    }

    // Apply zone-specific colors
    if (design.zoneColors) {
      setZoneColors(prev => ({ ...prev, ...design.zoneColors }));
    }

    // Apply sleeve style
    if (design.sleeveStyle) {
      setSleeveStyle(design.sleeveStyle);
    }

    // Apply embroidery
    if (design.embroidery && design.embroidery.type !== 'none') {
      design.embroidery.zones.forEach(zoneId => {
        const pattern = EMBROIDERY_PATTERNS[design.embroidery.type];
        if (pattern) {
          const patternCanvas = pattern.createPattern(pattern.threadColors[0]);
          const patternUrl = patternCanvas.toDataURL();

          setZonePatterns(prev => ({
            ...prev,
            [zoneId]: { type: 'embroidery', url: patternUrl }
          }));

          setEmbroideryMetadata(prev => ({
            ...prev,
            [zoneId]: {
              type: design.embroidery.type,
              zone: zoneId,
              zoneName: template.zones.find(z => z.id === zoneId)?.label,
              density: design.embroidery.density,
              threadColor: pattern.threadColors[0],
              appliedAt: new Date().toISOString()
            }
          }));
        }
      });
    }

    // Apply prints
    if (design.fabricPrint && design.fabricPrint !== 'none' && design.printZones) {
      design.printZones.forEach(zoneId => {
        const print = FABRIC_PRINTS[design.fabricPrint];
        if (print) {
          const patternCanvas = print.createPattern();
          const patternUrl = patternCanvas.toDataURL();
          setZonePatterns(prev => ({
            ...prev,
            [zoneId]: { type: 'print', url: patternUrl }
          }));
        }
      });
    }

    saveToHistory();
  };

  // AI EDIT EXISTING DESIGN
  const handleAIEdit = async () => {
    if (!aiEditPrompt.trim()) {
      toast.error('Please describe what you want to change');
      return;
    }

    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      toast.error('Gemini API key not configured');
      return;
    }

    setAiEditLoading(true);

    try {
      const chat = editDesignChat();

      const userPrompt = `CURRENT DESIGN:
- Dress: ${dressType}, Gender: ${gender}
- Base Color: ${currentColor}
- Sleeve: ${sleeveStyle}

AVAILABLE ZONES:
${template.zones.map(z => `- ${z.id}: ${z.label}`).join('\n')}

USER REQUEST: "${aiEditPrompt}"`;

      const result = await chat.sendMessage(userPrompt);
      const response = await result.response;
      const text = response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        // Use fallback if JSON parsing fails
        data = { modifications: parseEditRequestFallback(aiEditPrompt, {}) };
      }

      const modifications = data.modifications;

      // Apply modifications (same code as before)
      if (modifications.sleeveStyle) setSleeveStyle(modifications.sleeveStyle);
      if (modifications.baseColor) setCurrentColor(modifications.baseColor);
      if (modifications.zoneColors) {
        setZoneColors(prev => ({ ...prev, ...modifications.zoneColors }));
      }

      saveToHistory();
      toast.success('Design updated successfully');
      setAiEditPrompt('');
      setAiEditMode(false);

    } catch (error) {
      console.error('AI Edit Error:', error);
      toast.error(error.message || 'AI edit failed. Please try again.');
    } finally {
      setAiEditLoading(false);
    }
  };

  // Fallback parser for when AI fails
  const parseEditRequestFallback = (prompt, design) => {
    const lowerPrompt = prompt.toLowerCase();
    const modifications = {
      sleeveStyle: null,
      baseColor: null,
      zoneColors: {},
      applyEmbroidery: null,
      applyPrint: null,
      removeFromZones: []
    };

    // Sleeve modifications
    if (lowerPrompt.includes('full sleeve') || lowerPrompt.includes('long sleeve')) {
      modifications.sleeveStyle = 'full';
    } else if (lowerPrompt.includes('half sleeve') || lowerPrompt.includes('elbow') || lowerPrompt.includes('3/4')) {
      modifications.sleeveStyle = 'elbow';
    } else if (lowerPrompt.includes('short sleeve')) {
      modifications.sleeveStyle = 'short';
    } else if (lowerPrompt.includes('sleeveless') || lowerPrompt.includes('no sleeve')) {
      modifications.sleeveStyle = 'sleeveless';
    }

    // Color modifications
    for (const [colorName, hexCode] of Object.entries(COLOR_MAP)) {
      if (lowerPrompt.includes(colorName)) {
        if (lowerPrompt.includes('body')) {
          modifications.zoneColors.body = hexCode;
        }
        if (lowerPrompt.includes('sleeve')) {
          modifications.zoneColors.sleeve_left = hexCode;
          modifications.zoneColors.sleeve_right = hexCode;
        }
        if (!lowerPrompt.includes('body') && !lowerPrompt.includes('sleeve')) {
          modifications.baseColor = hexCode;
        }
      }
    }

    // Embroidery
    if (lowerPrompt.includes('maggam')) {
      const zones = lowerPrompt.includes('body') ? ['body'] : ['body'];
      if (lowerPrompt.includes('sleeve')) zones.push('sleeve_left', 'sleeve_right');
      modifications.applyEmbroidery = { zones, pattern: 'maggam' };
    } else if (lowerPrompt.includes('thread work')) {
      modifications.applyEmbroidery = { zones: ['body'], pattern: 'threadWork' };
    }

    // Prints
    if (lowerPrompt.includes('floral')) {
      modifications.applyPrint = { zones: ['body'], print: 'floral' };
    } else if (lowerPrompt.includes('block')) {
      modifications.applyPrint = { zones: ['body'], print: 'block' };
    }

    return modifications;
  };

  // REGULAR FUNCTIONS 
  useEffect(() => {
    setCurrentColor(selectedColor);
  }, [selectedColor]);

  useEffect(() => {
    if (!initialized && template.zones.length > 0) {
      const initialColors = {};
      template.zones.forEach(zone => {
        initialColors[zone.id] = selectedColor;
      });
      setZoneColors(initialColors);
      setInitialized(true);
    }
  }, [initialized, template.zones, selectedColor]);

  useEffect(() => {
    setInitialized(false);
    setSelectedZone(null);
  }, [dressType]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getSleeveVisibility = (zoneId) => {
    if (!zoneId.includes('sleeve')) return { visible: true, clipPath: null };

    switch (sleeveStyle) {
      case 'full':
        return { visible: true, clipPath: null };
      case 'elbow':
        return { visible: true, clipPath: 'inset(0 0 25% 0)' };
      case 'short':
        return { visible: true, clipPath: 'inset(0 0 50% 0)' };
      case 'sleeveless':
        return { visible: false, clipPath: null };
      default:
        return { visible: true, clipPath: null };
    }
  };

  const saveToHistory = useCallback(() => {
    const state = {
      zoneColors: { ...zoneColors },
      zonePatterns: { ...zonePatterns },
      embroideryMetadata: { ...embroideryMetadata },
      currentColor,
      sleeveStyle
    };

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(state);
      return newHistory.slice(-50);
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [zoneColors, zonePatterns, embroideryMetadata, currentColor, sleeveStyle, historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];

      setZoneColors(state.zoneColors);
      setZonePatterns(state.zonePatterns);
      setEmbroideryMetadata(state.embroideryMetadata);
      setCurrentColor(state.currentColor);
      setSleeveStyle(state.sleeveStyle);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const state = history[newIndex];

      setZoneColors(state.zoneColors);
      setZonePatterns(state.zonePatterns);
      setEmbroideryMetadata(state.embroideryMetadata);
      setCurrentColor(state.currentColor);
      setSleeveStyle(state.sleeveStyle);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  useEffect(() => {
    if (history.length === 0) {
      saveToHistory();
    }
  }, []);

  const sleeveOptions = [
    { value: 'full', label: 'Full Sleeve' },
    { value: 'elbow', label: '3/4 Sleeve' },
    { value: 'short', label: 'Short Sleeve' },
    { value: 'sleeveless', label: 'Sleeveless' }
  ];

  const handleZoneClick = (zoneId) => {
    setSelectedZone(zoneId);
  };

  const getZoneColor = (zoneId) => {
    return zoneColors[zoneId] || currentColor;
  };

  const applyEmbroidery = (patternKey) => {
    if (!selectedZone) return;

    const pattern = EMBROIDERY_PATTERNS[patternKey];
    if (!pattern) return;

    const metadata = {
      type: patternKey,
      zone: selectedZone,
      zoneName: template.zones.find(z => z.id === selectedZone)?.label,
      density: pattern.density,
      threadColor: pattern.threadColors[0],
      appliedAt: new Date().toISOString()
    };

    setEmbroideryMetadata(prev => ({
      ...prev,
      [selectedZone]: metadata
    }));

    const patternCanvas = pattern.createPattern(pattern.threadColors[0]);
    const patternUrl = patternCanvas.toDataURL();

    setZonePatterns(prev => ({
      ...prev,
      [selectedZone]: { type: 'embroidery', url: patternUrl }
    }));

    saveToHistory();
    if (isMobile) setSidebarOpen(false);
  };

  const applyFabricPrint = (printKey) => {
    if (!selectedZone) return;

    const print = FABRIC_PRINTS[printKey];
    if (!print) return;

    const patternCanvas = print.createPattern();
    const patternUrl = patternCanvas.toDataURL();

    setZonePatterns(prev => ({
      ...prev,
      [selectedZone]: { type: 'print', url: patternUrl }
    }));

    saveToHistory();
    if (isMobile) setSidebarOpen(false);
  };

  const clearZone = () => {
    if (!selectedZone) return;

    setZoneColors(prev => {
      const updated = { ...prev };
      delete updated[selectedZone];
      return updated;
    });

    setZonePatterns(prev => {
      const updated = { ...prev };
      delete updated[selectedZone];
      return updated;
    });

    setEmbroideryMetadata(prev => {
      const updated = { ...prev };
      delete updated[selectedZone];
      return updated;
    });

    saveToHistory();
  };

  const applyColorToZone = (color) => {
    if (!selectedZone) return;
    setZoneColors(prev => ({ ...prev, [selectedZone]: color }));
    saveToHistory();
  };

  const applyColorToAllZones = (color) => {
    const updatedColors = {};
    template.zones.forEach(zone => {
      updatedColors[zone.id] = color;
    });
    setZoneColors(updatedColors);
    saveToHistory();
  };

  const optimizePngSize = (canvas, maxWidth = 800) => {
    if (canvas.width > maxWidth) {
      const ratio = maxWidth / canvas.width;
      const optimizedCanvas = document.createElement('canvas');
      optimizedCanvas.width = maxWidth;
      optimizedCanvas.height = canvas.height * ratio;

      const ctx = optimizedCanvas.getContext('2d');
      ctx.drawImage(canvas, 0, 0, optimizedCanvas.width, optimizedCanvas.height);

      return optimizedCanvas.toDataURL('image/png', 0.8);
    }

    return canvas.toDataURL('image/png', 0.8);
  };

  // Update the svgToPng function
  const svgToPng = useCallback(() => {
    return new Promise((resolve) => {
      if (!svgRef.current) {
        resolve('');
        return;
      }

      const svg = svgRef.current;
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      // Use smaller size to reduce payload
      canvas.width = 600;
      canvas.height = 600;

      img.onload = () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // Optimize size
        const optimizedPng = optimizePngSize(canvas, 600);
        resolve(optimizedPng);
      };

      img.onerror = () => resolve('');
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    });
  }, []);

  useEffect(() => {
    const exportDesign = async () => {
      if (onDesignChange && svgRef.current) {
        const svgString = new XMLSerializer().serializeToString(svgRef.current);
        const pngData = await svgToPng();

        onDesignChange({
          svg: svgString,
          png: pngData,
          zoneColors,
          zonePatterns,
          sleeveStyle,
          color: currentColor,
          baseColor: currentColor,
          embroideryMetadata: Object.values(embroideryMetadata)
        });
      }
    };

    exportDesign();
  }, [zoneColors, zonePatterns, currentColor, sleeveStyle, embroideryMetadata, onDesignChange, svgToPng]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const colorPresets = [
    { name: 'Red', color: '#DC2626' },
    { name: 'Pink', color: '#EC4899' },
    { name: 'Purple', color: '#A855F7' },
    { name: 'Blue', color: '#3B82F6' },
    { name: 'Green', color: '#10B981' },
    { name: 'Yellow', color: '#F59E0B' },
    { name: 'Orange', color: '#F97316' },
    { name: 'Teal', color: '#14B8A6' },
    { name: 'Indigo', color: '#6366F1' },
    { name: 'White', color: '#FFFFFF' },
    { name: 'Black', color: '#1F2937' },
    { name: 'Gold', color: '#D4AF37' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <Palette size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text">Design Canvas</h3>
                <p className="text-sm text-text/60">{dressType}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleUndo}
                disabled={!canUndo}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title="Undo">
                <Undo size={18} />
              </button>
              <button
                onClick={handleRedo}
                disabled={!canRedo}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title="Redo">
                <Redo size={18} />
              </button>
              <button
                onClick={() => {
                  setAiEditMode(!aiEditMode);
                  setAiGenerateMode(false);
                }}
                className={`p-2 rounded-lg transition-all ${aiEditMode ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}`}
                title="AI Edit">
                <Wand2 size={18} />
              </button>
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 bg-secondary text-white rounded-lg">
                  <Menu size={18} />
                </button>
              )}
            </div>
          </div>

          {/* AI GENERATE MODE */}
          {aiGenerateMode && (
            <div className="mb-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-purple-300">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={18} className="text-purple-600" />
                <h4 className="font-bold text-purple-900">AI Design Generator</h4>
              </div>
              <p className="text-xs text-purple-700 mb-3">
                Describe your dream design and let AI create it for you!
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiGeneratePrompt}
                  onChange={(e) => setAiGeneratePrompt(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !aiGenerateLoading && handleAIGenerate()}
                  placeholder="e.g., 'Elegant silk kurta with golden embroidery'"
                  className="flex-1 px-3 py-2 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm"
                  disabled={aiGenerateLoading}
                />
                <button
                  onClick={handleAIGenerate}
                  disabled={aiGenerateLoading || !aiGeneratePrompt.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-semibold">
                  {aiGenerateLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* AI EDIT MODE */}
          {aiEditMode && (
            <div className="mb-6 bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <Wand2 size={18} className="text-purple-600" />
                <h4 className="font-bold text-purple-900">AI Edit Mode</h4>
              </div>
              <p className="text-xs text-purple-700 mb-3">
                Examples: "Change sleeves to half" or "Make body red and sleeves blue"
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiEditPrompt}
                  onChange={(e) => setAiEditPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !aiEditLoading && handleAIEdit()}
                  placeholder="Describe your changes"
                  className="flex-1 px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:outline-none text-sm"
                  disabled={aiEditLoading}
                />
                <button
                  onClick={handleAIEdit}
                  disabled={aiEditLoading || !aiEditPrompt.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-semibold">
                  {aiEditLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Editing...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Edit
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div ref={containerRef} className="flex justify-center bg-gray-100 rounded-xl p-8">
            <svg
              ref={svgRef}
              viewBox={template.viewBox}
              className="w-full max-w-md"
              style={{ maxHeight: '600px' }}>
              <defs>
                {Object.entries(zonePatterns).map(([zoneId, pattern]) => (
                  <pattern
                    key={zoneId}
                    id={`pattern-${zoneId}`}
                    x="0"
                    y="0"
                    width="100"
                    height="100"
                    patternUnits="userSpaceOnUse">
                    <image href={pattern.url} width="100" height="100" />
                  </pattern>
                ))}
              </defs>

              {template.zones.map((zone) => {
                const sleeveVis = getSleeveVisibility(zone.id);
                return sleeveVis.visible && (
                  <path
                    key={zone.id}
                    d={zone.path}
                    fill={zonePatterns[zone.id] ? `url(#pattern-${zone.id})` : getZoneColor(zone.id)}
                    stroke={selectedZone === zone.id ? '#ec4899' : 'rgba(0,0,0,0.1)'}
                    strokeWidth={selectedZone === zone.id ? 3 : 1}
                    onClick={() => handleZoneClick(zone.id)}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: selectedZone === zone.id ? 0.9 : 1,
                      clipPath: sleeveVis.clipPath || 'none'
                    }}
                    className="hover:opacity-80"
                  />
                );
              })}
            </svg>
          </div>

          <div className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {template.zones.filter(zone => getSleeveVisibility(zone.id).visible).map(zone => (
                <button
                  key={zone.id}
                  onClick={() => handleZoneClick(zone.id)}
                  className={`p-3 rounded-lg border-2 transition-all text-xs font-semibold ${selectedZone === zone.id
                    ? 'border-secondary bg-secondary/5'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}>
                  {zone.label}
                </button>
              ))}
            </div>
          </div>

          {selectedZone && (
            <div className="mt-4 p-4 bg-secondary/5 rounded-lg border border-secondary/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-secondary" />
                <span className="text-sm font-semibold text-text">
                  Editing: {template.zones.find(z => z.id === selectedZone)?.label}
                </span>
              </div>
              <button
                onClick={clearZone}
                className="px-3 py-1.5 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-all text-xs font-semibold flex items-center gap-1">
                <Trash2 size={14} />
                <span>Clear</span>
              </button>
            </div>
          )}

          {Object.keys(embroideryMetadata).length > 0 && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-bold text-sm text-amber-900 mb-2">Applied Embroidery</h4>
              {Object.entries(embroideryMetadata).map(([zoneId, data]) => (
                <div key={zoneId} className="text-xs text-amber-800 mb-1">
                  {data.zoneName}: {EMBROIDERY_PATTERNS[data.type].name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tools Sidebar */}
        <div className={`
          ${isMobile ? 'fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300' : 'relative'}
          ${isMobile && !sidebarOpen ? 'translate-y-full' : 'translate-y-0'}
          bg-white rounded-t-2xl lg:rounded-xl shadow-xl border border-gray-200 
          ${isMobile ? 'max-h-[80vh] overflow-y-auto' : 'p-6'}
        `}>
          {isMobile && (
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <Settings className="text-secondary" size={20} />
                <h3 className="text-lg font-bold">Design Tools</h3>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
          )}

          {!isMobile && (
            <div className="flex items-center gap-3 pb-5 border-b">
              <Settings className="text-secondary" size={24} />
              <h3 className="text-xl font-bold">Design Tools</h3>
            </div>
          )}

          <div className={isMobile ? 'p-4 space-y-6' : 'space-y-6 mt-6'}>
            {/* AI Generate Button */}
            <button
              onClick={() => {
                setAiGenerateMode(!aiGenerateMode);
                setAiEditMode(false);
              }}
              className={`w-full px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${aiGenerateMode
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 hover:shadow-md'
                }`}>
              <Sparkles size={20} />
              <span>AI Design Generator</span>
            </button>

            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg text-xs">
              {['colors', 'styles', 'embroidery', 'prints'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-3 py-2 rounded-lg font-semibold transition-all capitalize ${activeTab === tab ? 'bg-secondary text-white' : 'text-gray-600'
                    }`}>
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'colors' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-sm uppercase text-gray-600 mb-3">Base Color</h4>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-4 mb-4">
                      <input
                        type="color"
                        value={currentColor}
                        onChange={(e) => {
                          setCurrentColor(e.target.value);
                          saveToHistory();
                        }}
                        className="w-16 h-16 rounded-lg cursor-pointer border-2 border-white shadow-md"
                      />
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Hex Code</label>
                        <input
                          type="text"
                          value={currentColor}
                          onChange={(e) => {
                            setCurrentColor(e.target.value);
                            saveToHistory();
                          }}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-secondary focus:outline-none font-mono text-sm"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => applyColorToAllZones(currentColor)}
                      className="w-full px-4 py-2.5 bg-secondary text-white rounded-lg hover:shadow-md transition-all font-semibold text-sm flex items-center justify-center gap-2">
                      <Palette size={16} />
                      Apply to All Zones
                    </button>

                    {selectedZone && (
                      <button
                        onClick={() => applyColorToZone(currentColor)}
                        className="w-full mt-2 px-4 py-2 bg-white border-2 border-secondary text-secondary rounded-lg hover:bg-secondary hover:text-white transition-all font-semibold text-sm">
                        Apply to {template.zones.find(z => z.id === selectedZone)?.label}
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm uppercase text-gray-600 mb-3">Color Presets</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {colorPresets.map(preset => (
                      <button
                        key={preset.color}
                        onClick={() => {
                          setCurrentColor(preset.color);
                          if (selectedZone) {
                            applyColorToZone(preset.color);
                          }
                          saveToHistory();
                        }}
                        className="aspect-square rounded-lg border-2 border-gray-200 hover:border-secondary hover:scale-110 transition-all shadow-sm"
                        style={{ backgroundColor: preset.color }}
                        title={preset.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'styles' && (
              <div className="space-y-6">
                {template.zones.some(z => z.id.includes('sleeve')) && (
                  <div>
                    <h4 className="font-bold text-sm uppercase text-gray-600 mb-3">Sleeve Length</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {sleeveOptions.map(style => (
                        <button
                          key={style.value}
                          onClick={() => {
                            setSleeveStyle(style.value);
                            if (style.value === 'sleeveless' && selectedZone && selectedZone.includes('sleeve')) {
                              setSelectedZone(null);
                            }
                            saveToHistory();
                          }}
                          className={`p-3 rounded-lg border-2 transition-all text-xs font-semibold ${sleeveStyle === style.value
                            ? 'border-secondary bg-secondary/5'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}>
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'embroidery' && (
              <div className="space-y-4">
                {selectedZone ? (
                  <>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-xs text-amber-800 font-semibold flex items-center gap-2">
                        <Info size={14} />
                        Select embroidery for {template.zones.find(z => z.id === selectedZone)?.label}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(EMBROIDERY_PATTERNS).map(([key, config]) => {
                        const patternCanvas = config.createPattern();
                        return (
                          <button
                            key={key}
                            onClick={() => applyEmbroidery(key)}
                            className="group p-4 rounded-lg border-2 border-gray-200 hover:border-secondary hover:shadow-md transition-all flex items-center gap-4">
                            <div className="w-14 h-14 rounded-lg border-2 border-gray-200 overflow-hidden bg-white">
                              <img src={patternCanvas.toDataURL()} alt={config.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="text-left flex-1">
                              <div className="text-sm font-semibold text-text mb-1">{config.name}</div>
                              <div className="text-xs text-text/60">{config.note}</div>
                            </div>
                            <CheckCircle2 size={18} className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Move size={40} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-gray-500">Select a zone first</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'prints' && (
              <div className="space-y-4">
                {selectedZone ? (
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(FABRIC_PRINTS).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => applyFabricPrint(key)}
                        className="group p-4 rounded-lg border-2 border-gray-200 hover:border-secondary hover:shadow-md transition-all flex items-center gap-4">
                        <div className="w-14 h-14 rounded-lg border-2 border-gray-200 overflow-hidden bg-white">
                          <img src={config.img} alt={config.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="text-sm font-semibold text-text">{config.name}</div>
                          <div className="text-xs text-text/60">{config.description}</div>
                        </div>
                        <CheckCircle2 size={18} className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Move size={40} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-gray-500">Select a zone first</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignCanvas;