import React, { useState } from 'react';
import { ReportSlide } from '../types/report';
import { X, ArrowUp, ArrowDown, Trash2, Plus, Edit2, Check, Copy } from 'lucide-react';

interface SlideManagerModalProps {
  slides: ReportSlide[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateSlides: (newSlides: ReportSlide[]) => void;
  onSelectSlide: (index: number) => void;
}

export const SlideManagerModal: React.FC<SlideManagerModalProps> = ({
  slides,
  isOpen,
  onClose,
  onUpdateSlides,
  onSelectSlide
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');

  if (!isOpen) return null;

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[index - 1];
    newSlides[index - 1] = temp;
    // update slide numbers
    const updated = newSlides.map((s, i) => ({ ...s, slideNumber: i + 1 }));
    onUpdateSlides(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === slides.length - 1) return;
    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[index + 1];
    newSlides[index + 1] = temp;
    const updated = newSlides.map((s, i) => ({ ...s, slideNumber: i + 1 }));
    onUpdateSlides(updated);
  };

  const handleDelete = (id: string) => {
    if (slides.length <= 1) {
      alert('يجب الإبقاء على شريحة واحدة على الأقل في العرض التقديمي');
      return;
    }
    if (confirm('هل أنت متأكد من حذف هذه الشريحة؟')) {
      const filtered = slides.filter((s) => s.id !== id);
      const updated = filtered.map((s, i) => ({ ...s, slideNumber: i + 1 }));
      onUpdateSlides(updated);
    }
  };

  const handleDuplicate = (slide: ReportSlide) => {
    const newSlide: ReportSlide = {
      ...slide,
      id: `slide-${Date.now()}`,
      slideNumber: slides.length + 1,
      title: `${slide.title} (نسخة مكررة)`,
      images: slide.images ? [...slide.images] : []
    };
    onUpdateSlides([...slides, newSlide]);
  };

  const handleAddNewSlide = () => {
    const newSlide: ReportSlide = {
      id: `slide-${Date.now()}`,
      slideNumber: slides.length + 1,
      type: 'photos',
      title: 'أعمال إنشائية إضافية بالموقع',
      subTitle: 'الأعمال التي تمت في مجمع مصانع الشركة الوطنية للأسمنت ببني سويف',
      images: [],
      layout: 'two-column'
    };
    onUpdateSlides([...slides, newSlide]);
  };

  const handleSaveTitle = (id: string) => {
    if (editedTitle.trim()) {
      const updated = slides.map((s) => (s.id === id ? { ...s, title: editedTitle.trim() } : s));
      onUpdateSlides(updated);
    }
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden text-right flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div>
            <h3 className="font-bold text-lg text-white">إدارة وترتيب شرائح العرض التقديمي</h3>
            <p className="text-xs text-slate-400">إجمالي {slides.length} شريحة • يمكنك إعادة الترتيب، الحذف، التكرار، والتعديل</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddNewSlide}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              إضافة شريحة جديدة
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slides List */}
        <div className="p-6 overflow-y-auto divide-y divide-slate-800 space-y-2">
          {slides.map((s, idx) => (
            <div
              key={s.id}
              className="flex items-center justify-between gap-4 py-3 px-3 rounded-xl hover:bg-slate-800/40 transition group"
            >
              {/* Slide Number & Title */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-700 text-amber-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>

                <div className="flex-1 min-w-0">
                  {editingId === s.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="bg-slate-950 border border-amber-500 rounded px-2 py-1 text-xs text-white w-full"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveTitle(s.id)}
                        className="p-1 bg-amber-500 text-slate-950 rounded text-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p
                        onClick={() => {
                          onSelectSlide(idx);
                          onClose();
                        }}
                        className="text-xs md:text-sm font-semibold text-slate-200 truncate cursor-pointer hover:text-amber-400 transition"
                      >
                        {s.title}
                      </p>
                      <button
                        onClick={() => {
                          setEditingId(s.id);
                          setEditedTitle(s.title);
                        }}
                        className="text-slate-500 hover:text-amber-400 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                    <span className="capitalize">{s.type}</span>
                    {s.images && s.images.length > 0 && (
                      <span>• {s.images.length} صور موثقة</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleMoveUp(idx)}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition"
                  title="تحريك لأعلى"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleMoveDown(idx)}
                  disabled={idx === slides.length - 1}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition"
                  title="تحريك لأسفل"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDuplicate(s)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="تكرار الشريحة"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition"
                  title="حذف الشريحة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
