import { Badge } from '../types/math';

export const BADGES: Badge[] = [
  {
    id: 'first_step',
    title: 'First Step Prodigy',
    description: 'Answered your first HMH Grade 6 problem correctly!',
    icon: '🌱',
    unlockedAtQuestions: 1,
    quote: '"Every math journey starts with a single coordinate!"'
  },
  {
    id: 'streak_3',
    title: 'Hot Streak Hustler',
    description: 'Maintained a 3-question answer streak without breaking a sweat!',
    icon: '🔥',
    unlockedAtStreak: 3,
    quote: '"The brain gears are smoking hot!"'
  },
  {
    id: 'streak_5',
    title: 'Unstoppable Momentum',
    description: 'Blasted through 5 consecutive questions correctly!',
    icon: '⚡',
    unlockedAtStreak: 5,
    quote: '"Is it a plane? Is it a bird? No, it\'s 100% math accuracy!"'
  },
  {
    id: 'mod1_master',
    title: 'Sub-Zero Integer Hero',
    description: 'Mastered Module 1: Positive/Negative numbers & Absolute Values!',
    icon: '❄️',
    moduleId: 'module-1',
    quote: '"Even Minnesota winters and insect supercooling can\'t freeze your skills!"'
  },
  {
    id: 'mod2_master',
    title: 'Rational Ruler & LCM Legend',
    description: 'Conquered Module 2: Rational Numbers, Opposites & GCF/LCM!',
    icon: '👑',
    moduleId: 'module-2',
    quote: '"You find common denominators faster than a cheetah runs 100 meters!"'
  },
  {
    id: 'mod3_master',
    title: 'Fraction Inversion Titan',
    description: 'Completed Module 3: Fraction Division & Mixed Numbers!',
    icon: '🍕',
    moduleId: 'module-3',
    quote: '"Keep, Change, Flip! Fractions bow before your mighty dividing powers!"'
  },
  {
    id: 'xp_500',
    title: 'Acorn Hoarder',
    description: 'Accumulated 500 total Math XP!',
    icon: '🌰',
    unlockedAtXp: 500,
    quote: '"Professor Nibbles nods with deep acorn respect."'
  },
  {
    id: 'xp_1000',
    title: 'Grand Calculator',
    description: 'Accumulated 1,000 total Math XP!',
    icon: '💎',
    unlockedAtXp: 1000,
    quote: '"Beep-Boop 3000 calculates a 99.99% probability of sheer greatness!"'
  },
  {
    id: 'alligator_tail',
    title: 'Alligator Tail Geometer',
    description: 'Solved the real-world 11 3/4 ft alligator tail fraction division problem!',
    icon: '🐊',
    quote: '"The alligator gave you a toothy high-five!"'
  },
  {
    id: 'insects_pro',
    title: 'Supercooling Entomologist',
    description: 'Ranked the supercooling temperatures of Pythid beetles and woolly bear caterpillars!',
    icon: '🐛',
    quote: '"At -70°C, the Woolly Bear Caterpillar sends icy greetings."'
  }
];

export const STUDENT_LEVELS = [
  { level: 1, minXp: 0, title: 'Number Scout' },
  { level: 2, minXp: 150, title: 'Integer Apprentice' },
  { level: 3, minXp: 350, title: 'Opposites Navigator' },
  { level: 4, minXp: 600, title: 'Rational Explorer' },
  { level: 5, minXp: 900, title: 'GCF & LCM Commander' },
  { level: 6, minXp: 1300, title: 'Fraction Slicer' },
  { level: 7, minXp: 1800, title: 'Mixed Number Wizard' },
  { level: 8, minXp: 2400, title: 'Grade 6 Math Champion' },
  { level: 9, minXp: 3200, title: 'Grand Mathemagician' },
  { level: 10, minXp: 4200, title: 'HMH Math Overlord' }
];

export function getLevelForXp(xp: number) {
  let current = STUDENT_LEVELS[0];
  for (const lvl of STUDENT_LEVELS) {
    if (xp >= lvl.minXp) {
      current = lvl;
    } else {
      break;
    }
  }
  return current;
}
