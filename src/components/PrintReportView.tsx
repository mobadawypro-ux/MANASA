import React from 'react';
import { ReportSlide, ProjectInfo, BoqItem, ScheduleItem } from '../types/report';
import { SlideRenderer } from './SlideRenderer';
import { AcademyLogo } from './AcademyLogo';
import { useTheme } from '../context/ThemeContext';
import { 
  Printer, 
  ArrowRight, 
  X, 
  Sun, 
  Moon, 
  BookOpen, 
  ClipboardList, 
  Calendar, 
  TrendingUp, 
  MapPin, 
  Layers,
  Award,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface PrintReportViewProps {
  slides: ReportSlide[];
  projectInfo: ProjectInfo;
  boqItems: BoqItem[];
  scheduleItems: ScheduleItem[];
  onClose: () => void;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({
  slides,
  projectInfo,
  boqItems,
  scheduleItems,
  onClose
}) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  const triggerPrint = () => {
    window.print();
  };

  // 1. Prepare Paginated Schedule Items for Complete Uncut PDF Printing
  // Splitting into two clear sectors: Shakayer (17 items) and Equipment/Wash (19 items)
  const shakayerSchedule = scheduleItems.filter(
    (i) => (i.facility || '').includes('الشكاير') || (i.facility || '').includes('هنجر (1-2)')
  );
  const equipmentWashSchedule = scheduleItems.filter(
    (i) => !( (i.facility || '').includes('الشكاير') || (i.facility || '').includes('هنجر (1-2)') )
  );

  const schedulePagesData: {
    items: ScheduleItem[];
    customTitle: string;
    customSubTitle: string;
    pageIndicatorText: string;
  }[] = [];

  if (shakayerSchedule.length > 0 && equipmentWashSchedule.length > 0) {
    schedulePagesData.push({
      items: shakayerSchedule,
      customTitle: 'البرنامج الزمني الموحد المعتمد - قطاع هناجر الشكاير (1-2)',
      customSubTitle: `قطاع هناجر الشكاير (1-2) • ${shakayerSchedule.length} مرحلة معتمدة من 2026/8/1 حتى 2026/12/31`,
      pageIndicatorText: `الشريحة 3 (الجزء الأول) • قطاع هناجر الشكاير (1-2) • ${shakayerSchedule.length} مرحلة معتمدة`
    });
    schedulePagesData.push({
      items: equipmentWashSchedule,
      customTitle: 'البرنامج الزمني الموحد المعتمد - قطاع هنجر المعدات ومغسلة المعدات',
      customSubTitle: `قطاع هنجر المعدات والمغسلة • ${equipmentWashSchedule.length} مرحلة معتمدة من 2026/9/1 حتى 2026/12/31`,
      pageIndicatorText: `الشريحة 3 (الجزء الثاني) • قطاع هنجر المعدات والمغسلة • ${equipmentWashSchedule.length} مرحلة معتمدة`
    });
  } else {
    // Fallback if facilities are custom: split equally into chunks of ~18
    const chunkSize = 18;
    for (let i = 0; i < scheduleItems.length; i += chunkSize) {
      const chunk = scheduleItems.slice(i, i + chunkSize);
      const pageNum = Math.floor(i / chunkSize) + 1;
      const totalPages = Math.ceil(scheduleItems.length / chunkSize);
      schedulePagesData.push({
        items: chunk,
        customTitle: `البرنامج الزمني الموحد المعتمد (صفحة ${pageNum} من ${totalPages})`,
        customSubTitle: `الجدول الزمني المعتمد للمشروع • البنود من ${i + 1} إلى ${Math.min(i + chunkSize, scheduleItems.length)}`,
        pageIndicatorText: `الشريحة 3 (صفحة ${pageNum} من ${totalPages}) • البرنامج الزمني المعتمد (${chunk.length} مرحلة)`
      });
    }
  }

  // 2. Prepare Paginated BOQ Items for Complete Uncut PDF Printing
  // Splitting all 74 items into pages of ~19 items so every single item has its own row
  const BOQ_CHUNK_SIZE = 19;
  const boqChunks: {
    items: BoqItem[];
    customTitle: string;
    customSubTitle: string;
    pageIndicatorText: string;
    isLast: boolean;
  }[] = [];

  const totalBoqPages = Math.ceil(boqItems.length / BOQ_CHUNK_SIZE) || 1;

  for (let i = 0; i < boqItems.length; i += BOQ_CHUNK_SIZE) {
    const chunk = boqItems.slice(i, i + BOQ_CHUNK_SIZE);
    const pageNum = Math.floor(i / BOQ_CHUNK_SIZE) + 1;
    const isLast = pageNum === totalBoqPages;

    let subTitleCategory = 'جدول الموقف التنفيذي للمقايسة المعتمدة';
    if (pageNum === 1) {
      subTitleCategory = 'أولاً: الأعمال المدنية والتشطيبات (الحفر، الردم، الإحلال، الخرسانة العادية والمسلحة)';
    } else if (pageNum === 2) {
      subTitleCategory = 'تابع الأعمال المدنية: العزل البيتوميني، المباني، بياض التخشين، الأرضيات والدهانات، والإنترلوك';
    } else if (pageNum === 3) {
      subTitleCategory = 'ثانياً: الأعمال المعدنية والجمالونات + ثالثاً: الأعمال الكهربائية وكابلات القوى والمحولات';
    } else if (pageNum === 4) {
      subTitleCategory = 'رابعاً: شبكات الحريق + خامساً: أعمال السباكة ومعدات المغسلة والونش العلوي 10 طن';
    }

    boqChunks.push({
      items: chunk,
      customTitle: `الموقف التنفيذي للأعمال الإنشائية (الجزء ${pageNum} من ${totalBoqPages})`,
      customSubTitle: subTitleCategory,
      pageIndicatorText: `جدول المقايسة (صفحة ${pageNum} من ${totalBoqPages}) • البنود من ${i + 1} إلى ${Math.min(i + BOQ_CHUNK_SIZE, boqItems.length)} • إجمالي ${boqItems.length} بند معتمد`,
      isLast
    });
  }

  // Total pages calculation: 1 (Index) + 2 (Cover & Timing) + schedulePagesData.length (2) + boqChunks.length (4) + photo slides
  const otherSlides = slides.filter(
    (s) => s.type !== 'timeline' && s.type !== 'boq' && s.slideNumber !== 1 && s.slideNumber !== 2
  );
  const slide1 = slides.find((s) => s.slideNumber === 1) || slides[0];
  const slide2 = slides.find((s) => s.slideNumber === 2) || slides[1];
  const timelineSlide = slides.find((s) => s.type === 'timeline') || slides[2];
  const boqSlide = slides.find((s) => s.type === 'boq') || slides[3];

  const totalCalculatedPages = 1 + 2 + schedulePagesData.length + boqChunks.length + otherSlides.length;

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Styles Injection for Perfect Clean Prints (Force A4 Landscape with zero margins, hide headers/footers) */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body {
            background: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .print-page {
            page-break-after: always !important;
            page-break-inside: avoid !important;
            break-after: page !important;
            margin: 0 !important;
            padding: 8mm 10mm !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: 100vh !important;
            height: auto !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            box-sizing: border-box !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
            overflow: visible !important;
          }
          /* Eliminate scrollbars and max-height / horizontal cutoffs on printed PDF */
          .overflow-y-auto, .overflow-x-auto {
            overflow: visible !important;
            max-height: none !important;
            max-width: 100% !important;
          }
          /* Force tables to stay strictly within 100% width on A4 Landscape */
          table {
            width: 100% !important;
            max-width: 100% !important;
            table-layout: fixed !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          /* Prevent layout cutoffs on images & tables during landscape scaling */
          tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          img {
            max-height: 380px !important;
            object-fit: cover !important;
            page-break-inside: avoid !important;
          }
          /* Standard chrome print rules for flawless A4 Landscape */
          @page {
            size: A4 landscape;
            margin: 6mm;
          }
        }
      `}} />

      {/* Non-printed Floating Bar */}
      <div className={`sticky top-0 z-50 backdrop-blur-md border-b p-4 shadow-xl flex items-center justify-between no-print ${
        isLight ? 'bg-white/95 border-slate-200 text-slate-900' : 'bg-slate-900/95 border-slate-800 text-white'
      }`}>
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer border ${
              isLight 
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' 
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
          >
            <ArrowRight className="w-4 h-4" />
            العودة للمنصة
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm">مستند التقرير الفني والشرائح للطباعة الرسمية المعتمدة</h3>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30">
                {totalCalculatedPages} صفحة مطبوعة ومجهزة للـ PDF
              </span>
            </div>
            <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              تم تقسيم بنود المقايسة والبرنامج الزمني لصفحات كاملة دون أي اقتصاص لضمان ظهور كافة البنود الـ {boqItems.length} والجدول الزمني بالكامل في ملف الـ PDF.
            </p>
          </div>
        </div>

        {/* Arab Academy Badge in Preview */}
        <div className="hidden lg:flex items-center px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <AcademyLogo size="sm" showText={true} />
        </div>

        <div className="flex items-center gap-2">
          {/* Theme switcher for printing */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
              isLight 
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' 
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-400'
            }`}
            title="تبديل النمط قبل الطباعة (نهاري / ليلي)"
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span className="hidden sm:inline">{isLight ? 'مظهر طباعة داكن' : 'مظهر طباعة فاتح'}</span>
          </button>

          <button
            onClick={triggerPrint}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة وتصدير PDF المعتمد ({totalCalculatedPages} صفحة)</span>
          </button>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl border cursor-pointer ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-400'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Printable Master Document Body */}
      <div className="max-w-6xl xl:max-w-7xl w-full mx-auto p-4 md:p-6 space-y-8 print:p-0 print:space-y-0 print:max-w-none print:w-full">
        
        {/* ========================================================= */}
        {/* PAGE 1: PRESTIGIOUS INDEX & PROJECT SHEET (جدول المحتويات والبيانات) */}
        {/* ========================================================= */}
        <div className={`print-page rounded-2xl border p-8 shadow-2xl relative ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          {/* Subtle design header */}
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-500 rounded-2xl text-slate-950 flex items-center justify-center font-black shadow-md">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="text-right">
                <h1 className="text-lg font-black tracking-tight">{projectInfo.companyName}</h1>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{projectInfo.subLocation}</p>
              </div>
            </div>

            <div className="p-2 rounded-xl border bg-slate-950/5 dark:bg-slate-50/5">
              <AcademyLogo size="md" showText={true} customLogoUrl={projectInfo.consultantLogoUrl} />
            </div>
          </div>

          <div className="text-center space-y-2 mb-6">
            <span className="px-4 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-500/20">
              مستند فني رسمي للطباعة والأرشفة
            </span>
            <h2 className="text-xl md:text-2xl font-black text-amber-500">
              جدول المحتويات وبيانات المتابعة الأساسية للمشروع
            </h2>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              التقرير التنفيذي المعتمد للمشروع الصادر عن الجهة الاستشارية للأكاديمية العربية
            </p>
          </div>

          {/* Grid Layout: Right side data sheet, Left side index */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Project Sheet (5 cols) */}
            <div className={`lg:col-span-5 p-5 rounded-2xl border flex flex-col justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
            }`}>
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-amber-500 border-b pb-1.5 flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4" />
                  بطاقة تعريف العقد والمشروع
                </h3>

                <div className="space-y-3 text-xs leading-relaxed">
                  <div>
                    <span className="block text-[10px] opacity-75 font-semibold">موضوع العملية:</span>
                    <span className="font-bold">{projectInfo.projectTitle}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] opacity-75 font-semibold">المقاول العام المنفذ:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{projectInfo.contractor}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] opacity-75 font-semibold">مستند الإسناد والتعاقد:</span>
                    <span className="font-bold font-mono">{projectInfo.contractNumber}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="block text-[10px] opacity-75 font-semibold">تاريخ تسليم الموقع:</span>
                      <span className="font-bold font-mono">{projectInfo.handoverDate}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] opacity-75 font-semibold">تاريخ الانتهاء المقرر:</span>
                      <span className="font-bold font-mono">{projectInfo.plannedEndDate}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="block text-[10px] opacity-75 font-semibold">مدة المشروع التعاقدية:</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">{projectInfo.durationMonths} أشهر</span>
                    </div>
                    <div>
                      <span className="block text-[10px] opacity-75 font-semibold">تاريخ تحديث التقرير:</span>
                      <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{projectInfo.reportDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Circle & overall status */}
              <div className="pt-4 border-t mt-4 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] opacity-75 block font-semibold">معدل الإنجاز العام المعتمد:</span>
                  <span className="text-xl font-black text-amber-500 font-mono">%{projectInfo.overallProgress}</span>
                </div>
                <div className="w-14 h-14 rounded-full border-4 border-amber-500/20 flex items-center justify-center relative font-mono text-xs font-bold text-amber-500">
                  <span className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin opacity-40"></span>
                  %{projectInfo.overallProgress}
                </div>
              </div>
            </div>

            {/* Table of Contents Index (7 cols) */}
            <div className={`lg:col-span-7 p-5 rounded-2xl border flex flex-col justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
            }`}>
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 border-b pb-1.5 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  أقسام ومحتويات ملف التقرير الفني الشامل
                </h3>

                <div className="divide-y divide-slate-200/50 dark:divide-slate-800/50 max-h-[240px] overflow-y-auto pr-1 text-xs">
                  <div className="py-2 flex items-center justify-between">
                    <span className="font-bold">مستند الفهرس وبطاقة المشروع الفنية</span>
                    <span className="font-bold text-amber-500 font-mono">الغلاف المعتمد</span>
                  </div>
                  <div className="py-2 flex items-center justify-between">
                    <span>الشريحة 1: الغلاف والشعار الرسمي للعملية</span>
                    <span className="font-mono text-slate-400">ص 1</span>
                  </div>
                  <div className="py-2 flex items-center justify-between">
                    <span>الشريحة 2: بيانات وتوقيتات المشروع الإنشائي (مدة 5 أشهر)</span>
                    <span className="font-mono text-slate-400">ص 2</span>
                  </div>
                  <div className="py-2 flex items-center justify-between text-blue-600 dark:text-blue-400 font-semibold">
                    <span>الشريحة 3 (الجزء 1): البرنامج الزمني الموحد - قطاع هناجر الشكاير (1-2)</span>
                    <span className="font-mono">ص 3</span>
                  </div>
                  <div className="py-2 flex items-center justify-between text-blue-600 dark:text-blue-400 font-semibold">
                    <span>الشريحة 3 (الجزء 2): البرنامج الزمني الموحد - قطاع هنجر المعدات والمغسلة</span>
                    <span className="font-mono">ص 4</span>
                  </div>
                  <div className="py-2 flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>جدول المقايسة (1 من 4): الأعمال المدنية والتشطيبات والخرسانات (البنود 1 - 19)</span>
                    <span className="font-mono">ص 5</span>
                  </div>
                  <div className="py-2 flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>جدول المقايسة (2 من 4): تابع المدني - العزل والمباني والإنترلوك (البنود 20 - 38)</span>
                    <span className="font-mono">ص 6</span>
                  </div>
                  <div className="py-2 flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>جدول المقايسة (3 من 4): الأعمال المعدنية والجمالونات والكهرباء (البنود 39 - 57)</span>
                    <span className="font-mono">ص 7</span>
                  </div>
                  <div className="py-2 flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>جدول المقايسة (4 من 4): شبكات الحريق، السباكة والمغسلة والونش (البنود 58 - 74)</span>
                    <span className="font-mono">ص 8</span>
                  </div>
                  <div className="py-2 flex items-center justify-between">
                    <span>الشرائح 6 - {slides.length}: التوثيق الفوتوغرافي الشامل لكافة مراحل الإنشاء</span>
                    <span className="font-mono text-slate-400 font-bold">ص 9 • ص {totalCalculatedPages - 1}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t mt-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold text-center leading-relaxed flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>تم إدراج كافة بنود المقايسة الـ {boqItems.length} وكافة مراحل البرنامج الزمني الـ {scheduleItems.length} كاملة بدون أي اقتطاع.</span>
              </div>
            </div>

          </div>

          {/* Footer Signature */}
          <div className="border-t pt-4 mt-6 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>مستند مؤرشف ومحمي ضد التعديل غير المصرح به</span>
            </div>
            <span>الأكاديمية العربية لتكنولوجيا المعلومات والاتصالات • {projectInfo.companyName}</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SLIDE 1: COVER */}
        {/* ========================================================= */}
        {slide1 && (
          <div
            key={slide1.id}
            className={`print-page rounded-2xl border p-6 shadow-2xl relative transition-colors duration-200 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}
          >
            <SlideRenderer
              slide={slide1}
              projectInfo={projectInfo}
              boqItems={boqItems}
              scheduleItems={scheduleItems}
              isEditable={false}
              isPrintMode={true}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* SLIDE 2: PROJECT TIMING & DURATION */}
        {/* ========================================================= */}
        {slide2 && (
          <div
            key={slide2.id}
            className={`print-page rounded-2xl border p-6 shadow-2xl relative transition-colors duration-200 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}
          >
            <SlideRenderer
              slide={slide2}
              projectInfo={projectInfo}
              boqItems={boqItems}
              scheduleItems={scheduleItems}
              isEditable={false}
              isPrintMode={true}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* SLIDE 3: UNIFIED SCHEDULE TIMELINE (PAGINATED ACROSS SECTORS SO ALL 36 ITEMS APPEAR) */}
        {/* ========================================================= */}
        {timelineSlide && schedulePagesData.map((sec, secIdx) => (
          <div
            key={`timeline-sec-${secIdx}`}
            className={`print-page rounded-2xl border p-6 shadow-2xl relative transition-colors duration-200 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}
          >
            <SlideRenderer
              slide={timelineSlide}
              projectInfo={projectInfo}
              boqItems={boqItems}
              scheduleItems={scheduleItems}
              scheduleItemsSubset={sec.items}
              customTitle={sec.customTitle}
              customSubTitle={sec.customSubTitle}
              pageIndicatorText={sec.pageIndicatorText}
              isEditable={false}
              isPrintMode={true}
            />
          </div>
        ))}

        {/* ========================================================= */}
        {/* SLIDES 4 & 5: BOQ TABLES (PAGINATED SO ALL 74 ITEMS APPEAR IN FULL) */}
        {/* ========================================================= */}
        {boqSlide && boqChunks.map((bChunk, bIdx) => (
          <div
            key={`boq-chunk-${bIdx}`}
            className={`print-page rounded-2xl border p-6 shadow-2xl relative transition-colors duration-200 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}
          >
            <SlideRenderer
              slide={boqSlide}
              projectInfo={projectInfo}
              boqItems={boqItems}
              scheduleItems={scheduleItems}
              boqItemsSubset={bChunk.items}
              customTitle={bChunk.customTitle}
              customSubTitle={bChunk.customSubTitle}
              pageIndicatorText={bChunk.pageIndicatorText}
              isLastBoqPage={bChunk.isLast}
              isEditable={false}
              isPrintMode={true}
            />
          </div>
        ))}

        {/* ========================================================= */}
        {/* SLIDES 6 TO N: PHOTO DOCUMENTATION SLIDES */}
        {/* ========================================================= */}
        {otherSlides.map((s) => (
          <div
            key={s.id}
            className={`print-page rounded-2xl border p-6 shadow-2xl relative transition-colors duration-200 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}
          >
            <SlideRenderer
              slide={s}
              projectInfo={projectInfo}
              boqItems={boqItems}
              scheduleItems={scheduleItems}
              isEditable={false}
              isPrintMode={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
