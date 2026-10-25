import React, { useState, useEffect } from 'react';
import { COMPANIONS } from '../data/characters';
import { sounds } from '../services/soundEffects';

interface CharacterCompanionProps {
  companionId: string;
  reactionState: 'idle' | 'correct' | 'incorrect' | 'celebrating';
  customMessage?: string;
  onCompanionChange?: (newId: string) => void;
}

export const CharacterCompanion: React.FC<CharacterCompanionProps> = ({
  companionId,
  reactionState,
  customMessage,
  onCompanionChange,
}) => {
  const companion = COMPANIONS.find(c => c.id === companionId) || COMPANIONS[0];
  const [currentLine, setCurrentLine] = useState('');
  const [isWiggling, setIsWiggling] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (customMessage) {
      setCurrentLine(customMessage);
      return;
    }
    if (reactionState === 'correct') {
      const line = companion.correctLines[Math.floor(Math.random() * companion.correctLines.length)];
      setCurrentLine(line);
      setIsWiggling(true);
      setTimeout(() => setIsWiggling(false), 800);
    } else if (reactionState === 'incorrect') {
      const line = companion.incorrectLines[Math.floor(Math.random() * companion.incorrectLines.length)];
      setCurrentLine(line);
      setIsWiggling(true);
      setTimeout(() => setIsWiggling(false), 600);
    } else if (reactionState === 'celebrating') {
      const line = companion.celebrationLines[Math.floor(Math.random() * companion.celebrationLines.length)];
      setCurrentLine(line);
      setIsWiggling(true);
    } else {
      const line = companion.idleLines[Math.floor(Math.random() * companion.idleLines.length)];
      setCurrentLine(line);
    }
  }, [reactionState, customMessage, companion]);

  const pokeCompanion = () => {
    sounds.playPop();
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 500);
    const mathJokes = [
      "Why did the triangle feel sad? Because it was never right!",
      "Parallel lines have so much in common... it's a shame they'll never meet!",
      "Why was the fraction nervous? It was in a divided household!",
      "What did zero say to eight? Nice belt!",
      "Why do plants hate math? Because it gives them square roots!",
      "Did you know? |-100| is just 100 on a happy day!"
    ];
    const joke = mathJokes[Math.floor(Math.random() * mathJokes.length)];
    setCurrentLine(joke);
  };

  // Render SVG avatar
  const renderAvatar = () => {
    switch (companion.id) {
      case 'nibbles':
        return (
          <svg className="w-20 h-20 md:w-24 md:h-24 filter drop-shadow-md" viewBox="0 0 100 100">
            {/* Bushy tail */}
            <path d="M 20 70 C 5 50 10 15 40 10 C 35 30 40 45 35 60 Z" fill="#d97706" />
            <path d="M 22 65 C 12 48 18 22 36 18" stroke="#fbbf24" strokeWidth="3" fill="none" />
            {/* Body */}
            <ellipse cx="55" cy="65" rx="22" ry="24" fill="#f97316" />
            <ellipse cx="55" cy="68" rx="14" ry="16" fill="#fef08a" />
            {/* Head */}
            <circle cx="58" cy="38" r="18" fill="#f97316" />
            {/* Ears */}
            <path d="M 50 24 L 46 12 L 56 18 Z" fill="#ea580c" />
            <path d="M 66 24 L 72 12 L 62 18 Z" fill="#ea580c" />
            {/* Glasses */}
            <circle cx="52" cy="36" r="6" fill="#60a5fa" fillOpacity="0.4" stroke="#1e293b" strokeWidth="2" />
            <circle cx="64" cy="36" r="6" fill="#60a5fa" fillOpacity="0.4" stroke="#1e293b" strokeWidth="2" />
            <line x1="58" y1="36" x2="58" y2="36" stroke="#1e293b" strokeWidth="2" />
            {/* Eyes */}
            <circle cx="52" cy="36" r="2.5" fill="#0f172a" />
            <circle cx="64" cy="36" r="2.5" fill="#0f172a" />
            <circle cx="53" cy="35" r="1" fill="#ffffff" />
            <circle cx="65" cy="35" r="1" fill="#ffffff" />
            {/* Snout & Whiskers */}
            <ellipse cx="58" cy="43" rx="4" ry="3" fill="#fef08a" />
            <polygon points="56,42 60,42 58,45" fill="#78350f" />
            <line x1="48" y1="44" x2="40" y2="43" stroke="#451a03" strokeWidth="1.5" />
            <line x1="68" y1="44" x2="76" y2="43" stroke="#451a03" strokeWidth="1.5" />
            {/* Acorn in paws */}
            <ellipse cx="62" cy="68" rx="8" ry="10" fill="#92400e" />
            <path d="M 54 62 Q 62 58 70 62 Z" fill="#78350f" />
            <rect x="61" y="56" width="2" height="4" fill="#451a03" />
          </svg>
        );
      case 'fluffington':
        return (
          <svg className="w-20 h-20 md:w-24 md:h-24 filter drop-shadow-md" viewBox="0 0 100 100">
            {/* Body */}
            <ellipse cx="50" cy="68" rx="25" ry="22" fill="#8b5cf6" />
            <ellipse cx="50" cy="70" rx="16" ry="15" fill="#ede9fe" />
            {/* Head */}
            <circle cx="50" cy="38" r="20" fill="#8b5cf6" />
            {/* Ears */}
            <polygon points="34,26 30,8 44,20" fill="#7c3aed" />
            <polygon points="34,23 33,12 41,20" fill="#f472b6" />
            <polygon points="66,26 70,8 56,20" fill="#7c3aed" />
            <polygon points="66,23 67,12 59,20" fill="#f472b6" />
            {/* Top Hat */}
            <rect x="38" y="4" width="24" height="15" rx="2" fill="#1e1b4b" />
            <rect x="32" y="18" width="36" height="4" rx="1" fill="#1e1b4b" />
            <rect x="38" y="15" width="24" height="3" fill="#f59e0b" />
            {/* Monocle */}
            <circle cx="43" cy="38" r="6" stroke="#fbbf24" strokeWidth="2.5" fill="#bae6fd" fillOpacity="0.4" />
            <line x1="43" y1="44" x2="40" y2="58" stroke="#fbbf24" strokeWidth="1.5" />
            {/* Eyes */}
            <circle cx="43" cy="38" r="2.5" fill="#1e1b4b" />
            <circle cx="57" cy="38" r="3" fill="#1e1b4b" />
            <circle cx="58" cy="37" r="1" fill="#ffffff" />
            {/* Nose & Bow tie */}
            <polygon points="48,43 52,43 50,46" fill="#f472b6" />
            <path d="M 46 47 Q 50 51 54 47" stroke="#4c1d95" strokeWidth="1.5" fill="none" />
            <polygon points="44,56 50,58 44,60" fill="#ef4444" />
            <polygon points="56,56 50,58 56,60" fill="#ef4444" />
            <circle cx="50" cy="58" r="2" fill="#b91c1c" />
          </svg>
        );
      case 'beepboop':
        return (
          <svg className="w-20 h-20 md:w-24 md:h-24 filter drop-shadow-md" viewBox="0 0 100 100">
            {/* Antenna */}
            <line x1="50" y1="20" x2="50" y2="8" stroke="#64748b" strokeWidth="3" />
            <circle cx="50" cy="6" r="5" fill="#ef4444" />
            <circle cx="50" cy="6" r="2" fill="#fecaca" />
            {/* Head */}
            <rect x="28" y="20" width="44" height="36" rx="6" fill="#06b6d4" stroke="#0891b2" strokeWidth="2" />
            {/* Screen eyes */}
            <rect x="34" y="28" width="32" height="18" rx="4" fill="#0f172a" />
            <circle cx="42" cy="37" r="4" fill="#22c55e" />
            <circle cx="58" cy="37" r="4" fill="#22c55e" />
            <circle cx="43" cy="36" r="1.5" fill="#dcfce7" />
            <circle cx="59" cy="36" r="1.5" fill="#dcfce7" />
            {/* Mouth */}
            <rect x="42" y="48" width="16" height="3" rx="1.5" fill="#38bdf8" />
            {/* Body */}
            <rect x="32" y="58" width="36" height="32" rx="4" fill="#0891b2" />
            {/* Chest Meter */}
            <rect x="38" y="64" width="24" height="12" rx="2" fill="#1e293b" />
            <line x1="42" y1="70" x2="58" y2="70" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="50" cy="70" r="3" fill="#ef4444" />
            {/* Arms */}
            <rect x="18" y="62" width="12" height="6" rx="3" fill="#06b6d4" />
            <rect x="70" y="62" width="12" height="6" rx="3" fill="#06b6d4" />
          </svg>
        );
      case 'barnaby':
      default:
        return (
          <svg className="w-20 h-20 md:w-24 md:h-24 filter drop-shadow-md" viewBox="0 0 100 100">
            {/* Body */}
            <ellipse cx="50" cy="62" rx="24" ry="28" fill="#10b981" />
            <ellipse cx="50" cy="65" rx="16" ry="20" fill="#d1fae5" />
            {/* Wings */}
            <path d="M 26 50 C 18 60 20 75 30 80 Z" fill="#059669" />
            <path d="M 74 50 C 82 60 80 75 70 80 Z" fill="#059669" />
            {/* Graduation Cap */}
            <polygon points="50,6 74,16 50,26 26,16" fill="#1e293b" />
            <rect x="44" y="24" width="12" height="6" fill="#334155" />
            <line x1="70" y1="18" x2="74" y2="30" stroke="#fbbf24" strokeWidth="2" />
            <circle cx="74" cy="30" r="2.5" fill="#f59e0b" />
            {/* Eyes */}
            <circle cx="40" cy="38" r="10" fill="#ffffff" stroke="#047857" strokeWidth="2" />
            <circle cx="60" cy="38" r="10" fill="#ffffff" stroke="#047857" strokeWidth="2" />
            <circle cx="40" cy="38" r="4.5" fill="#0f172a" />
            <circle cx="60" cy="38" r="4.5" fill="#0f172a" />
            <circle cx="42" cy="36" r="1.5" fill="#ffffff" />
            <circle cx="62" cy="36" r="1.5" fill="#ffffff" />
            {/* Beak */}
            <polygon points="46,45 54,45 50,54" fill="#f59e0b" />
            {/* Feet */}
            <rect x="42" y="88" width="4" height="6" rx="2" fill="#d97706" />
            <rect x="54" y="88" width="4" height="6" rx="2" fill="#d97706" />
          </svg>
        );
    }
  };

  return (
    <div className="relative flex flex-col md:flex-row items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl shadow-sm">
      {/* Companion Avatar Button */}
      <div className="relative group cursor-pointer flex-shrink-0" onClick={pokeCompanion}>
        <div
          className={`transition-transform duration-300 ${
            isWiggling ? 'animate-bounce scale-110' : 'hover:scale-105'
          }`}
        >
          {renderAvatar()}
        </div>
        <span className="absolute -bottom-1 -right-1 text-xs bg-amber-600 text-white font-bold px-1.5 py-0.5 rounded-full shadow-sm">
          Poke!
        </span>
      </div>

      {/* Speech Bubble */}
      <div className="flex-1 w-full bg-white p-3.5 rounded-2xl shadow-xs border border-amber-200 relative">
        <div className="flex items-center justify-between border-b border-amber-100 pb-1.5 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-slate-800">{companion.name}</span>
            <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-md">
              {companion.title}
            </span>
          </div>

          {/* Change companion trigger */}
          {onCompanionChange && (
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="text-xs text-amber-700 hover:text-amber-900 font-medium underline flex items-center gap-1 cursor-pointer"
            >
              Switch Sidekick
            </button>
          )}
        </div>

        <p className="text-sm text-slate-700 font-medium leading-relaxed">
          {currentLine}
        </p>

        {/* Companion Picker dropdown */}
        {showPicker && onCompanionChange && (
          <div className="mt-2 pt-2 border-t border-amber-200 grid grid-cols-2 md:grid-cols-4 gap-2">
            {COMPANIONS.map(comp => (
              <button
                key={comp.id}
                onClick={() => {
                  onCompanionChange(comp.id);
                  setShowPicker(false);
                  sounds.playPop();
                }}
                className={`p-1.5 text-xs rounded-xl font-bold border flex items-center gap-2 transition cursor-pointer ${
                  comp.id === companion.id
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-amber-50 hover:bg-amber-100 text-slate-700 border-amber-200'
                }`}
              >
                <span>{comp.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
