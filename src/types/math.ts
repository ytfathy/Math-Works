export type QuestionType = 
  | 'multiple_choice' 
  | 'multi_select' 
  | 'ordering' 
  | 'matching' 
  | 'number_line' 
  | 'text_input';

export interface QuestionOption {
  id: string;
  text: string;
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface Question {
  id: string;
  moduleId: string;
  lessonId: string;
  lessonTitle: string;
  prompt: string;
  subtitle?: string;
  type: QuestionType;
  options?: QuestionOption[];
  correctAnswer: string | string[]; // string for single, array for multi_select / ordering
  matchingPairs?: MatchingPair[]; // For matching type
  numberLineConfig?: {
    min: number;
    max: number;
    step: number;
    targetValue: number;
    labels?: { val: number; label: string }[];
  };
  explanation: string;
  hint: string;
  funnySuccessLine: string;
  funnyFailLine: string;
  sourcePage?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

export interface MathLesson {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface MathModule {
  id: string;
  number: number;
  title: string;
  themeColor: string;
  icon: string;
  description: string;
  lessons: MathLesson[];
}

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  password: string;
  displayName: string;
  avatar: string;
  companionId: string;
  role?: 'admin' | 'student';
  isAdmin?: boolean;
  unlockedAllLevels?: boolean; // Default false for students (can only play Level 1/Module 1)
  createdAt: number;
  totalXp: number;
  stars: number;
  streak: number;
  bestStreak: number;
  lastDailyBonusDate?: string; // YYYY-MM-DD of last claimed daily streak bonus
  completedQuestionIds: string[];
  answeredStats: Record<string, { correct: boolean; attempts: number }>;
  unlockedBadgeIds: string[];
}

export interface StudentProgress {
  studentName: string;
  avatarId: string;
  companionId: string;
  totalXp: number;
  level: number;
  stars: number;
  currentStreak: number;
  bestStreak: number;
  completedQuestionIds: string[];
  answeredStats: Record<string, { correct: boolean; attempts: number }>;
  unlockedBadgeIds: string[];
  soundEnabled: boolean;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  companion: string;
  moduleScore: number;
  totalXp: number;
  stars: number;
  level: number;
  isCurrentUser?: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAtXp?: number;
  unlockedAtQuestions?: number;
  unlockedAtStreak?: number;
  moduleId?: string;
  quote: string;
}

export interface Companion {
  id: string;
  name: string;
  title: string;
  animal: string;
  color: string;
  avatarSvg: string;
  personality: string;
  idleLines: string[];
  correctLines: string[];
  incorrectLines: string[];
  celebrationLines: string[];
}
