import React, { useEffect, useRef, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { 
  Upload, Palette, Type, Trash2, Undo, Redo, Sparkles, 
  Image as ImageIcon, Move, Info, Download, Settings, CheckCircle2
} from 'lucide-react';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Helper function to adjust color brightness
const adjustBrightness = (color, percent) => {
  const num = parseInt(color.replace("#",""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 +
    (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255))
    .toString(16).slice(1);
};

// Create gradient for realistic shading
const createGradient = (x1, y1, x2, y2, baseColor) => {
  return new fabric.Gradient({
    type: 'linear',
    coords: { x1, y1, x2, y2 },
    colorStops: [
      { offset: 0, color: baseColor },
      { offset: 0.3, color: baseColor },
      { offset: 0.7, color: adjustBrightness(baseColor, -12) },
      { offset: 1, color: adjustBrightness(baseColor, -22) }
    ]
  });
};

// ============================================================================
// REALISTIC DRESS SHAPES WITH INTEGRATED NECKLINES
// Each dress type has variations based on neck and sleeve styles
// ============================================================================

const createKurtiShape = (neckStyle, sleeveStyle, color) => {
  const shapes = [];
  
  // Main body with realistic curves and shading
  const bodyGradient = createGradient(215, 180, 385, 180, color);
  const body = new fabric.Path(
    'M 242 175 Q 237 180 234 190 Q 232 205 230 220 L 230 455 Q 230 475 232 490 Q 234 500 240 506 Q 247 511 257 513 L 343 513 Q 353 511 360 506 Q 366 500 368 490 Q 370 475 370 455 L 370 220 Q 368 205 366 190 Q 363 180 358 175 Z',
    {
      fill: bodyGradient,
      stroke: '#00000018',
      strokeWidth: 1,
      selectable: false,
      evented: false
    }
  );
  shapes.push(body);

  // Add side shadows for depth
  const leftShadow = new fabric.Path(
    'M 230 220 L 230 455 Q 230 475 232 490 Q 234 500 240 506 Q 235 501 233 490 Q 230 475 230 455 L 230 220 Z',
    {
      fill: 'rgba(0,0,0,0.12)',
      selectable: false,
      evented: false
    }
  );
  
  const rightShadow = new fabric.Path(
    'M 370 220 L 370 455 Q 370 475 368 490 Q 366 500 360 506 Q 365 501 367 490 Q 370 475 370 455 L 370 220 Z',
    {
      fill: 'rgba(255,255,255,0.08)',
      selectable: false,
      evented: false
    }
  );
  shapes.push(leftShadow, rightShadow);

  // Princess seams for structure
  const leftSeam = new fabric.Path(
    'M 260 200 Q 258 280 256 400 Q 255 450 256 500',
    { stroke: 'rgba(0,0,0,0.06)', strokeWidth: 1.5, fill: '', selectable: false, evented: false }
  );
  const rightSeam = new fabric.Path(
    'M 340 200 Q 342 280 344 400 Q 345 450 344 500',
    { stroke: 'rgba(0,0,0,0.06)', strokeWidth: 1.5, fill: '', selectable: false, evented: false }
  );
  shapes.push(leftSeam, rightSeam);

  // Neckline with proper finishing
  let neckPath, neckBinding;
  switch(neckStyle) {
    case 'round':
      neckPath = new fabric.Ellipse({
        left: 300,
        top: 165,
        rx: 40,
        ry: 30,
        fill: '#fafafa',
        stroke: color,
        strokeWidth: 5,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false
      });
      // Neck binding (folded edge)
      neckBinding = new fabric.Ellipse({
        left: 300,
        top: 165,
        rx: 42,
        ry: 32,
        fill: 'transparent',
        stroke: adjustBrightness(color, -30),
        strokeWidth: 2.5,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false
      });
      shapes.push(neckPath, neckBinding);
      break;
    case 'vNeck':
      neckPath = new fabric.Path(
        'M 272 160 Q 282 175 300 205 Q 318 175 328 160 L 330 163 Q 320 178 300 210 Q 280 178 270 163 Z',
        {
          fill: '#fafafa',
          stroke: color,
          strokeWidth: 4,
          selectable: false,
          evented: false
        }
      );
      // V-neck binding
      neckBinding = new fabric.Path(
        'M 272 160 Q 282 175 300 205 Q 318 175 328 160',
        {
          stroke: adjustBrightness(color, -30),
          strokeWidth: 2,
          fill: '',
          selectable: false,
          evented: false
        }
      );
      shapes.push(neckPath, neckBinding);
      break;
    case 'boat':
      neckPath = new fabric.Path(
        'M 262 168 Q 277 163 300 163 Q 323 163 338 168 L 338 178 Q 323 173 300 173 Q 277 173 262 178 Z',
        {
          fill: '#fafafa',
          stroke: color,
          strokeWidth: 4,
          selectable: false,
          evented: false
        }
      );
      shapes.push(neckPath);
      break;
    case 'square':
      neckPath = new fabric.Rect({
        left: 270,
        top: 160,
        width: 60,
        height: 32,
        fill: '#fafafa',
        stroke: color,
        strokeWidth: 4,
        selectable: false,
        evented: false
      });
      shapes.push(neckPath);
      break;
  }

  // Sleeves with proper shading, folds and cuffs
  if (sleeveStyle === 'full') {
    // LEFT SLEEVE
    const leftSleeveGradient = createGradient(150, 200, 215, 200, color);
    const leftSleeve = new fabric.Path(
      'M 230 195 Q 222 200 212 212 Q 187 235 172 268 Q 160 295 157 325 Q 155 355 160 382 Q 165 405 175 420 L 222 392 L 230 315 Z',
      { 
        fill: leftSleeveGradient, 
        stroke: '#00000018', 
        strokeWidth: 1, 
        selectable: false, 
        evented: false 
      }
    );
    
    // Sleeve folds for realism
    const leftFold1 = new fabric.Path(
      'M 207 245 Q 180 280 173 330',
      { stroke: 'rgba(0,0,0,0.10)', strokeWidth: 1.5, fill: '', selectable: false, evented: false }
    );
    const leftFold2 = new fabric.Path(
      'M 217 270 Q 195 300 188 345',
      { stroke: 'rgba(0,0,0,0.07)', strokeWidth: 1.5, fill: '', selectable: false, evented: false }
    );
    const leftFold3 = new fabric.Path(
      'M 225 295 Q 210 320 205 360',
      { stroke: 'rgba(0,0,0,0.05)', strokeWidth: 1, fill: '', selectable: false, evented: false }
    );
    
    // Realistic cuff with gathering
    const leftCuff = new fabric.Path(
      'M 165 412 Q 175 418 188 420 Q 200 422 212 420 L 222 392 Q 210 395 195 395 Q 180 393 170 388 Z',
      {
        fill: adjustBrightness(color, -25),
        stroke: '#00000025',
        strokeWidth: 1,
        selectable: false,
        evented: false
      }
    );
    
    // Cuff stitching detail
    const leftCuffStitch = new fabric.Path(
      'M 168 408 Q 180 413 195 413 Q 208 412 220 407',
      { stroke: 'rgba(0,0,0,0.15)', strokeWidth: 1, fill: '', selectable: false, evented: false }
    );
    
    // RIGHT SLEEVE (mirror of left)
    const rightSleeveGradient = createGradient(385, 200, 450, 200, color);
    const rightSleeve = new fabric.Path(
      'M 370 195 Q 378 200 388 212 Q 413 235 428 268 Q 440 295 443 325 Q 445 355 440 382 Q 435 405 425 420 L 378 392 L 370 315 Z',
      { 
        fill: rightSleeveGradient, 
        stroke: '#00000018', 
        strokeWidth: 1, 
        selectable: false, 
        evented: false 
      }
    );
    
    const rightFold1 = new fabric.Path(
      'M 393 245 Q 420 280 427 330',
      { stroke: 'rgba(0,0,0,0.10)', strokeWidth: 1.5, fill: '', selectable: false, evented: false }
    );
    const rightFold2 = new fabric.Path(
      'M 383 270 Q 405 300 412 345',
      { stroke: 'rgba(0,0,0,0.07)', strokeWidth: 1.5, fill: '', selectable: false, evented: false }
    );
    const rightFold3 = new fabric.Path(
      'M 375 295 Q 390 320 395 360',
      { stroke: 'rgba(0,0,0,0.05)', strokeWidth: 1, fill: '', selectable: false, evented: false }
    );
    
    const rightCuff = new fabric.Path(
      'M 435 412 Q 425 418 412 420 Q 400 422 388 420 L 378 392 Q 390 395 405 395 Q 420 393 430 388 Z',
      {
        fill: adjustBrightness(color, -25),
        stroke: '#00000025',
        strokeWidth: 1,
        selectable: false,
        evented: false
      }
    );
    
    const rightCuffStitch = new fabric.Path(
      'M 432 408 Q 420 413 405 413 Q 392 412 380 407',
      { stroke: 'rgba(0,0,0,0.15)', strokeWidth: 1, fill: '', selectable: false, evented: false }
    );
    
    shapes.push(leftSleeve, leftFold1, leftFold2, leftFold3, leftCuff, leftCuffStitch);
    shapes.push(rightSleeve, rightFold1, rightFold2, rightFold3, rightCuff, rightCuffStitch);
    
  } else if (sleeveStyle === 'half') {
    // LEFT HALF SLEEVE
    const leftSleeve = new fabric.Path(
      'M 230 195 Q 217 205 202 222 Q 187 243 180 270 Q 177 288 180 305 L 222 295 L 230 255 Z',
      { 
        fill: createGradient(180, 200, 230, 200, color), 
        stroke: '#00000018', 
        strokeWidth: 1, 
        selectable: false, 
        evented: false 
      }
    );
    const leftFold = new fabric.Path(
      'M 212 235 Q 197 255 190 282',
      { stroke: 'rgba(0,0,0,0.10)', strokeWidth: 1.5, fill: '', selectable: false, evented: false }
    );
    const leftHem = new fabric.Path(
      'M 180 300 Q 192 303 210 302 L 222 295',
      { stroke: adjustBrightness(color, -35), strokeWidth: 3.5, fill: '', selectable: false, evented: false }
    );
    
    // RIGHT HALF SLEEVE
    const rightSleeve = new fabric.Path(
      'M 370 195 Q 383 205 398 222 Q 413 243 420 270 Q 423 288 420 305 L 378 295 L 370 255 Z',
      { 
        fill: createGradient(370, 200, 420, 200, color), 
        stroke: '#00000018', 
        strokeWidth: 1, 
        selectable: false, 
        evented: false 
      }
    );
    const rightFold = new fabric.Path(
      'M 388 235 Q 403 255 410 282',
      { stroke: 'rgba(0,0,0,0.10)', strokeWidth: 1.5, fill: '', selectable: false, evented: false }
    );
    const rightHem = new fabric.Path(
      'M 420 300 Q 408 303 390 302 L 378 295',
      { stroke: adjustBrightness(color, -35), strokeWidth: 3.5, fill: '', selectable: false, evented: false }
    );
    
    shapes.push(leftSleeve, leftFold, leftHem);
    shapes.push(rightSleeve, rightFold, rightHem);
    
  } else if (sleeveStyle === 'cap') {
    // LEFT CAP SLEEVE
    const leftSleeve = new fabric.Path(
      'M 230 195 Q 217 207 207 225 Q 202 237 204 248 L 222 243 L 230 218 Z',
      { 
        fill: createGradient(205, 200, 230, 200, color), 
        stroke: '#00000018', 
        strokeWidth: 1, 
        selectable: false, 
        evented: false 
      }
    );
    const leftHem = new fabric.Path(
      'M 204 245 Q 212 248 222 246',
      { stroke: adjustBrightness(color, -35), strokeWidth: 3, fill: '', selectable: false, evented: false }
    );
    
    // RIGHT CAP SLEEVE
    const rightSleeve = new fabric.Path(
      'M 370 195 Q 383 207 393 225 Q 398 237 396 248 L 378 243 L 370 218 Z',
      { 
        fill: createGradient(370, 200, 395, 200, color), 
        stroke: '#00000018', 
        strokeWidth: 1, 
        selectable: false, 
        evented: false 
      }
    );
    const rightHem = new fabric.Path(
      'M 396 245 Q 388 248 378 246',
      { stroke: adjustBrightness(color, -35), strokeWidth: 3, fill: '', selectable: false, evented: false }
    );
    
    shapes.push(leftSleeve, leftHem, rightSleeve, rightHem);
  }

  // Bottom hem with proper border and stitching
  const hemBorder = new fabric.Rect({
    left: 235,
    top: 508,
    width: 130,
    height: 12,
    rx: 2,
    fill: adjustBrightness(color, -28),
    selectable: false,
    evented: false
  });
  
  // Hem top stitching
  const hemTopStitch = new fabric.Line([235, 509, 365, 509], {
    stroke: 'rgba(0,0,0,0.20)',
    strokeWidth: 1,
    selectable: false,
    evented: false
  });
  
  // Hem bottom stitching
  const hemBottomStitch = new fabric.Line([235, 518, 365, 518], {
    stroke: 'rgba(0,0,0,0.15)',
    strokeWidth: 1,
    selectable: false,
    evented: false
  });
  
  shapes.push(hemBorder, hemTopStitch, hemBottomStitch);

  return shapes;
};

const createKurtaShape = (neckStyle, sleeveStyle, color) => {
  const shapes = [];
  
  // Main body (longer for Kurta) with gradient
  const bodyGradient = createGradient(220, 180, 380, 180, color);
  const body = new fabric.Path(
    'M 240 175 Q 235 180 232 190 Q 230 205 228 220 L 228 550 Q 228 570 230 585 Q 232 595 238 602 Q 245 607 255 609 L 345 609 Q 355 607 362 602 Q 368 595 370 585 Q 372 570 372 550 L 372 220 Q 370 205 368 190 Q 365 180 360 175 Z',
    {
      fill: bodyGradient,
      stroke: '#00000018',
      strokeWidth: 1,
      selectable: false,
      evented: false
    }
  );
  shapes.push(body);

  // Side shadows
  const leftShadow = new fabric.Path(
    'M 228 220 L 228 550 Q 228 570 230 585 Q 232 595 238 602 Q 233 597 231 585 Q 228 570 228 550 L 228 220 Z',
    { fill: 'rgba(0,0,0,0.12)', selectable: false, evented: false }
  );
  const rightShadow = new fabric.Path(
    'M 372 220 L 372 550 Q 372 570 370 585 Q 368 595 362 602 Q 367 597 369 585 Q 372 570 372 550 L 372 220 Z',
    { fill: 'rgba(255,255,255,0.08)', selectable: false, evented: false }
  );
  shapes.push(leftShadow, rightShadow);

  // Collar/Neckline
  let collar;
  switch(neckStyle) {
    case 'collar':
      // Mandarin collar with realistic shading
      collar = new fabric.Rect({
        left: 278,
        top: 168,
        width: 44,
        height: 22,
        rx: 6,
        ry: 6,
        fill: createGradient(278, 168, 322, 168, color),
        stroke: '#00000035',
        strokeWidth: 2,
        selectable: false,
        evented: false
      });
      // Collar button
      const collarButton = new fabric.Circle({
        left: 300,
        top: 179,
        radius: 3,
        fill: '#ffffff',
        stroke: '#cccccc',
        strokeWidth: 1,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false
      });
      shapes.push(collar, collarButton);
      break;
    case 'round':
      collar = new fabric.Ellipse({
        left: 300,
        top: 165,
        rx: 35,
        ry: 25,
        fill: '#fafafa',
        stroke: color,
        strokeWidth: 4,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false
      });
      shapes.push(collar);
      break;
  }

  // Center placket with shadow
  const placket = new fabric.Rect({
    left: 293,
    top: 200,
    width: 14,
    height: 350,
    fill: 'rgba(0,0,0,0.08)',
    selectable: false,
    evented: false
  });
  
  const placketHighlight = new fabric.Rect({
    left: 293,
    top: 200,
    width: 2,
    height: 350,
    fill: 'rgba(255,255,255,0.15)',
    selectable: false,
    evented: false
  });
  shapes.push(placket, placketHighlight);

  // Realistic buttons with shadows
  for (let i = 0; i < 8; i++) {
    const buttonY = 220 + (i * 42);
    
    // Button shadow
    const buttonShadow = new fabric.Circle({
      left: 301,
      top: buttonY + 1,
      radius: 5,
      fill: 'rgba(0,0,0,0.15)',
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false
    });
    
    // Button
    const button = new fabric.Circle({
      left: 300,
      top: buttonY,
      radius: 5,
      fill: '#ffffff',
      stroke: '#d0d0d0',
      strokeWidth: 1.5,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false
    });
    
    // Button holes (for realism)
    const hole1 = new fabric.Circle({
      left: 298,
      top: buttonY - 1,
      radius: 0.8,
      fill: '#999999',
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false
    });
    
    const hole2 = new fabric.Circle({
      left: 302,
      top: buttonY + 1,
      radius: 0.8,
      fill: '#999999',
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false
    });
    
    shapes.push(buttonShadow, button, hole1, hole2);
  }

  // Sleeves
  if (sleeveStyle === 'full') {
    const leftSleeve = new fabric.Path(
      'M 228 200 Q 183 222 163 285 Q 153 335 158 390 Q 163 435 178 465 L 223 430 L 228 330 Z',
      { 
        fill: createGradient(163, 220, 228, 220, color), 
        stroke: '#00000018', 
        strokeWidth: 1, 
        selectable: false, 
        evented: false 
      }
    );
    
    // Sleeve folds
    const leftFold1 = new fabric.Path('M 208 250 Q 183 290 175 350', 
      { stroke: 'rgba(0,0,0,0.10)', strokeWidth: 1.5, fill: '', selectable: false, evented: false });
    const leftFold2 = new fabric.Path('M 218 280 Q 198 315 190 370', 
      { stroke: 'rgba(0,0,0,0.07)', strokeWidth: 1.5, fill: '', selectable: false, evented: false });
    
    // Cuff
    const leftCuff = new fabric.Path(
      'M 168 455 Q 180 462 195 464 Q 210 465 223 462 L 223 430 Q 210 435 195 435 Q 180 433 173 428 Z',
      { fill: adjustBrightness(color, -25), stroke: '#00000025', strokeWidth: 1, selectable: false, evented: false }
    );
    
    const rightSleeve = new fabric.Path(
      'M 372 200 Q 417 222 437 285 Q 447 335 442 390 Q 437 435 422 465 L 377 430 L 372 330 Z',
      { 
        fill: createGradient(372, 220, 437, 220, color), 
        stroke: '#00000018', 
        strokeWidth: 1, 
        selectable: false, 
        evented: false 
      }
    );
    
    const rightFold1 = new fabric.Path('M 392 250 Q 417 290 425 350', 
      { stroke: 'rgba(0,0,0,0.10)', strokeWidth: 1.5, fill: '', selectable: false, evented: false });
    const rightFold2 = new fabric.Path('M 382 280 Q 402 315 410 370', 
      { stroke: 'rgba(0,0,0,0.07)', strokeWidth: 1.5, fill: '', selectable: false, evented: false });
    
    const rightCuff = new fabric.Path(
      'M 432 455 Q 420 462 405 464 Q 390 465 377 462 L 377 430 Q 390 435 405 435 Q 420 433 427 428 Z',
      { fill: adjustBrightness(color, -25), stroke: '#00000025', strokeWidth: 1, selectable: false, evented: false }
    );
    
    shapes.push(leftSleeve, leftFold1, leftFold2, leftCuff);
    shapes.push(rightSleeve, rightFold1, rightFold2, rightCuff);
    
  } else if (sleeveStyle === 'half') {
    const leftSleeve = new fabric.Path(
      'M 228 200 Q 198 217 188 255 Q 183 280 188 305 L 223 295 L 228 265 Z',
      { fill: createGradient(188, 215, 228, 215, color), stroke: '#00000018', strokeWidth: 1, selectable: false, evented: false }
    );
    const leftFold = new fabric.Path('M 213 235 Q 198 260 193 285', 
      { stroke: 'rgba(0,0,0,0.10)', strokeWidth: 1.5, fill: '', selectable: false, evented: false });
    const leftHem = new fabric.Path('M 188 300 Q 200 303 215 302 L 223 295', 
      { stroke: adjustBrightness(color, -35), strokeWidth: 3.5, fill: '', selectable: false, evented: false });
    
    const rightSleeve = new fabric.Path(
      'M 372 200 Q 402 217 412 255 Q 417 280 412 305 L 377 295 L 372 265 Z',
      { fill: createGradient(372, 215, 412, 215, color), stroke: '#00000018', strokeWidth: 1, selectable: false, evented: false }
    );
    const rightFold = new fabric.Path('M 387 235 Q 402 260 407 285', 
      { stroke: 'rgba(0,0,0,0.10)', strokeWidth: 1.5, fill: '', selectable: false, evented: false });
    const rightHem = new fabric.Path('M 412 300 Q 400 303 385 302 L 377 295', 
      { stroke: adjustBrightness(color, -35), strokeWidth: 3.5, fill: '', selectable: false, evented: false });
    
    shapes.push(leftSleeve, leftFold, leftHem);
    shapes.push(rightSleeve, rightFold, rightHem);
  }

  return shapes;
};

const createLehengaShape = (color) => {
  const shapes = [];
  
  // Blouse/Choli with detailed structure
  const blouseGradient = createGradient(220, 160, 380, 160, color);
  const blouse = new fabric.Path(
    'M 242 160 Q 237 165 234 175 Q 232 185 230 200 L 230 285 Q 230 298 235 303 Q 240 306 248 308 L 352 308 Q 360 306 365 303 Q 370 298 370 285 L 370 200 Q 368 185 366 175 Q 363 165 358 160 Z',
    { 
      fill: blouseGradient, 
      stroke: '#00000018', 
      strokeWidth: 1, 
      selectable: false, 
      evented: false 
    }
  );
  
  // Princess seams on blouse
  const blouseSeamL = new fabric.Path('M 258 175 Q 256 220 255 285', 
    { stroke: 'rgba(0,0,0,0.08)', strokeWidth: 1.5, fill: '', selectable: false, evented: false });
  const blouseSeamR = new fabric.Path('M 342 175 Q 344 220 345 285', 
    { stroke: 'rgba(0,0,0,0.08)', strokeWidth: 1.5, fill: '', selectable: false, evented: false });
  
  // Blouse neckline
  const neck = new fabric.Ellipse({
    left: 300,
    top: 155,
    rx: 32,
    ry: 22,
    fill: '#fafafa',
    stroke: color,
    strokeWidth: 4,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  // Short sleeves
  const leftSleeve = new fabric.Path(
    'M 230 175 Q 215 185 205 200 Q 198 215 200 230 L 225 225 L 230 200 Z',
    { fill: createGradient(200, 180, 230, 180, color), stroke: '#00000015', strokeWidth: 1, selectable: false, evented: false }
  );
  const rightSleeve = new fabric.Path(
    'M 370 175 Q 385 185 395 200 Q 402 215 400 230 L 375 225 L 370 200 Z',
    { fill: createGradient(370, 180, 400, 180, color), stroke: '#00000015', strokeWidth: 1, selectable: false, evented: false }
  );
  
  // Waist band
  const waistBand = new fabric.Rect({
    left: 235,
    top: 303,
    width: 130,
    height: 8,
    fill: adjustBrightness(color, -30),
    selectable: false,
    evented: false
  });
  
  // Lehenga skirt with flare and realistic pleats
  const skirtGradient = createGradient(160, 320, 440, 320, color);
  const skirt = new fabric.Path(
    'M 240 315 Q 210 340 185 380 Q 165 425 160 475 Q 157 515 165 550 Q 175 575 195 588 Q 215 597 240 600 L 360 600 Q 385 597 405 588 Q 425 575 435 550 Q 443 515 440 475 Q 435 425 415 380 Q 390 340 360 315 Z',
    { 
      fill: skirtGradient, 
      stroke: '#00000020', 
      strokeWidth: 1, 
      selectable: false, 
      evented: false 
    }
  );
  
  // Realistic pleats with proper spacing
  for (let i = 0; i < 11; i++) {
    const topX = 240 + (i * 12);
    const bottomX = 175 + (i * 20.5);
    const pleat = new fabric.Path(
      `M ${topX} 318 L ${bottomX} 595`,
      { 
        stroke: 'rgba(0,0,0,0.12)', 
        strokeWidth: i % 2 === 0 ? 2 : 1, 
        selectable: false, 
        evented: false 
      }
    );
    shapes.push(pleat);
  }
  
  // Decorative border with embellishments
  const borderBase = new fabric.Rect({
    left: 170,
    top: 593,
    width: 260,
    height: 10,
    rx: 2,
    fill: '#d4af37',
    opacity: 0.8,
    selectable: false,
    evented: false
  });
  
  // Border pattern
  for (let i = 0; i < 25; i++) {
    const dot = new fabric.Circle({
      left: 175 + (i * 10),
      top: 598,
      radius: 2,
      fill: '#ffffff',
      opacity: 0.7,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false
    });
    shapes.push(dot);
  }
  
  shapes.push(blouse, blouseSeamL, blouseSeamR, neck, leftSleeve, rightSleeve, waistBand, skirt, borderBase);
  return shapes;
};

const createAnarkaliShape = (color) => {
  const shapes = [];
  
  // Fitted bodice with structure
  const bodiceGradient = createGradient(220, 160, 380, 160, color);
  const bodice = new fabric.Path(
    'M 242 160 Q 237 165 234 175 Q 232 190 230 210 L 230 310 Q 230 323 235 328 Q 240 331 248 333 L 352 333 Q 360 331 365 328 Q 370 323 370 310 L 370 210 Q 368 190 366 175 Q 363 165 358 160 Z',
    { 
      fill: bodiceGradient, 
      stroke: '#00000018', 
      strokeWidth: 1, 
      selectable: false, 
      evented: false 
    }
  );
  
  // Bodice structure lines
  const bodiceSeamL = new fabric.Path('M 258 175 Q 256 230 255 315', 
    { stroke: 'rgba(0,0,0,0.08)', strokeWidth: 1.5, fill: '', selectable: false, evented: false });
  const bodiceSeamR = new fabric.Path('M 342 175 Q 344 230 345 315', 
    { stroke: 'rgba(0,0,0,0.08)', strokeWidth: 1.5, fill: '', selectable: false, evented: false });
  
  // Neckline
  const neck = new fabric.Ellipse({
    left: 300,
    top: 155,
    rx: 34,
    ry: 24,
    fill: '#fafafa',
    stroke: color,
    strokeWidth: 4,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  // Sleeves (cap style for Anarkali)
  const leftSleeve = new fabric.Path(
    'M 230 175 Q 212 188 202 210 Q 197 225 200 238 L 225 232 L 230 210 Z',
    { fill: createGradient(200, 180, 230, 180, color), stroke: '#00000018', strokeWidth: 1, selectable: false, evented: false }
  );
  const rightSleeve = new fabric.Path(
    'M 370 175 Q 388 188 398 210 Q 403 225 400 238 L 375 232 L 370 210 Z',
    { fill: createGradient(370, 180, 400, 180, color), stroke: '#00000018', strokeWidth: 1, selectable: false, evented: false }
  );
  
  // Empire waist band
  const waistBand = new fabric.Rect({
    left: 233,
    top: 328,
    width: 134,
    height: 12,
    fill: adjustBrightness(color, -30),
    stroke: '#d4af37',
    strokeWidth: 2,
    selectable: false,
    evented: false
  });
  
  // Golden embellishments on waist
  for (let i = 0; i < 12; i++) {
    const embellish = new fabric.Circle({
      left: 240 + (i * 11),
      top: 334,
      radius: 2.5,
      fill: '#d4af37',
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false
    });
    shapes.push(embellish);
  }
  
  // Flared Anarkali skirt with realistic drape
  const flareGradient = createGradient(155, 345, 445, 345, color);
  const flare = new fabric.Path(
    'M 240 345 Q 200 375 175 420 Q 155 470 152 520 Q 150 560 160 590 Q 172 612 195 622 Q 220 630 250 632 L 350 632 Q 380 630 405 622 Q 428 612 440 590 Q 450 560 448 520 Q 445 470 425 420 Q 400 375 360 345 Z',
    { 
      fill: flareGradient, 
      stroke: '#00000020', 
      strokeWidth: 1, 
      selectable: false, 
      evented: false 
    }
  );
  
  // Flare fold lines for realistic draping
  const folds = [
    'M 250 360 Q 210 410 195 480 Q 190 530 200 590',
    'M 270 355 Q 235 405 220 475 Q 215 525 225 585',
    'M 300 350 Q 300 410 300 480 Q 300 540 300 600',
    'M 330 355 Q 365 405 380 475 Q 385 525 375 585',
    'M 350 360 Q 390 410 405 480 Q 410 530 400 590'
  ];
  
  folds.forEach((pathData, i) => {
    const fold = new fabric.Path(pathData, {
      stroke: i === 2 ? 'rgba(0,0,0,0.10)' : 'rgba(0,0,0,0.07)',
      strokeWidth: i === 2 ? 1.5 : 1,
      fill: '',
      selectable: false,
      evented: false
    });
    shapes.push(fold);
  });
  
  // Bottom border with intricate design
  const border = new fabric.Rect({
    left: 165,
    top: 625,
    width: 270,
    height: 10,
    rx: 2,
    fill: '#d4af37',
    opacity: 0.8,
    selectable: false,
    evented: false
  });
  
  // Border decorative elements
  for (let i = 0; i < 27; i++) {
    const element = new fabric.Circle({
      left: 170 + (i * 10),
      top: 630,
      radius: i % 3 === 0 ? 2.5 : 1.5,
      fill: '#ffffff',
      opacity: 0.8,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false
    });
    shapes.push(element);
  }
  
  shapes.push(bodice, bodiceSeamL, bodiceSeamR, neck, leftSleeve, rightSleeve, waistBand, flare, border);
  return shapes;
};

const createSherwaniShape = (color) => {
  const shapes = [];
  
  // Main long coat with proper structure
  const bodyGradient = createGradient(215, 165, 385, 165, color);
  const body = new fabric.Path(
    'M 238 165 Q 233 170 230 180 Q 228 195 226 210 L 226 595 Q 226 615 228 630 Q 230 640 236 647 Q 243 652 253 654 L 347 654 Q 357 652 364 647 Q 370 640 372 630 Q 374 615 374 595 L 374 210 Q 372 195 370 180 Q 367 170 362 165 Z',
    { 
      fill: bodyGradient, 
      stroke: '#00000020', 
      strokeWidth: 1, 
      selectable: false, 
      evented: false 
    }
  );
  
  // Side shadows for depth
  const leftShadow = new fabric.Path(
    'M 226 210 L 226 595 Q 226 615 228 630 Q 230 640 236 647 Q 231 642 229 630 Q 226 615 226 595 L 226 210 Z',
    { fill: 'rgba(0,0,0,0.15)', selectable: false, evented: false }
  );
  const rightShadow = new fabric.Path(
    'M 374 210 L 374 595 Q 374 615 372 630 Q 370 640 364 647 Q 369 642 371 630 Q 374 615 374 595 L 374 210 Z',
    { fill: 'rgba(255,255,255,0.10)', selectable: false, evented: false }
  );
  
  // Mandarin collar with proper shaping
  const collar = new fabric.Path(
    'M 268 160 Q 265 163 264 168 Q 263 172 265 178 L 275 185 L 325 185 L 335 178 Q 337 172 336 168 Q 335 163 332 160 Z',
    { 
      fill: createGradient(268, 160, 332, 160, color), 
      stroke: '#d4af37', 
      strokeWidth: 2.5, 
      selectable: false, 
      evented: false 
    }
  );
  
  // Collar hook
  const collarHook = new fabric.Rect({
    left: 297,
    top: 178,
    width: 6,
    height: 4,
    fill: '#d4af37',
    selectable: false,
    evented: false
  });
  
  // Center panel with embroidery area
  const panel = new fabric.Rect({
    left: 288,
    top: 195,
    width: 24,
    height: 420,
    fill: 'rgba(0,0,0,0.10)',
    selectable: false,
    evented: false
  });
  
  const panelHighlight = new fabric.Rect({
    left: 288,
    top: 195,
    width: 3,
    height: 420,
    fill: 'rgba(255,255,255,0.12)',
    selectable: false,
    evented: false
  });
  
  // Decorative buttons (golden) with shadows
  for (let i = 0; i < 10; i++) {
    const buttonY = 215 + (i * 42);
    
    // Button shadow
    const buttonShadow = new fabric.Circle({
      left: 301,
      top: buttonY + 1.5,
      radius: 6,
      fill: 'rgba(0,0,0,0.20)',
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false
    });
    
    // Button base
    const button = new fabric.Circle({
      left: 300,
      top: buttonY,
      radius: 6,
      fill: '#d4af37',
      stroke: '#b8950c',
      strokeWidth: 1.5,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false
    });
    
    // Button detail (center)
    const buttonCenter = new fabric.Circle({
      left: 300,
      top: buttonY,
      radius: 3,
      fill: '#f4e4a3',
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false
    });
    
    shapes.push(buttonShadow, button, buttonCenter);
  }
  
  // Side embroidery panels with subtle pattern
  const leftPanel = new fabric.Rect({
    left: 240,
    top: 210,
    width: 45,
    height: 380,
    fill: 'rgba(0,0,0,0.06)',
    selectable: false,
    evented: false
  });
  
  const rightPanel = new fabric.Rect({
    left: 315,
    top: 210,
    width: 45,
    height: 380,
    fill: 'rgba(0,0,0,0.06)',
    selectable: false,
    evented: false
  });
  
  // Decorative vertical lines on panels
  for (let i = 0; i < 3; i++) {
    const leftLine = new fabric.Line(
      [245 + (i * 13), 220, 245 + (i * 13), 580],
      { stroke: 'rgba(212,175,55,0.2)', strokeWidth: 1, selectable: false, evented: false }
    );
    const rightLine = new fabric.Line(
      [320 + (i * 13), 220, 320 + (i * 13), 580],
      { stroke: 'rgba(212,175,55,0.2)', strokeWidth: 1, selectable: false, evented: false }
    );
    shapes.push(leftLine, rightLine);
  }
  
  // Bottom hem with golden border
  const hemBorder = new fabric.Rect({
    left: 231,
    top: 649,
    width: 138,
    height: 8,
    rx: 2,
    fill: '#d4af37',
    opacity: 0.9,
    selectable: false,
    evented: false
  });
  
  shapes.push(body, leftShadow, rightShadow, collar, collarHook, panel, panelHighlight, leftPanel, rightPanel, hemBorder);
  return shapes;
};

// ============================================================================
// ZONE DEFINITIONS
// ============================================================================

const ZONES = {
  Kurti: [
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
  ]
};

// ============================================================================
// EMBROIDERY PATTERNS (Real repeating motifs)
// ============================================================================

const EMBROIDERY_PATTERNS = {
  floral: {
    name: 'Floral Embroidery',
    createPattern: (color = '#ec4899') => {
      const canvas = document.createElement('canvas');
      canvas.width = 60;
      canvas.height = 60;
      const ctx = canvas.getContext('2d');
      
      // Draw floral motif
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(30, 30, 8, 0, Math.PI * 2);
      ctx.fill();
      
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        const x = 30 + Math.cos(angle) * 15;
        const y = 30 + Math.sin(angle) * 15;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      
      return canvas;
    }
  },
  paisley: {
    name: 'Paisley Pattern',
    createPattern: (color = '#f59e0b') => {
      const canvas = document.createElement('canvas');
      canvas.width = 50;
      canvas.height = 70;
      const ctx = canvas.getContext('2d');
      
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(25, 35, 15, 25, 0.3, 0, Math.PI * 2);
      ctx.fill();
      
      return canvas;
    }
  },
  zari: {
    name: 'Zari Work',
    createPattern: (color = '#ffd700') => {
      const canvas = document.createElement('canvas');
      canvas.width = 40;
      canvas.height = 40;
      const ctx = canvas.getContext('2d');
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      
      // Create zari pattern
      ctx.beginPath();
      ctx.moveTo(0, 20);
      ctx.lineTo(40, 20);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.lineTo(20, 40);
      ctx.stroke();
      
      for (let i = 0; i < 4; i++) {
        const x = 10 + (i % 2) * 20;
        const y = 10 + Math.floor(i / 2) * 20;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      
      return canvas;
    }
  },
  thread: {
    name: 'Thread Embroidery',
    createPattern: (color = '#10b981') => {
      const canvas = document.createElement('canvas');
      canvas.width = 30;
      canvas.height = 30;
      const ctx = canvas.getContext('2d');
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      
      // Cross-stitch pattern
      ctx.beginPath();
      ctx.moveTo(5, 5);
      ctx.lineTo(25, 25);
      ctx.moveTo(25, 5);
      ctx.lineTo(5, 25);
      ctx.stroke();
      
      return canvas;
    }
  },
  mirror: {
    name: 'Mirror Work',
    createPattern: (color = '#38bdf8') => {
      const canvas = document.createElement('canvas');
      canvas.width = 35;
      canvas.height = 35;
      const ctx = canvas.getContext('2d');
      
      // Mirror circle
      const gradient = ctx.createRadialGradient(17.5, 17.5, 5, 17.5, 17.5, 12);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.5, color);
      gradient.addColorStop(1, '#0891b2');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(17.5, 17.5, 12, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      return canvas;
    }
  }
};

// ============================================================================
// FABRIC PRINTS (Full coverage textures)
// ============================================================================

const FABRIC_PRINTS = {
  blockPrint: {
    name: 'Block Print',
    createPattern: (baseColor) => {
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, 100, 100);
      
      // Block print motifs
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
  digitalFloral: {
    name: 'Digital Floral',
    createPattern: (baseColor) => {
      const canvas = document.createElement('canvas');
      canvas.width = 120;
      canvas.height = 120;
      const ctx = canvas.getContext('2d');
      
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, 120, 120);
      
      // Floral print
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
  tieDye: {
    name: 'Tie & Dye',
    createPattern: (baseColor) => {
      const canvas = document.createElement('canvas');
      canvas.width = 150;
      canvas.height = 150;
      const ctx = canvas.getContext('2d');
      
      // Create tie-dye effect
      const gradient = ctx.createRadialGradient(75, 75, 20, 75, 75, 75);
      gradient.addColorStop(0, baseColor);
      gradient.addColorStop(0.5, '#00000020');
      gradient.addColorStop(1, baseColor);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 150, 150);
      
      return canvas;
    }
  },
  geometric: {
    name: 'Geometric',
    createPattern: (baseColor) => {
      const canvas = document.createElement('canvas');
      canvas.width = 80;
      canvas.height = 80;
      const ctx = canvas.getContext('2d');
      
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, 80, 80);
      
      ctx.fillStyle = '#00000018';
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          const x = i * 40;
          const y = j * 40;
          ctx.fillRect(x, y, 20, 20);
          ctx.fillRect(x + 20, y + 20, 20, 20);
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
  selectedColor = '#e11d48' 
}) => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const historyRef = useRef({ stack: [], pointer: -1 });
  
  const [neckStyle, setNeckStyle] = useState('round');
  const [sleeveStyle, setSleeveStyle] = useState('full');
  const [selectedZone, setSelectedZone] = useState(null);
  const [activeTab, setActiveTab] = useState('styles');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [templateLoaded, setTemplateLoaded] = useState(false);

  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 700;
  
  const zones = ZONES[dressType] || ZONES.Kurti;

  // ============================================================================
  // INITIALIZE CANVAS
  // ============================================================================

  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: '#fafafa',
      selection: false,
      preserveObjectStacking: true,
    });

    fabricCanvasRef.current = canvas;
    loadGarment(canvas);

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [dressType, selectedColor, neckStyle, sleeveStyle]);

  // ============================================================================
  // LOAD GARMENT
  // ============================================================================

  const loadGarment = useCallback((canvas) => {
    canvas.clear();
    canvas.backgroundColor = '#fafafa';

    let shapes = [];
    
    switch(dressType) {
      case 'Kurti':
      case 'Kurti Sets':
        shapes = createKurtiShape(neckStyle, sleeveStyle, selectedColor);
        break;
      case 'Kurta':
      case 'Kurta Sets':
        shapes = createKurtaShape(neckStyle, sleeveStyle, selectedColor);
        break;
      case 'Lehenga':
        shapes = createLehengaShape(selectedColor);
        break;
      case 'Anarkali':
        shapes = createAnarkaliShape(selectedColor);
        break;
      case 'Sherwani':
      case 'Sheraras':
        shapes = createSherwaniShape(selectedColor);
        break;
    }

    shapes.forEach(shape => {
      shape.set({ selectable: false, evented: false });
      canvas.add(shape);
    });

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

    canvas.renderAll();
    setTemplateLoaded(true);
    saveToHistory(canvas, true);
  }, [dressType, selectedColor, neckStyle, sleeveStyle, zones]);

  // ============================================================================
  // APPLY EMBROIDERY
  // ============================================================================

  const applyEmbroidery = useCallback((patternKey) => {
    if (!selectedZone) return;
    
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const zone = zones.find(z => z.id === selectedZone);
    if (!zone) return;

    // Remove existing embroidery in zone
    canvas.getObjects().forEach(obj => {
      if (obj.customZone === selectedZone && obj.customType === 'embroidery') {
        canvas.remove(obj);
      }
    });

    const pattern = EMBROIDERY_PATTERNS[patternKey];
    if (!pattern) return;

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
      customType: 'embroidery'
    });

    canvas.add(rect);
    canvas.renderAll();
    saveToHistory(canvas);
    exportDesign(canvas);
  }, [selectedZone, zones]);

  // ============================================================================
  // APPLY FABRIC PRINT
  // ============================================================================

  const applyFabricPrint = useCallback((printKey) => {
    if (!selectedZone) return;
    
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const zone = zones.find(z => z.id === selectedZone);
    if (!zone) return;

    // Remove existing print
    canvas.getObjects().forEach(obj => {
      if (obj.customZone === selectedZone && obj.customType === 'print') {
        canvas.remove(obj);
      }
    });

    const print = FABRIC_PRINTS[printKey];
    if (!print) return;

    const printCanvas = print.createPattern(selectedColor);
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
    canvas.sendToBack(rect); // Behind embroidery
    canvas.renderAll();
    saveToHistory(canvas);
    exportDesign(canvas);
  }, [selectedZone, zones, selectedColor]);

  // ============================================================================
  // ZONE SELECTION WITH HIGHLIGHT
  // ============================================================================

  const handleZoneSelect = useCallback((zoneId) => {
    setSelectedZone(zoneId);
    
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Show/hide zone overlays
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
    if (!selectedZone) return;
    
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.getObjects().forEach(obj => {
      if (obj.customZone === selectedZone) {
        canvas.remove(obj);
      }
    });

    canvas.renderAll();
    saveToHistory(canvas);
    exportDesign(canvas);
  }, [selectedZone]);

  // ============================================================================
  // HISTORY MANAGEMENT
  // ============================================================================

  const saveToHistory = useCallback((canvas, isInitial = false) => {
    if (!canvas) return;

    const json = JSON.stringify(canvas.toJSON(['customZone', 'customType', 'zoneId']));
    const { stack, pointer } = historyRef.current;

    if (stack[pointer] === json) return;

    const newStack = stack.slice(0, pointer + 1);
    newStack.push(json);
    if (newStack.length > 50) newStack.shift();

    historyRef.current = { stack: newStack, pointer: newStack.length - 1 };
    setCanUndo(historyRef.current.pointer > 0);
    setCanRedo(false);

    if (!isInitial) exportDesign(canvas);
  }, []);

  const undo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || historyRef.current.pointer <= 0) return;

    const newPointer = historyRef.current.pointer - 1;
    historyRef.current.pointer = newPointer;

    canvas.loadFromJSON(JSON.parse(historyRef.current.stack[newPointer]), () => {
      canvas.renderAll();
      setCanUndo(newPointer > 0);
      setCanRedo(true);
    });
  }, []);

  const redo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || historyRef.current.pointer >= historyRef.current.stack.length - 1) return;

    const newPointer = historyRef.current.pointer + 1;
    historyRef.current.pointer = newPointer;

    canvas.loadFromJSON(JSON.parse(historyRef.current.stack[newPointer]), () => {
      canvas.renderAll();
      setCanUndo(true);
      setCanRedo(newPointer < historyRef.current.stack.length - 1);
    });
  }, []);

  const exportDesign = useCallback((canvas) => {
    if (!canvas || !onDesignChange) return;

    const json = JSON.stringify(canvas.toJSON(['customZone', 'customType', 'zoneId']));
    const png = canvas.toDataURL({ format: 'png', quality: 1 });
    const svg = canvas.toSVG();

    onDesignChange({ json, png, svg, neckStyle, sleeveStyle });
  }, [onDesignChange, neckStyle, sleeveStyle]);

  // ============================================================================
  // RENDER UI
  // ============================================================================

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-6">
      {/* Canvas */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Design Canvas</h3>
              <p className="text-sm text-gray-500">{dressType} Customization</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button onClick={undo} disabled={!canUndo} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl disabled:opacity-30 transition-all">
              <Undo size={18} />
            </button>
            <button onClick={redo} disabled={!canRedo} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl disabled:opacity-30 transition-all">
              <Redo size={18} />
            </button>
          </div>
        </div>

        <div className="flex justify-center bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8">
          <canvas ref={canvasRef} className="border-4 border-white rounded-2xl shadow-2xl" />
        </div>

        {/* Zone Selector */}
        <div className="mt-6">
          <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Select Area to Customize</h4>
          <div className="grid grid-cols-3 gap-2">
            {zones.map(zone => (
              <button
                key={zone.id}
                onClick={() => handleZoneSelect(zone.id)}
                className={`p-3 rounded-xl border-2 transition-all text-xs font-semibold ${
                  selectedZone === zone.id
                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                {zone.label}
              </button>
            ))}
          </div>
        </div>

        {selectedZone && (
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">
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
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 space-y-6 max-h-[800px] overflow-y-auto">
        <div className="flex items-center gap-3 pb-5 border-b">
          <Settings className="text-purple-500" size={24} />
          <h3 className="text-xl font-bold">Design Tools</h3>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl text-xs">
          {['styles', 'embroidery', 'prints'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-3 py-2.5 rounded-xl font-bold transition-all capitalize ${
                activeTab === tab ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Styles Tab */}
        {activeTab === 'styles' && (
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-3">Neckline</h4>
              <div className="grid grid-cols-2 gap-2">
                {['round', 'vNeck', 'boat', 'square', 'collar'].map(style => (
                  <button
                    key={style}
                    onClick={() => setNeckStyle(style)}
                    className={`p-3 rounded-xl border-2 transition-all text-xs font-semibold capitalize ${
                      neckStyle === style ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                    }`}
                  >
                    {style.replace('vNeck', 'V-Neck')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-3">Sleeves</h4>
              <div className="grid grid-cols-2 gap-2">
                {['full', 'half', 'cap', 'sleeveless'].map(style => (
                  <button
                    key={style}
                    onClick={() => setSleeveStyle(style)}
                    className={`p-3 rounded-xl border-2 transition-all text-xs font-semibold capitalize ${
                      sleeveStyle === style ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                    }`}
                  >
                    {style}
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
                <h4 className="font-bold text-sm uppercase tracking-wider">Embroidery Patterns</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(EMBROIDERY_PATTERNS).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => applyEmbroidery(key)}
                      className="p-4 rounded-xl border-2 border-gray-200 hover:border-purple-500 transition-all"
                    >
                      <div className="text-xs font-semibold text-gray-700">{config.name}</div>
                    </button>
                  ))}
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

        {/* Prints Tab */}
        {activeTab === 'prints' && (
          <div className="space-y-4">
            {selectedZone ? (
              <>
                <h4 className="font-bold text-sm uppercase tracking-wider">Fabric Prints</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(FABRIC_PRINTS).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => applyFabricPrint(key)}
                      className="p-4 rounded-xl border-2 border-gray-200 hover:border-purple-500 transition-all"
                    >
                      <div className="text-xs font-semibold text-gray-700">{config.name}</div>
                    </button>
                  ))}
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
      </div>
    </div>
  );
};

export default DesignCanvas;