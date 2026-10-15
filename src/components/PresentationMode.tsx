import React, { useState, useEffect, useCallback } from 'react';
import { ReportSlide, ProjectInfo, BoqItem, ScheduleItem, SlideImage } from '../types/report';
import { SlideRenderer } from './SlideRenderer';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getFacilityStyle } from '../data/facilityColors';
import { 
  ChevronRight, 
  ChevronLeft, 
  Maximize2, 
  Minimize2, 
  Play, 
  Pause, 
  Plus, 
  Edit3, 
  Image as ImageIcon, 
  LayoutGrid, 
  Printer,
  Sun,
  Moon,
  Lock,
  Trash2,
  Filter,
  MapPin
} from 'lucide-react';

interface PresentationModeProps {
  slides: ReportSlide[];
  projectInfo: ProjectInfo;
  boqItems: BoqItem[];
  scheduleItems: ScheduleItem[];
  currentSlideIndex: number;
  onSlideChange: (index: number) => void;
  onOpenLightbox: (images: SlideImage[], index: number) => void;
  onOpenAddPhoto: (slideId: string) => void;
  onEditImage?: (slideId: string, image: SlideImage) => void;
  onDeleteImage: (slideId: string, imageId: string) => void;
  onUpdateSlideTitle: (slideId: string, newTitle: string) => void;
  onUpdateSlideFacility?: (slideId: string, facility: string) => void;
  onPrintReport: () => void;
  onDeleteSlide?: (slideId: string) => void;
  onAddNewSlide?: () => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  slides,
  projectInfo,
  boqItems,
  scheduleItems,
  currentSlideIndex,
  onSlideChange,
  onOpenLightbox,
  onOpenAddPhoto,
  onEditImage,
  onDeleteImage,
  onUpdateSlideTitle,
  onUpdateSlideFacility,
  onPrintReport,
  onDeleteSlide,
  onAddNewSlide
}) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  const { isAdmin, openLoginModal } = useAuth();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('all');

  const filteredSlidesWithIndex = React.useMemo(() => {
    return slides
      .map((slide, originalIndex) => ({ slide, originalIndex }))
      .filter(({ slide }) => {
        if (selectedZone === 'all') return true;
        return slide.facility === selectedZone;
      });
  }, [slides, selectedZone]);

  const currentIndexInFiltered = React.useMemo(() => {
    return filteredSlidesWithIndex.findIndex(
      ({ originalIndex }) => originalIndex === currentSlideIndex
    );
  }, [filteredSlidesWithIndex, currentSlideIndex]);

  // Automatically adjust current slide if it is not in the filtered list
  useEffect(() => {
    if (filteredSlidesWithIndex.length === 0) return;
    const isCurrentInFiltered = filteredSlidesWithIndex.some(
      ({ originalIndex }) => originalIndex === currentSlideIndex
    );
    if (!isCurrentInFiltered) {
      onSlideChange(filteredSlidesWithIndex[0].originalIndex);
    }
  }, [selectedZone, filteredSlidesWithIndex, currentSlideIndex, onSlideChange]);

  const handleNext = useCallback(() => {
    if (filteredSlidesWithIndex.length === 0) return;
    const idx = filteredSlidesWithIndex.findIndex(
      ({ originalIndex }) => originalIndex === currentSlideIndex
    );
    if (idx !== -1 && idx < filteredSlidesWithIndex.length - 1) {
      onSlideChange(filteredSlidesWithIndex[idx + 1].originalIndex);
    } else {
      onSlideChange(filteredSlidesWithIndex[0].originalIndex); // loop back
    }
  }, [currentSlideIndex, filteredSlidesWithIndex, onSlideChange]);

  const handlePrev = useCallback(() => {
    if (filteredSlidesWithIndex.length === 0) return;
    const idx = filteredSlidesWithIndex.findIndex(
      ({ originalIndex }) => originalIndex === currentSlideIndex
    );
    if (idx > 0) {
      onSlideChange(filteredSlidesWithIndex[idx - 1].originalIndex);
    } else {
      onSlideChange(filteredSlidesWithIndex[filteredSlidesWithIndex.length - 1].originalIndex); // loop back to end
    }
  }, [currentSlideIndex, filteredSlidesWithIndex, onSlideChange]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === 'ArrowLeft' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowRight' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          document.exitFullscreen?.();
          setIsFullscreen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, isFullscreen]);

  // Autoplay
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        handleNext();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, handleNext]);

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      onUpdateSlideTitle(currentSlide.id, editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <div className={`flex flex-col ${isFullscreen ? (isLight ? 'fixed inset-0 z-50 bg-slate-100 p-4' : 'fixed inset-0 z-50 bg-slate-950 p-4') : 'space-y-4'}`}>
      {/* Top Presentation Control Bar */}
      <div className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border transition-colors duration-200 no-print ${
        isLight ? 'bg-white border-slate-200 text-slate-800 shadow-sm' : 'bg-slate-900 border-slate-800 text-slate-100 shadow-lg'
      }`}>
        {/* Navigation & Counter */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className={`p-2 rounded-xl transition cursor-pointer border ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
            }`}
            title="الشريحة السابقة (سهم يمين)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className={`px-4 py-1.5 rounded-xl border text-xs font-mono font-bold ${
            isLight ? 'bg-slate-100 border-slate-200 text-amber-600' : 'bg-slate-950 border-slate-800 text-amber-400'
          }`}>
            شريحة {currentIndexInFiltered !== -1 ? currentIndexInFiltered + 1 : 1} / {filteredSlidesWithIndex.length || 1}
          </div>

          <button
            onClick={handleNext}
            className={`p-2 rounded-xl transition cursor-pointer border ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
            }`}
            title="الشريحة التالية (سهم يسار أو مسافة)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Autoplay button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md'
                : isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
            title="تشغيل تلقائي للعرض التقديمي (Slideshow)"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="hidden sm:inline">{isPlaying ? 'إيقاف مؤقت' : 'عرض تلقائي'}</span>
          </button>

          {/* Zone Filter Dropdown */}
          <div className="flex items-center gap-1.5 border-r pr-2 border-slate-700/30">
            <Filter className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className={`text-xs font-black rounded-lg px-2 py-1.5 border cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500/50 ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-800'
                  : 'bg-slate-800 border-slate-700 text-white'
              }`}
            >
              <option value="all">كافة المناطق الهندسية</option>
              <option value="هنجر الشكاير 1">هنجر الشكاير 1</option>
              <option value="هنجر الشكاير 2">هنجر الشكاير 2</option>
              <option value="هنجر المعدات">هنجر المعدات</option>
              <option value="مغسلة المعدات">مغسلة المعدات</option>
              <option value="عام - كامل المشروع">عام - كامل المشروع</option>
            </select>
          </div>
        </div>

        {/* Slide Title Quick Edit */}
        <div className="flex items-center gap-2 flex-1 max-w-md mx-2">
          {isEditingTitle ? (
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') setIsEditingTitle(false);
                }}
                className={`w-full border rounded-lg px-2 py-1 text-xs ${
                  isLight ? 'bg-white border-amber-500 text-slate-900' : 'bg-slate-950 border-amber-500 text-white'
                }`}
              />
              <button
                onClick={handleSaveTitle}
                className="px-2 py-1 bg-amber-500 text-slate-950 text-xs font-bold rounded cursor-pointer"
              >
                حفظ
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs truncate">
              <span className={`font-semibold truncate ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                {currentSlide.title}
              </span>
              {isAdmin && (
                <button
                  onClick={() => {
                    setEditedTitle(currentSlide.title);
                    setIsEditingTitle(true);
                  }}
                  className="text-slate-400 hover:text-amber-500 transition cursor-pointer"
                  title="تعديل عنوان الشريحة"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          {/* Quick theme toggle in presentation bar */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition cursor-pointer border ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-amber-600' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-400'
            }`}
            title={isLight ? 'تفعيل الوضع الليلي' : 'تفعيل الوضع النهاري'}
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {isAdmin ? (
            <button
              onClick={() => onOpenAddPhoto(currentSlide.id)}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="إضافة وتوثيق صور جديدة"
            >
              <ImageIcon className="w-4 h-4" />
              <span>إضافة صور</span>
            </button>
          ) : (
            <button
              onClick={openLoginModal}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition flex items-center gap-1.5 cursor-pointer opacity-70 hover:opacity-100 ${
                isLight ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title="تسجيل الدخول كأدمن لإضافة الصور"
            >
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">إضافة صور</span>
            </button>
          )}

          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`p-2 rounded-xl transition cursor-pointer border ${
              showThumbnails
                ? 'bg-blue-600 text-white border-blue-700 shadow-md'
                : isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
            title="إظهار / إخفاء شريط مصغرات الشرائح"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          <button
            onClick={onPrintReport}
            className={`p-2 rounded-xl transition cursor-pointer border ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
            title="طباعة وتصدير PDF"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-xl transition cursor-pointer border ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
            title={isFullscreen ? 'إنهاء ملء الشاشة (F)' : 'عرض ملء الشاشة (F)'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {isAdmin && onDeleteSlide && slides.length > 1 && (
            <button
              onClick={() => {
                if (confirm(`⚠️ هل أنت متأكد من رغبتك في حذف الشريحة الحالية رقم (${currentSlideIndex + 1}) بعنوان: "${currentSlide.title || 'بدون عنوان'}" نهائياً؟\n\nلا يمكن التراجع عن هذا الإجراء.`)) {
                  onDeleteSlide(currentSlide.id);
                }
              }}
              className="p-2 rounded-xl border border-red-500/30 hover:bg-red-500/10 text-red-500 transition cursor-pointer"
              title="حذف هذه الشريحة نهائياً"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Slide Canvas */}
      <div className="relative w-full flex-1 flex items-center justify-center">
        {/* Previous Navigation Floating Button */}
        <button
          onClick={handlePrev}
          className={`absolute right-2 md:right-4 z-20 p-3 rounded-full transition backdrop-blur-sm border shadow-xl opacity-60 hover:opacity-100 cursor-pointer ${
            isLight
              ? 'bg-white/90 hover:bg-amber-500 hover:text-slate-950 text-slate-800 border-slate-200'
              : 'bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-white border-slate-700'
          }`}
          title="السابق"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* The Slide Itself */}
        <div className="w-full max-w-5xl mx-auto shadow-2xl transition-all duration-300">
          <SlideRenderer
            slide={currentSlide}
            projectInfo={projectInfo}
            boqItems={boqItems}
            scheduleItems={scheduleItems}
            onOpenLightbox={onOpenLightbox}
            onOpenAddPhoto={onOpenAddPhoto}
            onEditImage={onEditImage}
            onDeleteImage={onDeleteImage}
            onUpdateSlideFacility={onUpdateSlideFacility}
            isEditable={isAdmin}
          />
        </div>

        {/* Next Navigation Floating Button */}
        <button
          onClick={handleNext}
          className={`absolute left-2 md:left-4 z-20 p-3 rounded-full transition backdrop-blur-sm border shadow-xl opacity-60 hover:opacity-100 cursor-pointer ${
            isLight
              ? 'bg-white/90 hover:bg-amber-500 hover:text-slate-950 text-slate-800 border-slate-200'
              : 'bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-white border-slate-700'
          }`}
          title="التالي"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Admin Add Slide Button on the Last Slide */}
      {isAdmin && currentSlideIndex === slides.length - 1 && onAddNewSlide && (
        <div className="flex justify-center mt-3 mb-1 animate-fadeIn no-print">
          <button
            onClick={onAddNewSlide}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 hover:opacity-95 text-slate-950 font-black text-xs rounded-2xl shadow-lg hover:shadow-amber-500/20 transform hover:scale-[1.01] transition flex items-center gap-2 cursor-pointer border border-amber-500/30"
            title="إضافة شريحة جديدة مخصصة في نهاية هذا التقرير"
          >
            <Plus className="w-4 h-4 font-black" />
            <span>إضافة شريحة جديدة مخصصة نهاية التقرير (صلاحية أدمن)</span>
          </button>
        </div>
      )}

      {/* Thumbnail Filmstrip at bottom */}
      {showThumbnails && (
        <div className={`p-2.5 rounded-2xl border transition-colors duration-200 no-print ${
          isLight ? 'bg-white/95 border-slate-200 shadow-md' : 'bg-slate-900/90 border-slate-800 shadow-xl'
        }`}>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {filteredSlidesWithIndex.map(({ slide: s, originalIndex }) => {
              const isSelected = originalIndex === currentSlideIndex;
              const fStyle = getFacilityStyle(s.facility, isLight);
              return (
                <button
                  key={s.id}
                  onClick={() => onSlideChange(originalIndex)}
                  className={`shrink-0 w-28 md:w-32 h-16 md:h-20 rounded-xl p-1.5 flex flex-col justify-between text-right border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? isLight
                        ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/40 shadow-md'
                        : 'bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/40 shadow-lg'
                      : isLight
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 opacity-70 hover:opacity-100 text-slate-200'
                  }`}
                  style={{ borderRightWidth: '4px', borderRightColor: fStyle.borderColor }}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-mono font-bold px-1 rounded bg-black/60 text-amber-400">
                      {originalIndex + 1}
                    </span>
                    <span className={`text-[8px] font-black px-1 rounded truncate max-w-[55px] ${fStyle.tagColor}`}>
                      {fStyle.name.replace('هنجر ', 'هـ ')}
                    </span>
                  </div>

                  <p className={`text-[9px] font-black line-clamp-2 leading-tight ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    {s.title}
                  </p>

                  <div className="flex items-center justify-between w-full text-[8px] opacity-85">
                    {s.images && s.images.length > 0 ? (
                      <span className={isLight ? 'text-amber-600 font-bold' : 'text-amber-300 font-bold'}>
                        📷 {s.images.length}
                      </span>
                    ) : (
                      <span></span>
                    )}
                    <span className="font-mono scale-90">{s.type}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
