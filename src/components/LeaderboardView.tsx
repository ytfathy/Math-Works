import React, { useState } from 'react';
import { LeaderboardEntry } from '../types/math';
import { sounds } from '../services/soundEffects';

interface LeaderboardViewProps {
  entries: LeaderboardEntry[];
  currentStudentName: string;
  currentStudentXp: number;
  currentStudentStars: number;
  currentStudentLevel: number;
  companionId: string;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  entries,
  currentStudentName,
  currentStudentXp,
  currentStudentStars,
  currentStudentLevel,
  companionId,
}) => {
  const [activeFilter, setActiveFilter] = useState<'overall' | 'mod1' | 'mod2' | 'mod3'>('overall');

  // Insert or update current user in leaderboard and sort
  const userEntry: LeaderboardEntry = {
    id: 'current-user',
    rank: 1,
    name: `${currentStudentName} (You)`,
    avatar: '🌟',
    companion: companionId,
    moduleScore: currentStudentXp,
    totalXp: currentStudentXp,
    stars: currentStudentStars,
    level: currentStudentLevel,
    isCurrentUser: true,
  };

  const allEntries = [...entries.filter(e => !e.isCurrentUser), userEntry];

  // Sort based on current XP
  allEntries.sort((a, b) => b.totalXp - a.totalXp);

  // Assign ranks
  const rankedEntries = allEntries.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));

  const userRank = rankedEntries.find(e => e.isCurrentUser)?.rank || 1;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Hero Podium / User Rank Card */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        {/* Background Sparkles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 border border-amber-400/30">
              🏆 Class Math Leaderboard
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              HMH Into Math Grade 6 Champions
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              Compete with students across Grade 6 math modules and level up your mastery!
            </p>
          </div>

          {/* User's Current Rank Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 shadow-lg min-w-[240px]">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-900 flex items-center justify-center text-2xl font-black shadow-md">
              #{userRank}
            </div>
            <div>
              <div className="text-xs text-amber-300 font-bold uppercase">Your Standing</div>
              <div className="text-lg font-black text-white">{currentStudentName}</div>
              <div className="text-xs text-slate-300 font-mono">
                {currentStudentXp} XP • ⭐ {currentStudentStars} Stars
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-white/10">
          <span className="text-xs font-bold text-slate-300 mr-2">Filter by:</span>
          {[
            { id: 'overall', label: 'Overall XP' },
            { id: 'mod1', label: 'Module 1: Integers' },
            { id: 'mod2', label: 'Module 2: Rationals' },
            { id: 'mod3', label: 'Module 3: Fractions' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => {
                sounds.playPop();
                setActiveFilter(f.id as typeof activeFilter);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeFilter === f.id
                  ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rankedEntries.slice(0, 3).map((student, idx) => {
          const medals = ['🥇 1st Place', '🥈 2nd Place', '🥉 3rd Place'];
          const borders = [
            'border-amber-400 bg-amber-50/60',
            'border-slate-300 bg-slate-50/60',
            'border-amber-600 bg-orange-50/60'
          ];
          return (
            <div
              key={student.id}
              className={`p-5 rounded-3xl border-2 ${borders[idx]} shadow-md text-center flex flex-col items-center justify-between relative`}
            >
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 bg-white px-3 py-1 rounded-full shadow-2xs mb-2">
                {medals[idx]}
              </span>

              <div className="text-4xl my-2 p-3 bg-white rounded-2xl shadow-sm border border-slate-200">
                {student.avatar}
              </div>

              <div>
                <h4 className="font-extrabold text-base text-slate-900">
                  {student.name}
                </h4>
                <div className="text-xs font-bold text-slate-500">
                  Level {student.level} Math Whiz
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 w-full flex items-center justify-between text-xs font-mono font-bold text-slate-700">
                <span>⭐ {student.stars} Stars</span>
                <span className="text-amber-700 font-extrabold">{student.totalXp} XP</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Leaderboard Full Table */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-lg overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 font-extrabold text-sm text-slate-700 flex items-center justify-between">
          <span>Full Grade 6 Honor Roll</span>
          <span className="text-xs text-slate-400 font-normal">Updated Live</span>
        </div>

        <div className="divide-y divide-slate-100">
          {rankedEntries.map(entry => (
            <div
              key={entry.id}
              className={`p-4 flex items-center justify-between transition ${
                entry.isCurrentUser
                  ? 'bg-amber-50/90 font-bold border-l-4 border-amber-500'
                  : 'hover:bg-slate-50/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs font-mono ${
                    entry.rank === 1
                      ? 'bg-amber-400 text-slate-900'
                      : entry.rank === 2
                      ? 'bg-slate-300 text-slate-800'
                      : entry.rank === 3
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {entry.rank}
                </span>

                <span className="text-xl">{entry.avatar}</span>

                <div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    {entry.name}
                    {entry.isCurrentUser && (
                      <span className="text-[10px] bg-amber-500 text-white font-black px-1.5 py-0.5 rounded-md uppercase">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    Level {entry.level}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div className="hidden sm:block">
                  <span className="text-xs font-mono text-slate-600 font-semibold">
                    ⭐ {entry.stars}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-black font-mono text-amber-700 bg-amber-100/60 px-2.5 py-1 rounded-lg">
                    {entry.totalXp} XP
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
