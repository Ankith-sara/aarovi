import React, { useEffect, useRef, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import {
  Upload, Palette, Type, Trash2, Undo, Redo, Sparkles,
  Image as ImageIcon, Move, Info, Download, Settings, CheckCircle2, Wand2,
  ChevronDown, ChevronUp, X, Menu
} from 'lucide-react';
import { assets } from '../assets/assets';

// ============================================================================
// HELPER FUNCTIONS & DATA
// ============================================================================

const DRESS_TEMPLATES = {
  'Kurti': assets.kurti_img,
  'Kurti Sets': assets.kurtiset_img,
  'Kurta': assets.kurta_img,
  'Kurta Sets': assets.kurtaset_img,
  'Lehenga': assets.lehenga_img,
  'Anarkali': assets.anarkali_img,
  'Sherwani': assets.sherwani_img,
  'Sheraras': assets.sherara_img
};

// Percentage-based zones (relative to garment image)
const ZONES = {
  Kurti: [
    { id: 'neck', label: 'Neck Area', x: 0.45, y: 0.22, width: 0.10, height: 0.057, color: '#e0e7ff' },
    { id: 'chest', label: 'Chest', x: 0.383, y: 0.286, width: 0.233, height: 0.171, color: '#fce7f3' },
    { id: 'waist', label: 'Waist', x: 0.383, y: 0.471, width: 0.233, height: 0.157, color: '#ddd6fe' },
    { id: 'hem', label: 'Border', x: 0.375, y: 0.686, width: 0.25, height: 0.043, color: '#fed7aa' },
    { id: 'sleeve_left', label: 'Left Sleeve', x: 0.25, y: 0.30, width: 0.10, height: 0.20, color: '#fef3c7' },
    { id: 'sleeve_right', label: 'Right Sleeve', x: 0.65, y: 0.30, width: 0.10, height: 0.20, color: '#fef3c7' }
  ],
  'Kurti Sets': [
    { id: 'neck', label: 'Neck Area', x: 0.45, y: 0.22, width: 0.10, height: 0.057, color: '#e0e7ff' },
    { id: 'chest', label: 'Chest', x: 0.383, y: 0.286, width: 0.233, height: 0.171, color: '#fce7f3' },
    { id: 'waist', label: 'Waist', x: 0.383, y: 0.471, width: 0.233, height: 0.157, color: '#ddd6fe' },
    { id: 'hem', label: 'Border', x: 0.375, y: 0.686, width: 0.25, height: 0.043, color: '#fed7aa' },
    { id: 'sleeve_left', label: 'Left Sleeve', x: 0.25, y: 0.30, width: 0.10, height: 0.20, color: '#fef3c7' },
    { id: 'sleeve_right', label: 'Right Sleeve', x: 0.65, y: 0.30, width: 0.10, height: 0.20, color: '#fef3c7' }
  ],
  Kurta: [
    { id: 'collar', label: 'Collar', x: 0.458, y: 0.236, width: 0.083, height: 0.036, color: '#e0e7ff' },
    { id: 'chest', label: 'Chest', x: 0.392, y: 0.30, width: 0.217, height: 0.20, color: '#fce7f3' },
    { id: 'waist', label: 'Waist', x: 0.392, y: 0.514, width: 0.217, height: 0.186, color: '#ddd6fe' },
    { id: 'lower', label: 'Lower', x: 0.392, y: 0.714, width: 0.217, height: 0.086, color: '#fed7aa' },
    { id: 'sleeve_left', label: 'Left Sleeve', x: 0.258, y: 0.314, width: 0.10, height: 0.229, color: '#fef3c7' },
    { id: 'sleeve_right', label: 'Right Sleeve', x: 0.642, y: 0.314, width: 0.10, height: 0.229, color: '#fef3c7' }
  ],
  'Kurta Sets': [
    { id: 'collar', label: 'Collar', x: 0.458, y: 0.236, width: 0.083, height: 0.036, color: '#e0e7ff' },
    { id: 'chest', label: 'Chest', x: 0.392, y: 0.30, width: 0.217, height: 0.20, color: '#fce7f3' },
    { id: 'waist', label: 'Waist', x: 0.392, y: 0.514, width: 0.217, height: 0.186, color: '#ddd6fe' },
    { id: 'lower', label: 'Lower', x: 0.392, y: 0.714, width: 0.217, height: 0.086, color: '#fed7aa' },
    { id: 'sleeve_left', label: 'Left Sleeve', x: 0.258, y: 0.314, width: 0.10, height: 0.229, color: '#fef3c7' },
    { id: 'sleeve_right', label: 'Right Sleeve', x: 0.642, y: 0.314, width: 0.10, height: 0.229, color: '#fef3c7' }
  ],
  Lehenga: [
    { id: 'blouse', label: 'Blouse', x: 0.392, y: 0.25, width: 0.217, height: 0.157, color: '#fce7f3' },
    { id: 'skirt_upper', label: 'Skirt Upper', x: 0.317, y: 0.457, width: 0.367, height: 0.20, color: '#ddd6fe' },
    { id: 'skirt_lower', label: 'Skirt Lower', x: 0.283, y: 0.671, width: 0.433, height: 0.143, color: '#e0e7ff' },
    { id: 'border', label: 'Border', x: 0.283, y: 0.833, width: 0.433, height: 0.021, color: '#fed7aa' }
  ],
  Anarkali: [
    { id: 'bodice', label: 'Bodice', x: 0.392, y: 0.25, width: 0.217, height: 0.186, color: '#fce7f3' },
    { id: 'waist', label: 'Waist Band', x: 0.383, y: 0.454, width: 0.233, height: 0.021, color: '#fed7aa' },
    { id: 'flare_upper', label: 'Upper Flare', x: 0.308, y: 0.493, width: 0.383, height: 0.186, color: '#ddd6fe' },
    { id: 'flare_lower', label: 'Lower Flare', x: 0.267, y: 0.693, width: 0.467, height: 0.15, color: '#e0e7ff' }
  ],
  Sherwani: [
    { id: 'collar', label: 'Collar', x: 0.442, y: 0.229, width: 0.117, height: 0.036, color: '#fef3c7' },
    { id: 'chest', label: 'Chest', x: 0.392, y: 0.286, width: 0.217, height: 0.243, color: '#fce7f3' },
    { id: 'waist', label: 'Waist', x: 0.392, y: 0.543, width: 0.217, height: 0.20, color: '#ddd6fe' },
    { id: 'lower', label: 'Lower Panel', x: 0.392, y: 0.757, width: 0.217, height: 0.086, color: '#e0e7ff' }
  ],
  Sheraras: [
    { id: 'blouse', label: 'Blouse', x: 0.392, y: 0.25, width: 0.217, height: 0.157, color: '#fce7f3' },
    { id: 'skirt_upper', label: 'Skirt Upper', x: 0.317, y: 0.457, width: 0.367, height: 0.20, color: '#ddd6fe' },
    { id: 'skirt_lower', label: 'Skirt Lower', x: 0.283, y: 0.671, width: 0.433, height: 0.143, color: '#e0e7ff' },
    { id: 'border', label: 'Border', x: 0.283, y: 0.833, width: 0.433, height: 0.021, color: '#fed7aa' }
  ]
};

const EMBROIDERY_PATTERNS = {
  maggam: {
    name: 'Maggam Work',
    note: 'Reference images required',
    density: 'heavy',
    threadColors: ['#d4af37', '#ec4899', '#10b981'],
    createPattern: (color = '#ec4899') => {
      const canvas = document.createElement('canvas');
      canvas.width = 70;
      canvas.height = 70;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(35, 35, 10, 0, Math.PI * 2);
      ctx.fill();

      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        const x = 35 + Math.cos(angle) * 20;
        const y = 35 + Math.sin(angle) * 20;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(35, 35);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      return canvas;
    }
  },
  machineEmbroidery: {
    name: 'Machine Embroidery',
    note: 'Reference images required',
    density: 'medium',
    threadColors: ['#10b981', '#3b82f6', '#8b5cf6'],
    createPattern: (color = '#10b981') => {
      const canvas = document.createElement('canvas');
      canvas.width = 50;
      canvas.height = 50;
      const ctx = canvas.getContext('2d');

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';

      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(10, 10 + i * 8);
        ctx.lineTo(40, 10 + i * 8);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(10, 10);
      ctx.lineTo(40, 40);
      ctx.moveTo(40, 10);
      ctx.lineTo(10, 40);
      ctx.stroke();

      return canvas;
    }
  }
};

const FABRIC_PRINTS = {
  blockPrint: {
    name: 'Block Prints',
    imageUrl: assets.block_img,
    thumbnail: assets.block_img,
    description: 'Traditional hand block printed pattern',
    defaultScale: 1,
    blendMode: 'multiply'
  },
  floral: {
    name: 'Floral',
    imageUrl: assets.floral_img,
    thumbnail: assets.floral_img,
    description: 'Beautiful floral print design',
    defaultScale: 1,
    blendMode: 'multiply'
  },
  shibori: {
    name: 'Shibori',
    imageUrl: assets.shibori_img,
    thumbnail: assets.shibori_img,
    description: 'Japanese tie-dye technique',
    defaultScale: 1,
    blendMode: 'overlay'
  },
  kalamkari: {
    name: 'Kalamkari',
    imageUrl: assets.kalamkari_img,
    thumbnail: assets.kalamkari_img,
    description: 'Ancient Indian art form',
    defaultScale: 1,
    blendMode: 'multiply'
  },
  painting: {
    name: 'Hand Painting',
    imageUrl: assets.painting_img,
    thumbnail: assets.painting_img,
    description: 'Artistic hand-painted design',
    defaultScale: 1,
    blendMode: 'overlay'
  },
  bagruPrint: {
    name: 'Bagru Prints',
    imageUrl: assets.bagru_img,
    thumbnail: assets.bagru_img,
    description: 'Traditional Rajasthani print',
    defaultScale: 1,
    blendMode: 'multiply'
  },
};

const PRINT_SCALE_VALUES = {
  small: 0.5,
  medium: 1,
  large: 1.5
};

// SVG Color Processing
const processSVGColor = async (url, newColor) => {
  try {
    const response = await fetch(url);
    let text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "image/svg+xml");
    const svgElement = xmlDoc.getElementsByTagName("svg")[0];
    const paths = xmlDoc.getElementsByTagName("path");
    const bgGroup = xmlDoc.createElementNS("http://www.w3.org/2000/svg", "g");
    bgGroup.setAttribute("id", "dress-body-fill");

    for (let i = 0; i < paths.length; i++) {
        const clone = paths[i].cloneNode(true);
        clone.setAttribute("fill", newColor); // The actual fabric color
        clone.setAttribute("opacity", "1");
        bgGroup.appendChild(clone);
    }

    svgElement.insertBefore(bgGroup, svgElement.firstChild);

    for (let i = 0; i < paths.length; i++) {
        if (paths[i].parentNode.id !== "dress-body-fill") {
            paths[i].setAttribute("fill", "rgba(0,0,0,0.2)"); // Subtle black outlines
        }
    }

    const serializer = new XMLSerializer();
    const modifiedSvg = serializer.serializeToString(xmlDoc);
    
    const blob = new Blob([modifiedSvg], { type: 'image/svg+xml' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error processing SVG:", error);
    return url;
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const DesignCanvas = ({
  onDesignChange,
  initialDesign = null,
  dressType = 'Kurti',
  selectedColor = '#ffffff',
  gender = 'Women',
  aiPrompt = '',
  onAIPromptChange,
  onAIGenerate,
  aiGenerating = false
}) => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const historyRef = useRef({ stack: [], pointer: -1 });
  const baseImageRef = useRef(null);
  const mountedRef = useRef(false);
  const blobUrlRef = useRef(null);

  const [neckStyle, setNeckStyle] = useState('round');
  const [sleeveStyle, setSleeveStyle] = useState('full');
  const [selectedZone, setSelectedZone] = useState(null);
  const [activeTab, setActiveTab] = useState('ai');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [templateLoaded, setTemplateLoaded] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentColor, setCurrentColor] = useState(selectedColor);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [printScale, setPrintScale] = useState('medium');
  const [embroideryMetadata, setEmbroideryMetadata] = useState({});

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Responsive canvas dimensions
  const getCanvasDimensions = () => {
    if (typeof window === 'undefined') return { width: 600, height: 700 };

    const width = window.innerWidth;
    if (width < 640) return { width: Math.min(width - 40, 400), height: Math.min(width - 40, 400) * 1.17 };
    if (width < 1024) return { width: 500, height: 583 };
    return { width: 600, height: 700 };
  };

  const [canvasDimensions, setCanvasDimensions] = useState(getCanvasDimensions());

  useEffect(() => {
    const handleResize = () => {
      setCanvasDimensions(getCanvasDimensions());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const CANVAS_WIDTH = canvasDimensions.width;
  const CANVAS_HEIGHT = canvasDimensions.height;

  const zones = ZONES[dressType] || ZONES.Kurti;

  const getAvailableNecklines = () => {
    if (gender === 'Men') {
      return [
        { value: 'collar', label: 'Collar Neck' },
        { value: 'round', label: 'Round Neck' }
      ];
    }
    return [
      { value: 'round', label: 'Round Neck' },
      { value: 'square', label: 'Square Neck' },
      { value: 'vNeck', label: 'V Neck' },
      { value: 'boat', label: 'Boat Neck' },
      { value: 'uNeck', label: 'U Neck' }
    ];
  };

  const sleeveOptions = [
    { value: 'full', label: 'Full' },
    { value: 'elbow', label: 'Elbow (3/4th)' },
    { value: 'short', label: 'Short' },
    { value: 'sleeveless', label: 'Sleeveless' }
  ];

  // Helper function to draw zones
  const drawZones = useCallback((canvas, img, scale) => {
    const imgWidth = img.width * scale;
    const imgHeight = img.height * scale;
    const imgLeft = img.left - (imgWidth / 2);
    const imgTop = img.top - (imgHeight / 2);

    zones.forEach(zone => {
      const zoneRect = new fabric.Rect({
        left: imgLeft + (zone.x * imgWidth),
        top: imgTop + (zone.y * imgHeight),
        width: zone.width * imgWidth,
        height: zone.height * imgHeight,
        fill: 'transparent',
        stroke: zone.color,
        strokeWidth: 0,
        strokeDashArray: [5, 3],
        selectable: false,
        evented: false,
        zoneId: zone.id,
        zonePercentX: zone.x,
        zonePercentY: zone.y,
        zonePercentWidth: zone.width,
        zonePercentHeight: zone.height,
        opacity: 0
      });
      canvas.add(zoneRect);
    });
  }, [zones]);

  const saveToHistory = useCallback((canvas, isInitial = false) => {
    if (!canvas || !mountedRef.current) return;

    try {
      const json = JSON.stringify(canvas.toJSON(['customZone', 'customType', 'zoneId', 'objectType', 'customEmbroideryType', 'customPrintKey', 'customPrintScale']));
      const { stack, pointer } = historyRef.current;

      if (stack[pointer] === json) return;

      const newStack = stack.slice(0, pointer + 1);
      newStack.push(json);
      if (newStack.length > 50) newStack.shift();

      historyRef.current = { stack: newStack, pointer: newStack.length - 1 };
      setCanUndo(historyRef.current.pointer > 0);
      setCanRedo(false);

      if (!isInitial) exportDesign(canvas);
    } catch (e) {
      console.error('History save error:', e);
    }
  }, []);

  const loadGarmentTemplate = useCallback(async (canvas, isColorUpdate = false) => {
    if (!canvas || !mountedRef.current) return;

    setImageLoading(true);

    const originalUrl = DRESS_TEMPLATES[dressType];

    // 1. Process SVG color
    const finalUrl = originalUrl.endsWith('.svg')
      ? await processSVGColor(originalUrl, selectedColor)
      : originalUrl;

    // 2. Clean up previous Blob URL to prevent memory leaks
    if (blobUrlRef.current && blobUrlRef.current !== finalUrl) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = finalUrl;

    // 3. Load the new image
    fabric.Image.fromURL(
      finalUrl,
      (img) => {
        if (!mountedRef.current || !canvas) return;

        const scale = Math.min(
          (CANVAS_WIDTH - 40) / img.width,
          (CANVAS_HEIGHT - 40) / img.height
        );

        img.set({
          scaleX: scale,
          scaleY: scale,
          left: CANVAS_WIDTH / 2,
          top: CANVAS_HEIGHT / 2,
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false,
          objectType: 'baseTemplate'
        });

        // 4. Update the Canvas without wiping everything
        if (isColorUpdate) {
          // Find and remove ONLY the old base template
          const oldTemplate = canvas.getObjects().find(obj => obj.objectType === 'baseTemplate');
          if (oldTemplate) canvas.remove(oldTemplate);
          
          canvas.add(img);
          img.sendToBack(); // Keep it behind embroidery/prints
        } else {
          // Change of Dress Type: Clear everything
          canvas.clear();
          canvas.backgroundColor = '#f5f5f5';
          canvas.add(img);
          drawZones(canvas, img, scale);
        }

        baseImageRef.current = img;
        canvas.renderAll();
        
        setImageLoading(false);
        setTemplateLoaded(true);

        if (!isColorUpdate) {
          saveToHistory(canvas, true);
        }
      },
      { crossOrigin: 'anonymous' }
    );
  }, [dressType, selectedColor, CANVAS_WIDTH, CANVAS_HEIGHT, drawZones, saveToHistory]);

  useEffect(() => {
    mountedRef.current = true;

    if (!canvasRef.current) return;

    if (fabricCanvasRef.current) {
      try {
        fabricCanvasRef.current.dispose();
      } catch (e) {
        console.warn('Canvas disposal warning:', e);
      }
      fabricCanvasRef.current = null;
    }

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: '#ffffff',
      selection: false,
      preserveObjectStacking: true,
    });

    fabricCanvasRef.current = canvas;
    loadGarmentTemplate(canvas, false);

    return () => {
      mountedRef.current = false;
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
      if (fabricCanvasRef.current) {
        try {
          fabricCanvasRef.current.dispose();
        } catch (e) {
          console.warn('Canvas cleanup warning:', e);
        }
        fabricCanvasRef.current = null;
      }
    };
  }, [dressType, CANVAS_WIDTH, CANVAS_HEIGHT, loadGarmentTemplate]);

  // Color change effect - FIXED: Remove templateLoaded requirement
  useEffect(() => {
    setCurrentColor(selectedColor);
    
    if (fabricCanvasRef.current && mountedRef.current) {
      // Trigger the template loader specifically for a color update
      // We don't wait for templateLoaded here because this IS the loader
      loadGarmentTemplate(fabricCanvasRef.current, true);
    }
  }, [selectedColor, loadGarmentTemplate]);

  const getZoneBounds = useCallback((zoneId) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !baseImageRef.current) return null;

    const img = baseImageRef.current;
    const scale = img.scaleX;
    const imgWidth = img.width * scale;
    const imgHeight = img.height * scale;
    const imgLeft = img.left - (imgWidth / 2);
    const imgTop = img.top - (imgHeight / 2);

    const zone = zones.find(z => z.id === zoneId);
    if (!zone) return null;

    return {
      left: imgLeft + (zone.x * imgWidth),
      top: imgTop + (zone.y * imgHeight),
      width: zone.width * imgWidth,
      height: zone.height * imgHeight
    };
  }, [zones]);

  const handleColorChange = useCallback((newColor) => {
    setCurrentColor(newColor);
    // Color update will trigger useEffect which reloads template
  }, []);

  const applyEmbroidery = useCallback((patternKey) => {
    if (!selectedZone || !fabricCanvasRef.current || !mountedRef.current) return;

    const canvas = fabricCanvasRef.current;
    const zoneBounds = getZoneBounds(selectedZone);
    if (!zoneBounds) return;

    const pattern = EMBROIDERY_PATTERNS[patternKey];
    if (!pattern) return;

    // Store metadata
    const metadata = {
      type: patternKey,
      zone: selectedZone,
      zoneName: zones.find(z => z.id === selectedZone)?.label,
      density: pattern.density,
      threadColor: pattern.threadColors[0],
      referenceRequired: true,
      appliedAt: new Date().toISOString()
    };

    setEmbroideryMetadata(prev => ({
      ...prev,
      [selectedZone]: metadata
    }));

    // Remove existing embroidery from zone
    const objectsToRemove = [];
    canvas.getObjects().forEach(obj => {
      if (obj.customZone === selectedZone && obj.customType === 'embroidery') {
        objectsToRemove.push(obj);
      }
    });
    objectsToRemove.forEach(obj => canvas.remove(obj));

    try {
      const patternCanvas = pattern.createPattern(pattern.threadColors[0]);
      const fabricPattern = new fabric.Pattern({
        source: patternCanvas,
        repeat: 'repeat'
      });

      const rect = new fabric.Rect({
        left: zoneBounds.left,
        top: zoneBounds.top,
        width: zoneBounds.width,
        height: zoneBounds.height,
        fill: fabricPattern,
        selectable: false,
        customZone: selectedZone,
        customType: 'embroidery',
        customEmbroideryType: patternKey,
        opacity: 0.6
      });

      canvas.add(rect);
      canvas.bringToFront(rect);
      canvas.renderAll();
      saveToHistory(canvas);
      exportDesign(canvas);

      if (isMobile) setSidebarOpen(false);
    } catch (e) {
      console.error('Embroidery application error:', e);
    }
  }, [selectedZone, zones, getZoneBounds, isMobile, saveToHistory]);

  const applyFabricPrint = useCallback((printKey) => {
    if (!selectedZone || !fabricCanvasRef.current || !mountedRef.current) return;

    const canvas = fabricCanvasRef.current;
    const zoneBounds = getZoneBounds(selectedZone);
    if (!zoneBounds) return;

    const objectsToRemove = [];
    canvas.getObjects().forEach(obj => {
      if (obj.customZone === selectedZone && obj.customType === 'print') {
        objectsToRemove.push(obj);
      }
    });
    objectsToRemove.forEach(obj => canvas.remove(obj));

    const print = FABRIC_PRINTS[printKey];
    if (!print) return;

    try {
      fabric.Image.fromURL(
        print.imageUrl,
        (img) => {
          if (!mountedRef.current) return;

          const patternScale = (print.defaultScale || 1) * PRINT_SCALE_VALUES[printScale];

          const patternCanvas = document.createElement('canvas');
          const patternSize = 1024 * patternScale;
          patternCanvas.width = patternSize;
          patternCanvas.height = patternSize;
          const ctx = patternCanvas.getContext('2d');
          ctx.drawImage(img.getElement(), 0, 0, patternSize, patternSize);

          const fabricPattern = new fabric.Pattern({
            source: patternCanvas,
            repeat: 'repeat'
          });

          const rect = new fabric.Rect({
            left: zoneBounds.left,
            top: zoneBounds.top,
            width: zoneBounds.width,
            height: zoneBounds.height,
            fill: fabricPattern,
            selectable: false,
            customZone: selectedZone,
            customType: 'print',
            customPrintKey: printKey,
            customPrintScale: printScale,
            opacity: 0.85,
            globalCompositeOperation: print.blendMode || 'multiply'
          });

          canvas.add(rect);

          if (baseImageRef.current) {
            canvas.sendToBack(baseImageRef.current);
          }

          canvas.getObjects().forEach(obj => {
            if (obj.customType === 'embroidery') {
              canvas.bringToFront(obj);
            }
          });

          canvas.renderAll();
          saveToHistory(canvas);
          exportDesign(canvas);

          if (isMobile) setSidebarOpen(false);
        },
        { crossOrigin: 'anonymous' }
      );
    } catch (e) {
      console.error('Print application error:', e);
    }
  }, [selectedZone, printScale, getZoneBounds, isMobile, saveToHistory]);

  const handleZoneSelect = useCallback((zoneId) => {
    setSelectedZone(zoneId);

    const canvas = fabricCanvasRef.current;
    if (!canvas || !mountedRef.current) return;

    canvas.getObjects().forEach(obj => {
      if (obj.zoneId) {
        if (obj.zoneId === zoneId) {
          obj.set({ opacity: 0.15, strokeWidth: 2 });
        } else {
          obj.set({ opacity: 0, strokeWidth: 0 });
        }
      }
    });

    canvas.renderAll();
  }, []);

  const clearZone = useCallback(() => {
    if (!selectedZone || !fabricCanvasRef.current || !mountedRef.current) return;

    const canvas = fabricCanvasRef.current;
    const objectsToRemove = [];

    canvas.getObjects().forEach(obj => {
      if (obj.customZone === selectedZone) {
        objectsToRemove.push(obj);
      }
    });

    objectsToRemove.forEach(obj => canvas.remove(obj));

    setEmbroideryMetadata(prev => {
      const updated = { ...prev };
      delete updated[selectedZone];
      return updated;
    });

    canvas.renderAll();
    saveToHistory(canvas);
    exportDesign(canvas);
  }, [selectedZone, saveToHistory]);

  const undo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !mountedRef.current || historyRef.current.pointer <= 0) return;

    const newPointer = historyRef.current.pointer - 1;
    historyRef.current.pointer = newPointer;

    try {
      canvas.loadFromJSON(JSON.parse(historyRef.current.stack[newPointer]), () => {
        if (mountedRef.current) {
          canvas.renderAll();
          setCanUndo(newPointer > 0);
          setCanRedo(true);
        }
      });
    } catch (e) {
      console.error('Undo error:', e);
    }
  }, []);

  const redo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !mountedRef.current || historyRef.current.pointer >= historyRef.current.stack.length - 1) return;

    const newPointer = historyRef.current.pointer + 1;
    historyRef.current.pointer = newPointer;

    try {
      canvas.loadFromJSON(JSON.parse(historyRef.current.stack[newPointer]), () => {
        if (mountedRef.current) {
          canvas.renderAll();
          setCanUndo(true);
          setCanRedo(newPointer < historyRef.current.stack.length - 1);
        }
      });
    } catch (e) {
      console.error('Redo error:', e);
    }
  }, []);

  const exportDesign = useCallback((canvas) => {
    if (!canvas || !onDesignChange || !mountedRef.current) return;

    try {
      const json = JSON.stringify(canvas.toJSON(['customZone', 'customType', 'zoneId', 'objectType', 'customEmbroideryType', 'customPrintKey', 'customPrintScale']));
      const png = canvas.toDataURL({ format: 'png', quality: 1 });
      const svg = canvas.toSVG();

      onDesignChange({
        json,
        png,
        svg,
        neckStyle,
        sleeveStyle,
        color: currentColor,
        embroideryMetadata: Object.values(embroideryMetadata)
      });
    } catch (e) {
      console.error('Export error:', e);
    }
  }, [onDesignChange, neckStyle, sleeveStyle, currentColor, embroideryMetadata]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid lg:grid-cols-[1fr_380px] gap-4 sm:gap-6">
        {/* Canvas Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-background/50 p-4 sm:p-8">
          <div className="mb-4 sm:mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles size={window.innerWidth < 640 ? 20 : 24} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-2xl font-serif font-bold text-text">Design Canvas</h3>
                <p className="text-xs sm:text-sm text-text/60 font-light">{dressType} Customization</p>
              </div>
            </div>

            <div className="flex gap-1.5 sm:gap-2">
              <button onClick={undo} disabled={!canUndo}
                className="p-2 sm:p-3 bg-background/30 hover:bg-background/50 rounded-lg sm:rounded-xl disabled:opacity-30 transition-all active:scale-95">
                <Undo size={window.innerWidth < 640 ? 16 : 18} />
              </button>
              <button onClick={redo} disabled={!canRedo}
                className="p-2 sm:p-3 bg-background/30 hover:bg-background/50 rounded-lg sm:rounded-xl disabled:opacity-30 transition-all active:scale-95">
                <Redo size={window.innerWidth < 640 ? 16 : 18} />
              </button>
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 sm:p-3 bg-secondary text-white rounded-lg sm:rounded-xl transition-all active:scale-95">
                  <Menu size={window.innerWidth < 640 ? 16 : 18} />
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-center bg-gradient-to-br from-background/10 to-white rounded-xl sm:rounded-2xl p-4 sm:p-8 relative">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl sm:rounded-2xl z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-secondary mx-auto mb-3 sm:mb-4"></div>
                  <p className="text-xs sm:text-sm text-text/50 font-light">
                    {templateLoaded ? 'Applying color...' : 'Loading template...'}
                  </p>
                </div>
              </div>
            )}
            <canvas ref={canvasRef} className="border-2 sm:border-4 border-white rounded-xl sm:rounded-2xl shadow-2xl max-w-full" />
          </div>

          <div className="mt-4 sm:mt-6">
            <h4 className="text-xs sm:text-sm font-bold text-text/70 mb-2 sm:mb-3 uppercase tracking-wide">Select Area to Customize</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {zones.map(zone => (
                <button
                  key={zone.id}
                  onClick={() => handleZoneSelect(zone.id)}
                  className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all text-[10px] sm:text-xs font-semibold active:scale-95 ${selectedZone === zone.id
                      ? 'border-secondary bg-secondary/10 shadow-lg'
                      : 'border-background/50 hover:border-secondary/50'
                    }`}
                >
                  {zone.label}
                </button>
              ))}
            </div>
          </div>

          {selectedZone && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-r from-background/20 to-background/5 rounded-xl sm:rounded-2xl border-2 border-secondary/30 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <CheckCircle2 size={window.innerWidth < 640 ? 16 : 20} className="text-secondary flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-text">
                  Editing: {zones.find(z => z.id === selectedZone)?.label}
                </span>
              </div>
              <button onClick={clearZone}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-all text-[10px] sm:text-xs font-semibold active:scale-95 flex items-center gap-1">
                <Trash2 size={window.innerWidth < 640 ? 12 : 14} />
                <span>Clear</span>
              </button>
            </div>
          )}

          {Object.keys(embroideryMetadata).length > 0 && (
            <div className="mt-4 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
              <h4 className="font-bold text-sm text-amber-900 mb-2">Applied Embroidery</h4>
              {Object.entries(embroideryMetadata).map(([zoneId, data]) => (
                <div key={zoneId} className="text-xs text-amber-800 mb-1">
                  • {data.zoneName}: {EMBROIDERY_PATTERNS[data.type].name} ({data.density})
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tools Sidebar - Same as before, keeping it complete */}
        <div className={`
          ${isMobile ? 'fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300' : 'relative'}
          ${isMobile && !sidebarOpen ? 'translate-y-full' : 'translate-y-0'}
          bg-white rounded-t-3xl lg:rounded-2xl shadow-2xl border border-background/50 
          ${isMobile ? 'max-h-[80vh] overflow-y-auto' : 'p-6 space-y-6 max-h-[800px] overflow-y-auto'}
        `}>
          {isMobile && (
            <div className="sticky top-0 bg-white border-b border-background/30 p-4 flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center gap-3">
                <Settings className="text-secondary" size={20} />
                <h3 className="text-lg font-serif font-bold text-text">Design Tools</h3>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-background/30 rounded-lg transition-all active:scale-95">
                <X size={20} />
              </button>
            </div>
          )}

          {!isMobile && (
            <div className="flex items-center gap-3 pb-5 border-b border-background/30">
              <Settings className="text-secondary" size={24} />
              <h3 className="text-xl font-serif font-bold text-text">Design Tools</h3>
            </div>
          )}

          <div className={isMobile ? 'p-4 space-y-6' : 'space-y-6'}>
            <div className="flex gap-1.5 sm:gap-2 p-1.5 bg-background/30 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs overflow-x-auto">
              {['ai', 'styles', 'embroidery', 'prints'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold transition-all capitalize whitespace-nowrap active:scale-95 ${activeTab === tab ? 'bg-secondary text-white' : 'text-text/60'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'ai' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-gradient-to-br from-secondary/5 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-secondary/20">
                  <label className="flex items-center gap-2 font-bold text-base sm:text-lg mb-2 sm:mb-3 text-text">
                    <Wand2 size={window.innerWidth < 640 ? 18 : 22} className="text-secondary flex-shrink-0" />
                    <span className="text-sm sm:text-base">AI Design Generator</span>
                    <span className="ml-1 sm:ml-2 text-[10px] bg-secondary/20 text-secondary px-2 py-0.5 sm:py-1 rounded-full font-bold">NEW</span>
                  </label>
                  <p className="text-xs sm:text-sm text-text/60 mb-3 sm:mb-4 font-light">
                    Describe your dream design and let AI create it for you!
                  </p>
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => onAIPromptChange && onAIPromptChange(e.target.value)}
                    placeholder="E.g., 'Floral patterns with golden embroidery on sleeves and border'"
                    className="w-full border-2 border-background/50 rounded-xl px-3 sm:px-4 py-2 sm:py-3 h-28 sm:h-32 focus:border-secondary focus:outline-none transition-colors resize-none font-light mb-3 sm:mb-4 text-sm sm:text-base"
                    rows="4"
                  />
                  <button
                    onClick={onAIGenerate}
                    disabled={aiGenerating || !aiPrompt.trim()}
                    className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-secondary text-white rounded-xl hover:bg-secondary/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-secondary/30 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm sm:text-base active:scale-95"
                  >
                    <Wand2 size={window.innerWidth < 640 ? 16 : 20} className={aiGenerating ? "animate-spin" : ""} />
                    <span>{aiGenerating ? "Generating..." : "Generate Design"}</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'styles' && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-text/70 mb-2 sm:mb-3 flex items-center gap-2">
                    <Palette size={14} className="text-secondary" />
                    Garment Color
                  </h4>
                  <div className="bg-gradient-to-br from-secondary/5 to-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 border-secondary/20">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="relative">
                        <input
                          type="color"
                          value={currentColor}
                          onChange={(e) => handleColorChange(e.target.value)}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl cursor-pointer border-2 sm:border-3 border-white shadow-lg hover:scale-105 transition-transform"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-secondary rounded-full p-1 sm:p-1.5 shadow-md">
                          <Palette size={10} className="text-white" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <label className="block text-[10px] sm:text-xs font-semibold text-text/70 mb-1 sm:mb-1.5">
                          Hex Code
                        </label>
                        <input
                          type="text"
                          value={currentColor}
                          onChange={(e) => handleColorChange(e.target.value)}
                          placeholder="#ffffff"
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-background/50 rounded-lg focus:border-secondary focus:outline-none transition-colors font-mono text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-text/70 mb-2 sm:mb-3">Neckline</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {getAvailableNecklines().map(style => (
                      <button
                        key={style.value}
                        onClick={() => setNeckStyle(style.value)}
                        className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all text-[10px] sm:text-xs font-semibold active:scale-95 ${neckStyle === style.value ? 'border-secondary bg-secondary/10' : 'border-background/50'
                          }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-text/70 mb-2 sm:mb-3">Sleeves</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {sleeveOptions.map(style => (
                      <button
                        key={style.value}
                        onClick={() => setSleeveStyle(style.value)}
                        className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all text-[10px] sm:text-xs font-semibold active:scale-95 ${sleeveStyle === style.value ? 'border-secondary bg-secondary/10' : 'border-background/50'
                          }`}
                      >
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
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                      <p className="text-[10px] sm:text-xs text-amber-800 font-semibold flex items-center gap-2">
                        <Info size={14} className="flex-shrink-0" />
                        Reference images required for accurate embroidery work
                      </p>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-text/70">Embroidery Patterns</h4>
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      {Object.entries(EMBROIDERY_PATTERNS).map(([key, config]) => {
                        const patternCanvas = config.createPattern();
                        return (
                          <button
                            key={key}
                            onClick={() => applyEmbroidery(key)}
                            className="group p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-background/50 hover:border-secondary hover:shadow-lg transition-all flex items-center gap-3 sm:gap-4 active:scale-95"
                          >
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 border-background/30 overflow-hidden flex-shrink-0 bg-white shadow-inner">
                              <img
                                src={patternCanvas.toDataURL()}
                                alt={config.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="text-left flex-1">
                              <div className="text-xs sm:text-sm font-semibold text-text mb-0.5 sm:mb-1">{config.name}</div>
                              <div className="text-[10px] sm:text-xs text-text/50 font-light">{config.note}</div>
                            </div>
                            <div className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                              <CheckCircle2 size={window.innerWidth < 640 ? 16 : 20} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <Move size={window.innerWidth < 640 ? 40 : 48} className="mx-auto mb-3 sm:mb-4 text-background/50" />
                    <p className="text-xs sm:text-sm text-text/50 font-light">Select a zone first</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'prints' && (
              <div className="space-y-4">
                {selectedZone ? (
                  <>
                    <div className="mb-4">
                      <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-text/70 mb-2">Pattern Scale</h4>
                      <div className="flex gap-2">
                        {['small', 'medium', 'large'].map(scale => (
                          <button
                            key={scale}
                            onClick={() => setPrintScale(scale)}
                            className={`flex-1 px-3 py-2 rounded-lg border-2 transition-all text-xs font-semibold capitalize ${printScale === scale ? 'border-secondary bg-secondary/10' : 'border-background/50'
                              }`}
                          >
                            {scale}
                          </button>
                        ))}
                      </div>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-text/70">Fabric Prints</h4>
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      {Object.entries(FABRIC_PRINTS).map(([key, config]) => {
                        return (
                          <button
                            key={key}
                            onClick={() => applyFabricPrint(key)}
                            className="group p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-background/50 hover:border-secondary hover:shadow-lg transition-all flex items-center gap-3 sm:gap-4 active:scale-95"
                          >
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 border-background/30 overflow-hidden flex-shrink-0 bg-white shadow-inner">
                              <img
                                src={config.thumbnail}
                                alt={config.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23f0f0f0" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                                }}
                              />
                            </div>
                            <div className="text-left flex-1">
                              <div className="text-xs sm:text-sm font-semibold text-text">{config.name}</div>
                              <div className="text-[10px] sm:text-xs text-text/50 font-light">{config.description}</div>
                            </div>
                            <div className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                              <CheckCircle2 size={window.innerWidth < 640 ? 16 : 20} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <Move size={window.innerWidth < 640 ? 40 : 48} className="mx-auto mb-3 sm:mb-4 text-background/50" />
                    <p className="text-xs sm:text-sm text-text/50 font-light">Select a zone first</p>
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