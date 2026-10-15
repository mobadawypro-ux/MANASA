import React, { useState, useMemo } from 'react';
import { ProjectFile, ProjectInfo } from '../types/report';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { AcademyLogo } from './AcademyLogo';
import { 
  FolderArchive, 
  FileText, 
  Search, 
  Plus, 
  Download, 
  ExternalLink, 
  Eye, 
  Edit3, 
  Trash2, 
  Calendar, 
  Hash, 
  Building2, 
  Filter, 
  Layers, 
  CheckCircle2, 
  Printer, 
  Lock, 
  ShieldCheck, 
  FolderPlus,
  LayoutGrid,
  List,
  Sparkles,
  Clock,
  ArrowUpDown
} from 'lucide-react';

interface ProjectFilesViewProps {
  files: ProjectFile[];
  categories: string[];
  projectInfo: ProjectInfo;
  onAddFile: () => void;
  onEditFile: (file: ProjectFile) => void;
  onDeleteFile: (fileId: string) => void;
  onViewFile: (file: ProjectFile) => void;
  onAddCategory: (categoryName: string) => void;
  onDeleteCategory?: (categoryName: string) => void;
}

export const ProjectFilesView: React.FC<ProjectFilesViewProps> = ({
  files,
  categories,
  projectInfo,
  onAddFile,
  onEditFile,
  onDeleteFile,
  onViewFile,
  onAddCategory,
  onDeleteCategory
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { isAdmin, isGuest, openLoginModal } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'category'>('date');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // Filtering and sorting
  const filteredFiles = useMemo(() => {
    let result = files.filter((f) => {
      const matchCat = selectedCategory === 'all' || f.category === selectedCategory;
      const matchSearch =
        f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.description && f.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (f.referenceNumber && f.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (f.fileName && f.fileName.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchCat && matchSearch;
    });

    result.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = a.documentDate || a.uploadDate || '';
        const dateB = b.documentDate || b.uploadDate || '';
        return dateB.localeCompare(dateA);
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title, 'ar');
      }
      if (sortBy === 'category') {
        return a.category.localeCompare(b.category, 'ar');
      }
      return 0;
    });

    return result;
  }, [files, selectedCategory, searchTerm, sortBy]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = files.length;
    const categoryCounts: { [cat: string]: number } = {};
    categories.forEach((cat) => {
      categoryCounts[cat] = files.filter((f) => f.category === cat).length;
    });
    const latestFile = [...files].sort((a, b) => {
      const dateA = a.documentDate || a.uploadDate || '';
      const dateB = b.documentDate || b.uploadDate || '';
      return dateB.localeCompare(dateA);
    })[0];

    return { total, categoryCounts, latestFile };
  }, [files, categories]);

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatName.trim()) {
      onAddCategory(newCatName.trim());
      setSelectedCategory(newCatName.trim());
      setNewCatName('');
      setIsAddingCategory(false);
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'أوراق الموقع':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      case 'توريدات':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      case 'حصر':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
      case 'مستخلصات':
        return 'text-purple-500 bg-purple-500/10 border-purple-500/30';
      case 'مخططات ورسومات':
        return 'text-rose-500 bg-rose-500/10 border-rose-500/30';
      case 'تقارير الجودة والاختبارات':
        return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30';
      default:
        return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30';
    }
  };

  return (
    <div className="space-y-6 text-right animate-fadeIn">
      {/* Top Executive Header Card */}
      <div className={`p-6 md:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-900 border-slate-800 text-white shadow-xl'
      }`}>
        {/* Subtle Decorative Gradient and Emblems */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 border-b pb-6 border-slate-700/40">
          <div className="space-y-2 text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0C2340] border border-amber-500/40 text-amber-300 font-bold text-xs shadow-sm">
              <FolderArchive className="w-4 h-4 text-amber-400" />
              <span>الأرشيف والمستودع الرقمي لمستندات المشروع</span>
            </div>

            <h2 className="text-xl md:text-3xl font-black tracking-wide">
              ملفات ووثائق المشروع الهندسية (PDF)
            </h2>

            <p className={`text-xs md:text-sm font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              توثيق وتوصيف أوراق الموقع، أوامر التوريد، شيتات الحصر، المستخلصات الجارية والختامية، والمخططات التنفيذية المعتمدة
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <AcademyLogo size="md" showText={true} customLogoUrl={projectInfo.consultantLogoUrl} />
          </div>
        </div>

        {/* Executive Metrics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6">
          <div className={`p-4 rounded-2xl border text-center ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
          }`}>
            <span className="text-[11px] font-semibold text-slate-400 block">إجمالي المستندات الموثقة</span>
            <p className="text-2xl font-black text-amber-500 mt-1 font-mono">{stats.total} <span className="text-xs font-bold text-slate-400">ملف</span></p>
            <span className="text-[10px] text-emerald-500 font-bold mt-0.5 block">✓ صيغة PDF معتمدة</span>
          </div>

          <div className={`p-4 rounded-2xl border text-center ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
          }`}>
            <span className="text-[11px] font-semibold text-slate-400 block">الأقسام والتصنيفات</span>
            <p className="text-2xl font-black text-blue-400 mt-1 font-mono">{categories.length} <span className="text-xs font-bold text-slate-400">أقسام</span></p>
            <span className="text-[10px] text-slate-400 mt-0.5 block">موقع، توريد، حصر، مستخلصات</span>
          </div>

          <div className={`p-4 rounded-2xl border text-center ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
          }`}>
            <span className="text-[11px] font-semibold text-slate-400 block">أمر الإسناد المرجعي</span>
            <p className="text-base md:text-lg font-black text-amber-400 mt-1 font-mono">{projectInfo.contractNumber}</p>
            <span className="text-[10px] text-slate-400 mt-0.5 block">{projectInfo.companyName}</span>
          </div>

          <div className={`p-4 rounded-2xl border text-center ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
          }`}>
            <span className="text-[11px] font-semibold text-slate-400 block">أحدث مستند مدرج</span>
            <p className="text-xs font-black text-emerald-400 mt-1.5 truncate">
              {stats.latestFile ? stats.latestFile.title : 'لا يوجد'}
            </p>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">
              {stats.latestFile ? stats.latestFile.documentDate || stats.latestFile.uploadDate : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Categories Bar & Quick Add Section */}
      <div className={`p-4 rounded-2xl border space-y-3 transition-colors ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-lg'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 border-slate-700/40">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold">تصفية حسب الأقسام الهندسية:</span>
          </div>

          {isAdmin ? (
            <button
              onClick={() => setIsAddingCategory(!isAddingCategory)}
              className="text-xs text-amber-500 hover:text-amber-400 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <FolderPlus className="w-4 h-4" />
              <span>{isAddingCategory ? 'إغلاق نافذة القسم' : '➕ إضافة قسم جديد (مثل: مناقصات، محاضر...)'}</span>
            </button>
          ) : (
            <button
              onClick={openLoginModal}
              className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>تسجيل الدخول كأدمن لإضافة أقسام جديدة</span>
            </button>
          )}
        </div>

        {/* Add custom section inline form */}
        {isAddingCategory && (
          <form onSubmit={handleCreateCategory} className={`p-3 rounded-xl border flex items-center gap-2 animate-fadeIn ${
            isLight ? 'bg-amber-50/70 border-amber-200' : 'bg-slate-950 border-amber-500/30'
          }`}>
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="اكتب اسم القسم الجديد (مثال: محاضر اجتماعات الموقع، مراسلات الاستشاري...)"
              className={`flex-1 rounded-xl px-3 py-1.5 text-xs border focus:outline-none focus:border-amber-500 ${
                isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
              }`}
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              حفظ القسم
            </button>
            <button
              type="button"
              onClick={() => setIsAddingCategory(false)}
              className="px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold hover:bg-slate-800 cursor-pointer"
            >
              إلغاء
            </button>
          </form>
        )}

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                : isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
          >
            <span>كافة الأقسام (الكل)</span>
            <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
              selectedCategory === 'all' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-700 text-slate-200'
            }`}>
              {stats.total}
            </span>
          </button>

          {categories.map((cat) => {
            const count = stats.categoryCounts[cat] || 0;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                    : isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                }`}
              >
                <span>{cat}</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                  isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-700/80 text-slate-200'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search, Sort, and Add New File Toolbar */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 transition-colors ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-lg'
      }`}>
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث بالعنوان، الكود، التوصيف، أو اسم الملف..."
            className={`w-full rounded-xl pr-10 pl-4 py-2 text-xs border focus:outline-none focus:border-amber-500 ${
              isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
            }`}
          />
          <Search className="w-4 h-4 absolute right-3.5 top-2.5 text-slate-400" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute left-3 top-2.5 text-xs text-slate-400 hover:text-slate-200"
            >
              مسح
            </button>
          )}
        </div>

        {/* Sort & View Layout Controls */}
        <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end">
          {/* Sort */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 hidden sm:inline">ترتيب:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`rounded-xl px-2.5 py-1.5 text-xs border focus:outline-none focus:border-amber-500 ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-slate-200'
              }`}
            >
              <option value="date">حسب التاريخ (الأحدث أولاً)</option>
              <option value="title">حسب العنوان (أبجدياً)</option>
              <option value="category">حسب القسم</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className={`p-1 rounded-xl border flex items-center gap-1 ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="عرض بطاقات"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="عرض جدول تفصيلي"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add New File Button */}
          {isAdmin ? (
            <button
              onClick={onAddFile}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs transition shadow-md shadow-amber-500/20 cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>رفع ملف PDF جديد</span>
            </button>
          ) : (
            <button
              onClick={openLoginModal}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title="تسجيل الدخول كأدمن لإضافة ورفع الملفات"
            >
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>رفع ملف (مقفل للزائر)</span>
            </button>
          )}
        </div>
      </div>

      {/* Files Display: Empty State or Cards Grid / Table */}
      {filteredFiles.length === 0 ? (
        <div className={`p-12 rounded-3xl border text-center space-y-4 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base md:text-lg">لا توجد ملفات تطابق البحث أو التصنيف المحدد</h3>
          <p className={`text-xs max-w-md mx-auto ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {searchTerm
              ? `لم نجد أي مستند يتطابق مع كلمة البحث "${searchTerm}". جرب البحث بكلمة أخرى.`
              : 'لم تتم إضافة أي مستندات في هذا القسم بعد. يمكنك البدء بإضافة ورفع مستندات جديدة الآن.'}
          </p>
          {isAdmin && (
            <button
              onClick={onAddFile}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer"
            >
              رفع ملف PDF جديد في هذا القسم
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className={`p-5 rounded-3xl border flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 ${
                isLight
                  ? 'bg-white border-slate-200 hover:border-amber-500/60 shadow-sm hover:shadow-xl'
                  : 'bg-slate-900 border-slate-800 hover:border-amber-500/50 shadow-md hover:shadow-2xl'
              }`}
            >
              <div className="space-y-3">
                {/* Card Top: Category badge + Reference code */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getCategoryColor(file.category)}`}>
                    {file.category}
                  </span>

                  {file.referenceNumber && (
                    <span className="font-mono text-[10px] font-bold text-slate-400 truncate max-w-[130px]" title={file.referenceNumber}>
                      #{file.referenceNumber}
                    </span>
                  )}
                </div>

                {/* File Title and PDF Emblem */}
                <div className="flex items-start gap-3 cursor-pointer" onClick={() => onViewFile(file)}>
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shrink-0 font-bold group-hover:scale-105 transition-transform shadow-xs">
                    <span className="text-[10px] font-black tracking-tighter">PDF</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-sm leading-snug line-clamp-2 transition-colors group-hover:text-amber-500 ${
                      isLight ? 'text-slate-900' : 'text-slate-100'
                    }`}>
                      {file.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                      {file.fileName}
                    </p>
                  </div>
                </div>

                {/* Description snippet */}
                {file.description && (
                  <p className={`text-xs line-clamp-2 leading-relaxed pt-1 ${
                    isLight ? 'text-slate-600' : 'text-slate-300'
                  }`}>
                    {file.description}
                  </p>
                )}

                {/* Meta details (Date, Size, UploadedBy) */}
                <div className={`pt-3 border-t text-[11px] grid grid-cols-2 gap-2 ${
                  isLight ? 'border-slate-100 text-slate-500' : 'border-slate-800 text-slate-400'
                }`}>
                  <div className="flex items-center gap-1.5 truncate">
                    <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="font-mono truncate">{file.documentDate || file.uploadDate}</span>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 truncate">
                    <span className="font-mono font-bold text-slate-400">{file.fileSize || 'PDF'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="pt-4 mt-3 border-t border-slate-700/30 flex items-center justify-between gap-2">
                <button
                  onClick={() => onViewFile(file)}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  title="معاينة وعرض المستند"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>معاينة PDF</span>
                </button>

                {file.fileUrl && (
                  <a
                    href={file.fileUrl}
                    download={file.fileName}
                    className={`p-2 rounded-xl border transition cursor-pointer ${
                      isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                    }`}
                    title="تحميل المستند"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-500" />
                  </a>
                )}

                {isAdmin && (
                  <>
                    <button
                      onClick={() => onEditFile(file)}
                      className={`p-2 rounded-xl border transition cursor-pointer ${
                        isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                      }`}
                      title="تعديل التوصيف والبيانات"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-500" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`هل أنت متأكد من رغبتك في حذف المستند: "${file.title}"؟`)) {
                          onDeleteFile(file.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 transition cursor-pointer"
                      title="حذف المستند"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className={`rounded-3xl border overflow-hidden shadow-xl transition-colors ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className={`border-b ${isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-[#0B1E34] border-slate-800 text-white'}`}>
                  <th className="p-3 w-10 text-center">نوع</th>
                  <th className="p-3 min-w-[200px]">عنوان المستند والملف</th>
                  <th className="p-3 min-w-[120px]">القسم</th>
                  <th className="p-3 min-w-[120px]">رقم الإشارة</th>
                  <th className="p-3 min-w-[100px]">تاريخ المستند</th>
                  <th className="p-3 min-w-[150px]">الجهة المعتمدة</th>
                  <th className="p-3 min-w-[80px]">الحجم</th>
                  <th className="p-3 min-w-[140px] text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-slate-800'}`}>
                {filteredFiles.map((file) => (
                  <tr
                    key={file.id}
                    className={`transition ${isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/50'}`}
                  >
                    <td className="p-3 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-500/10 text-rose-500 border border-rose-500/30">
                        PDF
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="cursor-pointer" onClick={() => onViewFile(file)}>
                        <h4 className="font-bold hover:text-amber-500 transition line-clamp-1">
                          {file.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate max-w-xs">{file.fileName}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getCategoryColor(file.category)}`}>
                        {file.category}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-400">
                      {file.referenceNumber || '-'}
                    </td>
                    <td className="p-3 font-mono">
                      {file.documentDate || file.uploadDate}
                    </td>
                    <td className="p-3 text-slate-300 truncate max-w-[150px]">
                      {file.uploadedBy || '-'}
                    </td>
                    <td className="p-3 font-mono text-slate-400">
                      {file.fileSize || 'PDF'}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onViewFile(file)}
                          className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 transition cursor-pointer"
                          title="معاينة"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {file.fileUrl && (
                          <a
                            href={file.fileUrl}
                            download={file.fileName}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 transition cursor-pointer"
                            title="تحميل"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => onEditFile(file)}
                              className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition cursor-pointer"
                              title="تعديل"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`هل أنت متأكد من حذف: "${file.title}"؟`)) {
                                  onDeleteFile(file.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition cursor-pointer"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
