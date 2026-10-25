import React, { useRef, useState, useEffect } from 'react';
import { sounds } from '../services/soundEffects';

interface ScratchpadProps {
  onClose?: () => void;
}

export const Scratchpad: React.FC<ScratchpadProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#2563eb'); // blue by default
  const [lineWidth, setLineWidth] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    // Set canvas dimensions based on display size
    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = 360 * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `360px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      // Light grid background
      drawGrid(ctx, rect.width, 360);
    }
  }, []);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let x = 20; x < width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 20; y < height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      return {
        x: (e as React.MouseEvent).clientX - rect.left,
        y: (e as React.MouseEvent).clientY - rect.top
      };
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = isEraser ? '#ffffff' : color;
    ctx.lineWidth = isEraser ? lineWidth * 4 : lineWidth;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    sounds.playPop();
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    drawGrid(ctx, canvas.width / dpr, canvas.height / dpr);
  };

  return (
    <div className="w-full bg-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-slate-100 p-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            ✏️ Student Math Scratchpad
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            (Work out calculations with stylus or finger)
          </span>
        </div>

        {/* Color Palette & Tools */}
        <div className="flex items-center gap-2">
          {/* Colors */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            {['#0f172a', '#2563eb', '#dc2626', '#16a34a', '#9333ea'].map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c);
                  setIsEraser(false);
                  sounds.playPop();
                }}
                className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                  color === c && !isEraser ? 'scale-125 ring-2 ring-slate-400 ring-offset-1' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>

          {/* Eraser */}
          <button
            onClick={() => {
              setIsEraser(!isEraser);
              sounds.playPop();
            }}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition cursor-pointer ${
              isEraser
                ? 'bg-amber-500 text-white border-amber-600'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            🧹 Eraser
          </button>

          {/* Clear */}
          <button
            onClick={clearCanvas}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 cursor-pointer"
          >
            🗑️ Clear
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 font-bold px-2 py-1 text-sm rounded-lg hover:bg-slate-200 cursor-pointer"
            >
              ✕ Close
            </button>
          )}
        </div>
      </div>

      {/* Canvas Drawing Area */}
      <div className="relative w-full bg-white flex-1 cursor-crosshair touch-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full block"
        />
      </div>
    </div>
  );
};
