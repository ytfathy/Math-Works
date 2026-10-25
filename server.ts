import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DB_FILE = path.resolve(__dirname, 'users_db.json');
const BACKUP_FILE = path.resolve(__dirname, 'users_db.backup.json');
const SEED_FILE = path.resolve(__dirname, 'users_db.seed.json');
const DELETED_FILE = path.resolve(__dirname, 'deleted_users.json');

interface UserAccount {
  id: string;
  username: string;
  email: string;
  password: string;
  displayName: string;
  avatar: string;
  companionId: string;
  role?: 'admin' | 'student';
  isAdmin?: boolean;
  unlockedAllLevels?: boolean;
  createdAt: number;
  totalXp: number;
  stars: number;
  streak: number;
  bestStreak: number;
  lastDailyBonusDate?: string;
  completedQuestionIds: string[];
  answeredStats: Record<string, { correct: boolean; attempts: number }>;
  unlockedBadgeIds: string[];
}

const DEFAULT_ADMIN: UserAccount = {
  id: 'user_admin_root',
  username: 'admin',
  email: 'admin@hmhmath.com',
  password: '123456789',
  displayName: 'Admin Control (المشرف العام)',
  avatar: '👑',
  companionId: 'archimedes',
  role: 'admin',
  isAdmin: true,
  unlockedAllLevels: true,
  createdAt: 1790353111876,
  totalXp: 5000,
  stars: 50,
  streak: 10,
  bestStreak: 15,
  completedQuestionIds: [],
  answeredStats: {},
  unlockedBadgeIds: ['first_step', 'mod1_master', 'mod2_master', 'mod3_master']
};

const DEFAULT_STUDENTS: UserAccount[] = [
  DEFAULT_ADMIN,
  {
    id: 'user_alex',
    username: 'AlexMath',
    email: 'alex.math@gmail.com',
    password: 'password123',
    displayName: 'Alex Rivers',
    avatar: '🌟',
    companionId: 'nibbles',
    role: 'student',
    isAdmin: false,
    unlockedAllLevels: false,
    createdAt: 1792513111876,
    totalXp: 420,
    stars: 8,
    streak: 4,
    bestStreak: 6,
    completedQuestionIds: ['m1-l1-q1', 'm1-l1-q2'],
    answeredStats: {
      'm1-l1-q1': { correct: true, attempts: 1 },
      'm1-l1-q2': { correct: true, attempts: 1 }
    },
    unlockedBadgeIds: ['first_step', 'speed_streak']
  },
  {
    id: 'user_sarah',
    username: 'Sarah_G6',
    email: 'sarah.grade6@gmail.com',
    password: 'password123',
    displayName: 'Sarah Al-Mansoor',
    avatar: '🦊',
    companionId: 'archimedes',
    role: 'student',
    isAdmin: false,
    unlockedAllLevels: false,
    createdAt: 1792685911876,
    totalXp: 350,
    stars: 6,
    streak: 3,
    bestStreak: 5,
    completedQuestionIds: ['m1-l1-q1'],
    answeredStats: {
      'm1-l1-q1': { correct: true, attempts: 1 }
    },
    unlockedBadgeIds: ['first_step']
  },
  {
    id: 'user_1792947169624_9v284',
    username: 'Youssef',
    email: 'youssef@gmail.com',
    password: 'password123',
    displayName: 'Youssef',
    avatar: '🌟',
    companionId: 'nibbles',
    role: 'student',
    isAdmin: false,
    unlockedAllLevels: false,
    createdAt: 1792947169624,
    totalXp: 100,
    stars: 2,
    streak: 0,
    bestStreak: 0,
    completedQuestionIds: [],
    answeredStats: {},
    unlockedBadgeIds: ['first_step']
  },
  {
    id: 'user_1792947244616_fotba',
    username: 'Ziad',
    email: 'ziad@gmail.com',
    password: 'password123',
    displayName: 'Ziad',
    avatar: '🌟',
    companionId: 'nibbles',
    role: 'student',
    isAdmin: false,
    unlockedAllLevels: false,
    createdAt: 1792947244616,
    totalXp: 100,
    stars: 2,
    streak: 0,
    bestStreak: 0,
    completedQuestionIds: [],
    answeredStats: {},
    unlockedBadgeIds: ['first_step']
  },
  {
    id: 'user_asser_math',
    username: 'Asser',
    email: 'asser@gmail.com',
    password: 'password123',
    displayName: 'Asser (آسر)',
    avatar: '🚀',
    companionId: 'nibbles',
    role: 'student',
    isAdmin: false,
    unlockedAllLevels: false,
    createdAt: 1792947300000,
    totalXp: 200,
    stars: 3,
    streak: 1,
    bestStreak: 2,
    completedQuestionIds: ['m1-l1-q1'],
    answeredStats: {
      'm1-l1-q1': {
        correct: true,
        attempts: 1
      }
    },
    unlockedBadgeIds: ['first_step']
  }
];

