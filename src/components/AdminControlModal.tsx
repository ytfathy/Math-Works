import React, { useState, useEffect } from 'react';
import { UserAccount } from '../types/math';
import { authService } from '../services/authService';
import { sounds } from '../services/soundEffects';

interface AdminControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUsersUpdated?: () => void;
}

export const AdminControlModal: React.FC<AdminControlModalProps> = ({
  isOpen,
  onClose,
  onUsersUpdated,
}) => {
  const [users, setUsers] = useState<UserAccount[]>(() => authService.getUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-subscribe and auto-fetch fresh users from server when opened
  useEffect(() => {
    const unsub = authService.subscribe((fresh) => {
      setUsers(fresh);
    });
    if (isOpen) {
      reloadUsers();
    }
    return unsub;
  }, [isOpen]);

  if (!isOpen) return null;

  const reloadUsers = async () => {
    setIsLoading(true);
    try {
      const freshUsers = await authService.fetchUsersFromServer();
      setUsers(freshUsers);
      if (onUsersUpdated) onUsersUpdated();
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleLevels = async (userId: string, currentStatus: boolean, username: string) => {
    sounds.playPop();
    const updated = await authService.setUserAllLevelsPermission(userId, !currentStatus);
    if (updated) {
      await reloadUsers();
      const statusText = !currentStatus 
        ? `تم فتح جميع المستويات (All Levels Unlocked) للطالب ${username}! 🔓`
        : `تم تقييد الطالب ${username} للمستوى الأول فقط (Level 1 Only) 🔒`;
      setNotification(statusText);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleUnlockAll = async () => {
    sounds.playLevelUp();
    setIsLoading(true);
    for (const u of users) {
      if (u.role !== 'admin') {
        await authService.setUserAllLevelsPermission(u.id, true);
      }
    }
    await reloadUsers();
    setNotification('تم فتح جميع المستويات لجميع الطلاب على السيرفر دفعة واحدة! 🚀');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLockAll = async () => {
    sounds.playPop();
    setIsLoading(true);
    for (const u of users) {
      if (u.role !== 'admin') {
        await authService.setUserAllLevelsPermission(u.id, false);
      }
    }
    await reloadUsers();
    setNotification('تم تقييد جميع الطلاب للمستوى الأول فقط على السيرفر! 🔒');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (confirm(`هل أنت متأكد من حذف حساب الطالب "${username}" نهائياً من السيرفر؟`)) {
      sounds.playPop();
      await authService.deleteStudent(userId);
      await reloadUsers();
      setNotification(`تم حذف حساب ${username} بنجاح.`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const studentCount = users.filter(u => u.role !== 'admin').length;
  const unlockedAllCount = users.filter(u => u.role !== 'admin' && u.unlockedAllLevels).length;
  const level1OnlyCount = studentCount - unlockedAllCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto overflow-x-hidden animate-fade-in">
      <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-2xl max-w-4xl w-full overflow-hidden my-auto relative">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 p-5 sm:p-6 text-white relative">
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-lg transition cursor-pointer"
            title="إغلاق / Close"
          >
            ✕
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-2xl">🛡️</span>
            <span className="text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-3 py-1 rounded-full shadow-sm">
              Admin Control Panel • تحكم المشرف العام
            </span>
            <span className="text-[11px] font-black text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              سيرفر مركزي متصل (Server Sync Active)
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            إدارة الحسابات وصلاحيات المستويات
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            يتم تخزين كل الحسابات على السيرفر المركزي تلقائياً، وتظهر لك هنا كل الحسابات التي سُجلت من أي جهاز لابتوب أو آيباد أو هاتف.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-5 pt-4 border-t border-white/10">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
              <div className="text-xs text-slate-300 font-bold">إجمالي الطلاب</div>
              <div className="text-xl sm:text-2xl font-black text-white mt-0.5">{studentCount}</div>
            </div>
            <div className="bg-emerald-500/20 backdrop-blur-md p-3 rounded-2xl border border-emerald-400/30 text-center">
              <div className="text-xs text-emerald-300 font-bold">جميع المستويات 🔓</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-300 mt-0.5">{unlockedAllCount}</div>
            </div>
            <div className="bg-amber-500/20 backdrop-blur-md p-3 rounded-2xl border border-amber-400/30 text-center">
              <div className="text-xs text-amber-300 font-bold">مستوى 1 فقط 🔒</div>
              <div className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5">{level1OnlyCount}</div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Notification Toast */}
          {notification && (
            <div className="p-3 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-emerald-900 text-xs sm:text-sm font-black flex items-center gap-2 animate-bounce">
              <span>✨</span>
              <div>{notification}</div>
            </div>
          )}

          {/* Search Bar & Mass Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم الطالب أو الجيميل..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />
              <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={reloadUsers}
                disabled={isLoading}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl border border-slate-300 transition cursor-pointer flex items-center gap-1.5"
                title="جلب أحدث الحسابات المسجلة من السيرفر"
              >
                <span>{isLoading ? '⏳' : '🔄'}</span>
                <span>تحديث القائمة</span>
              </button>
              <button
                type="button"
                onClick={handleUnlockAll}
                disabled={isLoading}
                className="flex-1 sm:flex-none px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-60"
              >
                🔓 فتح الكل للجميع
              </button>
              <button
                type="button"
                onClick={handleLockAll}
                disabled={isLoading}
                className="flex-1 sm:flex-none px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold text-xs rounded-xl transition cursor-pointer disabled:opacity-60"
              >
                🔒 قفل للجميع (Lvl 1)
              </button>
            </div>
          </div>

          {/* Users List */}
          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm font-bold">
                {isLoading ? 'جاري جلب الحسابات من السيرفر...' : 'لا يوجد طلاب مطابقين للبحث.'}
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isAdmin = user.role === 'admin' || user.username.toLowerCase() === 'admin';
                const hasAllLevels = Boolean(user.unlockedAllLevels || isAdmin);

                return (
                  <div
                    key={user.id}
                    className={`p-3.5 sm:p-4 rounded-2xl border-2 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isAdmin
                        ? 'bg-indigo-50/70 border-indigo-200'
                        : hasAllLevels
                        ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* User Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-2xl flex-shrink-0">
                        {user.avatar || '🌟'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm sm:text-base text-slate-900 truncate">
                            {user.username}
                          </span>
                          {isAdmin ? (
                            <span className="text-[10px] bg-indigo-600 text-white font-black px-2 py-0.5 rounded-md uppercase">
                              المشرف العام (ADMIN)
                            </span>
                          ) : (
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                                hasAllLevels
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              {hasAllLevels ? '🔓 جميع المستويات' : '🔒 مستوى 1 فقط'}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 font-mono truncate">
                          {user.email} • {user.totalXp} XP • ⭐ {user.stars}
                        </div>
                      </div>
                    </div>

                    {/* Permissions Actions */}
                    <div className="flex items-center gap-2 justify-end flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      {isAdmin ? (
                        <span className="text-xs font-bold text-indigo-700 bg-white px-3 py-1.5 rounded-xl border border-indigo-200">
                          صلاحية كاملة دائمة 👑
                        </span>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleToggleLevels(user.id, Boolean(user.unlockedAllLevels), user.username)}
                            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                              user.unlockedAllLevels
                                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                            }`}
                          >
                            <span>{user.unlockedAllLevels ? '🔒 قفل للمستوى 1' : '🔓 فتح كل المستويات'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user.id, user.username)}
                            className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                            title="حذف حساب الطالب نهائياً من السيرفر"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-500">
            حساب الأدمن المركزي: <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800">admin</code> / <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800">123456789</code>
          </span>
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
