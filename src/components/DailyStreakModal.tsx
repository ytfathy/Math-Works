import React, { useState } from 'react';
import { COMPANIONS } from '../data/characters';
import { sounds } from '../services/soundEffects';
import { triggerStreakCelebration } from '../utils/celebrationEffects';
import {
  STREAK_MILESTONES,
  calculateDailyBonus,
  isDailyBonusClaimedToday,
  DailyBonusCalculation,
} from '../utils/streakBonus';

interface DailyStreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
  lastDailyBonusDate?: string;
  companionId: string;
  studentName: string;
  onClaim: (bonus: DailyBonusCalculation) => void;
}

export const DailyStreakModal: React.FC<DailyStreakModalProps> = ({
  isOpen,
  onClose,
  streak,
  lastDailyBonusDate,
  companionId,
  studentName,
  onClaim,
}) => {
  const [claimed, setClaimed] = useState(false);
  const alreadyClaimed = isDailyBonusClaimedToday(lastDailyBonusDate);

  if (!isOpen) return null;

  const bonusInfo = calculateDailyBonus(streak, lastDailyBonusDate);
  const companion = COMPANIONS.find((c) => c.id === companionId) || COMPANIONS[0];

  const handleClaim = () => {
    if (claimed || alreadyClaimed) {
      onClose();
      return;
    }

    setClaimed(true);
    sounds.playStreak();
    triggerStreakCelebration();
    onClaim(bonusInfo);
  };

  // Companion encouragement quote in Arabic
  const getCompanionQuote = () => {
    if (bonusInfo.nextStreak >= 7) {
      return `يا للهول يا ${studentName}! أسبوع كامل من الرياضيات المتواصلة! أنت بطل حقيقي لا يقهر! 🏆`;
    }
    if (bonusInfo.isContinuation) {
      return `مرحباً يا ${studentName}! لليوم الـ ${bonusInfo.nextStreak} على التوالي وأنت هنا تتدرب وتتألق! عضلات مخك تكبر كل يوم! 💪🧠`;
    }
    return `أهلاً بعودتك يا ${studentName}! بداية قوية لعادة يومية ستجعلك أسطورة الرياضيات في الصف السادس! 🌟`;
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="daily-streak-title"
    >
      <div className="relative w-full max-w-lg bg-gradient-to-b from-white via-orange-50/40 to-amber-50/70 rounded-3xl border-2 border-amber-400 shadow-2xl shadow-orange-500/25 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Glow Header Accent */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-40 bg-gradient-to-b from-orange-400/40 via-amber-300/30 to-transparent blur-2xl pointer-events-none rounded-full" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 border border-slate-200 flex items-center justify-center text-sm font-black shadow-xs transition cursor-pointer"
          aria-label="إغلاق"
        >
          ✕
        </button>

        {/* Modal Content Scrollable Area */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-5 text-center">
          {/* Header Visual with Animated Flame & Badge */}
          <div className="flex flex-col items-center">
            {/* Pulsing Flame Ring */}
            <div className="relative mb-2">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-orange-500 via-amber-400 to-red-500 flex items-center justify-center text-4xl sm:text-5xl shadow-lg shadow-orange-500/30 ring-4 ring-orange-200/80 animate-bounce">
                🔥
              </div>
              <div className="absolute -bottom-1 -right-1 bg-slate-900 text-amber-300 border-2 border-amber-400 text-xs sm:text-sm font-black px-2.5 py-0.5 rounded-full shadow-md font-mono">
                {bonusInfo.nextStreak}x
              </div>
            </div>

            {/* Header Titles */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 border border-orange-300 text-orange-800 text-xs font-black mb-2">
              <span>⚡</span>
              <span>مكافأة الحضور اليومي</span>
              <span>•</span>
              <span className="font-mono">{bonusInfo.milestone.title}</span>
            </div>

            <h2
              id="daily-streak-title"
              className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight"
            >
              {alreadyClaimed
                ? `سلسلة الأيام: ${bonusInfo.nextStreak} أيام متتالية!`
                : bonusInfo.isContinuation
                ? `أحسنت! حافظت على سلسلتك 🔥`
                : `مرحباً بك! مكافأتك اليومية جاهزة 🎁`}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-sm mt-1">
              {alreadyClaimed
                ? 'لقد استلمت مكافأة اليوم بالفعل. عد غداً لمواصلة السلسلة ومضاعفة جوائزك!'
                : 'التدريب اليومي المستمر يضاعف تركيزك ويمنحك نقاط خبرة إضافية كل يوم!'}
            </p>
          </div>

          {/* Reward Highlight Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/5 border border-amber-300 shadow-inner flex items-center justify-around gap-2">
            {/* XP Award */}
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-amber-600 font-mono tracking-tight">
                +{bonusInfo.bonusXp}
              </span>
              <span className="text-[11px] sm:text-xs font-black text-amber-800 uppercase tracking-wider">
                نقطة خبرة (XP) ⚡
              </span>
            </div>

            {/* Separator */}
            <div className="h-10 w-px bg-amber-200" />

            {/* Streak Counter */}
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-orange-600 font-mono">
                {bonusInfo.nextStreak}
              </span>
              <span className="text-[11px] sm:text-xs font-black text-orange-800">
                {bonusInfo.nextStreak === 1 ? 'يوم تدريب' : 'أيام متتالية 🔥'}
              </span>
            </div>

            {/* Golden Star (if day 7) */}
            {bonusInfo.bonusStars > 0 && (
              <>
                <div className="h-10 w-px bg-amber-200" />
                <div className="flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl font-black text-amber-500 animate-spin">
                    ⭐
                  </span>
                  <span className="text-[11px] sm:text-xs font-black text-amber-800">
                    +1 نجمة ذهبية!
                  </span>
                </div>
              </>
            )}
          </div>

          {/* 7-Day Streak Ladder Track */}
          <div className="bg-white/80 border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3 text-xs font-black text-slate-700">
              <span className="flex items-center gap-1">
                <span>🗓️</span> مسار مكافآت الأسبوع (7 أيام)
              </span>
              <span className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                اليوم {bonusInfo.dayOfCycle} من 7
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
              {STREAK_MILESTONES.map((m) => {
                const isPast = m.day < bonusInfo.dayOfCycle;
                const isCurrent = m.day === bonusInfo.dayOfCycle;
                const isDay7 = m.day === 7;

                return (
                  <div
                    key={m.day}
                    className={`relative flex flex-col items-center p-1.5 sm:p-2 rounded-xl border text-center transition-all ${
                      isCurrent
                        ? 'bg-gradient-to-b from-amber-100 to-orange-100 border-orange-400 ring-2 ring-orange-400 shadow-md scale-105 z-10'
                        : isPast
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : isDay7
                        ? 'bg-amber-50/60 border-amber-300 text-amber-900 border-dashed'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    {/* Badge top tag */}
                    <span className="text-[9px] sm:text-[10px] font-black mb-1">
                      {isCurrent ? 'اليوم' : `يـ${m.day}`}
                    </span>

                    {/* Icon */}
                    <span className="text-base sm:text-xl mb-1">
                      {isPast ? '✅' : m.icon}
                    </span>

                    {/* Reward */}
                    <span
                      className={`text-[10px] sm:text-[11px] font-black font-mono leading-none ${
                        isCurrent ? 'text-orange-700' : isPast ? 'text-emerald-700' : 'text-slate-500'
                      }`}
                    >
                      +{m.xp}
                    </span>

                    {isDay7 && (
                      <span className="text-[9px] text-amber-600 font-black mt-0.5">
                        ⭐+1
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Companion Dialogue Box */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-indigo-100 shadow-xs text-right">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-2xl flex-shrink-0 shadow-xs">
              {companion.animal === 'Squirrel' ? '🐿️' : companion.animal === 'Cat' ? '🐱' : companion.animal === 'Owl' ? '🦉' : '🤖'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-indigo-900 mb-0.5">
                <span>{companion.name}</span>
                <span className="text-[10px] text-indigo-500 font-bold">({companion.title})</span>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                "{getCompanionQuote()}"
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div>
            {alreadyClaimed || claimed ? (
              <button
                onClick={onClose}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-500/25 transition cursor-pointer flex items-center justify-center gap-2 transform active:scale-95"
              >
                <span>🚀</span>
                <span>رائع! هيا نبدأ تحدي الرياضيات اليوم!</span>
              </button>
            ) : (
              <button
                onClick={handleClaim}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-600 text-white font-black text-base sm:text-lg shadow-xl shadow-orange-500/30 transition cursor-pointer flex items-center justify-center gap-2.5 transform active:scale-95 hover:scale-[1.02] border-t border-amber-200/40 animate-pulse"
              >
                <span>🎁</span>
                <span>استلم مكافأة اليوم (+{bonusInfo.bonusXp} XP)!</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
