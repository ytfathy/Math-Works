import React, { useState, useEffect, useMemo } from 'react';
import { MODULES_DATA, INITIAL_LEADERBOARD_DATA } from './data/modulesData';
import { BADGES, STUDENT_LEVELS, getLevelForXp } from './data/rewards';
import { COMPANIONS } from './data/characters';
import { sounds } from './services/soundEffects';
import { Question, UserAccount, LeaderboardEntry } from './types/math';
import { authService } from './services/authService';

import { Navbar } from './components/Navbar';
import { CharacterCompanion } from './components/CharacterCompanion';
import { QuestionCard } from './components/QuestionCard';
import { LeaderboardView } from './components/LeaderboardView';
import { ProgressDashboard } from './components/ProgressDashboard';
import { Scratchpad } from './components/Scratchpad';
import { RewardModal } from './components/RewardModal';
import { AuthModal } from './components/AuthModal';
import { AdminControlModal } from './components/AdminControlModal';
import { triggerModuleCompleteCelebration, triggerLevelUpCelebration } from './utils/celebrationEffects';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'modules' | 'practice' | 'leaderboard' | 'progress' | 'scratchpad'>('modules');

  // User Account & Authentication State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    return authService.getCurrentUser();
  });
  // Open auth modal on first launch if user is not signed in
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => {
    return !authService.getCurrentUser();
  });
  // Admin Control Modal State
  const [isAdminControlOpen, setIsAdminControlOpen] = useState<boolean>(false);

  // All Registered Users State (Synced across devices)
  const [allUsers, setAllUsers] = useState<UserAccount[]>(() => authService.getUsers());

  // Student Stats State (Synchronized with currentUser or default)
  const [studentName, setStudentName] = useState<string>(() => {
    const user = authService.getCurrentUser();
    return user ? user.username : (localStorage.getItem('hmh_student_name') || 'Guest');
  });
  const [avatarId, setAvatarId] = useState<string>(() => {
    const user = authService.getCurrentUser();
    return user ? user.avatar : (localStorage.getItem('hmh_student_avatar') || '🌟');
  });
  const [companionId, setCompanionId] = useState<string>(() => {
    const user = authService.getCurrentUser();
    return user ? user.companionId : (localStorage.getItem('hmh_companion_id') || 'nibbles');
  });
  const [totalXp, setTotalXp] = useState<number>(() => {
    const user = authService.getCurrentUser();
    if (user) return user.totalXp;
    const val = localStorage.getItem('hmh_total_xp');
    return val ? parseInt(val, 10) : 100;
  });
  const [stars, setStars] = useState<number>(() => {
    const user = authService.getCurrentUser();
    if (user) return user.stars;
    const val = localStorage.getItem('hmh_stars');
    return val ? parseInt(val, 10) : 2;
  });
  const [streak, setStreak] = useState<number>(() => {
    const user = authService.getCurrentUser();
    if (user) return user.streak;
    const val = localStorage.getItem('hmh_streak');
    return val ? parseInt(val, 10) : 0;
  });
  const [bestStreak, setBestStreak] = useState<number>(() => {
    const user = authService.getCurrentUser();
    if (user) return user.bestStreak;
    const val = localStorage.getItem('hmh_best_streak');
    return val ? parseInt(val, 10) : 0;
  });
  const [completedQuestionIds, setCompletedQuestionIds] = useState<string[]>(() => {
    const user = authService.getCurrentUser();
    if (user) return user.completedQuestionIds;
    try {
      return JSON.parse(localStorage.getItem('hmh_completed_questions') || '[]');
    } catch {
      return [];
    }
  });
  const [answeredStats, setAnsweredStats] = useState<Record<string, { correct: boolean; attempts: number }>>(() => {
    const user = authService.getCurrentUser();
    if (user) return user.answeredStats;
    try {
      return JSON.parse(localStorage.getItem('hmh_answered_stats') || '{}');
    } catch {
      return {};
    }
  });
  const [unlockedBadgeIds, setUnlockedBadgeIds] = useState<string[]>(() => {
    const user = authService.getCurrentUser();
    if (user) return user.unlockedBadgeIds;
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

  // Subscribe to real-time user database updates
  useEffect(() => {
    const unsub = authService.subscribe((updatedUsers) => {
      setAllUsers(updatedUsers);
    });
    return unsub;
  }, []);

  // Real-time server sync: keeps accounts updated across devices in real time
  useEffect(() => {
    const syncUsers = async () => {
      const freshUsers = await authService.fetchUsersFromServer();
      setAllUsers(freshUsers);
      const activeId = authService.getCurrentUserId();
      if (activeId) {
        const found = freshUsers.find(u => u.id === activeId);
        if (found) {
          setCurrentUser(found);
        }
      }
    };

    syncUsers();

    // Re-sync on window/tab focus
    window.addEventListener('focus', syncUsers);

    // Periodic background sync every 4 seconds to catch newly registered accounts from any device
    const interval = setInterval(syncUsers, 4000);

    return () => {
      window.removeEventListener('focus', syncUsers);
      clearInterval(interval);
    };
  }, []);

  // Persist student data to current user account and localStorage fallback
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

    // Save to account in user DB
    if (currentUser) {
      authService.updateUserData(currentUser.id, {
        displayName: studentName,
        avatar: avatarId,
        companionId,
        totalXp,
        stars,
        streak,
        bestStreak,
        completedQuestionIds,
        answeredStats,
        unlockedBadgeIds,
      });
    }
  }, [
    currentUser,
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

  // Access Permission Helper: Module 1 is always unlocked. Modules 2 & 3 require admin role or unlockedAllLevels permission!
  const canAccessModule = (moduleId: string): boolean => {
    if (moduleId === 'module-1') return true;
    if (currentUser?.role === 'admin' || currentUser?.isAdmin || currentUser?.username.toLowerCase() === 'admin') {
      return true;
    }
    return Boolean(currentUser?.unlockedAllLevels);
  };

  // Handle successful login or account creation
  const handleAuthSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setStudentName(user.username);
    setAvatarId(user.avatar || '🌟');
    setCompanionId(user.companionId || 'nibbles');
    setTotalXp(user.totalXp);
    setStars(user.stars);
    setStreak(user.streak);
    setBestStreak(user.bestStreak);
    setCompletedQuestionIds(user.completedQuestionIds || []);
    setAnsweredStats(user.answeredStats || {});
    setUnlockedBadgeIds(user.unlockedBadgeIds || ['first_step']);
    setIsAuthModalOpen(false);

    setCompanionReaction('celebrating');
    if (user.role === 'admin' || user.username.toLowerCase() === 'admin') {
      setCustomCompanionMsg(`مرحباً سيادة المشرف (${user.username})! يمكنك التحكم بجميع الحسابات من زر "أدمن كنترول" 🛡️`);
    } else {
      setCustomCompanionMsg(`أهلاً بك يا ${user.username}! جاهز لرحلة الرياضيات اليوم؟`);
    }
  };

  // Handle logout
  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setStudentName('Guest');
    setAvatarId('🌟');
    setCompanionId('nibbles');
    setTotalXp(100);
    setStars(2);
    setStreak(0);
    setBestStreak(0);
    setCompletedQuestionIds([]);
    setAnsweredStats({});
    setUnlockedBadgeIds(['first_step']);
    setIsAuthModalOpen(true);
  };

  // Refresh current user permissions after admin changes
  const handleAdminUsersUpdated = () => {
    const updated = authService.getCurrentUser();
    if (updated) {
      setCurrentUser(updated);
    }
  };

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

  // Start a specific lesson with level lock check
  const startLesson = (moduleId: string, lessonId: string) => {
    if (!canAccessModule(moduleId)) {
      sounds.playWrong();
      setCompanionReaction('incorrect');
      setCustomCompanionMsg(
        '🔒 هذا المستوى مقفل حالياً! يسمح لك بلعب المستوى 1 فقط (Level 1) حتى يمنحك المشرف (Admin) إذن فتح باقي المستويات من لوحة أدمن كنترول.'
      );
      return;
    }

    sounds.playPop();
    setSelectedModuleId(moduleId);
    setSelectedLessonId(lessonId);
    setCurrentQuestionIndex(0);
    setHasAnsweredCurrent(false);
    setCompanionReaction('idle');
    setCustomCompanionMsg(undefined);
  };

  // Start practice arena with questions filtered by unlocked modules
  const startPracticeArena = () => {
    sounds.playPop();
    const hasFullAccess = canAccessModule('module-2');
    const availableModules = hasFullAccess ? MODULES_DATA : [MODULES_DATA[0]];
    const all = availableModules.flatMap(m => m.lessons.flatMap(l => l.questions));
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
        triggerLevelUpCelebration(3500);
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
        triggerModuleCompleteCelebration(3500);
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
      // Completed lesson or full module!
      sounds.playLevelUp();
      setCompanionReaction('celebrating');

      const currentMod = MODULES_DATA.find(m => m.id === selectedModuleId);
      const allModQIds = currentMod ? currentMod.lessons.flatMap(l => l.questions.map(q => q.id)) : [];
      const isEntireModDone = allModQIds.length > 0 && allModQIds.every(id => completedQuestionIds.includes(id));

      if (isEntireModDone) {
        triggerModuleCompleteCelebration(4200);
        setRewardModal({
          isOpen: true,
          type: 'module_complete',
          title: `🏆 مبروك! أنهيت ${currentMod?.title || 'المستوى'} 100%!`,
          subtitle: 'لقد أتممت بنجاح جميع دروس وتمارين هذا المستوى! ألعاب نارية وشهادة تفوق لك!',
          xpEarned: 500,
          streak,
          badgeIcon: '🏆',
        });
      } else {
        triggerModuleCompleteCelebration(3200);
        setRewardModal({
          isOpen: true,
          type: 'module_complete',
          title: 'Lesson Challenge Complete! 🎉',
          subtitle: 'Outstanding work solving all textbook problems in this section!',
          xpEarned: 200,
          streak,
        });
      }
      setSelectedLessonId(null);
    }
  };

  const handleResetProgress = () => {
    sounds.playPop();
    setTotalXp(100);
    setStars(2);
    setStreak(0);
    setBestStreak(0);
    setCompletedQuestionIds([]);
    setAnsweredStats({});
    setUnlockedBadgeIds(['first_step']);
    if (currentUser) {
      authService.updateUserData(currentUser.id, {
        totalXp: 100,
        stars: 2,
        streak: 0,
        bestStreak: 0,
        completedQuestionIds: [],
        answeredStats: {},
        unlockedBadgeIds: ['first_step'],
      });
    }
  };

  // Combined leaderboard with registered accounts
  const combinedLeaderboardEntries = useMemo(() => {
    const userEntries: LeaderboardEntry[] = allUsers.map(u => ({
      id: u.id,
      rank: 0,
      name: u.username,
      avatar: u.avatar || '🌟',
      companion: u.companionId || 'nibbles',
      moduleScore: u.totalXp,
      totalXp: u.id === currentUser?.id ? totalXp : u.totalXp,
      stars: u.id === currentUser?.id ? stars : u.stars,
      level: getLevelForXp(u.id === currentUser?.id ? totalXp : u.totalXp).level,
      isCurrentUser: u.id === currentUser?.id,
    }));

    const combined = [...userEntries];
    INITIAL_LEADERBOARD_DATA.forEach(initial => {
      if (!combined.some(c => c.name.toLowerCase() === initial.name.toLowerCase())) {
        combined.push(initial);
      }
    });

    return combined;
  }, [allUsers, currentUser, totalXp, stars]);

  const isAdminUser = Boolean(
    currentUser?.role === 'admin' ||
    currentUser?.isAdmin ||
    currentUser?.username.toLowerCase() === 'admin'
  );

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 flex flex-col font-sans w-full max-w-full overflow-x-hidden">
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
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenAdminControl={() => setIsAdminControlOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 md:p-8 space-y-4 sm:space-y-6 overflow-x-hidden">
        {/* Admin Special Banner */}
        {isAdminUser && (
          <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-blue-900 text-white p-3.5 sm:p-4 rounded-2xl border-2 border-purple-400/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🛡️</span>
              <div>
                <div className="text-xs sm:text-sm font-black text-amber-300">
                  لوحة تحكم المشرف العام (Logged in as Admin)
                </div>
                <div className="text-[11px] sm:text-xs text-purple-200">
                  جميع المستويات مفتوحة لك، ويمكنك فتح أو قفل المستويات للطلاب بضغطة زر واحدة.
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                sounds.playPop();
                setIsAdminControlOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🛡️ أدمن كنترول</span>
              <span className="text-[10px] bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded">فتح</span>
            </button>
          </div>
        )}

        {/* Regular Student Level Notice (When only Level 1 is open) */}
        {!isAdminUser && currentUser && !currentUser.unlockedAllLevels && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">ℹ️</span>
              <div className="text-xs text-blue-900">
                <span className="font-bold">المستوى المتاح لك حالياً:</span> المستوى 1 (Module 1). باقي المستويات يتم فتحها بواسطة المشرف أو المعلم من لوحة التحكم.
              </div>
            </div>
            <span className="text-[11px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md flex-shrink-0">
              Level 1 Active
            </span>
          </div>
        )}

        {/* User Account Bar Notice if Guest */}
        {!currentUser && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs w-full max-w-full">
            <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto min-w-0">
              <span className="text-2xl flex-shrink-0">👤</span>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-extrabold text-amber-900 truncate">
                  أنت تلعب كزائر حالياً (Guest Mode)
                </div>
                <div className="text-[11px] sm:text-xs text-amber-700 leading-tight">
                  سجل حسابك مجاناً بالجيميل واسم المستخدم لحفظ نقاطك ودرجاتك والصعود في قائمة الشرف!
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                sounds.playPop();
                setIsAuthModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer text-center flex-shrink-0"
            >
              تسجيل الدخول / إنشاء حساب 🚀
            </button>
          </div>
        )}

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
                    const isUnlocked = canAccessModule(module.id);

                    return (
                      <div
                        key={module.id}
                        className={`bg-white rounded-3xl p-6 border-2 shadow-md flex flex-col justify-between transition relative overflow-hidden ${
                          isUnlocked
                            ? 'border-slate-200 hover:border-slate-300 hover:shadow-lg'
                            : 'border-slate-200 bg-slate-50/70 opacity-90'
                        }`}
                      >
                        {/* Module Top Accent bar */}
                        <div
                          className="absolute top-0 left-0 right-0 h-2.5"
                          style={{ backgroundColor: isUnlocked ? module.themeColor : '#94a3b8' }}
                        />

                        <div>
                          <div className="flex items-center justify-between mb-3 pt-1">
                            <span
                              className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-lg text-white"
                              style={{ backgroundColor: isUnlocked ? module.themeColor : '#64748b' }}
                            >
                              Module {module.number}
                            </span>
                            {isUnlocked ? (
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                                pct === 100 
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-black' 
                                  : 'text-slate-500 bg-slate-100 font-mono'
                              }`}>
                                {pct === 100 ? '✅ مكتمل 100%' : `${completedInMod.length}/${allModQIds.length} Mastered`}
                              </span>
                            ) : (
                              <span className="text-xs font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300 flex items-center gap-1">
                                <span>🔒</span>
                                <span>مقفل</span>
                              </span>
                            )}
                          </div>

                          {/* Full Module Completed Celebration Banner */}
                          {isUnlocked && pct === 100 && (
                            <button
                              type="button"
                              onClick={() => {
                                sounds.playLevelUp();
                                triggerModuleCompleteCelebration(3200);
                              }}
                              className="w-full mb-3 p-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl shadow-xs flex items-center justify-between font-black text-xs transition cursor-pointer active:scale-98"
                              title="انقر لإطلاق الألعاب النارية والاحتفال بإنجازك!"
                            >
                              <span className="flex items-center gap-1.5">
                                <span>🏆</span>
                                <span>تم إكمال المستوى بالكامل!</span>
                              </span>
                              <span className="bg-white/25 px-2 py-0.5 rounded-lg text-[10px] flex items-center gap-1">
                                <span>100%</span>
                                <span>🎉 احتفل</span>
                              </span>
                            </button>
                          )}

                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-black text-slate-900">
                              {module.title}
                            </h3>
                            {!isUnlocked && <span className="text-lg">🔒</span>}
                            {isUnlocked && pct === 100 && <span className="text-emerald-600 text-lg">✅</span>}
                          </div>
                          
                          <p className="text-xs text-slate-600 leading-relaxed mb-4">
                            {module.description}
                          </p>

                          {/* Progress Meter */}
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-5">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                pct === 100 ? 'bg-emerald-500 shadow-sm' : ''
                              }`}
                              style={{
                                width: `${pct}%`,
                                backgroundColor: pct === 100 ? undefined : (isUnlocked ? module.themeColor : '#94a3b8'),
                              }}
                            />
                          </div>

                          {/* Lessons in Module */}
                          <div className="space-y-2.5 mb-4">
                            {module.lessons.map(lesson => {
                              const lessonDone = lesson.questions.length > 0 && lesson.questions.every(q => completedQuestionIds.includes(q.id));
                              return (
                                <button
                                  key={lesson.id}
                                  onClick={() => startLesson(module.id, lesson.id)}
                                  className={`w-full p-3.5 rounded-2xl text-left border-2 text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                                    !isUnlocked
                                      ? 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-900'
                                      : lessonDone
                                      ? 'bg-emerald-100/90 border-emerald-500 text-emerald-950 font-black shadow-sm ring-2 ring-emerald-300/40 hover:bg-emerald-200/80'
                                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-blue-50 hover:border-blue-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    {lessonDone ? (
                                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black shadow-2xs">
                                        ✓
                                      </span>
                                    ) : (
                                      <span>{!isUnlocked ? '🔒' : '🎯'}</span>
                                    )}
                                    <span className={`truncate max-w-[200px] ${lessonDone ? 'font-black text-emerald-950' : ''}`}>
                                      {lesson.title}
                                    </span>
                                  </div>

                                  {lessonDone ? (
                                    <span className="text-[11px] font-black text-emerald-900 bg-emerald-200/90 border border-emerald-400 px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-2xs">
                                      <span>مكتمل 100%</span>
                                      <span className="text-emerald-700">⭐</span>
                                    </span>
                                  ) : (
                                    <span className="text-[11px] font-mono text-slate-500">
                                      {!isUnlocked ? 'إذن الأدمن' : `${lesson.questions.length} Qs`}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Lock explanation for non-unlocked modules */}
                          {!isUnlocked && (
                            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-800 flex items-center gap-2">
                              <span>🔒</span>
                              <span>مقفل حتى يمنحك المشرف (Admin) إذن فتح جميع المستويات.</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* Active Lesson Quiz View */
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <button
                    onClick={() => {
                      sounds.playPop();
                      setSelectedLessonId(null);
                    }}
                    className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
                  >
                    <span>← Back to Modules</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {getActiveLessonQuestions().length > 0 &&
                      getActiveLessonQuestions().every(q => completedQuestionIds.includes(q.id)) && (
                        <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <span>✅</span>
                          <span>مكتمل 100%</span>
                        </span>
                    )}
                    <div className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      Question {currentQuestionIndex + 1} of {getActiveLessonQuestions().length}
                    </div>
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
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚡</span>
                <div>
                  <h3 className="font-black text-base text-slate-900">Speed Practice Arena</h3>
                  <div className="text-xs text-slate-500">
                    {canAccessModule('module-2') ? 'Randomized challenges across all modules' : 'Challenges across Module 1'}
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
            entries={combinedLeaderboardEntries}
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

      {/* Auth Screen Modal (Sign In / Register with Username, Gmail, Password) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        canDismiss={true}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Exclusive Admin Control Modal */}
      <AdminControlModal
        isOpen={isAdminControlOpen}
        onClose={() => setIsAdminControlOpen(false)}
        onUsersUpdated={handleAdminUsersUpdated}
      />

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
