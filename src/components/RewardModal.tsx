import React, { useEffect, useState } from 'react';
import { sounds } from '../services/soundEffects';
import { COMPANIONS } from '../data/characters';
import {
  triggerModuleCompleteCelebration,
  triggerLevelUpCelebration,
  triggerStreakCelebration,
  triggerBadgeCelebration,
  triggerQuickBurst,
} from '../utils/celebrationEffects';

interface RewardModalProps {
  isOpen: boolean;
  type: 'streak' | 'level_up' | 'module_complete' | 'badge_unlock';
  title: string;
  subtitle: string;
  xpEarned: number;
  streak: number;
  companionId: string;
  badgeIcon?: string;
  onClose: () => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  isOpen,
  type,
  title,
  subtitle,
  xpEarned,
  streak,
  companionId,
  badgeIcon,
  onClose,
}) => {
  const companion = COMPANIONS.find(c => c.id === companionId) || COMPANIONS[0];
  const [burstCount, setBurstCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setBurstCount(0);
      if (type === 'level_up') {
        sounds.playLevelUp();
        triggerLevelUpCelebration(3500);
      } else if (type === 'module_complete') {
        sounds.playLevelUp();
        triggerModuleCompleteCelebration(3600);
      } else if (type === 'streak') {
        sounds.playStreak();
        triggerStreakCelebration();
      } else if (type === 'badge_unlock') {
        sounds.playLevelUp();
        triggerBadgeCelebration();
      } else {
        sounds.playStreak();
        triggerQuickBurst();
      }
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  const handleExtraConfetti = (e: React.MouseEvent<HTMLButtonElement>) => {
    sounds.playPop();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    setBurstCount(prev => prev + 1);
    if (type === 'level_up') {
      triggerLevelUpCelebration(1800);
    } else if (type === 'module_complete') {
      triggerModuleCompleteCelebration(1800);
    } else {
      triggerQuickBurst(x, y);
    }
  };

  const isMegaCelebration = type === 'level_up' || type === 'module_complete';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      {/* Background ambient celebratory glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div
          className={`w-[450px] h-[450px] rounded-full blur-3xl opacity-25 animate-pulse transition-all ${
            type === 'level_up'
              ? 'bg-amber-400'
              : type === 'module_complete'
              ? 'bg-emerald-400'
              : type === 'streak'
              ? 'bg-orange-500'
              : 'bg-indigo-400'
          }`}
        />
      </div>

      <div
        className={`relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border-4 text-center transform transition-all animate-scale-up ${
          type === 'level_up'
            ? 'border-amber-400 ring-4 ring-amber-300/40 shadow-amber-500/20'
            : type === 'module_complete'
            ? 'border-emerald-400 ring-4 ring-emerald-300/40 shadow-emerald-500/20'
            : type === 'streak'
            ? 'border-orange-400 ring-4 ring-orange-300/40 shadow-orange-500/20'
            : 'border-indigo-400 ring-4 ring-indigo-300/40 shadow-indigo-500/20'
        }`}
      >
        {/* Floating badge icon with shiny rings */}
        <div className="relative mx-auto -mt-16 w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-amber-300/40 blur-md animate-ping" />
          <div
            className={`relative w-20 h-20 rounded-3xl shadow-xl flex items-center justify-center text-4xl border-4 border-white animate-bounce ${
              type === 'level_up'
                ? 'bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 text-white'
                : type === 'module_complete'
                ? 'bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-200 text-white'
                : type === 'streak'
                ? 'bg-gradient-to-tr from-orange-500 via-red-500 to-amber-400 text-white'
                : 'bg-gradient-to-tr from-indigo-500 via-purple-400 to-sky-300 text-white'
            }`}
          >
            {badgeIcon || (type === 'streak' ? '🔥' : type === 'level_up' ? '👑' : type === 'module_complete' ? '🏆' : '⭐')}
          </div>
        </div>

        {/* Celebratory Banner Tag */}
        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-700">
          <span>✨</span>
          <span>
            {type === 'level_up'
              ? 'Level Up Achievement!'
              : type === 'module_complete'
              ? 'Module Mastery Complete!'
              : type === 'streak'
              ? 'Streak Multiplier!'
              : 'Trophy Unlocked!'}
          </span>
          <span>✨</span>
        </div>

        <h3 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
          {title}
        </h3>
        <p className="text-sm font-medium text-slate-600 mt-1">
          {subtitle}
        </p>

        {/* Companion Praise Box */}
        <div className="my-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 flex items-center gap-3 text-left">
          <div className="text-3xl flex-shrink-0 animate-pulse">
            {companion.id === 'nibbles' ? '🐿️' : companion.id === 'fluffington' ? '🐱' : companion.id === 'beepboop' ? '🤖' : '🦉'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-amber-900 flex items-center justify-between">
              <span>{companion.name}:</span>
              <span className="text-[10px] text-amber-700 font-semibold bg-amber-200/60 px-1.5 py-0.5 rounded">Companion</span>
            </div>
            <div className="text-xs text-amber-900 font-bold italic mt-0.5">
              "{type === 'streak'
                ? `That's ${streak} in a row! You're an unstoppable math powerhouse!`
                : type === 'level_up'
                ? "Incredible level up! You're solving Grade 6 problems like a true champion!"
                : type === 'module_complete'
                ? "You fully crushed this module! Confetti fireworks for your genius! 🎆"
                : "You did it! I am jumping of joy right now!"}"
            </div>
          </div>
        </div>

        {/* Rewards grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-sky-50 border border-sky-200 p-2.5 rounded-xl">
            <span className="text-xs text-sky-600 font-bold block uppercase">XP Gained</span>
            <span className="text-xl font-black text-sky-700 font-mono">+{xpEarned} XP</span>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-2.5 rounded-xl">
            <span className="text-xs text-orange-600 font-bold block uppercase">Current Streak</span>
            <span className="text-xl font-black text-orange-700 font-mono">🔥 {streak}x</span>
          </div>
        </div>

        {/* Confetti blast replay button */}
        <div className="mb-3 flex items-center justify-center">
          <button
            type="button"
            onClick={handleExtraConfetti}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer border border-slate-300/80 active:scale-95"
            title="Click for another confetti blast!"
          >
            <span>🎉 احتفل مرة ثانية (More Fireworks)</span>
            {burstCount > 0 && (
              <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full">
                +{burstCount}
              </span>
            )}
          </button>
        </div>

        <button
          onClick={() => {
            sounds.playPop();
            onClose();
          }}
          className={`w-full py-3.5 text-white font-extrabold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 ${
            type === 'module_complete'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/25'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/25'
          }`}
        >
          {isMegaCelebration ? 'استمر في التفوق! Keep Crushing It 🚀' : 'متابعة! Continue 🚀'}
        </button>
      </div>
    </div>
  );
};
