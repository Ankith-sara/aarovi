import React, { useEffect, useRef, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { 
  Pencil, 
  Square, 
  Type, 
  Trash2, 
  Undo, 
  Redo,
  MousePointer,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Image
} from 'lucide-react';

const DesignCanvas = ({ onDesignChange, initialDesign = null }) => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const historyRef = useRef({ stack: [], pointer: -1 });
  
  const [activeMode, setActiveMode] = useState('select');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [activeObject, setActiveObject] = useState(null);
  const [canRedo, setCanRedo] = useState(false);
  const [canUndo, setCanUndo] = useState(false);

  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 800;
  const MAX_SCALE = 5;
  const MIN_SCALE = 0.1;

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: '#fafafa',
      selection: true,
      preserveObjectStacking: true,
      stopContextMenu: true,
      fireRightClick: false,
      uniformScaling: false,
    });

    addGrid(canvas);

    // Object constraints
    canvas.on('object:scaling', (e) => {
      const obj = e.target;
      if (!obj) return;

      if (obj.scaleX > MAX_SCALE) obj.scaleX = MAX_SCALE;
      if (obj.scaleY > MAX_SCALE) obj.scaleY = MAX_SCALE;
      if (obj.scaleX < MIN_SCALE) obj.scaleX = MIN_SCALE;
      if (obj.scaleY < MIN_SCALE) obj.scaleY = MIN_SCALE;
    });

    // Boundary constraints
    canvas.on('object:moving', (e) => {
      const obj = e.target;
      if (!obj) return;

      const bound = obj.getBoundingRect();
      
      if (bound.left < 0) obj.left = Math.max(obj.left, obj.left - bound.left);
      if (bound.top < 0) obj.top = Math.max(obj.top, obj.top - bound.top);
      if (bound.left + bound.width > canvas.width) {
        obj.left = Math.min(obj.left, canvas.width - bound.width + obj.left - bound.left);
      }
      if (bound.top + bound.height > canvas.height) {
        obj.top = Math.min(obj.top, canvas.height - bound.height + obj.top - bound.top);
      }
    });

    // Selection tracking
    canvas.on('selection:created', (e) => setActiveObject(e.selected?.[0] || null));
    canvas.on('selection:updated', (e) => setActiveObject(e.selected?.[0] || null));
    canvas.on('selection:cleared', () => setActiveObject(null));

    // History tracking
    canvas.on('object:added', () => saveToHistory(canvas));
    canvas.on('object:modified', () => saveToHistory(canvas));
    canvas.on('object:removed', () => saveToHistory(canvas));

    fabricCanvasRef.current = canvas;

    if (initialDesign?.json) {
      try {
        canvas.loadFromJSON(JSON.parse(initialDesign.json), () => {
          canvas.renderAll();
          saveToHistory(canvas, true);
        });
      } catch (err) {
        console.error('Failed to load initial design:', err);
      }
    } else {
      saveToHistory(canvas, true);
    }

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, []);

  const addGrid = (canvas) => {
    const gridSize = 50;
    const gridColor = '#e5e5e5';

    for (let i = 0; i < CANVAS_WIDTH / gridSize; i++) {
      canvas.add(new fabric.Line([i * gridSize, 0, i * gridSize, CANVAS_HEIGHT], {
        stroke: gridColor,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        excludeFromExport: true,
      }));
    }

    for (let i = 0; i < CANVAS_HEIGHT / gridSize; i++) {
      canvas.add(new fabric.Line([0, i * gridSize, CANVAS_WIDTH, i * gridSize], {
        stroke: gridColor,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        excludeFromExport: true,
      }));
    }
  };

  const saveToHistory = useCallback((canvas, isInitial = false) => {
    if (!canvas) return;

    const json = JSON.stringify(canvas.toJSON(['customType', 'customName']));
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

    const objects = canvas.getObjects().filter(obj => !obj.excludeFromExport);
    const tempCanvas = new fabric.Canvas(null, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: '#fafafa',
    });

    objects.forEach(obj => {
      const cloned = fabric.util.object.clone(obj);
      tempCanvas.add(cloned);
    });

    const json = JSON.stringify(tempCanvas.toJSON(['customType', 'customName']));
    const png = tempCanvas.toDataURL({ format: 'png', quality: 1 });
    const svg = tempCanvas.toSVG();

    onDesignChange({ json, png, svg });
    tempCanvas.dispose();
  }, [onDesignChange]);

  const enableDrawMode = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.color = selectedColor;
    canvas.freeDrawingBrush.width = 3;

    canvas.on('path:created', (e) => {
      e.path.set({
        customType: 'embroidery',
        customName: 'Embroidery Line',
      });
    });

    setActiveMode('draw');
  }, [selectedColor]);

  const disableDrawMode = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = false;
    canvas.off('path:created');
  }, []);

  const addPanel = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const panel = new fabric.Rect({
      left: CANVAS_WIDTH / 2 - 75,
      top: CANVAS_HEIGHT / 2 - 100,
      width: 150,
      height: 200,
      fill: selectedColor,
      stroke: '#333',
      strokeWidth: 2,
      rx: 10,
      ry: 10,
      customType: 'panel',
      customName: 'Garment Panel',
    });

    canvas.add(panel);
    canvas.setActiveObject(panel);
    canvas.renderAll();
  }, [selectedColor]);

  const addText = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const text = new fabric.IText('Edit Text', {
      left: CANVAS_WIDTH / 2 - 50,
      top: CANVAS_HEIGHT / 2,
      fontSize: 24,
      fill: selectedColor,
      fontFamily: 'Arial',
      customType: 'text',
      customName: 'Text Label',
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    text.enterEditing();
    canvas.renderAll();
  }, [selectedColor]);

  const addImage = useCallback((e) => {
    const canvas = fabricCanvasRef.current;
    const file = e.target.files?.[0];
    if (!canvas || !file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      fabric.Image.fromURL(event.target.result, (img) => {
        const maxDim = 300;
        const scale = Math.min(maxDim / img.width, maxDim / img.height);

        img.set({
          left: CANVAS_WIDTH / 2 - (img.width * scale) / 2,
          top: CANVAS_HEIGHT / 2 - (img.height * scale) / 2,
          scaleX: scale,
          scaleY: scale,
          customType: 'image',
          customName: 'Uploaded Image',
        });

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, []);

  const changeObjectColor = useCallback((color) => {
    const canvas = fabricCanvasRef.current;
    const obj = canvas?.getActiveObject();
    if (!obj) return;

    if (obj.type === 'i-text' || obj.type === 'text') {
      obj.set('fill', color);
    } else if (obj.type === 'path') {
      obj.set('stroke', color);
    } else {
      obj.set('fill', color);
    }

    canvas.renderAll();
    saveToHistory(canvas);
  }, [saveToHistory]);

  const bringForward = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    const obj = canvas?.getActiveObject();
    if (!obj) return;

    canvas.bringForward(obj);
    canvas.renderAll();
    saveToHistory(canvas);
  }, [saveToHistory]);

  const sendBackward = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    const obj = canvas?.getActiveObject();
    if (!obj) return;

    canvas.sendBackwards(obj);
    canvas.renderAll();
    saveToHistory(canvas);
  }, [saveToHistory]);

  const deleteSelected = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    const obj = canvas?.getActiveObject();
    if (!obj) return;

    canvas.remove(obj);
    canvas.renderAll();
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    if (!window.confirm('Clear entire canvas? This cannot be undone.')) return;

    canvas.clear();
    canvas.backgroundColor = '#fafafa';
    addGrid(canvas);
    canvas.renderAll();
    historyRef.current = { stack: [], pointer: -1 };
    setCanUndo(false);
    setCanRedo(false);
    exportDesign(canvas);
  }, [exportDesign]);

  const switchMode = useCallback((mode) => {
    disableDrawMode();
    setActiveMode(mode);

    if (mode === 'draw') {
      enableDrawMode();
    }
  }, [enableDrawMode, disableDrawMode]);

  return (
    <div className="flex gap-4 bg-gray-50 p-6 rounded-xl">
      <div className="w-64 bg-white rounded-lg shadow-lg p-4 space-y-6">
        <h3 className="font-bold text-lg text-gray-800">Design Tools</h3>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600 mb-2">Mode</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => switchMode('select')}
              className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                activeMode === 'select'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <MousePointer size={20} />
              <span className="text-xs">Select</span>
            </button>
            <button
              onClick={() => switchMode('draw')}
              className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                activeMode === 'draw'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <Pencil size={20} />
              <span className="text-xs">Draw</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600 mb-2">Add Elements</p>
          <button
            onClick={addPanel}
            className="w-full p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all flex items-center gap-2 text-sm"
          >
            <Square size={18} />
            Add Panel
          </button>
          <button
            onClick={addText}
            className="w-full p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all flex items-center gap-2 text-sm"
          >
            <Type size={18} />
            Add Text
          </button>
          <label className="w-full p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all flex items-center gap-2 text-sm cursor-pointer">
            <Image size={18} />
            Add Image
            <input
              type="file"
              accept="image/*"
              onChange={addImage}
              className="hidden"
            />
          </label>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600 mb-2">Color</p>
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => {
              setSelectedColor(e.target.value);
              if (activeObject) changeObjectColor(e.target.value);
            }}
            className="w-full h-10 rounded-lg cursor-pointer border-2 border-gray-200"
          />
          <div className="grid grid-cols-5 gap-2">
            {['#000000', '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3', '#A8E6CF', '#FFFFFF'].map(color => (
              <button
                key={color}
                onClick={() => {
                  setSelectedColor(color);
                  if (activeObject) changeObjectColor(color);
                }}
                className={`w-10 h-10 rounded-lg border-2 transition-all ${
                  selectedColor === color ? 'border-blue-500 scale-110' : 'border-gray-200'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {activeObject && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600 mb-2">Layers</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={bringForward}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all flex items-center justify-center gap-1 text-xs"
              >
                <ArrowUp size={16} />
                Forward
              </button>
              <button
                onClick={sendBackward}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all flex items-center justify-center gap-1 text-xs"
              >
                <ArrowDown size={16} />
                Backward
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600 mb-2">History</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all flex items-center justify-center gap-1 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Undo size={16} />
              Undo
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all flex items-center justify-center gap-1 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Redo size={16} />
              Redo
            </button>
          </div>
        </div>

        <div className="space-y-2 border-t pt-4">
          <button
            onClick={deleteSelected}
            disabled={!activeObject}
            className="w-full p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 size={16} />
            Delete
          </button>
          <button
            onClick={clearCanvas}
            className="w-full p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <RefreshCw size={16} />
            Clear All
          </button>
        </div>
      </div>

      <div className="flex-1">
        <div className="bg-white rounded-lg shadow-lg p-6 inline-block">
          <canvas ref={canvasRef} className="border border-gray-300 rounded-lg" />
          
          {activeObject && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Selected:</span> {activeObject.customName || activeObject.type}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Drag to move • Corners to resize • Outside to rotate
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignCanvas;