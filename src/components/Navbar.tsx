import React from 'react';
import { sounds } from '../services/soundEffects';
import { UserAccount } from '../types/math';

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
  currentUser: UserAccount | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onOpenAdminControl?: () => void;
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
  currentUser,
  onOpenAuthModal,
  onLogout,
  onOpenAdminControl,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full max-w-full bg-white/95 backdrop-blur-md border-b-2 border-slate-200 shadow-xs overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-3 min-w-0">
          {/* Logo / Title */}
          <div
            onClick={() => {
              sounds.playPop();
              setActiveTab('modules');
            }}
            className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer group flex-shrink min-w-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white text-xs sm:text-base font-black shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
              HMH
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs sm:text-base md:text-lg text-slate-900 tracking-tight truncate lowercase">
                  <span className="sm:hidden">into math g6</span>
                  <span className="hidden sm:inline">hmh into math grade 6</span>
                </span>
                <span className="hidden md:inline-block text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md border border-amber-300 flex-shrink-0">
                  Game
                </span>
              </div>
              <div className="text-[10px] font-bold text-slate-400 hidden lg:block truncate">
                Grade 6 Math Quest & Leaderboard
              </div>
            </div>
          </div>

          {/* Quick HUD Counters + User Account Controls */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Level Badge */}
            <div
              onClick={() => {
                sounds.playPop();
                setActiveTab('progress');
              }}
              className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 cursor-pointer transition text-[11px] sm:text-xs font-bold text-slate-700"
              title={`Level ${level}: ${levelTitle} (${totalXp} XP)`}
            >
              <span>{avatarId}</span>
              <span className="text-amber-600 font-extrabold">L{level}</span>
              <span className="font-mono text-slate-500 hidden md:inline">{totalXp}XP</span>
            </div>

            {/* Stars Counter */}
            <div 
              className="flex items-center gap-0.5 sm:gap-1 bg-amber-50 border border-amber-200 px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-black text-amber-800"
              title={`${stars} Stars collected`}
            >
              <span className="text-amber-500 text-xs sm:text-sm">⭐</span>
              <span className="font-mono">{stars}</span>
            </div>

            {/* Streak Counter - Compact on mobile */}
            {streak > 0 ? (
              <div
                className="flex items-center gap-0.5 sm:gap-1 px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-black border bg-orange-50 border-orange-300 text-orange-700 animate-pulse"
                title={`${streak} in a row streak!`}
              >
                <span>🔥</span>
                <span className="font-mono">{streak}x</span>
              </div>
            ) : null}

            {/* User Account / Login Button */}
            {currentUser ? (
              <div className="flex items-center gap-1">
                {/* Exclusive Admin Control Button (Only visible for admin) */}
                {(currentUser.isAdmin || currentUser.role === 'admin' || currentUser.username.toLowerCase() === 'admin') && onOpenAdminControl && (
                  <button
                    onClick={() => {
                      sounds.playPop();
                      onOpenAdminControl();
                    }}
                    className="flex items-center gap-1 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 hover:from-purple-800 hover:to-indigo-800 text-white px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-black shadow-xs transition cursor-pointer border border-purple-400/30 flex-shrink-0"
                    title="لوحة تحكم الأدمن (Admin Control)"
                  >
                    <span>🛡️</span>
                    <span className="hidden sm:inline">أدمن كنترول</span>
                    <span className="sm:hidden">أدمن</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    sounds.playPop();
                    onOpenAuthModal();
                  }}
                  className="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-black text-indigo-900 transition cursor-pointer max-w-[110px]"
                  title={`الحساب: ${currentUser.username} - انقر لتعديل الحساب أو التبديل`}
                >
                  <span className="text-xs sm:text-sm flex-shrink-0">{currentUser.avatar || '👤'}</span>
                  <span className="truncate hidden sm:inline max-w-[65px]">{currentUser.username}</span>
                  <span className="sm:hidden text-[10px] text-indigo-700 font-bold">حسابي</span>
                </button>
                <button
                  onClick={() => {
                    sounds.playPop();
                    onLogout();
                  }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition cursor-pointer"
                  title="تسجيل الخروج أو تبديل الحساب (Logout)"
                >
                  🚪
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  sounds.playPop();
                  onOpenAuthModal();
                }}
                className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-black shadow-xs transition cursor-pointer"
              >
                <span>🔑</span>
                <span>دخول</span>
              </button>
            )}

            {/* Sound Toggle */}
            <button
              onClick={() => {
                sounds.playPop();
                onToggleSound();
              }}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl border flex items-center justify-center text-xs sm:text-sm transition cursor-pointer flex-shrink-0 ${
                soundEnabled
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  : 'bg-rose-50 text-rose-500 border-rose-200'
              }`}
              title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu - Smooth mobile horizontal swipe */}
        <nav className="flex items-center gap-1.5 mt-2 overflow-x-auto scrollbar-none pb-0.5 -mx-1 px-1 max-w-full">
          {[
            { id: 'modules', label: 'Modules', fullLabel: 'Modules Journey', icon: '🗺️' },
            { id: 'practice', label: 'Practice', fullLabel: 'Practice Arena', icon: '⚡' },
            { id: 'leaderboard', label: 'Leaderboard', fullLabel: 'Leaderboard', icon: '🏆' },
            { id: 'progress', label: 'Badges', fullLabel: 'Progress & Badges', icon: '📊' },
            { id: 'scratchpad', label: 'Scratchpad', fullLabel: 'Math Scratchpad', icon: '✏️' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playPop();
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-slate-50/70 border border-slate-200/60'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.fullLabel}</span>
              <span className="sm:hidden">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
