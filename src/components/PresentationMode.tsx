import React, { useState, useEffect, useCallback } from 'react';
import { ReportSlide, ProjectInfo, BoqItem, ScheduleItem, SlideImage } from '../types/report';
import { SlideRenderer } from './SlideRenderer';
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
  Printer 
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
  onDeleteImage: (slideId: string, imageId: string) => void;
  onUpdateSlideTitle: (slideId: string, newTitle: string) => void;
  onPrintReport: () => void;
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
  onDeleteImage,
  onUpdateSlideTitle,
  onPrintReport
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handleNext = useCallback(() => {
    if (currentSlideIndex < slides.length - 1) {
      onSlideChange(currentSlideIndex + 1);
    } else {
      onSlideChange(0); // loop back
    }
  }, [currentSlideIndex, slides.length, onSlideChange]);

  const handlePrev = useCallback(() => {
    if (currentSlideIndex > 0) {
      onSlideChange(currentSlideIndex - 1);
    } else {
      onSlideChange(slides.length - 1);
    }
  }, [currentSlideIndex, slides.length, onSlideChange]);

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
    <div className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-4' : 'space-y-4'}`}>
      {/* Top Presentation Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl shadow-lg no-print">
        {/* Navigation & Counter */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
            title="الشريحة السابقة (سهم يمين)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="px-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-amber-400">
            شريحة {currentSlideIndex + 1} / {slides.length}
          </div>

          <button
            onClick={handleNext}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
            title="الشريحة التالية (سهم يسار أو مسافة)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Autoplay button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="تشغيل تلقائي للعرض التقديمي (Slideshow)"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="hidden sm:inline">{isPlaying ? 'إيقاف مؤقت' : 'عرض تلقائي'}</span>
          </button>
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
                className="w-full bg-slate-950 border border-amber-500 rounded-lg px-2 py-1 text-xs text-white"
              />
              <button
                onClick={handleSaveTitle}
                className="px-2 py-1 bg-amber-500 text-slate-950 text-xs font-bold rounded"
              >
                حفظ
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-300 truncate">
              <span className="font-semibold truncate">{currentSlide.title}</span>
              <button
                onClick={() => {
                  setEditedTitle(currentSlide.title);
                  setIsEditingTitle(true);
                }}
                className="text-slate-500 hover:text-amber-400 transition"
                title="تعديل عنوان الشريحة"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenAddPhoto(currentSlide.id)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <ImageIcon className="w-4 h-4" />
            <span>إضافة صور</span>
          </button>

          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`p-2 rounded-xl transition cursor-pointer ${
              showThumbnails
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="إظهار / إخفاء شريط مصغرات الشرائح"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          <button
            onClick={onPrintReport}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            title="طباعة وتصدير PDF"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            title={isFullscreen ? 'إنهاء ملء الشاشة (F)' : 'عرض ملء الشاشة (F)'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Slide Canvas */}
      <div className="relative w-full flex-1 flex items-center justify-center">
        {/* Previous Navigation Floating Button */}
        <button
          onClick={handlePrev}
          className="absolute right-2 md:right-4 z-20 p-3 rounded-full bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-white transition backdrop-blur-sm border border-slate-700 shadow-xl opacity-40 hover:opacity-100 cursor-pointer"
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
            onDeleteImage={onDeleteImage}
            isEditable={true}
          />
        </div>

        {/* Next Navigation Floating Button */}
        <button
          onClick={handleNext}
          className="absolute left-2 md:left-4 z-20 p-3 rounded-full bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-white transition backdrop-blur-sm border border-slate-700 shadow-xl opacity-40 hover:opacity-100 cursor-pointer"
          title="التالي"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Thumbnail Filmstrip at bottom */}
      {showThumbnails && (
        <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-800 p-2.5 rounded-2xl shadow-xl no-print">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {slides.map((s, idx) => {
              const isSelected = idx === currentSlideIndex;
              return (
                <button
                  key={s.id}
                  onClick={() => onSlideChange(idx)}
                  className={`shrink-0 w-28 md:w-32 h-16 md:h-20 rounded-xl p-1.5 flex flex-col justify-between text-right border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-blue-950/80 border-amber-500 ring-2 ring-amber-500/40 shadow-lg'
                      : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-mono font-bold px-1 rounded bg-black/60 text-amber-400">
                      {idx + 1}
                    </span>
                    <span className="text-[9px] text-slate-400 truncate max-w-[60px]">
                      {s.type}
                    </span>
                  </div>

                  <p className="text-[10px] font-bold text-slate-200 line-clamp-2 leading-tight">
                    {s.title}
                  </p>

                  {/* Thumbnail micro preview indicators */}
                  {s.images && s.images.length > 0 && (
                    <span className="text-[8px] text-amber-300 font-mono">
                      📷 {s.images.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
