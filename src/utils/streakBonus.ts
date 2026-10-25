/**
 * Daily Streak Bonus calculations and milestone configurations for HMH Into Math Grade 6
 */

export interface StreakDayMilestone {
  day: number;
  xp: number;
  stars?: number;
  title: string;
  icon: string;
  subtitle: string;
}

export const STREAK_MILESTONES: StreakDayMilestone[] = [
  { day: 1, xp: 50, title: 'بداية الانطلاق', icon: '🌱', subtitle: 'أول خطوة في عادة التدريب اليومي' },
  { day: 2, xp: 65, title: 'شرارة التحدي', icon: '⚡', subtitle: 'طاقتك تتصاعد لليوم الثاني' },
  { day: 3, xp: 80, title: 'شعلة الاستمرار', icon: '🔥', subtitle: 'نار التدريب تشتعل بقوة' },
  { day: 4, xp: 100, title: 'انطلاق الصاروخ', icon: '🚀', subtitle: 'سرعة مذهلة في حل المسائل' },
  { day: 5, xp: 120, title: 'نجم الرياضيات', icon: '⭐', subtitle: 'أداء متميز وتفوق مستمر' },
  { day: 6, xp: 150, title: 'ألماسة العباقرة', icon: '💎', subtitle: 'على بعد خطوة واحدة من الصندوق الذهبي' },
  { day: 7, xp: 200, stars: 1, title: 'صندوق التاج الذهبي', icon: '👑', subtitle: 'مكافأة أسبوع كامل + نجمة ذهبية!' },
];

/**
 * Returns YYYY-MM-DD for a given date in the user's local timezone
 */
export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns YYYY-MM-DD for yesterday in the user's local timezone
 */
export function getYesterdayDateString(d: Date = new Date()): string {
  const yesterday = new Date(d);
  yesterday.setDate(yesterday.getDate() - 1);
  return getLocalDateString(yesterday);
}

/**
 * Check if the student already claimed their streak bonus today
 */
export function isDailyBonusClaimedToday(lastDailyBonusDate?: string): boolean {
  if (!lastDailyBonusDate) return false;
  return lastDailyBonusDate === getLocalDateString();
}

export interface DailyBonusCalculation {
  nextStreak: number;
  bonusXp: number;
  bonusStars: number;
  isContinuation: boolean;
  isNewStreak: boolean;
  isBrokenStreak: boolean;
  dayOfCycle: number; // 1 to 7
  milestone: StreakDayMilestone;
}

/**
 * Calculates what the student earns for claiming today's daily streak bonus
 */
export function calculateDailyBonus(
  currentStreak: number,
  lastDailyBonusDate?: string
): DailyBonusCalculation {
  const todayStr = getLocalDateString();
  const yesterdayStr = getYesterdayDateString();

  let nextStreak = 1;
  let isContinuation = false;
  let isNewStreak = false;
  let isBrokenStreak = false;

  if (!lastDailyBonusDate) {
    // First time ever claiming
    nextStreak = Math.max(1, currentStreak || 1);
    isNewStreak = true;
  } else if (lastDailyBonusDate === yesterdayStr) {
    // Streak preserved and continues!
    nextStreak = (currentStreak || 0) + 1;
    isContinuation = true;
  } else if (lastDailyBonusDate === todayStr) {
    // Already claimed today, return current
    nextStreak = currentStreak || 1;
  } else {
    // Missed a day: streak resets back to 1
    nextStreak = 1;
    isBrokenStreak = true;
  }

  // Determine position in 7-day milestone ladder
  const dayOfCycle = ((nextStreak - 1) % 7) + 1;
  const milestone = STREAK_MILESTONES[dayOfCycle - 1] || STREAK_MILESTONES[0];

  const bonusXp = milestone.xp;
  const bonusStars = milestone.stars || 0;

  return {
    nextStreak,
    bonusXp,
    bonusStars,
    isContinuation,
    isNewStreak,
    isBrokenStreak,
    dayOfCycle,
    milestone,
  };
}
