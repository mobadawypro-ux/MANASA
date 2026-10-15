import React, { useState, useRef } from 'react';
import { ProjectInfo, ReportData } from '../types/report';
import { useTheme } from '../context/ThemeContext';
import { AcademyLogo } from './AcademyLogo';
import { testCloudinaryConnection } from '../firebase/reportsService';
import { 
  X, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  ShieldCheck, 
  CheckCircle2, 
  Image as ImageIcon,
  Trash2,
  Globe,
  Radio,
  AlertCircle
} from 'lucide-react';

interface ProjectSettingsModalProps {
  projectInfo: ProjectInfo;
  isOpen: boolean;
  onClose: () => void;
  onSave: (info: ProjectInfo) => void;
  onResetToDefault: () => void;
  onExportData: () => void;
  onImportData: (data: ReportData) => void;
  onConvertLocalImages?: () => void;
}

export const ProjectSettingsModal: React.FC<ProjectSettingsModalProps> = ({
  projectInfo,
  isOpen,
  onClose,
  onSave,
  onResetToDefault,
  onExportData,
  onImportData,
  onConvertLocalImages
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [form, setForm] = useState<ProjectInfo>({ ...projectInfo });
  const [importError, setImportError] = useState('');
  const [isTestingCloudinary, setIsTestingCloudinary] = useState(false);
  const [cloudinaryTestResult, setCloudinaryTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleTestCloudinary = async () => {
    if (!form.cloudinaryCloudName?.trim() || !form.cloudinaryUploadPreset?.trim()) {
      setCloudinaryTestResult({
        success: false,
        message: 'يرجى كتابة اسم السحابة والـ Upload Preset أولاً للتحقق من الاتصال.'
      });
      return;
    }

    setIsTestingCloudinary(true);
    setCloudinaryTestResult(null);
    try {
      const res = await testCloudinaryConnection(form.cloudinaryCloudName, form.cloudinaryUploadPreset);
      setCloudinaryTestResult(res);
    } catch (e: any) {
      setCloudinaryTestResult({ success: false, message: e?.message || 'تعذر فحص الاتصال' });
    } finally {
      setIsTestingCloudinary(false);
    }
  };

  if (!isOpen) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 500;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            setForm((prev) => ({ ...prev, consultantLogoUrl: canvas.toDataURL('image/png', 0.9) }));
          } else {
            setForm((prev) => ({ ...prev, consultantLogoUrl: ev.target?.result as string }));
          }
        };
        img.src = ev.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetLogo = () => {
    setForm((prev) => ({ ...prev, consultantLogoUrl: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.projectInfo && parsed.boqItems) {
          onImportData(parsed);
          alert('تم استيراد بيانات التقرير والعرض بنجاح!');
          onClose();
        } else {
          setImportError('ملف البيانات غير مطابق لبنية التقرير');
        }
      } catch (err) {
        setImportError('حدث خطأ أثناء قراءة ملف JSON');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className={`border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden text-right transition-colors duration-200 ${
        isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950/70 border-slate-800 text-white'
        }`}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-lg">إعدادات وبيانات التقرير الرسمية</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Company & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">الشركة المالكة:</label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">الموقع / المصنع:</label>
              <input
                type="text"
                value={form.subLocation}
                onChange={(e) => setForm({ ...form, subLocation: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          {/* Project Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">عنوان المشروع الرسمي:</label>
            <textarea
              value={form.projectTitle}
              onChange={(e) => setForm({ ...form, projectTitle: e.target.value })}
              rows={2}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 resize-none font-semibold"
              required
            />
          </div>

          {/* Contractor & Consultant */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">المقاول العام:</label>
              <input
                type="text"
                value={form.contractor}
                onChange={(e) => setForm({ ...form, contractor: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">رقم أمر الإسناد:</label>
              <input
                type="text"
                value={form.contractNumber}
                onChange={(e) => setForm({ ...form, contractNumber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Consultant / Prepared By */}
          <div className={`p-4 border rounded-2xl space-y-3 ${
            isLight ? 'bg-blue-50/70 border-blue-200' : 'bg-slate-950/70 border-amber-500/30'
          }`}>
            <div className="flex items-center justify-between">
              <label className={`block text-xs font-bold ${isLight ? 'text-blue-900' : 'text-amber-400'}`}>
                الجهة الاستشارية المُعدة للتقرير والشعار المعتمد:
              </label>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[10px] text-blue-500 font-bold">مرئي لجميع الزوار</span>
              </div>
            </div>

            <input
              type="text"
              value={form.consultant || 'الأكاديمية العربية للعلوم والتكنولوجيا والنقل البحري - شركة الأكاديمية لتكنولوجيا المعلومات والاتصالات'}
              onChange={(e) => setForm({ ...form, consultant: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500 ${
                isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-slate-200'
              }`}
            />

            {/* Logo Preview & Upload Section */}
            <div className={`p-3 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center gap-2.5">
                <AcademyLogo 
                  size="md" 
                  showText={true} 
                  customLogoUrl={form.consultantLogoUrl} 
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  رفع لوجو جديد
                </button>

                {form.consultantLogoUrl && (
                  <button
                    type="button"
                    onClick={handleResetLogo}
                    className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
                    title="استعادة الشعار الأصلي (Vector SVG)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              عند حفظ الإعدادات، سيتم اعتماد الشعار وتثبيته سحابياً ليظهر لجميع الزوار في ترويسة الموقع وغلاف التقرير.
            </p>
          </div>

          {/* Dates & Duration */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">تاريخ تسليم الموقع:</label>
              <input
                type="text"
                value={form.handoverDate}
                onChange={(e) => setForm({ ...form, handoverDate: e.target.value })}
                placeholder="2026/07/08"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">مدة التنفيذ (شهور):</label>
              <input
                type="number"
                value={form.durationMonths}
                onChange={(e) => setForm({ ...form, durationMonths: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">تاريخ الانتهاء المخطط:</label>
              <input
                type="text"
                value={form.plannedEndDate}
                onChange={(e) => setForm({ ...form, plannedEndDate: e.target.value })}
                placeholder="2027/03/08"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">تاريخ التقرير:</label>
              <input
                type="text"
                value={form.reportDate}
                onChange={(e) => setForm({ ...form, reportDate: e.target.value })}
                placeholder="2026/09/13"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Overall Progress */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-300">
                إجمالي نسبة الإنجاز الكلية للمشروع:
              </label>
              <span className="text-sm font-black text-amber-400">{form.overallProgress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={form.overallProgress}
              onChange={(e) => setForm({ ...form, overallProgress: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Cloudinary Cloud Storage Configuration */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
              <Globe className="w-4 h-4 text-amber-500" />
              <span>إعدادات سحابة الصور (Cloudinary Cloud Storage):</span>
            </div>
            <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'} leading-relaxed`}>
              تتيح لك سحابة Cloudinary رفع وتخزين الصور بروابط ويب مباشرة وموثوقة بدلاً من حفظها محلياً، مما يمنع تجاوز سعة التقرير السحابية ويضمن المزامنة فائقة السرعة مع الجوال. إذا تركتها فارغة، سيتم استخدام حساب افتراضي جاهز وآمن مجاناً!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">اسم السحابة (Cloud Name):</label>
                <input
                  type="text"
                  value={form.cloudinaryCloudName || ''}
                  onChange={(e) => {
                    setForm({ ...form, cloudinaryCloudName: e.target.value });
                    setCloudinaryTestResult(null);
                  }}
                  placeholder="مثال: my-cloud-name"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">إعدادات الرفع غير المشفر (Upload Preset):</label>
                <input
                  type="text"
                  value={form.cloudinaryUploadPreset || ''}
                  onChange={(e) => {
                    setForm({ ...form, cloudinaryUploadPreset: e.target.value });
                    setCloudinaryTestResult(null);
                  }}
                  placeholder="مثال: cement_reports (Unsigned)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            {/* Test Connection Button & Result */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={handleTestCloudinary}
                disabled={isTestingCloudinary}
                className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Radio className={`w-3.5 h-3.5 text-amber-400 ${isTestingCloudinary ? 'animate-pulse' : ''}`} />
                <span>{isTestingCloudinary ? 'جاري فحص الاتصال بالسحابة...' : '🔍 فحص واختبار الاتصال بسحابة Cloudinary الآن'}</span>
              </button>

              {cloudinaryTestResult && (
                <div className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 ${
                  cloudinaryTestResult.success
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                }`}>
                  {cloudinaryTestResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <span className="leading-relaxed">{cloudinaryTestResult.message}</span>
                </div>
              )}
            </div>

            {onConvertLocalImages && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('هل ترغب في تحويل كافة الصور المحلية السابقة (التي تستهلك المساحة) إلى روابط سحابية على Cloudinary الآن؟\n\nهذا سيفريغ مساحة التقرير بالكامل ويحل مشكلة المزامنة فوراً.')) {
                      onConvertLocalImages();
                      onClose();
                    }
                  }}
                  className="px-4 py-2 w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10 cursor-pointer"
                >
                  ⚡ تحويل وتفريغ صور التقرير القديمة إلى السحابة فوراً
                </button>
              </div>
            )}
          </div>

          {/* Backup & Restore Tools */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-400 block">إدارة البيانات والنسخ الاحتياطي:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onExportData}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                تصدير نسخة احتياطية (JSON)
              </button>

              <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                استيراد ملف JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  if (confirm('هل تريد استعادة البيانات الأصلية للتقرير كما كانت في المستند الأولي؟')) {
                    onResetToDefault();
                    onClose();
                  }
                }}
                className="px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition mr-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                إعادة ضبط للبيانات الأصلية
              </button>
            </div>
            {importError && (
              <p className="text-xs text-red-400">{importError}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              حفظ الإعدادات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
