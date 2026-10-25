import React, { useState } from 'react';
import { authService } from '../services/authService';
import { UserAccount } from '../types/math';
import { COMPANIONS } from '../data/characters';
import { sounds } from '../services/soundEffects';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess: (user: UserAccount) => void;
  canDismiss?: boolean;
}

const AVATAR_OPTIONS = ['🌟', '🦊', '🦁', '🚀', '🦉', '👑', '⚡', '🧙‍♂️', '🎯', '🐱'];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  canDismiss = false,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('🌟');
  const [selectedCompanionId, setSelectedCompanionId] = useState('nibbles');

  // UI state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const result = await authService.login(loginIdentifier, loginPassword);
      if (!result.success || !result.user) {
        sounds.playWrong();
        setErrorMsg(result.error || 'فشل تسجيل الدخول');
        setIsLoading(false);
        return;
      }

      sounds.playLevelUp();
      setSuccessMsg(`أهلاً بك مجدداً يا ${result.user.username}! 🎉 Welcome back!`);
      setTimeout(() => {
        setIsLoading(false);
        onSuccess(result.user!);
      }, 700);
    } catch {
      sounds.playWrong();
      setErrorMsg('حدث خطأ أثناء الاتصال بالسيرفر');
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const result = await authService.register({
        username: regUsername,
        email: regEmail,
        password: regPassword,
        avatar: selectedAvatar,
        companionId: selectedCompanionId,
      });

      if (!result.success || !result.user) {
        sounds.playWrong();
        setErrorMsg(result.error || 'فشل إنشاء الحساب');
        setIsLoading(false);
        return;
      }

      sounds.playLevelUp();
      setSuccessMsg(`تم إنشاء حسابك بنجاح على السيرفر! مرحباً بك يا ${result.user.username} في HMH Grade 6! 🚀`);
      setTimeout(() => {
        setIsLoading(false);
        onSuccess(result.user!);
      }, 900);
    } catch {
      sounds.playWrong();
      setErrorMsg('حدث خطأ أثناء الاتصال بالسيرفر');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto overflow-x-hidden animate-fade-in">
      <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl max-w-md sm:max-w-lg w-full overflow-hidden my-auto relative animate-scale-up">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-4 sm:p-6 text-white text-center relative">
          {canDismiss && onClose && (
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
          )}

          <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 shadow-sm">
            🎓 HMH Into Math Grade 6
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            {mode === 'login' ? 'تسجيل الدخول إلى حسابك' : 'إنشاء حساب طالب جديد'}
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm mt-1">
            {mode === 'login'
              ? 'سجّل دخولك لحفظ درجاتك، نقاط XP، وصعود قائمة الأوائل!'
              : 'سجّل باسمك وبريدك الجيميل لبدء المغامرة الرياضية ومنافسة زملائك!'}
          </p>

          {/* Tab Switcher */}
          <div className="mt-5 grid grid-cols-2 p-1 bg-black/20 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                setMode('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              🔑 تسجيل الدخول (Sign In)
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                setMode('register');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              ✨ حساب جديد (Register)
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-bold flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              <div className="flex-1">{errorMsg}</div>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-black flex items-center gap-2">
              <span className="text-lg">🎉</span>
              <div className="flex-1">{successMsg}</div>
            </div>
          )}

          {/* TAB 1: LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                  اسم المستخدم أو الجيميل / Username or Gmail
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. AlexMath or user@gmail.com"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                  <span className="absolute right-3.5 top-3.5 text-slate-400">👤</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                  كلمة المرور / Password
                </label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showLoginPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-black text-sm shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'جاري التحقق من السيرفر...' : 'دخول للعبة (Login & Play)'}</span>
                <span>🚀</span>
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  اسم المستخدم / Username
                </label>
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="مثال: Ahmed_Math أو Jordan"
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  الجيميل أو البريد الإلكتروني / Gmail or Email
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  كلمة المرور / Password
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    minLength={4}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="على الأقل 4 خانات"
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showRegPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Avatar Picker */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  اختر رمز شخصيتك / Choose Avatar
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        setSelectedAvatar(av);
                      }}
                      className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition cursor-pointer ${
                        selectedAvatar === av
                          ? 'bg-amber-100 border-2 border-amber-500 scale-110 shadow-sm'
                          : 'bg-slate-100 border border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Companion Picker */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  اختر رفيقك الذكي / Math Companion
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {COMPANIONS.map((comp) => (
                    <button
                      key={comp.id}
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        setSelectedCompanionId(comp.id);
                      }}
                      className={`p-2 rounded-xl text-left border-2 flex items-center gap-2 transition cursor-pointer ${
                        selectedCompanionId === comp.id
                          ? 'border-indigo-600 bg-indigo-50/80 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span className="text-xl">{comp.avatarSvg}</span>
                      <div className="overflow-hidden">
                        <div className="font-extrabold text-xs text-slate-900 truncate">{comp.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{comp.animal}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-black text-sm shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'جاري إنشاء الحساب على السيرفر...' : 'إنشاء الحساب والبدء (Create Account & Play)'}</span>
                <span>✨</span>
              </button>
            </form>
          )}

          {/* Quick Guest Mode Dismiss Button */}
          {canDismiss && onClose && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  onClose();
                }}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                المتابعة كزائر بدون حفظ الحساب (Continue as Guest)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
