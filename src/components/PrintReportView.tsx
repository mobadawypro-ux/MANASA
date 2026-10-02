import React from 'react';
import { ReportSlide, ProjectInfo, BoqItem, ScheduleItem } from '../types/report';
import { SlideRenderer } from './SlideRenderer';
import { Printer, ArrowRight, X } from 'lucide-react';

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
  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Non-printed Floating Bar */}
      <div className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 p-4 shadow-xl flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للمنصة
          </button>
          <div>
            <h3 className="font-bold text-sm text-white">معاينة التقرير للطباعة وحفظ PDF</h3>
            <p className="text-[11px] text-slate-400">
              اختر (حفظ بتنسيق PDF) • الاتجاه: أفقي (Landscape) • تفعيل رسومات الخلفية (Background Graphics)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerPrint}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            طباعة / حفظ كـ PDF الآن
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Printable Slides List */}
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 print:p-0 print:space-y-0 print:max-w-none">
        {slides.map((s, idx) => (
          <div
            key={s.id}
            className="print-page-break print:m-0 print:p-4 bg-slate-950 rounded-2xl border border-slate-800 p-4 shadow-2xl relative"
          >
            <SlideRenderer
              slide={s}
              projectInfo={projectInfo}
              boqItems={boqItems}
              scheduleItems={scheduleItems}
              isEditable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
