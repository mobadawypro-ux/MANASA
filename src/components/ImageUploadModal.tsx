import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  PlusCircle, 
  CheckCircle2, 
  Sparkles,
  Camera,
  Link2,
  HelpCircle,
  FileImage,
  Globe,
  Radio,
  AlertCircle
} from 'lucide-react';
import { ReportSlide, SlideImage, ProjectInfo } from '../types/report';
import { useTheme } from '../context/ThemeContext';
import { getDirectImageLink, uploadToCloudinary, testCloudinaryConnection } from '../firebase/reportsService';

interface ImageUploadModalProps {
  slides: ReportSlide[];
  currentSlideId?: string;
  projectInfo: ProjectInfo;
  isOpen: boolean;
  onClose: () => void;
  onAddImageToSlide: (slideId: string, image: SlideImage) => void;
  onCreateNewPhotoSlide: (title: string, subTitle: string, image: SlideImage, layout: 'single' | 'two-column' | 'three-column', facility?: string) => void;
  onUpdateCloudinaryConfig?: (cloudName: string, preset: string) => void;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  slides,
  currentSlideId,
  projectInfo,
  isOpen,
  onClose,
  onAddImageToSlide,
  onCreateNewPhotoSlide,
  onUpdateCloudinaryConfig
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [mode, setMode] = useState<'existing' | 'new-slide'>('existing');
  const [selectedSlideId, setSelectedSlideId] = useState<string>('');
  const [newSlideTitle, setNewSlideTitle] = useState('أعمال جديدة في الموقع');
  const [newSlideSubTitle, setNewSlideSubTitle] = useState('الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر');
  const [newSlideFacility, setNewSlideFacility] = useState('هنجر الشكاير 1');
  const [layout, setLayout] = useState<'single' | 'two-column' | 'three-column'>('two-column');
  
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [previewError, setPreviewError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showCloudinaryConfig, setShowCloudinaryConfig] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isCloudinaryHosted, setIsCloudinaryHosted] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  // Cloudinary credentials form
  const [customCloudName, setCustomCloudName] = useState(projectInfo.cloudinaryCloudName || '');
  const [customUploadPreset, setCustomUploadPreset] = useState(projectInfo.cloudinaryUploadPreset || '');
  const [isTestingCloud, setIsTestingCloud] = useState(false);
  const [cloudTestResult, setCloudTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Sync selectedSlideId and reset fields when modal opens
  React.useEffect(() => {
    if (isOpen) {
      // Smart default target selection: prefer the current slide if it is a photo slide;
      // otherwise prefer the first photo slide so user images are never lost on cover/boq/timeline slides!
      const curr = slides.find(s => s.id === currentSlideId);
      const firstPhoto = slides.find(s => s.type === 'photos');
      const targetId = (curr && curr.type === 'photos')
        ? curr.id
        : (firstPhoto?.id || currentSlideId || slides[0]?.id || '');

      setSelectedSlideId(targetId);
      setMode('existing');
      setImageUrl('');
      setCaption('');
      setDescription('');
      setFileName('');
      setShowUrlInput(false);
      setIsCloudinaryHosted(false);
      setUploadNotice(null);
      setNewSlideFacility('هنجر الشكاير 1');
      setCustomCloudName(projectInfo.cloudinaryCloudName || '');
      setCustomUploadPreset(projectInfo.cloudinaryUploadPreset || '');
      setCloudTestResult(null);
    }
  }, [isOpen, currentSlideId, slides, projectInfo]);

  if (!isOpen) return null;

  const handleTestCloud = async () => {
    if (!customCloudName.trim() || !customUploadPreset.trim()) {
      setCloudTestResult({
        success: false,
        message: 'يرجى إدخال اسم السحابة والـ Upload Preset أولاً.'
      });
      return;
    }
    setIsTestingCloud(true);
    setCloudTestResult(null);
    try {
      const res = await testCloudinaryConnection(customCloudName, customUploadPreset);
      setCloudTestResult(res);
      if (res.success && onUpdateCloudinaryConfig) {
        onUpdateCloudinaryConfig(customCloudName.trim(), customUploadPreset.trim());
      }
    } catch (e: any) {
      setCloudTestResult({ success: false, message: e?.message || 'تعذر فحص الاتصال' });
    } finally {
      setIsTestingCloud(false);
    }
  };

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
    setFileName(file.name);
    setUploadNotice('جاري قراءة وضغط الصورة للمشروع...');
    setIsCloudinaryHosted(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // High quality highly compressed responsive canvas sizing (saves storage, fast mobile load, fits Firestore limits)
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
          targetImg = canvas.toDataURL('image/jpeg', 0.65); // High-efficiency compression ~25KB
        }

        if (!caption) {
          setCaption(file.name.replace(/\.[^/.]+$/, ''));
        }

        // If Cloudinary credentials are set, attempt direct cloud upload
        const activeCloud = customCloudName.trim() || projectInfo?.cloudinaryCloudName;
        const activePreset = customUploadPreset.trim() || projectInfo?.cloudinaryUploadPreset;

        if (activeCloud && activePreset) {
          uploadToCloudinary(targetImg, activeCloud, activePreset)
            .then((cloudinaryUrl) => {
              setImageUrl(cloudinaryUrl);
              setIsCloudinaryHosted(true);
              setIsUploading(false);
              setPreviewError(false);
              setUploadNotice('تم رفع الصورة إلى سحابة Cloudinary بنجاح (تخزين دائم فائق السرعة).');
              if (onUpdateCloudinaryConfig) {
                onUpdateCloudinaryConfig(activeCloud, activePreset);
              }
            })
            .catch((err) => {
              console.warn('Cloudinary upload notice (using compressed local fallback):', err?.message || err);
              setImageUrl(targetImg);
              setIsCloudinaryHosted(false);
              setIsUploading(false);
              setPreviewError(false);
              setUploadNotice('تم ضغط وتجهيز الصورة محلياً بنجاح (حجم خفيف فائق السرعة ~25 KB).');
            });
        } else {
          // Compressed local fallback
          setImageUrl(targetImg);
          setIsCloudinaryHosted(false);
          setIsUploading(false);
          setPreviewError(false);
          setUploadNotice('تم تجهيز الصورة وضغطها بأبعاد مثالية للعرض وبحجم خفيف جداً.');
        }
      };

      img.onerror = () => {
        setIsUploading(false);
        setUploadNotice('تعذر فك تشفير الصورة المحددة. إذا كانت الصورة بصيغة HEIC من هاتف آيفون، يرجى اختيارها بصيغة JPG أو تجربة صورة أخرى.');
      };

      img.src = dataUrl;
    };

    reader.onerror = () => {
      alert('حدث خطأ أثناء قراءة ملف الصورة من الجهاز');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      alert('يرجى اختيار صورة من جهازك أولاً');
      return;
    }

    const finalUrl = getDirectImageLink(imageUrl.trim());
    const newImage: SlideImage = {
      id: `img-${Date.now()}`,
      url: finalUrl,
      caption: caption.trim() || 'صورة توثيقية للأعمال الميدانية',
      description: description.trim()
    };

    if (mode === 'new-slide') {
      onCreateNewPhotoSlide(newSlideTitle, newSlideSubTitle, newImage, layout, newSlideFacility);
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
    setFileName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className={`w-full max-w-2xl rounded-3xl shadow-2xl border overflow-hidden text-right transition-colors duration-200 ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
      }`}>
        {/* Modal Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isLight ? 'bg-gradient-to-r from-amber-50 to-blue-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg">إضافة وتوثيق صور جديدة</h3>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                اختر صورة من هاتفك أو جهازك لتوثيق الأعمال الميدانية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isLight ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-500' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-400'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Target choice */}
          <div className={`grid grid-cols-2 gap-2 p-1.5 rounded-2xl border ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/70 border-slate-800'
          }`}>
            <button
              type="button"
              onClick={() => setMode('existing')}
              className={`py-2 px-4 rounded-xl font-bold text-xs md:text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'existing'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              إضافة لشريحة موجودة
            </button>
            <button
              type="button"
              onClick={() => setMode('new-slide')}
              className={`py-2 px-4 rounded-xl font-bold text-xs md:text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'new-slide'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              إنشاء شريحة صور جديدة
            </button>
          </div>

          {mode === 'existing' ? (
            <div className="space-y-2">
              <label className={`block text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                اختر الشريحة المستهدفة لإضافة الصورة إليها:
              </label>
              <select
                value={selectedSlideId}
                onChange={(e) => setSelectedSlideId(e.target.value)}
                className={`w-full rounded-xl px-3 py-2.5 text-xs md:text-sm border focus:outline-none focus:border-amber-500 font-medium ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-slate-200'
                }`}
              >
                <optgroup label="📸 شرائح التوثيق الميداني بالصور (موصى بها)">
                  {slides.filter((s) => s.type === 'photos').map((s) => (
                    <option key={s.id} value={s.id}>
                      شريحة {s.slideNumber}: {s.title} ({s.images?.length || 0} صور حالياً) • [{s.facility || 'عام'}]
                    </option>
                  ))}
                </optgroup>
                <optgroup label="📋 باقي شرائح المشروع (سيتم تحويلها لشريحة صور)">
                  {slides.filter((s) => s.type !== 'photos').map((s) => (
                    <option key={s.id} value={s.id}>
                      شريحة {s.slideNumber}: {s.title} ({s.type === 'cover' ? 'غلاف' : s.type === 'timeline' ? 'مخطط زمني' : s.type === 'boq' ? 'مقايسة' : s.type})
                    </option>
                  ))}
                </optgroup>
              </select>

              {(() => {
                const s = slides.find((item) => item.id === selectedSlideId);
                return s ? (
                  <div className={`p-2 rounded-xl text-xs flex items-center justify-between border ${
                    isLight ? 'bg-amber-50/70 border-amber-200 text-amber-900' : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                  }`}>
                    <span>الشريحة المختارة: <strong>شريحة رقم {s.slideNumber}</strong> ({s.images?.length || 0} صور موجودة)</span>
                    <span className="font-bold">المنطقة الهندسية: {s.facility || 'عام - كامل المشروع'}</span>
                  </div>
                ) : null;
              })()}
            </div>
          ) : (
            <div className={`space-y-3 p-4 rounded-2xl border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-slate-800'
            }`}>
              <div>
                <label className={`block text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  عنوان الشريحة الجديدة:
                </label>
                <input
                  type="text"
                  value={newSlideTitle}
                  onChange={(e) => setNewSlideTitle(e.target.value)}
                  placeholder="مثال: أعمال صب واستكمال رقاب الأعمدة"
                  className={`w-full rounded-xl px-3 py-2 text-xs md:text-sm border focus:outline-none focus:border-amber-500 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-slate-200'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className={`block text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    المنطقة الهندسية:
                  </label>
                  <select
                    value={newSlideFacility}
                    onChange={(e) => setNewSlideFacility(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 text-xs md:text-sm border focus:outline-none focus:border-amber-500 ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-slate-200'
                    }`}
                  >
                    <option value="هنجر الشكاير 1">هنجر الشكاير 1</option>
                    <option value="هنجر الشكاير 2">هنجر الشكاير 2</option>
                    <option value="هنجر المعدات">هنجر المعدات</option>
                    <option value="مغسلة المعدات">مغسلة المعدات</option>
                    <option value="عام - كامل المشروع">عام - كامل المشروع</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    العنوان الفرعي:
                  </label>
                  <input
                    type="text"
                    value={newSlideSubTitle}
                    onChange={(e) => setNewSlideSubTitle(e.target.value)}
                    placeholder="الأعمال التي تمت حتى التاريخ..."
                    className={`w-full rounded-xl px-3 py-2 text-xs md:text-sm border focus:outline-none focus:border-amber-500 ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-slate-200'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    تخطيط الصور بالشريحة:
                  </label>
                  <select
                    value={layout}
                    onChange={(e) => setLayout(e.target.value as any)}
                    className={`w-full rounded-xl px-3 py-2 text-xs md:text-sm border focus:outline-none focus:border-amber-500 ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-slate-200'
                    }`}
                  >
                    <option value="single">صورة واحدة عريضة (Single Wide)</option>
                    <option value="two-column">صورتان متجاورتان (2 Columns)</option>
                    <option value="three-column">ثلاث صور متجاورة (3 Columns)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Primary Upload Area (From Device / Camera) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                اختيار الصورة:
              </label>
              <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                مباشرة من الهاتف أو الحاسوب
              </span>
            </div>

            {/* Direct Device File Upload Box (Recommended) */}
            <label className={`block border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition relative group ${
              isLight
                ? 'border-amber-400/80 bg-amber-50/40 hover:bg-amber-50/80 text-slate-800'
                : 'border-amber-500/50 bg-slate-950/40 hover:bg-slate-950/80 text-slate-200'
            }`}>
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="font-bold text-sm text-amber-700 dark:text-amber-400">
                  {isUploading ? 'جاري قراءة وضغط الصورة...' : 'اضغط هنا لاختيار صورة من جهازك / الكاميرا'}
                </span>
                <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  يدعم صور الكاميرا والمكتبة (JPG, PNG, WebP) - لا تحتاج إلى أي رابط!
                </span>
              </div>
              <input
                type="file"
                accept="image/*,.jpg,.jpeg,.png,.webp,.heic,.heif"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Preview Card */}
            {imageUrl && !previewError && (
              <div className={`p-3 rounded-2xl border flex items-center gap-4 ${
                isLight ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
              }`}>
                <img
                  src={imageUrl}
                  alt="معاينة"
                  className="w-16 h-16 object-cover rounded-xl border border-emerald-400/50 shadow-sm"
                  onError={() => setPreviewError(true)}
                />
                <div className="flex-1 text-xs">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    تم تجهيز الصورة بنجاح وتجهيز أبعادها
                  </span>
                  <p className="text-[11px] opacity-80 mt-1 line-clamp-1">
                    {fileName || caption || 'صورة جاهزة للإضافة'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl('');
                    setFileName('');
                  }}
                  className="text-xs px-2.5 py-1 bg-red-600/10 hover:bg-red-600/20 text-red-600 rounded-lg border border-red-500/20 transition cursor-pointer font-bold"
                >
                  تغيير
                </button>
              </div>
            )}

            {/* Notice / Status Card */}
            {uploadNotice && (
              <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                isCloudinaryHosted
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}>
                {isCloudinaryHosted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <span>{uploadNotice}</span>
              </div>
            )}

            {/* Cloudinary Direct Cloud Account Settings Toggle */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowCloudinaryConfig(!showCloudinaryConfig)}
                className={`text-xs flex items-center gap-1.5 transition cursor-pointer font-bold ${
                  customCloudName && customUploadPreset
                    ? 'text-emerald-500 hover:text-emerald-400'
                    : isLight ? 'text-amber-700 hover:text-amber-900' : 'text-amber-400 hover:text-amber-300'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>
                  {showCloudinaryConfig
                    ? 'إخفاء إعدادات سحابة Cloudinary'
                    : customCloudName && customUploadPreset
                    ? `⚙️ سحابة Cloudinary مفعلة (${customCloudName}) - انقر للتعديل أو الفحص`
                    : '⚡ هل تريد رفع الصور مباشرة إلى حساب Cloudinary الخاص بك؟ انقر هنا لربطه'}
                </span>
              </button>

              {showCloudinaryConfig && (
                <div className={`mt-2 p-4 rounded-2xl border space-y-3 animate-fadeIn ${
                  isLight ? 'bg-amber-50/60 border-amber-200' : 'bg-slate-950/80 border-slate-800'
                }`}>
                  <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    عند إدخال إعدادات سحابة Cloudinary، يتم رفع كل صورة تختارها مباشرة إلى السحابة فوراً وتحويلها لرابط دائم فائق السرعة، مما يضمن ظهورها لجميع الزوار على الهواتف فوراً دون استهلاك سعة التقرير.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold mb-1">اسم السحابة (Cloud Name):</label>
                      <input
                        type="text"
                        value={customCloudName}
                        onChange={(e) => {
                          setCustomCloudName(e.target.value);
                          setCloudTestResult(null);
                        }}
                        placeholder="مثال: my-cloud"
                        className={`w-full rounded-xl px-3 py-1.5 text-xs border font-mono ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold mb-1">الـ Upload Preset (Unsigned):</label>
                      <input
                        type="text"
                        value={customUploadPreset}
                        onChange={(e) => {
                          setCustomUploadPreset(e.target.value);
                          setCloudTestResult(null);
                        }}
                        placeholder="مثال: cement_preset"
                        className={`w-full rounded-xl px-3 py-1.5 text-xs border font-mono ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleTestCloud}
                      disabled={isTestingCloud}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700 disabled:opacity-50"
                    >
                      <Radio className={`w-3.5 h-3.5 text-amber-400 ${isTestingCloud ? 'animate-pulse' : ''}`} />
                      <span>{isTestingCloud ? 'جاري الفحص...' : 'فحص الاتصال بالسحابة الآن'}</span>
                    </button>

                    {onUpdateCloudinaryConfig && (
                      <button
                        type="button"
                        onClick={() => {
                          if (customCloudName && customUploadPreset) {
                            onUpdateCloudinaryConfig(customCloudName.trim(), customUploadPreset.trim());
                            alert('تم حفظ إعدادات Cloudinary في المشروع بنجاح!');
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition cursor-pointer"
                      >
                        حفظ الإعدادات للمشروع
                      </button>
                    )}
                  </div>

                  {cloudTestResult && (
                    <div className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 ${
                      cloudTestResult.success
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                        : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                    }`}>
                      {cloudTestResult.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <span className="leading-relaxed">{cloudTestResult.message}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Secondary/Optional: External URL Section (Only if needed) */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className={`text-xs flex items-center gap-1.5 transition cursor-pointer ${
                  isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>{showUrlInput ? 'إخفاء خيار رابط الإنترنت (URL)' : 'أو هل لديك رابط صورة جاهز على الإنترنت (Google Drive أو غيره)؟ اضغط هنا'}</span>
              </button>

              {showUrlInput && (
                <div className={`mt-2 p-3 rounded-xl border space-y-2 animate-fadeIn ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
                }`}>
                  <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    <strong>روابط Google Drive أو الروابط المباشرة:</strong> يمكنك نسخ رابط أي صورة مشاركة من Google Drive أو موقع استضافة ولصقه هنا مباشرة.
                  </p>
                  <input
                    type="url"
                    value={imageUrl.startsWith('data:') ? '' : imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setPreviewError(false);
                      setFileName('صورة عبر رابط خارجي');
                    }}
                    placeholder="https://drive.google.com/file/d/... أو https://res.cloudinary.com/..."
                    className={`w-full rounded-xl px-3 py-2 text-xs border focus:outline-none focus:border-amber-500 ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Caption & Description */}
          <div className="space-y-3">
            <div>
              <label className={`block text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                تسمية الصورة (التعليق الهندسي الرئيسي):
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="مثال: أعمال صب القواعد العادية بالمضخة وسيارات الخلاطة"
                className={`w-full rounded-xl px-3 py-2 text-xs md:text-sm border focus:outline-none focus:border-amber-500 ${
                  isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-slate-200'
                }`}
                required
              />
            </div>
            <div>
              <label className={`block text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                ملاحظات وتفاصيل إضافية (اختياري):
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="مثال: تم استخدام خرسانة مقاومة للكبريتات SRC واختبار الهبوط Slump Test مطابق للمواصفات."
                className={`w-full rounded-xl px-3 py-2 text-xs border focus:outline-none focus:border-amber-500 resize-none ${
                  isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-slate-200'
                }`}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className={`flex items-center justify-end gap-3 pt-4 border-t ${
            isLight ? 'border-slate-200' : 'border-slate-800'
          }`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition cursor-pointer border ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={!imageUrl}
              className="px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 shadow-md shadow-amber-500/20 transition cursor-pointer flex items-center gap-2"
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
