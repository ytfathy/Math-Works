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
  }
];

// In-memory master database (Single source of truth during process lifetime)
let memoryUsers: UserAccount[] = [];

// Initialize memory database from disk safely
function initUsersDatabase(): void {
  let loaded: UserAccount[] | null = null;

  // Try primary DB file
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf8').trim();
      if (content.length > 0) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loaded = parsed;
        }
      }
    } catch (err) {
      console.error('[DB] Error parsing primary DB file, attempting backup...', err);
    }
  }

  // Try backup file if primary failed or was empty
  if (!loaded && fs.existsSync(BACKUP_FILE)) {
    try {
      const content = fs.readFileSync(BACKUP_FILE, 'utf8').trim();
      if (content.length > 0) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loaded = parsed;
          console.log('[DB] Successfully restored users from backup file.');
        }
      }
    } catch (err) {
      console.error('[DB] Error parsing backup DB file:', err);
    }
  }

  // Fallback to default students only if no existing file at all
  if (!loaded || loaded.length === 0) {
    loaded = [...DEFAULT_STUDENTS];
  }

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
  persistUsersAtomic();
  console.log(`[DB] Database initialized with ${memoryUsers.length} user accounts.`);
}

// Sequential write queue to guarantee atomic, corruption-proof file writes
let writeQueue = Promise.resolve();

function persistUsersAtomic(): void {
  writeQueue = writeQueue.then(async () => {
    try {
      const jsonString = JSON.stringify(memoryUsers, null, 2);
      const tempPath = `${DB_FILE}.${Date.now()}.${Math.random().toString(36).substring(2, 6)}.tmp`;

      // 1. Write completely to temp file
      await fs.promises.writeFile(tempPath, jsonString, 'utf8');

      // 2. Atomic rename in POSIX replaces file without truncation window
      await fs.promises.rename(tempPath, DB_FILE);

      // 3. Keep a safety backup
      await fs.promises.writeFile(BACKUP_FILE, jsonString, 'utf8').catch(() => {});
    } catch (err) {
      console.error('[DB] Error atomically persisting users to disk:', err);
    }
  });
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

    memoryUsers.push(newUser);
    persistUsersAtomic();

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
      (trimmedId === 'admin' || trimmedId === 'ادمن' || trimmedId === 'admin@hmhmath.com') &&
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
      u => u.username.toLowerCase() === trimmedId || u.email.toLowerCase() === trimmedId
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
    persistUsersAtomic();

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

    memoryUsers[index] = {
      ...memoryUsers[index],
      totalXp: updates.totalXp !== undefined ? updates.totalXp : memoryUsers[index].totalXp,
      stars: updates.stars !== undefined ? updates.stars : memoryUsers[index].stars,
      streak: updates.streak !== undefined ? updates.streak : memoryUsers[index].streak,
      bestStreak: updates.bestStreak !== undefined ? updates.bestStreak : memoryUsers[index].bestStreak,
      completedQuestionIds: updates.completedQuestionIds || memoryUsers[index].completedQuestionIds,
      answeredStats: updates.answeredStats || memoryUsers[index].answeredStats,
      unlockedBadgeIds: updates.unlockedBadgeIds || memoryUsers[index].unlockedBadgeIds,
      avatar: updates.avatar || memoryUsers[index].avatar,
      companionId: updates.companionId || memoryUsers[index].companionId,
    };

    persistUsersAtomic();
    res.json({ success: true, user: memoryUsers[index] });
  });

  // DELETE student
  app.delete('/api/users/:id', (req: Request, res: Response) => {
    const userId = req.params.id;
    const target = memoryUsers.find(u => u.id === userId);
    if (!target || target.role === 'admin' || target.username.toLowerCase() === 'admin') {
      return res.status(400).json({ success: false, error: 'لا يمكن حذف حساب المشرف' });
    }

    memoryUsers = memoryUsers.filter(u => u.id !== userId);
    persistUsersAtomic();

    console.log(`[API] Deleted user ${target.username}. Remaining users: ${memoryUsers.length}`);
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