// In-memory master database (Single source of truth during process lifetime)
let memoryUsers: UserAccount[] = [];

// Deleted users persistent tracker (prevents deleted accounts from resurrecting)
function loadDeletedUsers(): Set<string> {
  if (!fs.existsSync(DELETED_FILE)) return new Set();
  try {
    const raw = fs.readFileSync(DELETED_FILE, 'utf8').trim();
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return new Set(parsed.map((s: string) => String(s).trim().toLowerCase()));
    }
  } catch {
    // ignore
  }
  return new Set();
}

function addDeletedUser(userId: string, username: string): void {
  const set = loadDeletedUsers();
  set.add(userId.toLowerCase());
  set.add(username.toLowerCase());
  try {
    fs.writeFileSync(DELETED_FILE, JSON.stringify(Array.from(set), null, 2), 'utf8');
  } catch (err) {
    console.error('[DB] Error saving deleted users list:', err);
  }
}

function unmarkDeletedUser(username: string): void {
  const set = loadDeletedUsers();
  const key = username.toLowerCase();
  if (set.has(key)) {
    set.delete(key);
    try {
      fs.writeFileSync(DELETED_FILE, JSON.stringify(Array.from(set), null, 2), 'utf8');
    } catch {
      // ignore
    }
  }
}

// Immediate synchronous persistence across all 3 storage files
function persistUsersSync(): void {
  try {
    const jsonString = JSON.stringify(memoryUsers, null, 2);
    fs.writeFileSync(DB_FILE, jsonString, 'utf8');
    fs.writeFileSync(BACKUP_FILE, jsonString, 'utf8');
    fs.writeFileSync(SEED_FILE, jsonString, 'utf8');
  } catch (err) {
    console.error('[DB] Error writing users to disk synchronously:', err);
  }
}

// Safe file parser helper
function loadUsersFromFile(filePath: string): UserAccount[] {
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, 'utf8').trim();
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error(`[DB] Could not parse file at ${filePath}:`, err);
  }
  return [];
}

// Initialize memory database from disk safely
function initUsersDatabase(): void {
  const usersMap = new Map<string, UserAccount>();
  const deletedSet = loadDeletedUsers();

  const mergeUserList = (list: UserAccount[], sourceLabel: string) => {
    for (const u of list) {
      if (!u || !u.username) continue;
      const key = u.username.trim().toLowerCase();
      // If student was deleted by admin, never resurrect!
      if (deletedSet.has(u.id.toLowerCase()) || deletedSet.has(key)) {
        continue;
      }

      const existing = usersMap.get(key);
      if (!existing) {
        usersMap.set(key, u);
      } else {
        const totalXp = Math.max(existing.totalXp || 0, u.totalXp || 0);
        const stars = Math.max(existing.stars || 0, u.stars || 0);
        const streak = Math.max(existing.streak || 0, u.streak || 0);
        const bestStreak = Math.max(existing.bestStreak || 0, u.bestStreak || 0);
        const unlockedAllLevels = Boolean(existing.unlockedAllLevels || u.unlockedAllLevels);
        const completedQuestionIds = Array.from(new Set([
          ...(existing.completedQuestionIds || []),
          ...(u.completedQuestionIds || [])
        ]));
        usersMap.set(key, {
          ...existing,
          ...u,
          password: existing.password || u.password,
          totalXp,
          stars,
          streak,
          bestStreak,
          unlockedAllLevels,
          completedQuestionIds,
          lastDailyBonusDate: u.lastDailyBonusDate || existing.lastDailyBonusDate,
          answeredStats: { ...(existing.answeredStats || {}), ...(u.answeredStats || {}) }
        });
      }
    }
    console.log(`[DB] Merged ${list.length} users from ${sourceLabel}. Current unique: ${usersMap.size}`);
  };

  // 1. Built-in defaults (Admin, Alex, Sarah, Youssef, Ziad, Asser)
  mergeUserList(DEFAULT_STUDENTS, 'hardcoded seeds');
  // 2. Permanent seed archive
  mergeUserList(loadUsersFromFile(SEED_FILE), 'seed archive');
  // 3. Backup file
  mergeUserList(loadUsersFromFile(BACKUP_FILE), 'backup file');
  // 4. Primary database file
  mergeUserList(loadUsersFromFile(DB_FILE), 'primary DB');

  let loaded: UserAccount[] = Array.from(usersMap.values());

  // Ensure Admin always exists with exact credentials and privileges
  const adminIdx = loaded.findIndex(
    u => u.username.toLowerCase() === 'admin' || u.role === 'admin'
  );

  if (adminIdx === -1) {
    loaded.unshift(DEFAULT_ADMIN);
  } else {
    loaded[adminIdx] = {
      ...loaded[adminIdx],
      username: 'admin',
      password: '123456789',
      role: 'admin',
      isAdmin: true,
      unlockedAllLevels: true,
    };
  }

  memoryUsers = loaded;
  persistUsersSync();
  console.log(`[DB] Database initialized with ${memoryUsers.length} user accounts.`);
}

