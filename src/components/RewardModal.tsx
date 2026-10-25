import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../services/soundEffects';
import { COMPANIONS } from '../data/characters';

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

  useEffect(() => {
    if (isOpen) {
      if (type === 'level_up' || type === 'module_complete') {
        sounds.playLevelUp();
      } else {
        sounds.playStreak();
      }

      // Launch funny confetti burst
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        if (type === 'module_complete') {
          setTimeout(() => {
            confetti({
              particleCount: 150,
              spread: 100,
              origin: { y: 0.4 }
            });
          }, 300);
        }
      } catch {
        // ignore
      }
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border-4 border-amber-400 text-center transform transition-all animate-scale-up">
        {/* Floating badge icon */}
        <div className="w-20 h-20 mx-auto -mt-16 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-3xl shadow-xl flex items-center justify-center text-4xl border-4 border-white animate-bounce">
          {badgeIcon || (type === 'streak' ? '🔥' : type === 'level_up' ? '👑' : '🏆')}
        </div>

        <h3 className="text-2xl font-black text-slate-800 mt-4 tracking-tight">
          {title}
        </h3>
        <p className="text-sm font-medium text-slate-600 mt-1">
          {subtitle}
        </p>

        {/* Companion Praise Box */}
        <div className="my-4 p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-3 text-left">
          <div className="text-2xl flex-shrink-0">
            {companion.id === 'nibbles' ? '🐿️' : companion.id === 'fluffington' ? '🐱' : companion.id === 'beepboop' ? '🤖' : '🦉'}
          </div>
          <div>
            <div className="text-xs font-bold text-amber-900">{companion.name}:</div>
            <div className="text-xs text-amber-800 font-semibold italic">
              "{type === 'streak' ? `That's ${streak} in a row! You're unstoppable!` : "You did it! I'm doing a backflip right now!"}"
            </div>
          </div>
        </div>

        {/* Rewards grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-sky-50 border border-sky-200 p-2.5 rounded-xl">
            <span className="text-xs text-sky-600 font-bold block uppercase">XP Gained</span>
            <span className="text-xl font-black text-sky-700 font-mono">+{xpEarned} XP</span>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-2.5 rounded-xl">
            <span className="text-xs text-orange-600 font-bold block uppercase">Current Streak</span>
            <span className="text-xl font-black text-orange-700 font-mono">🔥 {streak}x</span>
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playPop();
            onClose();
          }}
          className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5"
        >
          Keep Crushing It! 🚀
        </button>
      </div>
    </div>
  );
};
