import React, { useState } from 'react';
import { ProjectFile, ProjectInfo } from '../types/report';
import { useTheme } from '../context/ThemeContext';
import { AcademyLogo } from './AcademyLogo';
import { 
  X, 
  Download, 
  ExternalLink, 
  Printer, 
  FileText, 
  Calendar, 
  Hash, 
  Building2, 
  Info, 
  CheckCircle2, 
  Sparkles,
  Maximize2,
  Minimize2,
  Share2,
  Folder
} from 'lucide-react';

interface PdfViewerModalProps {
  file: ProjectFile | null;
  projectInfo: ProjectInfo;
  isOpen: boolean;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  file,
  projectInfo,
  isOpen,
  onClose
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [showInfo, setShowInfo] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen || !file) return null;

  // Convert Google Drive view URLs to preview embed
  const getEmbedUrl = (url: string): string => {
    if (!url) return '';
    const trimmed = url.trim();
    const driveMatch = trimmed.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=))([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    }
    return trimmed;
  };

  const embedUrl = getEmbedUrl(file.fileUrl);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn ${
      isFullscreen ? 'p-0' : ''
    }`}>
      <div className={`w-full ${isFullscreen ? 'h-full max-w-full rounded-none' : 'max-w-6xl h-[92vh] rounded-3xl'} flex flex-col border shadow-2xl overflow-hidden transition-all duration-200 text-right ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
      }`}>
        {/* Header Bar - Executive Presidential Styling */}
        <div className={`px-5 py-3.5 border-b flex items-center justify-between gap-3 shrink-0 ${
          isLight ? 'bg-gradient-to-r from-amber-50/70 via-white to-blue-50/70 border-slate-200' : 'bg-[#0B1E34] border-amber-500/30'
        }`}>
          {/* File Title and Badge */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#071626] border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-sm font-black">
              <FileText className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className={`text-sm md:text-base font-black truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {file.title}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0C2340] text-amber-300 border border-amber-500/30 shrink-0 hidden sm:inline-block">
                  {file.category}
                </span>
              </div>
              <p className={`text-[11px] truncate flex items-center gap-2 mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <span>{file.fileName}</span>
                {file.referenceNumber && (
                  <>
                    <span>•</span>
                    <span className="font-mono text-amber-500 font-bold">كود: {file.referenceNumber}</span>
                  </>
                )}
                {file.documentDate && (
                  <>
                    <span>•</span>
                    <span>التاريخ: {file.documentDate}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Toggle Info Details */}
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                showInfo
                  ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                  : isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
              title="إظهار / إخفاء بيانات وتوصيف المستند"
            >
              <Info className="w-4 h-4" />
              <span className="hidden md:inline">التوصيف</span>
            </button>

            {/* Direct Download button if URL exists */}
            {file.fileUrl && (
              <a
                href={file.fileUrl}
                download={file.fileName || `${file.title}.pdf`}
                className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                }`}
                title="تحميل ملف الـ PDF"
              >
                <Download className="w-4 h-4 text-emerald-500" />
                <span className="hidden md:inline">تحميل</span>
              </a>
            )}

            {/* Open in full tab if external URL */}
            {file.fileUrl && (
              <a
                href={file.fileUrl}
                target="_blank"
                rel="noreferrer"
                className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                }`}
                title="فتح في نافذة كاملة جديدة"
              >
                <ExternalLink className="w-4 h-4 text-blue-400" />
                <span className="hidden md:inline">نافذة كاملة</span>
              </a>
            )}

            {/* Toggle Fullscreen Modal */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`p-2 rounded-xl border text-xs font-bold transition cursor-pointer hidden sm:flex items-center ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
              title={isFullscreen ? 'تصغير' : 'ملء الشاشة'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: PDF Frame + Metadata Drawer */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
          {/* Main Viewer Area */}
          <div className="flex-1 bg-slate-950/60 p-2 sm:p-4 flex flex-col justify-center items-center overflow-auto min-h-0">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-full rounded-2xl border border-slate-700/80 bg-white shadow-xl"
                title={file.title}
              />
            ) : (
              /* High-fidelity Engineering Document Simulation for seeded documents or offline review */
              <div className="w-full max-w-3xl bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-300 p-6 md:p-10 my-auto overflow-y-auto max-h-full">
                {/* Official Letterhead */}
                <div className="border-b-2 border-slate-900 pb-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-[#0C2340] block">
                      جمهورية مصر العربية • وزارة التجارة والصناعة
                    </span>
                    <h2 className="text-base md:text-lg font-black text-[#0C2340]">
                      {projectInfo.companyName}
                    </h2>
                    <p className="text-xs text-slate-600 font-semibold">{projectInfo.subLocation}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <AcademyLogo size="md" showText={false} customLogoUrl={projectInfo.consultantLogoUrl} />
                    <div className="text-left border-r pr-3 border-slate-300">
                      <span className="text-[10px] text-amber-700 font-black block">الجهة الاستشارية</span>
                      <span className="text-xs font-bold text-slate-800 leading-tight block">
                        الأكاديمية العربية للعلوم والتكنولوجيا
                      </span>
                    </div>
                  </div>
                </div>

                {/* Document Title Header */}
                <div className="text-center my-6 space-y-2">
                  <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-[#0C2340] border border-blue-300 text-xs font-black">
                    قسم {file.category}
                  </span>
                  <h1 className="text-lg md:text-2xl font-black text-[#0C2340] leading-relaxed">
                    {file.title}
                  </h1>
                  {file.referenceNumber && (
                    <p className="text-xs font-mono font-bold text-amber-700">
                      رقم الإشارة: {file.referenceNumber}
                    </p>
                  )}
                </div>

                {/* Description & Technical Statement */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 my-6 space-y-4">
                  <h4 className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5 border-b pb-2 border-slate-200">
                    <FileText className="w-4 h-4 text-amber-600" />
                    توصيف المستند الهندسي وبيان الأعمال:
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-800 whitespace-pre-line font-medium">
                    {file.description || 'مستند معتمد ضمن السجلات الهندسية والملفات التوثيقية للمشروع.'}
                  </p>
                </div>

                {/* Meta details grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6 text-xs">
                  <div className="p-3 bg-slate-100/80 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">تاريخ التوثيق</span>
                    <strong className="text-slate-800 mt-0.5 block">{file.documentDate || file.uploadDate}</strong>
                  </div>
                  <div className="p-3 bg-slate-100/80 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">الجهة المعتمدة</span>
                    <strong className="text-slate-800 mt-0.5 block">{file.uploadedBy || 'استشاري المشروع'}</strong>
                  </div>
                  <div className="p-3 bg-slate-100/80 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">اسم الملف</span>
                    <strong className="text-slate-800 mt-0.5 block truncate">{file.fileName}</strong>
                  </div>
                  <div className="p-3 bg-slate-100/80 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">حجم المستند</span>
                    <strong className="text-slate-800 mt-0.5 block font-mono">{file.fileSize || '1.5 MB'}</strong>
                  </div>
                </div>

                {/* Official Signatures & Seal Footer */}
                <div className="mt-8 pt-6 border-t-2 border-slate-200 flex flex-wrap items-center justify-between gap-6 text-xs">
                  <div className="text-center">
                    <span className="text-slate-500 block mb-1">المقاول العام المنفذ</span>
                    <strong className="text-slate-800 block">{projectInfo.contractor}</strong>
                    <div className="w-24 h-10 border border-dashed border-slate-300 rounded mx-auto mt-1 flex items-center justify-center text-[10px] text-slate-400">
                      ختم وتوقيع
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="text-slate-500 block mb-1">الجهة الاستشارية المشرفة</span>
                    <strong className="text-slate-800 block">الأكاديمية العربية للعلوم والتكنولوجيا</strong>
                    <div className="w-24 h-10 border border-emerald-500/50 bg-emerald-50 rounded mx-auto mt-1 flex items-center justify-center text-[10px] text-emerald-700 font-bold">
                      ✓ معتمد وموثق
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="text-slate-500 block mb-1">الجهة المالكة للمشروع</span>
                    <strong className="text-slate-800 block">{projectInfo.companyName}</strong>
                    <div className="w-24 h-10 border border-dashed border-slate-300 rounded mx-auto mt-1 flex items-center justify-center text-[10px] text-slate-400">
                      إدارة المشروعات
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Metadata Sidebar */}
          {showInfo && (
            <div className={`w-full lg:w-80 border-t lg:border-t-0 lg:border-r p-5 shrink-0 overflow-y-auto space-y-5 transition-colors ${
              isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/80 border-slate-800'
            }`}>
              <div>
                <span className="text-[10px] font-bold tracking-wider text-amber-500 uppercase block mb-1">
                  بطاقة تعريف المستند
                </span>
                <h4 className="font-black text-sm md:text-base leading-snug">
                  {file.title}
                </h4>
              </div>

              {/* Status Badge */}
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <div className="text-xs">
                  <strong className="text-emerald-500 block">مستند رسمي معتمد</strong>
                  <span className="text-[11px] opacity-80 block">تم التحقق ومطابقة المواصفات الهندسية</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 block">توصيف المستند والملاحظات:</label>
                <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                  isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}>
                  {file.description || 'لا يوجد توصيف إضافي مسجل لهذا الملف.'}
                </div>
              </div>

              {/* Attributes List */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b pb-2 border-slate-700/40">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Folder className="w-3.5 h-3.5" /> القسم:
                  </span>
                  <span className="font-bold text-amber-500">{file.category}</span>
                </div>

                {file.referenceNumber && (
                  <div className="flex items-center justify-between border-b pb-2 border-slate-700/40">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5" /> رقم الإشارة:
                    </span>
                    <span className="font-mono font-bold select-all">{file.referenceNumber}</span>
                  </div>
                )}

                {file.documentDate && (
                  <div className="flex items-center justify-between border-b pb-2 border-slate-700/40">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> تاريخ المستند:
                    </span>
                    <span className="font-bold font-mono">{file.documentDate}</span>
                  </div>
                )}

                <div className="flex items-center justify-between border-b pb-2 border-slate-700/40">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> الجهة المعتمدة:
                  </span>
                  <span className="font-semibold truncate max-w-[150px]">{file.uploadedBy || 'الأكاديمية العربية'}</span>
                </div>

                <div className="flex items-center justify-between border-b pb-2 border-slate-700/40">
                  <span className="text-slate-400">حجم الملف:</span>
                  <span className="font-mono font-semibold">{file.fileSize || 'PDF'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">تاريخ الإضافة للنظام:</span>
                  <span className="font-mono">{file.uploadDate}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
