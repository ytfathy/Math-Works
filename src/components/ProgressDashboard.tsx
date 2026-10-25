import React, { useState } from 'react';
import { BADGES, STUDENT_LEVELS, getLevelForXp } from '../data/rewards';
import { MODULES_DATA } from '../data/modulesData';
import { COMPANIONS } from '../data/characters';
import { sounds } from '../services/soundEffects';

interface ProgressDashboardProps {
  studentName: string;
  avatarId: string;
  companionId: string;
  totalXp: number;
  stars: number;
  currentStreak: number;
  bestStreak: number;
  completedQuestionIds: string[];
  answeredStats: Record<string, { correct: boolean; attempts: number }>;
  unlockedBadgeIds: string[];
  onUpdateProfile: (name: string, avatar: string, companion: string) => void;
  onResetProgress: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  studentName,
  avatarId,
  companionId,
  totalXp,
  stars,
  currentStreak,
  bestStreak,
  completedQuestionIds,
  answeredStats,
  unlockedBadgeIds,
  onUpdateProfile,
  onResetProgress,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(studentName);
  const [tempAvatar, setTempAvatar] = useState(avatarId);
  const [tempCompanion, setTempCompanion] = useState(companionId);

  const currentLevelInfo = getLevelForXp(totalXp);
  const nextLevelInfo =
    STUDENT_LEVELS.find(l => l.level === currentLevelInfo.level + 1) || currentLevelInfo;
  const xpInCurrentLevel = totalXp - currentLevelInfo.minXp;
  const xpNeededForNext = nextLevelInfo.minXp - currentLevelInfo.minXp || 100;
  const levelProgressPct = Math.min(
    100,
    Math.round((xpInCurrentLevel / Math.max(1, xpNeededForNext)) * 100)
  );

  const availableAvatars = ['🌟', '🚀', '🧙‍♂️', '🦁', '🦊', '⚡', '🦉', '🐱', '🐼', '🦄', '🦖', '🏀'];

  // Calculate statistics
  const totalQuestionsInCurriculum = MODULES_DATA.reduce(
    (sum, m) => sum + m.lessons.reduce((lSum, l) => lSum + l.questions.length, 0),
    0
  );
  const answeredCount = Object.keys(answeredStats).length;
  const correctCount = Object.values(answeredStats).filter(s => s.correct).length;
  const accuracyPct = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 100;

  const handleSaveProfile = () => {
    sounds.playPop();
    onUpdateProfile(tempName, tempAvatar, tempCompanion);
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Student Profile Banner */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-3xl bg-amber-100 border-4 border-amber-300 flex items-center justify-center text-4xl shadow-md">
            {avatarId}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-900">{studentName}</h2>
              <button
                onClick={() => {
                  sounds.playPop();
                  setIsEditing(!isEditing);
                }}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-bold cursor-pointer"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
            <div className="text-sm font-bold text-amber-600 mt-0.5">
              Level {currentLevelInfo.level}: {currentLevelInfo.title}
            </div>

            {/* Level XP Bar */}
            <div className="w-48 sm:w-64 mt-2">
              <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                <span>{totalXp} XP</span>
                <span>{nextLevelInfo.minXp} XP (Lvl {nextLevelInfo.level})</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${levelProgressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center">
            <span className="text-xs font-bold text-amber-800 uppercase block">Stars</span>
            <span className="text-xl font-black text-amber-900 font-mono">⭐ {stars}</span>
          </div>

          <div className="p-3 bg-orange-50 rounded-2xl border border-orange-200 text-center">
            <span className="text-xs font-bold text-orange-800 uppercase block">Best Streak</span>
            <span className="text-xl font-black text-orange-900 font-mono">🔥 {bestStreak}x</span>
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
            <span className="text-xs font-bold text-emerald-800 uppercase block">Accuracy</span>
            <span className="text-xl font-black text-emerald-900 font-mono">{accuracyPct}%</span>
          </div>
        </div>
      </div>

      {/* Profile Edit Panel */}
      {isEditing && (
        <div className="bg-amber-50/70 border-2 border-amber-300 rounded-3xl p-5 animate-fade-in shadow-inner">
          <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wide mb-3">
            Customise Your Student Profile
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Student Name</label>
              <input
                type="text"
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                className="w-full max-w-sm px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Pick Avatar Emoji</label>
              <div className="flex flex-wrap gap-2">
                {availableAvatars.map(av => (
                  <button
                    key={av}
                    onClick={() => {
                      sounds.playPop();
                      setTempAvatar(av);
                    }}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border-2 transition cursor-pointer ${
                      tempAvatar === av
                        ? 'bg-amber-400 border-amber-600 scale-110 shadow-sm'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Math Companion Sidekick</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                {COMPANIONS.map(comp => (
                  <button
                    key={comp.id}
                    onClick={() => {
                      sounds.playPop();
                      setTempCompanion(comp.id);
                    }}
                    className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer ${
                      tempCompanion === comp.id
                        ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                        : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-extrabold text-sm">{comp.name}</div>
                    <div className="text-[11px] opacity-80">{comp.title}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSaveProfile}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm rounded-xl shadow-md cursor-pointer"
              >
                Save Changes ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modules Progress Breakdown */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-black text-lg text-slate-900">
            HMH Into Math Grade 6 Progress
          </h3>
          <span className="text-xs font-bold text-slate-500 font-mono">
            {completedQuestionIds.length} / {totalQuestionsInCurriculum} Questions Mastered
          </span>
        </div>

        <div className="space-y-4">
          {MODULES_DATA.map(module => {
            const moduleQuestionIds = module.lessons.flatMap(l => l.questions.map(q => q.id));
            const completedInModule = moduleQuestionIds.filter(id => completedQuestionIds.includes(id));
            const pct = Math.round((completedInModule.length / moduleQuestionIds.length) * 100);

            return (
              <div
                key={module.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: module.themeColor }}
                    />
                    <span className="font-extrabold text-sm text-slate-800">
                      Module {module.number}: {module.title}
                    </span>
                  </div>

                  <span className="text-xs font-black font-mono text-slate-700">
                    {completedInModule.length}/{moduleQuestionIds.length} ({pct}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: module.themeColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges & Achievements Grid */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-lg text-slate-900">Unlocked Badges & Trophies</h3>
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
              {unlockedBadgeIds.length} / {BADGES.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {BADGES.map(badge => {
            const isUnlocked = unlockedBadgeIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border-2 transition flex items-start gap-3 ${
                  isUnlocked
                    ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                    isUnlocked
                      ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 shadow-sm'
                      : 'bg-slate-200 filter grayscale'
                  }`}
                >
                  {badge.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-xs text-slate-800 truncate">
                    {badge.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-tight">
                    {badge.description}
                  </p>
                  {isUnlocked ? (
                    <span className="inline-block text-[10px] text-amber-700 font-extrabold mt-1">
                      ✓ UNLOCKED
                    </span>
                  ) : (
                    <span className="inline-block text-[10px] text-slate-400 font-bold mt-1">
                      🔒 Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Danger Zone: Reset Progress */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-slate-700">Reset Game Progress</div>
          <div className="text-[11px] text-slate-500">
            Clear all stars, XP, and completed questions to start the adventure fresh.
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset all game progress?')) {
              onResetProgress();
            }
          }}
          className="px-3 py-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 cursor-pointer"
        >
          Reset Progress
        </button>
      </div>
    </div>
  );
};
