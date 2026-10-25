import React, { useState } from 'react';
import { sounds } from '../services/soundEffects';

interface FractionDivisionVisualizerProps {
  initialDividend?: string; // e.g. "9/10"
  initialDivisor?: string;  // e.g. "2/10"
}

export const FractionDivisionVisualizer: React.FC<FractionDivisionVisualizerProps> = ({
  initialDividend = '9/10',
  initialDivisor = '2/10'
}) => {
  const [dividendStr, setDividendStr] = useState(initialDividend);
  const [divisorStr, setDivisorStr] = useState(initialDivisor);

  // Parse fractions or whole numbers
  const parseFrac = (str: string): { num: number; den: number } => {
    const parts = str.trim().split('/');
    if (parts.length === 2) {
      const n = parseInt(parts[0], 10);
      const d = parseInt(parts[1], 10);
      return { num: isNaN(n) ? 1 : n, den: isNaN(d) || d === 0 ? 1 : d };
    }
    const whole = parseInt(str, 10);
    return { num: isNaN(whole) ? 1 : whole, den: 1 };
  };

  const d1 = parseFrac(dividendStr);
  const d2 = parseFrac(divisorStr);

  // Invert and multiply
  const quotientNum = d1.num * d2.den;
  const quotientDen = d1.den * d2.num;
  const quotientDecimal = quotientDen !== 0 ? (quotientNum / quotientDen).toFixed(2) : '0';

  // Find GCF to simplify
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const factor = gcd(Math.abs(quotientNum), Math.abs(quotientDen));
  const simNum = quotientNum / factor;
  const simDen = quotientDen / factor;

  const mixedWhole = Math.floor(simNum / simDen);
  const mixedRem = simNum % simDen;

  return (
    <div className="w-full bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-5 shadow-sm text-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-extrabold text-amber-900 bg-amber-200 px-2.5 py-1 rounded-md">
            Interactive Fraction Lab
          </span>
          <span className="text-xs text-amber-800 font-medium">
            Keep, Change, Flip! (Visual Model)
          </span>
        </div>
      </div>

      {/* Input controls */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-amber-200 shadow-xs mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-600">Dividend:</span>
          <input
            type="text"
            value={dividendStr}
            onChange={(e) => setDividendStr(e.target.value)}
            className="w-20 px-2 py-1 text-center font-bold text-base bg-amber-50 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            placeholder="9/10"
          />
        </div>

        <span className="text-2xl font-black text-amber-600">÷</span>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-600">Divisor:</span>
          <input
            type="text"
            value={divisorStr}
            onChange={(e) => setDivisorStr(e.target.value)}
            className="w-20 px-2 py-1 text-center font-bold text-base bg-amber-50 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            placeholder="2/10"
          />
        </div>

        <button
          onClick={() => {
            sounds.playPop();
            setDividendStr('9/10');
            setDivisorStr('2/10');
          }}
          className="ml-auto text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg cursor-pointer"
        >
          Reset Example
        </button>
      </div>

      {/* Visual Step-by-Step Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center mb-4">
        {/* Step 1: Keep */}
        <div className="bg-white p-3 rounded-xl border-2 border-blue-200">
          <div className="text-xs font-black text-blue-600 uppercase tracking-wide mb-1">
            1. Keep
          </div>
          <div className="text-xl font-extrabold text-blue-800 font-mono">
            {d1.num}/{d1.den}
          </div>
          <div className="text-xs text-slate-500 mt-1">Leave first fraction as-is</div>
        </div>

        {/* Step 2: Change */}
        <div className="bg-white p-3 rounded-xl border-2 border-emerald-200">
          <div className="text-xs font-black text-emerald-600 uppercase tracking-wide mb-1">
            2. Change (÷ to ×)
          </div>
          <div className="text-xl font-extrabold text-emerald-700 font-mono">
            ×
          </div>
          <div className="text-xs text-slate-500 mt-1">Turn division into multiplication</div>
        </div>

        {/* Step 3: Flip */}
        <div className="bg-white p-3 rounded-xl border-2 border-purple-200">
          <div className="text-xs font-black text-purple-600 uppercase tracking-wide mb-1">
            3. Flip (Reciprocal)
          </div>
          <div className="text-xl font-extrabold text-purple-700 font-mono">
            {d2.den}/{d2.num}
          </div>
          <div className="text-xs text-slate-500 mt-1">Invert the divisor</div>
        </div>
      </div>

      {/* Final Calculation Banner */}
      <div className="bg-amber-600 text-white p-3 rounded-xl flex flex-wrap items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-sm uppercase tracking-wider">Solution:</span>
          <span className="font-mono text-lg font-black bg-white/20 px-3 py-0.5 rounded-lg">
            {d1.num}/{d1.den} × {d2.den}/{d2.num} = {quotientNum}/{quotientDen}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm font-bold bg-white text-amber-900 px-3 py-1 rounded-lg">
          <span>Simplified: {simNum}/{simDen}</span>
          {mixedWhole > 0 && mixedRem > 0 && (
            <span className="text-amber-700">({mixedWhole} {mixedRem}/{simDen})</span>
          )}
          <span className="text-xs text-slate-500 font-mono">≈ {quotientDecimal}</span>
        </div>
      </div>
    </div>
  );
};
