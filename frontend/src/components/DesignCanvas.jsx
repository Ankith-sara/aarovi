import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Palette, Trash2, Undo, Redo,
  Move, Info, Settings, CheckCircle2, X, Menu, Wand2, Lightbulb, AlertTriangle, Send, Sparkles
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

  // AI Helper States
  const [aiHelperMode, setAiHelperMode] = useState(false);
  const [aiHelperPrompt, setAiHelperPrompt] = useState('');
  const [aiHelperLoading, setAiHelperLoading] = useState(false);
  const [aiHelperResponse, setAiHelperResponse] = useState(null);

  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const template = {
    ...SVG_TEMPLATES[dressType],
    zones: getEssentialZones(SVG_TEMPLATES[dressType]?.zones || [])
  };

  // AI HELPER CORE LOGIC
  const analyzeColorHarmony = () => {
    const colors = Object.values(zoneColors).filter(Boolean);
    if (colors.length === 0) return { harmony: 'neutral', issues: [] };

    const issues = [];
    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    const getBrightness = (hex) => {
      const { r, g, b } = hexToRgb(hex);
      return (r * 299 + g * 587 + b * 114) / 1000;
    };

    // Check contrast
    const uniqueColors = [...new Set(colors)];
    if (uniqueColors.length > 1) {
      const brightnesses = uniqueColors.map(getBrightness);
      const maxBright = Math.max(...brightnesses);
      const minBright = Math.min(...brightnesses);
      
      if (maxBright - minBright < 50) {
        issues.push('Colors have low contrast - design may look flat');
      }
    }

    // Check if too many colors
    if (uniqueColors.length > 4) {
      issues.push('Too many different colors - consider reducing to 2-3 main colors');
    }

    // Check for white on white
    if (colors.includes('#FFFFFF') || colors.includes('#ffffff')) {
      issues.push('White zones may not be visible on light backgrounds');
    }

    return {
      harmony: issues.length === 0 ? 'good' : 'needs_improvement',
      issues
    };
  };

  const analyzeFabricSuitability = () => {
    const issues = [];
    const suggestions = [];

    // Check fabric vs embroidery
    const hasHeavyEmbroidery = Object.values(embroideryMetadata).some(
      m => m.density === 'high'
    );

    if (hasHeavyEmbroidery) {
      if (fabric === 'Cotton') {
        issues.push('Cotton may not support heavy Maggam embroidery well');
        suggestions.push('Consider upgrading to Silk or Georgette for heavy embroidery');
      }
    }

    // Check sleeve style vs fabric
    if (sleeveStyle === 'full') {
      if (fabric === 'Silk') {
        suggestions.push('Full sleeves in Silk are elegant but may feel warm');
      }
    }

    // Gender-specific checks
    if (gender === 'Women' && fabric === 'Cotton' && !hasHeavyEmbroidery) {
      suggestions.push('Light cotton works well for daily wear');
    }

    return { issues, suggestions };
  };

  const analyzeEmbroideryPlacement = () => {
    const issues = [];
    const suggestions = [];

    const embroideryZones = Object.keys(embroideryMetadata);

    if (embroideryZones.length === 0) {
      suggestions.push('Consider adding embroidery to neckline or sleeves for elegance');
      return { issues, suggestions };
    }

    // Check if embroidery is only on body
    const onlyBody = embroideryZones.every(z => z === 'body');
    if (onlyBody && embroideryZones.length === 1) {
      suggestions.push('Add matching embroidery to neckline or sleeves for balance');
    }

    // Check for excessive embroidery
    if (embroideryZones.length > 3) {
      issues.push('Too much embroidery may overwhelm the design');
    }

    // Check heavy embroidery on sleeves
    const sleeveEmbroidery = embroideryZones.filter(z => z.includes('sleeve'));
    if (sleeveEmbroidery.length > 0) {
      const hasHeavy = sleeveEmbroidery.some(z => 
        embroideryMetadata[z]?.density === 'high'
      );
      if (hasHeavy) {
        issues.push('Heavy embroidery on sleeves may restrict movement');
      }
    }

    return { issues, suggestions };
  };

  const generateColorSuggestions = () => {
    const suggestions = [];
    const currentColors = Object.values(zoneColors).filter(Boolean);

    if (currentColors.length === 0) return suggestions;

    const dominant = currentColors[0];
    
    // Suggest complementary colors
    const colorName = Object.keys(COLOR_MAP).find(k => COLOR_MAP[k] === dominant);
    
    if (colorName) {
      switch(colorName) {
        case 'red':
          suggestions.push('Gold accents would complement red beautifully');
          suggestions.push('Consider cream or beige for contrast zones');
          break;
        case 'blue':
          suggestions.push('Silver or white embroidery works well with blue');
          suggestions.push('Yellow or gold accents create royal contrast');
          break;
        case 'green':
          suggestions.push('Gold embroidery is traditional with green');
          suggestions.push('Maroon accents add richness');
          break;
        case 'pink':
          suggestions.push('Silver or white details enhance pink elegance');
          suggestions.push('Purple accents create depth');
          break;
        default:
          suggestions.push('Consider adding contrasting accent color');
      }
    }

    return suggestions;
  };

  const generatePremiumUpgrade = () => {
    const hasEmbroidery = Object.keys(embroideryMetadata).length > 0;
    const hasPrints = Object.keys(zonePatterns).some(z => zonePatterns[z].type === 'print');

    if (!hasEmbroidery && !hasPrints) {
      return 'Add Maggam work on neckline with matching Kalamkari print on body for a premium look';
    }

    if (hasEmbroidery && !hasPrints) {
      return 'Complement embroidery with subtle Bagru print for a fusion aesthetic';
    }

    if (!hasEmbroidery && hasPrints) {
      return 'Add delicate thread work on borders to elevate the printed fabric';
    }

    return 'Consider adding Swarovski crystals to embroidery for bridal finish';
  };

  const getTailoringTip = () => {
    const tips = [];

    if (sleeveStyle === 'sleeveless') {
      tips.push('Sleeveless designs need precise armhole finishing');
    }

    if (sleeveStyle === 'full' && fabric === 'Silk') {
      tips.push('Full silk sleeves should have proper lining to prevent sliding');
    }

    const hasHeavyEmbroidery = Object.values(embroideryMetadata).some(
      m => m.density === 'high'
    );

    if (hasHeavyEmbroidery) {
      tips.push('Heavy embroidery requires interfacing for shape retention');
    }

    if (dressType === 'Kurta' && gender === 'Women') {
      tips.push('Ensure side slits for comfortable movement');
    }

    return tips.length > 0 ? tips[0] : 'Standard stitching techniques apply';
  };

  const buildAIHelperPrompt = () => {
    const colorAnalysis = analyzeColorHarmony();
    const fabricAnalysis = analyzeFabricSuitability();
    const embroideryAnalysis = analyzeEmbroideryPlacement();

    return {
      currentDesign: {
        garment: dressType,
        gender,
        fabric,
        baseColor: currentColor,
        sleeveStyle,
        zones: Object.entries(zoneColors).map(([z, c]) => ({ zone: z, color: c })),
        embroidery: Object.values(embroideryMetadata),
        prints: Object.entries(zonePatterns).map(([z, p]) => ({ zone: z, type: p.type }))
      },
      analysis: {
        colorAnalysis,
        fabricAnalysis,
        embroideryAnalysis
      },
      userQuestion: aiHelperPrompt
    };
  };

  const processAIHelperResponse = (promptData) => {
    const { currentDesign, analysis, userQuestion } = promptData;
    
    const response = {
      verdict: 'good',
      issues: [],
      suggestions: [],
      color_advice: [],
      fabric_advice: '',
      tailoring_tip: '',
      premium_upgrade: ''
    };

    // Aggregate issues
    response.issues = [
      ...analysis.colorAnalysis.issues,
      ...analysis.fabricAnalysis.issues,
      ...analysis.embroideryAnalysis.issues
    ];

    // Determine verdict
    if (response.issues.length > 2) {
      response.verdict = 'needs_improvement';
    } else if (response.issues.length > 0) {
      response.verdict = 'good_with_notes';
    }

    // Aggregate suggestions
    response.suggestions = [
      ...analysis.fabricAnalysis.suggestions,
      ...analysis.embroideryAnalysis.suggestions
    ];

    // Color advice
    response.color_advice = generateColorSuggestions();

    // Fabric advice
    if (analysis.fabricAnalysis.suggestions.length > 0) {
      response.fabric_advice = analysis.fabricAnalysis.suggestions[0];
    } else {
      response.fabric_advice = `${currentDesign.fabric} is suitable for this ${currentDesign.garment} design`;
    }

    // Tailoring tip
    response.tailoring_tip = getTailoringTip();

    // Premium upgrade
    response.premium_upgrade = generatePremiumUpgrade();

    // Context-aware responses to user question
    const lowerQuestion = userQuestion.toLowerCase();

    if (lowerQuestion.includes('wedding') || lowerQuestion.includes('bridal')) {
      response.suggestions.unshift('For weddings, consider heavier fabric and more embroidery');
      response.premium_upgrade = 'Add Zardozi work with stone embellishments for bridal luxury';
    }

    if (lowerQuestion.includes('casual') || lowerQuestion.includes('daily')) {
      response.suggestions.unshift('For daily wear, keep embroidery minimal and choose breathable fabric');
      if (currentDesign.fabric === 'Silk') {
        response.issues.push('Silk may be too formal for casual/daily wear');
      }
    }

    if (lowerQuestion.includes('summer') || lowerQuestion.includes('hot')) {
      response.suggestions.unshift('Choose cotton or linen for summer comfort');
      if (currentDesign.sleeveStyle === 'full') {
        response.suggestions.push('Consider 3/4 or short sleeves for better ventilation');
      }
    }

    if (lowerQuestion.includes('winter') || lowerQuestion.includes('cold')) {
      response.suggestions.unshift('Full sleeves and layered fabric work well in winter');
    }

    if (lowerQuestion.includes('office') || lowerQuestion.includes('work')) {
      response.suggestions.unshift('Keep colors professional and embroidery subtle for office wear');
    }

    if (lowerQuestion.includes('party') || lowerQuestion.includes('festive')) {
      response.suggestions.unshift('Bold colors and statement embroidery work well for parties');
    }

    return response;
  };

  const handleAIHelper = () => {
    if (!aiHelperPrompt.trim()) {
      alert('Please describe your design context or ask a question');
      return;
    }

    setAiHelperLoading(true);

    // Simulate processing delay
    setTimeout(() => {
      const promptData = buildAIHelperPrompt();
      const response = processAIHelperResponse(promptData);
      setAiHelperResponse(response);
      setAiHelperLoading(false);
    }, 1500);
  };

  // Regular functions
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
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getSleeveVisibility = (zoneId) => {
    if (!zoneId.includes('sleeve')) return { visible: true, clipPath: null };
    switch (sleeveStyle) {
      case 'full': return { visible: true, clipPath: null };
      case 'elbow': return { visible: true, clipPath: 'inset(0 0 25% 0)' };
      case 'short': return { visible: true, clipPath: 'inset(0 0 50% 0)' };
      case 'sleeveless': return { visible: false, clipPath: null };
      default: return { visible: true, clipPath: null };
    }
  };

  const saveToHistory = useCallback(() => {
    const state = { zoneColors, zonePatterns, embroideryMetadata, currentColor, sleeveStyle };
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(state);
      return newHistory.slice(-50);
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [zoneColors, zonePatterns, embroideryMetadata, currentColor, sleeveStyle, historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const state = history[historyIndex - 1];
      setZoneColors(state.zoneColors);
      setZonePatterns(state.zonePatterns);
      setEmbroideryMetadata(state.embroideryMetadata);
      setCurrentColor(state.currentColor);
      setSleeveStyle(state.sleeveStyle);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const state = history[historyIndex + 1];
      setZoneColors(state.zoneColors);
      setZonePatterns(state.zonePatterns);
      setEmbroideryMetadata(state.embroideryMetadata);
      setCurrentColor(state.currentColor);
      setSleeveStyle(state.sleeveStyle);
      setHistoryIndex(historyIndex + 1);
    }
  };

  useEffect(() => {
    if (history.length === 0) saveToHistory();
  }, []);

  const getZoneColor = (zoneId) => zoneColors[zoneId] || currentColor;

  const applyEmbroidery = (patternKey) => {
    if (!selectedZone) return;
    const pattern = EMBROIDERY_PATTERNS[patternKey];
    if (!pattern) return;

    setEmbroideryMetadata(prev => ({
      ...prev,
      [selectedZone]: {
        type: patternKey,
        zone: selectedZone,
        zoneName: template.zones.find(z => z.id === selectedZone)?.label,
        density: pattern.density,
        threadColor: pattern.threadColors[0],
        appliedAt: new Date().toISOString()
      }
    }));

    const patternCanvas = pattern.createPattern(pattern.threadColors[0]);
    setZonePatterns(prev => ({
      ...prev,
      [selectedZone]: { type: 'embroidery', url: patternCanvas.toDataURL() }
    }));

    saveToHistory();
    if (isMobile) setSidebarOpen(false);
  };

  const applyFabricPrint = (printKey) => {
    if (!selectedZone) return;
    const print = FABRIC_PRINTS[printKey];
    if (!print) return;

    const patternCanvas = print.createPattern();
    setZonePatterns(prev => ({
      ...prev,
      [selectedZone]: { type: 'print', url: patternCanvas.toDataURL() }
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

  const colorPresets = [
    { name: 'Red', color: '#DC2626' },
    { name: 'Pink', color: '#EC4899' },
    { name: 'Purple', color: '#A855F7' },
    { name: 'Blue', color: '#3B82F6' },
    { name: 'Green', color: '#10B981' },
    { name: 'Gold', color: '#D4AF37' }
  ];

  const sleeveOptions = [
    { value: 'full', label: 'Full Sleeve' },
    { value: 'elbow', label: '3/4 Sleeve' },
    { value: 'short', label: 'Short Sleeve' },
    { value: 'sleeveless', label: 'Sleeveless' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Palette size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Design Canvas</h3>
                  <p className="text-sm text-gray-600">{dressType}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-30 transition-all"
                  title="Undo">
                  <Undo size={18} />
                </button>
                <button
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-30 transition-all"
                  title="Redo">
                  <Redo size={18} />
                </button>
                <button
                  onClick={() => {
                    setAiHelperMode(!aiHelperMode);
                  }}
                  className={`p-2 rounded-lg transition-all ${
                    aiHelperMode
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                  title="AI Design Helper">
                  <Lightbulb size={18} />
                </button>
              </div>
            </div>

            {/* AI HELPER MODE */}
            {aiHelperMode && (
              <div className="mb-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb size={20} className="text-blue-600" />
                  <h4 className="font-bold text-blue-900">AI Design Helper</h4>
                </div>
                <p className="text-sm text-blue-700 mb-4">
                  Get expert suggestions based on your current design. Ask about occasions, fabric choices, or styling advice.
                </p>
                
                <div className="bg-white rounded-lg p-3 mb-3 border border-blue-100">
                  <p className="text-xs text-gray-600 mb-2 font-semibold">Example questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Is this good for a wedding?', 'Suggest summer colors', 'Any tailoring tips?'].map(q => (
                      <button
                        key={q}
                        onClick={() => setAiHelperPrompt(q)}
                        className="text-xs px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-full text-blue-700 transition-all">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiHelperPrompt}
                    onChange={(e) => setAiHelperPrompt(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !aiHelperLoading && handleAIHelper()}
                    placeholder="e.g., Is this suitable for a wedding?"
                    className="flex-1 px-4 py-2.5 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none text-sm"
                    disabled={aiHelperLoading}
                  />
                  <button
                    onClick={handleAIHelper}
                    disabled={aiHelperLoading || !aiHelperPrompt.trim()}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-semibold transition-all">
                    {aiHelperLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Ask AI
                      </>
                    )}
                  </button>
                </div>

                {/* AI RESPONSE */}
                {aiHelperResponse && (
                  <div className="mt-4 bg-white rounded-lg p-4 border-2 border-blue-100 shadow-sm space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      {aiHelperResponse.verdict === 'good' && (
                        <CheckCircle2 size={20} className="text-green-600" />
                      )}
                      {aiHelperResponse.verdict === 'needs_improvement' && (
                        <AlertTriangle size={20} className="text-orange-600" />
                      )}
                      {aiHelperResponse.verdict === 'good_with_notes' && (
                        <Info size={20} className="text-blue-600" />
                      )}
                      <span className="font-bold text-gray-900 capitalize">
                        {aiHelperResponse.verdict.replace('_', ' ')}
                      </span>
                    </div>

                    {aiHelperResponse.issues?.length > 0 && (
                      <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                        <p className="font-semibold text-red-900 text-sm mb-2 flex items-center gap-2">
                          <AlertTriangle size={16} />
                          Issues to Address
                        </p>
                        <ul className="space-y-1">
                          {aiHelperResponse.issues.map((issue, idx) => (
                            <li key={idx} className="text-sm text-red-800 flex items-start gap-2">
                              <span className="text-red-600 mt-0.5">•</span>
                              <span>{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {aiHelperResponse.suggestions?.length > 0 && (
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <p className="font-semibold text-green-900 text-sm mb-2 flex items-center gap-2">
                          <Lightbulb size={16} />
                          Suggestions
                        </p>
                        <ul className="space-y-1">
                          {aiHelperResponse.suggestions.map((suggestion, idx) => (
                            <li key={idx} className="text-sm text-green-800 flex items-start gap-2">
                              <span className="text-green-600 mt-0.5">✓</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {aiHelperResponse.color_advice?.length > 0 && (
                      <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                        <p className="font-semibold text-purple-900 text-sm mb-2 flex items-center gap-2">
                          <Palette size={16} />
                          Color Recommendations
                        </p>
                        <ul className="space-y-1">
                          {aiHelperResponse.color_advice.map((advice, idx) => (
                            <li key={idx} className="text-sm text-purple-800">
                              {advice}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {aiHelperResponse.fabric_advice && (
                      <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                        <p className="font-semibold text-amber-900 text-sm mb-1">Fabric Notes</p>
                        <p className="text-sm text-amber-800">{aiHelperResponse.fabric_advice}</p>
                      </div>
                    )}

                    {aiHelperResponse.tailoring_tip && (
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <p className="font-semibold text-gray-900 text-sm mb-1">Tailoring Tip</p>
                        <p className="text-sm text-gray-700">{aiHelperResponse.tailoring_tip}</p>
                      </div>
                    )}

                    {aiHelperResponse.premium_upgrade && (
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 border border-yellow-300">
                        <p className="font-semibold text-yellow-900 text-sm mb-1 flex items-center gap-2">
                          <Sparkles size={16} />
                          Premium Upgrade Idea
                        </p>
                        <p className="text-sm text-yellow-800 italic">{aiHelperResponse.premium_upgrade}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* SVG CANVAS */}
            <div className="flex justify-center bg-gray-100 rounded-xl p-8">
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
                      onClick={() => setSelectedZone(zone.id)}
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

            {/* ZONE SELECTOR */}
            <div className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {template.zones.filter(zone => getSleeveVisibility(zone.id).visible).map(zone => (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedZone(zone.id)}
                    className={`p-3 rounded-lg border-2 transition-all text-xs font-semibold ${
                      selectedZone === zone.id
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    {zone.label}
                  </button>
                ))}
              </div>
            </div>

            {selectedZone && (
              <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-purple-600" />
                  <span className="text-sm font-semibold text-gray-900">
                    Editing: {template.zones.find(z => z.id === selectedZone)?.label}
                  </span>
                </div>
                <button
                  onClick={clearZone}
                  className="px-3 py-1.5 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-all text-xs font-semibold flex items-center gap-1">
                  <Trash2 size={14} />
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* TOOLS SIDEBAR */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 pb-5 border-b">
              <Settings className="text-purple-600" size={24} />
              <h3 className="text-xl font-bold">Design Tools</h3>
            </div>

            <div className="space-y-6 mt-6">
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg text-xs">
                {['colors', 'styles', 'embroidery', 'prints'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-3 py-2 rounded-lg font-semibold transition-all capitalize ${
                      activeTab === tab ? 'bg-purple-600 text-white' : 'text-gray-600'
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
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none font-mono text-sm"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => applyColorToAllZones(currentColor)}
                        className="w-full px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:shadow-md transition-all font-semibold text-sm flex items-center justify-center gap-2">
                        <Palette size={16} />
                        Apply to All Zones
                      </button>

                      {selectedZone && (
                        <button
                          onClick={() => applyColorToZone(currentColor)}
                          className="w-full mt-2 px-4 py-2 bg-white border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-all font-semibold text-sm">
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
                          className="aspect-square rounded-lg border-2 border-gray-200 hover:border-purple-600 hover:scale-110 transition-all shadow-sm"
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
                  <div>
                    <h4 className="font-bold text-sm uppercase text-gray-600 mb-3">Sleeve Length</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {sleeveOptions.map(style => (
                        <button
                          key={style.value}
                          onClick={() => {
                            setSleeveStyle(style.value);
                            saveToHistory();
                          }}
                          className={`p-3 rounded-lg border-2 transition-all text-xs font-semibold ${
                            sleeveStyle === style.value
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>
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
                              className="group p-4 rounded-lg border-2 border-gray-200 hover:border-purple-600 hover:shadow-md transition-all flex items-center gap-4">
                              <div className="w-14 h-14 rounded-lg border-2 border-gray-200 overflow-hidden bg-white">
                                <img src={patternCanvas.toDataURL()} alt={config.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="text-left flex-1">
                                <div className="text-sm font-semibold text-gray-900 mb-1">{config.name}</div>
                                <div className="text-xs text-gray-600">{config.note}</div>
                              </div>
                              <CheckCircle2 size={18} className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                          className="group p-4 rounded-lg border-2 border-gray-200 hover:border-purple-600 hover:shadow-md transition-all flex items-center gap-4">
                          <div className="w-14 h-14 rounded-lg border-2 border-gray-200 overflow-hidden bg-white">
                            <img src={config.img} alt={config.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="text-left flex-1">
                            <div className="text-sm font-semibold text-gray-900">{config.name}</div>
                            <div className="text-xs text-gray-600">{config.description}</div>
                          </div>
                          <CheckCircle2 size={18} className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
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
    </div>
  );
};

export default DesignCanvas;