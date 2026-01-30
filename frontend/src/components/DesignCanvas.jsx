import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Palette, Trash2, Undo, Redo,
  Move, Info, Settings, CheckCircle2, X, Menu, MessageCircle, AlertTriangle, Lightbulb, ChevronDown, ChevronUp, Wand2
} from 'lucide-react';
import {
  SVG_TEMPLATES,
  EMBROIDERY_PATTERNS as IMPORTED_EMBROIDERY,
  FABRIC_PRINTS as IMPORTED_PRINTS
} from '../data/svg_templates';
import { toast } from 'react-toastify';

// EMBROIDERY PATTERNS & FABRIC PRINTS
const EMBROIDERY_PATTERNS = IMPORTED_EMBROIDERY;
const FABRIC_PRINTS = IMPORTED_PRINTS;

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

// FABRIC CHARACTERISTICS DATABASE
const FABRIC_DATABASE = {
  'Cotton': {
    weight: 'light',
    drape: 'structured',
    occasion: ['casual', 'daily'],
    bestFor: ['summer', 'daily wear'],
    embroideryCompatible: ['threadWork', 'chikankari'],
    printCompatible: ['block', 'bagru', 'kalamkari'],
    care: 'easy',
    characteristics: 'breathable, comfortable, easy to maintain'
  },
  'Silk': {
    weight: 'medium-heavy',
    drape: 'flowing',
    occasion: ['formal', 'wedding', 'festive'],
    bestFor: ['special occasions', 'traditional events'],
    embroideryCompatible: ['zardosi', 'maggam', 'threadWork'],
    printCompatible: ['painting', 'floral'],
    care: 'delicate',
    characteristics: 'luxurious, rich sheen, elegant drape'
  },
  'Georgette': {
    weight: 'light',
    drape: 'flowing',
    occasion: ['formal', 'party', 'festive'],
    bestFor: ['evening wear', 'parties'],
    embroideryCompatible: ['sequins', 'threadWork'],
    printCompatible: ['floral', 'painting'],
    care: 'moderate',
    characteristics: 'sheer, lightweight, elegant flow'
  },
  'Chiffon': {
    weight: 'very light',
    drape: 'flowing',
    occasion: ['formal', 'party'],
    bestFor: ['summer events', 'light occasions'],
    embroideryCompatible: ['sequins'],
    printCompatible: ['floral', 'painting'],
    care: 'delicate',
    characteristics: 'transparent, delicate, airy'
  },
  'Chanderi': {
    weight: 'light',
    drape: 'structured',
    occasion: ['festive', 'traditional'],
    bestFor: ['traditional events', 'festivals'],
    embroideryCompatible: ['threadWork', 'chikankari'],
    printCompatible: ['block', 'kalamkari'],
    care: 'moderate',
    characteristics: 'glossy transparency, traditional appeal'
  },
  'Linen': {
    weight: 'medium',
    drape: 'structured',
    occasion: ['casual', 'daily'],
    bestFor: ['summer', 'casual wear'],
    embroideryCompatible: ['threadWork'],
    printCompatible: ['block', 'bagru'],
    care: 'easy',
    characteristics: 'crisp, breathable, wrinkle-prone'
  },
  'Velvet': {
    weight: 'heavy',
    drape: 'structured',
    occasion: ['winter', 'wedding', 'festive'],
    bestFor: ['winter weddings', 'royal events'],
    embroideryCompatible: ['zardosi', 'maggam'],
    printCompatible: [],
    care: 'difficult',
    characteristics: 'rich texture, warm, luxurious'
  },
  'Rayon': {
    weight: 'light-medium',
    drape: 'flowing',
    occasion: ['casual', 'daily', 'party'],
    bestFor: ['daily wear', 'casual events'],
    embroideryCompatible: ['threadWork'],
    printCompatible: ['floral', 'painting', 'block'],
    care: 'easy',
    characteristics: 'soft, affordable, versatile'
  }
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
  const [printMetadata, setPrintMetadata] = useState({});
  const [sleeveStyle, setSleeveStyle] = useState('full');
  const [initialized, setInitialized] = useState(false);

  // Separate color states for embroidery and prints
  const [selectedEmbroideryColor, setSelectedEmbroideryColor] = useState('#ec4899');
  const [selectedPrintColor, setSelectedPrintColor] = useState('#DC2626');

  // AI TEXT COMMAND EDITOR STATES
  const [aiCommandMode, setAiCommandMode] = useState(false);
  const [aiCommand, setAiCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);

  // AI HELPER STATES
  const [aiHelperMode, setAiHelperMode] = useState(false);
  const [aiHelperPrompt, setAiHelperPrompt] = useState('');
  const [aiHelperLoading, setAiHelperLoading] = useState(false);
  const [aiHelperResponse, setAiHelperResponse] = useState(null);

  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Get template
  const rawTemplate = SVG_TEMPLATES[dressType] || SVG_TEMPLATES.Kurta;
  const template = {
    ...rawTemplate,
    zones: getEssentialZones(rawTemplate.zones, dressType)
  };

  // ===========================
  // INTELLIGENT PRE-SUGGESTIONS
  // ===========================

  const getSmartSuggestions = () => {
    const fabricInfo = FABRIC_DATABASE[fabric] || FABRIC_DATABASE['Cotton'];
    const suggestions = [];

    // Dress type specific suggestions
    if (dressType === 'Kurta' || dressType === 'Kurti') {
      suggestions.push('make body red', 'add chikankari to body', 'full sleeve');
    } else if (dressType === 'Lehenga') {
      suggestions.push('make skirt maroon', 'add zardosi to blouse', 'make border gold');
    } else if (dressType === 'Anarkali') {
      suggestions.push('make body burgundy', 'add maggam to bodice', 'make flare gold');
    } else if (dressType === 'Sherara') {
      suggestions.push('make top teal', 'add threadwork to top', 'make pants matching');
    }

    // Fabric specific embroidery
    if (fabricInfo.embroideryCompatible) {
      const firstCompatible = fabricInfo.embroideryCompatible[0];
      suggestions.push(`add ${firstCompatible} to body`);
    }

    // Fabric specific prints
    if (fabricInfo.printCompatible && fabricInfo.printCompatible.length > 0) {
      const firstPrint = fabricInfo.printCompatible[0];
      suggestions.push(`add ${firstPrint} print`);
    }

    // Occasion based colors
    if (fabricInfo.occasion.includes('wedding') || fabricInfo.occasion.includes('festive')) {
      suggestions.push('make everything maroon', 'change sleeves to gold');
    } else if (fabricInfo.occasion.includes('casual')) {
      suggestions.push('make everything blue', 'change sleeves to white');
    }

    // Remove duplicates and return top 6
    return [...new Set(suggestions)].slice(0, 6);
  };

  // ===========================
  // TEXT COMMAND EDITOR LOGIC
  // ===========================

  const parseAndExecuteCommand = (command) => {
    const lowerCommand = command.toLowerCase().trim();

    if (!lowerCommand) {
      toast.error('Please enter a command');
      return;
    }

    let executed = false;

    // SLEEVE STYLE COMMANDS
    if (lowerCommand.includes('full sleeve') || lowerCommand.includes('long sleeve')) {
      setSleeveStyle('full');
      toast.success('Changed to full sleeves');
      executed = true;
    } else if (lowerCommand.includes('half sleeve') || lowerCommand.includes('elbow') || lowerCommand.includes('3/4')) {
      setSleeveStyle('elbow');
      toast.success('Changed to elbow length sleeves');
      executed = true;
    } else if (lowerCommand.includes('short sleeve')) {
      setSleeveStyle('short');
      toast.success('Changed to short sleeves');
      executed = true;
    } else if (lowerCommand.includes('sleeveless') || lowerCommand.includes('no sleeve')) {
      setSleeveStyle('sleeveless');
      toast.success('Changed to sleeveless');
      executed = true;
    }

    // COLOR COMMANDS
    if (!executed) {
      for (const [colorName, hexCode] of Object.entries(COLOR_MAP)) {
        if (lowerCommand.includes(colorName)) {

          // Make everything [color]
          if (lowerCommand.includes('everything') || lowerCommand.includes('all')) {
            const updatedColors = {};
            template.zones.forEach(zone => {
              updatedColors[zone.id] = hexCode;
            });
            setZoneColors(updatedColors);
            setCurrentColor(hexCode);
            toast.success(`Applied ${colorName} to all zones`);
            executed = true;
            break;
          }

          // Zone-specific color changes
          const zoneKeywords = {
            body: ['body', 'bodice', 'top'],
            sleeve: ['sleeve', 'sleeves'],
            neck: ['neck', 'neckline', 'collar'],
            skirt: ['skirt'],
            blouse: ['blouse'],
            border: ['border'],
            waist: ['waist'],
            flare: ['flare'],
            pants: ['pants', 'bottom']
          };

          for (const [zoneType, keywords] of Object.entries(zoneKeywords)) {
            if (keywords.some(keyword => lowerCommand.includes(keyword))) {
              // Find actual zones matching this type
              const matchingZones = template.zones.filter(z =>
                keywords.some(kw => z.id.toLowerCase().includes(kw))
              );

              if (matchingZones.length > 0) {
                const updates = {};
                matchingZones.forEach(zone => {
                  updates[zone.id] = hexCode;
                });
                setZoneColors(prev => ({ ...prev, ...updates }));
                toast.success(`Changed ${zoneType} to ${colorName}`);
                executed = true;
                break;
              }
            }
          }

          // If no specific zone mentioned, change base color
          if (!executed && !Object.values(zoneKeywords).flat().some(kw => lowerCommand.includes(kw))) {
            setCurrentColor(hexCode);
            toast.success(`Changed base color to ${colorName}`);
            executed = true;
          }

          if (executed) break;
        }
      }
    }

    // EMBROIDERY COMMANDS
    if (!executed) {
      const embroideryPatterns = Object.keys(EMBROIDERY_PATTERNS);
      for (const pattern of embroideryPatterns) {
        if (lowerCommand.includes(pattern.toLowerCase())) {

          // Determine target zones
          let targetZones = [];

          const zoneKeywords = {
            body: ['body', 'bodice', 'top'],
            sleeve: ['sleeve', 'sleeves'],
            neck: ['neck', 'neckline', 'collar'],
            skirt: ['skirt'],
            blouse: ['blouse']
          };

          for (const [zoneType, keywords] of Object.entries(zoneKeywords)) {
            if (keywords.some(keyword => lowerCommand.includes(keyword))) {
              const matchingZones = template.zones.filter(z =>
                keywords.some(kw => z.id.toLowerCase().includes(kw))
              );
              targetZones.push(...matchingZones.map(z => z.id));
            }
          }

          // If no specific zone, apply to body/bodice
          if (targetZones.length === 0) {
            const bodyZones = template.zones.filter(z =>
              z.id.toLowerCase().includes('body') || z.id.toLowerCase().includes('bodice')
            );
            targetZones = bodyZones.map(z => z.id);
          }

          // Apply embroidery
          if (targetZones.length > 0) {
            targetZones.forEach(zoneId => {
              const embPattern = EMBROIDERY_PATTERNS[pattern];
              if (embPattern) {
                const patternCanvas = embPattern.createPattern(selectedEmbroideryColor);
                const patternUrl = patternCanvas.toDataURL();

                setZonePatterns(prev => ({
                  ...prev,
                  [zoneId]: { type: 'embroidery', url: patternUrl }
                }));

                setEmbroideryMetadata(prev => ({
                  ...prev,
                  [zoneId]: {
                    type: pattern,
                    zone: zoneId,
                    zoneName: template.zones.find(z => z.id === zoneId)?.label,
                    density: embPattern.density,
                    threadColor: selectedEmbroideryColor,
                    appliedAt: new Date().toISOString()
                  }
                }));
              }
            });

            toast.success(`Added ${pattern} embroidery`);
            executed = true;
            break;
          }
        }
      }
    }

    // PRINT COMMANDS
    if (!executed) {
      const printPatterns = Object.keys(FABRIC_PRINTS);
      for (const printKey of printPatterns) {
        if (lowerCommand.includes(printKey.toLowerCase())) {

          let targetZones = [];

          const zoneKeywords = {
            body: ['body', 'bodice', 'top'],
            sleeve: ['sleeve', 'sleeves'],
            skirt: ['skirt']
          };

          for (const [zoneType, keywords] of Object.entries(zoneKeywords)) {
            if (keywords.some(keyword => lowerCommand.includes(keyword))) {
              const matchingZones = template.zones.filter(z =>
                keywords.some(kw => z.id.toLowerCase().includes(kw))
              );
              targetZones.push(...matchingZones.map(z => z.id));
            }
          }

          if (targetZones.length === 0) {
            const bodyZones = template.zones.filter(z =>
              z.id.toLowerCase().includes('body') || z.id.toLowerCase().includes('bodice')
            );
            targetZones = bodyZones.map(z => z.id);
          }

          if (targetZones.length > 0) {
            targetZones.forEach(zoneId => {
              const print = FABRIC_PRINTS[printKey];
              if (print && print.createPattern) {
                const patternCanvas = print.createPattern(selectedPrintColor);
                const patternUrl = patternCanvas.toDataURL();

                setZonePatterns(prev => ({
                  ...prev,
                  [zoneId]: { type: 'print', url: patternUrl }
                }));

                setPrintMetadata(prev => ({
                  ...prev,
                  [zoneId]: {
                    type: printKey,
                    zone: zoneId,
                    zoneName: template.zones.find(z => z.id === zoneId)?.label,
                    printColor: selectedPrintColor,
                    appliedAt: new Date().toISOString()
                  }
                }));
              }
            });

            toast.success(`Added ${printKey} print`);
            executed = true;
            break;
          }
        }
      }
    }

    // REMOVE/CLEAR COMMANDS
    if (!executed && (lowerCommand.includes('remove') || lowerCommand.includes('clear'))) {
      if (lowerCommand.includes('embroidery')) {
        setZonePatterns(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(key => {
            if (updated[key].type === 'embroidery') {
              delete updated[key];
            }
          });
          return updated;
        });
        setEmbroideryMetadata({});
        toast.success('Removed all embroidery');
        executed = true;
      } else if (lowerCommand.includes('print')) {
        setZonePatterns(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(key => {
            if (updated[key].type === 'print') {
              delete updated[key];
            }
          });
          return updated;
        });
        setPrintMetadata({});
        toast.success('Removed all prints');
        executed = true;
      } else if (lowerCommand.includes('all') || lowerCommand.includes('everything')) {
        setZonePatterns({});
        setEmbroideryMetadata({});
        setPrintMetadata({});
        toast.success('Cleared all patterns');
        executed = true;
      }
    }

    if (executed) {
      setCommandHistory(prev => [...prev, command].slice(-10));
      setAiCommand('');
      saveToHistory();
    } else {
      toast.warning('Command not recognized. Try: "make body red" or "full sleeve"');
    }
  };

  // ===========================
  // AI HELPER LOGIC
  // ===========================

  const provideFallbackAnalysis = () => {
    const fabricInfo = FABRIC_DATABASE[fabric] || FABRIC_DATABASE['Cotton'];
    const uniqueColors = [...new Set(Object.values(zoneColors))];
    const embroideryTypes = Object.values(embroideryMetadata).map(e => e.type);

    const issues = [];
    const suggestions = [];

    if (uniqueColors.length > 4) {
      issues.push({
        severity: 'medium',
        issue: 'Too many colors may look busy',
        zone: 'overall'
      });
      suggestions.push({
        priority: 'medium',
        suggestion: 'Limit to 3-4 complementary colors',
        reasoning: 'Simpler palettes are more elegant'
      });
    }

    embroideryTypes.forEach(type => {
      if (!fabricInfo.embroideryCompatible.includes(type)) {
        issues.push({
          severity: 'high',
          issue: `${type} may not work well with ${fabric}`,
          zone: 'embroidery'
        });
        suggestions.push({
          priority: 'high',
          suggestion: `Use ${fabricInfo.embroideryCompatible[0]} instead`,
          reasoning: `${fabric} works better with lighter embroidery`
        });
      }
    });

    return {
      verdict: issues.length > 2 ? 'needs_improvement' : 'good',
      overallScore: Math.max(60, 90 - (issues.length * 10)),
      issues,
      suggestions: suggestions.length > 0 ? suggestions : [{
        priority: 'low',
        suggestion: 'Design looks balanced',
        reasoning: 'Good fabric and color choices'
      }],
      colorAnalysis: {
        harmony: uniqueColors.length <= 3 ? 'harmonious' : 'diverse',
        advice: ['Consider traditional color combinations']
      },
      fabricAdvice: {
        compatibility: 'good',
        recommendations: [fabricInfo.characteristics]
      },
      occasionMatch: {
        suitable: fabricInfo.occasion,
        bestTime: 'day'
      }
    };
  };

  const handleAIHelper = async () => {
    if (!aiHelperPrompt.trim()) {
      toast.error('Please describe what you need help with');
      return;
    }

    setAiHelperLoading(true);
    setAiHelperResponse(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const fallbackAnalysis = provideFallbackAnalysis();
      setAiHelperResponse(fallbackAnalysis);
      toast.success('AI design analysis completed!');
    } catch (error) {
      console.error('AI Helper Error:', error);
      const fallbackAnalysis = provideFallbackAnalysis();
      setAiHelperResponse(fallbackAnalysis);
      toast.warning('Using fallback analysis');
    } finally {
      setAiHelperLoading(false);
    }
  };

  // ===========================
  // REGULAR FUNCTIONS
  // ===========================

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
      printMetadata: { ...printMetadata },
      currentColor,
      sleeveStyle,
      selectedEmbroideryColor,
      selectedPrintColor
    };

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(state);
      return newHistory.slice(-50);
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [zoneColors, zonePatterns, embroideryMetadata, printMetadata, currentColor, sleeveStyle, selectedEmbroideryColor, selectedPrintColor, historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];

      setZoneColors(state.zoneColors);
      setZonePatterns(state.zonePatterns);
      setEmbroideryMetadata(state.embroideryMetadata);
      setPrintMetadata(state.printMetadata);
      setCurrentColor(state.currentColor);
      setSleeveStyle(state.sleeveStyle);
      setSelectedEmbroideryColor(state.selectedEmbroideryColor);
      setSelectedPrintColor(state.selectedPrintColor);
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
      setCurrentColor(state.currentColor);
      setSleeveStyle(state.sleeveStyle);
      setSelectedEmbroideryColor(state.selectedEmbroideryColor);
      setSelectedPrintColor(state.selectedPrintColor);
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
      threadColor: selectedEmbroideryColor,
      appliedAt: new Date().toISOString()
    };

    setEmbroideryMetadata(prev => ({
      ...prev,
      [selectedZone]: metadata
    }));

    const patternCanvas = pattern.createPattern(selectedEmbroideryColor);
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
    if (!print || !print.createPattern) return;

    // Use the selected print color instead of zone color
    const canvas = print.createPattern(selectedPrintColor);
    const url = canvas.toDataURL('image/png');

    setZonePatterns(prev => ({
      ...prev,
      [selectedZone]: {
        type: 'print',
        key: printKey,
        url,
        color: selectedPrintColor
      }
    }));

    setPrintMetadata(prev => ({
      ...prev,
      [selectedZone]: {
        type: printKey,
        zone: selectedZone,
        zoneName: template.zones.find(z => z.id === selectedZone)?.label,
        printColor: selectedPrintColor,
        appliedAt: new Date().toISOString()
      }
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

    setPrintMetadata(prev => {
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
          embroideryMetadata: Object.values(embroideryMetadata),
          printMetadata: Object.values(printMetadata)
        });
      }
    };

    exportDesign();
  }, [zoneColors, zonePatterns, currentColor, sleeveStyle, embroideryMetadata, printMetadata, onDesignChange, svgToPng]);

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

  const getSeverityBadge = (severity) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    };
    return colors[severity] || colors.low;
  };

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
                  setAiCommandMode(!aiCommandMode);
                  setAiHelperMode(false);
                }}
                className={`p-2 rounded-lg transition-all ${aiCommandMode
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  }`}
                title="Quick Edit Commands">
                <Wand2 size={18} />
              </button>
              <button
                onClick={() => {
                  setAiHelperMode(!aiHelperMode);
                  setAiCommandMode(false);
                }}
                className={`p-2 rounded-lg transition-all ${aiHelperMode
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                title="AI Design Helper">
                <MessageCircle size={18} />
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

          {/* COLLAPSIBLE TEXT COMMAND EDITOR */}
          {aiCommandMode && (
            <div className="mb-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-5 border-2 border-indigo-300 shadow-md animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Wand2 size={20} className="text-indigo-600" />
                  <h4 className="font-bold text-indigo-900 text-lg">Quick Edit Commands</h4>
                </div>
                <button
                  onClick={() => setAiCommandMode(false)}
                  className="p-1 hover:bg-indigo-100 rounded transition-colors">
                  {aiCommandMode ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>

              <p className="text-xs text-indigo-700 mb-4">
                Type commands like "make body red" or "full sleeve" for instant edits
              </p>

              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={aiCommand}
                    onChange={(e) => setAiCommand(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && aiCommand.trim()) {
                        parseAndExecuteCommand(aiCommand);
                      }
                    }}
                    placeholder='Type: "make body red" or "full sleeve"'
                    className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:border-indigo-400 focus:outline-none text-sm pr-20"
                  />
                  <button
                    onClick={() => parseAndExecuteCommand(aiCommand)}
                    disabled={!aiCommand.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold">
                    Apply
                  </button>
                </div>

                {/* Smart Suggestions Based on Dress Type & Fabric */}
                <div>
                  <p className="text-xs font-semibold text-indigo-800 mb-2">💡 Suggested for {dressType} in {fabric}:</p>
                  <div className="flex flex-wrap gap-2">
                    {getSmartSuggestions().map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => parseAndExecuteCommand(suggestion)}
                        className="px-3 py-1.5 bg-white border-2 border-indigo-200 rounded-full text-xs text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 transition-all font-medium">
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Command History */}
                {commandHistory.length > 0 && (
                  <div>
                    <p className="text-xs text-indigo-600 mb-1">Recent commands:</p>
                    <div className="flex flex-wrap gap-1">
                      {commandHistory.slice(-5).reverse().map((cmd, idx) => (
                        <button
                          key={idx}
                          onClick={() => parseAndExecuteCommand(cmd)}
                          className="px-2 py-0.5 bg-indigo-100 rounded text-xs text-indigo-700 hover:bg-indigo-200">
                          {cmd}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI HELPER MODE */}
          {aiHelperMode && (
            <div className="mb-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-5 border-2 border-blue-300 shadow-md animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MessageCircle size={20} className="text-blue-600" />
                  <h4 className="font-bold text-blue-900 text-lg">AI Design Helper</h4>
                </div>
                <button
                  onClick={() => setAiHelperMode(false)}
                  className="p-1 hover:bg-blue-100 rounded transition-colors">
                  <ChevronUp size={20} />
                </button>
              </div>

              <p className="text-xs text-blue-700 mb-4 leading-relaxed">
                Get expert advice on your design! Ask about colors, fabric suitability, or occasion appropriateness.
              </p>

              <div className="space-y-3">
                <textarea
                  value={aiHelperPrompt}
                  onChange={(e) => setAiHelperPrompt(e.target.value)}
                  placeholder="Examples:
• Is this design suitable for a wedding?
• Does this color scheme work well?
• Any suggestions to make this more elegant?"
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none text-sm resize-none"
                  rows="4"
                  disabled={aiHelperLoading}
                />

                <button
                  onClick={handleAIHelper}
                  disabled={aiHelperLoading || !aiHelperPrompt.trim()}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm flex items-center justify-center gap-2 transition-all">
                  {aiHelperLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Analyzing Design...</span>
                    </>
                  ) : (
                    <>
                      <Lightbulb size={18} />
                      <span>Get AI Advice</span>
                    </>
                  )}
                </button>
              </div>

              {/* AI HELPER RESPONSE DISPLAY */}
              {aiHelperResponse && (
                <div className="mt-5 bg-white rounded-lg p-5 border-2 border-blue-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <div>
                      <h5 className="font-bold text-gray-900 text-base">Overall Assessment</h5>
                      <p className="text-sm text-gray-600 capitalize mt-1">{aiHelperResponse.verdict}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">{aiHelperResponse.overallScore}</div>
                      <div className="text-xs text-gray-500">Score</div>
                    </div>
                  </div>

                  {aiHelperResponse.issues && aiHelperResponse.issues.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={16} className="text-orange-600" />
                        <h6 className="font-bold text-gray-800 text-sm">Issues to Address</h6>
                      </div>
                      <div className="space-y-2">
                        {aiHelperResponse.issues.map((issue, idx) => (
                          <div key={idx} className="flex gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityBadge(issue.severity)} h-fit`}>
                              {issue.severity}
                            </span>
                            <div className="flex-1">
                              <p className="text-sm text-gray-800">{issue.issue}</p>
                              {issue.zone && (
                                <p className="text-xs text-gray-500 mt-1">Zone: {issue.zone}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {aiHelperResponse.suggestions && aiHelperResponse.suggestions.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Lightbulb size={16} className="text-green-600" />
                        <h6 className="font-bold text-gray-800 text-sm">Recommendations</h6>
                      </div>
                      <div className="space-y-2">
                        {aiHelperResponse.suggestions.map((suggestion, idx) => (
                          <div key={idx} className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-start gap-2">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                                {suggestion.priority}
                              </span>
                              <div className="flex-1">
                                <p className="text-sm text-gray-800 font-medium">{suggestion.suggestion}</p>
                                {suggestion.reasoning && (
                                  <p className="text-xs text-gray-600 mt-1 italic">{suggestion.reasoning}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
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
                    {/* Base color layer */}
                    <path
                      d={zone.path}
                      fill={getZoneColor(zone.id)}
                      stroke="none"
                      style={{
                        clipPath: sleeveVis.clipPath || 'none'
                      }}
                    />

                    {/* Pattern layer on top */}
                    {hasPattern?.type === 'print' && (
                      <path
                        d={zone.path}
                        fill={`url(#pattern-${zone.id})`}
                        opacity="0.85"
                        style={{
                          mixBlendMode: 'multiply'
                        }}
                      />
                    )}

                    {/* Embroidery overlay */}
                    {hasPattern?.type === 'embroidery' && (
                      <path
                        d={zone.path}
                        fill={`url(#pattern-${zone.id})`}
                        opacity="0.9"
                      />
                    )}

                    {/* Stroke/border layer */}
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
                <div key={zoneId} className="text-xs text-amber-800 mb-1 flex items-center gap-2">
                  <span>{data.zoneName}: {EMBROIDERY_PATTERNS[data.type].name}</span>
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
                  <span>{data.zoneName}: {FABRIC_PRINTS[data.type].name}</span>
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: data.printColor }}
                    title={`Print color: ${data.printColor}`}
                  />
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

                    {/* Embroidery Color Picker */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h5 className="font-bold text-xs uppercase text-gray-600 mb-3">Embroidery Thread Color</h5>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={selectedEmbroideryColor}
                          onChange={(e) => {
                            setSelectedEmbroideryColor(e.target.value);
                          }}
                          className="w-12 h-12 rounded-lg cursor-pointer border-2 border-white shadow-md"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={selectedEmbroideryColor}
                            onChange={(e) => setSelectedEmbroideryColor(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-secondary focus:outline-none font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(EMBROIDERY_PATTERNS).map(([key, config]) => {
                        const patternCanvas = config.createPattern(selectedEmbroideryColor);
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
                  <>
                    {/* Print Color Picker */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h5 className="font-bold text-xs uppercase text-gray-600 mb-3">Print Color</h5>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={selectedPrintColor}
                          onChange={(e) => {
                            setSelectedPrintColor(e.target.value);
                          }}
                          className="w-12 h-12 rounded-lg cursor-pointer border-2 border-white shadow-md"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={selectedPrintColor}
                            onChange={(e) => setSelectedPrintColor(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-secondary focus:outline-none font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(FABRIC_PRINTS).map(([key, config]) => {
                        const previewCanvas = config.createPattern(selectedPrintColor);
                        return (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignCanvas;