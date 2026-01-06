import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Palette, Trash2, Undo, Redo, Sparkles,
  Move, Info, Settings, CheckCircle2, X, Menu
} from 'lucide-react';
import { assets } from '../assets/assets';
import { 
  SVG_TEMPLATES, 
  EMBROIDERY_PATTERNS as IMPORTED_EMBROIDERY,
  FABRIC_PRINTS as IMPORTED_PRINTS 
} from '../data/svg_templates';

// ============================================================================
// EMBROIDERY PATTERNS (Using imported patterns)
// ============================================================================
const EMBROIDERY_PATTERNS = IMPORTED_EMBROIDERY;

// ============================================================================
// FABRIC PRINTS (Enhanced with image references)
// ============================================================================
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

// ============================================================================
// HELPER FUNCTION - Intelligently filter zones based on dress type
// ============================================================================
const getEssentialZones = (zones, dressType) => {
  if (!zones) return [];
  
  // Define essential zone patterns for different dress types
  const essentialPatterns = {
    // Core body zones (always include)
    core: ['body', 'top'],
    // Neckline zones
    neck: ['neckline', 'collar'],
    // Sleeve zones
    sleeves: ['sleeve_left', 'sleeve_right', 'sleeve'],
    // Button zones
    buttons: ['button', 'buttons'],
    // Special zones for specific dresses
    lehenga: ['blouse', 'skirt', 'waist', 'border'],
    sherara: ['top', 'pants', 'sharara'],
    anarkali: ['top', 'waist_band', 'neckline', 'skirt', 'border']
  };

  return zones.filter(zone => {
    const id = zone.id.toLowerCase();
    
    // Always include core body zones
    if (essentialPatterns.core.some(pattern => id === pattern)) return true;
    
    // Always include neckline/collar
    if (essentialPatterns.neck.some(pattern => id.includes(pattern))) return true;
    
    // Always include sleeves
    if (essentialPatterns.sleeves.some(pattern => id.includes(pattern))) return true;
    
    // Include buttons if present
    if (essentialPatterns.buttons.some(pattern => id === pattern)) return true;
    
    // For Lehenga - include skirt, blouse, waist, border
    if (dressType === 'Lehenga' && essentialPatterns.lehenga.some(pattern => id.includes(pattern))) {
      return true;
    }
    
    // For Sherara - include top, pants, sharara zones
    if (dressType === 'Sherara' && essentialPatterns.sherara.some(pattern => id.includes(pattern))) {
      return true;
    }
    
    // For Anarkali - include bodice, waist_band, flare, border
    if (dressType === 'Anarkali' && essentialPatterns.anarkali.some(pattern => id.includes(pattern))) {
      return true;
    }
    
    // For Kurta/Kurti Sets - include pants/bottom if present
    if ((dressType === 'Kurta Sets' || dressType === 'Kurti Sets') && id === 'pants') {
      return true;
    }
    
    return false;
  });
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const DesignCanvas = ({
  onDesignChange,
  dressType = 'Kurta',
  selectedColor = '#ffffff',
  gender = 'Women',
  aiPrompt = '',
  onAIPromptChange,
  onAIGenerate,
  aiGenerating = false
}) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [zoneColors, setZoneColors] = useState({});
  const [zonePatterns, setZonePatterns] = useState({});
  const [activeTab, setActiveTab] = useState('styles');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentColor, setCurrentColor] = useState(selectedColor);
  const [embroideryMetadata, setEmbroideryMetadata] = useState({});
  const [neckStyle, setNeckStyle] = useState('round');
  const [sleeveStyle, setSleeveStyle] = useState('full');
  const [initialized, setInitialized] = useState(false);

  // Undo/Redo history
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Get template and filter to essential zones
  const rawTemplate = SVG_TEMPLATES[dressType] || SVG_TEMPLATES.Kurta;
  const template = {
    ...rawTemplate,
    zones: getEssentialZones(rawTemplate.zones, dressType)
  };

  // ✅ Sync selectedColor prop with local currentColor state
  useEffect(() => {
    setCurrentColor(selectedColor);
  }, [selectedColor]);

  // ✅ Initialize all zones with base color ONCE
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

  // Reset initialization when dress type changes
  useEffect(() => {
    setInitialized(false);
    setSelectedZone(null); // Clear selection when changing dress
  }, [dressType]);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sleeve visibility logic
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

  // Save to history
  const saveToHistory = useCallback(() => {
    const state = {
      zoneColors: { ...zoneColors },
      zonePatterns: { ...zonePatterns },
      embroideryMetadata: { ...embroideryMetadata },
      currentColor,
      neckStyle,
      sleeveStyle
    };

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(state);
      return newHistory.slice(-50);
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [zoneColors, zonePatterns, embroideryMetadata, currentColor, neckStyle, sleeveStyle, historyIndex]);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];

      setZoneColors(state.zoneColors);
      setZonePatterns(state.zonePatterns);
      setEmbroideryMetadata(state.embroideryMetadata);
      setCurrentColor(state.currentColor);
      setNeckStyle(state.neckStyle);
      setSleeveStyle(state.sleeveStyle);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const state = history[newIndex];

      setZoneColors(state.zoneColors);
      setZonePatterns(state.zonePatterns);
      setEmbroideryMetadata(state.embroideryMetadata);
      setCurrentColor(state.currentColor);
      setNeckStyle(state.neckStyle);
      setSleeveStyle(state.sleeveStyle);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  // Initialize history
  useEffect(() => {
    if (history.length === 0) {
      saveToHistory();
    }
  }, []);

  // Get available necklines based on gender
  const getAvailableNecklines = () => {
    if (gender === 'Men') {
      return [
        { value: 'collar', label: 'Collar Neck' },
        { value: 'round', label: 'Round Neck' },
        { value: 'vNeck', label: 'V Neck' }
      ];
    }
    return [
      { value: 'round', label: 'Round Neck' },
      { value: 'square', label: 'Square Neck' },
      { value: 'vNeck', label: 'V Neck' },
      { value: 'boat', label: 'Boat Neck' },
      { value: 'sweetheart', label: 'Sweetheart' },
      { value: 'halter', label: 'Halter Neck' }
    ];
  };

  const sleeveOptions = [
    { value: 'full', label: 'Full Sleeve' },
    { value: 'elbow', label: '3/4 (Elbow)' },
    { value: 'short', label: 'Short Sleeve' },
    { value: 'sleeveless', label: 'Sleeveless' }
  ];

  // Handle zone click
  const handleZoneClick = (zoneId) => {
    setSelectedZone(zoneId);
  };

  // Get zone color
  const getZoneColor = (zoneId) => {
    return zoneColors[zoneId] || currentColor;
  };

  // Apply embroidery to zone
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

  // Apply fabric print to zone
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

  // Clear zone
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

  // Apply color to zone
  const applyColorToZone = (color) => {
    if (!selectedZone) return;

    setZoneColors(prev => ({
      ...prev,
      [selectedZone]: color
    }));

    saveToHistory();
  };

  // Export design
  useEffect(() => {
    if (onDesignChange && svgRef.current) {
      const svgString = new XMLSerializer().serializeToString(svgRef.current);

      onDesignChange({
        svg: svgString,
        zoneColors,
        zonePatterns,
        neckStyle,
        sleeveStyle,
        color: currentColor,
        baseColor: currentColor,
        embroideryMetadata: Object.values(embroideryMetadata)
      });
    }
  }, [zoneColors, zonePatterns, currentColor, neckStyle, sleeveStyle, embroideryMetadata, onDesignChange]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Get description for sleeve style
  const getSleeveDescription = () => {
    switch (sleeveStyle) {
      case 'full':
        return 'Full length sleeves';
      case 'elbow':
        return '3/4 length (elbow) sleeves';
      case 'short':
        return 'Short sleeves';
      case 'sleeveless':
        return 'No sleeves';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid lg:grid-cols-[1fr_380px] gap-4 sm:gap-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-8">
          <div className="mb-4 sm:mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-2xl font-bold text-gray-800">Design Canvas</h3>
                <p className="text-xs sm:text-sm text-gray-500">{dressType} • {getSleeveDescription()}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleUndo}
                disabled={!canUndo}
                className="p-2 sm:p-3 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title="Undo"
              >
                <Undo size={18} />
              </button>
              <button
                onClick={handleRedo}
                disabled={!canRedo}
                className="p-2 sm:p-3 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title="Redo"
              >
                <Redo size={18} />
              </button>
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 sm:p-3 bg-secondary text-white rounded-lg">
                  <Menu size={18} />
                </button>
              )}
            </div>
          </div>

          {/* SVG Canvas */}
          <div ref={containerRef} className="flex justify-center bg-gray-100 rounded-xl p-4 sm:p-8">
            <svg
              ref={svgRef}
              viewBox={template.viewBox}
              className="w-full max-w-md rounded-xl"
              style={{ maxHeight: '600px' }}
            >
              <defs>
                {Object.entries(zonePatterns).map(([zoneId, pattern]) => (
                  <pattern
                    key={zoneId}
                    id={`pattern-${zoneId}`}
                    x="0"
                    y="0"
                    width="100"
                    height="100"
                    patternUnits="userSpaceOnUse"
                  >
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
                      transition: 'all 0.3s ease',
                      opacity: selectedZone === zone.id ? 0.9 : 1,
                      clipPath: sleeveVis.clipPath || 'none'
                    }}
                    className="hover:opacity-80"
                  />
                );
              })}
            </svg>
          </div>

          {/* Zone Selection */}
          <div className="mt-4 sm:mt-6">
            <h4 className="text-xs sm:text-sm font-bold text-gray-600 mb-2 sm:mb-3 uppercase">Select Area to Customize</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {template.zones.filter(zone => getSleeveVisibility(zone.id).visible).map(zone => (
                <button
                  key={zone.id}
                  onClick={() => handleZoneClick(zone.id)}
                  className={`p-2 sm:p-3 rounded-lg border-2 transition-all text-xs font-semibold ${selectedZone === zone.id
                    ? 'border-secondary/90 shadow-lg'
                    : 'border-gray-200 hover:border-background'
                    }`}
                >
                  {zone.label}
                </button>
              ))}
            </div>
          </div>

          {selectedZone && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-r from-background to-background/80 rounded-xl border-2 border-secondary flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <CheckCircle2 size={20} className="text-secondary" />
                <span className="text-xs sm:text-sm font-semibold text-gray-700">
                  Editing: {template.zones.find(z => z.id === selectedZone)?.label}
                </span>
              </div>
              <button
                onClick={clearZone}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-all text-xs font-semibold flex items-center gap-1"
              >
                <Trash2 size={14} />
                <span>Clear</span>
              </button>
            </div>
          )}

          {Object.keys(embroideryMetadata).length > 0 && (
            <div className="mt-4 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
              <h4 className="font-bold text-sm text-amber-900 mb-2">Applied Embroidery</h4>
              {Object.entries(embroideryMetadata).map(([zoneId, data]) => (
                <div key={zoneId} className="text-xs text-amber-800 mb-1">
                  • {data.zoneName}: {EMBROIDERY_PATTERNS[data.type].name}
                </div>
              ))}
            </div>
          )}

          {sleeveStyle !== 'full' && template.zones.some(z => z.id.includes('sleeve')) && (
            <div className="mt-4 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-xs text-blue-800 font-semibold flex items-center gap-2">
                <Info size={14} />
                {getSleeveDescription()} applied
              </p>
            </div>
          )}
        </div>

        {/* Tools Sidebar */}
        <div className={`
          ${isMobile ? 'fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300' : 'relative'}
          ${isMobile && !sidebarOpen ? 'translate-y-full' : 'translate-y-0'}
          bg-white rounded-t-3xl lg:rounded-2xl shadow-2xl border border-gray-200 
          ${isMobile ? 'max-h-[80vh] overflow-y-auto' : 'p-6 space-y-6'}
        `}>
          {isMobile && (
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between rounded-t-3xl">
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

          <div className={isMobile ? 'p-4 space-y-6' : 'space-y-6'}>
            <div className="flex gap-2 p-1.5 bg-gray-100 rounded-xl text-xs">
              {['styles', 'embroidery', 'prints'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-3 py-2.5 rounded-lg font-bold transition-all capitalize ${activeTab === tab ? 'bg-secondary text-white' : 'text-gray-600'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'styles' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-sm uppercase text-gray-600 mb-3 flex items-center gap-2">
                    <Palette size={14} className="text-secondary" />
                    Base Color
                  </h4>
                  <div className="rounded-xl p-4 border-2 border-secondary">
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={currentColor}
                        onChange={(e) => {
                          const color = e.target.value;
                          setCurrentColor(color);

                          if (selectedZone) {
                            setZoneColors(prev => ({
                              ...prev,
                              [selectedZone]: color
                            }));
                          }

                          saveToHistory();
                        }}
                        className="w-20 h-20 rounded-xl cursor-pointer border-2 border-white shadow-lg"
                      />
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Hex Code</label>
                        <input
                          type="text"
                          value={currentColor}
                          onChange={(e) => {
                            const color = e.target.value;
                            setCurrentColor(color);

                            if (selectedZone) {
                              setZoneColors(prev => ({
                                ...prev,
                                [selectedZone]: color
                              }));
                            }

                            saveToHistory();
                          }}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-secondary focus:outline-none font-mono text-sm"
                        />
                      </div>
                    </div>

                    {selectedZone && (
                      <button
                        onClick={() => applyColorToZone(currentColor)}
                        className="w-full mt-4 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary transition-all font-semibold text-sm"
                      >
                        Apply to {template.zones.find(z => z.id === selectedZone)?.label}
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm uppercase text-gray-600 mb-3">Neckline Style</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {getAvailableNecklines().map(style => (
                      <button
                        key={style.value}
                        onClick={() => {
                          setNeckStyle(style.value);
                          saveToHistory();
                        }}
                        className={`p-3 rounded-lg border-2 transition-all text-xs font-semibold ${neckStyle === style.value ? 'border-secondary' : 'border-gray-200'
                          }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Only show sleeve options if dress has sleeves */}
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
                          className={`p-3 rounded-lg border-2 transition-all text-xs font-semibold ${sleeveStyle === style.value ? 'border-secondary' : 'border-gray-200'
                            }`}
                        >
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
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                      <p className="text-xs text-amber-800 font-semibold flex items-center gap-2">
                        <Info size={14} />
                        Select embroidery style for the selected zone
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {Object.entries(EMBROIDERY_PATTERNS).map(([key, config]) => {
                        const patternCanvas = config.createPattern();
                        return (
                          <button
                            key={key}
                            onClick={() => applyEmbroidery(key)}
                            className="group p-4 rounded-xl border-2 border-gray-200 hover:border-secondary hover:shadow-lg transition-all flex items-center gap-4"
                          >
                            <div className="w-16 h-16 rounded-lg border-2 border-gray-200 overflow-hidden bg-white shadow-inner">
                              <img src={patternCanvas.toDataURL()} alt={config.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="text-left flex-1">
                              <div className="text-sm font-semibold text-gray-800 mb-1">{config.name}</div>
                              <div className="text-xs text-gray-500">{config.note}</div>
                            </div>
                            <CheckCircle2 size={20} className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Move size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-sm text-gray-500">Select a zone first</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'prints' && (
              <div className="space-y-4">
                {selectedZone ? (
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(FABRIC_PRINTS).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => applyFabricPrint(key)}
                        className="group p-4 rounded-xl border-2 border-gray-200 hover:border-secondary hover:shadow-lg transition-all flex items-center gap-4"
                      >
                        <div className="w-16 h-16 rounded-lg border-2 border-gray-200 overflow-hidden bg-white shadow-inner">
                          <img
                            src={config.img}
                            alt={config.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="text-left flex-1">
                          <div className="text-sm font-semibold text-gray-800">
                            {config.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {config.description}
                          </div>
                        </div>

                        <CheckCircle2
                          size={20}
                          className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
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