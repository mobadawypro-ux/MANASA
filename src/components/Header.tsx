import React from 'react';
import { ProjectInfo } from '../types/report';
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
  HardHat
} from 'lucide-react';

interface HeaderProps {
  projectInfo: ProjectInfo;
  currentView: 'presentation' | 'boq' | 'timeline' | 'slides_grid';
  onChangeView: (view: 'presentation' | 'boq' | 'timeline' | 'slides_grid') => void;
  onOpenAddPhoto: () => void;
  onOpenSettings: () => void;
  onOpenPrint: () => void;
  totalSlides: number;
}

export const Header: React.FC<HeaderProps> = ({
  projectInfo,
  currentView,
  onChangeView,
  onOpenAddPhoto,
  onOpenSettings,
  onOpenPrint,
  totalSlides
}) => {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 shadow-xl no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand & Project Name */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 shrink-0">
              <HardHat className="w-6 h-6" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm md:text-base font-black text-white truncate">
                  {projectInfo.companyName}
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {projectInfo.contractNumber}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {projectInfo.subLocation} • الموقف حتى {projectInfo.reportDate}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => onChangeView('presentation')}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'presentation'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
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
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              كافة الشرائح
            </button>
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            {/* Quick completion badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">الإنجاز:</span>
              <span className="text-amber-400 font-mono font-black">%{projectInfo.overallProgress}</span>
            </div>

            {/* Add Photo Button */}
            <button
              onClick={onOpenAddPhoto}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition flex items-center gap-1.5 cursor-pointer"
              title="إضافة وتوثيق صور جديدة"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">إضافة صور</span>
            </button>

            {/* Print / PDF */}
            <button
              onClick={onOpenPrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
              title="طباعة وتصدير التقرير كـ PDF"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
              title="إعدادات وبيانات التقرير"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-slate-800 text-xs font-bold">
          <button
            onClick={() => onChangeView('presentation')}
            className={`py-1 px-2 rounded-lg transition ${
              currentView === 'presentation' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400'
            }`}
          >
            العرض التقديمي
          </button>
          <button
            onClick={() => onChangeView('boq')}
            className={`py-1 px-2 rounded-lg transition ${
              currentView === 'boq' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400'
            }`}
          >
            جدول المقايسة
          </button>
          <button
            onClick={() => onChangeView('timeline')}
            className={`py-1 px-2 rounded-lg transition ${
              currentView === 'timeline' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400'
            }`}
          >
            المخطط الزمني
          </button>
          <button
            onClick={() => onChangeView('slides_grid')}
            className={`py-1 px-2 rounded-lg transition ${
              currentView === 'slides_grid' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400'
            }`}
          >
            الشرائح ({totalSlides})
          </button>
        </div>
      </div>
    </header>
  );
};
