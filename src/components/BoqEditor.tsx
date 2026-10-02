import React, { useState, useMemo } from 'react';
import { BoqItem } from '../types/report';
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
  RefreshCcw 
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<BoqItem>>({});
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New item form
  const [newItem, setNewItem] = useState<Omit<BoqItem, 'id'>>({
    category: 'أعمال الخرسانة',
    statement: '',
    unit: 'م٣',
    totalQuantity: 100,
    executedQuantity: 0,
    executionPercentage: 0,
    notes: ''
  });

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return Array.from(set);
  }, [items]);

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

  // Statistics
  const stats = useMemo(() => {
    const total = items.length;
    const completed = items.filter((i) => i.executionPercentage >= 100).length;
    const inProgress = items.filter((i) => i.executionPercentage > 0 && i.executionPercentage < 100).length;
    const notStarted = items.filter((i) => i.executionPercentage === 0).length;
    
    // Average calculated progress
    const avgCalc = items.length > 0
      ? Math.round(items.reduce((acc, curr) => acc + (curr.executionPercentage || 0), 0) / items.length)
      : 0;

    return { total, completed, inProgress, notStarted, avgCalc };
  }, [items]);

  const handleStartEdit = (item: BoqItem) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    
    // Recalculate percentage if quantities changed
    const tot = Number(editForm.totalQuantity) || 1;
    const exe = Number(editForm.executedQuantity) || 0;
    const calcPct = Math.min(100, Math.round((exe / tot) * 100));

    const updated = items.map((item) => {
      if (item.id === editingId) {
        return {
          ...item,
          ...editForm,
          totalQuantity: tot,
          executedQuantity: exe,
          executionPercentage: editForm.executionPercentage !== undefined ? Number(editForm.executionPercentage) : calcPct
        } as BoqItem;
      }
      return item;
    });

    onUpdateItems(updated);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا البند من جدول المقايسة؟')) {
      const updated = items.filter((i) => i.id !== id);
      onUpdateItems(updated);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.statement.trim()) {
      alert('يرجى إدخال بيان الأعمال');
      return;
    }

    const tot = Number(newItem.totalQuantity) || 1;
    const exe = Number(newItem.executedQuantity) || 0;
    const calcPct = Math.min(100, Math.round((exe / tot) * 100));

    const itemToAdd: BoqItem = {
      ...newItem,
      id: `boq-${Date.now()}`,
      executionPercentage: newItem.executionPercentage || calcPct
    };

    onUpdateItems([...items, itemToAdd]);
    setIsAddingNew(false);
    setNewItem({
      category: 'أعمال الخرسانة',
      statement: '',
      unit: 'م٣',
      totalQuantity: 100,
      executedQuantity: 0,
      executionPercentage: 0,
      notes: ''
    });
  };

  const handleRecalculateOverall = () => {
    if (confirm(`هل تريد تحديث النسبة الكلية للمشروع تلقائياً لتكون ${stats.avgCalc}% بناءً على متوسط البنود؟`)) {
      onUpdateOverallProgress(stats.avgCalc);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        {/* Overall Completion */}
        <div className="bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-900 border border-amber-500/40 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-400">إجمالي نسبة التنفيذ</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-amber-400">{overallProgress}%</span>
              <span className="text-[10px] text-slate-400">معتمد بالتقرير</span>
            </div>
            <button
              onClick={handleRecalculateOverall}
              className="mt-2 text-[11px] text-amber-300 hover:text-amber-200 flex items-center gap-1 underline underline-offset-2 cursor-pointer"
              title="مقارنة بالمتوسط الحسابي"
            >
              <RefreshCcw className="w-3 h-3" />
              تحديث للمحسوب ({stats.avgCalc}%)
            </button>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Total BOQ items */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">إجمالي بنود المقايسة</span>
            <p className="text-2xl font-bold text-white mt-1">{stats.total} بند</p>
            <span className="text-[10px] text-slate-500">مقسمة على {categories.length} تخصصات</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* In Progress items */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-sky-400">أعمال جارية حالياً</span>
            <p className="text-2xl font-bold text-sky-400 mt-1">{stats.inProgress} بند</p>
            <span className="text-[10px] text-slate-500">حفر، ردم، عادية، مسلحة</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Completed items */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-400">بنود مكتملة 100%</span>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.completed} بند</p>
            <span className="text-[10px] text-slate-500">جاهزة للاستلام النهائي</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Not Started */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">بنود مراحل قادمة</span>
            <p className="text-2xl font-bold text-slate-300 mt-1">{stats.notStarted} بند</p>
            <span className="text-[10px] text-slate-500">جمالونات وتشطيبات</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Control Bar: Filter, Search & Add button */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث في بنود المقايسة والملاحظات..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-9 pl-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">كافة التخصصات والأعمال ({items.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c} ({items.filter((i) => i.category === c).length})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddingNew(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            إضافة بند جديد للمقايسة
          </button>
        </div>
      </div>

      {/* Add New Item Form (collapsible) */}
      {isAddingNew && (
        <form
          onSubmit={handleAddItem}
          className="bg-slate-900 border-2 border-amber-500/50 rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="font-bold text-amber-400 text-base flex items-center gap-2">
              <Plus className="w-4 h-4" />
              إضافة بند جديد إلى مقايسة المشروع
            </h4>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              إلغاء
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">تصنيف الأعمال:</label>
              <input
                type="text"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                placeholder="مثال: أعمال الخرسانة، أعمال العزل..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">بيان الأعمال (الوصف الفني):</label>
              <input
                type="text"
                value={newItem.statement}
                onChange={(e) => setNewItem({ ...newItem, statement: e.target.value })}
                placeholder="مثال: خرسانة مسلحة للأساسات ورقاب الأعمدة"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">الوحدة:</label>
              <input
                type="text"
                value={newItem.unit}
                onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                placeholder="م٣، م٢، م.ط، عدد، طن"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">إجمالي الكمية بالمقايسة:</label>
              <input
                type="number"
                value={newItem.totalQuantity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  const exe = newItem.executedQuantity;
                  const pct = val > 0 ? Math.min(100, Math.round((exe / val) * 100)) : 0;
                  setNewItem({ ...newItem, totalQuantity: val, executionPercentage: pct });
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">الكمية المنفذة حتى الآن:</label>
              <input
                type="number"
                value={newItem.executedQuantity}
                onChange={(e) => {
                  const exe = Number(e.target.value);
                  const tot = newItem.totalQuantity || 1;
                  const pct = Math.min(100, Math.round((exe / tot) * 100));
                  setNewItem({ ...newItem, executedQuantity: exe, executionPercentage: pct });
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">النسبة المنفذة (%):</label>
              <input
                type="number"
                value={newItem.executionPercentage}
                onChange={(e) => setNewItem({ ...newItem, executionPercentage: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-amber-400 font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">ملاحظات هندسية:</label>
            <input
              type="text"
              value={newItem.notes || ''}
              onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
              placeholder="مثال: تم اعتماد العينات وجاري العمل..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm font-semibold transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold shadow-md shadow-amber-500/20 transition cursor-pointer"
            >
              حفظ وإدراج بالمقايسة
            </button>
          </div>
        </form>
      )}

      {/* Main BOQ Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 text-slate-200 border-b border-slate-700 font-bold">
                <th className="p-3 w-12 text-center">#</th>
                <th className="p-3 min-w-[140px]">تصنيف العمل</th>
                <th className="p-3 min-w-[260px]">بيان الأعمال طبقاً للمقايسة</th>
                <th className="p-3 text-center min-w-[100px]">إجمالي المقايسة</th>
                <th className="p-3 text-center min-w-[100px]">المنفذ فعلياً</th>
                <th className="p-3 text-center min-w-[120px]">نسبة الإنجاز</th>
                <th className="p-3 min-w-[180px]">ملاحظات المهندس</th>
                <th className="p-3 text-center w-24">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredItems.map((item, idx) => {
                const isEditing = editingId === item.id;

                if (isEditing) {
                  return (
                    <tr key={item.id} className="bg-slate-950/90 text-slate-100">
                      <td className="p-3 text-center font-mono text-amber-400 font-bold">{idx + 1}</td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={editForm.category || ''}
                          onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={editForm.statement || ''}
                          onChange={(e) => setEditForm({ ...editForm, statement: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-semibold"
                        />
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editForm.totalQuantity ?? item.totalQuantity}
                            onChange={(e) => setEditForm({ ...editForm, totalQuantity: Number(e.target.value) })}
                            className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-center"
                          />
                          <span className="text-[11px] text-slate-400">{item.unit}</span>
                        </div>
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={editForm.executedQuantity ?? item.executedQuantity}
                          onChange={(e) => {
                            const exe = Number(e.target.value);
                            const tot = Number(editForm.totalQuantity ?? item.totalQuantity) || 1;
                            setEditForm({
                              ...editForm,
                              executedQuantity: exe,
                              executionPercentage: Math.min(100, Math.round((exe / tot) * 100))
                            });
                          }}
                          className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-center font-bold text-amber-300"
                        />
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editForm.executionPercentage ?? item.executionPercentage}
                            onChange={(e) => setEditForm({ ...editForm, executionPercentage: Number(e.target.value) })}
                            className="w-14 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-center font-black text-amber-400"
                          />
                          <span className="text-xs text-slate-400">%</span>
                        </div>
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={editForm.notes || ''}
                          onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          onClick={handleSaveEdit}
                          className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition shadow cursor-pointer"
                          title="حفظ التعديل"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-800/50 transition duration-150 group"
                  >
                    <td className="p-3 text-center font-mono text-slate-500 text-xs">{idx + 1}</td>
                    <td className="p-3 font-semibold text-slate-300">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-xs">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-3 text-slate-100 font-medium leading-relaxed">
                      {item.statement}
                    </td>
                    <td className="p-3 text-center font-mono text-slate-300 font-medium">
                      {item.totalQuantity.toLocaleString()} <span className="text-slate-500 text-xs">{item.unit}</span>
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-amber-400">
                      {item.executedQuantity.toLocaleString()} <span className="text-slate-500 text-xs">{item.unit}</span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={`font-black text-xs px-2 py-0.5 rounded-full ${
                            item.executionPercentage >= 80
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : item.executionPercentage > 0
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          %{item.executionPercentage}
                        </span>
                        <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.executionPercentage >= 80
                                ? 'bg-emerald-500'
                                : item.executionPercentage > 0
                                ? 'bg-amber-500'
                                : 'bg-transparent'
                            }`}
                            style={{ width: `${Math.min(100, item.executionPercentage)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-slate-400 text-xs">
                      {item.notes || <span className="text-slate-600">-</span>}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1 opacity-70 group-hover:opacity-100 transition">
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="p-1 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                          title="تعديل البند"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1 rounded-md hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition cursor-pointer"
                          title="حذف البند"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
