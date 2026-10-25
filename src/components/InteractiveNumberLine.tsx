import React, { useState } from 'react';
import { sounds } from '../services/soundEffects';

interface InteractiveNumberLineProps {
  min?: number;
  max?: number;
  step?: number;
  initialValue?: number;
  targetValue?: number;
  showOpposite?: boolean;
  showDistanceToZero?: boolean;
  onPointSelect?: (value: number) => void;
  labeledPoints?: { value: number; label: string; color?: string }[];
}

export const InteractiveNumberLine: React.FC<InteractiveNumberLineProps> = ({
  min = -10,
  max = 10,
  step = 1,
  initialValue,
  showOpposite = true,
  showDistanceToZero = true,
  onPointSelect,
  labeledPoints = []
}) => {
  const [selectedPoint, setSelectedPoint] = useState<number | null>(
    initialValue !== undefined ? initialValue : null
  );

  const range = max - min;
  const ticks: number[] = [];
  for (let i = min; i <= max; i += step) {
    ticks.push(Number(i.toFixed(2)));
  }

  const getPercent = (val: number) => {
    return ((val - min) / range) * 100;
  };

  const handleLineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const rawVal = min + ratio * range;
    const snapped = Math.round(rawVal / step) * step;
    const clamped = Math.max(min, Math.min(max, Number(snapped.toFixed(2))));

    setSelectedPoint(clamped);
    sounds.playPop();
    if (onPointSelect) {
      onPointSelect(clamped);
    }
  };

  return (
    <div className="w-full bg-slate-900 text-white p-5 rounded-2xl shadow-md border border-slate-700">
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-bold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-800">
            Interactive Number Line
          </span>
          <span className="text-xs text-slate-400">
            Tap or click anywhere on the line to place a point
          </span>
        </div>

        {selectedPoint !== null && (
          <div className="flex items-center gap-3 text-sm">
            <span className="bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded font-mono font-bold">
              Point: {selectedPoint}
            </span>
            {showOpposite && (
              <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono font-bold">
                Opposite: {-selectedPoint}
              </span>
            )}
            {showDistanceToZero && (
              <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                |{selectedPoint}| = {Math.abs(selectedPoint)} units
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main Track Container */}
      <div
        className="relative h-28 cursor-pointer select-none py-6"
        onClick={handleLineClick}
      >
        {/* Baseline Line with arrows */}
        <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-400 transform -translate-y-1/2 rounded-full">
          {/* Left Arrow */}
          <div className="absolute -left-2 -top-1.5 border-t-4 border-b-4 border-r-8 border-transparent border-r-slate-400" />
          {/* Right Arrow */}
          <div className="absolute -right-2 -top-1.5 border-t-4 border-b-4 border-l-8 border-transparent border-l-slate-400" />
        </div>

        {/* Ticks and Numbers */}
        <div className="absolute inset-x-4 top-0 bottom-0 pointer-events-none">
          {ticks.map(tick => {
            const pct = getPercent(tick);
            const isZero = tick === 0;
            return (
              <div
                key={tick}
                className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{ left: `${pct}%` }}
              >
                {/* Tick bar */}
                <div
                  className={`w-0.5 ${
                    isZero
                      ? 'h-8 bg-amber-400 ring-2 ring-amber-400/30'
                      : tick % 5 === 0
                      ? 'h-5 bg-slate-200'
                      : 'h-3 bg-slate-500'
                  }`}
                />
                {/* Tick label */}
                <span
                  className={`text-xs mt-2 font-mono ${
                    isZero
                      ? 'font-extrabold text-amber-300 text-sm'
                      : tick % 5 === 0
                      ? 'font-bold text-slate-200'
                      : 'text-slate-400 hidden sm:inline-block'
                  }`}
                >
                  {tick}
                </span>
              </div>
            );
          })}

          {/* Preset labeled points (e.g. from textbook problems) */}
          {labeledPoints.map((pt, idx) => {
            const pct = getPercent(pt.value);
            return (
              <div
                key={idx}
                className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{ left: `${pct}%` }}
              >
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow-md transform -translate-y-5"
                  style={{ backgroundColor: pt.color || '#3b82f6' }}
                />
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-white border border-slate-600 transform -translate-y-12">
                  {pt.label} ({pt.value})
                </span>
              </div>
            );
          })}

          {/* User Selected Point Marker */}
          {selectedPoint !== null && (
            <>
              {/* Distance Bracket to zero */}
              {showDistanceToZero && selectedPoint !== 0 && (
                <div
                  className="absolute top-3 h-4 border-t-2 border-emerald-400/80 rounded-t-sm"
                  style={{
                    left: `${Math.min(getPercent(0), getPercent(selectedPoint))}%`,
                    width: `${Math.abs(getPercent(selectedPoint) - getPercent(0))}%`,
                  }}
                >
                  <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-[10px] font-bold text-emerald-300 bg-slate-900 px-1 rounded">
                    {Math.abs(selectedPoint)} units
                  </span>
                </div>
              )}

              {/* Point Marker Pin */}
              <div
                className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-150"
                style={{ left: `${getPercent(selectedPoint)}%` }}
              >
                <div className="w-5 h-5 rounded-full bg-sky-400 border-2 border-white shadow-lg ring-4 ring-sky-400/40 animate-pulse" />
                <div className="text-xs font-black text-sky-200 bg-sky-950 px-2 py-0.5 rounded-full mt-3 border border-sky-400 shadow">
                  {selectedPoint}
                </div>
              </div>

              {/* Opposite Point Marker Pin */}
              {showOpposite && selectedPoint !== 0 && (
                <div
                  className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 opacity-80"
                  style={{ left: `${getPercent(-selectedPoint)}%` }}
                >
                  <div className="w-4 h-4 rounded-full bg-purple-500 border-2 border-white shadow ring-2 ring-purple-400/30" />
                  <div className="text-[10px] font-bold text-purple-200 bg-purple-950 px-1.5 py-0.5 rounded-full mt-3 border border-purple-500">
                    Opposite: {-selectedPoint}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
