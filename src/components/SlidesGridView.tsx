import React from 'react';
import { ReportSlide, ProjectInfo } from '../types/report';
import { Play, Plus, Image as ImageIcon, Edit, Trash2 } from 'lucide-react';

interface SlidesGridViewProps {
  slides: ReportSlide[];
  projectInfo: ProjectInfo;
  onSelectSlide: (index: number) => void;
  onOpenAddPhoto: (slideId: string) => void;
  onOpenSlideManager: () => void;
  onDeleteSlide: (slideId: string) => void;
}

export const SlidesGridView: React.FC<SlidesGridViewProps> = ({
  slides,
  projectInfo,
  onSelectSlide,
  onOpenAddPhoto,
  onOpenSlideManager,
  onDeleteSlide
}) => {
  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="font-bold text-white text-base md:text-lg">
            معرض واستعراض كافة شرائح العرض التقديمي
          </h2>
          <p className="text-xs text-slate-400">
            إجمالي {slides.length} شريحة معتمدة لتقرير الموقف التنفيذي • يمكنك النقر على أي شريحة لتشغيل العرض منها مباشرة
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectSlide(0)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-4 h-4" />
            بدء العرض من الشريحة الأولى
          </button>

          <button
            onClick={onOpenSlideManager}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Edit className="w-4 h-4" />
            إدارة وترتيب الشرائح
          </button>
        </div>
      </div>

      {/* Grid of slides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {slides.map((s, idx) => {
          const hasImages = s.images && s.images.length > 0;
          const coverImage = hasImages ? s.images![0].url : null;

          return (
            <div
              key={s.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition duration-200 group flex flex-col justify-between shadow-lg"
            >
              {/* Preview Box */}
              <div
                onClick={() => onSelectSlide(idx)}
                className="relative aspect-16/10 bg-slate-950 p-3 flex flex-col justify-between cursor-pointer overflow-hidden border-b border-slate-800"
              >
                {/* Background image if available */}
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt={s.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 group-hover:opacity-50 transition duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-slate-950 to-slate-900" />
                )}

                {/* Top badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-xs text-amber-400 font-mono font-bold text-xs border border-slate-700">
                    #{idx + 1}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/90 text-slate-300 font-semibold">
                    {s.type === 'cover'
                      ? 'غلاف'
                      : s.type === 'summary'
                      ? 'بيانات وتوقيت'
                      : s.type === 'timeline'
                      ? 'مخطط زمني'
                      : s.type === 'boq'
                      ? 'مقايسة تنفيذية'
                      : 'توثيق صور'}
                  </span>
                </div>

                {/* Center Title overlay */}
                <div className="relative z-10 bg-black/70 backdrop-blur-xs p-2 rounded-lg border border-slate-800/80">
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-relaxed">
                    {s.title}
                  </h4>
                </div>

                {/* Hover Play icon */}
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 bg-black/40">
                  <div className="p-3 rounded-full bg-amber-500 text-slate-950 shadow-xl">
                    <Play className="w-5 h-5 fill-slate-950" />
                  </div>
                </div>
              </div>

              {/* Bottom Card details */}
              <div className="p-3 bg-slate-900 flex items-center justify-between gap-2 text-xs">
                <span className="text-[11px] text-slate-400 truncate">
                  {hasImages ? `${s.images!.length} صور موثقة` : s.type}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onOpenAddPhoto(s.id)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition cursor-pointer"
                    title="إضافة صور لهذه الشريحة"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('هل تريد حذف هذه الشريحة؟')) {
                        onDeleteSlide(s.id);
                      }
                    }}
                    className="p-1.5 rounded-lg hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition cursor-pointer"
                    title="حذف الشريحة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
