import React, { useState } from 'react';
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
  FolderArchive,
  Menu,
  X,
  Award,
  Calculator
} from 'lucide-react';

interface SidebarProps {
  projectInfo: ProjectInfo;
  currentView: 'presentation' | 'boq' | 'timeline' | 'slides_grid' | 'files' | 'quantity_survey';
  onChangeView: (view: 'presentation' | 'boq' | 'timeline' | 'slides_grid' | 'files' | 'quantity_survey') => void;
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

export const Sidebar: React.FC<SidebarProps> = ({
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
  
  // Mobile menu open/close drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'presentation', label: `العرض التقديمي (${totalSlides})`, icon: Presentation },
    { id: 'boq', label: 'جدول المقايسة والتنفيذ', icon: Table },
    { id: 'timeline', label: 'المخطط الزمني الشلالي', icon: Calendar },
    { id: 'slides_grid', label: 'كافة الشرائح الميدانية', icon: LayoutGrid },
    { id: 'files', label: `ملفات المشروع (${totalFiles})`, icon: FolderArchive },
    { id: 'quantity_survey', label: 'حصر كميات المشروع', icon: Calculator },
  ] as const;

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-5 text-right">
      {/* Brand Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 border-b pb-4 border-slate-700/30">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 shrink-0">
            <HardHat className="w-6.5 h-6.5" />
          </div>
          <div className="min-w-0">
            <h1 className={`text-base font-black truncate tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {projectInfo.companyName}
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30 mt-1">
              {projectInfo.contractNumber}
            </span>
          </div>
        </div>

        {/* Arab Academy Consultant Branding Section */}
        <div className={`p-3.5 rounded-2xl border shadow-sm transition-all ${
          isLight ? 'bg-blue-50/70 border-blue-200' : 'bg-slate-950/80 border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <AcademyLogo 
              size="md" 
              showText={false} 
              customLogoUrl={projectInfo.consultantLogoUrl}
              onClick={isAdmin && onOpenLogoUpload ? onOpenLogoUpload : undefined}
            />
            <div className="min-w-0 flex-1 leading-tight">
              <span className="text-[10px] text-amber-500 font-extrabold block">استشاري المشروع المعتمد</span>
              <p className={`text-xs font-bold truncate mt-0.5 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                الأكاديمية العربية للعلوم والتكنولوجيا
              </p>
            </div>
            {isAdmin && onOpenLogoUpload && (
              <button
                onClick={onOpenLogoUpload}
                className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-500/20 bg-amber-500/10 transition cursor-pointer"
                title="تخصيص شعار الاستشاري"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Progress & Meta Info Card */}
        <div className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs font-bold ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>مستوى الإنجاز:</span>
            <span className="text-amber-500 font-mono font-black">%{projectInfo.overallProgress}</span>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
            isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-slate-950 border-slate-700 text-slate-400'
          }`}>
            الموقف: {projectInfo.reportDate}
          </span>
        </div>

        {/* Vertical Navigation Menu */}
        <div className="space-y-1 pt-4">
          <span className="text-[10px] text-slate-500 font-extrabold block px-2 pb-1.5 uppercase tracking-wider">
            أقسام لوحة التحكم والتقارير:
          </span>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onChangeView(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-xl font-bold text-xs transition flex items-center gap-3 cursor-pointer border ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md shadow-amber-500/10'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 border-transparent'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border-transparent'
                  }`}
                >
                  <IconComponent className={`w-4.5 h-4.5 ${isActive ? 'text-slate-950' : 'text-amber-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer Controls & Actions */}
      <div className="space-y-3.5 border-t pt-4 border-slate-700/30">
        
        {/* Sync Indicator (Active on all pages for Admin) */}
        {isAdmin && onSyncToCloud && (
          <div className={`p-3 rounded-xl border flex flex-col gap-2 ${
            isLight ? 'bg-emerald-50/50 border-emerald-200' : 'bg-emerald-950/20 border-emerald-500/20'
          }`}>
            <button
              onClick={onSyncToCloud}
              disabled={isSyncing}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'جاري الحفظ والرفع...' : 'حفظ ومزامنة فورية'}</span>
            </button>
            {lastSyncedTime && (
              <span className="text-[9px] text-emerald-500 font-bold self-center flex items-center gap-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                متصل: آخر حفظ بالثانية ({lastSyncedTime})
              </span>
            )}
          </div>
        )}

        {/* User Role & Login Area */}
        <button
          onClick={openLoginModal}
          className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer border shadow-xs ${
            isAdmin
              ? isLight
                ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                : 'bg-amber-950/30 hover:bg-amber-900/40 border-amber-500/40 text-amber-300'
              : isLight
              ? 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-900'
              : 'bg-blue-950/30 hover:bg-blue-900/40 border-blue-500/40 text-blue-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <ShieldCheck className="w-4.5 h-4.5 text-amber-500" />
            ) : (
              <Eye className="w-4.5 h-4.5 text-blue-500" />
            )}
            <div className="text-right">
              <span className="text-[9px] block opacity-75">{isAdmin ? 'صلاحية الأدمن' : 'صلاحية زائر'}</span>
              <span className="text-xs truncate max-w-[120px] block">{isAdmin ? 'المهندس المعتمد' : 'مشاهدة فقط'}</span>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-black/10 dark:bg-black/40">تبديل</span>
        </button>

        {/* Floating Actions Strip */}
        <div className="grid grid-cols-3 gap-2">
          
          {/* Quick Photo Upload */}
          <button
            onClick={isAdmin ? onOpenAddPhoto : openLoginModal}
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
              isAdmin
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20'
                : isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-500'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-400'
            }`}
            title="توثيق صور جديدة"
          >
            <Camera className="w-4 h-4" />
            <span className="text-[9px] font-bold">إضافة صور</span>
          </button>

          {/* Cloud Auth Hub */}
          <button
            onClick={isAdmin ? onOpenCloud : openLoginModal}
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
              user
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20'
                : isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-500'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-400'
            }`}
            title="قاعدة التقارير السحابية"
          >
            <Cloud className="w-4 h-4 text-blue-500" />
            <span className="text-[9px] font-bold">السيرفرات</span>
          </button>

          {/* Report Settings */}
          <button
            onClick={isAdmin ? onOpenSettings : openLoginModal}
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
            title="إعدادات بيانات المشروع"
          >
            <Settings className="w-4 h-4" />
            <span className="text-[9px] font-bold">الإعدادات</span>
          </button>
        </div>

        {/* Theme, Print & Close Row */}
        <div className="flex items-center justify-between gap-2 text-xs">
          
          {/* Light/Dark Toggle */}
          <button
            onClick={toggleTheme}
            className={`flex-1 py-1.5 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-bold cursor-pointer transition ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-amber-600'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-400'
            }`}
          >
            {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            <span>{isLight ? 'ليلي' : 'نهاري'}</span>
          </button>

          {/* Export PDF Print */}
          <button
            onClick={onOpenPrint}
            className={`flex-1 py-1.5 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-bold cursor-pointer transition ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>تصدير PDF</span>
          </button>
        </div>

        {/* Small Academy ICT Logo Attribution */}
        <p className="text-[9px] text-center opacity-70 leading-normal select-none">
          تكنولوجيا المعلومات والاتصالات الأكاديمية البحرية © 2026
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Permanent Side Menu (Sidebar) on Desktop Screens */}
      <aside className={`hidden lg:flex flex-col w-72 md:w-80 h-screen sticky top-0 shrink-0 border-l transition-colors duration-200 select-none z-30 ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-2xl'
      }`}>
        {sidebarContent}
      </aside>

      {/* 2. Sleek Responsive Top Header on Mobile and Tablet Screens */}
      <header className={`lg:hidden no-print transition-colors duration-200 border-b sticky top-0 z-40 select-none ${
        isLight ? 'bg-white/95 border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-md'
      }`}>
        <div className="px-4 h-16 flex items-center justify-between gap-3">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 rounded-lg border border-slate-700/30 hover:bg-slate-500/10 cursor-pointer"
            >
              <Menu className="w-5 h-5 text-amber-500" />
            </button>
            <div className="min-w-0 leading-tight">
              <h1 className="text-xs font-black truncate">{projectInfo.companyName}</h1>
              <p className="text-[10px] text-slate-400 truncate">الموقف الهندسي حتى {projectInfo.reportDate}</p>
            </div>
          </div>

          {/* Core Navigation view name */}
          <span className="text-xs px-2.5 py-1 bg-amber-500/10 text-amber-500 font-extrabold border border-amber-500/30 rounded-xl">
            {currentView === 'presentation'
              ? 'العرض التقديمي'
              : currentView === 'boq'
              ? 'جدول المقايسة'
              : currentView === 'timeline'
              ? 'المخطط الزمني'
              : currentView === 'slides_grid'
              ? 'الشرائح الميدانية'
              : currentView === 'files'
              ? 'ملفات المشروع'
              : 'حصر كميات المشروع'}
          </span>

          {/* Quick sync or login indicator for mobile */}
          <div className="flex items-center gap-1.5">
            {isAdmin && onSyncToCloud ? (
              <button
                onClick={onSyncToCloud}
                disabled={isSyncing}
                className="p-2 rounded-xl bg-emerald-600 text-white cursor-pointer shadow disabled:opacity-50"
                title="مزامنة فورية للجوال"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              </button>
            ) : (
              <button
                onClick={openLoginModal}
                className={`p-2 rounded-xl border text-xs font-bold cursor-pointer ${
                  isLight ? 'bg-slate-100 border-slate-200 text-blue-700' : 'bg-slate-800 border-slate-700 text-blue-300'
                }`}
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Horizontal Quick Navigation Strip (Direct access below each other / Side of thumbs) */}
        <div className="flex items-center justify-around py-2 border-t text-[11px] font-black overflow-x-auto scrollbar-none whitespace-nowrap px-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`py-1 px-3.5 rounded-xl transition ${
                  isActive
                    ? 'text-amber-500 bg-amber-500/10 border border-amber-500/20 font-black'
                    : isLight ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                {item.id === 'presentation'
                  ? 'العرض'
                  : item.id === 'boq'
                  ? 'المقايسة'
                  : item.id === 'timeline'
                  ? 'المخطط'
                  : item.id === 'slides_grid'
                  ? 'الشرائح'
                  : item.id === 'files'
                  ? 'الملفات'
                  : 'الحصر'}
              </button>
            );
          })}
        </div>
      </header>

      {/* 3. Slide-out Navigation Drawer on Mobile (Arabic RTL, sliding from the right) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end no-print lg:hidden animate-fadeIn">
          {/* Backdrop Overlay */}
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Drawer sidebar panel */}
          <div className={`relative w-80 max-w-full h-full shadow-2xl flex flex-col justify-between border-r select-none animate-slideInRight ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
          }`}>
            {/* Close Button inside Drawer */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:opacity-85 border border-slate-700/20"
            >
              <X className="w-5 h-5" />
            </button>

            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
