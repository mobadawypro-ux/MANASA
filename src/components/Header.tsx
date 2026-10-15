import React from 'react';
import { ProjectInfo } from '../types/report';
import { User } from 'firebase/auth';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { AcademyLogo } from './AcademyLogo';
import { 
  Building2, 
  Presentation, 
  Table, 
  Calendar, 
  LayoutGrid, 
  Camera, 
  Settings, 
  Printer, 
  TrendingUp,
  HardHat,
  Cloud,
  Sun,
  Moon,
  ShieldCheck,
  Eye,
  Lock,
  Upload,
  Smartphone,
  RefreshCw,
  FolderArchive
} from 'lucide-react';

interface HeaderProps {
  projectInfo: ProjectInfo;
  currentView: 'presentation' | 'boq' | 'timeline' | 'slides_grid' | 'files';
  onChangeView: (view: 'presentation' | 'boq' | 'timeline' | 'slides_grid' | 'files') => void;
  onOpenAddPhoto: () => void;
  onOpenSettings: () => void;
  onOpenPrint: () => void;
  onOpenCloud: () => void;
  onOpenLogoUpload?: () => void;
  onSyncToCloud?: () => void;
  isSyncing?: boolean;
  lastSyncedTime?: string | null;
  user: User | null;
  totalSlides: number;
  totalFiles?: number;
}