// Start DB initialization
initUsersDatabase();

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      usersCount: memoryUsers.length,
      serverTime: new Date().toISOString()
    });
  });

  // GET all users (shared across all devices)
  app.get('/api/users', (_req: Request, res: Response) => {
    res.json({
      success: true,
      users: memoryUsers
    });
  });

  // POST register user
  app.post('/api/users/register', (req: Request, res: Response) => {
    const { username, email, password, avatar, companionId } = req.body || {};

    const trimmedUsername = String(username || '').trim();
    const trimmedEmail = String(email || '').trim().toLowerCase();
    const trimmedPassword = String(password || '').trim();

    if (!trimmedUsername || trimmedUsername.length < 3) {
      return res.status(400).json({ success: false, error: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' });
    }

    if (trimmedUsername.toLowerCase() === 'admin' || trimmedUsername === 'ادمن') {
      return res.status(400).json({ success: false, error: 'اسم المستخدم "admin" محجوز للمشرف العام فقط' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ success: false, error: 'صيغة البريد الإلكتروني غير صحيحة' });
    }

    if (!trimmedPassword || trimmedPassword.length < 4) {
      return res.status(400).json({ success: false, error: 'كلمة المرور يجب أن تكون 4 خانات على الأقل' });
    }

    const usernameExists = memoryUsers.some(u => u.username.toLowerCase() === trimmedUsername.toLowerCase());
    if (usernameExists) {
      return res.status(400).json({ success: false, error: 'اسم المستخدم مسجل بالفعل على السيرفر' });
    }

    const emailExists = memoryUsers.some(u => u.email.toLowerCase() === trimmedEmail);
    if (emailExists) {
      return res.status(400).json({ success: false, error: 'هذا البريد الإلكتروني مسجل بحساب مسبقاً' });
    }

    const newUser: UserAccount = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      username: trimmedUsername,
      email: trimmedEmail,
      password: trimmedPassword,
      displayName: trimmedUsername,
      avatar: avatar || '🌟',
      companionId: companionId || 'nibbles',
      role: 'student',
      isAdmin: false,
      unlockedAllLevels: false, // Default: Level 1 only!
      createdAt: Date.now(),
      totalXp: 100,
      stars: 2,
      streak: 0,
      bestStreak: 0,
      completedQuestionIds: [],
      answeredStats: {},
      unlockedBadgeIds: ['first_step'],
    };

    unmarkDeletedUser(trimmedUsername);
    memoryUsers.push(newUser);
    persistUsersSync();

    console.log(`[API] Registered new user: ${newUser.username} (${newUser.email}). Total users: ${memoryUsers.length}`);
    res.json({
      success: true,
      user: newUser,
      allUsers: memoryUsers
    });
  });

  // POST login user
  app.post('/api/users/login', (req: Request, res: Response) => {
    const { identifier, password } = req.body || {};
    const trimmedId = String(identifier || '').trim().toLowerCase();
    const trimmedPassword = String(password || '').trim();

    if (!trimmedId || !trimmedPassword) {
      return res.status(400).json({ success: false, error: 'يرجى كتابة اسم المستخدم وكلمة المرور' });
    }

    // Fast-path Admin login
    if (
      (trimmedId === 'admin' || trimmedId === 'ادمن' || trimmedId === 'أدمن' || trimmedId === 'admin@hmhmath.com') &&
      trimmedPassword === '123456789'
    ) {
      const admin = memoryUsers.find(u => u.username.toLowerCase() === 'admin') || DEFAULT_ADMIN;
      return res.json({
        success: true,
        user: admin,
        allUsers: memoryUsers
      });
    }

    const foundUser = memoryUsers.find(
      u => u.username.toLowerCase() === trimmedId || 
           u.email.toLowerCase() === trimmedId ||
           (trimmedId === 'آسر' && u.username.toLowerCase() === 'asser') ||
           (trimmedId === 'اسر' && u.username.toLowerCase() === 'asser') ||
           (trimmedId === 'asser' && (u.username === 'آسر' || u.username === 'اسر')) ||
           (trimmedId === 'يوسف' && u.username.toLowerCase() === 'youssef') ||
           (trimmedId === 'زياد' && u.username.toLowerCase() === 'ziad') ||
           (trimmedId === 'ادمن' && u.username.toLowerCase() === 'admin') ||
           (trimmedId === 'أدمن' && u.username.toLowerCase() === 'admin')
    );

    if (!foundUser) {
      return res.status(404).json({ success: false, error: 'الحساب غير موجود! تأكد من اسم المستخدم أو البريد' });
    }

    if (foundUser.password !== trimmedPassword) {
      return res.status(401).json({ success: false, error: 'كلمة المرور غير صحيحة، حاول مجدداً' });
    }

    res.json({
      success: true,
      user: foundUser,
      allUsers: memoryUsers
    });
  });

  // PATCH user level permission (Admin control)
  app.patch('/api/users/:id/permission', (req: Request, res: Response) => {
    const userId = req.params.id;
    const { unlockedAllLevels } = req.body || {};

    const index = memoryUsers.findIndex(u => u.id === userId);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'المستخدم غير موجود' });
    }

    memoryUsers[index].unlockedAllLevels = Boolean(unlockedAllLevels);
    persistUsersSync();

    console.log(`[API] Admin changed levels permission for ${memoryUsers[index].username} -> ${memoryUsers[index].unlockedAllLevels}`);
    res.json({
      success: true,
      user: memoryUsers[index],
      allUsers: memoryUsers
    });
  });

  // PATCH user progress (XP, stars, streak, badges)
  app.patch('/api/users/:id/progress', (req: Request, res: Response) => {
    const userId = req.params.id;
    const updates = req.body || {};

    const index = memoryUsers.findIndex(u => u.id === userId);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'المستخدم غير موجود' });
    }

    const current = memoryUsers[index];

    // Monotonic Progress Guarantee: never regress XP, stars, bestStreak, or completed questions
    const newTotalXp = updates.totalXp !== undefined
      ? Math.max(current.totalXp || 0, Number(updates.totalXp) || 0)
      : current.totalXp;

    const newStars = updates.stars !== undefined
      ? Math.max(current.stars || 0, Number(updates.stars) || 0)
      : current.stars;

    const newStreak = updates.streak !== undefined ? Number(updates.streak) || 0 : current.streak;
    const newBestStreak = Math.max(
      current.bestStreak || 0,
      updates.bestStreak !== undefined ? Number(updates.bestStreak) || 0 : 0,
      newStreak
    );

    const mergedCompleted = Array.from(new Set([
      ...(current.completedQuestionIds || []),
      ...(Array.isArray(updates.completedQuestionIds) ? updates.completedQuestionIds : [])
    ]));

    const mergedStats = {
      ...(current.answeredStats || {}),
      ...(updates.answeredStats || {})
    };

    const mergedBadges = Array.from(new Set([
      ...(current.unlockedBadgeIds || []),
      ...(Array.isArray(updates.unlockedBadgeIds) ? updates.unlockedBadgeIds : [])
    ]));

    memoryUsers[index] = {
      ...current,
      displayName: updates.displayName || current.displayName,
      avatar: updates.avatar || current.avatar,
      companionId: updates.companionId || current.companionId,
      totalXp: newTotalXp,
      stars: newStars,
      streak: newStreak,
      bestStreak: newBestStreak,
      completedQuestionIds: mergedCompleted,
      answeredStats: mergedStats,
      unlockedBadgeIds: mergedBadges,
      lastDailyBonusDate: updates.lastDailyBonusDate || current.lastDailyBonusDate,
    };

    persistUsersSync();
    res.json({ success: true, user: memoryUsers[index], allUsers: memoryUsers });
  });

  // DELETE student
  app.delete('/api/users/:id', (req: Request, res: Response) => {
    const userId = req.params.id;
    const target = memoryUsers.find(u => u.id === userId);
    if (!target || target.role === 'admin' || target.username.toLowerCase() === 'admin') {
      return res.status(400).json({ success: false, error: 'لا يمكن حذف حساب المشرف' });
    }

    addDeletedUser(target.id, target.username);
    memoryUsers = memoryUsers.filter(u => u.id !== userId);
    persistUsersSync();

    console.log(`[API] Admin permanently deleted user ${target.username}. Remaining users: ${memoryUsers.length}`);
    res.json({
      success: true,
      allUsers: memoryUsers
    });
  });

  // Mount Vite middleware in dev or static files in production
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (0.0.0.0)`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
