import React, { useState, useEffect } from 'react';
import { SlideImage, ReportSlide, ProjectInfo } from '../types/report';
import { useTheme } from '../context/ThemeContext';
import { uploadToCloudinary } from '../firebase/reportsService';
import { 
  X, 
  Save, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  ArrowRightLeft, 
  AlertCircle, 
  Check, 
  Layers,
  Sparkles
} from 'lucide-react';

interface EditImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  slideId: string;
  image: SlideImage | null;
  slides: ReportSlide[];
  projectInfo: ProjectInfo;
  onSave: (
    originalSlideId: string,
    imageId: string,
    updatedImage: SlideImage,
    targetSlideId?: string
  ) => void;
  onDelete?: (slideId: string, imageId: string) => void;
}

export const EditImageModal: React.FC<EditImageModalProps> = ({
  isOpen,
  onClose,
  slideId,
  image,
  slides,
  projectInfo,
  onSave,
  onDelete
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [targetSlideId, setTargetSlideId] = useState(slideId);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState(false);

  // Sync state whenever modal opens or image changes
  useEffect(() => {
    if (image && isOpen) {
      setCaption(image.caption || '');
      setDescription(image.description || '');
      setImageUrl(image.url || '');
      setTargetSlideId(slideId);
      setUploadNotice(null);
      setPreviewError(false);
    }
  }, [image, slideId, isOpen]);

  if (!isOpen || !image) return null;

  const currentSlide = slides.find((s) => s.id === slideId);

  // Handle uploading replacement photo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const isImageFile = file.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|bmp|heic|heif|svg)$/i.test(file.name);
    if (!isImageFile) {
      alert('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)');
      return;
    }

    setIsUploading(true);
    setUploadNotice('جاري قراءة وضغط الصورة البديلة...');

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 900;
        const MAX_HEIGHT = 700;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width / height > MAX_WIDTH / MAX_HEIGHT) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          } else {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        let targetImg = dataUrl;

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          targetImg = canvas.toDataURL('image/jpeg', 0.65);
        }

        // If Cloudinary credentials are set, attempt direct cloud upload
        const activeCloud = projectInfo?.cloudinaryCloudName;
        const activePreset = projectInfo?.cloudinaryUploadPreset;

        if (activeCloud && activePreset) {
          uploadToCloudinary(targetImg, activeCloud, activePreset)
            .then((cloudinaryUrl) => {
              setImageUrl(cloudinaryUrl);
              setIsUploading(false);
              setPreviewError(false);
              setUploadNotice('تم رفع الصورة البديلة إلى سحابة Cloudinary بنجاح.');
            })
            .catch(() => {
              setImageUrl(targetImg);
              setIsUploading(false);
              setPreviewError(false);
              setUploadNotice('تم ضغط الصورة البديلة وتجهيزها بنجاح (~25 KB).');
            });
        } else {
          setImageUrl(targetImg);
          setIsUploading(false);
          setPreviewError(false);
          setUploadNotice('تم ضغط وتجهيز الصورة البديلة محلياً بنجاح (~25 KB).');
        }
      };
      img.onerror = () => {
        setImageUrl(dataUrl);
        setIsUploading(false);
        setUploadNotice('تم تحميل الصورة بنجاح.');
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) {
      alert('يرجى إدخال عنوان أو بيان توضيحي للصورة');
      return;
    }
    if (!imageUrl.trim()) {
      alert('يرجى توفير رابط أو ملف للصورة');
      return;
    }

    const updated: SlideImage = {
      id: image.id,
      url: imageUrl.trim(),
      caption: caption.trim(),
      description: description.trim() || undefined
    };

    onSave(slideId, image.id, updated, targetSlideId);
    onClose();
  };

  const handleDelete = () => {
    if (confirm('هل أنت متأكد من حذف هذه الصورة نهائياً من التقرير؟')) {
      if (onDelete) {
        onDelete(slideId, image.id);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto select-none animate-fadeIn">
      <div 
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden transition-all my-8 ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-700/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">تعديل بيانات وتفاصيل الصورة</h3>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {currentSlide ? `الشريحة #${currentSlide.slideNumber}: ${currentSlide.title}` : 'شريحة التقرير'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl border transition cursor-pointer ${
              isLight ? 'border-slate-200 hover:bg-slate-100 text-slate-500' : 'border-slate-800 hover:bg-slate-800 text-slate-400'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-right">
          {/* Image Preview & Replacement Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            {/* Preview Box */}
            <div className="sm:col-span-1">
              <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                معاينة الصورة:
              </label>
              <div className={`relative aspect-4/3 w-full rounded-xl overflow-hidden border shadow-inner flex items-center justify-center ${
                isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
              }`}>
                {previewError || !imageUrl ? (
                  <div className="text-center p-3 text-rose-500 text-xs">
                    <AlertCircle className="w-6 h-6 mx-auto mb-1 opacity-70" />
                    <span>تعذر تحميل الصورة</span>
                  </div>
                ) : (
                  <img
                    src={imageUrl}
                    alt={caption || 'معاينة الصورة'}
                    className="w-full h-full object-cover"
                    onError={() => setPreviewError(true)}
                  />
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-amber-400 text-xs font-bold animate-pulse">
                    جاري المعالجة...
                  </div>
                )}
              </div>
            </div>

            {/* Replace Photo Actions */}
            <div className="sm:col-span-2 space-y-2.5">
              <label className={`block text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                استبدال الصورة الحالية (اختياري):
              </label>
              
              <label className={`flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-xl cursor-pointer transition ${
                isLight 
                  ? 'border-amber-400/80 bg-amber-50/50 hover:bg-amber-100/50 text-slate-700' 
                  : 'border-amber-500/40 bg-slate-800/60 hover:bg-slate-800 text-slate-200'
              }`}>
                <Upload className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold">رفع صورة بديلة من جهازك</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">أو إدخال رابط مباشر للصورة:</label>
                <div className="relative">
                  <LinkIcon className="w-3.5 h-3.5 absolute right-3 top-3 text-slate-400" />
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setPreviewError(false);
                    }}
                    placeholder="https://..."
                    className={`w-full pr-8 pl-3 py-2 text-xs rounded-xl border font-mono ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                    }`}
                  />
                </div>
              </div>

              {uploadNotice && (
                <p className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>{uploadNotice}</span>
                </p>
              )}
            </div>
          </div>

          <hr className="border-slate-700/30" />

          {/* Caption / Title */}
          <div>
            <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              عنوان وبيان الصورة الأساسي <span className="text-rose-500">*</span>:
            </label>
            <input
              type="text"
              required
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="مثال: أعمال صب الخرسانة المسلحة للقواعد"
              className={`w-full p-2.5 text-xs sm:text-sm rounded-xl border font-bold focus:outline-none focus:border-amber-500 ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
              }`}
            />
          </div>

          {/* Description */}
          <div>
            <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              الوصف التفصيلي / الملاحظات الهندسية (اختياري):
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مثال: المتابعة بأجهزة المساحة والميزان المساحي الميداني وتأكيد استواء القاع..."
              className={`w-full p-2.5 text-xs rounded-xl border focus:outline-none focus:border-amber-500 ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
              }`}
            />
          </div>

          {/* Move to another slide option */}
          <div>
            <label className={`block text-xs font-bold mb-1.5 flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              <ArrowRightLeft className="w-3.5 h-3.5 text-blue-500" />
              <span>نقل الصورة إلى شريحة أخرى:</span>
            </label>
            <select
              value={targetSlideId}
              onChange={(e) => setTargetSlideId(e.target.value)}
              className={`w-full p-2.5 text-xs rounded-xl border cursor-pointer focus:outline-none focus:border-amber-500 ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
              }`}
            >
              {slides
                .filter((s) => s.type === 'photos' || s.id === slideId)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    شريحة #{s.slideNumber}: {s.title} ({s.facility || 'عام'}) {s.id === slideId ? '• [الشريحة الحالية]' : ''}
                  </option>
                ))}
            </select>
            {targetSlideId !== slideId && (
              <p className="text-[11px] text-blue-500 font-semibold mt-1">
                ℹ️ سيتم نقل هذه الصورة من الشريحة الحالية إلى الشريحة المختارة مباشرة عند الحفظ.
              </p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-700/30 gap-3">
            {onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3.5 py-2 rounded-xl text-rose-500 hover:bg-rose-500/10 border border-rose-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="حذف هذه الصورة"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف الصورة</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  isLight ? 'border-slate-300 hover:bg-slate-100 text-slate-700' : 'border-slate-700 hover:bg-slate-800 text-slate-300'
                }`}
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isUploading || !caption.trim() || !imageUrl.trim()}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
