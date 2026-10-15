import React, { useState, useEffect } from 'react';
import { 
  X, 
  Cloud, 
  CloudUpload, 
  CloudDownload, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  LogIn, 
  LogOut, 
  Loader2,
  Calendar,
  Building2,
  TrendingUp
} from 'lucide-react';
import { User } from 'firebase/auth';
import { signInWithGoogle, logOut } from '../firebase/config';
import { 
  saveReportToFirestore, 
  subscribeToUserReports, 
  loadReportFromFirestore, 
  deleteReportFromFirestore, 
  SavedReportMeta 
} from '../firebase/reportsService';
import { ReportData } from '../types/report';

interface CloudReportsModalProps {
  user: User | null;
  currentReportData: ReportData;
  isOpen: boolean;
  onClose: () => void;
  onLoadReport: (data: ReportData) => void;
}

export const CloudReportsModal: React.FC<CloudReportsModalProps> = ({
  user,
  currentReportData,
  isOpen,
  onClose,
  onLoadReport
}) => {
  const [reports, setReports] = useState<SavedReportMeta[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingReport, setIsLoadingReport] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Subscribe to reports when user logs in
  useEffect(() => {
    if (!user) {
      setReports([]);
      return;
    }

    const unsubscribe = subscribeToUserReports(user.uid, (list) => {
      setReports(list);
    });

    return () => unsubscribe();
  }, [user]);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    try {
      setErrorMessage('');
      await signInWithGoogle();
    } catch (err: any) {
      setErrorMessage(err.message || 'فشل تسجيل الدخول باستخدام حساب Google');
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSaveCurrentToCloud = async () => {
    if (!user) {
      setErrorMessage('يرجى تسجيل الدخول أولاً');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Use existing report id or generate a new timestamped one
      const reportId = `report-${Date.now()}`;
      await saveReportToFirestore(reportId, currentReportData);
      setSuccessMessage('تم حفظ التقرير في قاعدة بيانات السحابة Firestore بنجاح!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      setErrorMessage('حدث خطأ أثناء حفظ التقرير: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadSelectedReport = async (reportId: string) => {
    setIsLoadingReport(reportId);
    setErrorMessage('');

    try {
      const loaded = await loadReportFromFirestore(reportId);
      if (loaded) {
        onLoadReport(loaded);
        setSuccessMessage('تم تحميل التقرير بنجاح إلى المنصة!');
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setErrorMessage('لم يتم العثور على بيانات التقرير');
      }
    } catch (err: any) {
      setErrorMessage('فشل تحميل التقرير: ' + err.message);
    } finally {
      setIsLoadingReport(null);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التقرير من السحابة؟')) return;

    try {
      await deleteReportFromFirestore(reportId);
    } catch (err: any) {
      setErrorMessage('فشل حذف التقرير: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden text-right flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">المزامنة السحابية وقاعدة البيانات (Firebase Firestore)</h3>
              <p className="text-xs text-slate-400">
                تسجيل الدخول الآمن بحساب Google وحفظ تقارير الموقف التنفيذي للمشاريع
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* User Auth Card */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            {user ? (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'مستخدم'}
                    className="w-12 h-12 rounded-full border-2 border-amber-500/60 shadow"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-lg">
                    {user.displayName?.[0] || 'U'}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{user.displayName || 'مستخدم معتمد'}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      متصل بالسحابة
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="text-right">
                <h4 className="text-sm font-bold text-slate-200">لم تقم بتسجيل الدخول بعد</h4>
                <p className="text-xs text-slate-400">
                  قم بتسجيل الدخول بحساب Google لحفظ تقاريرك ومزامنتها على كافة الأجهزة بأمان
                </p>
              </div>
            )}

            <div className="flex items-center gap-2">
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  تسجيل الخروج
                </button>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  تسجيل الدخول عبر Google
                </button>
              )}
            </div>
          </div>

          {/* Feedback messages */}
          {successMessage && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Save current report button */}
          {user && (
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-950/50 via-slate-900 to-slate-900 border border-blue-500/30 rounded-xl">
              <div>
                <h4 className="text-sm font-bold text-white">حفظ التقرير المفتوح حالياً في Firestore</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  سيتم حفظ كافة الشرائح ({currentReportData.slides.length}) وبنود المقايسة والمخطط الزمني
                </p>
              </div>

              <button
                onClick={handleSaveCurrentToCloud}
                disabled={isSaving}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <CloudUpload className="w-4 h-4" />
                    حفظ التقرير الآن
                  </>
                )}
              </button>
            </div>
          )}

          {/* Cloud Reports List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-200">
                التقارير المحفوظة في حسابك ({reports.length})
              </h4>
            </div>

            {!user ? (
              <div className="p-8 text-center border border-slate-800 rounded-xl bg-slate-950/40">
                <p className="text-slate-400 text-xs">سجل الدخول لاستعراض وإدارة تقاريرك المحفوظة</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="p-8 text-center border border-slate-800 rounded-xl bg-slate-950/40">
                <p className="text-slate-400 text-xs">لم تقم بحفظ أي تقارير في السحابة حتى الآن.</p>
                <p className="text-slate-500 text-[11px] mt-1">
                  اضغط على زر "حفظ التقرير الآن" أعلاه لحفظ هذا التقرير في حسابك.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {reports.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{r.title}</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold">
                          %{r.overallProgress}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>{r.companyName}</span>
                        {r.reportDate && <span>• الموقف: {r.reportDate}</span>}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        آخر تعديل: {new Date(r.updatedAt || r.createdAt).toLocaleString('ar-EG')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => handleLoadSelectedReport(r.id)}
                        disabled={isLoadingReport === r.id}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow"
                      >
                        {isLoadingReport === r.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CloudDownload className="w-3.5 h-3.5" />
                        )}
                        فتح التقرير
                      </button>

                      <button
                        onClick={() => handleDeleteReport(r.id)}
                        className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition cursor-pointer"
                        title="حذف من السحابة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
