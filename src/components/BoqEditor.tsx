import React, { useState, useMemo } from 'react';
import { BoqItem } from '../types/report';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Printer, 
  RefreshCcw,
  ShieldCheck,
  Eye,
  Lock,
  X,
  FileSpreadsheet,
  Coins,
  Calculator
} from 'lucide-react';

interface BoqEditorProps {
  items: BoqItem[];
  overallProgress: number;
  onUpdateItems: (newItems: BoqItem[]) => void;
  onUpdateOverallProgress: (progress: number) => void;
}

export const BoqEditor: React.FC<BoqEditorProps> = ({
  items,
  overallProgress,
  onUpdateItems,
  onUpdateOverallProgress
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const { isAdmin, isGuest, openLoginModal } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<BoqItem>>({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // New item form
  const [newItem, setNewItem] = useState<Partial<BoqItem>>({
    category: 'أولاً: الأعمال المدنية والتشطيبات',
    statement: '',
    unit: 'م3',
    equipmentHangarQty: 0,
    carWashQty: 0,
    storageHangarsQty: 0,
    totalQuantity: 100,
    executedQuantity: 0,
    executionPercentage: 0,
    price: 0,
    totalPrice: 0,
    payoutRatio: 100,
    executedValue: 0,
    notes: ''
  });

  const categories = [
    'أولاً: الأعمال المدنية والتشطيبات',
    'ثانياً: الأعمال المعدنية',
    'ثالثاً: الأعمال الكهربائية',
    'رابعاً: أعمال شبكة الحريق والإنذار',
    'خامساً: أعمال السباكة ومعدات المغسلة',
    'سادساً: معدات متخصصة أخرى'
  ];

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchSearch =
        item.statement.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [items, selectedCategory, searchTerm]);

  // Grand Totals matching the attached HTML exact formula
  const financialTotals = useMemo(() => {
    let grandEstimated = 0;
    let grandExecuted = 0;

    items.forEach((item) => {
      // Estimated totalPrice
      const estPrice = item.totalPrice !== undefined ? item.totalPrice : (item.price || 0) * (item.totalQuantity || 0);
      grandEstimated += estPrice;

      // Executed value: (actualQuantity / totalQuantity) * totalPrice * (payoutRatio / 100)
      const actualQty = item.executedQuantity || 0;
      const totQty = item.totalQuantity || 1;
      const payout = item.payoutRatio !== undefined ? item.payoutRatio : 100;
      const execVal = totQty > 0 ? (actualQty / totQty) * estPrice * (payout / 100) : 0;
      grandExecuted += execVal;
    });

    const completionPercent = grandEstimated > 0 ? Math.round((grandExecuted / grandEstimated) * 1000) / 10 : 0;

    return {
      grandEstimated,
      grandExecuted,
      completionPercent
    };
  }, [items]);

  // Update progress in parent component if it differs to keep sync
  React.useEffect(() => {
    const calculated = Math.round(financialTotals.completionPercent);
    if (calculated !== overallProgress && calculated > 0) {
      onUpdateOverallProgress(calculated);
    }
  }, [financialTotals.completionPercent, overallProgress, onUpdateOverallProgress]);

  // Statistics
  const stats = useMemo(() => {
    const total = items.length;
    const completed = items.filter((i) => i.executionPercentage >= 100).length;
    const inProgress = items.filter((i) => i.executionPercentage > 0 && i.executionPercentage < 100).length;
    const notStarted = items.filter((i) => i.executionPercentage === 0).length;
    
    return { total, completed, inProgress, notStarted };
  }, [items]);

  // Handlers for Admin actions
  const handleActualChange = (itemId: string, newActual: number) => {
    if (!isAdmin) {
      setFeedbackNotice('عذراً، هذا الحساب بصفة زائر للتصفح فقط. يرجى تسجيل الدخول كمسؤول للتعديل.');
      setTimeout(() => setFeedbackNotice(null), 4000);
      return;
    }

    const updated = items.map((item) => {
      if (item.id === itemId) {
        const total = item.totalQuantity || 1;
        const actual = Math.max(0, newActual);
        const percentage = total > 0 ? Math.round((actual / total) * 1000) / 10 : 0;
        
        const price = item.price || 0;
        const estPrice = item.totalPrice !== undefined ? item.totalPrice : price * total;
        const payout = item.payoutRatio !== undefined ? item.payoutRatio : 100;
        const executedValue = total > 0 ? (actual / total) * estPrice * (payout / 100) : 0;

        return {
          ...item,
          executedQuantity: actual,
          executionPercentage: percentage,
          executedValue: Math.round(executedValue * 100) / 100
        };
      }
      return item;
    });

    onUpdateItems(updated);
  };

  const handlePayoutRatioChange = (itemId: string, newPayout: number) => {
    if (!isAdmin) {
      setFeedbackNotice('عذراً، هذا الحساب بصفة زائر للتصفح فقط. يرجى تسجيل الدخول كمسؤول للتعديل.');
      setTimeout(() => setFeedbackNotice(null), 4000);
      return;
    }

    const updated = items.map((item) => {
      if (item.id === itemId) {
        const total = item.totalQuantity || 1;
        const actual = item.executedQuantity || 0;
        const payout = Math.min(100, Math.max(0, newPayout));
        
        const price = item.price || 0;
        const estPrice = item.totalPrice !== undefined ? item.totalPrice : price * total;
        const executedValue = total > 0 ? (actual / total) * estPrice * (payout / 100) : 0;

        return {
          ...item,
          payoutRatio: payout,
          executedValue: Math.round(executedValue * 100) / 100
        };
      }
      return item;
    });

    onUpdateItems(updated);
  };

  const handlePriceChange = (itemId: string, newPrice: number) => {
    if (!isAdmin) {
      setFeedbackNotice('عذراً، هذا الحساب بصفة زائر للتصفح فقط. يرجى تسجيل الدخول كمسؤول للتعديل.');
      setTimeout(() => setFeedbackNotice(null), 4000);
      return;
    }

    const updated = items.map((item) => {
      if (item.id === itemId) {
        const total = item.totalQuantity || 1;
        const actual = item.executedQuantity || 0;
        const price = Math.max(0, newPrice);
        const totalPrice = price * total;
        const payout = item.payoutRatio !== undefined ? item.payoutRatio : 100;
        const executedValue = total > 0 ? (actual / total) * totalPrice * (payout / 100) : 0;

        return {
          ...item,
          price: price,
          totalPrice: totalPrice,
          executedValue: Math.round(executedValue * 100) / 100
        };
      }
      return item;
    });

    onUpdateItems(updated);
  };

  const handleNotesChange = (itemId: string, newNotes: string) => {
    if (!isAdmin) {
      setFeedbackNotice('عذراً، هذا الحساب بصفة زائر للتصفح فقط. يرجى تسجيل الدخول كمسؤول للتعديل.');
      setTimeout(() => setFeedbackNotice(null), 4000);
      return;
    }

    const updated = items.map((item) => (item.id === itemId ? { ...item, notes: newNotes } : item));
    onUpdateItems(updated);
  };

  const handleStartEdit = (item: BoqItem) => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    
    const eq = Number(editForm.equipmentHangarQty) || 0;
    const cw = Number(editForm.carWashQty) || 0;
    const st = Number(editForm.storageHangarsQty) || 0;
    const tot = editForm.totalQuantity ? Number(editForm.totalQuantity) : eq + cw + st;
    const exe = Number(editForm.executedQuantity) || 0;
    const uPrice = Number(editForm.price) || 0;
    const estTotPrice = uPrice * tot;
    const payRatio = editForm.payoutRatio !== undefined ? Number(editForm.payoutRatio) : 100;

    const calcPct = tot > 0 ? Math.round((exe / tot) * 1000) / 10 : 0;
    const calcExecVal = tot > 0 ? (exe / tot) * estTotPrice * (payRatio / 100) : 0;

    const updated = items.map((item) => {
      if (item.id === editingId) {
        return {
          ...item,
          ...editForm,
          equipmentHangarQty: eq,
          carWashQty: cw,
          storageHangarsQty: st,
          totalQuantity: tot,
          executedQuantity: exe,
          executionPercentage: calcPct,
          price: uPrice,
          totalPrice: estTotPrice,
          payoutRatio: payRatio,
          executedValue: Math.round(calcExecVal * 100) / 100
        } as BoqItem;
      }
      return item;
    });

    onUpdateItems(updated);
    setEditingId(null);
  };

  const handleDeleteItem = (id: string) => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    if (confirm('هل أنت متأكد من حذف هذا البند من جدول المقايسة؟')) {
      const filtered = items.filter((i) => i.id !== id);
      onUpdateItems(filtered);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      openLoginModal();
      return;
    }

    const eq = Number(newItem.equipmentHangarQty) || 0;
    const cw = Number(newItem.carWashQty) || 0;
    const st = Number(newItem.storageHangarsQty) || 0;
    const tot = newItem.totalQuantity ? Number(newItem.totalQuantity) : (eq + cw + st || 1);
    const exe = Number(newItem.executedQuantity) || 0;
    const uPrice = Number(newItem.price) || 0;
    const estTotPrice = uPrice * tot;
    const payRatio = newItem.payoutRatio !== undefined ? Number(newItem.payoutRatio) : 100;

    const pct = tot > 0 ? Math.round((exe / tot) * 1000) / 10 : 0;
    const calcExecVal = tot > 0 ? (exe / tot) * estTotPrice * (payRatio / 100) : 0;

    const created: BoqItem = {
      id: `boq-${Date.now()}`,
      itemNumber: items.length + 1,
      category: newItem.category || 'أولاً: الأعمال المدنية والتشطيبات',
      statement: newItem.statement || 'بند جديد',
      unit: newItem.unit || 'م3',
      equipmentHangarQty: eq,
      carWashQty: cw,
      storageHangarsQty: st,
      totalQuantity: tot,
      executedQuantity: exe,
      executionPercentage: pct,
      price: uPrice,
      totalPrice: estTotPrice,
      payoutRatio: payRatio,
      executedValue: Math.round(calcExecVal * 100) / 100,
      notes: newItem.notes || ''
    };

    onUpdateItems([...items, created]);
    setNewItem({
      category: 'أولاً: الأعمال المدنية والتشطيبات',
      statement: '',
      unit: 'م3',
      equipmentHangarQty: 0,
      carWashQty: 0,
      storageHangarsQty: 0,
      totalQuantity: 100,
      executedQuantity: 0,
      executionPercentage: 0,
      price: 0,
      totalPrice: 0,
      payoutRatio: 100,
      executedValue: 0,
      notes: ''
    });
    setIsAddingNew(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header matching attached HTML file */}
      <div className={`p-6 rounded-3xl border shadow-xl text-center relative overflow-hidden transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-900 border-slate-800 text-white shadow-xl'
      }`}>
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-bold text-xs mb-2">
          <FileSpreadsheet className="w-4 h-4" />
          الشركة الوطنية للأسمنت ببنى سويف
        </div>
        <h2 className="text-xl md:text-2xl font-black">
          المستخلص الختامي والتقرير المسعر والمجمع للأعمال
        </h2>
        <p className={`text-xs md:text-sm mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          تقرير الموقف التنفيذي المجمع المسعر لإنشاء 2 هنجر مخازن، هنجر صيانة، ومغسلة معدات ({items.length} بنداً معتمداً)
        </p>

        {/* Role Notice Indicator */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold ${
            isAdmin
              ? isLight
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
              : isLight
              ? 'bg-blue-50 border-blue-200 text-blue-900'
              : 'bg-blue-950/40 border-blue-500/40 text-blue-300'
          }`}>
            {isAdmin ? <ShieldCheck className="w-4 h-4 text-amber-500" /> : <Eye className="w-4 h-4 text-blue-500" />}
            <span>{isAdmin ? 'أنت في وضع: مسؤول النظام (أدمن) - التعديل الفوري للمبالغ والكميات متاح' : 'أنت في وضع: زائر (للمشاهدة والتصفح فقط)'}</span>
          </div>

          {!isAdmin && (
            <button
              onClick={openLoginModal}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              تسجيل الدخول كأدمن لتعديل الأسعار والكميات
            </button>
          )}

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            طباعة المستخلص الختامي
          </button>
        </div>
      </div>

      {/* Instruction Banner matching attached HTML */}
      <div className={`p-4 rounded-2xl border text-center text-xs md:text-sm font-bold flex items-center justify-center gap-2 ${
        isAdmin
          ? isLight 
            ? 'bg-amber-50/90 text-amber-900 border-amber-200' 
            : 'bg-amber-950/30 text-amber-200 border-amber-500/40'
          : isLight
          ? 'bg-slate-100 text-slate-700 border-slate-200'
          : 'bg-slate-900 text-slate-300 border-slate-800'
      }`}>
        <span>💡</span>
        {isAdmin ? (
          <span>
            بصفتك <strong>أدمن</strong>: قم بإدخال <strong>"الفئة"</strong> أو <strong>"المنفذ الفعلي"</strong> أو <strong>"نسبة الصرف %"</strong> لتحديث القيمة المنفذة الكلية ونسبة الإنجاز لحظياً في السحابة.
          </span>
        ) : (
          <span>
            وضع الزائر (للقراءة فقط): يمكنك استعراض مبالغ ومقايسات هنجر المعدات والمغسلة والمخازن ونسب الإنجاز المالية والفعلية.
          </span>
        )}
      </div>

      {feedbackNotice && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs text-center font-bold animate-fadeIn">
          {feedbackNotice}
        </div>
      )}

      {/* Quick Statistics Bar - Financial & Construction */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-xl'}`}>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">إجمالي القيمة المقايسة التقديرية</span>
          <p className="text-xl md:text-2xl font-black text-amber-500 mt-1 flex items-center gap-1.5">
            <Coins className="w-5 h-5 text-amber-500" />
            {financialTotals.grandEstimated.toLocaleString('ar-EG')} <span className="text-xs font-bold text-slate-400">ج.م</span>
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">لإجمالي الـ {stats.total} بنداً بالمشروع</span>
        </div>

        <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-xl'}`}>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">إجمالي القيمة المنفذة والمستحقة</span>
          <p className="text-xl md:text-2xl font-black text-emerald-500 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            {financialTotals.grandExecuted.toLocaleString('ar-EG')} <span className="text-xs font-bold text-slate-400">ج.م</span>
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">طبقاً للكميات المنفذة ونسب الصرف</span>
        </div>

        <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-xl'}`}>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">نسبة الإنجاز المالي والفعلي العام</span>
          <p className="text-xl md:text-2xl font-black text-sky-500 mt-1 flex items-center gap-1.5">
            <TrendingUp className="w-5 h-5 text-sky-500" />
            %{financialTotals.completionPercent}
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">مُحتسبة بوزن القيمة المالية للبنود</span>
        </div>

        <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-xl'}`}>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">حالة البنود الإنشائية المعتمدة</span>
          <p className="text-xl md:text-2xl font-black text-amber-500 mt-1 flex items-center gap-1.5">
            <Calculator className="w-5 h-5 text-amber-500" />
            {stats.completed} منتهية / {stats.inProgress} جارية
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">من أصل {stats.total} بنداً مجمعاً بالكامل</span>
        </div>
      </div>

      {/* Control Bar: Filter, Search & Add button */}
      <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl border ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-xl'
      }`}>
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث في بنود المستخلص والأسعار..."
              className={`w-full border rounded-xl pr-9 pl-4 py-2 text-xs focus:outline-none focus:border-amber-500 ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
              }`}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
            }`}
          >
            <option value="all">كافة مجموعات المقايسة ({items.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c} ({items.filter((i) => i.category === c).length})
              </option>
            ))}
          </select>
        </div>

        {isAdmin ? (
          <button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            {isAddingNew ? 'إلغاء الإضافة' : 'إضافة بند مسعر جديد'}
          </button>
        ) : (
          <button
            onClick={openLoginModal}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs rounded-xl border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            وضع الاستعراض للزوار
          </button>
        )}
      </div>

      {/* Add New Item Form (Admin only) */}
      {isAddingNew && isAdmin && (
        <form
          onSubmit={handleAddItem}
          className={`p-5 rounded-2xl border shadow-xl space-y-4 animate-fadeIn ${
            isLight ? 'bg-white border-amber-300' : 'bg-slate-900 border-amber-500/50'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
            <h4 className="font-bold text-sm text-amber-500 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              إضافة بند مسعر جديد للمقايسة والمستخلص
            </h4>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="p-1 rounded text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="md:col-span-2">
              <label className="block mb-1 font-semibold text-slate-400">المجموعة:</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className={`w-full p-2 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                }`}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-semibold text-slate-400">بيان الأعمال:</label>
              <input
                type="text"
                required
                value={newItem.statement}
                onChange={(e) => setNewItem({ ...newItem, statement: e.target.value })}
                placeholder="اسم ووصف البند"
                className={`w-full p-2 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                }`}
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-slate-400">الوحدة:</label>
              <input
                type="text"
                required
                value={newItem.unit}
                onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                placeholder="م3، م2، عدد، طن..."
                className={`w-full p-2 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                }`}
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-slate-400">الفئة (جنيه):</label>
              <input
                type="number"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                className={`w-full p-2 rounded-xl border text-amber-500 font-bold ${
                  isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-slate-700'
                }`}
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-slate-400">كمية هنجر المعدات:</label>
              <input
                type="number"
                value={newItem.equipmentHangarQty}
                onChange={(e) => setNewItem({ ...newItem, equipmentHangarQty: Number(e.target.value) })}
                className={`w-full p-2 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                }`}
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-slate-400">كمية المغسلة:</label>
              <input
                type="number"
                value={newItem.carWashQty}
                onChange={(e) => setNewItem({ ...newItem, carWashQty: Number(e.target.value) })}
                className={`w-full p-2 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                }`}
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-slate-400">كمية 2 هنجر مخازن:</label>
              <input
                type="number"
                value={newItem.storageHangarsQty}
                onChange={(e) => setNewItem({ ...newItem, storageHangarsQty: Number(e.target.value) })}
                className={`w-full p-2 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                }`}
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-slate-400">المنفذ الفعلي:</label>
              <input
                type="number"
                value={newItem.executedQuantity}
                onChange={(e) => setNewItem({ ...newItem, executedQuantity: Number(e.target.value) })}
                className={`w-full p-2 rounded-xl border font-bold text-sky-500 ${
                  isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-slate-700'
                }`}
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-slate-400">نسبة الصرف %:</label>
              <input
                type="number"
                value={newItem.payoutRatio}
                onChange={(e) => setNewItem({ ...newItem, payoutRatio: Number(e.target.value) })}
                className={`w-full p-2 rounded-xl border font-bold text-emerald-500 ${
                  isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-slate-700'
                }`}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-semibold text-slate-400">ملاحظات:</label>
              <input
                type="text"
                value={newItem.notes}
                onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                placeholder="ملاحظات البند"
                className={`w-full p-2 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                }`}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-700 text-white"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow"
            >
              حفظ وإدراج في الجدول
            </button>
          </div>
        </form>
      )}

      {/* Main Aggregated BOQ Table matching the attached file */}
      <div className={`border rounded-2xl shadow-xl overflow-hidden transition-colors ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              {/* Row 1 of header */}
              <tr className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white font-bold border-b border-slate-700">
                <th rowSpan={2} className="p-3 w-10 text-center border-l border-slate-700 bg-slate-950">
                  م
                </th>
                <th rowSpan={2} className="p-3 min-w-[200px] border-l border-slate-700">
                  بيان الأعمال
                </th>
                <th rowSpan={2} className="p-2.5 text-center min-w-[50px] border-l border-slate-700">
                  الوحدة
                </th>
                <th rowSpan={2} className="p-2.5 text-center min-w-[80px] border-l border-slate-700 bg-amber-500/10 text-amber-300 font-bold">
                  الفئة (جنيه)
                </th>
                <th colSpan={3} className="p-2 text-center border-l border-slate-700 bg-blue-900/60 font-black text-amber-300 text-[10px]">
                  الكميات المقايسة
                </th>
                <th rowSpan={2} className="p-2.5 text-center min-w-[75px] border-l border-slate-700 bg-slate-950/80 font-black">
                  إجمالي الكميات
                </th>
                <th rowSpan={2} className="p-2.5 text-center min-w-[100px] border-l border-slate-700 bg-amber-600/10 text-amber-400 font-black">
                  إجمالي السعر المقايس
                </th>
                <th rowSpan={2} className="p-2.5 text-center min-w-[85px] border-l border-slate-700 bg-sky-950/40 text-sky-300">
                  الكمية المنفذة
                </th>
                <th rowSpan={2} className="p-2.5 text-center min-w-[70px] border-l border-slate-700 bg-teal-950/40 text-teal-300">
                  نسبة الصرف %
                </th>
                <th rowSpan={2} className="p-2.5 text-center min-w-[100px] border-l border-slate-700 bg-emerald-950/40 text-emerald-300 font-bold">
                  القيمة المنفذة (جنيه)
                </th>
                <th rowSpan={2} className="p-2.5 text-center min-w-[80px] border-l border-slate-700 bg-emerald-950/70 text-emerald-300 font-black">
                  نسبة الإنجاز %
                </th>
                <th rowSpan={2} className="p-3 min-w-[120px] border-l border-slate-700 text-slate-300">
                  ملاحظات
                </th>
                {isAdmin && (
                  <th rowSpan={2} className="p-2 text-center w-16 bg-slate-950">
                    إجراءات
                  </th>
                )}
              </tr>
              {/* Row 2 of header */}
              <tr className="bg-slate-950 text-slate-300 font-bold border-b border-slate-700 text-[10px]">
                <th className="p-2 text-center border-l border-slate-700 bg-blue-950/40">المعدات</th>
                <th className="p-2 text-center border-l border-slate-700 bg-blue-950/40">المغسلة</th>
                <th className="p-2 text-center border-l border-slate-700 bg-blue-950/40">المخازن</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((catName) => {
                const groupItems = filteredItems.filter((i) => i.category === catName);
                if (groupItems.length === 0) return null;

                return (
                  <React.Fragment key={catName}>
                    {/* Category Group Header Row matching HTML group-header */}
                    <tr className="bg-blue-950/30 dark:bg-blue-950/50 border-y-2 border-blue-600/40 text-blue-900 dark:text-blue-300 font-black">
                      <td colSpan={isAdmin ? 15 : 14} className="p-2.5 pr-4 text-sm bg-gradient-to-r from-blue-100 via-sky-50 to-transparent dark:from-blue-950/80 dark:via-slate-900/60 dark:to-transparent">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                          {catName} ({groupItems.length} بند مسعر)
                        </span>
                      </td>
                    </tr>

                    {/* Group Items */}
                    {groupItems.map((item, idx) => {
                      const isEditing = editingId === item.id;
                      const pct = item.executionPercentage || 0;
                      const estTotalPrice = item.totalPrice !== undefined ? item.totalPrice : (item.price || 0) * item.totalQuantity;
                      const payout = item.payoutRatio !== undefined ? item.payoutRatio : 100;
                      const executedVal = item.executedValue !== undefined ? item.executedValue : (item.totalQuantity > 0 ? (item.executedQuantity / item.totalQuantity) * estTotalPrice * (payout / 100) : 0);

                      // Badge color based on progress
                      let pctBg = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
                      if (pct >= 100) {
                        pctBg = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 font-black border border-emerald-500/40';
                      } else if (pct > 0) {
                        pctBg = 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 font-bold border border-amber-500/40';
                      }

                      if (isEditing) {
                        return (
                          <tr key={item.id} className="bg-amber-500/10 border-b border-amber-500/30">
                            <td className="p-2 text-center font-bold text-amber-500 border-l border-slate-700">
                              {item.itemNumber || idx + 1}
                            </td>
                            <td className="p-2 border-l border-slate-700">
                              <input
                                type="text"
                                value={editForm.statement || ''}
                                onChange={(e) => setEditForm({ ...editForm, statement: e.target.value })}
                                className="w-full p-1.5 rounded border text-xs bg-slate-950 text-white border-amber-500"
                              />
                            </td>
                            <td className="p-2 border-l border-slate-700 text-center">
                              <input
                                type="text"
                                value={editForm.unit || ''}
                                onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                                className="w-12 p-1 text-center rounded border text-xs bg-slate-950 text-white border-amber-500"
                              />
                            </td>
                            <td className="p-2 border-l border-slate-700 text-center bg-amber-500/5">
                              <input
                                type="number"
                                value={editForm.price ?? 0}
                                onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                                className="w-16 p-1 text-center rounded border text-xs bg-slate-950 text-amber-400 font-bold"
                              />
                            </td>
                            <td className="p-2 border-l border-slate-700 text-center">
                              <input
                                type="number"
                                value={editForm.equipmentHangarQty ?? 0}
                                onChange={(e) => setEditForm({ ...editForm, equipmentHangarQty: Number(e.target.value) })}
                                className="w-12 p-1 text-center rounded border text-xs bg-slate-950 text-white"
                              />
                            </td>
                            <td className="p-2 border-l border-slate-700 text-center">
                              <input
                                type="number"
                                value={editForm.carWashQty ?? 0}
                                onChange={(e) => setEditForm({ ...editForm, carWashQty: Number(e.target.value) })}
                                className="w-12 p-1 text-center rounded border text-xs bg-slate-950 text-white"
                              />
                            </td>
                            <td className="p-2 border-l border-slate-700 text-center">
                              <input
                                type="number"
                                value={editForm.storageHangarsQty ?? 0}
                                onChange={(e) => setEditForm({ ...editForm, storageHangarsQty: Number(e.target.value) })}
                                className="w-12 p-1 text-center rounded border text-xs bg-slate-950 text-white"
                              />
                            </td>
                            <td className="p-2 border-l border-slate-700 text-center font-bold font-mono">
                              <input
                                type="number"
                                value={editForm.totalQuantity ?? 0}
                                onChange={(e) => setEditForm({ ...editForm, totalQuantity: Number(e.target.value) })}
                                className="w-16 p-1 text-center rounded border text-xs bg-slate-950 text-amber-400 font-bold"
                              />
                            </td>
                            {/* Estimated Total Price - readonly in row editor, computed from unitPrice * totalQty */}
                            <td className="p-2 border-l border-slate-700 text-center font-mono font-black text-amber-500/80 bg-amber-500/5">
                              {((editForm.price || 0) * (editForm.totalQuantity || 0)).toLocaleString()}
                            </td>
                            <td className="p-2 border-l border-slate-700 text-center">
                              <input
                                type="number"
                                value={editForm.executedQuantity ?? 0}
                                onChange={(e) => setEditForm({ ...editForm, executedQuantity: Number(e.target.value) })}
                                className="w-16 p-1 text-center rounded border text-xs bg-slate-950 text-sky-400 font-bold"
                              />
                            </td>
                            <td className="p-2 border-l border-slate-700 text-center">
                              <input
                                type="number"
                                value={editForm.payoutRatio ?? 100}
                                onChange={(e) => setEditForm({ ...editForm, payoutRatio: Number(e.target.value) })}
                                className="w-12 p-1 text-center rounded border text-xs bg-slate-950 text-emerald-400 font-bold"
                              />
                            </td>
                            <td className="p-2 border-l border-slate-700 text-center font-mono text-emerald-500 font-black">
                              -
                            </td>
                            <td className="p-2 border-l border-slate-700 text-center font-mono font-bold">
                              -
                            </td>
                            <td className="p-2 border-l border-slate-700">
                              <input
                                type="text"
                                value={editForm.notes || ''}
                                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                className="w-full p-1 rounded border text-xs bg-slate-950 text-white"
                              />
                            </td>
                            <td className="p-2 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={handleSaveEdit}
                                  className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow"
                                  title="حفظ"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"
                                  title="إلغاء"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }

                      return (
                        <tr
                          key={item.id}
                          className={`transition border-b ${
                            isLight
                              ? 'hover:bg-blue-50/40 border-slate-200 text-slate-800'
                              : 'hover:bg-slate-800/40 border-slate-800 text-slate-200'
                          }`}
                        >
                          {/* Item Number */}
                          <td className={`p-2.5 text-center font-mono font-bold border-l ${
                            isLight ? 'bg-slate-50 text-slate-600 border-slate-200' : 'bg-slate-950 text-slate-400 border-slate-800'
                          }`}>
                            {item.itemNumber || idx + 1}
                          </td>

                          {/* Statement */}
                          <td className={`p-2.5 font-medium border-l text-[11px] leading-relaxed ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                            {item.statement}
                          </td>

                          {/* Unit */}
                          <td className={`p-2 text-center border-l font-semibold text-[10px] ${
                            isLight ? 'bg-slate-50/50 text-slate-600 border-slate-200' : 'bg-slate-950/40 text-slate-400 border-slate-800'
                          }`}>
                            {item.unit}
                          </td>

                          {/* Unit Price (Editable for Admin directly in cell, viewable for Guest) */}
                          <td className={`p-1.5 text-center font-mono font-bold border-l bg-amber-500/5 ${
                            isLight ? 'border-slate-200 text-amber-800' : 'border-slate-800 text-amber-300'
                          }`}>
                            {isAdmin ? (
                              <input
                                type="number"
                                value={item.price || 0}
                                onChange={(e) => handlePriceChange(item.id, Number(e.target.value))}
                                className={`w-16 text-center font-mono font-bold p-1 rounded-md border text-[11px] focus:outline-none ${
                                  isLight
                                    ? 'bg-white border-amber-300 text-amber-900'
                                    : 'bg-slate-950 border-amber-500/40 text-amber-300'
                                }`}
                              />
                            ) : (
                              (item.price || 0).toLocaleString()
                            )}
                          </td>

                          {/* Equipment Hangar Qty */}
                          <td className={`p-2 text-center font-mono border-l ${
                            isLight ? 'border-slate-200 text-slate-700' : 'border-slate-800 text-slate-300'
                          }`}>
                            {item.equipmentHangarQty !== undefined ? item.equipmentHangarQty.toLocaleString() : '-'}
                          </td>

                          {/* Car Wash Qty */}
                          <td className={`p-2 text-center font-mono border-l ${
                            isLight ? 'border-slate-200 text-slate-700' : 'border-slate-800 text-slate-300'
                          }`}>
                            {item.carWashQty !== undefined ? item.carWashQty.toLocaleString() : '-'}
                          </td>

                          {/* 2 Storage Hangars Qty (المخازن) */}
                          <td className={`p-2 text-center font-mono border-l ${
                            isLight ? 'border-slate-200 text-slate-700' : 'border-slate-800 text-slate-300'
                          }`}>
                            {item.storageHangarsQty !== undefined ? item.storageHangarsQty.toLocaleString() : '-'}
                          </td>

                          {/* Total Quantity */}
                          <td className={`p-2 text-center font-mono font-bold border-l ${
                            isLight ? 'bg-slate-100/50 text-slate-900 border-slate-200' : 'bg-slate-950/50 text-amber-400 border-slate-800'
                          }`}>
                            {item.totalQuantity.toLocaleString()}
                          </td>

                          {/* Estimated Total Price */}
                          <td className={`p-2 text-center font-mono font-bold border-l bg-amber-500/5 ${
                            isLight ? 'border-slate-200 text-slate-800' : 'border-slate-800 text-amber-300'
                          }`}>
                            {estTotalPrice.toLocaleString()}
                          </td>

                          {/* Actual Executed Qty (Editable for Admin, viewable for Guest) */}
                          <td className={`p-1.5 text-center font-mono font-bold border-l bg-sky-500/5 ${
                            isLight ? 'border-slate-200' : 'border-slate-800'
                          }`}>
                            {isAdmin ? (
                              <input
                                type="number"
                                value={item.executedQuantity}
                                onChange={(e) => handleActualChange(item.id, Number(e.target.value))}
                                className={`w-16 text-center font-mono font-black p-1 rounded-md border text-[11px] focus:outline-none ${
                                  isLight
                                    ? 'bg-white border-blue-300 text-blue-900 focus:ring-2 focus:ring-blue-400'
                                    : 'bg-slate-950 border-blue-500/40 text-blue-300 focus:ring-2 focus:ring-blue-400'
                                }`}
                              />
                            ) : (
                              <span className="font-mono font-bold text-sky-600 dark:text-sky-300">
                                {item.executedQuantity.toLocaleString()}
                              </span>
                            )}
                          </td>

                          {/* Payout Ratio % (Editable for Admin, viewable for Guest) */}
                          <td className={`p-1.5 text-center font-mono font-bold border-l bg-teal-500/5 ${
                            isLight ? 'border-slate-200' : 'border-slate-800'
                          }`}>
                            {isAdmin ? (
                              <input
                                type="number"
                                value={payout}
                                onChange={(e) => handlePayoutRatioChange(item.id, Number(e.target.value))}
                                className={`w-12 text-center font-mono font-bold p-1 rounded-md border text-[11px] focus:outline-none ${
                                  isLight
                                    ? 'bg-white border-teal-300 text-teal-900'
                                    : 'bg-slate-950 border-teal-500/40 text-teal-300'
                                }`}
                              />
                            ) : (
                              <span className="text-teal-600 dark:text-teal-300 font-black">%{payout}</span>
                            )}
                          </td>

                          {/* Executed Value (جنيه) */}
                          <td className={`p-2 text-center font-mono font-black border-l bg-emerald-500/5 ${
                            isLight ? 'border-slate-200 text-emerald-800' : 'border-slate-800 text-emerald-300'
                          }`}>
                            {Math.round(executedVal).toLocaleString()}
                          </td>

                          {/* Percentage % */}
                          <td className={`p-2 text-center border-l font-mono ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                            <span className={`px-2 py-0.5 rounded text-[10px] inline-block min-w-[45px] ${pctBg}`}>
                              %{pct}
                            </span>
                          </td>

                          {/* Notes (Editable for Admin, viewable for Guest) */}
                          <td className={`p-1.5 border-l text-[10px] ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                            {isAdmin ? (
                              <input
                                type="text"
                                value={item.notes || ''}
                                onChange={(e) => handleNotesChange(item.id, e.target.value)}
                                placeholder="ملاحظة..."
                                className={`w-full p-1.5 rounded-md border text-[10px] ${
                                  isLight
                                    ? 'bg-white border-slate-200 text-slate-800 focus:border-amber-500'
                                    : 'bg-slate-950/60 border-slate-800 text-slate-300 focus:border-amber-500'
                                }`}
                              />
                            ) : (
                              <span className={item.notes ? (isLight ? 'text-slate-700' : 'text-slate-300') : 'text-slate-400 italic'}>
                                {item.notes || '-'}
                              </span>
                            )}
                          </td>

                          {/* Actions (Admin only) */}
                          {isAdmin && (
                            <td className="p-1 text-center bg-slate-950/10">
                              <div className="flex items-center justify-center gap-0.5">
                                <button
                                  onClick={() => handleStartEdit(item)}
                                  className={`p-1 rounded transition cursor-pointer ${
                                    isLight ? 'hover:bg-slate-200 text-slate-600' : 'hover:bg-slate-700 text-slate-400 hover:text-white'
                                  }`}
                                  title="تعديل تفصيلي"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="p-1 rounded hover:bg-rose-500/10 text-rose-500 transition cursor-pointer"
                                  title="حذف البند"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>

            {/* Total Footer Row - Exact Match to user's spreadsheet financial metrics */}
            <tfoot>
              <tr className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white font-bold border-t-2 border-slate-700 text-[11px]">
                <td colSpan={3} className="p-3 text-right font-black">
                  الإجمـــــالي العـــــام المجمع للمقايسة والمستخلص الختامي
                </td>
                <td className="p-3 text-center font-mono font-bold text-amber-300">
                  --
                </td>
                <td colSpan={4} className="p-3 text-center">
                  --
                </td>
                {/* Grand Estimated Price */}
                <td className="p-3 text-center font-mono font-black text-amber-400 bg-amber-500/10 border-x border-slate-700">
                  {Math.round(financialTotals.grandEstimated).toLocaleString()}
                </td>
                <td colSpan={2} className="p-3 text-center text-slate-400">
                  --
                </td>
                {/* Grand Executed Value */}
                <td className="p-3 text-center font-mono font-black text-emerald-400 bg-emerald-500/10 border-x border-slate-700">
                  {Math.round(financialTotals.grandExecuted).toLocaleString()}
                </td>
                {/* Grand Completion Percentage */}
                <td className="p-3 text-center font-mono font-black text-sky-400 bg-sky-500/10 border-x border-slate-700">
                  %{financialTotals.completionPercent}
                </td>
                <td colSpan={isAdmin ? 2 : 1} className="p-3 text-xs text-center text-slate-400">
                  الأكاديمية العربية للعلوم والتكنولوجيا
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
