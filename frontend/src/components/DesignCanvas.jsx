import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Palette, Trash2, Undo, Redo, Info, CheckCircle2, X, Menu,
  Wand2, Upload, Grid, Sparkles, Image as ImageIcon, Ruler, ShirtIcon, Move,
  MessageSquare, Lightbulb, Send, Bot, Zap
} from 'lucide-react';
import {
  SVG_TEMPLATES,
  EMBROIDERY_PATTERNS as IMPORTED_EMBROIDERY,
  FABRIC_PRINTS as IMPORTED_PRINTS,
  PRINT_CATEGORIES, getPrintsByCategory
} from '../data/svg_templates';
import { toast } from 'react-toastify';

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
    anarkali: ['bodice', 'waist_band', 'upper_flare', 'lower_flare', 'border', 'skirt']
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

  const [activeTab, setActiveTab] = useState('fabric-fit');
  const [printMode, setPrintMode] = useState('browse');
  const [printCategory, setPrintCategory] = useState('floral');
  const [selectedZone, setSelectedZone] = useState(null);
  const [zoneColors, setZoneColors] = useState({});
  const [zonePatterns, setZonePatterns] = useState({});
  const [embroideryMetadata, setEmbroideryMetadata] = useState({});
  const [printMetadata, setPrintMetadata] = useState({});
  const [embroideryColor, setEmbroideryColor] = useState('#000000');
  const [printColor, setPrintColor] = useState('#000000');
  const [fabricColor, setFabricColor] = useState(selectedColor);
  const [colorMode, setColorMode] = useState('full'); // 'full' or 'zone'
  const [sleeveStyle, setSleeveStyle] = useState('full');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [aiPrintPrompt, setAiPrintPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [generatedPrint, setGeneratedPrint] = useState(null);
  const [printScale, setPrintScale] = useState(5);
  const [printRepeat, setPrintRepeat] = useState('tile');
  const [printRotation, setPrintRotation] = useState(0);
  const [uploadedPrint, setUploadedPrint] = useState(null);
  const [uploadFitOption, setUploadFitOption] = useState('full');
  const [uploadRepeat, setUploadRepeat] = useState('tile');
  const [aiImagePrompt, setAiImagePrompt] = useState('');
  const [aiImageGenerating, setAiImageGenerating] = useState(false);
  const [generatedReferenceImages, setGeneratedReferenceImages] = useState([]);
  const [aiHelperExpanded, setAiHelperExpanded] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Get template
  const rawTemplate = SVG_TEMPLATES[dressType] || SVG_TEMPLATES.Kurta;
  const template = {
    ...rawTemplate,
    zones: getEssentialZones(rawTemplate.zones, dressType)
  };

  // Print Categories
  const printCategories = [
    { id: 'floral', label: 'Floral' },
    { id: 'ethnic', label: 'Ethnic' },
    { id: 'abstract', label: 'Abstract' },
    { id: 'minimal', label: 'Minimal' },
    { id: 'stripes', label: 'Stripes' },
    { id: 'checks', label: 'Checks' },
    { id: 'ikat', label: 'Ikat' }
  ];

  // Embroidery Styles
  const embroideryStyles = Object.keys(IMPORTED_EMBROIDERY).map(key => ({
    id: key,
    label: IMPORTED_EMBROIDERY[key].name,
    pattern: key
  }));

  // Sleeve Options
  const sleeveOptions = [
    { value: 'full', label: 'Full Sleeve' },
    { value: 'elbow', label: '3/4 Sleeve' },
    { value: 'short', label: 'Short Sleeve' },
    { value: 'sleeveless', label: 'Sleeveless' }
  ];

  // Color Presets
  const colorPresets = [
    { name: 'Red', color: '#DC2626' },
    { name: 'Pink', color: '#EC4899' },
    { name: 'Blue', color: '#3B82F6' },
    { name: 'Green', color: '#10B981' },
    { name: 'Indigo', color: '#6366F1' },
    { name: 'White', color: '#FFFFFF' },
    { name: 'Black', color: '#1F2937' },
    { name: 'Gold', color: '#D4AF37' }
  ];

  // Initialize
  useEffect(() => {
    if (!initialized && template.zones.length > 0) {
      const initialColors = {};
      template.zones.forEach(zone => {
        initialColors[zone.id] = fabricColor;
      });
      setZoneColors(initialColors);
      setInitialized(true);
    }
  }, [initialized, template.zones, fabricColor]);

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

  // Sleeve Visibility
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

  // History Management
  const saveToHistory = useCallback(() => {
    const state = {
      zoneColors: { ...zoneColors },
      zonePatterns: { ...zonePatterns },
      embroideryMetadata: { ...embroideryMetadata },
      printMetadata: { ...printMetadata },
      fabricColor,
      sleeveStyle,
      embroideryColor,
      printColor,
      colorMode
    };

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(state);
      return newHistory.slice(-50);
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [zoneColors, zonePatterns, embroideryMetadata, printMetadata, fabricColor, sleeveStyle, embroideryColor, printColor, colorMode, historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];

      setZoneColors(state.zoneColors);
      setZonePatterns(state.zonePatterns);
      setEmbroideryMetadata(state.embroideryMetadata);
      setPrintMetadata(state.printMetadata);
      setFabricColor(state.fabricColor);
      setSleeveStyle(state.sleeveStyle);
      setEmbroideryColor(state.embroideryColor);
      setPrintColor(state.printColor);
      setColorMode(state.colorMode);
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
      setPrintMetadata(state.printMetadata);
      setFabricColor(state.fabricColor);
      setSleeveStyle(state.sleeveStyle);
      setEmbroideryColor(state.embroideryColor);
      setPrintColor(state.printColor);
      setColorMode(state.colorMode);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  useEffect(() => {
    if (history.length === 0) {
      saveToHistory();
    }
  }, []);

  // AI HELPER FUNCTIONS
  const getAiSuggestions = async () => {
    setAiLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const suggestions = [
        {
          type: 'color',
          title: 'Bold Red',
          icon: '🔴',
          action: () => {
            applyFabricColor('#DC2626');
            toast.success('Applied red color');
          }
        },
        {
          type: 'color',
          title: 'Gold Thread',
          icon: '✨',
          action: () => {
            setEmbroideryColor('#FFD700');
            toast.success('Gold embroidery set');
            saveToHistory();
          }
        },
        {
          type: 'pattern',
          title: 'Neckline Embroidery',
          icon: '💫',
          action: () => {
            const necklineZone = template.zones.find(z => z.id.includes('neckline') || z.id.includes('neck'));
            if (necklineZone) {
              setSelectedZone(necklineZone.id);
              setActiveTab('prints-embroidery');
              setPrintMode('embroidery');
              toast.info('Neckline selected');
            }
          }
        },
        {
          type: 'style',
          title: 'Full Sleeves',
          icon: '👔',
          action: () => {
            setSleeveStyle('full');
            toast.success('Changed to full sleeves');
            saveToHistory();
          }
        },
        {
          type: 'combination',
          title: 'Festive Look',
          icon: '🎉',
          action: () => {
            applyFabricColor('#DC2626');
            setEmbroideryColor('#FFD700');
            toast.success('Festive design applied');
            setTimeout(() => {
              toast.info('Select zones to add embroidery');
              setActiveTab('prints-embroidery');
              setPrintMode('embroidery');
            }, 1000);
          }
        }
      ];

      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('AI suggestion error:', error);
      toast.error('Failed to get suggestions');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiQuery = async () => {
    if (!userQuery.trim()) return;

    const newMessage = {
      type: 'user',
      text: userQuery,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, newMessage]);
    const currentQuery = userQuery;
    setUserQuery('');
    setAiLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      let response = '';
      const query = currentQuery.toLowerCase();

      // COLOR CHANGE COMMANDS
      if (query.includes('change') && query.includes('color')) {
        if (query.includes('red')) {
          applyFabricColor('#DC2626');
          response = `I've changed your fabric color to red (#DC2626). Red is perfect for festive occasions.`;
          saveToHistory();
        } else if (query.includes('blue')) {
          applyFabricColor('#3B82F6');
          response = `I've changed your fabric color to blue (#3B82F6). Blue creates an elegant look.`;
          saveToHistory();
        } else if (query.includes('green')) {
          applyFabricColor('#10B981');
          response = `I've changed your fabric color to green (#10B981). Green is refreshing and versatile.`;
          saveToHistory();
        } else if (query.includes('pink')) {
          applyFabricColor('#EC4899');
          response = `I've changed your fabric color to pink (#EC4899). Pink is feminine and elegant.`;
          saveToHistory();
        } else if (query.includes('yellow') || query.includes('gold')) {
          applyFabricColor('#F59E0B');
          response = `I've changed your fabric color to golden yellow (#F59E0B). This creates a regal look.`;
          saveToHistory();
        } else if (query.includes('white')) {
          applyFabricColor('#FFFFFF');
          response = `I've changed your fabric color to white (#FFFFFF). White is classic and versatile.`;
          saveToHistory();
        } else if (query.includes('black')) {
          applyFabricColor('#1F2937');
          response = `I've changed your fabric color to black (#1F2937). Black is sophisticated and timeless.`;
          saveToHistory();
        } else {
          response = `I can change colors! Try: "change color to red", "change color to blue", etc.`;
        }
      }
      // MAKE IT RED COMMAND
      else if ((query.includes('make') || query.includes('set')) && query.includes('red')) {
        applyFabricColor('#DC2626');
        response = `Done! I've made your ${dressType} red. This vibrant color is perfect for celebrations.`;
        saveToHistory();
      }
      // ADD EMBROIDERY
      else if ((query.includes('add') || query.includes('apply')) && query.includes('embroidery')) {
        const necklineZone = template.zones.find(z => z.id.includes('neckline') || z.id.includes('neck'));
        if (necklineZone) {
          setSelectedZone(necklineZone.id);
          response = `I've selected the neckline. Go to "Prints & Embroidery" tab to choose embroidery style.`;
          setActiveTab('prints-embroidery');
          setPrintMode('embroidery');
        } else {
          response = `Please select a zone first, then I can help you apply embroidery.`;
        }
      }
      // SLEEVE COMMANDS
      else if (query.includes('sleeve')) {
        if (query.includes('full') || query.includes('long')) {
          setSleeveStyle('full');
          response = `Changed to full sleeves - traditional and elegant.`;
          saveToHistory();
        } else if (query.includes('short')) {
          setSleeveStyle('short');
          response = `Changed to short sleeves - modern and casual.`;
          saveToHistory();
        } else if (query.includes('3/4') || query.includes('elbow')) {
          setSleeveStyle('elbow');
          response = `Changed to 3/4 sleeves - versatile and flattering.`;
          saveToHistory();
        } else if (query.includes('sleeveless')) {
          setSleeveStyle('sleeveless');
          response = `Changed to sleeveless - contemporary and bold.`;
          saveToHistory();
        } else {
          response = `Available sleeve options: full, short, 3/4, or sleeveless.`;
        }
      }
      // DEFAULT
      else {
        response = `I can help with:\n• Colors - "change color to red"\n• Embroidery - "add gold embroidery"\n• Sleeves - "change to full sleeves"\n• Designs - "suggest a festive look"`;
      }

      const aiMessage = {
        type: 'ai',
        text: response,
        timestamp: new Date()
      };

      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI query error:', error);
      toast.error('Failed to get AI response');
    } finally {
      setAiLoading(false);
    }
  };

  // Auto-generate suggestions
  useEffect(() => {
    if (Object.keys(zoneColors).length > 0 && aiSuggestions.length === 0) {
      getAiSuggestions();
    }
  }, [dressType, fabricColor]);

  // Zone Interaction
  const handleZoneClick = (zoneId) => {
    setSelectedZone(zoneId);
  };

  const getZoneColor = (zoneId) => {
    return zoneColors[zoneId] || fabricColor;
  };

  // Fabric Tab Functions - MODIFIED TO SUPPORT BOTH MODES
  const applyFabricColor = (color) => {
    setFabricColor(color);
    
    if (colorMode === 'full') {
      // Apply to all zones
      const updatedColors = {};
      template.zones.forEach(zone => {
        updatedColors[zone.id] = color;
      });
      setZoneColors(updatedColors);
      toast.success('Color applied to full garment');
    } else if (colorMode === 'zone' && selectedZone) {
      // Apply to selected zone only
      setZoneColors(prev => ({
        ...prev,
        [selectedZone]: color
      }));
      toast.success(`Color applied to ${template.zones.find(z => z.id === selectedZone)?.label}`);
    } else if (colorMode === 'zone' && !selectedZone) {
      toast.warning('Please select a zone first');
      return;
    }
    
    saveToHistory();
  };

  // Print Tab Functions
  const applyBrowsePrint = (printKey) => {
    if (!selectedZone) {
      toast.warning('Please select a zone first');
      return;
    }

    const print = IMPORTED_PRINTS[printKey];
    if (!print || !print.createPattern) {
      toast.error('Print pattern not available');
      return;
    }

    try {
      const canvas = print.createPattern(printColor);
      const url = canvas.toDataURL('image/png');

      setZonePatterns(prev => ({
        ...prev,
        [selectedZone]: {
          type: 'print',
          key: printKey,
          url,
          color: printColor
        }
      }));

      setPrintMetadata(prev => ({
        ...prev,
        [selectedZone]: {
          type: print.name,
          zone: selectedZone,
          zoneName: template.zones.find(z => z.id === selectedZone)?.label,
          printColor: printColor,
          appliedAt: new Date().toISOString()
        }
      }));

      saveToHistory();
    } catch (error) {
      console.error('Error applying print:', error);
      toast.error('Failed to apply print');
    }
  };

  const handleAIGeneratePrint = async () => {
    if (!aiPrintPrompt.trim()) {
      toast.error('Please describe your desired print');
      return;
    }

    setAiGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const printKeys = Object.keys(IMPORTED_PRINTS);
      const randomPrint = printKeys[Math.floor(Math.random() * printKeys.length)];
      const print = IMPORTED_PRINTS[randomPrint];

      const canvas = print.createPattern(printColor);
      setGeneratedPrint({
        url: canvas.toDataURL('image/png'),
        key: randomPrint
      });

      toast.success('Print generated!');
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error('Failed to generate print');
    } finally {
      setAiGenerating(false);
    }
  };

  const applyGeneratedPrint = () => {
    if (!selectedZone || !generatedPrint) {
      toast.warning('Select zone and generate print first');
      return;
    }

    setZonePatterns(prev => ({
      ...prev,
      [selectedZone]: {
        type: 'print',
        key: 'ai-generated',
        url: generatedPrint.url,
        color: printColor,
        scale: printScale,
        repeat: printRepeat,
        rotation: printRotation
      }
    }));

    setPrintMetadata(prev => ({
      ...prev,
      [selectedZone]: {
        type: 'AI Generated',
        zone: selectedZone,
        zoneName: template.zones.find(z => z.id === selectedZone)?.label,
        printColor: printColor,
        scale: printScale,
        repeat: printRepeat,
        rotation: printRotation,
        appliedAt: new Date().toISOString()
      }
    }));

    saveToHistory();
  };

  const handleUploadPrint = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedPrint(event.target.result);
      toast.success('Design uploaded');
    };
    reader.readAsDataURL(file);
  };

  const applyUploadedPrint = () => {
    if (!selectedZone || !uploadedPrint) {
      toast.warning('Select zone and upload design first');
      return;
    }

    setZonePatterns(prev => ({
      ...prev,
      [selectedZone]: {
        type: 'print',
        key: 'uploaded',
        url: uploadedPrint,
        fitOption: uploadFitOption,
        repeat: uploadRepeat
      }
    }));

    setPrintMetadata(prev => ({
      ...prev,
      [selectedZone]: {
        type: 'Uploaded Design',
        zone: selectedZone,
        zoneName: template.zones.find(z => z.id === selectedZone)?.label,
        fitOption: uploadFitOption,
        repeat: uploadRepeat,
        appliedAt: new Date().toISOString()
      }
    }));

    saveToHistory();
    toast.success('Design applied!');
  };

  // Embroidery Functions
  const applyEmbroidery = (patternKey) => {
    if (!selectedZone) {
      toast.warning('Please select a zone first');
      return;
    }

    const pattern = IMPORTED_EMBROIDERY[patternKey];
    if (!pattern || !pattern.createPattern) {
      toast.error('Embroidery pattern not available');
      return;
    }

    try {
      const metadata = {
        type: patternKey,
        zone: selectedZone,
        zoneName: template.zones.find(z => z.id === selectedZone)?.label,
        density: pattern.density,
        threadColor: embroideryColor,
        appliedAt: new Date().toISOString()
      };

      setEmbroideryMetadata(prev => ({
        ...prev,
        [selectedZone]: metadata
      }));

      const patternCanvas = pattern.createPattern(embroideryColor);
      const patternUrl = patternCanvas.toDataURL();

      setZonePatterns(prev => ({
        ...prev,
        [selectedZone]: { type: 'embroidery', url: patternUrl, color: embroideryColor }
      }));

      saveToHistory();
      if (isMobile) setSidebarOpen(false);
    } catch (error) {
      console.error('Error applying embroidery:', error);
      toast.error('Failed to apply embroidery');
    }
  };

  // AI Image Generation
  const handleGenerateReferenceImages = async () => {
    if (!aiImagePrompt.trim()) {
      toast.error('Please describe the image');
      return;
    }

    setAiImageGenerating(true);

    try {
      toast.info('Generating AI designs...');

      const response = await fetch('/api/generate-design-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: aiImagePrompt,
          dressType: dressType,
          fabric: fabric,
          gender: gender,
          imageCount: 3,
          model: 'sdxl'
        })
      });

      // Check if endpoint exists
      if (response.status === 404) {
        throw new Error('AI image generation endpoint not configured. Please set up the /api/generate-design-image endpoint.');
      }

      if (!response.ok) {
        let errorMessage = 'Failed to generate images';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If response is not JSON, use default error message
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('Invalid response from server. Please check API endpoint.');
      }

      if (!data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      const successfulImages = data.images.filter(img => img.success);

      if (successfulImages.length === 0) {
        throw new Error('All generations failed');
      }

      setGeneratedReferenceImages(data.images);
      toast.success(`Generated ${successfulImages.length} designs!`);

    } catch (error) {
      console.error('AI image error:', error);

      // User-friendly error messages
      if (error.message.includes('endpoint not configured') || error.message.includes('404')) {
        toast.error('AI Image Generation feature requires backend setup', {
          autoClose: 5000
        });
      } else if (error.message.includes('Invalid response')) {
        toast.error('API configuration error. Please check the endpoint setup.');
      } else {
        toast.error(error.message || 'Failed to generate images');
      }
    } finally {
      setAiImageGenerating(false);
    }
  };

  const applyReferenceImageAsPrint = (imageUrl) => {
    if (!selectedZone) {
      toast.warning('Please select a zone first');
      return;
    }

    setZonePatterns(prev => ({
      ...prev,
      [selectedZone]: {
        type: 'print',
        key: 'ai-reference',
        url: imageUrl,
        color: printColor
      }
    }));

    setPrintMetadata(prev => ({
      ...prev,
      [selectedZone]: {
        type: 'AI Generated Design',
        zone: selectedZone,
        zoneName: template.zones.find(z => z.id === selectedZone)?.label,
        printColor: printColor,
        source: 'aigurulab-ai',
        appliedAt: new Date().toISOString()
      }
    }));

    saveToHistory();
    toast.success('AI image applied!');
  };

  // Clear Functions
  const clearZone = () => {
    if (!selectedZone) return;

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

    setPrintMetadata(prev => {
      const updated = { ...prev };
      delete updated[selectedZone];
      return updated;
    });

    saveToHistory();
  };

  // Export Design
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

      canvas.width = 600;
      canvas.height = 600;

      img.onload = () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        resolve(canvas.toDataURL('image/png', 0.8));
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
          color: fabricColor,
          baseColor: fabricColor,
          embroideryMetadata: Object.values(embroideryMetadata),
          printMetadata: Object.values(printMetadata),
          referenceImages: generatedReferenceImages.map(img => img.url)
        });
      }
    };

    exportDesign();
  }, [zoneColors, zonePatterns, fabricColor, sleeveStyle, embroideryMetadata, printMetadata, generatedReferenceImages, onDesignChange, svgToPng]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const currentCategoryPrints = getPrintsByCategory(printCategory);

  return (
    <div className="grid lg:grid-cols-[70fr_30fr] gap-6">
      {/* LEFT PANEL - PREVIEW */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
              <Palette size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text">Live Preview</h3>
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
              onClick={() => setAiHelperExpanded(!aiHelperExpanded)}
              className={`p-2 rounded-lg transition-all ${aiHelperExpanded
                ? 'bg-secondary text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-secondary'
                }`}
              title="AI Assistant">
              <Lightbulb size={18} />
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

        {/* AI HELPER - EXPANDED PANEL */}
        {aiHelperExpanded && (
          <div className="mb-6 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-xl p-4 border-2 border-secondary/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb size={20} className="text-secondary" />
                <h4 className="font-bold text-text">AI Assistant</h4>
              </div>
              <button
                onClick={() => setAiHelperExpanded(false)}
                className="p-1 hover:bg-secondary/10 rounded transition-all">
                <X size={16} className="text-secondary" />
              </button>
            </div>

            {/* SUGGESTION BUTTONS */}
            {aiSuggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {aiSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={suggestion.action}
                    className="px-3 py-1.5 bg-white hover:bg-secondary/5 border-2 border-secondary/20 hover:border-secondary rounded-lg transition-all text-xs font-semibold text-text flex items-center gap-1.5">
                    <span>{suggestion.icon}</span>
                    <span>{suggestion.title}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Chat Messages */}
            <div className="bg-white rounded-lg p-3 max-h-64 overflow-y-auto space-y-2 border border-secondary/20 mb-3">
              {chatHistory.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-xs text-secondary mb-2">💬 Try these:</p>
                  <div className="text-xs text-text/60 space-y-1">
                    <p>"Change color to red"</p>
                    <p>"Add gold embroidery"</p>
                    <p>"Make it festive"</p>
                  </div>
                </div>
              ) : (
                chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-2 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.type === 'ai' && (
                      <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <Bot size={12} className="text-secondary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-3 py-1.5 rounded-lg text-xs ${msg.type === 'user'
                        ? 'bg-secondary text-white'
                        : 'bg-gray-100 text-text'
                        }`}>
                      {msg.text}
                    </div>
                  </div>
                ))
              )}

              {aiLoading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Bot size={12} className="text-secondary" />
                  </div>
                  <div className="bg-gray-100 px-3 py-1.5 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAiQuery()}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none text-sm"
                disabled={aiLoading}
              />
              <button
                onClick={handleAiQuery}
                disabled={aiLoading || !userQuery.trim()}
                className="px-3 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-all disabled:opacity-50">
                <Send size={16} />
              </button>
            </div>
          </div>
        )}

        <div ref={containerRef} className="flex justify-center bg-gray-100 rounded-xl p-8 mb-6">
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
                  width="120"
                  height="120"
                  patternUnits="userSpaceOnUse">
                  <image href={pattern.url} width="120" height="120" />
                </pattern>
              ))}
            </defs>

            {template.zones.map((zone) => {
              const sleeveVis = getSleeveVisibility(zone.id);
              const hasPattern = zonePatterns[zone.id];

              return sleeveVis.visible && (
                <g key={zone.id}>
                  <path
                    d={zone.path}
                    fill={getZoneColor(zone.id)}
                    stroke="none"
                    style={{
                      clipPath: sleeveVis.clipPath || 'none'
                    }}
                  />

                  {hasPattern && (
                    <path
                      d={zone.path}
                      fill={`url(#pattern-${zone.id})`}
                      opacity={hasPattern.type === 'embroidery' ? 0.9 : 0.85}
                      style={{
                        mixBlendMode: hasPattern.type === 'print' ? 'multiply' : 'normal',
                        clipPath: sleeveVis.clipPath || 'none'
                      }}
                    />
                  )}

                  <path
                    d={zone.path}
                    fill="none"
                    stroke={selectedZone === zone.id ? '#ec4899' : 'rgba(0,0,0,0.1)'}
                    strokeWidth={selectedZone === zone.id ? 3 : 1}
                    onClick={() => handleZoneClick(zone.id)}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      clipPath: sleeveVis.clipPath || 'none',
                      pointerEvents: 'all'
                    }}
                    className="hover:stroke-2"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Zone Selection */}
        <div className="mb-6">
          <h4 className="font-bold text-sm uppercase text-gray-600 mb-3">Select Zone</h4>
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
          <div className="mb-6 p-4 bg-secondary/5 rounded-lg border border-secondary/20 flex items-center justify-between">
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

        {/* Applied Metadata */}
        {Object.keys(embroideryMetadata).length > 0 && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-bold text-sm text-amber-900 mb-2">Applied Embroidery</h4>
            {Object.entries(embroideryMetadata).map(([zoneId, data]) => (
              <div key={zoneId} className="text-xs text-amber-800 mb-1 flex items-center gap-2">
                <span>{data.zoneName}: {IMPORTED_EMBROIDERY[data.type]?.name || data.type}</span>
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: data.threadColor }}
                />
              </div>
            ))}
          </div>
        )}

        {Object.keys(printMetadata).length > 0 && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-sm text-blue-900 mb-2">Applied Prints</h4>
            {Object.entries(printMetadata).map(([zoneId, data]) => (
              <div key={zoneId} className="text-xs text-blue-800 mb-1 flex items-center gap-2">
                <span>{data.zoneName}: {data.type}</span>
                {data.printColor && (
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: data.printColor }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {generatedReferenceImages.length > 0 && (
          <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4">
            <h4 className="font-bold text-sm text-text mb-2">AI Reference Images</h4>
            <div className="grid grid-cols-2 gap-2">
              {generatedReferenceImages.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={img.url}
                    alt={`Reference ${idx + 1}`}
                    className="w-full aspect-square object-cover rounded-lg border-2 border-secondary/20"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center p-2">
                    <p className="text-white text-xs text-center">{img.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT PANEL - CONTROLS */}
      <div className={`
        ${isMobile ? 'fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300' : 'relative'}
        ${isMobile && !sidebarOpen ? 'translate-y-full' : 'translate-y-0'}
        bg-white rounded-t-2xl lg:rounded-xl shadow-xl border border-gray-200 
        ${isMobile ? 'max-h-[80vh] overflow-y-auto' : 'p-6'}
      `}>
        {isMobile && (
          <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between rounded-t-2xl z-10">
            <h3 className="text-lg font-bold">Design Controls</h3>
            <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
        )}

        <div className={isMobile ? 'p-4' : ''}>
          {/* PRIMARY TABS */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: 'fabric-fit', label: 'Fabric & Fit', icon: Palette },
              { id: 'prints-embroidery', label: 'Prints & Embroidery', icon: Grid },
              { id: 'ai-images', label: 'AI Images', icon: ImageIcon }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                    ? 'bg-secondary text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                  <Icon size={18} />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* FABRIC & FIT TAB */}
          {activeTab === 'fabric-fit' && (
            <div className="space-y-6">
              {/* COLOR APPLICATION MODE TOGGLE */}
              <div>
                <h4 className="font-bold text-sm uppercase text-gray-600 mb-3">Color Application Mode</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setColorMode('full')}
                    className={`p-3 rounded-lg border-2 transition-all text-xs font-semibold ${colorMode === 'full'
                      ? 'border-secondary bg-secondary/5'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}>
                    <ShirtIcon size={16} className="inline mr-2" />
                    Full Body
                  </button>
                  <button
                    onClick={() => setColorMode('zone')}
                    className={`p-3 rounded-lg border-2 transition-all text-xs font-semibold ${colorMode === 'zone'
                      ? 'border-secondary bg-secondary/5'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}>
                    <Move size={16} className="inline mr-2" />
                    Selected Zone
                  </button>
                </div>
                {colorMode === 'zone' && !selectedZone && (
                  <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                    <Info size={12} />
                    Please select a zone to apply color
                  </p>
                )}
              </div>

              <div>
                <h4 className="font-bold text-sm uppercase text-gray-600 mb-3 flex items-center gap-2">
                  <Palette size={16} />
                  {colorMode === 'full' ? 'Full Fabric Color' : 'Zone Color'}
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-4 mb-4">
                    <input
                      type="color"
                      value={fabricColor}
                      onChange={(e) => applyFabricColor(e.target.value)}
                      className="w-16 h-16 rounded-lg cursor-pointer border-2 border-white shadow-md"
                    />
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Hex Code</label>
                      <input
                        type="text"
                        value={fabricColor}
                        onChange={(e) => applyFabricColor(e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-secondary focus:outline-none font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm uppercase text-gray-600 mb-3">Color Presets</h4>
                <div className="grid grid-cols-8 gap-2">
                  {colorPresets.map(preset => (
                    <button
                      key={preset.color}
                      onClick={() => applyFabricColor(preset.color)}
                      className="aspect-square rounded-lg border-2 border-gray-200 hover:border-secondary hover:scale-110 transition-all shadow-sm"
                      style={{ backgroundColor: preset.color }}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>

              {template.zones.some(z => z.id.includes('sleeve')) && (
                <div>
                  <h4 className="font-bold text-sm uppercase text-gray-600 mb-3 flex items-center gap-2">
                    <Ruler size={16} />
                    Sleeve Length
                  </h4>
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

          {/* PRINTS & EMBROIDERY TAB */}
          {activeTab === 'prints-embroidery' && (
            <div className="space-y-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setPrintMode('browse')}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${['browse', 'ai', 'upload'].includes(printMode)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                  <Grid size={16} className="inline mr-2" />
                  Prints
                </button>
                <button
                  onClick={() => setPrintMode('embroidery')}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${printMode === 'embroidery'
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                  <Sparkles size={16} className="inline mr-2" />
                  Embroidery
                </button>
              </div>

              {['browse', 'ai', 'upload'].includes(printMode) && (
                <div className="space-y-4">
                  <div>
                    <h5 className="font-bold text-xs uppercase text-gray-600 mb-3">Print Type</h5>
                    <div className="space-y-2">
                      {[
                        { id: 'browse', label: 'Browse Prints', icon: Grid },
                        { id: 'ai', label: 'AI Generate', icon: Sparkles },
                        { id: 'upload', label: 'Upload Design', icon: Upload }
                      ].map(mode => {
                        const Icon = mode.icon;
                        return (
                          <button
                            key={mode.id}
                            onClick={() => setPrintMode(mode.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${printMode === mode.id
                              ? 'border-secondary bg-secondary/5'
                              : 'border-gray-200 hover:border-gray-300'
                              }`}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${printMode === mode.id ? 'border-secondary' : 'border-gray-300'
                              }`}>
                              {printMode === mode.id && (
                                <div className="w-3 h-3 rounded-full bg-secondary" />
                              )}
                            </div>
                            <Icon size={18} className={printMode === mode.id ? 'text-secondary' : 'text-gray-500'} />
                            <span className="font-semibold text-sm">{mode.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h5 className="font-bold text-xs uppercase text-gray-600 mb-3">Print Color</h5>
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="color"
                        value={printColor}
                        onChange={(e) => setPrintColor(e.target.value)}
                        className="w-12 h-12 rounded-lg cursor-pointer border-2 border-white shadow-md"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={printColor}
                          onChange={(e) => setPrintColor(e.target.value)}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-secondary focus:outline-none font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {selectedZone && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-800 font-semibold flex items-center gap-2">
                        <Info size={14} />
                        Applying to: {template.zones.find(z => z.id === selectedZone)?.label}
                      </p>
                    </div>
                  )}

                  {printMode === 'browse' && (
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-bold text-xs uppercase text-gray-600 mb-3">Category</h5>
                        <div className="flex flex-wrap gap-2">
                          {printCategories.map(cat => (
                            <button
                              key={cat.id}
                              onClick={() => setPrintCategory(cat.id)}
                              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${printCategory === cat.id
                                ? 'bg-secondary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}>
                              {cat.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-bold text-xs uppercase text-gray-600 mb-3">Available Prints</h5>
                        <div className="grid grid-cols-3 gap-3">
                          {currentCategoryPrints.map(print => {
                            return (
                              <button
                                key={print.key}
                                onClick={() => applyBrowsePrint(print.key)}
                                className="group aspect-square rounded-lg border-2 border-gray-200 hover:border-secondary hover:shadow-md transition-all overflow-hidden bg-white relative">
                                <img
                                  src={print.img}
                                  alt={print.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="font-semibold">{print.name}</div>
                                  <div className="text-[10px] text-gray-300">{print.description}</div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        {currentCategoryPrints.length === 0 && (
                          <p className="text-sm text-gray-500 text-center py-8">More styles coming soon</p>
                        )}
                      </div>
                    </div>
                  )}

                  {printMode === 'ai' && (
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-bold text-xs uppercase text-gray-600 mb-3">Describe Your Print</h5>
                        <textarea
                          value={aiPrintPrompt}
                          onChange={(e) => setAiPrintPrompt(e.target.value)}
                          placeholder="Example: Kalamkari inspired floral print"
                          className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 h-24 focus:border-secondary focus:outline-none transition-all resize-none text-sm"
                          rows="3"
                        />
                        <button
                          onClick={handleAIGeneratePrint}
                          disabled={aiGenerating || !aiPrintPrompt.trim()}
                          className="w-full mt-3 px-4 py-3 bg-secondary text-white rounded-lg hover:shadow-lg transition-all font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                          {aiGenerating ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              <span>Generating...</span>
                            </>
                          ) : (
                            <>
                              <Wand2 size={18} />
                              <span>Generate Print</span>
                            </>
                          )}
                        </button>
                      </div>

                      {generatedPrint && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h5 className="font-bold text-xs uppercase text-gray-600 mb-3">Generated Preview</h5>
                          <div className="aspect-square rounded-lg border-2 border-gray-200 overflow-hidden mb-3 bg-white">
                            <img src={generatedPrint.url} alt="Generated Print" className="w-full h-full object-cover" />
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-2">Scale</label>
                              <input
                                type="range"
                                min="1"
                                max="10"
                                value={printScale}
                                onChange={(e) => setPrintScale(parseInt(e.target.value))}
                                className="w-full"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-2">Repeat</label>
                              <div className="flex gap-2">
                                {['tile', 'mirror', 'center'].map(opt => (
                                  <button
                                    key={opt}
                                    onClick={() => setPrintRepeat(opt)}
                                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all capitalize ${printRepeat === opt
                                      ? 'bg-secondary text-white'
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                      }`}>
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-2">Rotation: {printRotation}°</label>
                              <input
                                type="range"
                                min="0"
                                max="360"
                                step="45"
                                value={printRotation}
                                onChange={(e) => setPrintRotation(parseInt(e.target.value))}
                                className="w-full"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={applyGeneratedPrint}
                              className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:shadow-md transition-all font-semibold text-sm">
                              Apply
                            </button>
                            <button
                              onClick={handleAIGeneratePrint}
                              className="flex-1 px-4 py-2 bg-white border-2 border-secondary text-secondary rounded-lg hover:bg-secondary/5 transition-all font-semibold text-sm">
                              Regenerate
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {printMode === 'upload' && (
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-bold text-xs uppercase text-gray-600 mb-3">Upload Your Design</h5>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/svg+xml"
                          onChange={handleUploadPrint}
                          className="block w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-6 focus:border-secondary transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-secondary file:text-white file:font-semibold hover:file:bg-secondary/90 cursor-pointer text-sm bg-white"
                        />
                        <p className="text-xs text-gray-500 mt-2">Supported: JPG, PNG, SVG</p>
                      </div>

                      {uploadedPrint && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h5 className="font-bold text-xs uppercase text-gray-600 mb-3">Preview</h5>
                          <div className="aspect-square rounded-lg border-2 border-gray-200 overflow-hidden mb-3 bg-white">
                            <img src={uploadedPrint} alt="Uploaded Design" className="w-full h-full object-contain" />
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-2">Repeat</label>
                              <div className="flex gap-2">
                                {['tile', 'mirror', 'no-repeat'].map(opt => (
                                  <button
                                    key={opt}
                                    onClick={() => setUploadRepeat(opt)}
                                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${uploadRepeat === opt
                                      ? 'bg-secondary text-white'
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                      }`}>
                                    {opt === 'no-repeat' ? 'No Repeat' : opt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={applyUploadedPrint}
                            className="w-full mt-4 px-4 py-2 bg-secondary text-white rounded-lg hover:shadow-md transition-all font-semibold text-sm">
                            Apply Design
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {printMode === 'embroidery' && (
                <div className="space-y-6">
                  {selectedZone ? (
                    <>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-xs text-amber-800 font-semibold flex items-center gap-2">
                          <Info size={14} />
                          Select embroidery for {template.zones.find(z => z.id === selectedZone)?.label}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h5 className="font-bold text-xs uppercase text-gray-600 mb-3">Thread Color</h5>
                        <div className="flex items-center gap-3 mb-3">
                          <input
                            type="color"
                            value={embroideryColor}
                            onChange={(e) => setEmbroideryColor(e.target.value)}
                            className="w-12 h-12 rounded-lg cursor-pointer border-2 border-white shadow-md"
                          />
                          <div className="flex-1">
                            <input
                              type="text"
                              value={embroideryColor}
                              onChange={(e) => setEmbroideryColor(e.target.value)}
                              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-secondary focus:outline-none font-mono text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-6 gap-2 mt-3">
                          {['#FFD700', '#C0C0C0', '#DC2626', '#EC4899', '#FFFFFF', '#000000'].map(color => (
                            <button
                              key={color}
                              onClick={() => setEmbroideryColor(color)}
                              className="aspect-square rounded-lg border-2 border-gray-200 hover:border-secondary hover:scale-110 transition-all shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-bold text-xs uppercase text-gray-600 mb-3">Embroidery Style</h5>
                        <div className="grid grid-cols-1 gap-3">
                          {embroideryStyles.map((style) => {
                            const pattern = IMPORTED_EMBROIDERY[style.pattern];
                            if (!pattern) return null;

                            const patternCanvas = pattern.createPattern(embroideryColor);
                            return (
                              <button
                                key={style.id}
                                onClick={() => applyEmbroidery(style.pattern)}
                                className="group p-4 rounded-lg border-2 border-gray-200 hover:border-secondary hover:shadow-md transition-all flex items-center gap-4">
                                <div className="w-14 h-14 rounded-lg border-2 border-gray-200 overflow-hidden bg-white">
                                  <img src={patternCanvas.toDataURL()} alt={style.label} className="w-full h-full object-cover" />
                                </div>
                                <div className="text-left flex-1">
                                  <div className="text-sm font-semibold text-text mb-1">{style.label}</div>
                                  <div className="text-xs text-text/60">{pattern.note}</div>
                                </div>
                                <CheckCircle2 size={18} className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                              </button>
                            );
                          })}
                        </div>
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
            </div>
          )}

          {/* AI IMAGES TAB */}
          {activeTab === 'ai-images' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-secondary/5 to-primary/5 rounded-lg p-5 border-2 border-secondary/20">
                <div className="flex items-center gap-2 mb-3">
                  <ImageIcon size={20} className="text-secondary" />
                  <h4 className="font-bold text-text text-lg">AI Design Generator</h4>
                </div>
                <p className="text-xs text-text/60 mb-4">
                  Generate unique patterns using AI (1024x1024 resolution)
                </p>

                <textarea
                  value={aiImagePrompt}
                  onChange={(e) => setAiImagePrompt(e.target.value)}
                  placeholder="Example: Traditional Indian paisley pattern with gold metallic accents"
                  className="w-full px-4 py-3 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none text-sm resize-none"
                  rows="4"
                  disabled={aiImageGenerating}
                />

                <button
                  onClick={handleGenerateReferenceImages}
                  disabled={aiImageGenerating || !aiImagePrompt.trim()}
                  className="w-full mt-4 px-4 py-3 bg-secondary text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm flex items-center justify-center gap-2 transition-all">
                  {aiImageGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 size={18} />
                      <span>Generate Images</span>
                    </>
                  )}
                </button>
              </div>

              {generatedReferenceImages.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-sm text-gray-700">
                      Generated ({generatedReferenceImages.length})
                    </h5>
                    {selectedZone && (
                      <p className="text-xs text-secondary font-semibold bg-secondary/5 px-2 py-1 rounded">
                        Click to apply to {template.zones.find(z => z.id === selectedZone)?.label}
                      </p>
                    )}
                  </div>

                  {generatedReferenceImages.map((img, idx) => (
                    <div
                      key={idx}
                      className={`bg-white rounded-lg p-3 border-2 transition-all group ${img.error ? 'border-red-200' : 'border-gray-200 hover:border-secondary'
                        }`}>
                      <div className="relative">
                        <img
                          src={img.url}
                          alt={`AI Design ${idx + 1}`}
                          className={`w-full aspect-square object-cover rounded-lg mb-2 ${selectedZone && !img.error ? 'cursor-pointer' : ''
                            }`}
                          onClick={() => !img.error && applyReferenceImageAsPrint(img.url)}
                        />

                        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-semibold">
                          1024x1024
                        </div>

                        {selectedZone && !img.error && (
                          <button
                            onClick={() => applyReferenceImageAsPrint(img.url)}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <div className="bg-secondary text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 shadow-lg">
                              <CheckCircle2 size={16} />
                              Apply as Print
                            </div>
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-gray-600 line-clamp-2">
                        <strong>Design:</strong> {img.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignCanvas;