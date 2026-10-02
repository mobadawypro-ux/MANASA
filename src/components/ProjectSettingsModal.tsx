import React, { useState } from 'react';
import { ProjectInfo, ReportData } from '../types/report';
import { X, Save, RotateCcw, Download, Upload, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ProjectSettingsModalProps {
  projectInfo: ProjectInfo;
  isOpen: boolean;
  onClose: () => void;
  onSave: (info: ProjectInfo) => void;
  onResetToDefault: () => void;
  onExportData: () => void;
  onImportData: (data: ReportData) => void;
}

export const ProjectSettingsModal: React.FC<ProjectSettingsModalProps> = ({
  projectInfo,
  isOpen,
  onClose,
  onSave,
  onResetToDefault,
  onExportData,
  onImportData
}) => {
  const [form, setForm] = useState<ProjectInfo>({ ...projectInfo });
  const [importError, setImportError] = useState('');

  if (!isOpen) return null;

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
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden text-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-lg text-white">إعدادات وبيانات التقرير الرسمية</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
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

          {/* Contractor & Order */}
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
