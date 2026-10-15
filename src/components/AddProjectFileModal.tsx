import React, { useState, useEffect } from 'react';
import { ProjectFile, ProjectInfo } from '../types/report';
import { useTheme } from '../context/ThemeContext';
import { 
  X, 
  Upload, 
  FileText, 
  Plus, 
  Link2, 
  CheckCircle2, 
  FolderPlus, 
  Calendar, 
  Hash, 
  Building2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface AddProjectFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  projectInfo: ProjectInfo;
  onSaveFile: (file: ProjectFile) => void;
  onAddCategory?: (newCategory: string) => void;
  editingFile?: ProjectFile | null;
}

export const AddProjectFileModal: React.FC<AddProjectFileModalProps> = ({
  isOpen,
  onClose,
  categories,
  projectInfo,
  onSaveFile,
  onAddCategory,
  editingFile
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || 'أوراق الموقع');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCustomCategory, setIsAddingCustomCategory] = useState(false);
  const [description, setDescription] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [documentDate, setDocumentDate] = useState(new Date().toISOString().split('T')[0].replace(/-/g, '/'));
  const [uploadedBy, setUploadedBy] = useState('استشاري المشروع - الأكاديمية العربية');
  
  // File upload state
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (editingFile) {
      setTitle(editingFile.title || '');
      setSelectedCategory(editingFile.category || categories[0] || 'أوراق الموقع');
      setDescription(editingFile.description || '');
      setReferenceNumber(editingFile.referenceNumber || '');
      setDocumentDate(editingFile.documentDate || '');
      setUploadedBy(editingFile.uploadedBy || '');
      setFileUrl(editingFile.fileUrl || '');
      setFileName(editingFile.fileName || '');
      setFileSize(editingFile.fileSize || '');
      setMode(editingFile.fileUrl?.startsWith('data:') ? 'upload' : 'url');
    } else {
      setTitle('');
      setSelectedCategory(categories[0] || 'أوراق الموقع');
      setDescription('');
      setReferenceNumber('');
      setDocumentDate(new Date().toISOString().split('T')[0].replace(/-/g, '/'));
      setUploadedBy('استشاري المشروع - الأكاديمية العربية');
      setFileUrl('');
      setFileName('');
      setFileSize('');
      setMode('upload');
      setFormError('');
    }
  }, [editingFile, isOpen, categories]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsReadingFile(true);
    setFormError('');

    // Format file size
    const sizeInMB = file.size / (1024 * 1024);
    const formattedSize = sizeInMB >= 1 
      ? `${sizeInMB.toFixed(1)} ميجابايت` 
      : `${Math.round(file.size / 1024)} كيلوبايت`;

    setFileName(file.name);
    setFileSize(formattedSize);

    if (!title) {
      // Auto-populate title from filename without extension
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFileUrl(result);
      setIsReadingFile(false);
    };
    reader.onerror = () => {
      setFormError('حدث خطأ أثناء قراءة ملف الـ PDF من جهازك.');
      setIsReadingFile(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAddNewCategory = () => {
    if (newCategoryName.trim()) {
      const trimmed = newCategoryName.trim();
      if (onAddCategory) {
        onAddCategory(trimmed);
      }
      setSelectedCategory(trimmed);
      setNewCategoryName('');
      setIsAddingCustomCategory(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('يرجى كتابة عنوان المستند.');
      return;
    }

    const categoryToUse = isAddingCustomCategory && newCategoryName.trim() 
      ? newCategoryName.trim() 
      : selectedCategory;

    if (isAddingCustomCategory && newCategoryName.trim() && onAddCategory) {
      onAddCategory(newCategoryName.trim());
    }

    const saved: ProjectFile = {
      id: editingFile ? editingFile.id : `file-${Date.now()}`,
      title: title.trim(),
      category: categoryToUse,
      description: description.trim(),
      fileUrl: fileUrl.trim(),
      fileName: fileName.trim() || `${title.trim()}.pdf`,
      fileSize: fileSize || '1.0 MB',
      fileType: 'pdf',
      uploadDate: editingFile ? editingFile.uploadDate : new Date().toISOString().split('T')[0].replace(/-/g, '/'),
      documentDate: documentDate.trim(),
      referenceNumber: referenceNumber.trim(),
      uploadedBy: uploadedBy.trim() || 'إدارة المشروع'
    };

    onSaveFile(saved);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn text-right">
      <div className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isLight ? 'bg-gradient-to-r from-amber-50 to-blue-50 border-slate-200' : 'bg-[#0B1E34] border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base md:text-lg">
                {editingFile ? 'تعديل وتوصيف مستند بالمشروع' : 'إضافة ورفع ملف PDF جديد'}
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                توثيق أوراق الموقع، التوريدات، دفاتر الحصر، والمستخلصات المعتمدة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-400'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Upload Method Chooser */}
          <div className="space-y-2">
            <label className={`block text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              طريقة إرفاق ملف الـ PDF:
            </label>
            <div className={`grid grid-cols-2 gap-2 p-1 rounded-2xl border ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <button
                type="button"
                onClick={() => setMode('upload')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'upload'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>رفع من الجهاز (PDF)</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('url')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'url'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>رابط PDF أو Google Drive</span>
              </button>
            </div>
          </div>

          {/* Mode 1: Device File Picker */}
          {mode === 'upload' ? (
            <div className="space-y-2">
              <label className={`block border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition group ${
                isLight
                  ? 'border-amber-400/80 bg-amber-50/40 hover:bg-amber-50/80'
                  : 'border-amber-500/40 bg-slate-950/60 hover:bg-slate-950'
              }`}>
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-sm text-amber-600 dark:text-amber-400">
                    {isReadingFile ? 'جاري تجهيز وقراءة ملف الـ PDF...' : fileName ? `تم اختيار: ${fileName}` : 'اضغط هنا لاختيار ملف PDF من جهازك أو هاتفك'}
                  </span>
                  <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    يدعم ملفات PDF بجميع الأحجام • معاينة سريعة داخل التطبيق
                  </span>
                </div>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {fileName && (
                <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                }`}>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold truncate max-w-xs">{fileName}</span>
                    <span className="opacity-75 font-mono">({fileSize})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFileUrl('');
                      setFileName('');
                      setFileSize('');
                    }}
                    className="text-xs text-rose-500 hover:underline cursor-pointer font-bold"
                  >
                    إلغاء
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Mode 2: Direct URL / Google Drive */
            <div className="space-y-1.5">
              <label className={`block text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                رابط مستند PDF أو رابط Google Drive:
              </label>
              <input
                type="url"
                value={fileUrl}
                onChange={(e) => {
                  setFileUrl(e.target.value);
                  if (!fileName) {
                    setFileName('مستند سحابي خارجي (PDF)');
                  }
                }}
                placeholder="https://drive.google.com/file/d/... أو https://example.com/doc.pdf"
                className={`w-full rounded-xl px-3 py-2 text-xs border font-mono ${
                  isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                }`}
              />
              <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                يتم تحويل روابط Google Drive تلقائياً لعرض مباشر ومريح داخل التطبيق.
              </p>
            </div>
          )}

          {/* Document Title */}
          <div>
            <label className={`block text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              عنوان المستند / اسم المعاملة:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: محضر استلام حديد التسليح واعتماد الجودة"
              className={`w-full rounded-xl px-3 py-2 text-xs md:text-sm border focus:outline-none focus:border-amber-500 ${
                isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
              }`}
              required
            />
          </div>

          {/* Section / Category Selector with Quick Add */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={`text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                قسم وتصنيف الملف:
              </label>
              <button
                type="button"
                onClick={() => setIsAddingCustomCategory(!isAddingCustomCategory)}
                className="text-xs text-amber-500 hover:text-amber-400 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingCustomCategory ? 'إلغاء إضافة قسم' : '➕ إضافة قسم جديد'}</span>
              </button>
            </div>

            {isAddingCustomCategory ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="اكتب اسم القسم الجديد (مثل: محاضر اجتماعات، مكاتبات مالية...)"
                  className={`flex-1 rounded-xl px-3 py-2 text-xs border focus:outline-none focus:border-amber-500 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddNewCategory}
                  className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
                >
                  إضافة
                </button>
              </div>
            ) : (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full rounded-xl px-3 py-2 text-xs md:text-sm border focus:outline-none focus:border-amber-500 ${
                  isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                }`}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Reference Code & Document Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                رقم الإشارة / كود المستند (اختياري):
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="مثال: REF-2026/08-STL"
                  className={`w-full rounded-xl pr-3 pl-8 py-2 text-xs border font-mono focus:outline-none focus:border-amber-500 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                  }`}
                />
                <Hash className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                تاريخ المستند الرسمي:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={documentDate}
                  onChange={(e) => setDocumentDate(e.target.value)}
                  placeholder="2026/08/01"
                  className={`w-full rounded-xl pr-3 pl-8 py-2 text-xs border font-mono focus:outline-none focus:border-amber-500 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                  }`}
                />
                <Calendar className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Issued by */}
          <div>
            <label className={`block text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              الجهة الصادرة أو المعتمدة:
            </label>
            <input
              type="text"
              value={uploadedBy}
              onChange={(e) => setUploadedBy(e.target.value)}
              placeholder="مثال: الأكاديمية العربية (الاستشاري) / شركة الهلال (المقاول)"
              className={`w-full rounded-xl px-3 py-2 text-xs border focus:outline-none focus:border-amber-500 ${
                isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
              }`}
            />
          </div>

          {/* Description & Technical Notes */}
          <div>
            <label className={`block text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              توصيف المستند والملاحظات الهندسية:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="اكتب نبذة عن محتويات المستند، ملخص القرارات، أو الشروط والملاحظات المرتبطة به..."
              className={`w-full rounded-xl p-3 text-xs border focus:outline-none focus:border-amber-500 resize-none leading-relaxed ${
                isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
              }`}
            />
          </div>

          {/* Submit & Cancel */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700/40">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-black transition shadow-md shadow-amber-500/20 cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{editingFile ? 'حفظ التعديلات' : 'إضافة المستند للمشروع'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
