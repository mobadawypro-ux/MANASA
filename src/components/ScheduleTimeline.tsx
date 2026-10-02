import React, { useState } from 'react';
import { ScheduleItem } from '../types/report';
import { Calendar, Plus, Edit2, Check, Clock, Sparkles } from 'lucide-react';

interface ScheduleTimelineProps {
  items: ScheduleItem[];
  onUpdateItems: (newItems: ScheduleItem[]) => void;
  contractorName?: string;
  contractNumber?: string;
}

export const ScheduleTimeline: React.FC<ScheduleTimelineProps> = ({
  items,
  onUpdateItems,
  contractorName = 'شركة الهلال للمقاولات العمومية',
  contractNumber = 'أمر إسناد رقم 24/2026'
}) => {
  const [editingCell, setEditingCell] = useState<{ itemId: string; month: number } | null>(null);
  const [cellText, setCellText] = useState('');

  const months = [
    { num: 1, name: 'الشهر الأول', dates: '2026/08/01 - 2026/08/31' },
    { num: 2, name: 'الشهر الثاني', dates: '2026/09/01 - 2026/09/30' },
    { num: 3, name: 'الشهر الثالث', dates: '2026/10/01 - 2026/10/31' },
    { num: 4, name: 'الشهر الرابع', dates: '2026/11/01 - 2026/11/30' },
    { num: 5, name: 'الشهر الخامس', dates: '2026/12/01 - 2026/12/31' },
    { num: 6, name: 'الشهر السادس', dates: '2027/01/01 - 2027/01/31' },
    { num: 7, name: 'الشهر السابع', dates: '2027/02/01 - 2027/02/28' },
    { num: 8, name: 'الشهر الثامن', dates: '2027/03/01 - 2027/03/31' },
    { num: 9, name: 'الشهر التاسع', dates: '2027/04/01 - 2027/05/01' }
  ];

  const handleCellClick = (itemId: string, month: number, currentVal: string) => {
    setEditingCell({ itemId, month });
    setCellText(currentVal || '');
  };

  const handleSaveCell = () => {
    if (!editingCell) return;
    const { itemId, month } = editingCell;

    const updated = items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          monthlyStatus: {
            ...item.monthlyStatus,
            [month]: cellText.trim()
          }
        };
      }
      return item;
    });

    onUpdateItems(updated);
    setEditingCell(null);
  };

  return (
    <div className="space-y-4">
      {/* Schedule Info Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base md:text-lg">
              البرنامج الزمني المعتمد لتنفيذ المشروع (Gantt Chart)
            </h3>
            <p className="text-xs text-slate-400">
              {contractorName} • {contractNumber} • مدة تنفيذ 9 أشهر
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            أعمال جارية أو مخططة
          </span>
          <span className="text-slate-400">اضغط على أي خانة للتعديل السريع</span>
        </div>
      </div>

      {/* Gantt Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 text-slate-200 border-b border-slate-700">
                <th className="p-3 w-10 text-center font-bold">م</th>
                <th className="p-3 min-w-[220px] font-bold">بيان الأعمال الإنشائية والتنفيذية</th>
                {months.map((m) => (
                  <th key={m.num} className="p-2 text-center min-w-[110px] border-r border-slate-800">
                    <div className="font-bold text-slate-200">{m.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{m.dates}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {items.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition group">
                  <td className="p-2.5 text-center font-mono text-slate-400 font-bold bg-slate-950/40">
                    {idx + 1}
                  </td>
                  <td className="p-2.5 font-semibold text-slate-200 whitespace-nowrap">
                    {item.statement}
                  </td>

                  {months.map((m) => {
                    const statusText = item.monthlyStatus[m.num] || '';
                    const isCellEditing =
                      editingCell?.itemId === item.id && editingCell?.month === m.num;

                    if (isCellEditing) {
                      return (
                        <td key={m.num} className="p-1 border-r border-slate-800 bg-amber-950/30">
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={cellText}
                              onChange={(e) => setCellText(e.target.value)}
                              placeholder="هنجر (1-2)..."
                              autoFocus
                              className="w-full bg-slate-950 border border-amber-500 rounded px-1.5 py-1 text-[11px] text-amber-200 focus:outline-none"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveCell();
                                if (e.key === 'Escape') setEditingCell(null);
                              }}
                            />
                            <button
                              onClick={handleSaveCell}
                              className="p-1 bg-amber-500 text-slate-950 rounded hover:bg-amber-400"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      );
                    }

                    const hasContent = Boolean(statusText.trim());

                    return (
                      <td
                        key={m.num}
                        onClick={() => handleCellClick(item.id, m.num, statusText)}
                        className={`p-1.5 text-center border-r border-slate-800/60 cursor-pointer transition select-none ${
                          hasContent
                            ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold'
                            : 'hover:bg-slate-800/30 text-slate-600'
                        }`}
                        title="انقر للتعديل"
                      >
                        {hasContent ? (
                          <div className="py-1 px-1 rounded bg-amber-500/30 border border-amber-500/40 text-[11px] leading-tight break-words shadow-sm">
                            {statusText}
                          </div>
                        ) : (
                          <span className="text-[10px] opacity-20">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
