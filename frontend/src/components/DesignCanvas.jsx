import React, { useEffect, useRef, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import {
  Upload, Palette, Type, Trash2, Undo, Redo, Sparkles, Image as ImageIcon, Move, Layers, ArrowUp, ArrowDown, RotateCcw, Info, CheckCircle2
} from 'lucide-react';
import { assets } from '../assets/assets';

// Dress templates configuration
const DRESS_TEMPLATES = {
  // Women's styles
  Kurti: {
    image: assets.kurti_img,
    editableZones: [
      { id: 'neck', label: 'Neck Design', x: 250, y: 80, width: 100, height: 80 },
      { id: 'sleeve', label: 'Sleeve Pattern', x: 150, y: 150, width: 80, height: 120 },
      { id: 'sleeve_right', label: 'Sleeve Pattern', x: 370, y: 150, width: 80, height: 120 },
      { id: 'front', label: 'Front Design', x: 225, y: 180, width: 150, height: 250 },
      { id: 'border', label: 'Border', x: 200, y: 420, width: 200, height: 40 }
    ]
  },
  'Kurti Sets': {
    image: '/templates/kurti-set.png',
    editableZones: [
      { id: 'neck', label: 'Neck Design', x: 250, y: 80, width: 100, height: 80 },
      { id: 'kurti_front', label: 'Kurti Design', x: 225, y: 180, width: 150, height: 250 },
      { id: 'dupatta', label: 'Dupatta Pattern', x: 150, y: 500, width: 300, height: 80 },
      { id: 'palazzo', label: 'Bottom Design', x: 200, y: 450, width: 200, height: 150 }
    ]
  },
  Lehenga: {
    image: '/templates/lehenga.png',
    editableZones: [
      { id: 'blouse', label: 'Blouse Design', x: 225, y: 80, width: 150, height: 150 },
      { id: 'blouse_back', label: 'Back Design', x: 250, y: 100, width: 100, height: 80 },
      { id: 'skirt', label: 'Skirt Pattern', x: 175, y: 250, width: 250, height: 300 },
      { id: 'border', label: 'Border Design', x: 175, y: 520, width: 250, height: 40 },
      { id: 'dupatta', label: 'Dupatta', x: 450, y: 150, width: 100, height: 400 }
    ]
  },
  Sheraras: {
    image: '/templates/sherara.png',
    editableZones: [
      { id: 'kurti', label: 'Kurti Design', x: 225, y: 80, width: 150, height: 200 },
      { id: 'sherara', label: 'Sherara Pattern', x: 175, y: 300, width: 250, height: 250 },
      { id: 'dupatta', label: 'Dupatta', x: 450, y: 150, width: 100, height: 350 }
    ]
  },
  Anarkali: {
    image: '/templates/anarkali.png',
    editableZones: [
      { id: 'neck', label: 'Neck Design', x: 250, y: 80, width: 100, height: 80 },
      { id: 'bodice', label: 'Bodice', x: 225, y: 160, width: 150, height: 150 },
      { id: 'flare', label: 'Flare Pattern', x: 175, y: 320, width: 250, height: 250 },
      { id: 'border', label: 'Border', x: 175, y: 540, width: 250, height: 40 }
    ]
  },

  // Men's styles
  Kurta: {
    image: '/templates/kurta.png',
    editableZones: [
      { id: 'collar', label: 'Collar', x: 250, y: 80, width: 100, height: 60 },
      { id: 'buttons', label: 'Button Line', x: 285, y: 150, width: 30, height: 200 },
      { id: 'pocket', label: 'Pocket', x: 230, y: 200, width: 60, height: 60 },
      { id: 'sleeve', label: 'Sleeve', x: 150, y: 150, width: 70, height: 150 },
      { id: 'sleeve_right', label: 'Sleeve', x: 380, y: 150, width: 70, height: 150 },
      { id: 'border', label: 'Bottom Border', x: 200, y: 480, width: 200, height: 30 }
    ]
  },
  'Kurta Sets': {
    image: '/templates/kurta-set.png',
    editableZones: [
      { id: 'collar', label: 'Collar', x: 250, y: 80, width: 100, height: 60 },
      { id: 'kurta_front', label: 'Kurta Design', x: 225, y: 140, width: 150, height: 250 },
      { id: 'pajama', label: 'Pajama', x: 200, y: 400, width: 200, height: 180 }
    ]
  },
  Sherwani: {
    image: '/templates/sherwani.png',
    editableZones: [
      { id: 'collar', label: 'Collar', x: 250, y: 80, width: 100, height: 80 },
      { id: 'buttons', label: 'Button Design', x: 285, y: 170, width: 30, height: 250 },
      { id: 'embroidery', label: 'Embroidery', x: 225, y: 170, width: 150, height: 250 },
      { id: 'cuffs', label: 'Cuffs', x: 150, y: 280, width: 70, height: 60 },
      { id: 'cuffs_right', label: 'Cuffs', x: 380, y: 280, width: 70, height: 60 },
      { id: 'bottom_border', label: 'Bottom Border', x: 200, y: 430, width: 200, height: 40 }
    ]
  }
};

// Design pattern library
const DESIGN_PATTERNS = {
  neck: [
    { id: 'round', name: 'Round Neck' },
    { id: 'v-neck', name: 'V-Neck' },
    { id: 'boat', name: 'Boat Neck' },
    { id: 'collar', name: 'Collar' },
    { id: 'mandarin', name: 'Mandarin' }
  ],
  embroidery: [
    { id: 'floral', name: 'Floral' },
    { id: 'geometric', name: 'Geometric' },
    { id: 'paisley', name: 'Paisley' },
    { id: 'zari', name: 'Zari Work' },
    { id: 'thread', name: 'Thread Work' },
    { id: 'mirror', name: 'Mirror Work' },
    { id: 'sequin', name: 'Sequin' }
  ],
  buttons: [
    { id: 'traditional', name: 'Traditional' },
    { id: 'decorative', name: 'Decorative' },
    { id: 'hidden', name: 'Hidden' },
    { id: 'metal', name: 'Metal' }
  ],
  prints: [
    { id: 'block', name: 'Block Print' },
    { id: 'digital', name: 'Digital Print' },
    { id: 'tie-dye', name: 'Tie-Dye' },
    { id: 'batik', name: 'Batik' },
    { id: 'kalamkari', name: 'Kalamkari' }
  ]
};

const DesignCanvas = ({ onDesignChange, initialDesign = null, dressType, selectedColor }) => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const historyRef = useRef({ stack: [], pointer: -1 });

  const [selectedZone, setSelectedZone] = useState(null);
  const [activeTab, setActiveTab] = useState('patterns');
  const [canRedo, setCanRedo] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [zoneDesigns, setZoneDesigns] = useState({});
  const [templateLoaded, setTemplateLoaded] = useState(false);

  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 700;

  const template = DRESS_TEMPLATES[dressType];

  // Initialize canvas with dress template
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: '#ffffff',
      selection: false,
      preserveObjectStacking: true,
    });

    fabricCanvasRef.current = canvas;

    if (initialDesign?.json) {
      try {
        canvas.loadFromJSON(JSON.parse(initialDesign.json), () => {
          canvas.renderAll();
          setTemplateLoaded(true);
        });
      } catch (err) {
        console.error('Failed to load initial design:', err);
        loadTemplate(canvas);
      }
    } else {
      loadTemplate(canvas);
    }

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [dressType]);

  const loadTemplate = useCallback((canvas) => {
    if (!template) return;

    // Create dress silhouette background
    const rect = new fabric.Rect({
      left: 150,
      top: 50,
      width: 300,
      height: 600,
      fill: selectedColor || '#f5f5f5',
      stroke: '#ddd',
      strokeWidth: 2,
      selectable: false,
      evented: false,
      id: 'dress-base'
    });
    canvas.add(rect);

    // Add editable zones as overlays
    template.editableZones.forEach(zone => {
      const zoneRect = new fabric.Rect({
        left: zone.x,
        top: zone.y,
        width: zone.width,
        height: zone.height,
        fill: 'rgba(147, 51, 234, 0.08)',
        stroke: '#9333ea',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: true,
        id: `zone-${zone.id}`,
        hoverCursor: 'pointer',
        zoneId: zone.id,
        zoneLabel: zone.label
      });

      const label = new fabric.Text(zone.label, {
        left: zone.x + zone.width / 2,
        top: zone.y + zone.height / 2,
        fontSize: 12,
        fill: '#9333ea',
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
        id: `label-${zone.id}`
      });

      canvas.add(zoneRect);
      canvas.add(label);
    });

    canvas.on('mouse:down', (e) => {
      if (e.target && e.target.zoneId) {
        selectZone(e.target.zoneId);
      }
    });

    canvas.on('mouse:over', (e) => {
      if (e.target && e.target.zoneId) {
        e.target.set('fill', 'rgba(147, 51, 234, 0.15)');
        canvas.renderAll();
      }
    });

    canvas.on('mouse:out', (e) => {
      if (e.target && e.target.zoneId) {
        e.target.set('fill', 'rgba(147, 51, 234, 0.08)');
        canvas.renderAll();
      }
    });

    canvas.renderAll();
    setTemplateLoaded(true);
    saveToHistory(canvas, true);
  }, [template, selectedColor]);

  const selectZone = useCallback((zoneId) => {
    setSelectedZone(zoneId);

    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.getObjects().forEach(obj => {
      if (obj.id && obj.id.startsWith('zone-')) {
        if (obj.zoneId === zoneId) {
          obj.set({
            stroke: '#9333ea',
            strokeWidth: 3,
            fill: 'rgba(147, 51, 234, 0.2)'
          });
        } else {
          obj.set({
            stroke: '#9333ea',
            strokeWidth: 2,
            fill: 'rgba(147, 51, 234, 0.08)'
          });
        }
      }
    });
    canvas.renderAll();
  }, []);

  const applyPattern = useCallback((patternId, patternType) => {
    if (!selectedZone) {
      return;
    }

    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const zone = template.editableZones.find(z => z.id === selectedZone);
    if (!zone) return;

    const existingPattern = canvas.getObjects().find(
      obj => obj.customZone === selectedZone && obj.customType === 'pattern'
    );
    if (existingPattern) {
      canvas.remove(existingPattern);
    }

    let patternObj;

    if (patternType === 'embroidery') {
      patternObj = new fabric.Group([], {
        left: zone.x + zone.width / 2,
        top: zone.y + zone.height / 2,
        originX: 'center',
        originY: 'center',
        customZone: selectedZone,
        customType: 'pattern',
        patternId: patternId
      });

      switch (patternId) {
        case 'floral':
          for (let i = 0; i < 5; i++) {
            const circle = new fabric.Circle({
              radius: 8,
              fill: '#ec4899',
              left: (i - 2) * 25,
              top: Math.sin(i) * 15
            });
            patternObj.addWithUpdate(circle);
          }
          break;
        case 'geometric':
          for (let i = 0; i < 4; i++) {
            const rect = new fabric.Rect({
              width: 15,
              height: 15,
              fill: '#8b5cf6',
              angle: 45,
              left: (i - 1.5) * 30,
              top: 0
            });
            patternObj.addWithUpdate(rect);
          }
          break;
        case 'paisley':
          const path = new fabric.Path('M 0 0 Q 20 10, 25 30 Q 20 40, 0 35 Q -10 20, 0 0', {
            fill: '#f59e0b',
            stroke: '#d97706',
            strokeWidth: 1
          });
          patternObj.addWithUpdate(path);
          break;
      }

      canvas.add(patternObj);
    } else if (patternType === 'buttons') {
      const buttonCount = 5;
      const buttonSpacing = zone.height / (buttonCount + 1);

      for (let i = 0; i < buttonCount; i++) {
        const button = new fabric.Circle({
          radius: 6,
          fill: '#1f2937',
          stroke: '#fbbf24',
          strokeWidth: 2,
          left: zone.x + zone.width / 2,
          top: zone.y + buttonSpacing * (i + 1),
          originX: 'center',
          originY: 'center',
          customZone: selectedZone,
          customType: 'pattern',
          patternId: patternId,
          selectable: false
        });
        canvas.add(button);
      }
    }

    setZoneDesigns(prev => ({
      ...prev,
      [selectedZone]: { patternId, patternType }
    }));

    canvas.renderAll();
    saveToHistory(canvas);
    exportDesign(canvas);
  }, [selectedZone, template]);

  const changeZoneColor = useCallback((color) => {
    if (!selectedZone) return;

    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.getObjects().forEach(obj => {
      if (obj.customZone === selectedZone) {
        if (obj.type === 'group') {
          obj.getObjects().forEach(child => {
            if (child.fill) child.set('fill', color);
          });
        } else if (obj.fill) {
          obj.set('fill', color);
        }
      }
    });

    canvas.renderAll();
    saveToHistory(canvas);
    exportDesign(canvas);
  }, [selectedZone]);

  const uploadCustomImage = useCallback((e) => {
    if (!selectedZone) return;

    const file = e.target.files?.[0];
    if (!file) return;

    const canvas = fabricCanvasRef.current;
    const zone = template.editableZones.find(z => z.id === selectedZone);
    if (!canvas || !zone) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      fabric.Image.fromURL(event.target.result, (img) => {
        const existing = canvas.getObjects().find(
          obj => obj.customZone === selectedZone && obj.customType === 'custom-image'
        );
        if (existing) canvas.remove(existing);

        const scale = Math.min(
          zone.width / img.width,
          zone.height / img.height
        ) * 0.9;

        img.set({
          left: zone.x + zone.width / 2,
          top: zone.y + zone.height / 2,
          originX: 'center',
          originY: 'center',
          scaleX: scale,
          scaleY: scale,
          customZone: selectedZone,
          customType: 'custom-image',
          selectable: true
        });

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        saveToHistory(canvas);
        exportDesign(canvas);
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, [selectedZone, template]);

  const addTextToZone = useCallback(() => {
    if (!selectedZone) return;

    const canvas = fabricCanvasRef.current;
    const zone = template.editableZones.find(z => z.id === selectedZone);
    if (!canvas || !zone) return;

    const text = new fabric.IText('Edit Text', {
      left: zone.x + zone.width / 2,
      top: zone.y + zone.height / 2,
      originX: 'center',
      originY: 'center',
      fontSize: 20,
      fill: '#000000',
      fontFamily: 'Arial',
      customZone: selectedZone,
      customType: 'text',
      selectable: true
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    text.enterEditing();
    canvas.renderAll();
    saveToHistory(canvas);
  }, [selectedZone, template]);

  const deleteZoneContent = useCallback(() => {
    if (!selectedZone) return;

    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const objectsToRemove = canvas.getObjects().filter(
      obj => obj.customZone === selectedZone && obj.customType
    );

    objectsToRemove.forEach(obj => canvas.remove(obj));

    setZoneDesigns(prev => {
      const updated = { ...prev };
      delete updated[selectedZone];
      return updated;
    });

    canvas.renderAll();
    saveToHistory(canvas);
    exportDesign(canvas);
  }, [selectedZone]);

  const saveToHistory = useCallback((canvas, isInitial = false) => {
    if (!canvas) return;

    const json = JSON.stringify(canvas.toJSON(['customZone', 'customType', 'patternId', 'zoneId', 'zoneLabel', 'id']));
    const { stack, pointer } = historyRef.current;

    if (stack[pointer] === json) return;

    const newStack = stack.slice(0, pointer + 1);
    newStack.push(json);

    if (newStack.length > 50) newStack.shift();

    historyRef.current = {
      stack: newStack,
      pointer: newStack.length - 1,
    };

    setCanUndo(historyRef.current.pointer > 0);
    setCanRedo(false);

    if (!isInitial) exportDesign(canvas);
  }, []);

  const undo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const { stack, pointer } = historyRef.current;
    if (pointer <= 0) return;

    const newPointer = pointer - 1;
    historyRef.current.pointer = newPointer;

    canvas.loadFromJSON(JSON.parse(stack[newPointer]), () => {
      canvas.renderAll();
      setCanUndo(newPointer > 0);
      setCanRedo(true);
    });
  }, []);

  const redo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const { stack, pointer } = historyRef.current;
    if (pointer >= stack.length - 1) return;

    const newPointer = pointer + 1;
    historyRef.current.pointer = newPointer;

    canvas.loadFromJSON(JSON.parse(stack[newPointer]), () => {
      canvas.renderAll();
      setCanUndo(true);
      setCanRedo(newPointer < stack.length - 1);
    });
  }, []);

  const exportDesign = useCallback((canvas) => {
    if (!canvas || !onDesignChange) return;

    const json = JSON.stringify(canvas.toJSON(['customZone', 'customType', 'patternId', 'zoneId', 'zoneLabel', 'id']));
    const png = canvas.toDataURL({ format: 'png', quality: 1 });
    const svg = canvas.toSVG();

    onDesignChange({
      json,
      png,
      svg,
      zoneDesigns
    });
  }, [onDesignChange, zoneDesigns]);

  if (!template) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-br from-background/20 to-white rounded-2xl border border-background/50">
        <div className="text-center">
          <Info size={48} className="mx-auto mb-4 text-text/30" />
          <p className="text-text/60 font-light">Please select a dress type first</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1fr_350px] gap-6">
      {/* Canvas Area */}
      <div className="bg-gradient-to-br from-white to-background/10 rounded-2xl shadow-lg border border-background/50 p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-serif font-bold text-text mb-1">
                Design Canvas
              </h3>
              <p className="text-sm text-text/60 font-light">Click zones to customize your {dressType}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={undo}
                disabled={!canUndo}
                className="p-3 bg-background/30 hover:bg-background/50 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all group"
                title="Undo"
              >
                <Undo size={18} className="text-text group-hover:text-secondary transition-colors" />
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className="p-3 bg-background/30 hover:bg-background/50 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all group"
                title="Redo"
              >
                <Redo size={18} className="text-text group-hover:text-secondary transition-colors" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative inline-block">
            <canvas ref={canvasRef} className="border-4 border-background/30 rounded-2xl shadow-xl" />
            {!templateLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-3"></div>
                  <p className="text-text/60 font-light">Loading template...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {selectedZone && (
          <div className="mt-6 p-4 bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-xl border-2 border-secondary/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-secondary text-sm">Selected Zone</p>
                  <p className="text-text font-semibold">
                    {template.editableZones.find(z => z.id === selectedZone)?.label}
                  </p>
                </div>
              </div>
              <button
                onClick={deleteZoneContent}
                className="px-4 py-2 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-all flex items-center gap-2 font-medium"
              >
                <Trash2 size={16} />
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Design Tools Sidebar */}
      <div className="bg-white rounded-2xl shadow-lg border border-background/50 p-6 space-y-6 max-h-[700px] overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-2 pb-4 border-b border-background/30">
          <Sparkles className="text-secondary" size={22} />
          <h3 className="text-xl font-serif font-bold text-text">Design Tools</h3>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-background/20 rounded-xl">
          {[
            { id: 'patterns', label: 'Patterns', icon: Sparkles },
            { id: 'colors', label: 'Colors', icon: Palette },
            { id: 'custom', label: 'Custom', icon: ImageIcon }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id
                    ? 'bg-secondary text-white shadow-md'
                    : 'text-text/60 hover:text-text hover:bg-background/30'
                  }`}
              >
                <Icon size={16} className="inline mr-1.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {!selectedZone && (
          <div className="text-center py-12">
            <Move size={48} className="mx-auto mb-4 text-text/20" />
            <p className="text-sm text-text/60 font-light">Select a zone to start customizing</p>
          </div>
        )}

        {/* Patterns Tab */}
        {activeTab === 'patterns' && selectedZone && (
          <div className="space-y-6">
            {/* Embroidery Patterns */}
            {(selectedZone.includes('front') || selectedZone.includes('bodice') || selectedZone.includes('embroidery') || selectedZone.includes('kurti')) && (
              <div>
                <h4 className="font-semibold text-text mb-3 text-sm">Embroidery Designs</h4>
                <div className="grid grid-cols-2 gap-2">
                  {DESIGN_PATTERNS.embroidery.map(pattern => (
                    <button
                      key={pattern.id}
                      onClick={() => applyPattern(pattern.id, 'embroidery')}
                      className={`p-4 rounded-xl border-2 transition-all hover:shadow-md text-left ${zoneDesigns[selectedZone]?.patternId === pattern.id
                          ? 'border-secondary bg-secondary/10 shadow-md'
                          : 'border-background/50 hover:border-secondary/50'
                        }`}
                      title={pattern.name}
                    >
                      <div className="text-sm text-text font-semibold">{pattern.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Neck Designs */}
            {(selectedZone.includes('neck') || selectedZone.includes('collar')) && (
              <div>
                <h4 className="font-semibold text-text mb-3 text-sm">Neck Designs</h4>
                <div className="grid grid-cols-2 gap-2">
                  {DESIGN_PATTERNS.neck.map(pattern => (
                    <button
                      key={pattern.id}
                      onClick={() => applyPattern(pattern.id, 'neck')}
                      className={`p-4 rounded-xl border-2 transition-all hover:shadow-md text-left ${zoneDesigns[selectedZone]?.patternId === pattern.id
                          ? 'border-secondary bg-secondary/10 shadow-md'
                          : 'border-background/50 hover:border-secondary/50'
                        }`}
                    >
                      <div className="text-sm text-text font-semibold">{pattern.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Button Designs */}
            {selectedZone.includes('button') && (
              <div>
                <h4 className="font-semibold text-text mb-3 text-sm">Button Styles</h4>
                <div className="grid grid-cols-2 gap-2">
                  {DESIGN_PATTERNS.buttons.map(pattern => (
                    <button
                      key={pattern.id}
                      onClick={() => applyPattern(pattern.id, 'buttons')}
                      className={`p-4 rounded-xl border-2 transition-all hover:shadow-md text-left ${zoneDesigns[selectedZone]?.patternId === pattern.id
                          ? 'border-secondary bg-secondary/10 shadow-md'
                          : 'border-background/50 hover:border-secondary/50'
                        }`}
                    >
                      <div className="text-sm text-text font-semibold">{pattern.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Print Patterns */}
            {(selectedZone.includes('sleeve') || selectedZone.includes('border') || selectedZone.includes('skirt') || selectedZone.includes('palazzo') || selectedZone.includes('dupatta')) && (
              <div>
                <h4 className="font-semibold text-text mb-3 text-sm">Print Patterns</h4>
                <div className="grid grid-cols-2 gap-2">
                  {DESIGN_PATTERNS.prints.map(pattern => (
                    <button
                      key={pattern.id}
                      onClick={() => applyPattern(pattern.id, 'embroidery')}
                      className={`p-4 rounded-xl border-2 transition-all hover:shadow-md text-left ${zoneDesigns[selectedZone]?.patternId === pattern.id
                          ? 'border-secondary bg-secondary/10 shadow-md'
                          : 'border-background/50 hover:border-secondary/50'
                        }`}
                    >
                      <div className="text-sm text-text font-semibold">{pattern.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Colors Tab */}
        {activeTab === 'colors' && selectedZone && (
          <div className="space-y-4">
            <h4 className="font-semibold text-text text-sm">Zone Colors</h4>
            <div className="grid grid-cols-5 gap-2">
              {[
                '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181',
                '#AA96DA', '#FCBAD3', '#A8E6CF', '#FFD93D', '#6BCB77',
                '#4D96FF', '#FF8C42', '#C70039', '#581845', '#000000',
                '#FFFFFF', '#D4A373', '#8B4513', '#F9E4D4', '#E8B4F0'
              ].map(color => (
                <button
                  key={color}
                  onClick={() => changeZoneColor(color)}
                  className="aspect-square rounded-lg border-2 border-background/50 hover:border-secondary hover:scale-110 transition-all shadow-md"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-text/70 mb-2">Custom Color</label>
              <input
                type="color"
                onChange={(e) => changeZoneColor(e.target.value)}
                className="w-full h-12 rounded-xl cursor-pointer border-2 border-background/50 hover:border-secondary transition-colors"
              />
            </div>
          </div>
        )}

        {/* Custom Tab */}
        {activeTab === 'custom' && selectedZone && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-text mb-3 text-sm">Upload Design</h4>
              <label className="block w-full p-6 border-2 border-dashed border-secondary/30 rounded-xl hover:border-secondary/60 cursor-pointer transition-all bg-secondary/5 hover:bg-secondary/10 group">
                <div className="text-center">
                  <ImageIcon className="mx-auto mb-3 text-secondary group-hover:scale-110 transition-transform" size={36} />
                  <p className="text-sm text-text font-medium mb-1">Click to upload image</p>
                  <p className="text-xs text-text/60">PNG, JPG up to 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadCustomImage}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <h4 className="font-semibold text-text mb-3 text-sm">Add Text</h4>
              <button
                onClick={addTextToZone}
                className="w-full p-4 bg-secondary text-white rounded-xl hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 font-semibold shadow-lg shadow-secondary/30"
              >
                <Type size={20} />
                Add Custom Text
              </button>
            </div>
          </div>
        )}

        {/* Tips */}
        {selectedZone && (
          <div className="pt-4 border-t border-background/30">
            <div className="bg-gradient-to-br from-secondary/5 to-background/10 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <Info size={16} className="text-secondary mt-0.5 flex-shrink-0" />
                <div className="text-xs text-text/70 space-y-1">
                  <p><strong>Tip:</strong> Select different zones to customize various parts</p>
                  <p>Mix patterns and colors to create your unique design</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #9333ea;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #7e22ce;
        }
      `}</style>
    </div>
  );
};

export default DesignCanvas;