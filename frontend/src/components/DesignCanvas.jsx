import React, { useEffect, useRef, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { 
  Upload, Palette, Type, Trash2, Undo, Redo, Sparkles, 
  Image as ImageIcon, Move, Info, Download, Settings, CheckCircle2
} from 'lucide-react';
import { assets } from '../assets/assets';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const DRESS_TEMPLATES = {
  'Kurti': assets.kurta_img,
  'Kurti Sets': assets.kurta_img,
  'Kurta': assets.kurta_img,
  'Kurta Sets': assets.kurta_img,
  'Lehenga': assets.kurta_img,
  'Anarkali': assets.kurta_img,
  'Sherwani': assets.kurta_img,
  'Sheraras': assets.kurta_img
};

const ZONES = {
  Kurti: [
    { id: 'neck', label: 'Neck Area', x: 270, y: 155, width: 60, height: 40, color: '#e0e7ff' },
    { id: 'chest', label: 'Chest', x: 230, y: 200, width: 140, height: 120, color: '#fce7f3' },
    { id: 'waist', label: 'Waist', x: 230, y: 330, width: 140, height: 110, color: '#ddd6fe' },
    { id: 'hem', label: 'Border', x: 225, y: 480, width: 150, height: 30, color: '#fed7aa' },
    { id: 'sleeve_left', label: 'Left Sleeve', x: 150, y: 210, width: 60, height: 140, color: '#fef3c7' },
    { id: 'sleeve_right', label: 'Right Sleeve', x: 390, y: 210, width: 60, height: 140, color: '#fef3c7' }
  ],
  'Kurti Sets': [
    { id: 'neck', label: 'Neck Area', x: 270, y: 155, width: 60, height: 40, color: '#e0e7ff' },
    { id: 'chest', label: 'Chest', x: 230, y: 200, width: 140, height: 120, color: '#fce7f3' },
    { id: 'waist', label: 'Waist', x: 230, y: 330, width: 140, height: 110, color: '#ddd6fe' },
    { id: 'hem', label: 'Border', x: 225, y: 480, width: 150, height: 30, color: '#fed7aa' },
    { id: 'sleeve_left', label: 'Left Sleeve', x: 150, y: 210, width: 60, height: 140, color: '#fef3c7' },
    { id: 'sleeve_right', label: 'Right Sleeve', x: 390, y: 210, width: 60, height: 140, color: '#fef3c7' }
  ],
  Kurta: [
    { id: 'collar', label: 'Collar', x: 275, y: 165, width: 50, height: 25, color: '#e0e7ff' },
    { id: 'chest', label: 'Chest', x: 235, y: 210, width: 130, height: 140, color: '#fce7f3' },
    { id: 'waist', label: 'Waist', x: 235, y: 360, width: 130, height: 130, color: '#ddd6fe' },
    { id: 'lower', label: 'Lower', x: 235, y: 500, width: 130, height: 60, color: '#fed7aa' },
    { id: 'sleeve_left', label: 'Left Sleeve', x: 155, y: 220, width: 60, height: 160, color: '#fef3c7' },
    { id: 'sleeve_right', label: 'Right Sleeve', x: 385, y: 220, width: 60, height: 160, color: '#fef3c7' }
  ],
  'Kurta Sets': [
    { id: 'collar', label: 'Collar', x: 275, y: 165, width: 50, height: 25, color: '#e0e7ff' },
    { id: 'chest', label: 'Chest', x: 235, y: 210, width: 130, height: 140, color: '#fce7f3' },
    { id: 'waist', label: 'Waist', x: 235, y: 360, width: 130, height: 130, color: '#ddd6fe' },
    { id: 'lower', label: 'Lower', x: 235, y: 500, width: 130, height: 60, color: '#fed7aa' },
    { id: 'sleeve_left', label: 'Left Sleeve', x: 155, y: 220, width: 60, height: 160, color: '#fef3c7' },
    { id: 'sleeve_right', label: 'Right Sleeve', x: 385, y: 220, width: 60, height: 160, color: '#fef3c7' }
  ],
  Lehenga: [
    { id: 'blouse', label: 'Blouse', x: 235, y: 175, width: 130, height: 110, color: '#fce7f3' },
    { id: 'skirt_upper', label: 'Skirt Upper', x: 190, y: 320, width: 220, height: 140, color: '#ddd6fe' },
    { id: 'skirt_lower', label: 'Skirt Lower', x: 170, y: 470, width: 260, height: 100, color: '#e0e7ff' },
    { id: 'border', label: 'Border', x: 170, y: 583, width: 260, height: 15, color: '#fed7aa' }
  ],
  Anarkali: [
    { id: 'bodice', label: 'Bodice', x: 235, y: 175, width: 130, height: 130, color: '#fce7f3' },
    { id: 'waist', label: 'Waist Band', x: 230, y: 318, width: 140, height: 15, color: '#fed7aa' },
    { id: 'flare_upper', label: 'Upper Flare', x: 185, y: 345, width: 230, height: 130, color: '#ddd6fe' },
    { id: 'flare_lower', label: 'Lower Flare', x: 160, y: 485, width: 280, height: 105, color: '#e0e7ff' }
  ],
  Sherwani: [
    { id: 'collar', label: 'Collar', x: 265, y: 160, width: 70, height: 25, color: '#fef3c7' },
    { id: 'chest', label: 'Chest', x: 235, y: 200, width: 130, height: 170, color: '#fce7f3' },
    { id: 'waist', label: 'Waist', x: 235, y: 380, width: 130, height: 140, color: '#ddd6fe' },
    { id: 'lower', label: 'Lower Panel', x: 235, y: 530, width: 130, height: 60, color: '#e0e7ff' }
  ],
  Sheraras: [
    { id: 'blouse', label: 'Blouse', x: 235, y: 175, width: 130, height: 110, color: '#fce7f3' },
    { id: 'skirt_upper', label: 'Skirt Upper', x: 190, y: 320, width: 220, height: 140, color: '#ddd6fe' },
    { id: 'skirt_lower', label: 'Skirt Lower', x: 170, y: 470, width: 260, height: 100, color: '#e0e7ff' },
    { id: 'border', label: 'Border', x: 170, y: 583, width: 260, height: 15, color: '#fed7aa' }
  ]
};

// ============================================================================
// EMBROIDERY PATTERNS
// ============================================================================

const EMBROIDERY_PATTERNS = {
  maggam: {
    name: 'Maggam Work',
    note: 'Reference images required',
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

// ============================================================================
// FABRIC PRINTS
// ============================================================================

const FABRIC_PRINTS = {
  blockPrint: {
    name: 'Block Prints',
    createPattern: (baseColor) => {
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, 100, 100);
      
      ctx.fillStyle = '#00000020';
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          const x = 25 + i * 50;
          const y = 25 + j * 50;
          ctx.beginPath();
          ctx.arc(x, y, 15, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      return canvas;
    }
  },
  floral: {
    name: 'Floral',
    createPattern: (baseColor) => {
      const canvas = document.createElement('canvas');
      canvas.width = 120;
      canvas.height = 120;
      const ctx = canvas.getContext('2d');
      
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, 120, 120);
      
      ctx.fillStyle = '#00000015';
      [30, 90].forEach(x => {
        [30, 90].forEach(y => {
          ctx.beginPath();
          ctx.arc(x, y, 18, 0, Math.PI * 2);
          ctx.fill();
          
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2) / 6;
            const px = x + Math.cos(angle) * 12;
            const py = y + Math.sin(angle) * 12;
            ctx.beginPath();
            ctx.arc(px, py, 6, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      });
      
      return canvas;
    }
  },
  shibori: {
    name: 'Shibori',
    createPattern: (baseColor) => {
      const canvas = document.createElement('canvas');
      canvas.width = 150;
      canvas.height = 150;
      const ctx = canvas.getContext('2d');
      
      const gradient = ctx.createRadialGradient(75, 75, 20, 75, 75, 75);
      gradient.addColorStop(0, baseColor);
      gradient.addColorStop(0.5, '#00000020');
      gradient.addColorStop(1, baseColor);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 150, 150);
      
      return canvas;
    }
  },
  painting: {
    name: 'Painting',
    createPattern: (baseColor) => {
      const canvas = document.createElement('canvas');
      canvas.width = 130;
      canvas.height = 130;
      const ctx = canvas.getContext('2d');
      
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, 130, 130);
      
      ctx.strokeStyle = '#00000018';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(20 + i * 20, 20);
        ctx.quadraticCurveTo(65, 65, 20 + i * 20, 110);
        ctx.stroke();
      }
      
      return canvas;
    }
  },
  kalamkari: {
    name: 'Kalamkari',
    createPattern: (baseColor) => {
      const canvas = document.createElement('canvas');
      canvas.width = 140;
      canvas.height = 140;
      const ctx = canvas.getContext('2d');
      
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, 140, 140);
      
      ctx.strokeStyle = '#00000022';
      ctx.lineWidth = 2;
      
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const x = 30 + i * 40;
          const y = 30 + j * 40;
          
          ctx.beginPath();
          ctx.arc(x, y, 12, 0, Math.PI * 2);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      
      return canvas;
    }
  },
  bagruPrint: {
    name: 'Bagru Prints',
    createPattern: (baseColor) => {
      const canvas = document.createElement('canvas');
      canvas.width = 110;
      canvas.height = 110;
      const ctx = canvas.getContext('2d');
      
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, 110, 110);
      
      ctx.fillStyle = '#00000020';
      
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          const x = 27.5 + i * 55;
          const y = 27.5 + j * 55;
          
          ctx.beginPath();
          ctx.moveTo(x, y - 15);
          ctx.lineTo(x + 15, y);
          ctx.lineTo(x, y + 15);
          ctx.lineTo(x - 15, y);
          ctx.closePath();
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      return canvas;
    }
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
  gender = 'Women'
}) => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const historyRef = useRef({ stack: [], pointer: -1 });
  const baseImageRef = useRef(null);
  const colorOverlayRef = useRef(null);
  const mountedRef = useRef(false);
  
  const [neckStyle, setNeckStyle] = useState('round');
  const [sleeveStyle, setSleeveStyle] = useState('full');
  const [selectedZone, setSelectedZone] = useState(null);
  const [activeTab, setActiveTab] = useState('styles');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [templateLoaded, setTemplateLoaded] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentColor, setCurrentColor] = useState(selectedColor);

  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 700;
  
  const zones = ZONES[dressType] || ZONES.Kurti;

  // Get available necklines based on gender
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

  // Sleeve options
  const sleeveOptions = [
    { value: 'full', label: 'Full' },
    { value: 'elbow', label: 'Elbow (3/4th)' },
    { value: 'short', label: 'Short' },
    { value: 'sleeveless', label: 'Sleeveless' }
  ];

  // ============================================================================
  // INITIALIZE CANVAS
  // ============================================================================

  useEffect(() => {
    mountedRef.current = true;
    
    if (!canvasRef.current) return;

    // Dispose existing canvas if any
    if (fabricCanvasRef.current) {
      try {
        fabricCanvasRef.current.dispose();
      } catch (e) {
        console.warn('Canvas disposal warning:', e);
      }
      fabricCanvasRef.current = null;
    }

    // Create new canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: '#fafafa',
      selection: false,
      preserveObjectStacking: true,
    });

    fabricCanvasRef.current = canvas;
    loadGarmentTemplate(canvas);

    return () => {
      mountedRef.current = false;
      if (fabricCanvasRef.current) {
        try {
          fabricCanvasRef.current.dispose();
        } catch (e) {
          console.warn('Canvas cleanup warning:', e);
        }
        fabricCanvasRef.current = null;
      }
    };
  }, [dressType]);

  // Update color when selectedColor prop changes
  useEffect(() => {
    setCurrentColor(selectedColor);
    if (colorOverlayRef.current && fabricCanvasRef.current && mountedRef.current) {
      updateGarmentColor(selectedColor);
    }
  }, [selectedColor]);

  // ============================================================================
  // LOAD GARMENT TEMPLATE (PNG IMAGE)
  // ============================================================================

  const loadGarmentTemplate = useCallback((canvas) => {
    if (!canvas || !mountedRef.current) return;
    
    canvas.clear();
    canvas.backgroundColor = '#fafafa';
    setImageLoading(true);

    const templateUrl = DRESS_TEMPLATES[dressType];

    // Load the dress template image
    fabric.Image.fromURL(
      templateUrl, 
      (img) => {
        if (!mountedRef.current || !canvas) return;
        
        if (!img || !img.getElement()) {
          console.error('Failed to load template image:', templateUrl);
          setImageLoading(false);
          
          // Show placeholder if image fails to load
          const placeholder = new fabric.Text('Template Image Not Found\n\nPlease add PNG images', {
            left: CANVAS_WIDTH / 2,
            top: CANVAS_HEIGHT / 2,
            fontSize: 16,
            fill: '#999',
            textAlign: 'center',
            originX: 'center',
            originY: 'center',
            selectable: false
          });
          canvas.add(placeholder);
          canvas.renderAll();
          return;
        }

        // Scale image to fit canvas
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

        canvas.add(img);
        canvas.sendToBack(img);
        baseImageRef.current = img;

        // Create a colored overlay that will blend with the garment
        // This should be positioned and sized to match the garment area only
        const colorOverlay = new fabric.Rect({
          left: img.left,
          top: img.top,
          width: img.width * scale,
          height: img.height * scale,
          originX: 'center',
          originY: 'center',
          fill: selectedColor,
          opacity: 0.4, // Adjust this for color intensity
          selectable: false,
          evented: false,
          objectType: 'colorOverlay',
          globalCompositeOperation: 'multiply' // This blends the color with the image
        });

        canvas.add(colorOverlay);
        // Keep overlay just above the base image but below other elements
        canvas.moveTo(colorOverlay, 1);
        colorOverlayRef.current = colorOverlay;

        // Add zone overlays (invisible by default)
        zones.forEach(zone => {
          const zoneRect = new fabric.Rect({
            left: zone.x,
            top: zone.y,
            width: zone.width,
            height: zone.height,
            fill: 'transparent',
            stroke: zone.color,
            strokeWidth: 0,
            strokeDashArray: [5, 3],
            selectable: false,
            evented: false,
            zoneId: zone.id,
            opacity: 0
          });
          canvas.add(zoneRect);
        });

        if (mountedRef.current) {
          canvas.renderAll();
          setImageLoading(false);
          setTemplateLoaded(true);
          saveToHistory(canvas, true);
        }
      },
      {
        crossOrigin: 'anonymous'
      }
    );
  }, [dressType, selectedColor, zones]);

  // Update garment color
  const updateGarmentColor = useCallback((newColor) => {
    if (!colorOverlayRef.current || !fabricCanvasRef.current || !mountedRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const overlay = colorOverlayRef.current;
    
    overlay.set({ fill: newColor });
    canvas.renderAll();
    
    // Notify parent component
    if (onDesignChange) {
      exportDesign(canvas);
    }
  }, [onDesignChange]);

  // ============================================================================
  // APPLY EMBROIDERY
  // ============================================================================

  const applyEmbroidery = useCallback((patternKey) => {
    if (!selectedZone || !fabricCanvasRef.current || !mountedRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const zone = zones.find(z => z.id === selectedZone);
    if (!zone) return;

    // Remove existing embroidery in zone
    const objectsToRemove = [];
    canvas.getObjects().forEach(obj => {
      if (obj.customZone === selectedZone && obj.customType === 'embroidery') {
        objectsToRemove.push(obj);
      }
    });
    objectsToRemove.forEach(obj => canvas.remove(obj));

    const pattern = EMBROIDERY_PATTERNS[patternKey];
    if (!pattern) return;

    try {
      const patternCanvas = pattern.createPattern(zone.color);
      const fabricPattern = new fabric.Pattern({
        source: patternCanvas,
        repeat: 'repeat'
      });

      const rect = new fabric.Rect({
        left: zone.x,
        top: zone.y,
        width: zone.width,
        height: zone.height,
        fill: fabricPattern,
        selectable: false,
        customZone: selectedZone,
        customType: 'embroidery',
        opacity: 0.8
      });

      canvas.add(rect);
      canvas.renderAll();
      saveToHistory(canvas);
      exportDesign(canvas);
    } catch (e) {
      console.error('Embroidery application error:', e);
    }
  }, [selectedZone, zones]);

  // ============================================================================
  // APPLY FABRIC PRINT
  // ============================================================================

  const applyFabricPrint = useCallback((printKey) => {
    if (!selectedZone || !fabricCanvasRef.current || !mountedRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const zone = zones.find(z => z.id === selectedZone);
    if (!zone) return;

    // Remove existing print
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
      const printCanvas = print.createPattern(currentColor);
      const fabricPattern = new fabric.Pattern({
        source: printCanvas,
        repeat: 'repeat'
      });

      const rect = new fabric.Rect({
        left: zone.x,
        top: zone.y,
        width: zone.width,
        height: zone.height,
        fill: fabricPattern,
        selectable: false,
        customZone: selectedZone,
        customType: 'print',
        opacity: 0.7
      });

      canvas.add(rect);
      if (baseImageRef.current) {
        canvas.sendToBack(baseImageRef.current);
      }
      if (colorOverlayRef.current) {
        canvas.moveTo(colorOverlayRef.current, 1);
      }
      canvas.renderAll();
      saveToHistory(canvas);
      exportDesign(canvas);
    } catch (e) {
      console.error('Print application error:', e);
    }
  }, [selectedZone, zones, selectedColor]);

  // ============================================================================
  // ZONE SELECTION WITH HIGHLIGHT
  // ============================================================================

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

  // ============================================================================
  // CLEAR ZONE
  // ============================================================================

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
    canvas.renderAll();
    saveToHistory(canvas);
    exportDesign(canvas);
  }, [selectedZone]);

  // ============================================================================
  // HISTORY MANAGEMENT
  // ============================================================================

  const saveToHistory = useCallback((canvas, isInitial = false) => {
    if (!canvas || !mountedRef.current) return;

    try {
      const json = JSON.stringify(canvas.toJSON(['customZone', 'customType', 'zoneId', 'objectType']));
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
      const json = JSON.stringify(canvas.toJSON(['customZone', 'customType', 'zoneId', 'objectType']));
      const png = canvas.toDataURL({ format: 'png', quality: 1 });
      const svg = canvas.toSVG();

      onDesignChange({ json, png, svg, neckStyle, sleeveStyle, color: currentColor });
    } catch (e) {
      console.error('Export error:', e);
    }
  }, [onDesignChange, neckStyle, sleeveStyle, currentColor]);

  // ============================================================================
  // RENDER UI
  // ============================================================================

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        {/* Canvas */}
        <div className="bg-white rounded-2xl shadow-lg border border-background/50 p-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-text">Design Canvas</h3>
                <p className="text-sm text-text/60 font-light">{dressType} Customization</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button onClick={undo} disabled={!canUndo} className="p-3 bg-background/30 hover:bg-background/50 rounded-xl disabled:opacity-30 transition-all">
                <Undo size={18} />
              </button>
              <button onClick={redo} disabled={!canRedo} className="p-3 bg-background/30 hover:bg-background/50 rounded-xl disabled:opacity-30 transition-all">
                <Redo size={18} />
              </button>
            </div>
          </div>

          <div className="flex justify-center bg-gradient-to-br from-background/10 to-white rounded-2xl p-8 relative">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-2xl z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
                  <p className="text-sm text-text/50 font-light">Loading template...</p>
                </div>
              </div>
            )}
            <canvas ref={canvasRef} className="border-4 border-white rounded-2xl shadow-2xl" />
          </div>

          {/* Zone Selector */}
          <div className="mt-6">
            <h4 className="text-sm font-bold text-text/70 mb-3 uppercase tracking-wide">Select Area to Customize</h4>
            <div className="grid grid-cols-3 gap-2">
              {zones.map(zone => (
                <button
                  key={zone.id}
                  onClick={() => handleZoneSelect(zone.id)}
                  className={`p-3 rounded-xl border-2 transition-all text-xs font-semibold ${
                    selectedZone === zone.id
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
            <div className="mt-4 p-4 bg-gradient-to-r from-background/20 to-background/5 rounded-2xl border-2 border-secondary/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-secondary" />
                <span className="text-sm font-semibold text-text">
                  Editing: {zones.find(z => z.id === selectedZone)?.label}
                </span>
              </div>
              <button onClick={clearZone} className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-all text-xs font-semibold">
                <Trash2 size={14} className="inline mr-1" />
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Tools Sidebar */}
        <div className="bg-white rounded-2xl shadow-lg border border-background/50 p-6 space-y-6 max-h-[800px] overflow-y-auto">
          <div className="flex items-center gap-3 pb-5 border-b border-background/30">
            <Settings className="text-secondary" size={24} />
            <h3 className="text-xl font-serif font-bold text-text">Design Tools</h3>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 p-1.5 bg-background/30 rounded-2xl text-xs">
            {['styles', 'embroidery', 'prints'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-3 py-2.5 rounded-xl font-bold transition-all capitalize ${
                  activeTab === tab ? 'bg-secondary text-white' : 'text-text/60'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Styles Tab */}
          {activeTab === 'styles' && (
            <div className="space-y-6">
              {/* Color Picker */}
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider text-text/70 mb-3 flex items-center gap-2">
                  <Palette size={16} className="text-secondary" />
                  Garment Color
                </h4>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-200">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="color"
                        value={currentColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="w-20 h-20 rounded-xl cursor-pointer border-3 border-white shadow-lg hover:scale-105 transition-transform"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full p-1.5 shadow-md">
                        <Palette size={12} className="text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-text/70 mb-1.5">
                        Hex Code
                      </label>
                      <input
                        type="text"
                        value={currentColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        placeholder="#ffffff"
                        className="w-full px-3 py-2 border-2 border-background/50 rounded-lg focus:border-purple-500 focus:outline-none transition-colors font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider text-text/70 mb-3">Neckline</h4>
                <div className="grid grid-cols-2 gap-2">
                  {getAvailableNecklines().map(style => (
                    <button
                      key={style.value}
                      onClick={() => setNeckStyle(style.value)}
                      className={`p-3 rounded-xl border-2 transition-all text-xs font-semibold ${
                        neckStyle === style.value ? 'border-secondary bg-secondary/10' : 'border-background/50'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider text-text/70 mb-3">Sleeves</h4>
                <div className="grid grid-cols-2 gap-2">
                  {sleeveOptions.map(style => (
                    <button
                      key={style.value}
                      onClick={() => setSleeveStyle(style.value)}
                      className={`p-3 rounded-xl border-2 transition-all text-xs font-semibold ${
                        sleeveStyle === style.value ? 'border-secondary bg-secondary/10' : 'border-background/50'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Embroidery Tab */}
          {activeTab === 'embroidery' && (
            <div className="space-y-4">
              {selectedZone ? (
                <>
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-4">
                    <p className="text-xs text-amber-800 font-semibold flex items-center gap-2">
                      <Info size={16} />
                      Reference images required for accurate embroidery work
                    </p>
                  </div>
                  <h4 className="font-bold text-sm uppercase tracking-wider text-text/70">Embroidery Patterns</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(EMBROIDERY_PATTERNS).map(([key, config]) => {
                      const patternCanvas = config.createPattern();
                      return (
                        <button
                          key={key}
                          onClick={() => applyEmbroidery(key)}
                          className="group p-4 rounded-xl border-2 border-background/50 hover:border-secondary hover:shadow-lg transition-all flex items-center gap-4"
                        >
                          <div className="w-16 h-16 rounded-lg border-2 border-background/30 overflow-hidden flex-shrink-0 bg-white shadow-inner">
                            <img 
                              src={patternCanvas.toDataURL()} 
                              alt={config.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-left flex-1">
                            <div className="text-sm font-semibold text-text mb-1">{config.name}</div>
                            <div className="text-xs text-text/50 font-light">{config.note}</div>
                          </div>
                          <div className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                            <CheckCircle2 size={20} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Move size={48} className="mx-auto mb-4 text-background/50" />
                  <p className="text-sm text-text/50 font-light">Select a zone first</p>
                </div>
              )}
            </div>
          )}

          {/* Prints Tab */}
          {activeTab === 'prints' && (
            <div className="space-y-4">
              {selectedZone ? (
                <>
                  <h4 className="font-bold text-sm uppercase tracking-wider text-text/70">Fabric Prints</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(FABRIC_PRINTS).map(([key, config]) => {
                      const printCanvas = config.createPattern(selectedColor);
                      return (
                        <button
                          key={key}
                          onClick={() => applyFabricPrint(key)}
                          className="group p-4 rounded-xl border-2 border-background/50 hover:border-secondary hover:shadow-lg transition-all flex items-center gap-4"
                        >
                          <div className="w-16 h-16 rounded-lg border-2 border-background/30 overflow-hidden flex-shrink-0 bg-white shadow-inner">
                            <img 
                              src={printCanvas.toDataURL()} 
                              alt={config.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-left flex-1">
                            <div className="text-sm font-semibold text-text">{config.name}</div>
                            <div className="text-xs text-text/50 font-light">Traditional print pattern</div>
                          </div>
                          <div className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                            <CheckCircle2 size={20} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Move size={48} className="mx-auto mb-4 text-background/50" />
                  <p className="text-sm text-text/50 font-light">Select a zone first</p>
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