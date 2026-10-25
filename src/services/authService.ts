import { UserAccount } from '../types/math';

const USERS_STORAGE_KEY = 'hmh_users_db_shared_v3';
const CURRENT_USER_ID_KEY = 'hmh_current_user_id_v3';

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

type UsersChangeListener = (users: UserAccount[]) => void;
const listeners = new Set<UsersChangeListener>();

export const authService = {
  // Subscribe to changes in the users list
  subscribe(listener: UsersChangeListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  notifyListeners(users: UserAccount[]): void {
    listeners.forEach(fn => {
      try {
        fn(users);
      } catch (err) {
        console.error('Error notifying user listener:', err);
      }
    });
  },

  // Synchronous read from local cache
  getUsers(): UserAccount[] {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      let users: UserAccount[] = stored ? JSON.parse(stored) : [];

      if (!users || !Array.isArray(users) || users.length === 0) {
        users = [DEFAULT_ADMIN];
      }

      const adminIdx = users.findIndex(
        u => u.username.toLowerCase() === 'admin' || u.role === 'admin'
      );
      if (adminIdx === -1) {
        users.unshift(DEFAULT_ADMIN);
      } else {
        users[adminIdx].password = '123456789';
        users[adminIdx].isAdmin = true;
        users[adminIdx].role = 'admin';
        users[adminIdx].unlockedAllLevels = true;
      }

      return users;
    } catch {
      return [DEFAULT_ADMIN];
    }
  },

  saveLocalUsers(users: UserAccount[]): void {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      this.notifyListeners(users);
    } catch (err) {
      console.error('Error caching users locally:', err);
    }
  },

  getCurrentUserId(): string | null {
    return localStorage.getItem(CURRENT_USER_ID_KEY);
  },

  getCurrentUser(): UserAccount | null {
    const userId = this.getCurrentUserId();
    if (!userId) return null;
    const users = this.getUsers();
    return users.find(u => u.id === userId) || null;
  },

  setCurrentUser(userId: string | null): void {
    if (userId) {
      localStorage.setItem(CURRENT_USER_ID_KEY, userId);
    } else {
      localStorage.removeItem(CURRENT_USER_ID_KEY);
    }
  },

  // Asynchronously fetch all users from centralized server
  async fetchUsersFromServer(): Promise<UserAccount[]> {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.users)) {
          this.saveLocalUsers(data.users);
          return data.users;
        }
      }
    } catch (err) {
      console.warn('Backend server not reachable yet, using local cache:', err);
    }
    return this.getUsers();
  },

  // Register on centralized server
  async register(data: {
    username: string;
    email: string;
    password: string;
    avatar?: string;
    companionId?: string;
  }): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    const trimmedUsername = data.username.trim();
    const trimmedEmail = data.email.trim().toLowerCase();
    const trimmedPassword = data.password.trim();

    if (!trimmedUsername || trimmedUsername.length < 3) {
      return { success: false, error: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' };
    }
    if (trimmedUsername.toLowerCase() === 'admin' || trimmedUsername === 'ادمن') {
      return { success: false, error: 'اسم المستخدم "admin" محجوز للمشرف العام فقط' };
    }

    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: trimmedUsername,
          email: trimmedEmail,
          password: trimmedPassword,
          avatar: data.avatar || '🌟',
          companionId: data.companionId || 'nibbles',
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        return { success: false, error: json.error || 'فشل إنشاء الحساب على السيرفر' };
      }

      const newUser: UserAccount = json.user;

      // Update with full list of users returned from server
      if (Array.isArray(json.allUsers)) {
        this.saveLocalUsers(json.allUsers);
      } else {
        const currentUsers = this.getUsers();
        const updated = [...currentUsers.filter(u => u.id !== newUser.id), newUser];
        this.saveLocalUsers(updated);
      }

      this.setCurrentUser(newUser.id);
      return { success: true, user: newUser };
    } catch {
      // Local fallback if server is momentarily offline
      const currentUsers = this.getUsers();
      if (currentUsers.some(u => u.username.toLowerCase() === trimmedUsername.toLowerCase())) {
        return { success: false, error: 'اسم المستخدم مسجل بالفعل' };
      }
      const newUser: UserAccount = {
        id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        username: trimmedUsername,
        email: trimmedEmail,
        password: trimmedPassword,
        displayName: trimmedUsername,
        avatar: data.avatar || '🌟',
        companionId: data.companionId || 'nibbles',
        role: 'student',
        isAdmin: false,
        unlockedAllLevels: false,
        createdAt: Date.now(),
        totalXp: 100,
        stars: 2,
        streak: 0,
        bestStreak: 0,
        completedQuestionIds: [],
        answeredStats: {},
        unlockedBadgeIds: ['first_step'],
      };
      this.saveLocalUsers([...currentUsers, newUser]);
      this.setCurrentUser(newUser.id);
      return { success: true, user: newUser };
    }
  },

  // Login on centralized server
  async login(
    identifier: string,
    password: string
  ): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    const trimmedId = identifier.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Fast-path Admin login
    if (
      (trimmedId === 'admin' || trimmedId === 'ادمن' || trimmedId === 'admin@hmhmath.com') &&
      trimmedPassword === '123456789'
    ) {
      this.setCurrentUser(DEFAULT_ADMIN.id);
      // Fetch fresh users in background
      this.fetchUsersFromServer().catch(() => {});
      return { success: true, user: DEFAULT_ADMIN };
    }

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: trimmedId, password: trimmedPassword }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        return { success: false, error: json.error || 'الحساب غير موجود أو كلمة المرور غير صحيحة' };
      }

      const user: UserAccount = json.user;

      if (Array.isArray(json.allUsers)) {
        this.saveLocalUsers(json.allUsers);
      } else {
        const currentUsers = this.getUsers();
        const updated = [...currentUsers.filter(u => u.id !== user.id), user];
        this.saveLocalUsers(updated);
      }

      this.setCurrentUser(user.id);
      return { success: true, user };
    } catch {
      // Offline fallback
      const currentUsers = this.getUsers();
      const found = currentUsers.find(
        u => u.username.toLowerCase() === trimmedId || u.email.toLowerCase() === trimmedId
      );
      if (!found) {
        return { success: false, error: 'الحساب غير موجود! تأكد من كتابة الاسم وكلمة المرور' };
      }
      if (found.password !== trimmedPassword) {
        return { success: false, error: 'كلمة المرور غير صحيحة' };
      }
      this.setCurrentUser(found.id);
      return { success: true, user: found };
    }
  },

  logout(): void {
    this.setCurrentUser(null);
  },

  // Update user stats & send to server
  async updateUserData(userId: string, updates: Partial<UserAccount>): Promise<UserAccount | null> {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) return null;

    const updatedUser = { ...users[index], ...updates };
    users[index] = updatedUser;
    this.saveLocalUsers(users);

    // Sync to centralized server in background
    try {
      fetch(`/api/users/${userId}/progress`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }).catch(() => {});
    } catch {
      // ignore
    }

    return updatedUser;
  },

  // Admin toggles level permission on server
  async setUserAllLevelsPermission(userId: string, allowAll: boolean): Promise<UserAccount | null> {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index].unlockedAllLevels = allowAll;
      this.saveLocalUsers(users);
    }

    try {
      const res = await fetch(`/api/users/${userId}/permission`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unlockedAllLevels: allowAll }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          if (Array.isArray(json.allUsers)) {
            this.saveLocalUsers(json.allUsers);
          } else if (json.user) {
            const fresh = this.getUsers().map(u => u.id === userId ? json.user : u);
            this.saveLocalUsers(fresh);
          }
          return json.user || users[index];
        }
      }
    } catch (err) {
      console.warn('Could not sync permission to server, saved locally:', err);
    }

    return index !== -1 ? users[index] : null;
  },

  // Delete student on server
  async deleteStudent(userId: string): Promise<boolean> {
    const users = this.getUsers().filter(u => u.id !== userId);
    this.saveLocalUsers(users);

    try {
      const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.allUsers)) {
          this.saveLocalUsers(json.allUsers);
        }
      }
      return true;
    } catch {
      return true;
    }
  }
};
