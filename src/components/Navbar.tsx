import React from 'react';
import { sounds } from '../services/soundEffects';

interface NavbarProps {
  activeTab: 'modules' | 'practice' | 'leaderboard' | 'progress' | 'scratchpad';
  setActiveTab: (tab: 'modules' | 'practice' | 'leaderboard' | 'progress' | 'scratchpad') => void;
  studentName: string;
  avatarId: string;
  level: number;
  levelTitle: string;
  totalXp: number;
  stars: number;
  streak: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenScratchpad: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  avatarId,
  level,
  levelTitle,
  totalXp,
  stars,
  streak,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3">
          {/* Logo / Title */}
          <div
            onClick={() => {
              sounds.playPop();
              setActiveTab('modules');
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white text-xl font-black shadow-md group-hover:scale-105 transition-transform">
              HMH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base md:text-lg text-slate-900 tracking-tight lowercase">
                  hmh into math grade 6
                </span>
                <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md border border-amber-300">
                  Interactive Game
                </span>
              </div>
              <div className="text-[11px] font-bold text-slate-500 hidden md:block">
                Modules 1, 2 & 3 • Student Quest & Leaderboard
              </div>
            </div>
          </div>

          {/* Quick HUD Counters */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Level Badge */}
            <div
              onClick={() => {
                sounds.playPop();
                setActiveTab('progress');
              }}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-xl border border-slate-200 cursor-pointer transition text-xs font-bold text-slate-700"
              title={`Level ${level}: ${levelTitle}`}
            >
              <span>{avatarId}</span>
              <span className="hidden sm:inline text-amber-600 font-extrabold">Lvl {level}</span>
              <span className="font-mono text-slate-600 hidden md:inline">{totalXp} XP</span>
            </div>

            {/* Stars Counter */}
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-xl text-xs font-black text-amber-800">
              <span className="text-amber-500 text-sm">⭐</span>
              <span className="font-mono">{stars}</span>
            </div>

            {/* Streak Counter */}
            <div
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-black border transition ${
                streak > 0
                  ? 'bg-orange-50 border-orange-300 text-orange-700 animate-pulse'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <span>🔥</span>
              <span className="font-mono">{streak}x</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                sounds.playPop();
                onToggleSound();
              }}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center text-sm transition cursor-pointer ${
                soundEnabled
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  : 'bg-rose-50 text-rose-500 border-rose-200'
              }`}
              title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex items-center gap-1 mt-2.5 overflow-x-auto scrollbar-none pb-0.5">
          {[
            { id: 'modules', label: 'Modules Journey', icon: '🗺️' },
            { id: 'practice', label: 'Practice Arena', icon: '⚡' },
            { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
            { id: 'progress', label: 'Progress & Badges', icon: '📊' },
            { id: 'scratchpad', label: 'Math Scratchpad', icon: '✏️' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playPop();
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
