import React, { useState, useEffect } from 'react';
import { MODULES_DATA, INITIAL_LEADERBOARD_DATA } from './data/modulesData';
import { BADGES, STUDENT_LEVELS, getLevelForXp } from './data/rewards';
import { COMPANIONS } from './data/characters';
import { sounds } from './services/soundEffects';
import { Question } from './types/math';

import { Navbar } from './components/Navbar';
import { CharacterCompanion } from './components/CharacterCompanion';
import { QuestionCard } from './components/QuestionCard';
import { LeaderboardView } from './components/LeaderboardView';
import { ProgressDashboard } from './components/ProgressDashboard';
import { Scratchpad } from './components/Scratchpad';
import { RewardModal } from './components/RewardModal';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'modules' | 'practice' | 'leaderboard' | 'progress' | 'scratchpad'>('modules');

  // Student Persistence State
  const [studentName, setStudentName] = useState<string>(() => {
    return localStorage.getItem('hmh_student_name') || 'Jordan';
  });
  const [avatarId, setAvatarId] = useState<string>(() => {
    return localStorage.getItem('hmh_student_avatar') || '🌟';
  });
  const [companionId, setCompanionId] = useState<string>(() => {
    return localStorage.getItem('hmh_companion_id') || 'nibbles';
  });
  const [totalXp, setTotalXp] = useState<number>(() => {
    const val = localStorage.getItem('hmh_total_xp');
    return val ? parseInt(val, 10) : 100;
  });
  const [stars, setStars] = useState<number>(() => {
    const val = localStorage.getItem('hmh_stars');
    return val ? parseInt(val, 10) : 2;
  });
  const [streak, setStreak] = useState<number>(() => {
    const val = localStorage.getItem('hmh_streak');
    return val ? parseInt(val, 10) : 0;
  });
  const [bestStreak, setBestStreak] = useState<number>(() => {
    const val = localStorage.getItem('hmh_best_streak');
    return val ? parseInt(val, 10) : 0;
  });
  const [completedQuestionIds, setCompletedQuestionIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('hmh_completed_questions') || '[]');
    } catch {
      return [];
    }
  });
  const [answeredStats, setAnsweredStats] = useState<Record<string, { correct: boolean; attempts: number }>>(() => {
    try {
      return JSON.parse(localStorage.getItem('hmh_answered_stats') || '{}');
    } catch {
      return {};
    }
  });
  const [unlockedBadgeIds, setUnlockedBadgeIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('hmh_unlocked_badges') || '["first_step"]');
    } catch {
      return ['first_step'];
    }
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('hmh_sound_enabled') !== 'false';
  });

  // Active Quiz State
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState<boolean>(false);

  // Practice Mode Queue
  const [practiceQueue, setPracticeQueue] = useState<Question[]>([]);
  const [practiceIndex, setPracticeIndex] = useState<number>(0);

  // Character Companion Reaction State
  const [companionReaction, setCompanionReaction] = useState<'idle' | 'correct' | 'incorrect' | 'celebrating'>('idle');
  const [customCompanionMsg, setCustomCompanionMsg] = useState<string | undefined>(undefined);

  // Reward Modal State
  const [rewardModal, setRewardModal] = useState<{
    isOpen: boolean;
    type: 'streak' | 'level_up' | 'module_complete' | 'badge_unlock';
    title: string;
    subtitle: string;
    xpEarned: number;
    streak: number;
    badgeIcon?: string;
  }>({
    isOpen: false,
    type: 'streak',
    title: '',
    subtitle: '',
    xpEarned: 0,
    streak: 0,
  });

  // Sync sound setting
  useEffect(() => {
    sounds.enabled = soundEnabled;
    localStorage.setItem('hmh_sound_enabled', String(soundEnabled));
  }, [soundEnabled]);

  // Persist student data
  useEffect(() => {
    localStorage.setItem('hmh_student_name', studentName);
    localStorage.setItem('hmh_student_avatar', avatarId);
    localStorage.setItem('hmh_companion_id', companionId);
    localStorage.setItem('hmh_total_xp', String(totalXp));
    localStorage.setItem('hmh_stars', String(stars));
    localStorage.setItem('hmh_streak', String(streak));
    localStorage.setItem('hmh_best_streak', String(bestStreak));
    localStorage.setItem('hmh_completed_questions', JSON.stringify(completedQuestionIds));
    localStorage.setItem('hmh_answered_stats', JSON.stringify(answeredStats));
    localStorage.setItem('hmh_unlocked_badges', JSON.stringify(unlockedBadgeIds));
  }, [
    studentName,
    avatarId,
    companionId,
    totalXp,
    stars,
    streak,
    bestStreak,
    completedQuestionIds,
    answeredStats,
    unlockedBadgeIds,
  ]);

  // Level calculations
  const levelInfo = getLevelForXp(totalXp);

  // Check badges unlock
  const checkBadgeUnlocks = (newXp: number, newStreak: number, newCompleted: string[]) => {
    const newlyUnlocked: string[] = [];

    BADGES.forEach(badge => {
      if (unlockedBadgeIds.includes(badge.id)) return;

      if (badge.unlockedAtXp && newXp >= badge.unlockedAtXp) {
        newlyUnlocked.push(badge.id);
      }
      if (badge.unlockedAtStreak && newStreak >= badge.unlockedAtStreak) {
        newlyUnlocked.push(badge.id);
      }
      if (badge.unlockedAtQuestions && newCompleted.length >= badge.unlockedAtQuestions) {
        newlyUnlocked.push(badge.id);
      }
      if (badge.id === 'mod1_master') {
        const mod1Questions = MODULES_DATA[0].lessons.flatMap(l => l.questions.map(q => q.id));
        if (mod1Questions.every(id => newCompleted.includes(id))) {
          newlyUnlocked.push(badge.id);
        }
      }
      if (badge.id === 'mod2_master') {
        const mod2Questions = MODULES_DATA[1].lessons.flatMap(l => l.questions.map(q => q.id));
        if (mod2Questions.every(id => newCompleted.includes(id))) {
          newlyUnlocked.push(badge.id);
        }
      }
      if (badge.id === 'mod3_master') {
        const mod3Questions = MODULES_DATA[2].lessons.flatMap(l => l.questions.map(q => q.id));
        if (mod3Questions.every(id => newCompleted.includes(id))) {
          newlyUnlocked.push(badge.id);
        }
      }
    });

    if (newlyUnlocked.length > 0) {
      setUnlockedBadgeIds(prev => [...prev, ...newlyUnlocked]);
      const firstBadge = BADGES.find(b => b.id === newlyUnlocked[0]);
      if (firstBadge) {
        setRewardModal({
          isOpen: true,
          type: 'badge_unlock',
          title: `Trophy Unlocked: ${firstBadge.title}!`,
          subtitle: firstBadge.description,
          xpEarned: 50,
          streak: newStreak,
          badgeIcon: firstBadge.icon,
        });
      }
    }
  };

  // Start a specific lesson
  const startLesson = (moduleId: string, lessonId: string) => {
    sounds.playPop();
    setSelectedModuleId(moduleId);
    setSelectedLessonId(lessonId);
    setCurrentQuestionIndex(0);
    setHasAnsweredCurrent(false);
    setCompanionReaction('idle');
    setCustomCompanionMsg(undefined);
  };

  // Start practice arena with all questions
  const startPracticeArena = () => {
    sounds.playPop();
    const all = MODULES_DATA.flatMap(m => m.lessons.flatMap(l => l.questions));
    const shuffled = [...all].sort(() => Math.random() - 0.5);
    setPracticeQueue(shuffled);
    setPracticeIndex(0);
    setHasAnsweredCurrent(false);
    setActiveTab('practice');
    setCompanionReaction('idle');
  };

  // Handle Question Answer Submission
  const handleAnswerSubmit = (isCorrect: boolean, basePoints: number) => {
    setHasAnsweredCurrent(true);

    const activeQuestion =
      activeTab === 'practice'
        ? practiceQueue[practiceIndex]
        : getCurrentQuestion();

    if (!activeQuestion) return;

    if (isCorrect) {
      const newStreak = streak + 1;
      const newBest = Math.max(bestStreak, newStreak);
      const streakBonus = Math.min(100, (newStreak - 1) * 20);
      const earnedXp = basePoints + streakBonus;
      const newXp = totalXp + earnedXp;
      const newStars = stars + 1;
      const newCompleted = completedQuestionIds.includes(activeQuestion.id)
        ? completedQuestionIds
        : [...completedQuestionIds, activeQuestion.id];

      setStreak(newStreak);
      setBestStreak(newBest);
      setTotalXp(newXp);
      setStars(newStars);
      setCompletedQuestionIds(newCompleted);

      // Check level up
      const oldLvl = levelInfo.level;
      const newLvl = getLevelForXp(newXp).level;
      if (newLvl > oldLvl) {
        setRewardModal({
          isOpen: true,
          type: 'level_up',
          title: `Level Up! Welcome to Level ${newLvl}!`,
          subtitle: `You unlocked the title "${getLevelForXp(newXp).title}"!`,
          xpEarned: earnedXp,
          streak: newStreak,
        });
      } else if (newStreak >= 3 && newStreak % 3 === 0) {
        // Streak milestone
        setRewardModal({
          isOpen: true,
          type: 'streak',
          title: `🔥 Awesome ${newStreak}x Answer Streak!`,
          subtitle: `Bonus XP granted for blazing fast accuracy!`,
          xpEarned: earnedXp,
          streak: newStreak,
        });
      }

      setCompanionReaction('correct');
      setAnsweredStats(prev => ({
        ...prev,
        [activeQuestion.id]: { correct: true, attempts: (prev[activeQuestion.id]?.attempts || 0) + 1 },
      }));

      checkBadgeUnlocks(newXp, newStreak, newCompleted);
    } else {
      setStreak(0);
      setCompanionReaction('incorrect');
      setAnsweredStats(prev => ({
        ...prev,
        [activeQuestion.id]: { correct: false, attempts: (prev[activeQuestion.id]?.attempts || 0) + 1 },
      }));
    }
  };

  // Get current question for module view
  const getCurrentQuestion = (): Question | null => {
    if (!selectedModuleId || !selectedLessonId) return null;
    const mod = MODULES_DATA.find(m => m.id === selectedModuleId);
    if (!mod) return null;
    const lesson = mod.lessons.find(l => l.id === selectedLessonId);
    if (!lesson) return null;
    return lesson.questions[currentQuestionIndex] || null;
  };

  // Get total questions in active lesson
  const getActiveLessonQuestions = (): Question[] => {
    if (!selectedModuleId || !selectedLessonId) return [];
    const mod = MODULES_DATA.find(m => m.id === selectedModuleId);
    if (!mod) return [];
    const lesson = mod.lessons.find(l => l.id === selectedLessonId);
    return lesson ? lesson.questions : [];
  };

  // Handle Next Question in Quiz
  const handleNextQuestion = () => {
    sounds.playPop();
    setHasAnsweredCurrent(false);
    setCompanionReaction('idle');

    if (activeTab === 'practice') {
      if (practiceIndex < practiceQueue.length - 1) {
        setPracticeIndex(practiceIndex + 1);
      } else {
        // Practice finished
        setRewardModal({
          isOpen: true,
          type: 'module_complete',
          title: 'Speed Arena Champion! ⚡',
          subtitle: 'You completed a full round of Grade 6 practice challenges!',
          xpEarned: 250,
          streak,
        });
        setActiveTab('modules');
      }
      return;
    }

    const lessonQuestions = getActiveLessonQuestions();
    if (currentQuestionIndex < lessonQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Completed lesson!
      sounds.playLevelUp();
      setCompanionReaction('celebrating');
      setRewardModal({
        isOpen: true,
        type: 'module_complete',
        title: 'Lesson Challenge Complete! 🎉',
        subtitle: 'Outstanding work solving all textbook problems in this section!',
        xpEarned: 200,
        streak,
      });
      setSelectedLessonId(null);
    }
  };

  const handleResetProgress = () => {
    sounds.playPop();
    setTotalXp(0);
    setStars(0);
    setStreak(0);
    setBestStreak(0);
    setCompletedQuestionIds([]);
    setAnsweredStats({});
    setUnlockedBadgeIds(['first_step']);
    localStorage.clear();
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'modules') {
            setSelectedLessonId(null);
          }
        }}
        studentName={studentName}
        avatarId={avatarId}
        level={levelInfo.level}
        levelTitle={levelInfo.title}
        totalXp={totalXp}
        stars={stars}
        streak={streak}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenScratchpad={() => setActiveTab('scratchpad')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* Companion Chat & Feedback Row (Always accessible across game) */}
        <CharacterCompanion
          companionId={companionId}
          reactionState={companionReaction}
          customMessage={customCompanionMsg}
          onCompanionChange={(newId) => setCompanionId(newId)}
        />

        {/* VIEW 1: MODULES JOURNEY */}
        {activeTab === 'modules' && (
          <div className="space-y-6">
            {!selectedLessonId ? (
              <>
                {/* Module Selection Map */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-md">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                      HMH Curriculum Adventure
                    </span>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">
                      Choose Your Math Quest
                    </h1>
                    <p className="text-slate-600 text-sm mt-1">
                      Step into Modules 1, 2, and 3. Answer real textbook challenges, collect stars, and climb the leaderboard!
                    </p>
                  </div>

                  <button
                    onClick={startPracticeArena}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer flex items-center gap-2 whitespace-nowrap"
                  >
                    <span>⚡ Quick Practice Arena</span>
                  </button>
                </div>

                {/* Modules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {MODULES_DATA.map((module) => {
                    const allModQIds = module.lessons.flatMap(l => l.questions.map(q => q.id));
                    const completedInMod = allModQIds.filter(id => completedQuestionIds.includes(id));
                    const pct = Math.round((completedInMod.length / allModQIds.length) * 100);

                    return (
                      <div
                        key={module.id}
                        className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-md flex flex-col justify-between hover:border-slate-300 hover:shadow-lg transition relative overflow-hidden"
                      >
                        {/* Module Top Accent bar */}
                        <div
                          className="absolute top-0 left-0 right-0 h-2.5"
                          style={{ backgroundColor: module.themeColor }}
                        />

                        <div>
                          <div className="flex items-center justify-between mb-3 pt-1">
                            <span
                              className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-lg text-white"
                              style={{ backgroundColor: module.themeColor }}
                            >
                              Module {module.number}
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-500">
                              {completedInMod.length}/{allModQIds.length} Mastered
                            </span>
                          </div>

                          <h3 className="text-xl font-black text-slate-900 mb-2">
                            {module.title}
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed mb-4">
                            {module.description}
                          </p>

                          {/* Progress Meter */}
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-5">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%`, backgroundColor: module.themeColor }}
                            />
                          </div>

                          {/* Lessons in Module */}
                          <div className="space-y-2 mb-4">
                            {module.lessons.map(lesson => {
                              const lessonDone = lesson.questions.every(q => completedQuestionIds.includes(q.id));
                              return (
                                <button
                                  key={lesson.id}
                                  onClick={() => startLesson(module.id, lesson.id)}
                                  className={`w-full p-3 rounded-2xl text-left border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                                    lessonDone
                                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 hover:bg-emerald-100'
                                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-blue-50 hover:border-blue-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span>{lessonDone ? '✅' : '🎯'}</span>
                                    <span className="truncate max-w-[200px]">{lesson.title}</span>
                                  </div>
                                  <span className="text-[11px] font-mono text-slate-500">
                                    {lesson.questions.length} Qs
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <button
                          onClick={() => startLesson(module.id, module.lessons[0].id)}
                          className="w-full py-3 rounded-2xl text-white font-extrabold text-sm shadow-md transition cursor-pointer hover:opacity-95"
                          style={{ backgroundColor: module.themeColor }}
                        >
                          Play Module {module.number} ➔
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* Active Lesson Question View */
              <div className="max-w-3xl mx-auto space-y-4">
                {/* Back to Module selection */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      sounds.playPop();
                      setSelectedLessonId(null);
                    }}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>⬅ Back to Modules</span>
                  </button>

                  <div className="text-xs font-mono font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                    Question {currentQuestionIndex + 1} of {getActiveLessonQuestions().length}
                  </div>
                </div>

                {getCurrentQuestion() && (
                  <QuestionCard
                    question={getCurrentQuestion()!}
                    onAnswerSubmit={handleAnswerSubmit}
                    onNextQuestion={handleNextQuestion}
                    hasAnswered={hasAnsweredCurrent}
                    isLastQuestion={currentQuestionIndex === getActiveLessonQuestions().length - 1}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: PRACTICE ARENA */}
        {activeTab === 'practice' && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚡</span>
                <div>
                  <h3 className="font-black text-base text-slate-900">Speed Practice Arena</h3>
                  <div className="text-xs text-slate-500">
                    Randomized challenges across all 3 modules
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-xl">
                  {practiceIndex + 1} / {practiceQueue.length || 1}
                </span>
                <button
                  onClick={startPracticeArena}
                  className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-xl cursor-pointer"
                >
                  Shuffle 🔀
                </button>
              </div>
            </div>

            {practiceQueue.length > 0 && practiceQueue[practiceIndex] ? (
              <QuestionCard
                question={practiceQueue[practiceIndex]}
                onAnswerSubmit={handleAnswerSubmit}
                onNextQuestion={handleNextQuestion}
                hasAnswered={hasAnsweredCurrent}
                isLastQuestion={practiceIndex === practiceQueue.length - 1}
              />
            ) : (
              <div className="text-center p-12 bg-white rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-slate-600 mb-4 font-medium">Ready to test your math speed?</p>
                <button
                  onClick={startPracticeArena}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-2xl shadow cursor-pointer"
                >
                  Start Practice Round ⚡
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <LeaderboardView
            entries={INITIAL_LEADERBOARD_DATA}
            currentStudentName={studentName}
            currentStudentXp={totalXp}
            currentStudentStars={stars}
            currentStudentLevel={levelInfo.level}
            companionId={companionId}
          />
        )}

        {/* VIEW 4: PROGRESS & BADGES */}
        {activeTab === 'progress' && (
          <ProgressDashboard
            studentName={studentName}
            avatarId={avatarId}
            companionId={companionId}
            totalXp={totalXp}
            stars={stars}
            currentStreak={streak}
            bestStreak={bestStreak}
            completedQuestionIds={completedQuestionIds}
            answeredStats={answeredStats}
            unlockedBadgeIds={unlockedBadgeIds}
            onUpdateProfile={(name, av, comp) => {
              setStudentName(name);
              setAvatarId(av);
              setCompanionId(comp);
            }}
            onResetProgress={handleResetProgress}
          />
        )}

        {/* VIEW 5: SCRATCHPAD WHITEBOARD */}
        {activeTab === 'scratchpad' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <Scratchpad />
          </div>
        )}
      </main>

      {/* Celebration & Reward Modal */}
      <RewardModal
        isOpen={rewardModal.isOpen}
        type={rewardModal.type}
        title={rewardModal.title}
        subtitle={rewardModal.subtitle}
        xpEarned={rewardModal.xpEarned}
        streak={rewardModal.streak}
        companionId={companionId}
        badgeIcon={rewardModal.badgeIcon}
        onClose={() => setRewardModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
