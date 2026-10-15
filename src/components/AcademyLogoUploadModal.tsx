import React, { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { AcademyLogo } from './AcademyLogo';
import { savePublicBranding, uploadToCloudinary } from '../firebase/reportsService';
import { 
  Upload, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Trash2, 
  Save, 
  X, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw,
  Globe,
  ShieldCheck
} from 'lucide-react';

interface AcademyLogoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLogoUrl?: string;
  onSaveLogo: (logoUrl: string) => void;
}

export const AcademyLogoUploadModal: React.FC<AcademyLogoUploadModalProps> = ({
  isOpen,
  onClose,
  currentLogoUrl,
  onSaveLogo
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { isAdmin } = useAuth();

  const [previewUrl, setPreviewUrl] = useState<string>(currentLogoUrl || '');
  const [urlInput, setUrlInput] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Optimize and resize image file to base64
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorNotice('يرجى اختيار ملف صورة صالح (PNG, JPG, SVG, WebP).');
      return;
    }

    setErrorNotice(null);
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to resize to reasonable dimensions (max 500x500)
        const canvas = document.createElement('canvas');
        const maxDim = 500;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/png', 0.9);
          setPreviewUrl(compressedDataUrl);
        } else {
          setPreviewUrl(e.target?.result as string);
        }
        setIsUploading(false);
      };
      img.onerror = () => {
        setIsUploading(false);
        setErrorNotice('تعذر قراءة الصورة. يرجى تجربة ملف آخر.');
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      setPreviewUrl(urlInput.trim());
      setUrlInput('');
      setErrorNotice(null);
    }
  };

  const handleSave = async () => {
    if (!isAdmin) {
      setErrorNotice('عفواً، يجب تسجيل الدخول كمسؤول (أدمن) لحفظ وتعميم الشعار.');
      return;
    }

    setIsUploading(true);
    setErrorNotice(null);

    try {
      let finalUrl = previewUrl;

      // Automatically upload local Base64 logo to Cloudinary to save Firestore quota space!
      if (finalUrl.startsWith('data:image/')) {
        try {
          finalUrl = await uploadToCloudinary(finalUrl);
        } catch (cloudinaryErr: any) {
          console.warn('Failed to upload logo to Cloudinary, saving as base64 fallback:', cloudinaryErr);
        }
      }

      // 1. Save locally
      try {
        localStorage.setItem('cement_app_academy_logo_v1', finalUrl);
      } catch (e) {}

      // 2. Save to Firestore public_config/branding for all visitors
      await savePublicBranding(finalUrl);

      // 3. Callback to update project state
      onSaveLogo(finalUrl);

      setSuccessNotice('تم حفظ واعتماد شعار الأكاديمية بنجاح! سيظهر الآن لجميع الزوار فوراً.');
      setTimeout(() => {
        setSuccessNotice(null);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorNotice('حدث خطأ أثناء حفظ الشعار، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleResetToDefault = async () => {
    setPreviewUrl('');
    try {
      localStorage.removeItem('cement_app_academy_logo_v1');
      await savePublicBranding('');
    } catch (e) {}
    onSaveLogo('');
    setSuccessNotice('تمت استعادة الشعار الرسمي المتجهي (Vector SVG) للأكاديمية العربية.');
    setTimeout(() => {
      setSuccessNotice(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden transition-all duration-200 ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
        }`}
      >
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${
          isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950/60'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base">رفع وتخصيص شعار الأكاديمية العربية</h3>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                تحديث الشعار وحفظه سحابياً ليصبح مرئياً فورياً لأي زائر
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition cursor-pointer ${
              isLight ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Public Visibility Banner */}
          <div className={`p-3.5 rounded-2xl border flex items-center gap-3 text-xs leading-relaxed ${
            isLight ? 'bg-blue-50/80 border-blue-200 text-blue-900' : 'bg-blue-950/40 border-blue-800/80 text-blue-200'
          }`}>
            <Globe className="w-5 h-5 text-blue-500 shrink-0" />
            <span>
              <strong>مرئي لكافة الزوار:</strong> بمجرد رفع الشعار وحفظه، سيتم تخزينه في السحابة ومزامنته تلقائياً ليظهر لكل من يتصفح رابط التقرير في كافة الشرائح والجداول والترويسة.
            </span>
          </div>

          {/* Feedback Notices */}
          {successNotice && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{successNotice}</span>
            </div>
          )}

          {errorNotice && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl flex items-center gap-2 animate-fadeIn">
              <X className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* Upload Dropzone */}
          <div>
            <label className="block text-xs font-bold mb-2">1. اختيار ملف صورة من جهازك:</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  processImageFile(e.dataTransfer.files[0]);
                }
              }}
              className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group ${
                isLight
                  ? 'border-slate-300 hover:border-amber-500 bg-slate-50/70 hover:bg-amber-50/30'
                  : 'border-slate-700 hover:border-amber-500 bg-slate-950/40 hover:bg-amber-950/10'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition">
                <ImageIcon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-amber-500">
                انقر لاختيار ملف الشعار أو اسحبه إلى هنا
              </span>
              <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                يدعم صيغ PNG, JPG, SVG, WebP (يُفضل صورة بخلفية شفافة أو بيضاء)
              </span>
            </div>
          </div>

          {/* Or URL input */}
          <div>
            <label className="block text-xs font-bold mb-1.5">2. أو إدخال رابط الشعار عبر الإنترنت (URL):</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
                <input
                  type="url"
                  placeholder="https://example.com/aast-logo.png"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className={`w-full pr-9 pl-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-amber-500 ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                  }`}
                />
              </div>
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                تطبيق
              </button>
            </div>
          </div>

          {/* Real-time Preview Area */}
          <div className="space-y-2 pt-2 border-t border-slate-700/50">
            <label className="block text-xs font-bold">معاينة الشعار الحالية (كيف سيظهر للزائر):</label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Light Mode Preview */}
              <div className="p-3 rounded-2xl bg-white border border-slate-300 text-slate-900 flex flex-col items-center justify-center gap-2 text-center shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold">المعاينة في الوضع النهاري (Light)</span>
                <div className="p-2 border border-slate-200 rounded-xl bg-slate-50/50 w-full flex items-center justify-center">
                  <AcademyLogo 
                    size="md" 
                    showText={true} 
                    customLogoUrl={previewUrl || undefined} 
                    textColor="text-slate-900"
                  />
                </div>
              </div>

              {/* Dark Mode Preview */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white flex flex-col items-center justify-center gap-2 text-center shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold">المعاينة في الوضع الليلي (Dark)</span>
                <div className="p-2 border border-slate-800 rounded-xl bg-slate-900/60 w-full flex items-center justify-center">
                  <AcademyLogo 
                    size="md" 
                    showText={true} 
                    customLogoUrl={previewUrl || undefined} 
                    textColor="text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`p-4 border-t flex flex-wrap items-center justify-between gap-3 ${
          isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950/60'
        }`}>
          <button
            type="button"
            onClick={handleResetToDefault}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              isLight ? 'hover:bg-slate-200 text-slate-600' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="إلغاء الشعار المخصص واستعادة شعار الفيكتور الافتراضي"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            استعادة الشعار الافتراضي
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-800' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              إلغاء
            </button>

            <button
              type="button"
              disabled={isUploading}
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isUploading ? 'جاري الحفظ...' : 'حفظ واعتماد الشعار لجميع الزوار'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
