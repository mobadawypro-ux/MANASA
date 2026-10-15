import React, { useState } from 'react';
import { useAuth, SUPER_ADMIN_EMAIL } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  ShieldCheck, 
  Eye, 
  Lock, 
  LogIn, 
  LogOut, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound, 
  Sparkles,
  UserCheck,
  Building2,
  MailCheck
} from 'lucide-react';
import { AcademyLogo } from './AcademyLogo';

export const LoginModal: React.FC = () => {
  const { 
    role, 
    user, 
    isAdmin, 
    isGuest, 
    adminDisplayName, 
    isLoginModalOpen, 
    closeLoginModal, 
    loginWithGoogle, 
    loginWithPasscode,
    loginAsGuest, 
    logout 
  } = useAuth();

  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [errorMsg, setErrorMsg] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [showPasscodeInput, setShowPasscodeInput] = useState(false);

  if (!isLoginModalOpen) return null;

  const handlePasscodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const ok = loginWithPasscode(passcode);
    if (!ok) {
      setErrorMsg('رمز المرور غير صحيح. يرجى إدخال كود المهندس المعتمد (2026) أو استخدام تسجيل الدخول بـ Google.');
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setIsGoogleLoading(true);
    try {
      const res = await loginWithGoogle();
      if (!res.success) {
        setErrorMsg('تعذر تسجيل الدخول عبر Google. يرجى المحاولة مرة أخرى والتأكد من الاتصال.');
      } else if (!res.isAuthorizedAdmin) {
        setErrorMsg(`عذراً، البريد (${res.email}) غير مصرح له بالإدارة. صلاحية الأدمن مخصصة حصرياً للمهندس المعتمد: ${SUPER_ADMIN_EMAIL}. حسابك مفعل كزائر للمعاينة والتصفح فقط.`);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className={`w-full max-w-lg rounded-3xl shadow-2xl border overflow-hidden text-right transition-colors duration-200 ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
      }`}>
        {/* Modal Header */}
        <div className={`p-6 border-b flex items-center justify-between ${
          isLight ? 'bg-gradient-to-r from-amber-50 to-blue-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg">إدارة صلاحيات تسجيل الدخول</h3>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                الشركة الوطنية للأسمنت • إشراف الأكاديمية العربية
              </p>
            </div>
          </div>

          <button
            onClick={closeLoginModal}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-400'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Status Banner */}
        <div className="p-6 space-y-6">
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            isAdmin
              ? isLight
                ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
              : isLight
              ? 'bg-blue-50/80 border-blue-200 text-blue-950'
              : 'bg-blue-950/30 border-blue-500/40 text-blue-200'
          }`}>
            <div className="flex items-center gap-3">
              {isAdmin ? (
                <div className="p-2 rounded-xl bg-amber-500 text-slate-950 shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm">
                  <Eye className="w-5 h-5" />
                </div>
              )}
              <div>
                <span className="text-[11px] font-semibold opacity-75">الصلاحية النشطة الحالية:</span>
                <h4 className="font-black text-sm md:text-base">
                  {isAdmin ? '👑 مسؤول النظام (أدمن) - صلاحيات تعديل كاملة' : '👁️ زائر (وضع المشاهدة والتصفح فقط)'}
                </h4>
                <p className="text-[11px] mt-0.5 opacity-80">
                  {isAdmin
                    ? `المسؤول: ${adminDisplayName}`
                    : 'يمكنك استعراض الشرائح، المقايسة، والصور، ولكن لا يمكنك تعديل البيانات.'}
                </p>
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-600 border border-red-500/30 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                title="تسجيل الخروج والتحويل لزائر"
              >
                <LogOut className="w-3.5 h-3.5" />
                خروج
              </button>
            )}
          </div>

          {/* Section 1: Admin Login Methods */}
          <div className={`p-5 rounded-2xl border space-y-4 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-500" />
                <h4 className="font-bold text-sm">تسجيل الدخول كـ «أدمن» (مخصص وحصري)</h4>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/30 font-bold">
                حساب معتمد
              </span>
            </div>

            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              صلاحيات الإدارة وتعديل الكميات والصور وحفظ التقرير محصورة حصرياً بالبريد الإلكتروني المعتمد للمشروع:
            </p>

            <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
              isLight ? 'bg-amber-50/60 border-amber-200 text-amber-900' : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
            }`}>
              <MailCheck className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-xs font-mono font-bold select-all" dir="ltr">
                {SUPER_ADMIN_EMAIL}
              </span>
            </div>

            {/* Google Sign-in Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs border shadow-sm transition flex items-center justify-center gap-3 cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isGoogleLoading ? 'جاري التحقق والاتصال...' : `تسجيل الدخول بحساب Google (${SUPER_ADMIN_EMAIL})`}</span>
            </button>

            {/* Passcode alternative option */}
            <div className="pt-2 border-t border-slate-700/30">
              {!showPasscodeInput ? (
                <button
                  type="button"
                  onClick={() => setShowPasscodeInput(true)}
                  className="w-full py-2 text-center text-[11px] font-semibold text-amber-500 hover:text-amber-400 cursor-pointer flex items-center justify-center gap-1.5 transition"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>أو تسجيل الدخول السريع برمز مرور المهندس المعتمد (PIN)</span>
                </button>
              ) : (
                <form onSubmit={handlePasscodeLogin} className="space-y-2 pt-1 animate-fadeIn">
                  <label className="block text-[11px] font-bold text-slate-300">
                    رمز مرور الأدمن المعتمد:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="أدخل رمز المرور (مثال: 2026)"
                      className={`flex-1 px-3 py-2 rounded-xl text-xs font-mono font-bold border transition ${
                        isLight
                          ? 'bg-white border-slate-300 text-slate-900 focus:border-amber-500'
                          : 'bg-slate-900 border-slate-700 text-white focus:border-amber-400'
                      }`}
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-sm cursor-pointer"
                    >
                      تفعيل
                    </button>
                  </div>
                </form>
              )}
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2 leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Section 2: Guest / Visitor Mode */}
          <div className={`p-5 rounded-2xl border space-y-3 ${
            isLight ? 'bg-blue-50/50 border-blue-200' : 'bg-slate-950/40 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-500" />
                <h4 className="font-bold text-sm">الدخول كـ «زائر» (مشاهدة وتصفح فقط)</h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/30 font-bold">
                تصفح آمن
              </span>
            </div>

            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              الدخول الفوري بنقرة واحدة لاستعراض التقرير الهندسي، العرض التقديمي، جدول الحصر المجمع، والمخطط الزمني دون إمكانية التعديل.
            </p>

            <button
              onClick={loginAsGuest}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs border transition cursor-pointer flex items-center justify-center gap-2 ${
                isGuest
                  ? 'bg-blue-600 text-white border-blue-700 shadow-md'
                  : isLight
                  ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{isGuest ? 'أنت تتصفح حالياً كزائر ✓' : 'المتابعة كزائر (بدون كلمة سر)'}</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex items-center justify-between text-xs ${
          isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-slate-950/80 border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center gap-2">
            <AcademyLogo size="sm" showText={false} />
            <span>نظام التقارير التنفيذية المعتمد</span>
          </div>

          <button
            onClick={closeLoginModal}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:opacity-80 transition cursor-pointer font-bold"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
