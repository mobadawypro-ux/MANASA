import React from 'react';
import { X, ZoomIn, Download, ChevronRight, ChevronLeft, Edit2 } from 'lucide-react';
import { SlideImage } from '../types/report';

interface LightboxModalProps {
  images: SlideImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
  onEdit?: (image: SlideImage) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  onEdit
}) => {
  if (!isOpen || images.length === 0) return null;
  const currentImage = images[currentIndex] || images[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate((currentIndex - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate((currentIndex + 1) % images.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none"
      onClick={onClose}
    >
      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10">
        <div className="flex items-center gap-3">
          <span className="bg-slate-800/80 px-3 py-1 rounded-full text-xs font-mono border border-slate-700">
            {currentIndex + 1} / {images.length}
          </span>
          <h4 className="text-sm font-semibold max-w-md truncate text-slate-200">
            {currentImage.caption}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
                onEdit(currentImage);
              }}
              className="p-2 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 transition cursor-pointer font-bold shadow"
              title="تعديل بيانات هذه الصورة"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          <a
            href={currentImage.url}
            download={`photo-${currentIndex + 1}.jpg`}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition"
            title="تحميل الصورة أو فتحها بالحجم الكامل"
            onClick={(e) => e.stopPropagation()}
          >
            <Download className="w-5 h-5" />
          </a>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-red-600/80 hover:bg-red-600 text-white transition cursor-pointer"
            title="إغلاق (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Container */}
      <div
        className="relative max-w-6xl max-h-[82vh] w-full flex items-center justify-center p-2"
        onClick={(e) => e.stopPropagation()}
      >
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute right-4 p-3 rounded-full bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-white transition border border-slate-700 z-10 cursor-pointer shadow-xl"
            title="الصورة السابقة"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        )}

        <img
          src={currentImage.url}
          alt={currentImage.caption}
          className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl border border-slate-800"
        />

        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute left-4 p-3 rounded-full bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-white transition border border-slate-700 z-10 cursor-pointer shadow-xl"
            title="الصورة التالية"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
        )}
      </div>

      {/* Caption bar */}
      <div
        className="mt-3 max-w-3xl text-center bg-slate-900/90 border border-slate-800 px-6 py-3 rounded-xl shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-amber-400 font-bold text-base md:text-lg mb-1">
          {currentImage.caption}
        </p>
        {currentImage.description && (
          <p className="text-slate-300 text-xs md:text-sm">
            {currentImage.description}
          </p>
        )}
      </div>
    </div>
  );
};
