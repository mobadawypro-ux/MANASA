import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, PlusCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { ReportSlide, SlideImage } from '../types/report';

interface ImageUploadModalProps {
  slides: ReportSlide[];
  currentSlideId?: string;
  isOpen: boolean;
  onClose: () => void;
  onAddImageToSlide: (slideId: string, image: SlideImage) => void;
  onCreateNewPhotoSlide: (title: string, subTitle: string, image: SlideImage, layout: 'single' | 'two-column' | 'three-column') => void;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  slides,
  currentSlideId,
  isOpen,
  onClose,
  onAddImageToSlide,
  onCreateNewPhotoSlide
}) => {
  const [mode, setMode] = useState<'existing' | 'new-slide'>('existing');
  const [selectedSlideId, setSelectedSlideId] = useState<string>(currentSlideId || slides[5]?.id || slides[0]?.id || '');
  const [newSlideTitle, setNewSlideTitle] = useState('أعمال جديدة في الموقع');
  const [newSlideSubTitle, setNewSlideSubTitle] = useState('الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر');
  const [layout, setLayout] = useState<'single' | 'two-column' | 'three-column'>('two-column');
  
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [previewError, setPreviewError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const photoSlides = slides.filter(s => s.type === 'photos' || s.type === 'custom');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImageUrl(result);
      if (!caption) {
        setCaption(file.name.replace(/\.[^/.]+$/, ''));
      }
      setIsUploading(false);
      setPreviewError(false);
    };
    reader.onerror = () => {
      alert('حدث خطأ أثناء قراءة الصورة');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      alert('يرجى رفع صورة أو إدخال رابط الصورة');
      return;
    }

    const newImage: SlideImage = {
      id: `img-${Date.now()}`,
      url: imageUrl.trim(),
      caption: caption.trim() || 'صورة توثيقية للأعمال الميدانية',
      description: description.trim()
    };

    if (mode === 'new-slide') {
      onCreateNewPhotoSlide(newSlideTitle, newSlideSubTitle, newImage, layout);
    } else {
      if (!selectedSlideId) {
        alert('يرجى اختيار الشريحة المستهدفة');
        return;
      }
      onAddImageToSlide(selectedSlideId, newImage);
    }

    // Reset and close
    setImageUrl('');
    setCaption('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden text-right">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2 text-amber-400">
            <PlusCircle className="w-5 h-5" />
            <h3 className="font-bold text-lg text-white">إضافة وتوثيق صور جديدة للعرض التقديمي</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Target choice */}
          <div className="grid grid-cols-2 gap-3 p-1 bg-slate-950/70 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setMode('existing')}
              className={`py-2 px-4 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2 ${
                mode === 'existing'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              إضافة لشريحة موجودة
            </button>
            <button
              type="button"
              onClick={() => setMode('new-slide')}
              className={`py-2 px-4 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2 ${
                mode === 'new-slide'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              إنشاء شريحة صور جديدة
            </button>
          </div>

          {mode === 'existing' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                اختر الشريحة المستهدفة:
              </label>
              <select
                value={selectedSlideId}
                onChange={(e) => setSelectedSlideId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {slides.map((s) => (
                  <option key={s.id} value={s.id}>
                    شريحة {s.slideNumber}: {s.title} ({s.type === 'photos' ? `${s.images?.length || 0} صور` : s.type})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  عنوان الشريحة الجديدة:
                </label>
                <input
                  type="text"
                  value={newSlideTitle}
                  onChange={(e) => setNewSlideTitle(e.target.value)}
                  placeholder="مثال: أعمال صب واستكمال رقاب الأعمدة"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    العنوان الفرعي:
                  </label>
                  <input
                    type="text"
                    value={newSlideSubTitle}
                    onChange={(e) => setNewSlideSubTitle(e.target.value)}
                    placeholder="الأعمال التي تمت حتى التاريخ..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    تخطيط الصور بالشريحة:
                  </label>
                  <select
                    value={layout}
                    onChange={(e) => setLayout(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="single">صورة واحدة بانورامية (Single Wide)</option>
                    <option value="two-column">صورتان متجاورتان (2 Columns)</option>
                    <option value="three-column">ثلاث صور متجاورة (3 Columns)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Upload Drop Zone & URL */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              الصورة (رفع من جهازك أو لصق رابط):
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex-1 border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-xl p-4 text-center cursor-pointer bg-slate-950/40 hover:bg-slate-950/80 transition flex flex-col items-center justify-center gap-2">
                <Upload className="w-6 h-6 text-amber-400" />
                <span className="text-xs font-medium text-slate-200">
                  {isUploading ? 'جاري تحميل الصورة...' : 'اضغط لاختيار صورة من جهازك'}
                </span>
                <span className="text-[10px] text-slate-400">JPG, PNG, WebP</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="flex-1 flex flex-col justify-center gap-2">
                <span className="text-xs text-slate-400">أو أدخل رابط الصورة المباشر:</span>
                <input
                  type="url"
                  value={imageUrl.startsWith('data:') ? '[صورة مرفوعة محلياً جاهزة]' : imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setPreviewError(false);
                  }}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Preview */}
            {imageUrl && !previewError && (
              <div className="relative mt-2 p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-4">
                <img
                  src={imageUrl}
                  alt="معاينة"
                  className="w-20 h-20 object-cover rounded-lg border border-slate-700"
                  onError={() => setPreviewError(true)}
                />
                <div className="flex-1 text-xs">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    تم تجهيز الصورة بنجاح
                  </span>
                  <p className="text-slate-400 mt-1 line-clamp-1">{caption || 'بدون عنوان حتى الآن'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="text-red-400 hover:text-red-300 text-xs px-2 py-1 bg-red-950/40 rounded border border-red-800"
                >
                  إلغاء
                </button>
              </div>
            )}
          </div>

          {/* Caption & Description */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                تسمية الصورة (التعليق الهندسي الرئيسي):
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="مثال: أعمال صب القواعد العادية بالمضخة وسيارات الخلاطة"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ملاحظات وتفاصيل إضافية (اختياري):
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="مثال: تم استخدام خرسانة مقاومة للكبريتات SRC واختبار الهبوط Slump Test مطابق للمواصفات."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={!imageUrl}
              className="px-6 py-2 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              حفظ وإضافة للعرض
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
