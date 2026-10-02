import React from 'react';
import { ReportSlide, ProjectInfo, BoqItem, ScheduleItem, SlideImage } from '../types/report';
import { SlideHeader } from './SlideHeader';
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
  Edit 
} from 'lucide-react';

interface SlideRendererProps {
  slide: ReportSlide;
  projectInfo: ProjectInfo;
  boqItems: BoqItem[];
  scheduleItems: ScheduleItem[];
  onOpenLightbox?: (images: SlideImage[], index: number) => void;
  onOpenAddPhoto?: (slideId: string) => void;
  onDeleteImage?: (slideId: string, imageId: string) => void;
  isEditable?: boolean;
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({
  slide,
  projectInfo,
  boqItems,
  scheduleItems,
  onOpenLightbox,
  onOpenAddPhoto,
  onDeleteImage,
  isEditable = false
}) => {
  // Slide 1: Cover
  if (slide.type === 'cover') {
    return (
      <div className="w-full h-full min-h-[520px] flex flex-col justify-between p-6 md:p-10 relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/80 rounded-2xl border border-slate-800 shadow-2xl">
        {/* Subtle Industrial Background Graphic */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header */}
        <SlideHeader projectInfo={projectInfo} themeStyle="classic" />

        {/* Center Main Presentation Title */}
        <div className="my-auto py-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs md:text-sm font-bold shadow-lg">
            <HardHat className="w-4 h-4" />
            تقرير المتابعة الفنية والإشراف الهندسي الميداني
          </div>

          <div className="max-w-4xl mx-auto p-6 md:p-8 bg-gradient-to-r from-blue-950/90 via-slate-900/90 to-blue-950/90 border-2 border-amber-400/80 rounded-3xl shadow-2xl backdrop-blur-md">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-relaxed tracking-wide drop-shadow-md">
              {slide.title || projectInfo.projectTitle}
            </h1>
          </div>

          <p className="text-sm md:text-lg text-slate-300 font-semibold max-w-2xl mx-auto">
            {projectInfo.contractor} • {projectInfo.contractNumber}
          </p>
        </div>

        {/* Bottom Details Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs text-slate-400 relative z-10">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300 font-bold">{projectInfo.companyName}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-slate-900 rounded-lg border border-slate-700 text-slate-300 font-mono">
              تاريخ الموقف: {projectInfo.reportDate}
            </span>
            <span className="px-3 py-1 bg-amber-500 text-slate-950 font-black rounded-lg shadow">
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
      <div className="w-full h-full min-h-[520px] flex flex-col justify-between p-6 md:p-8 bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
        <SlideHeader projectInfo={projectInfo} currentSlideTitle={projectInfo.projectTitle} />

        <div className="my-auto py-6 max-w-4xl mx-auto w-full space-y-6">
          {/* Card 1: Start Timing */}
          <div className="space-y-2">
            <div className="inline-block bg-gradient-to-r from-sky-600 to-blue-700 text-white font-black text-sm md:text-base px-6 py-2 rounded-xl shadow-lg border border-sky-400/30">
              توقيت بدء المشروع
            </div>
            <div className="p-5 md:p-6 bg-gradient-to-r from-blue-900/90 via-blue-800/90 to-blue-900/90 text-white font-bold text-base md:text-xl rounded-2xl shadow-xl border-2 border-sky-400/60 flex items-center justify-center gap-4 text-center">
              <Calendar className="w-7 h-7 text-amber-300 shrink-0" />
              <span>
                تم تسليم الموقع و بدء العمل إعتباراً من{' '}
                <span className="text-amber-300 font-mono font-black">{projectInfo.handoverDate}</span>
              </span>
            </div>
          </div>

          {/* Card 2: Duration */}
          <div className="space-y-2">
            <div className="inline-block bg-gradient-to-r from-sky-600 to-blue-700 text-white font-black text-sm md:text-base px-6 py-2 rounded-xl shadow-lg border border-sky-400/30">
              مدة تنفيذ المشروع
            </div>
            <div className="p-5 md:p-6 bg-gradient-to-r from-blue-900/90 via-blue-800/90 to-blue-900/90 text-white font-bold text-base md:text-xl rounded-2xl shadow-xl border-2 border-sky-400/60 flex items-center justify-center gap-4 text-center">
              <Clock className="w-7 h-7 text-amber-300 shrink-0" />
              <span>
                مدة تنفيذ المشروع طبقاً لأمر الإسناد ({projectInfo.durationMonths}) شهور مخطط حتى{' '}
                <span className="text-amber-300 font-mono font-black">{projectInfo.plannedEndDate}</span>
              </span>
            </div>
          </div>

          {/* Overall Progress Quick Highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-center">
              <span className="text-xs text-slate-400 font-medium">الجهة المنفذة</span>
              <p className="text-sm font-bold text-white mt-1">{projectInfo.contractor}</p>
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-center">
              <span className="text-xs text-slate-400 font-medium">أمر الإسناد</span>
              <p className="text-sm font-bold text-amber-400 mt-1">{projectInfo.contractNumber}</p>
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-center">
              <span className="text-xs text-slate-400 font-medium">إجمالي نسبة الإنجاز</span>
              <p className="text-base font-black text-emerald-400 mt-1">{projectInfo.overallProgress}% حتى تاريخه</p>
            </div>
          </div>
        </div>

        <div className="pt-2 text-center text-xs text-slate-500">
          الشريحة 2 من 20 • تقرير الموقف التنفيذي الرسمي
        </div>
      </div>
    );
  }

  // Slide 3: Timeline Gantt Matrix (المخطط الزمني)
  if (slide.type === 'timeline') {
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    return (
      <div className="w-full h-full min-h-[520px] flex flex-col justify-between p-4 md:p-6 bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl">
        <SlideHeader 
          projectInfo={projectInfo} 
          currentSlideTitle="المخطط الزمني وفقاً للمقاول لإنشاء عدد 2 هنجر 40*100 وهنجر اصلاح للمعدات 52*20 م ومغسلة للمعدات من 2026/8/1 وحتى 2027/5/1" 
        />

        <div className="my-auto py-2 overflow-x-auto">
          <div className="text-xs text-amber-300 font-bold mb-2 flex items-center justify-between">
            <span>شركة الهلال للمقاولات العمومية - أمر إسناد رقم 24/2026 - مدة تنفيذ المشروع تسعة أشهر</span>
            <span className="text-slate-400">البرنامج الزمني 2026 / 2027</span>
          </div>

          <table className="w-full text-right border-collapse text-[10px] md:text-xs">
            <thead>
              <tr className="bg-blue-900 text-white font-bold border border-slate-700">
                <th className="p-1.5 w-6 text-center border-l border-slate-700">م</th>
                <th className="p-1.5 min-w-[140px] border-l border-slate-700">بيان الأعمال</th>
                {months.map((m) => (
                  <th key={m} className="p-1 text-center min-w-[75px] border-l border-slate-700">
                    <div>الشهر {m}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {scheduleItems.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-900/60 transition border border-slate-800">
                  <td className="p-1 text-center font-mono font-bold bg-slate-900 text-slate-300 border-l border-slate-800">
                    {idx + 1}
                  </td>
                  <td className="p-1 font-medium text-slate-200 whitespace-nowrap border-l border-slate-800">
                    {item.statement}
                  </td>
                  {months.map((m) => {
                    const status = item.monthlyStatus[m];
                    const active = Boolean(status && status.trim());
                    return (
                      <td
                        key={m}
                        className={`p-0.5 text-center border-l border-slate-800 ${
                          active ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-950 text-transparent'
                        }`}
                      >
                        {active ? (
                          <div className="text-[9px] leading-tight py-0.5 px-0.5">
                            {status}
                          </div>
                        ) : (
                          ''
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-2 text-center text-xs text-slate-500">
          الشريحة 3 من 20 • المخطط الزمني المعتمد
        </div>
      </div>
    );
  }

  // Slide 4 & 5: BOQ Tables (الموقف التنفيذي للأعمال الإنشائية)
  if (slide.type === 'boq') {
    // If slide 4: first 11 items (الحفر، الردم، الخرسانات، العزل، المباني، البياض، الدهانات)
    // If slide 5: remaining items (الأرضيات، السباكة، المعدنية، الخشبية، الجمالون، المرافق، الحريق، المغسلة)
    const isSlide4 = slide.slideNumber === 4;
    const displayedItems = isSlide4 ? boqItems.slice(0, 11) : boqItems.slice(11);

    return (
      <div className="w-full h-full min-h-[520px] flex flex-col justify-between p-4 md:p-6 bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl">
        <SlideHeader 
          projectInfo={projectInfo} 
          currentSlideTitle={isSlide4 ? "الموقف التنفيذي للأعمال الإنشائية" : "تابع الموقف التنفيذي للأعمال الإنشائية"} 
        />

        <div className="my-auto py-2 overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-gradient-to-r from-blue-900 to-blue-800 text-white font-bold border border-slate-700">
                <th className="p-2 min-w-[130px] border-l border-slate-700">بيان المشروع</th>
                <th className="p-2 min-w-[180px] border-l border-slate-700">بيان الأعمال</th>
                <th className="p-2 text-center min-w-[90px] border-l border-slate-700">إجمالي الكمية طبقا للمقايسة</th>
                <th className="p-2 text-center min-w-[90px] border-l border-slate-700">الكمية المنفذة</th>
                <th className="p-2 text-center min-w-[90px] border-l border-slate-700">النسبة المنفذة %</th>
                <th className="p-2 min-w-[120px]">ملاحظات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {displayedItems.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-900/60 transition border border-slate-800">
                  {idx === 0 && (
                    <td
                      rowSpan={displayedItems.length}
                      className="p-3 bg-blue-950/40 text-blue-200 font-bold border-l border-slate-800 text-center leading-relaxed text-xs align-middle"
                    >
                      {projectInfo.projectTitle}
                    </td>
                  )}
                  <td className="p-2 font-medium text-slate-200 border-l border-slate-800">
                    <span className="text-[10px] text-amber-400 block font-semibold">{item.category}</span>
                    {item.statement}
                  </td>
                  <td className="p-2 text-center font-mono font-medium text-slate-300 border-l border-slate-800 whitespace-nowrap">
                    {item.totalQuantity.toLocaleString()} {item.unit}
                  </td>
                  <td className="p-2 text-center font-mono font-bold text-amber-400 border-l border-slate-800 whitespace-nowrap">
                    {item.executedQuantity.toLocaleString()} {item.unit}
                  </td>
                  <td className="p-2 text-center border-l border-slate-800">
                    <span
                      className={`font-black px-2 py-0.5 rounded ${
                        item.executionPercentage > 0 ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400'
                      }`}
                    >
                      %{item.executionPercentage}
                    </span>
                  </td>
                  <td className="p-2 text-[11px] text-slate-400">
                    {item.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>

            {!isSlide4 && (
              <tfoot>
                <tr className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-sm">
                  <td colSpan={4} className="p-3 text-right">
                    إجمالي نسبة التنفيذ الكلية للمشروع
                  </td>
                  <td className="p-3 text-center text-base font-black">
                    %{projectInfo.overallProgress}
                  </td>
                  <td className="p-3 text-xs font-semibold">
                    معتمد حتى تاريخ {projectInfo.reportDate}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        <div className="pt-2 text-center text-xs text-slate-500">
          الشريحة {slide.slideNumber} من 20 • جدول المقايسة ونسب التنفيذ
        </div>
      </div>
    );
  }

  // Slide 6 to 20: Photo Documentation (توثيق الصور الميدانية)
  const images = slide.images || [];
  const colCount = images.length === 1 ? 1 : images.length === 2 ? 2 : 3;

  return (
    <div className="w-full h-full min-h-[520px] flex flex-col justify-between p-4 md:p-6 bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl relative">
      {/* Official Top Bar */}
      <SlideHeader
        projectInfo={projectInfo}
        currentSlideTitle="الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى 2026/9/13"
      />

      {/* Slide Subheader Button / Badge with the Action Title */}
      <div className="text-center my-2">
        <div className="inline-block px-8 py-2 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-sky-600 text-white font-black text-base md:text-xl shadow-lg border border-sky-400/40">
          {slide.title}
        </div>
      </div>

      {/* Main Photographic Content Area */}
      <div className="my-auto py-2">
        {images.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
            <p className="text-slate-400 text-sm mb-3">لا توجد صور مضافة لهذه الشريحة حتى الآن</p>
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
                className="group relative flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:border-amber-500/50 hover:shadow-amber-500/10"
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

                  {/* Delete button if in edit mode */}
                  {isEditable && onDeleteImage && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('هل تريد حذف هذه الصورة من الشريحة؟')) {
                          onDeleteImage(slide.id, img.id);
                        }
                      }}
                      className="absolute top-2 left-2 p-1.5 rounded-lg bg-red-600/90 text-white hover:bg-red-500 transition opacity-0 group-hover:opacity-100 cursor-pointer shadow"
                      title="حذف الصورة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Caption Card below the image */}
                <div className="p-3 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800 flex-1 flex flex-col justify-between">
                  <p className="text-xs md:text-sm font-bold text-amber-300 leading-snug line-clamp-2">
                    {img.caption}
                  </p>
                  {img.description && (
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {img.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer info & Add photo action if editable */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-xs text-slate-500">
        <span>الشريحة {slide.slideNumber} من 20</span>

        {isEditable && onOpenAddPhoto && (
          <button
            onClick={() => onOpenAddPhoto(slide.id)}
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold cursor-pointer text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            إضافة صورة لهذه الشريحة
          </button>
        )}

        <span>الشركة الوطنية للأسمنت ببنى سويف</span>
      </div>
    </div>
  );
};
