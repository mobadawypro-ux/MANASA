import React, { useState } from 'react';
import { ReportSlide, ProjectInfo, BoqItem, ScheduleItem, SlideImage, PROJECT_FACILITIES } from '../types/report';
import { SlideHeader } from './SlideHeader';
import { AcademyLogo } from './AcademyLogo';
import { useTheme } from '../context/ThemeContext';
import { getFacilityStyle } from '../data/facilityColors';
import { 
  Building2, 
  Calendar, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  HardHat, 
  Layers, 
  ZoomIn, 
  Plus, 
  Trash2, 
  Edit,
  Award,
  ShieldCheck,
  Warehouse,
  Droplets,
  Wrench,
  MapPin,
  Edit2,
  Zap
} from 'lucide-react';

interface SlideRendererProps {
  slide: ReportSlide;
  projectInfo: ProjectInfo;
  boqItems: BoqItem[];
  scheduleItems: ScheduleItem[];
  onOpenLightbox?: (images: SlideImage[], index: number) => void;
  onOpenAddPhoto?: (slideId: string) => void;
  onEditImage?: (slideId: string, image: SlideImage) => void;
  onDeleteImage?: (slideId: string, imageId: string) => void;
  onUpdateSlideFacility?: (slideId: string, facility: string) => void;
  isEditable?: boolean;
  isPrintMode?: boolean;
  customTitle?: string;
  customSubTitle?: string;
  scheduleItemsSubset?: ScheduleItem[];
  boqItemsSubset?: BoqItem[];
  pageIndicatorText?: string;
  isLastBoqPage?: boolean;
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({
  slide,
  projectInfo,
  boqItems,
  scheduleItems,
  onOpenLightbox,
  onOpenAddPhoto,
  onEditImage,
  onDeleteImage,
  onUpdateSlideFacility,
  isEditable = false,
  isPrintMode = false,
  customTitle,
  customSubTitle,
  scheduleItemsSubset,
  boqItemsSubset,
  pageIndicatorText,
  isLastBoqPage = false
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const facilityStyle = getFacilityStyle(slide.facility, isLight);
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'today' | 'shakayer' | 'equipment_wash'>('all');

  // Slide 1: Cover
  if (slide.type === 'cover') {
    return (
      <div className={`w-full h-full min-h-[520px] flex flex-col justify-between p-6 md:p-8 relative overflow-hidden rounded-2xl border transition-colors duration-200 ${
        isLight
          ? 'bg-gradient-to-br from-slate-50 via-white to-blue-50/80 border-slate-200 text-slate-900 shadow-xl'
          : 'bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/80 border-slate-800 text-white shadow-2xl'
      }`}>
        {/* Subtle Industrial Background Graphic */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header */}
        <SlideHeader projectInfo={projectInfo} themeStyle="classic" />

        {/* Center Main Presentation Title */}
        <div className="my-auto py-4 text-center space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0C2340] border border-amber-500/30 text-amber-300 text-xs md:text-sm font-bold shadow-sm">
            <HardHat className="w-4 h-4 text-amber-400" />
            تقرير المتابعة الفنية والإشراف الهندسي الميداني للمشروع
          </div>

          <div className="max-w-4xl mx-auto p-6 md:p-8 bg-[#0C2340] border-2 border-amber-500/30 rounded-2xl shadow-xl backdrop-blur-md">
            <h1 className="text-xl md:text-3xl lg:text-4xl font-black text-white leading-relaxed tracking-wide drop-shadow-sm">
              {slide.title || projectInfo.projectTitle}
            </h1>
          </div>

          {/* Dedicated Prestigious Arab Academy Consultant Banner */}
          <div className={`max-w-3xl mx-auto p-4 rounded-xl border shadow-lg flex items-center justify-between gap-4 ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#091B30] border-amber-500/30'
          }`}>
            <AcademyLogo size="md" showText={true} customLogoUrl={projectInfo.consultantLogoUrl} />
            <div className={`hidden sm:flex flex-col text-left shrink-0 border-r pr-4 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              <span className="text-xs text-amber-400 font-extrabold">الجهة الاستشارية المُعتمدة</span>
              <span className={`text-[10px] font-semibold ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>تقرير المتابعة الفنية والإشراف</span>
            </div>
          </div>

          <p className={`text-xs md:text-sm font-semibold max-w-2xl mx-auto ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            المقاول العام: {projectInfo.contractor} • {projectInfo.contractNumber}
          </p>
        </div>

        {/* Bottom Details Footer */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t text-xs relative z-10 ${
          isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-500" />
            <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{projectInfo.companyName}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-lg border font-mono ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}>
              تاريخ الموقف: {projectInfo.reportDate}
            </span>
            <span className="px-3 py-1 bg-[#0C2340] text-amber-300 font-black rounded-lg border border-amber-500/30 shadow-xs">
              نسبة التنفيذ: {projectInfo.overallProgress}%
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Slide 2: Project Timing and Duration (توقيت بدء المشروع ومدة التنفيذ)
  if (slide.type === 'summary') {
    return (
      <div className={`w-full h-full min-h-[520px] flex flex-col justify-between p-6 md:p-8 rounded-2xl border transition-colors duration-200 shadow-2xl relative overflow-hidden ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
      }`}>
        <SlideHeader projectInfo={projectInfo} currentSlideTitle={projectInfo.projectTitle} />

        <div className="my-auto py-4 max-w-4xl mx-auto w-full space-y-5">
          {/* Card 1: Start Timing */}
          <div className="space-y-2">
            <div className="inline-block bg-[#0C2340] text-amber-300 font-extrabold text-xs md:text-sm px-5 py-1.5 rounded-lg border border-amber-500/30 shadow-sm">
              توقيت بدء المشروع
            </div>
            <div className="p-4 md:p-5 bg-[#0F2847] text-white font-bold text-base md:text-lg rounded-xl shadow-md border border-white/10 flex items-center justify-center gap-4 text-center">
              <Calendar className="w-6 h-6 text-amber-400 shrink-0" />
              <span>
                تم تسليم الموقع و بدء العمل إعتباراً من{' '}
                <span className="text-amber-300 font-mono font-black">{projectInfo.handoverDate || '2026/8/1'}</span>
              </span>
            </div>
          </div>

          {/* Card 2: Duration */}
          <div className="space-y-2">
            <div className="inline-block bg-[#0C2340] text-amber-300 font-extrabold text-xs md:text-sm px-5 py-1.5 rounded-lg border border-amber-500/30 shadow-sm">
              مدة تنفيذ المشروع
            </div>
            <div className="p-4 md:p-5 bg-[#0F2847] text-white font-bold text-base md:text-lg rounded-xl shadow-md border border-white/10 flex items-center justify-center gap-4 text-center">
              <Clock className="w-6 h-6 text-amber-400 shrink-0" />
              <span>
                مدة تنفيذ المشروع طبقاً لأمر الإسناد ({projectInfo.durationMonths}) شهور مخطط حتى{' '}
                <span className="text-amber-300 font-mono font-black">{projectInfo.plannedEndDate || '2026/12/31'}</span>
              </span>
            </div>
          </div>

          {/* Stakeholders & Highlights (including Arab Academy) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div className={`p-3 border rounded-xl text-center ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'}`}>
              <span className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>الجهة المالكة</span>
              <p className={`text-xs font-bold mt-1 ${isLight ? 'text-slate-800' : 'text-white'}`}>{projectInfo.companyName}</p>
            </div>

            <div className={`p-3 border rounded-xl text-center ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'}`}>
              <span className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>الجهة المنفذة (المقاول)</span>
              <p className={`text-xs font-bold mt-1 ${isLight ? 'text-slate-800' : 'text-white'}`}>{projectInfo.contractor}</p>
            </div>

            {/* Arab Academy Card */}
            <div className={`p-3 border rounded-xl text-center flex flex-col items-center justify-between shadow-xs ${
              isLight ? 'bg-blue-50/70 border-blue-200' : 'bg-[#091B30] border-amber-500/30'
            }`}>
              <span className="text-[11px] text-amber-500 font-black">إعداد التقرير / الاستشاري المعتمد</span>
              <div className="my-1.5 flex items-center justify-center">
                <AcademyLogo size="md" showText={false} customLogoUrl={projectInfo.consultantLogoUrl} />
              </div>
              <p className={`text-xs font-bold line-clamp-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                الأكاديمية العربية للعلوم والتكنولوجيا
              </p>
            </div>

            <div className={`p-3 border rounded-xl text-center ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'}`}>
              <span className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>أمر الإسناد والإنجاز</span>
              <p className="text-xs font-bold text-amber-500 mt-1">{projectInfo.contractNumber}</p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-black">نسبة التنفيذ: {projectInfo.overallProgress}%</span>
            </div>
          </div>
        </div>

        <div className={`pt-2 text-center text-xs ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
          الشريحة 2 من 20 • تقرير الموقف التنفيذي الرسمي
        </div>
      </div>
    );
  }

  // Slide 3: Timeline Gantt Matrix (المخطط الزمني الشلالي المعتمد المدمج)
  if (slide.type === 'timeline') {
    const isItemActiveToday = (item: ScheduleItem) => {
      const repDate = projectInfo.reportDate || '2026/10/15';
      const parseD = (s?: string) => {
        if (!s) return null;
        const parts = s.trim().replace(/-/g, '/').split('/');
        if (parts.length === 3) {
          const y = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10) - 1;
          const d = parseInt(parts[2], 10);
          if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
            return new Date(y, m, d);
          }
        }
        const d = new Date(s);
        return isNaN(d.getTime()) ? null : d;
      };
      const t = parseD(repDate);
      const start = parseD(item.startDate);
      const end = parseD(item.endDate);
      if (!t || !start || !end) return false;
      const targetTime = new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime();
      const startTime = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
      const endTime = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
      return targetTime >= startTime && targetTime <= endTime;
    };

    const todayTimelineItems = scheduleItems.filter(isItemActiveToday);

    const filteredTimelineItems = scheduleItemsSubset
      ? scheduleItemsSubset
      : scheduleItems.filter((item) => {
          if (timelineFilter === 'today') {
            return isItemActiveToday(item);
          }
          const f = item.facility || '';
          if (timelineFilter === 'shakayer') {
            return f.includes('الشكاير') || f.includes('هنجر (1-2)');
          }
          if (timelineFilter === 'equipment_wash') {
            return f.includes('المعدات') || f.includes('المغسلة');
          }
          return true;
        });

    const shakayerCount = scheduleItems.filter(i => (i.facility || '').includes('الشكاير') || (i.facility || '').includes('هنجر (1-2)')).length;
    const eqWashCount = scheduleItems.filter(i => (i.facility || '').includes('المعدات') || (i.facility || '').includes('المغسلة')).length;

    return (
      <div className={`w-full h-full min-h-[520px] flex flex-col justify-between p-3 md:p-5 rounded-2xl border transition-colors duration-200 shadow-2xl ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
      }`}>
        <SlideHeader 
          projectInfo={projectInfo} 
          currentSlideTitle={customTitle || "البرنامج الزمني الموحد المعتمد لكافة مناطق المشروع (هناجر الشكاير + المعدات + المغسلة)"} 
        />

        <div className="my-auto py-1">
          {/* Subheader Banner & Facility Filter Controls */}
          {isPrintMode ? (
            <div className="text-xs font-bold mb-2 flex items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-black bg-blue-600 text-white shadow-xs">
                  {customSubTitle || `البرنامج الزمني المعتمد (${filteredTimelineItems.length} بند)`}
                </span>
                <span className="text-[11px] font-bold text-amber-500 font-mono">
                  {filteredTimelineItems.length} بند عمل معتمد
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className={isLight ? 'text-blue-900 font-bold' : 'text-amber-300 font-bold'}>
                  {projectInfo.contractor} - {projectInfo.contractNumber}
                </span>
                <span className="text-rose-600 dark:text-rose-400 font-black">5 شهور (1/8/2026 - 31/12/2026)</span>
              </div>
            </div>
          ) : (
            <div className="text-xs font-bold mb-2 flex flex-wrap items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`text-[11px] font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>عرض الجدول:</span>
                <button
                  type="button"
                  onClick={() => setTimelineFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition cursor-pointer border ${
                    timelineFilter === 'all'
                      ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                      : isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  الجدول الموحد ({scheduleItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTimelineFilter('today')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition cursor-pointer border flex items-center gap-1 ${
                    timelineFilter === 'today'
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs ring-2 ring-amber-400/50'
                      : isLight ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200' : 'bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border-amber-800/60'
                  }`}
                  title={`عرض أعمال تاريخ الموقف (${projectInfo.reportDate || '2026/10/15'})`}
                >
                  <Zap className="w-3 h-3 fill-slate-950" />
                  <span>أعمال اليوم ({todayTimelineItems.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTimelineFilter('shakayer')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition cursor-pointer border ${
                    timelineFilter === 'shakayer'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                      : isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  هناجر الشكاير ({shakayerCount})
                </button>
                <button
                  type="button"
                  onClick={() => setTimelineFilter('equipment_wash')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition cursor-pointer border ${
                    timelineFilter === 'equipment_wash'
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs font-black'
                      : isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  المعدات والمغسلة ({eqWashCount})
                </button>
              </div>

              <div className="flex items-center gap-3 text-[11px]">
                <span className={isLight ? 'text-blue-900 font-bold' : 'text-amber-300 font-bold'}>
                  {projectInfo.contractor} - {projectInfo.contractNumber}
                </span>
                <span className="text-rose-600 dark:text-rose-400 font-black">5 شهور (1/8/2026 - 31/12/2026)</span>
              </div>
            </div>
          )}

          <div className={`overflow-x-auto ${isPrintMode ? 'overflow-visible max-h-none' : 'max-h-[360px] overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500'} border rounded-xl`}>
            <table className="w-full text-right border-collapse text-[10px] md:text-[11px] table-fixed">
              <colgroup>
                <col className="w-[3.5%]" />
                <col className="w-[28%]" />
                <col className="w-[11.5%]" />
                <col className="w-[7%]" />
                <col className="w-[8%]" />
                <col className="w-[8%]" />
                {Array.from({ length: 19 }).map((_, i) => (
                  <col key={i} className="w-[1.78%]" />
                ))}
              </colgroup>
              <thead className="sticky top-0 z-20">
                <tr className="bg-gradient-to-r from-blue-950 to-slate-900 text-white font-bold border border-slate-700 shadow-sm text-[9.5px]">
                  <th className="p-1 text-center border-l border-slate-700 bg-slate-950">م</th>
                  <th className="p-1 border-l border-slate-700">بيان الأعمال</th>
                  <th className="p-1 text-center border-l border-slate-700">المنطقة</th>
                  <th className="p-1 text-center border-l border-slate-700 bg-blue-950">المدة</th>
                  <th className="p-1 text-center border-l border-slate-700">البدء</th>
                  <th className="p-1 text-center border-l border-slate-700">الانتهاء</th>
                  <th colSpan={19} className="p-1 text-center border-l border-slate-700 bg-blue-900 text-amber-300 font-black">
                    المخطط الزمني الشلالي المعتمد (Gantt Waterfall)
                  </th>
                </tr>

                {/* Master Summary Scope Row */}
                <tr className="bg-[#0B1E34] text-white font-black border border-slate-700 text-[9px]">
                  <td className="p-1 text-center border-l border-slate-700">-</td>
                  <td className="p-1 border-l border-slate-700 text-amber-300" colSpan={2}>
                    إجمالي مدة المشروع المعتمدة
                  </td>
                  <td className="p-1 text-center border-l border-slate-700 bg-amber-500 text-slate-950 font-black">
                    5 شهور
                  </td>
                  <td className="p-1 text-center border-l border-slate-700 font-mono">1/8/2026</td>
                  <td className="p-1 text-center border-l border-slate-700 font-mono">31/12/2026</td>
                  <td colSpan={19} className="p-1 text-center bg-[#102E52] text-white font-black border-l border-slate-700">
                    البرنامج الزمني الموحد المدمج (الشكاير 1 و 2 + المعدات + المغسلة)
                  </td>
                </tr>

                {/* Sub-Banners */}
                {(timelineFilter === 'all' || timelineFilter === 'shakayer') && (
                  <tr className="bg-emerald-950 text-emerald-300 font-bold border border-slate-700 text-[9px]">
                    <td className="p-0.5 text-center border-l border-slate-700">A</td>
                    <td className="p-1 border-l border-slate-700" colSpan={2}>قطاع هناجر الشكاير (1-2)</td>
                    <td className="p-1 text-center border-l border-slate-700 font-black">5 شهور</td>
                    <td className="p-1 text-center border-l border-slate-700 font-mono">1/8/2026</td>
                    <td className="p-1 text-center border-l border-slate-700 font-mono">31/12/2026</td>
                    <td colSpan={19} className="p-0.5 text-center bg-emerald-900/80 text-white font-black">
                      هنجر الشكاير (1-2) • 17 مرحلة
                    </td>
                  </tr>
                )}

                {(timelineFilter === 'all' || timelineFilter === 'equipment_wash') && (
                  <tr className="bg-amber-950 text-amber-300 font-bold border border-slate-700 text-[9px]">
                    <td className="p-0.5 text-center border-l border-slate-700">B</td>
                    <td className="p-1 border-l border-slate-700" colSpan={2}>قطاع هنجر المعدات والمغسلة (الوثيقة المرفقة)</td>
                    <td className="p-1 text-center border-l border-slate-700 font-black">4 شهور</td>
                    <td className="p-1 text-center border-l border-slate-700 font-mono">1/9/2026</td>
                    <td className="p-1 text-center border-l border-slate-700 font-mono">31/12/2026</td>
                    <td colSpan={19} className="p-0.5 text-center bg-amber-900/80 text-white font-black">
                      هنجر المعدات + المغسلة • 19 مرحلة
                    </td>
                  </tr>
                )}
              </thead>

              <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-slate-800'}`}>
                {filteredTimelineItems.map((item, idx) => {
                  const pos = item.timelinePosition !== undefined ? item.timelinePosition : (idx % 19);
                  const isShakayer = (item.facility || '').includes('الشكاير') || (item.facility || '').includes('هنجر (1-2)');
                  const isWashOnly = item.facility === 'المغسلة';
                  const isEqOnly = item.facility === 'هنجر المعدات';

                  const badgeClass = isShakayer
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    : isWashOnly
                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
                    : isEqOnly
                    ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';

                  const barBg = isShakayer
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : isWashOnly
                    ? 'bg-purple-600 text-white font-black'
                    : isEqOnly
                    ? 'bg-orange-500 text-slate-950 font-black'
                    : 'bg-yellow-400 text-slate-950 font-black';

                  const isToday = isItemActiveToday(item);

                  return (
                    <tr key={item.id} className={`transition border ${
                      isToday
                        ? isLight ? 'bg-amber-500/10 border-amber-300' : 'bg-amber-500/15 border-amber-500/40'
                        : isLight ? 'hover:bg-slate-50 border-slate-200 text-slate-800' : 'hover:bg-slate-900/60 border-slate-800 text-slate-200'
                    }`}>
                      <td className={`p-1 text-center font-mono font-bold border-l text-[9px] ${
                        isToday
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-slate-900 text-slate-300 border-slate-800'
                      }`}>
                        {idx + 1}
                      </td>
                      <td className={`p-1 font-semibold border-l text-[9px] leading-tight break-words ${isLight ? 'border-slate-200 text-slate-900' : 'border-slate-800 text-slate-200'}`}>
                        <div className="flex items-center justify-between gap-1">
                          <span className="line-clamp-2" title={item.statement}>{item.statement}</span>
                          {isToday && (
                            <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[7px] font-black bg-amber-500 text-slate-950 shadow-xs shrink-0">
                              <Zap className="w-2 h-2 fill-slate-950" />
                              <span>اليوم</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={`p-0.5 text-center border-l ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                        <span className={`inline-block px-1 py-0.5 rounded text-[8px] font-bold border truncate max-w-full ${badgeClass}`} title={item.facility}>
                          {item.facility || 'المشروع'}
                        </span>
                      </td>
                      <td className={`p-0.5 text-center font-bold border-l font-mono text-[8px] ${
                        isLight ? 'bg-slate-50 text-amber-700 border-slate-200' : 'bg-slate-900/40 text-amber-300 border-slate-800'
                      }`}>
                        {item.durationText || `${item.durationDays || 0} يوم`}
                      </td>
                      <td className={`p-0.5 text-center font-mono border-l text-[8px] ${isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-300'}`}>
                        {item.startDate}
                      </td>
                      <td className={`p-0.5 text-center font-mono border-l text-[8px] ${isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-300'}`}>
                        {item.endDate}
                      </td>

                      {/* 19 Waterfall Grid cells */}
                      {Array.from({ length: 19 }).map((_, cIdx) => {
                        const isActive = cIdx === pos;
                        return (
                          <td
                            key={cIdx}
                            title={isActive ? `${item.statement} (${item.facility || 'المشروع'})` : undefined}
                            className={`p-0 text-center border-l h-5.5 ${
                              isLight ? 'border-slate-200' : 'border-slate-800/60'
                            } ${
                              isActive
                                ? `${barBg} shadow-xs`
                                : isLight ? 'bg-slate-100/50' : 'bg-slate-950/40'
                            }`}
                          >
                            {isActive ? (
                              <div className="w-full h-full flex items-center justify-center text-[7.5px] font-black">
                                ✓
                              </div>
                            ) : null}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`pt-2 text-center text-xs ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
          {pageIndicatorText || "الشريحة 3 من 20 • البرنامج الزمني الموحد المعتمد لكامل المشروع (36 مرحلة من 2026/8/1 وحتى 2026/12/31)"}
        </div>
      </div>
    );
  }

  // Slide 4 & 5: BOQ Tables (الموقف التنفيذي للأعمال الإنشائية)
  if (slide.type === 'boq') {
    const isSlide4 = slide.slideNumber === 4;
    const midpoint = Math.ceil(boqItems.length / 2);
    const displayedItems = boqItemsSubset
      ? boqItemsSubset
      : (isSlide4 ? boqItems.slice(0, midpoint) : boqItems.slice(midpoint));

    return (
      <div className={`w-full h-full min-h-[520px] flex flex-col justify-between p-4 md:p-6 rounded-2xl border transition-colors duration-200 shadow-2xl ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
      }`}>
        <SlideHeader 
          projectInfo={projectInfo} 
          currentSlideTitle={customTitle || (isSlide4 ? "الموقف التنفيذي للأعمال الإنشائية" : "تابع الموقف التنفيذي للأعمال الإنشائية")} 
        />

        {customSubTitle && (
          <div className="px-1 pt-1.5 pb-0.5 text-xs font-bold text-amber-500 flex items-center justify-between border-b border-amber-500/20 mb-1">
            <span className="bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">{customSubTitle}</span>
            <span className="text-[11px] text-slate-400 font-mono">
              ({displayedItems.length} بند مسجل)
            </span>
          </div>
        )}

        <div className={`my-auto py-2 overflow-x-auto ${isPrintMode ? 'overflow-visible max-h-none' : 'max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500'}`}>
          <table className="w-full text-right border-collapse text-xs table-fixed">
            <colgroup>
              <col className="w-[18%]" />
              <col className="w-[34%]" />
              <col className="w-[12%]" />
              <col className="w-[12%]" />
              <col className="w-[10%]" />
              <col className="w-[14%]" />
            </colgroup>
            <thead>
              <tr className="bg-[#0C2340] text-white font-bold border border-slate-700 text-[11px]">
                <th className="p-2 border-l border-slate-700">بيان المشروع</th>
                <th className="p-2 border-l border-slate-700">بيان الأعمال</th>
                <th className="p-2 text-center border-l border-slate-700">الكمية بالمقايسة</th>
                <th className="p-2 text-center border-l border-slate-700">الكمية المنفذة</th>
                <th className="p-2 text-center border-l border-slate-700">نسبة الإنجاز %</th>
                <th className="p-2">ملاحظات</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-slate-800'}`}>
              {displayedItems.map((item, idx) => (
                <tr key={item.id} className={`transition border ${
                  isLight ? 'hover:bg-slate-50 border-slate-200' : 'hover:bg-slate-900/60 border-slate-800'
                }`}>
                  {idx === 0 && (
                    <td
                      rowSpan={displayedItems.length}
                      className={`p-3 font-bold border-l text-center leading-relaxed text-xs align-middle ${
                        isLight ? 'bg-blue-50/50 text-blue-900 border-slate-200' : 'bg-blue-950/40 text-blue-200 border-slate-800'
                      }`}
                    >
                      {projectInfo.projectTitle}
                    </td>
                  )}
                  <td className={`p-2 font-medium border-l ${
                    isLight ? 'border-slate-200 text-slate-800' : 'border-slate-800 text-slate-200'
                  }`}>
                    <span className="text-[10px] text-amber-500 block font-semibold">{item.category}</span>
                    {item.statement}
                  </td>
                  <td className={`p-2 text-center font-mono font-medium border-l whitespace-nowrap ${
                    isLight ? 'border-slate-200 text-slate-700' : 'border-slate-800 text-slate-300'
                  }`}>
                    {item.totalQuantity.toLocaleString()} {item.unit}
                  </td>
                  <td className={`p-2 text-center font-mono font-bold border-l whitespace-nowrap ${
                    isLight ? 'text-amber-700 border-slate-200' : 'text-amber-300 border-slate-800'
                  }`}>
                    {item.executedQuantity.toLocaleString()} {item.unit}
                  </td>
                  <td className={`p-2 text-center border-l ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                    <span
                      className={`font-black px-2 py-0.5 rounded text-[11px] ${
                        item.executionPercentage > 0
                          ? isLight ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300/60' : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                          : isLight ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      %{item.executionPercentage}
                    </span>
                  </td>
                  <td className={`p-2 text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {item.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>

            {(isLastBoqPage || (!isSlide4 && !boqItemsSubset)) && (
              <tfoot>
                <tr className="bg-[#0C2340] text-white font-black text-sm border-t border-amber-500/30">
                  <td colSpan={4} className="p-3 text-right">
                    إجمالي نسبة التنفيذ الكلية للمشروع
                  </td>
                  <td className="p-3 text-center text-base font-black text-amber-300">
                    %{projectInfo.overallProgress}
                  </td>
                  <td className="p-3 text-xs font-semibold text-slate-300">
                    معتمد حتى تاريخ {projectInfo.reportDate}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        <div className={`pt-2 text-center text-xs ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
          {pageIndicatorText || `الشريحة ${slide.slideNumber} من 20 • جدول المقايسة ونسب التنفيذ`}
        </div>
      </div>
    );
  }

  // Slide 6 to 20: Photo Documentation (توثيق الصور الميدانية)
  const images = slide.images || [];
  const colCount = images.length === 1 ? 1 : images.length === 2 ? 2 : 3;

  return (
    <div className={`w-full h-full min-h-[520px] flex flex-col justify-between p-4 md:p-6 rounded-2xl transition-all duration-300 relative ${facilityStyle.borderClass} ${facilityStyle.outerRing} ${facilityStyle.glowShadow} ${
      isLight ? 'bg-white text-slate-900' : 'bg-slate-950 text-white'
    }`}>
      {/* Official Top Bar */}
      <SlideHeader
        projectInfo={projectInfo}
        currentSlideTitle={
          slide.subTitle && !slide.subTitle.includes('2026/9/13') && !slide.subTitle.includes('2026/09/13')
            ? slide.subTitle
            : `الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى تاريخ اليوم (${projectInfo.reportDate})`
        }
      />

      {/* Facility Zone Ribbon & Interactive Selector */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 my-2 p-2.5 rounded-xl border transition-all ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
      }`}>
        {/* Active Facility Zone Badge */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">المنطقة الهندسية:</span>
          <div className={`px-3.5 py-1 rounded-lg text-xs md:text-sm font-black border shadow-xs flex items-center gap-2 transition-all ${facilityStyle.tagColor}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${facilityStyle.dotColor} animate-pulse`}></span>
            <span>{facilityStyle.name}</span>
          </div>
        </div>

        {/* Quick Facility Zone Switcher Buttons (for Admin / Edit mode) */}
        {isEditable && onUpdateSlideFacility && (
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <span className="text-[10px] text-slate-400 font-semibold hidden lg:inline">اختر المنطقة:</span>
            {PROJECT_FACILITIES.filter(f => f !== 'عام - كامل المشروع').map((f) => {
              const isSelected = (slide.facility || 'هنجر الشكاير 1') === f;
              const fStyle = getFacilityStyle(f, isLight);
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => onUpdateSlideFacility(slide.id, f)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                    isSelected
                      ? `${fStyle.badgeBg} ${fStyle.badgeText} shadow-md scale-105 border-transparent ring-2 ring-white/20`
                      : isLight
                      ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                  title={`تحديد الشريحة لـ ${f}`}
                >
                  <span className={`w-2 h-2 rounded-full ${fStyle.dotColor}`}></span>
                  <span>{f}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Slide Subheader Button / Badge with the Action Title */}
      <div className="text-center my-1.5">
        <div className={`inline-block px-8 py-2 rounded-xl text-white font-extrabold text-sm md:text-base shadow-md border ${facilityStyle.bannerBg} border-white/20`}>
          {slide.title}
        </div>
      </div>

      {/* Main Photographic Content Area */}
      <div className="my-auto py-2">
        {images.length === 0 ? (
          <div className={`text-center py-16 border-2 border-dashed rounded-2xl ${
            isLight ? 'border-slate-300 bg-slate-50' : 'border-slate-800 bg-slate-900/30'
          }`}>
            <p className={`text-sm mb-3 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>لا توجد صور مضافة لهذه الشريحة حتى الآن</p>
            {isEditable && onOpenAddPhoto && (
              <button
                onClick={() => onOpenAddPhoto(slide.id)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                إضافة صور للشريحة
              </button>
            )}
          </div>
        ) : (
          <div
            className={`grid gap-4 items-stretch ${
              colCount === 1
                ? 'grid-cols-1 max-w-2xl mx-auto'
                : colCount === 2
                ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                : 'grid-cols-1 md:grid-cols-3'
            }`}
          >
            {images.map((img, idx) => (
              <div
                key={img.id}
                className={`group relative flex flex-col rounded-xl overflow-hidden shadow-lg transition-all duration-300 border ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 hover:border-amber-500'
                    : 'bg-slate-900 border-slate-800 hover:border-amber-500/50'
                }`}
              >
                {/* Image Container with Zoom */}
                <div
                  className="relative aspect-4/3 w-full bg-slate-950 overflow-hidden cursor-pointer"
                  onClick={() => onOpenLightbox && onOpenLightbox(images, idx)}
                >
                  <img
                    src={img.url}
                    alt={img.caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2.5 rounded-full bg-amber-500 text-slate-950 shadow-lg transform -translate-y-1 group-hover:translate-y-0 transition">
                      <ZoomIn className="w-5 h-5" />
                    </span>
                  </div>

                  {/* Index badge */}
                  <span className="absolute top-2 right-2 bg-black/70 backdrop-blur-xs text-amber-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-slate-700">
                    {idx + 1}
                  </span>

                  {/* Edit & Delete buttons if in edit mode */}
                  {isEditable && (
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      {onEditImage && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditImage(slide.id, img);
                          }}
                          className="p-1.5 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition cursor-pointer shadow font-bold"
                          title="تعديل بيانات وتفاصيل الصورة"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDeleteImage && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('هل تريد حذف هذه الصورة من الشريحة؟')) {
                              onDeleteImage(slide.id, img.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-600/90 text-white hover:bg-red-500 transition cursor-pointer shadow"
                          title="حذف الصورة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Caption Card below the image */}
                <div className={`p-3 border-t flex-1 flex flex-col justify-between ${
                  isLight ? 'bg-white border-slate-200' : 'bg-gradient-to-b from-slate-900 to-slate-950 border-slate-800'
                }`}>
                  <div>
                    <div className="flex items-start justify-between gap-1.5">
                      <p className={`text-xs md:text-sm font-bold leading-snug line-clamp-2 ${
                        isLight ? 'text-slate-900' : 'text-amber-300'
                      }`}>
                        {img.caption}
                      </p>
                      {isEditable && onEditImage && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditImage(slide.id, img);
                          }}
                          className="shrink-0 p-1 rounded-md text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 transition cursor-pointer"
                          title="تعديل بيانات الصورة"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    {img.description && (
                      <p className={`text-[11px] mt-1 line-clamp-2 ${
                        isLight ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        {img.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Add Photo card inline when slide has 1 or 2 images */}
            {isEditable && images.length > 0 && images.length < 3 && onOpenAddPhoto && (
              <button
                type="button"
                onClick={() => onOpenAddPhoto(slide.id)}
                className={`group flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition duration-200 cursor-pointer min-h-[180px] ${
                  isLight
                    ? 'border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50/80 text-amber-800'
                    : 'border-amber-500/40 hover:border-amber-400 bg-slate-900/40 hover:bg-slate-900/80 text-amber-300'
                }`}
                title="إضافة صورة أخرى إلى هذه الشريحة"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all flex items-center justify-center mb-2 shadow-xs">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold">إضافة صورة إضافية</span>
                <span className="text-[10px] opacity-75 mt-0.5">الشريحة تتسع حتى 3 صور ({images.length}/3)</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer info, zone tag & Add photo action if editable */}
      <div className={`pt-2.5 flex items-center justify-between border-t text-xs ${
        isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'
      }`}>
        <div className="flex items-center gap-3">
          <span className="font-bold">الشريحة {slide.slideNumber}</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${facilityStyle.tagColor}`}>
            {facilityStyle.name}
          </span>
        </div>

        {isEditable && onOpenAddPhoto && (
          <button
            onClick={() => onOpenAddPhoto(slide.id)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold cursor-pointer text-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة صورة للشريحة</span>
          </button>
        )}

        <div className="flex items-center gap-2">
          <AcademyLogo size="sm" showText={false} customLogoUrl={projectInfo.consultantLogoUrl} />
          <span className="font-medium hidden sm:inline">
            الشركة الوطنية للأسمنت • <span className="text-amber-500 font-bold">إشراف الأكاديمية العربية</span>
          </span>
        </div>
      </div>
    </div>
  );
};
