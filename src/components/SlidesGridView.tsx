import React from 'react';
import { ReportSlide, ProjectInfo } from '../types/report';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { AcademyLogo } from './AcademyLogo';
import { getFacilityStyle } from '../data/facilityColors';
import { Play, Plus, Image as ImageIcon, Edit, Trash2, Lock } from 'lucide-react';

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
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const { isAdmin, openLoginModal } = useAuth();

  const [selectedZone, setSelectedZone] = React.useState<string>('all');

  const filteredSlidesWithIndex = React.useMemo(() => {
    return slides
      .map((slide, originalIndex) => ({ slide, originalIndex }))
      .filter(({ slide }) => {
        if (selectedZone === 'all') return true;
        return slide.facility === selectedZone;
      });
  }, [slides, selectedZone]);

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl border transition-colors duration-200 ${
        isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-900 border-slate-800 text-white shadow-xl'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-bold text-base md:text-lg">
              معرض واستعراض كافة شرائح العرض التقديمي
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30">
              {slides.length} شرائح
            </span>
          </div>
          <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            تقرير الموقف التنفيذي الإنشائي • انقر على أي شريحة للانتقال إليها مباشرة في وضع العرض
          </p>
        </div>

        {/* Arab Academy Badge & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className={`hidden sm:flex items-center px-3 py-1.5 rounded-xl border ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <AcademyLogo size="sm" showText={true} />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectSlide(0)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-4 h-4" />
              بدء العرض من البداية
            </button>

            {isAdmin ? (
              <button
                onClick={onOpenSlideManager}
                className={`px-3 py-2 font-semibold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer border ${
                  isLight 
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' 
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
              >
                <Edit className="w-4 h-4" />
                إدارة وترتيب الشرائح
              </button>
            ) : (
              <button
                onClick={openLoginModal}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border flex items-center gap-1.5 cursor-pointer ${
                  isLight ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
                title="تسجيل الدخول كأدمن لإدارة وترتيب الشرائح"
              >
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                إدارة الشرائح (مقفل)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Zone Quick Filters bar */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        isLight ? 'bg-slate-50 border-slate-200/80' : 'bg-slate-900/40 border-slate-800'
      }`}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">تصفية حسب المنطقة:</span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'كافة المناطق' },
              { id: 'هنجر الشكاير 1', label: 'هنجر الشكاير 1' },
              { id: 'هنجر الشكاير 2', label: 'هنجر الشكاير 2' },
              { id: 'هنجر المعدات', label: 'هنجر المعدات' },
              { id: 'مغسلة المعدات', label: 'مغسلة المعدات' },
              { id: 'عام - كامل المشروع', label: 'عام - كامل المشروع' }
            ].map((zone) => {
              const isActive = selectedZone === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                      : isLight
                      ? 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  {zone.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-500 shrink-0">
          يعرض <span className="font-bold text-amber-500">{filteredSlidesWithIndex.length}</span> من أصل <span className="font-bold">{slides.length}</span> شرائح
        </div>
      </div>

      {/* Grid of slides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSlidesWithIndex.map(({ slide: s, originalIndex: idx }) => {
          const hasImages = s.images && s.images.length > 0;
          const coverImage = hasImages ? s.images![0].url : null;
          const fStyle = getFacilityStyle(s.facility, isLight);

          return (
            <div
              key={s.id}
              className={`rounded-2xl overflow-hidden transition duration-200 group flex flex-col justify-between border shadow-lg ${
                isLight
                  ? 'bg-white hover:shadow-xl'
                  : 'bg-slate-900'
              }`}
              style={{ borderTopWidth: '4px', borderTopColor: fStyle.borderColor }}
            >
              {/* Preview Box */}
              <div
                onClick={() => onSelectSlide(idx)}
                className={`relative aspect-16/10 p-3 flex flex-col justify-between cursor-pointer overflow-hidden border-b ${
                  isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}
              >
                {/* Background image if available */}
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt={s.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-75 transition duration-500"
                  />
                ) : (
                  <div className={`absolute inset-0 ${
                    isLight 
                      ? 'bg-gradient-to-br from-blue-100/60 via-slate-100 to-amber-50/40' 
                      : 'bg-gradient-to-br from-blue-950/40 via-slate-950 to-slate-900'
                  }`} />
                )}

                {/* Top badge */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-xs text-amber-400 font-mono font-bold text-xs border border-slate-700">
                    #{idx + 1}
                  </span>
                  
                  {/* Facility Tag */}
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border shadow-sm ${fStyle.tagColor}`}>
                    {fStyle.name}
                  </span>
                </div>

                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900/90 text-white font-semibold shadow">
                    {s.type === 'cover'
                      ? 'غلاف التقرير'
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
                <div className="relative z-10 bg-black/75 backdrop-blur-xs p-2 rounded-lg border border-slate-800/80">
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
              <div className={`p-3 flex items-center justify-between gap-2 text-xs ${
                isLight ? 'bg-white text-slate-800' : 'bg-slate-900 text-slate-200'
              }`}>
                <span className={`text-[11px] truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {hasImages ? `${s.images!.length} صور موثقة` : s.type}
                </span>

                {isAdmin ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenAddPhoto(s.id)}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        isLight 
                          ? 'hover:bg-slate-100 text-slate-500 hover:text-amber-600' 
                          : 'hover:bg-slate-800 text-slate-400 hover:text-amber-400'
                      }`}
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
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        isLight 
                          ? 'hover:bg-red-50 text-slate-400 hover:text-red-600' 
                          : 'hover:bg-red-950/60 text-slate-400 hover:text-red-400'
                      }`}
                      title="حذف الشريحة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                    عرض فقط
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredSlidesWithIndex.length === 0 && (
        <div className={`p-12 text-center border-2 border-dashed rounded-2xl ${
          isLight ? 'border-slate-300 bg-slate-50' : 'border-slate-800 bg-slate-900/20'
        }`}>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">
            لا توجد أي شرائح مضافة أو موثقة لهذه المنطقة الهندسية حالياً.
          </p>
        </div>
      )}
    </div>
  );
};
