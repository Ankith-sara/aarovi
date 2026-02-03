import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Palette, Trash2, Undo, Redo, Info, CheckCircle2, X, Menu,
  Wand2, Upload, Grid, Sparkles, Image as ImageIcon, Ruler, ShirtIcon
} from 'lucide-react';
import {
  SVG_TEMPLATES,
  EMBROIDERY_PATTERNS as IMPORTED_EMBROIDERY,
  FABRIC_PRINTS as IMPORTED_PRINTS
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
  
  // Primary Tab State
  const [activeTab, setActiveTab] = useState('fabric');
  
  // Print Mode State
  const [printMode, setPrintMode] = useState('browse'); // 'browse' | 'ai' | 'upload' | 'basic'
  const [printCategory, setPrintCategory] = useState('floral');
  
  // Zone & Design State
  const [selectedZone, setSelectedZone] = useState(null);
  const [zoneColors, setZoneColors] = useState({});
  const [zonePatterns, setZonePatterns] = useState({});
  const [embroideryMetadata, setEmbroideryMetadata] = useState({});
  const [printMetadata, setPrintMetadata] = useState({});
  
  // Embroidery State
  const [embroideryColor, setEmbroideryColor] = useState('#ec4899');
  
  // Print State - DEFAULT TO BLACK
  const [printColor, setPrintColor] = useState('#000000');
  
  // Fabric State
  const [fabricColor, setFabricColor] = useState(selectedColor);
  const [sleeveStyle, setSleeveStyle] = useState('full');
  
  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  // AI Print State
  const [aiPrintPrompt, setAiPrintPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [generatedPrint, setGeneratedPrint] = useState(null);
  const [printScale, setPrintScale] = useState(5);
  const [printRepeat, setPrintRepeat] = useState('tile');
  const [printRotation, setPrintRotation] = useState(0);
  
  // Upload Print State
  const [uploadedPrint, setUploadedPrint] = useState(null);
  const [uploadFitOption, setUploadFitOption] = useState('full');
  const [uploadRepeat, setUploadRepeat] = useState('tile');
  
  // History State
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
    { id: 'geometric', label: 'Geometric' },
    { id: 'abstract', label: 'Abstract' },
    { id: 'minimal', label: 'Minimal' }
  ];

  // Categorized Prints
  const categorizedPrints = {
    floral: ['floral', 'painting'],
    ethnic: ['kalamkari', 'block', 'bagru'],
    geometric: [],
    abstract: [],
    minimal: []
  };

  // Basic Patterns
  const basicPatterns = [
    { id: 'stripes', label: 'Stripes' },
    { id: 'checks', label: 'Checks' },
    { id: 'polka', label: 'Polka' },
    { id: 'ikat', label: 'Ikat' },
    { id: 'dots', label: 'Dots' },
    { id: 'lines', label: 'Lines' }
  ];

  // Embroidery Styles - use actual patterns from SVG template
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

  // Sleeve Visibility - FIXED to return proper clipPath for sleeve zones
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
      printColor,
      embroideryColor
    };

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(state);
      return newHistory.slice(-50);
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [zoneColors, zonePatterns, embroideryMetadata, printMetadata, fabricColor, sleeveStyle, printColor, embroideryColor, historyIndex]);

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
      setPrintColor(state.printColor || '#000000');
      setEmbroideryColor(state.embroideryColor || '#ec4899');
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
      setPrintColor(state.printColor || '#000000');
      setEmbroideryColor(state.embroideryColor || '#ec4899');
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  useEffect(() => {
    if (history.length === 0) {
      saveToHistory();
    }
  }, []);

  // Zone Interaction
  const handleZoneClick = (zoneId) => {
    setSelectedZone(zoneId);
  };

  const getZoneColor = (zoneId) => {
    return zoneColors[zoneId] || fabricColor;
  };

  // Fabric Tab Functions
  const applyFabricColor = (color) => {
    setFabricColor(color);
    const updatedColors = {};
    template.zones.forEach(zone => {
      updatedColors[zone.id] = color;
    });
    setZoneColors(updatedColors);
    saveToHistory();
  };

  // Print Tab Functions - FIXED to use printColor instead of fabricColor
  const applyBrowsePrint = (printKey) => {
    if (!selectedZone) {
      toast.warning('Please select a zone first');
      return;
    }

    const print = IMPORTED_PRINTS[printKey];
    if (!print || !print.createPattern) return;

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
        type: printKey,
        zone: selectedZone,
        zoneName: template.zones.find(z => z.id === selectedZone)?.label,
        printColor: printColor,
        appliedAt: new Date().toISOString()
      }
    }));

    saveToHistory();
  };

  const handleAIGeneratePrint = async () => {
    if (!aiPrintPrompt.trim()) {
      toast.error('Please describe your desired print');
      return;
    }

    setAiGenerating(true);
    try {
      // Simulate AI generation (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo, use a random existing print
      const printKeys = Object.keys(IMPORTED_PRINTS);
      const randomPrint = printKeys[Math.floor(Math.random() * printKeys.length)];
      const print = IMPORTED_PRINTS[randomPrint];
      
      const canvas = print.createPattern(printColor);
      setGeneratedPrint({
        url: canvas.toDataURL('image/png'),
        key: randomPrint
      });
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error('Failed to generate print');
    } finally {
      setAiGenerating(false);
    }
  };

  const applyGeneratedPrint = () => {
    if (!selectedZone || !generatedPrint) {
      toast.warning('Please select a zone and generate a print first');
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
      toast.success('Design uploaded successfully');
    };
    reader.readAsDataURL(file);
  };

  const applyUploadedPrint = () => {
    if (!selectedZone || !uploadedPrint) {
      toast.warning('Please select a zone and upload a design first');
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
    toast.success('Uploaded design applied!');
  };

  const applyBasicPattern = (patternId) => {
    if (!selectedZone) {
      toast.warning('Please select a zone first');
      return;
    }

    // Create a simple pattern based on ID
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = fabricColor;
    ctx.fillRect(0, 0, 100, 100);
    
    // Simple pattern rendering - FIXED to use printColor
    ctx.strokeStyle = printColor;
    ctx.fillStyle = printColor;
    ctx.lineWidth = 2;
    
    switch(patternId) {
      case 'stripes':
        for(let i = 0; i < 100; i += 10) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(100, i);
          ctx.stroke();
        }
        break;
      case 'checks':
        for(let i = 0; i < 100; i += 20) {
          for(let j = 0; j < 100; j += 20) {
            if ((i + j) % 40 === 0) {
              ctx.fillRect(i, j, 20, 20);
            }
          }
        }
        break;
      case 'polka':
        for(let i = 10; i < 100; i += 20) {
          for(let j = 10; j < 100; j += 20) {
            ctx.beginPath();
            ctx.arc(i, j, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;
      default:
        break;
    }
    
    const url = canvas.toDataURL('image/png');

    setZonePatterns(prev => ({
      ...prev,
      [selectedZone]: {
        type: 'print',
        key: patternId,
        url,
        color: printColor
      }
    }));

    setPrintMetadata(prev => ({
      ...prev,
      [selectedZone]: {
        type: patternId,
        zone: selectedZone,
        zoneName: template.zones.find(z => z.id === selectedZone)?.label,
        printColor: printColor,
        appliedAt: new Date().toISOString()
      }
    }));

    saveToHistory();
  };

  // Embroidery Tab Functions
  const applyEmbroidery = (patternKey) => {
    if (!selectedZone) {
      toast.warning('Please select a zone first');
      return;
    }

    const pattern = IMPORTED_EMBROIDERY[patternKey];
    if (!pattern) return;

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
      [selectedZone]: { type: 'embroidery', url: patternUrl }
    }));

    saveToHistory();
    if (isMobile) setSidebarOpen(false);
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
    toast.success('Zone cleared');
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
          printMetadata: Object.values(printMetadata)
        });
      }
    };

    exportDesign();
  }, [zoneColors, zonePatterns, fabricColor, sleeveStyle, embroideryMetadata, printMetadata, onDesignChange, svgToPng]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

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
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 bg-secondary text-white rounded-lg">
                <Menu size={18} />
              </button>
            )}
          </div>
        </div>

        <div ref={containerRef} className="flex justify-center bg-gray-100 rounded-xl p-8">
          <svg
            ref={svgRef}
            viewBox={template.viewBox}
            className="w-full max-w-md"
            style={{ maxHeight: '600px' }}>
            <defs>
              {Object.entries(zonePatterns).map(([zoneId, pattern]) => {
                const sleeveVis = getSleeveVisibility(zoneId);
                return (
                  <React.Fragment key={zoneId}>
                    <pattern
                      id={`pattern-${zoneId}`}
                      x="0"
                      y="0"
                      width="120"
                      height="120"
                      patternUnits="userSpaceOnUse">
                      <image href={pattern.url} width="120" height="120" />
                    </pattern>
                    {/* FIXED: Add clipPath definition for sleeve zones */}
                    {sleeveVis.clipPath && (
                      <clipPath id={`clip-${zoneId}`}>
                        <rect x="0" y="0" width="100%" height={sleeveVis.clipPath === 'inset(0 0 25% 0)' ? '75%' : '50%'} />
                      </clipPath>
                    )}
                  </React.Fragment>
                );
              })}
            </defs>

            {template.zones.map((zone) => {
              const sleeveVis = getSleeveVisibility(zone.id);
              const hasPattern = zonePatterns[zone.id];

              return sleeveVis.visible && (
                <g key={zone.id}>
                  {/* Base color layer */}
                  <path
                    d={zone.path}
                    fill={getZoneColor(zone.id)}
                    stroke="none"
                    clipPath={sleeveVis.clipPath && hasPattern ? `url(#clip-${zone.id})` : 'none'}
                  />

                  {/* Pattern layer on top - FIXED: Apply clipPath here too */}
                  {hasPattern?.type === 'print' && (
                    <path
                      d={zone.path}
                      fill={`url(#pattern-${zone.id})`}
                      opacity="0.85"
                      clipPath={sleeveVis.clipPath ? `url(#clip-${zone.id})` : 'none'}
                      style={{
                        mixBlendMode: 'multiply'
                      }}
                    />
                  )}

                  {/* Embroidery overlay - FIXED: Apply clipPath here too */}
                  {hasPattern?.type === 'embroidery' && (
                    <path
                      d={zone.path}
                      fill={`url(#pattern-${zone.id})`}
                      opacity="0.9"
                      clipPath={sleeveVis.clipPath ? `url(#clip-${zone.id})` : 'none'}
                    />
                  )}

                  {/* Stroke/border layer */}
                  <path
                    d={zone.path}
                    fill="none"
                    stroke={selectedZone === zone.id ? '#ec4899' : 'rgba(0,0,0,0.1)'}
                    strokeWidth={selectedZone === zone.id ? 3 : 1}
                    onClick={() => handleZoneClick(zone.id)}
                    clipPath={sleeveVis.clipPath ? `url(#clip-${zone.id})` : 'none'}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      pointerEvents: 'all'
                    }}
                    className="hover:stroke-2"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-6">
          <h4 className="font-bold text-sm uppercase text-gray-600 mb-3">Select Zone</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {template.zones.filter(zone => getSleeveVisibility(zone.id).visible).map(zone => (
              <button
                key={zone.id}
                onClick={() => handleZoneClick(zone.id)}
                className={`p-3 rounded-lg border-2 transition-all text-xs font-semibold ${
                  selectedZone === zone.id
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

        {/* Applied Metadata Display */}
        {Object.keys(embroideryMetadata).length > 0 && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-bold text-sm text-amber-900 mb-2">Applied Embroidery</h4>
            {Object.entries(embroideryMetadata).map(([zoneId, data]) => (
              <div key={zoneId} className="text-xs text-amber-800 mb-1 flex items-center gap-2">
                <span>{data.zoneName}: {data.type}</span>
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: data.threadColor }}
                  title={`Thread color: ${data.threadColor}`}
                />
              </div>
            ))}
          </div>
        )}

        {Object.keys(printMetadata).length > 0 && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-sm text-blue-900 mb-2">Applied Prints</h4>
            {Object.entries(printMetadata).map(([zoneId, data]) => (
              <div key={zoneId} className="text-xs text-blue-800 mb-1 flex items-center gap-2">
                <span>{data.zoneName}: {data.type}</span>
                {data.printColor && (
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: data.printColor }}
                    title={`Print color: ${data.printColor}`}
                  />
                )}
              </div>
            ))}
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
              { id: 'fabric', label: 'Fabric', icon: Palette },
              { id: 'print', label: 'Print', icon: Grid },
              { id: 'embroidery', label: 'Embroidery', icon: Sparkles },
              { id: 'fit', label: 'Fit & Size', icon: Ruler }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-secondary text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  <Icon size={18} />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* FABRIC TAB */}
          {activeTab === 'fabric' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-sm uppercase text-gray-600 mb-3">Base Fabric Color</h4>
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
                <div className="grid grid-cols-6 gap-2">
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
            </div>
          )}

          {/* PRINT TAB */}
          {activeTab === 'print' && (
            <div className="space-y-6">
              {/* PRINT COLOR PICKER - NEW */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h5 className="font-bold text-xs uppercase text-gray-600 mb-3">Print Color</h5>
                <div className="flex items-center gap-3">
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
                
                <div className="grid grid-cols-6 gap-2 mt-3">
                  {[
                    '#000000', // Black (default)
                    '#DC2626', // Red
                    '#3B82F6', // Blue
                    '#10B981', // Green
                    '#F59E0B', // Yellow
                    '#8B4513'  // Brown
                  ].map(color => (
                    <button
                      key={color}
                      onClick={() => setPrintColor(color)}
                      className="aspect-square rounded-lg border-2 border-gray-200 hover:border-secondary hover:scale-110 transition-all shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* PRINT MODE SELECTOR */}
              <div>
                <h4 className="font-bold text-sm uppercase text-gray-600 mb-3">Print Type</h4>
                <div className="space-y-2">
                  {[
                    { id: 'browse', label: 'Browse Prints', icon: Grid },
                    { id: 'ai', label: 'AI Generate', icon: Sparkles },
                    { id: 'upload', label: 'Upload Design', icon: Upload },
                    { id: 'basic', label: 'Basic Patterns', icon: Grid }
                  ].map(mode => {
                    const Icon = mode.icon;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => setPrintMode(mode.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
                          printMode === mode.id
                            ? 'border-secondary bg-secondary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          printMode === mode.id ? 'border-secondary' : 'border-gray-300'
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

              {/* Selected Zone Info */}
              {selectedZone && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800 font-semibold flex items-center gap-2">
                    <Info size={14} />
                    Applying to: {template.zones.find(z => z.id === selectedZone)?.label}
                  </p>
                </div>
              )}

              {/* BROWSE PRINTS MODE */}
              {printMode === 'browse' && (
                <div className="space-y-4">
                  <div>
                    <h5 className="font-bold text-xs uppercase text-gray-600 mb-3">Category</h5>
                    <div className="flex flex-wrap gap-2">
                      {printCategories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setPrintCategory(cat.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            printCategory === cat.id
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
                      {categorizedPrints[printCategory]?.map(printKey => {
                        const print = IMPORTED_PRINTS[printKey];
                        if (!print) return null;
                        return (
                          <button
                            key={printKey}
                            onClick={() => applyBrowsePrint(printKey)}
                            className="group aspect-square rounded-lg border-2 border-gray-200 hover:border-secondary hover:shadow-md transition-all overflow-hidden bg-white">
                            <img src={print.img} alt={print.name} className="w-full h-full object-cover" />
                          </button>
                        );
                      })}
                    </div>
                    {(!categorizedPrints[printCategory] || categorizedPrints[printCategory].length === 0) && (
                      <p className="text-sm text-gray-500 text-center py-8">More styles coming soon</p>
                    )}
                  </div>
                </div>
              )}

              {/* AI GENERATE MODE */}
              {printMode === 'ai' && (
                <div className="space-y-4">
                  <div>
                    <h5 className="font-bold text-xs uppercase text-gray-600 mb-3">Describe Your Print</h5>
                    <textarea
                      value={aiPrintPrompt}
                      onChange={(e) => setAiPrintPrompt(e.target.value)}
                      placeholder="Example: Kalamkari inspired floral print in earthy tones"
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
                                className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all capitalize ${
                                  printRepeat === opt
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

              {/* UPLOAD MODE */}
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
                          <label className="block text-xs font-semibold text-gray-600 mb-2">Fit Options</label>
                          <div className="space-y-2">
                            {[
                              { id: 'full', label: 'Full Fabric' },
                              { id: 'center', label: 'Center Motif' },
                              { id: 'border', label: 'Border Print' }
                            ].map(opt => (
                              <button
                                key={opt.id}
                                onClick={() => setUploadFitOption(opt.id)}
                                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg border-2 transition-all ${
                                  uploadFitOption === opt.id
                                    ? 'border-secondary bg-secondary/5'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                  uploadFitOption === opt.id ? 'border-secondary' : 'border-gray-300'
                                }`}>
                                  {uploadFitOption === opt.id && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                                  )}
                                </div>
                                <span className="font-semibold text-sm">{opt.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-2">Repeat</label>
                          <div className="flex gap-2">
                            {['tile', 'mirror', 'no-repeat'].map(opt => (
                              <button
                                key={opt}
                                onClick={() => setUploadRepeat(opt)}
                                className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                                  uploadRepeat === opt
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

              {/* BASIC PATTERNS MODE */}
              {printMode === 'basic' && (
                <div className="space-y-4">
                  <h5 className="font-bold text-xs uppercase text-gray-600 mb-3">Pattern Library</h5>
                  <div className="grid grid-cols-3 gap-3">
                    {basicPatterns.map(pattern => (
                      <button
                        key={pattern.id}
                        onClick={() => applyBasicPattern(pattern.id)}
                        className="aspect-square rounded-lg border-2 border-gray-200 hover:border-secondary hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 bg-white">
                        <Grid size={24} className="text-gray-600" />
                        <span className="text-xs font-semibold text-gray-700">{pattern.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* EMBROIDERY TAB */}
          {activeTab === 'embroidery' && (
            <div className="space-y-6">
              {selectedZone ? (
                <>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs text-amber-800 font-semibold flex items-center gap-2">
                      <Info size={14} />
                      Select embroidery for {template.zones.find(z => z.id === selectedZone)?.label}
                    </p>
                  </div>

                  {/* Embroidery Color Picker */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h5 className="font-bold text-xs uppercase text-gray-600 mb-3">Embroidery Thread Color</h5>
                    <div className="flex items-center gap-3">
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
                      {[
                        '#FFD700', // Gold
                        '#C0C0C0', // Silver
                        '#DC2626', // Red
                        '#EC4899', // Pink
                        '#FFFFFF', // White
                        '#1F2937'  // Black
                      ].map(color => (
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
                    <h5 className="font-bold text-xs uppercase text-gray-600 mb-3">Select Embroidery Style</h5>
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
                  <Sparkles size={40} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-sm text-gray-500">Select a zone first</p>
                </div>
              )}
            </div>
          )}

          {/* FIT & SIZE TAB */}
          {activeTab === 'fit' && (
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
                        className={`p-3 rounded-lg border-2 transition-all text-xs font-semibold ${
                          sleeveStyle === style.value
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
        </div>
      </div>
    </div>
  );
};

export default DesignCanvas;