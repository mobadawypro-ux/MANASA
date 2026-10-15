import React, { useState, useMemo } from 'react';
import { ScheduleItem } from '../types/report';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { AcademyLogo } from './AcademyLogo';
import { UNIFIED_SCHEDULE_ITEMS } from '../data/unifiedScheduleItems';
import { 
  Calendar, 
  Check, 
  Edit2, 
  Plus, 
  Clock, 
  Award, 
  Building2, 
  Save, 
  Trash2,
  X,
  Lock,
  Filter,
  Search,
  RotateCcw,
  Layers,
  Sparkles,
  Zap,
  CalendarCheck
} from 'lucide-react';

// Helper to parse date strings (e.g. "2026/10/2", "2026-10-02", "2026/8/1")
function parseScheduleDate(dateStr?: string): Date | null {
  if (!dateStr) return null;
  const cleaned = dateStr.trim().replace(/-/g, '/');
  const parts = cleaned.split('/');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      return new Date(y, m, d);
    }
  }
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function isDateInRange(targetDate: Date, startStr?: string, endStr?: string): boolean {
  const start = parseScheduleDate(startStr);
  const end = parseScheduleDate(endStr);
  if (!start || !end) return false;
  const t = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  return t >= s && t <= e;
}

function formatDateToYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}/${m}/${d}`;
}

function toInputDateFormat(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getTaskProgressOnDate(item: ScheduleItem, targetDate: Date) {
  const start = parseScheduleDate(item.startDate);
  const end = parseScheduleDate(item.endDate);
  if (!start || !end) return null;
  const t = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  const totalDays = Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1);
  const elapsedDays = Math.max(1, Math.min(totalDays, Math.round((t - s) / (1000 * 60 * 60 * 24)) + 1));
  const percent = Math.min(100, Math.round((elapsedDays / totalDays) * 100));
  return { totalDays, elapsedDays, percent };
}

interface ScheduleTimelineProps {
  items: ScheduleItem[];
  onUpdateItems: (newItems: ScheduleItem[]) => void;
  contractorName?: string;
  contractNumber?: string;
  reportDate?: string;
}

type FacilityFilter = 'all' | 'today' | 'shakayer' | 'equipment_wash' | 'equipment' | 'wash';

export const ScheduleTimeline: React.FC<ScheduleTimelineProps> = ({
  items,
  onUpdateItems,
  contractorName = 'شركة الهلال للمقاولات العمومية',
  contractNumber = 'أمر إسناد رقم 24/2026',
  reportDate = '2026/10/15'
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { isAdmin, openLoginModal } = useAuth();

  const [filter, setFilter] = useState<FacilityFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ScheduleItem>>({});
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Active comparison date for "أعمال اليوم" (defaults to official report date 2026/10/15)
  const defaultReportDate = reportDate || '2026/10/15';
  const [selectedDateStr, setSelectedDateStr] = useState<string>(defaultReportDate);

  const activeDate = useMemo(() => {
    return parseScheduleDate(selectedDateStr) || new Date(2026, 9, 15);
  }, [selectedDateStr]);

  // Today active tasks
  const todayTasks = useMemo(() => {
    return items.filter((item) => isDateInRange(activeDate, item.startDate, item.endDate));
  }, [items, activeDate]);

  // New task form state
  const [newTask, setNewTask] = useState<Partial<ScheduleItem>>({
    statement: '',
    durationText: '10 أيام',
    durationDays: 10,
    startDate: '2026/10/1',
    endDate: '2026/10/10',
    facility: 'هنجر المعدات + المغسلة',
    timelinePosition: 0
  });

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Filter by today active tasks
      if (filter === 'today') {
        const isToday = isDateInRange(activeDate, item.startDate, item.endDate);
        if (!isToday) return false;
      }

      // Filter by facility
      const fac = item.facility || '';
      let matchesFacility = true;
      if (filter === 'shakayer') {
        matchesFacility = fac.includes('الشكاير') || fac.includes('هنجر (1-2)');
      } else if (filter === 'equipment_wash') {
        matchesFacility = fac.includes('المعدات') || fac.includes('المغسلة');
      } else if (filter === 'equipment') {
        matchesFacility = fac.includes('المعدات');
      } else if (filter === 'wash') {
        matchesFacility = fac.includes('المغسلة');
      }

      // Filter by search query
      const matchesSearch = searchQuery.trim() === '' || 
        item.statement.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        fac.toLowerCase().includes(searchQuery.toLowerCase().trim());

      return matchesFacility && matchesSearch;
    });
  }, [items, filter, searchQuery, activeDate]);

  // Statistics
  const shakayerCount = useMemo(() => items.filter(i => (i.facility || '').includes('الشكاير') || (i.facility || '').includes('هنجر (1-2)')).length, [items]);
  const eqWashCount = useMemo(() => items.filter(i => (i.facility || '').includes('المعدات') || (i.facility || '').includes('المغسلة')).length, [items]);

  const handleStartEdit = (item: ScheduleItem) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;

    const updated = items.map((item) => {
      if (item.id === editingId) {
        return {
          ...item,
          ...editForm
        } as ScheduleItem;
      }
      return item;
    });

    onUpdateItems(updated);
    setEditingId(null);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا البند من البرنامج الزمني؟')) {
      const filtered = items.filter((item) => item.id !== id);
      const reindexed = filtered.map((item, index) => ({
        ...item,
        taskIndex: index + 1
      }));
      onUpdateItems(reindexed);
    }
  };

  const handleResetToUnified = () => {
    if (confirm('هل تريد استعادة وتطبيق الجدول الزمني الموحد المعتمد لكافة مناطق المشروع (هناجر الشكاير + المعدات + المغسلة) بإجمالي 36 بند عمل؟')) {
      onUpdateItems(UNIFIED_SCHEDULE_ITEMS);
      setFilter('all');
    }
  };

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.statement) return;

    const created: ScheduleItem = {
      id: `sch-${Date.now()}`,
      taskIndex: items.length + 1,
      statement: newTask.statement || 'بند جديد',
      durationText: newTask.durationText || '7 أيام',
      durationDays: Number(newTask.durationDays) || 7,
      startDate: newTask.startDate || '2026/10/1',
      endDate: newTask.endDate || '2026/10/10',
      facility: newTask.facility || 'هنجر المعدات + المغسلة',
      timelinePosition: newTask.timelinePosition !== undefined ? Number(newTask.timelinePosition) : (items.length % 19)
    };

    onUpdateItems([...items, created]);
    setNewTask({
      statement: '',
      durationText: '10 أيام',
      durationDays: 10,
      startDate: '2026/10/1',
      endDate: '2026/10/10',
      facility: 'هنجر المعدات + المغسلة',
      timelinePosition: 0
    });
    setIsAddingNew(false);
  };

  // Helper for Facility Badge & Bar Styling
  const getFacilityStyle = (facility?: string) => {
    const f = facility || '';
    if (f.includes('الشكاير') || f.includes('هنجر (1-2)')) {
      return {
        badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        bar: 'bg-emerald-500 text-slate-950',
        dot: 'bg-emerald-500',
        label: 'هناجر الشكاير 1-2'
      };
    }
    if (f === 'المغسلة') {
      return {
        badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
        bar: 'bg-purple-600 text-white',
        dot: 'bg-purple-500',
        label: 'مغسلة المعدات'
      };
    }
    if (f === 'هنجر المعدات') {
      return {
        badge: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30',
        bar: 'bg-orange-500 text-slate-950',
        dot: 'bg-orange-500',
        label: 'هنجر المعدات'
      };
    }
    // Default: 'هنجر المعدات + المغسلة' or 'المعدات والمغسلة'
    return {
      badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      bar: 'bg-yellow-400 text-slate-950',
      dot: 'bg-amber-500',
      label: 'هنجر المعدات + المغسلة'
    };
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Official Header */}
      <div className={`border rounded-2xl p-5 shadow-xl select-none transition-colors duration-200 ${
        isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-900 border-slate-800 text-white shadow-xl'
      }`}>
        <div className={`flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          {/* Owner Company */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center shadow-md shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className={`text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                الشركة الوطنية للأسمنت ببني سويف
              </h2>
              <span className="text-xs text-amber-500 font-bold">مجمع المصانع ببني سويف</span>
            </div>
          </div>

          {/* Center Title */}
          <div className="text-center space-y-1">
            <div className="inline-block px-6 py-1.5 rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white font-black text-sm md:text-base shadow-md">
              البرنامج الزمني الموحد المعتمد
            </div>
            <p className={`text-xs md:text-sm font-extrabold ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
              مشروع إنشاء عدد (2) هنجر بمصنع الشكاير - عدد (1) هنجر بمصنع المعدات - عدد (1) مغسلة بمصنع المعدات
            </p>
            <div className="flex items-center justify-center gap-3 text-xs text-amber-500 font-bold">
              <span>{contractNumber}</span>
              <span>•</span>
              <span className="text-rose-600 dark:text-rose-400">بتاريخ 2026/8/1 ومدة تنفيذ المشروع خمسة أشهر حتى 2026/12/31</span>
            </div>
          </div>

          {/* Contractor & Consultant */}
          <div className="flex items-center gap-3">
            <div className="text-left">
              <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{contractorName}</h3>
              <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>المقاول العام المعتمد</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-blue-900 text-amber-400 font-black flex items-center justify-center border border-blue-700 shadow-md shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Consultant Academy Ribbon & Actions */}
        <div className={`mt-3 py-2 px-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs ${
          isLight ? 'bg-blue-50/70 border-blue-200' : 'bg-slate-950/70 border-slate-800'
        }`}>
          <div className="flex items-center gap-2">
            <AcademyLogo size="sm" showText={true} />
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
              • المخطط الزمني المدمج الشامل لكافة قطاعات المشروع
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {isAdmin && (
              <button
                type="button"
                onClick={handleResetToUnified}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isLight ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
                title="استعادة الجدول المدمج المعتمد لجميع المناطق (36 بند)"
              >
                <RotateCcw className="w-3.5 h-3.5 text-blue-500" />
                <span>إعادة ضبط للجدول المعتمد (36 بند)</span>
              </button>
            )}

            {isAdmin ? (
              <button
                onClick={() => setIsAddingNew(!isAddingNew)}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                {isAddingNew ? 'إلغاء الإضافة' : 'إضافة مرحلة للجدول'}
              </button>
            ) : (
              <button
                onClick={openLoginModal}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                title="تسجيل الدخول كأدمن لتعديل البرنامج الزمني"
              >
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                وضع المعاينة (مقفل للتعديل)
              </button>
            )}
          </div>
        </div>

        {/* 3 Overview Scope Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className={`p-3 rounded-xl border transition-all ${
            filter === 'all' 
              ? 'bg-blue-600/10 border-blue-500/50 shadow-xs ring-1 ring-blue-500/30' 
              : isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-slate-800'
          }`}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                كامل المشروع المدمج
              </span>
              <span className="font-mono font-black text-blue-500">{items.length} بند</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              5 شهور • من 2026/8/1 وحتى 2026/12/31 لكافة الهناجر والمغسلة
            </p>
          </div>

          <div className={`p-3 rounded-xl border transition-all ${
            filter === 'shakayer' 
              ? 'bg-emerald-600/10 border-emerald-500/50 shadow-xs ring-1 ring-emerald-500/30' 
              : isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-slate-800'
          }`}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                هناجر مصنع الشكاير (1-2)
              </span>
              <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">{shakayerCount} بند</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              17 مرحلة معتمدة • من 2026/8/1 وحتى 2026/12/31
            </p>
          </div>

          <div className={`p-3 rounded-xl border transition-all ${
            filter === 'equipment_wash' 
              ? 'bg-amber-600/10 border-amber-500/50 shadow-xs ring-1 ring-amber-500/30' 
              : isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-slate-800'
          }`}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                هنجر المعدات + المغسلة (الوثيقة المرفقة)
              </span>
              <span className="font-mono font-black text-amber-600 dark:text-amber-400">{eqWashCount} بند</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              19 مرحلة معتمدة • من 2026/9/1 وحتى 2026/12/31
            </p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TODAY'S ACTIVE TASKS WIDGET (أعمال اليوم طبقاً للجدول الزمني) */}
        {/* ======================================================== */}
        <div className={`mt-4 p-4 rounded-2xl border transition-all ${
          isLight
            ? 'bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-blue-50/70 border-amber-300 shadow-sm'
            : 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-blue-950/40 border-amber-500/40 shadow-xl'
        }`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b pb-3 mb-3 border-slate-700/20">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/30 shrink-0">
                <Zap className="w-5 h-5 fill-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-black text-sm md:text-base text-slate-900 dark:text-white">
                    أعمال اليوم طبقاً للبرنامج الزمني المعتمد
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-500 text-slate-950 shadow-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span>
                    <span>{todayTasks.length} مهام جارية</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  الأنشطة الإنشائية المقررة للتنفيذ في تاريخ:{' '}
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                    {formatDateToYMD(activeDate)}
                  </span>
                </p>
              </div>
            </div>

            {/* Date Selection Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setSelectedDateStr(defaultReportDate)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border cursor-pointer ${
                  selectedDateStr === defaultReportDate
                    ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                    : isLight ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                }`}
                title="تاريخ موقف التقرير الرسمي المعتمد"
              >
                📌 موقف التقرير ({defaultReportDate})
              </button>

              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  setSelectedDateStr(`${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border cursor-pointer ${
                  selectedDateStr === `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                    : isLight ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                }`}
                title="تاريخ اليوم الفعلي"
              >
                🕒 اليوم الحالي
              </button>

              <div className="flex items-center gap-1 text-xs font-semibold">
                <span className="text-slate-500 text-[11px] hidden sm:inline">اختر تاريخاً:</span>
                <input
                  type="date"
                  value={toInputDateFormat(activeDate)}
                  onChange={(e) => {
                    if (e.target.value) {
                      const [y, m, d] = e.target.value.split('-');
                      setSelectedDateStr(`${y}/${parseInt(m, 10)}/${parseInt(d, 10)}`);
                    }
                  }}
                  className={`px-2 py-1 rounded-lg border text-xs font-mono cursor-pointer ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                  }`}
                />
              </div>

              {filter !== 'today' && todayTasks.length > 0 && (
                <button
                  type="button"
                  onClick={() => setFilter('today')}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-lg shadow transition cursor-pointer flex items-center gap-1"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>تصفية الجدول لأعمال اليوم</span>
                </button>
              )}
            </div>
          </div>

          {/* Active Tasks Grid or Empty State */}
          {todayTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {todayTasks.map((task) => {
                const facStyle = getFacilityStyle(task.facility);
                const prog = getTaskProgressOnDate(task, activeDate);
                return (
                  <div
                    key={task.id}
                    className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                      isLight 
                        ? 'bg-white/95 border-amber-300/80 shadow-xs hover:shadow-md' 
                        : 'bg-slate-900/90 border-slate-700/80 shadow-md hover:border-amber-500/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                          بند #{task.taskIndex}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black border ${facStyle.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${facStyle.dot}`}></span>
                          <span>{task.facility || 'عام'}</span>
                        </span>
                      </div>

                      <h4 className="font-bold text-xs md:text-sm text-slate-900 dark:text-white leading-snug line-clamp-2 mb-2">
                        {task.statement}
                      </h4>
                    </div>

                    <div className="pt-2 border-t border-slate-700/20 space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-mono">
                        <span>المدة: <strong>{task.durationText}</strong></span>
                        <span>{task.startDate} ⬅ {task.endDate}</span>
                      </div>

                      {prog && (
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                            <span className="text-amber-600 dark:text-amber-400">
                              اليوم {prog.elapsedDays} من أصل {prog.totalDays} يوم
                            </span>
                            <span className="font-mono text-emerald-600 dark:text-emerald-400">
                              {prog.percent}% إنجاز زمني
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                              style={{ width: `${prog.percent}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={`p-4 rounded-xl text-center border text-xs font-semibold ${
              isLight ? 'bg-white/80 border-slate-200 text-slate-600' : 'bg-slate-900/60 border-slate-800 text-slate-400'
            }`}>
              <p>لا توجد أعمال إنشائية مجدولة في هذا التاريخ المحدد ({formatDateToYMD(activeDate)}) وفقاً للبرنامج الزمني المعتمد.</p>
              <button
                type="button"
                onClick={() => setSelectedDateStr(defaultReportDate)}
                className="mt-2 text-blue-500 hover:underline font-bold text-xs cursor-pointer inline-block"
              >
                العودة لتاريخ موقف التقرير ({defaultReportDate}) لرؤية الأعمال الجارية
              </button>
            </div>
          )}
        </div>

        {/* Interactive Zone Filter Tabs & Search Bar */}
        <div className={`mt-4 p-3 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
          isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/60 border-slate-800'
        }`}>
          <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 ml-1">
              <Filter className="w-3.5 h-3.5 text-amber-500" />
              تصفية العرض:
            </span>

            {[
              { id: 'all', label: `الكل المدمج (${items.length})` },
              { id: 'today', label: `⚡ أعمال اليوم (${todayTasks.length})` },
              { id: 'shakayer', label: `هناجر الشكاير (${shakayerCount})` },
              { id: 'equipment_wash', label: `المعدات والمغسلة (${eqWashCount})` },
              { id: 'equipment', label: 'هنجر المعدات' },
              { id: 'wash', label: 'مغسلة المعدات' }
            ].map((tab) => {
              const isActive = filter === tab.id;
              const isTodayTab = tab.id === 'today';
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as FacilityFilter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border flex items-center gap-1.5 ${
                    isActive
                      ? isTodayTab
                        ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm ring-2 ring-amber-400/50'
                        : 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                      : isTodayTab
                      ? isLight ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100' : 'bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/60'
                      : isLight
                      ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  {isTodayTab && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute right-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="بحث في بنود البرنامج الزمني..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pr-8 pl-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:border-amber-500 ${
                isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
              }`}
            />
          </div>
        </div>
      </div>

      {/* New Task Inline Form */}
      {isAddingNew && (
        <form
          onSubmit={handleAddNewTask}
          className={`p-4 rounded-2xl border shadow-xl animate-fadeIn ${
            isLight ? 'bg-white border-amber-300' : 'bg-slate-900 border-amber-500/50'
          }`}
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700/50">
            <h4 className="font-bold text-sm text-amber-500 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              إضافة مرحلة عمل جديدة إلى البرنامج الزمني الموحد
            </h4>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="p-1 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            <div className="md:col-span-2">
              <label className="block mb-1 font-semibold text-slate-400">بيان الأعمال الإنشائية:</label>
              <input
                type="text"
                required
                placeholder="مثال: أعمال تركيبات الحديد والواجهات"
                value={newTask.statement}
                onChange={(e) => setNewTask({ ...newTask, statement: e.target.value })}
                className={`w-full p-2 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                }`}
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-slate-400">المدة الزمنية:</label>
              <input
                type="text"
                required
                placeholder="10 أيام"
                value={newTask.durationText}
                onChange={(e) => setNewTask({ ...newTask, durationText: e.target.value })}
                className={`w-full p-2 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                }`}
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-slate-400">المنطقة / المنشأ:</label>
              <select
                value={newTask.facility}
                onChange={(e) => setNewTask({ ...newTask, facility: e.target.value })}
                className={`w-full p-2 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                }`}
              >
                <option value="هنجر المعدات + المغسلة">هنجر المعدات + المغسلة</option>
                <option value="هنجر الشكاير (1-2)">هنجر الشكاير (1-2)</option>
                <option value="هنجر المعدات">هنجر المعدات</option>
                <option value="المغسلة">المغسلة</option>
                <option value="المعدات والمغسلة">المعدات والمغسلة</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-semibold text-slate-400">تاريخ البدء:</label>
              <input
                type="text"
                placeholder="2026/9/1"
                value={newTask.startDate}
                onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                className={`w-full p-2 rounded-xl border font-mono ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                }`}
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-slate-400">تاريخ الانتهاء:</label>
              <input
                type="text"
                placeholder="2026/9/20"
                value={newTask.endDate}
                onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })}
                className={`w-full p-2 rounded-xl border font-mono ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                }`}
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-slate-400">موقع الشلال (0-18):</label>
              <input
                type="number"
                min="0"
                max="18"
                value={newTask.timelinePosition}
                onChange={(e) => setNewTask({ ...newTask, timelinePosition: Number(e.target.value) })}
                className={`w-full p-2 rounded-xl border font-mono ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                }`}
              />
            </div>

            <div className="flex items-end md:col-span-3">
              <button
                type="submit"
                className="w-full p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                حفظ وإدراج المرحلة في المخطط الزمني
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Main Unified Gantt Table */}
      <div className={`border rounded-2xl shadow-2xl overflow-hidden transition-colors duration-200 ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 text-white font-bold border-b border-slate-700">
                <th className="p-2.5 w-10 text-center border-l border-slate-700 bg-slate-950/80">م</th>
                <th className="p-2.5 min-w-[200px] border-l border-slate-700">بيان الأعمال</th>
                <th className="p-2 text-center min-w-[120px] border-l border-slate-700">المنطقة الهندسية</th>
                <th className="p-2 text-center min-w-[85px] border-l border-slate-700 bg-blue-950/40">
                  المدة
                </th>
                <th className="p-2 text-center min-w-[90px] border-l border-slate-700">تاريخ البدء</th>
                <th className="p-2 text-center min-w-[90px] border-l border-slate-700">تاريخ الانتهاء</th>
                {/* 19 sequence slots for the complete waterfall matrix */}
                <th colSpan={19} className="p-2 text-center border-l border-slate-700 bg-blue-900/60 font-black text-amber-300">
                  المخطط الزمني الشلالي (Gantt Waterfall) • 5 شهور (1/8/2026 - 31/12/2026)
                </th>
                <th className="p-2 text-center w-16">إجراءات</th>
              </tr>

              {/* Master Scope Banner Rows */}
              <tr className="bg-blue-900/90 text-white font-black text-xs border-b border-slate-700">
                <td className="p-2 text-center border-l border-slate-700">-</td>
                <td className="p-2 border-l border-slate-700 text-amber-300 font-black" colSpan={2}>
                  إجمالي مدة المشروع المعتمدة
                </td>
                <td className="p-2 text-center border-l border-slate-700 bg-amber-400 text-slate-950 font-black">
                  5 شهور
                </td>
                <td className="p-2 text-center border-l border-slate-700 font-mono font-black text-white">
                  1/8/2026
                </td>
                <td className="p-2 text-center border-l border-slate-700 font-mono font-black text-white">
                  31/12/2026
                </td>
                <td colSpan={19} className="p-2 text-center bg-blue-600 text-white font-black border-l border-slate-700 tracking-wider">
                  المشروع الكامل المدمج (هناجر الشكاير 1 و 2 + هنجر المعدات + مغسلة المعدات)
                </td>
                <td className="p-2 text-center">-</td>
              </tr>

              {/* Sub-Banners for both facilities */}
              <tr className="bg-slate-950/80 text-white text-[11px] font-bold border-b border-slate-700">
                <td className="p-1 text-center border-l border-slate-700">A</td>
                <td className="p-1.5 border-l border-slate-700 text-emerald-400" colSpan={2}>
                  القطاع الأول: هناجر مصنع الشكاير (1-2)
                </td>
                <td className="p-1 text-center border-l border-slate-700 font-bold text-amber-400">5 شهور</td>
                <td className="p-1 text-center border-l border-slate-700 font-mono">1/8/2026</td>
                <td className="p-1 text-center border-l border-slate-700 font-mono">31/12/2026</td>
                <td colSpan={19} className="p-1 text-center bg-emerald-950/80 text-emerald-300 border-l border-slate-700 font-black">
                  هنجر الشكاير (1-2) • 17 مرحلة تنفيذية معتمدة
                </td>
                <td className="p-1 text-center">-</td>
              </tr>

              <tr className="bg-slate-950/80 text-white text-[11px] font-bold border-b border-slate-700">
                <td className="p-1 text-center border-l border-slate-700">B</td>
                <td className="p-1.5 border-l border-slate-700 text-amber-400" colSpan={2}>
                  القطاع الثاني: هنجر المعدات + المغسلة (الوثيقة المرفقة)
                </td>
                <td className="p-1 text-center border-l border-slate-700 font-bold text-amber-400">4 شهور</td>
                <td className="p-1 text-center border-l border-slate-700 font-mono">1/9/2026</td>
                <td className="p-1 text-center border-l border-slate-700 font-mono">31/12/2026</td>
                <td colSpan={19} className="p-1 text-center bg-amber-950/80 text-amber-300 border-l border-slate-700 font-black">
                  هنجر المعدات + المغسلة • 19 مرحلة تنفيذية معتمدة
                </td>
                <td className="p-1 text-center">-</td>
              </tr>
            </thead>

            <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-slate-800'}`}>
              {filteredItems.map((item, idx) => {
                const isEditing = editingId === item.id;
                const pos = item.timelinePosition !== undefined ? item.timelinePosition : (idx % 19);
                const facStyle = getFacilityStyle(item.facility);

                if (isEditing) {
                  return (
                    <tr key={item.id} className={isLight ? 'bg-amber-50 text-slate-900' : 'bg-amber-950/20 text-slate-100'}>
                      <td className={`p-2 text-center font-bold text-amber-500 border-l ${isLight ? 'border-slate-300' : 'border-slate-700'}`}>
                        {idx + 1}
                      </td>
                      <td className={`p-2 border-l ${isLight ? 'border-slate-300' : 'border-slate-700'}`}>
                        <input
                          type="text"
                          value={editForm.statement || ''}
                          onChange={(e) => setEditForm({ ...editForm, statement: e.target.value })}
                          className={`w-full rounded px-2 py-1 text-xs border ${
                            isLight ? 'bg-white border-amber-400 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                          }`}
                        />
                      </td>
                      <td className={`p-2 border-l ${isLight ? 'border-slate-300' : 'border-slate-700'}`}>
                        <input
                          type="text"
                          value={editForm.facility || ''}
                          onChange={(e) => setEditForm({ ...editForm, facility: e.target.value })}
                          className={`w-full rounded px-2 py-1 text-xs border ${
                            isLight ? 'bg-white border-amber-400 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                          }`}
                        />
                      </td>
                      <td className={`p-2 text-center border-l ${isLight ? 'border-slate-300' : 'border-slate-700'}`}>
                        <input
                          type="text"
                          value={editForm.durationText || ''}
                          onChange={(e) => setEditForm({ ...editForm, durationText: e.target.value })}
                          className={`w-20 rounded px-2 py-1 text-xs text-center font-bold text-amber-500 border ${
                            isLight ? 'bg-white border-amber-400' : 'bg-slate-950 border-slate-700'
                          }`}
                        />
                      </td>
                      <td className={`p-2 text-center border-l ${isLight ? 'border-slate-300' : 'border-slate-700'}`}>
                        <input
                          type="text"
                          value={editForm.startDate || ''}
                          onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                          className={`w-24 rounded px-2 py-1 text-xs text-center font-mono border ${
                            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                          }`}
                        />
                      </td>
                      <td className={`p-2 text-center border-l ${isLight ? 'border-slate-300' : 'border-slate-700'}`}>
                        <input
                          type="text"
                          value={editForm.endDate || ''}
                          onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                          className={`w-24 rounded px-2 py-1 text-xs text-center font-mono border ${
                            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                          }`}
                        />
                      </td>
                      <td colSpan={19} className={`p-2 text-center text-xs border-l ${
                        isLight ? 'text-slate-500 border-slate-300' : 'text-slate-400 border-slate-700'
                      }`}>
                        تعديل بيانات المرحلة...
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={handleSaveEdit}
                            className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition shadow cursor-pointer"
                            title="حفظ التعديلات"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 rounded-lg bg-slate-500 hover:bg-slate-400 text-white transition shadow cursor-pointer"
                            title="إلغاء"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                const isTodayActive = isDateInRange(activeDate, item.startDate, item.endDate);

                return (
                  <tr key={item.id} className={`transition group border ${
                    isTodayActive
                      ? isLight ? 'bg-amber-500/10 border-amber-400/80' : 'bg-amber-500/15 border-amber-500/40'
                      : isLight 
                      ? 'hover:bg-slate-50 border-slate-200 text-slate-800' 
                      : 'hover:bg-slate-800/40 border-slate-800 text-slate-200'
                  }`}>
                    <td className={`p-2 text-center font-mono font-bold border-l ${
                      isTodayActive
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}>
                      {idx + 1}
                    </td>
                    <td className={`p-2 font-semibold whitespace-nowrap border-l ${
                      isLight ? 'border-slate-200 text-slate-900' : 'border-slate-800 text-slate-100'
                    }`}>
                      <div className="flex items-center justify-between gap-2">
                        <span>{item.statement}</span>
                        {isTodayActive && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500 text-slate-950 shadow-xs shrink-0">
                            <Zap className="w-2.5 h-2.5 fill-slate-950" />
                            <span>نشط اليوم</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={`p-1.5 border-l text-center whitespace-nowrap ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-black border ${facStyle.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${facStyle.dot}`}></span>
                        <span>{item.facility || 'عام'}</span>
                      </span>
                    </td>
                    <td className={`p-2 text-center font-bold border-l whitespace-nowrap font-mono ${
                      isLight ? 'bg-slate-50 text-amber-600 border-slate-200' : 'bg-slate-950/40 text-amber-300 border-slate-800'
                    }`}>
                      {item.durationText || `${item.durationDays || 0} يوم`}
                    </td>
                    <td className={`p-2 text-center font-mono border-l whitespace-nowrap ${
                      isLight ? 'text-slate-600 border-slate-200' : 'text-slate-300 border-slate-800'
                    }`}>
                      {item.startDate}
                    </td>
                    <td className={`p-2 text-center font-mono border-l whitespace-nowrap ${
                      isLight ? 'text-slate-600 border-slate-200' : 'text-slate-300 border-slate-800'
                    }`}>
                      {item.endDate}
                    </td>

                    {/* 19 Waterfall Grid cells */}
                    {Array.from({ length: 19 }).map((_, cIdx) => {
                      const isActive = cIdx === pos;
                      return (
                        <td
                          key={cIdx}
                          className={`p-0 text-center border-l min-w-[30px] max-w-[38px] h-9 ${
                            isLight ? 'border-slate-200' : 'border-slate-800/60'
                          } ${
                            isActive
                              ? `${facStyle.bar} font-black shadow-md`
                              : isLight ? 'bg-slate-50/70' : 'bg-slate-950/60'
                          }`}
                        >
                          {isActive ? (
                            <div className="w-full h-full flex items-center justify-center text-[9px] whitespace-nowrap font-black px-0.5 border border-black/20">
                              {item.facility || 'المشروع'}
                            </div>
                          ) : null}
                        </td>
                      );
                    })}

                    <td className="p-1 text-center">
                      {isAdmin ? (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleStartEdit(item)}
                            className={`p-1 rounded transition cursor-pointer ${
                              isLight 
                                ? 'hover:bg-slate-200 text-slate-600 hover:text-slate-900' 
                                : 'hover:bg-slate-700 text-slate-400 hover:text-white'
                            }`}
                            title="تعديل التواريخ والمدد"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1 rounded hover:bg-rose-500/10 text-rose-500 transition cursor-pointer"
                            title="حذف البند"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