export const Header: React.FC<HeaderProps> = ({
  projectInfo,
  currentView,
  onChangeView,
  onOpenAddPhoto,
  onOpenSettings,
  onOpenPrint,
  onOpenCloud,
  onOpenLogoUpload,
  onSyncToCloud,
  isSyncing,
  lastSyncedTime,
  user,
  totalSlides,
  totalFiles = 0
}) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  const { role, isAdmin, isGuest, openLoginModal, adminDisplayName } = useAuth();

  return (
    <header className={`${isLight ? 'bg-white/95 border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl'} backdrop-blur-md border-b sticky top-0 z-40 no-print transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand & Project Name */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 shrink-0">
              <HardHat className="w-6 h-6" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className={`text-sm md:text-base font-black truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {projectInfo.companyName}
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30">
                  {projectInfo.contractNumber}
                </span>
              </div>
              <p className={`text-[11px] truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {projectInfo.subLocation} • الموقف حتى {projectInfo.reportDate}
              </p>
            </div>
          </div>

          {/* Arab Academy Consultant Badge */}
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl border shadow-sm shrink-0 transition ${
            isLight ? 'bg-blue-50/80 border-blue-200/90 text-blue-950' : 'bg-slate-950/90 border-slate-800 text-white'
          }`}>
            <AcademyLogo 
              size="sm" 
              showText={true} 
              customLogoUrl={projectInfo.consultantLogoUrl}
              onClick={isAdmin && onOpenLogoUpload ? onOpenLogoUpload : undefined}
            />
            {isAdmin && onOpenLogoUpload && (
              <button
                onClick={onOpenLogoUpload}
                className="p-1.5 rounded-xl text-amber-500 hover:bg-amber-500/20 bg-amber-500/10 transition cursor-pointer shrink-0"
                title="رفع وتخصيص شعار الأكاديمية (أدمن)"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Navigation Tabs */}
          <nav className={`hidden lg:flex items-center gap-1 p-1 rounded-2xl border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/80 border-slate-800'}`}>
            <button
              onClick={() => onChangeView('presentation')}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'presentation'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Presentation className="w-4 h-4" />
              العرض التقديمي ({totalSlides})
            </button>

            <button
              onClick={() => onChangeView('boq')}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'boq'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Table className="w-4 h-4" />
              جدول المقايسة والتنفيذ
            </button>

            <button
              onClick={() => onChangeView('timeline')}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'timeline'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              المخطط الزمني
            </button>

            <button
              onClick={() => onChangeView('slides_grid')}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'slides_grid'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              كافة الشرائح
            </button>

            <button
              onClick={() => onChangeView('files')}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'files'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FolderArchive className="w-4 h-4" />
              ملفات المشروع ({totalFiles})
            </button>
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            {/* User Role Badge & Switcher Button */}
            <button
              onClick={openLoginModal}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border shadow-sm ${
                isAdmin
                  ? isLight
                    ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-amber-950/40 hover:bg-amber-900/60 border-amber-500/50 text-amber-300'
                  : isLight
                  ? 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-900'
                  : 'bg-blue-950/40 hover:bg-blue-900/60 border-blue-500/50 text-blue-300'
              }`}
              title={isAdmin ? "أنت مسجل كأدمن (صلاحيات تعديل كاملة) - اضغط لتبديل الحساب" : "أنت مسجل كزائر (تصفح فقط) - اضغط لتسجيل الدخول كأدمن"}
            >
              {isAdmin ? (
                <ShieldCheck className="w-4 h-4 text-amber-500" />
              ) : (
                <Eye className="w-4 h-4 text-blue-500" />
              )}
              <span>{isAdmin ? 'أدمن' : 'زائر'}</span>
              <span className="hidden xl:inline text-[10px] opacity-75">
                ({isAdmin ? 'كامل الصلاحيات' : 'تصفح فقط'})
              </span>
            </button>

            {/* Quick completion badge */}
            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 border rounded-xl text-xs font-bold ${isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-300'}`}>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>الإنجاز:</span>
              <span className="text-amber-500 font-mono font-black">%{projectInfo.overallProgress}</span>
            </div>

            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition cursor-pointer border flex items-center gap-1.5 text-xs font-semibold ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-amber-600'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-400'
              }`}
              title={isLight ? 'تفعيل الوضع الليلي (Dark Mode)' : 'تفعيل الوضع النهاري (Light Mode)'}
            >
              {isLight ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
              <span className="hidden xl:inline">{isLight ? 'ليلي' : 'نهاري'}</span>
            </button>

            {/* Cloud Auth & Reports Button (Available for Admin or Login prompt for Guest) */}
            <button
              onClick={isAdmin ? onOpenCloud : openLoginModal}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                user
                  ? isLight
                    ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                    : 'bg-blue-950/60 border-blue-500/40 text-blue-300 hover:bg-blue-900/60'
                  : isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              title="السحابة والمزامنة (Firebase Firestore)"
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'مستخدم'}
                  className="w-4 h-4 rounded-full border border-blue-400"
                />
              ) : (
                <Cloud className="w-4 h-4 text-blue-500" />
              )}
              <span className="hidden sm:inline">
                {user ? user.displayName?.split(' ')[0] || 'حسابي' : 'سحابة Firestore'}
              </span>
            </button>

            {/* Sync / Publish to Mobile Button (Admin only) */}
            {isAdmin && onSyncToCloud && (
              <div className="flex flex-col items-end shrink-0 justify-center">
                <button
                  onClick={onSyncToCloud}
                  disabled={isSyncing}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="مزامنة ونشر كافة التعديلات إلى الجوال وأي جهاز يفتح الرابط فوراً"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">
                    {isSyncing ? 'جاري الحفظ...' : 'حفظ ومزامنة'}
                  </span>
                </button>
                {lastSyncedTime && (
                  <span className="text-[9px] text-emerald-500 font-bold mt-1.5 animate-pulse hidden md:inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    مزامنة تلقائية نشطة ({lastSyncedTime})
                  </span>
                )}
              </div>
            )}

            {/* Add Photo Button (Admin only, or opens login modal for guest) */}
            {isAdmin ? (
              <button
                onClick={onOpenAddPhoto}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition flex items-center gap-1.5 cursor-pointer"
                title="إضافة وتوثيق صور جديدة"
              >
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline">إضافة صور</span>
              </button>
            ) : (
              <button
                onClick={openLoginModal}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer border ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                }`}
                title="تسجيل الدخول كأدمن لإضافة الصور"
              >
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">إضافة صور (مقفل)</span>
              </button>
            )}

            {/* Print / PDF */}
            <button
              onClick={onOpenPrint}
              className={`p-2 rounded-xl transition cursor-pointer border ${isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'}`}
              title="طباعة وتصدير التقرير كـ PDF"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Settings (Admin only, or opens login modal for guest) */}
            <button
              onClick={isAdmin ? onOpenSettings : openLoginModal}
              className={`p-2 rounded-xl transition cursor-pointer border ${isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'}`}
              title={isAdmin ? "إعدادات وبيانات التقرير" : "تسجيل الدخول كأدمن لتعديل بيانات التقرير"}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className={`lg:hidden flex items-center justify-around py-2 border-t text-xs font-bold ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          <button
            onClick={() => onChangeView('presentation')}
            className={`py-1 px-2 rounded-lg transition ${
              currentView === 'presentation'
                ? 'text-amber-500 bg-amber-500/10'
                : isLight ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            العرض التقديمي
          </button>
          <button
            onClick={() => onChangeView('boq')}
            className={`py-1 px-2 rounded-lg transition ${
              currentView === 'boq'
                ? 'text-amber-500 bg-amber-500/10'
                : isLight ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            جدول المقايسة
          </button>
          <button
            onClick={() => onChangeView('timeline')}
            className={`py-1 px-2 rounded-lg transition ${
              currentView === 'timeline'
                ? 'text-amber-500 bg-amber-500/10'
                : isLight ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            المخطط الزمني
          </button>
          <button
            onClick={() => onChangeView('slides_grid')}
            className={`py-1 px-2 rounded-lg transition ${
              currentView === 'slides_grid'
                ? 'text-amber-500 bg-amber-500/10'
                : isLight ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            الشرائح ({totalSlides})
          </button>
          <button
            onClick={() => onChangeView('files')}
            className={`py-1 px-2 rounded-lg transition flex items-center gap-1 ${
              currentView === 'files'
                ? 'text-amber-500 bg-amber-500/10'
                : isLight ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span>الملفات ({totalFiles})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
