import React, { useState, useMemo, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { AcademyLogo } from './AcademyLogo';
import { 
  Calculator, 
  Search, 
  TrendingUp, 
  DollarSign, 
  FileSpreadsheet, 
  Layers, 
  CheckCircle, 
  HardHat, 
  ArrowRight,
  Download,
  Info,
  Calendar,
  Building,
  Upload,
  Trash2,
  Lock,
  Plus
} from 'lucide-react';

interface QuantitySurveyViewProps {
  onClose?: () => void;
}

export const QuantitySurveyView: React.FC<QuantitySurveyViewProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { isAdmin, isGuest, openLoginModal } = useAuth();

  // Internal tab state: overview, combined, carwash, sacks, equipment
  const [activeTab, setActiveTab] = useState<'overview' | 'combined' | 'carwash' | 'sacks' | 'equipment'>('overview');

  // Interactive search state
  const [searchBuilding, setSearchBuilding] = useState<string>('');
  const [searchItem, setSearchItem] = useState<string>('');

  // Local storage synchronized price & progress state
  const [prices, setPrices] = useState<Record<string, number>>(() => {
    const keys = [
      'price_exc', 'price_fill', 'price_pe', 'price_bit', 'price_brick', 
      'price_dak', 'price_pc', 'price_rc', 'price_sog', 'price_steel', 
      'price_steel_str', 'price_sandwich', 'price_corrugated'
    ];
    const initial: Record<string, number> = {
      price_exc: 120,
      price_fill: 160,
      price_pe: 25,
      price_bit: 95,
      price_brick: 1800,
      price_dak: 110,
      price_pc: 3200,
      price_rc: 4800,
      price_sog: 450,
      price_steel: 42000,
      price_steel_str: 65000,
      price_sandwich: 480,
      price_corrugated: 180
    };
    keys.forEach(k => {
      const saved = localStorage.getItem(`survey_${k}`);
      if (saved !== null) {
        initial[k] = parseFloat(saved) || 0;
      }
    });
    return initial;
  });

  const [progress, setProgress] = useState<Record<string, number>>(() => {
    const keys = [
      'prog_exc', 'prog_fill', 'prog_pe', 'prog_bit', 'prog_brick', 
      'prog_dak', 'prog_pc', 'prog_rc', 'prog_sog', 'prog_steel', 
      'prog_steel_str', 'prog_sandwich', 'prog_corrugated',
      // Carwash progress keys
      'cw_exc_prog', 'cw_fill_prog', 'cw_pe_prog', 'cw_bit_prog', 'cw_brick_prog',
      'cw_dak_prog', 'cw_pc_prog', 'cw_rc_prog', 'cw_sog_prog', 'cw_steel_prog',
      'cw_steel_str_prog', 'cw_corrugated_prog',
      // Sacks progress keys
      'sk_exc_prog', 'sk_fill_prog', 'sk_pe_prog', 'sk_bit_prog', 'sk_brick_prog',
      'sk_dak_prog', 'sk_pc_prog', 'sk_rc_prog', 'sk_sog_prog', 'sk_steel_prog',
      'sk_steel_str_prog', 'sk_sandwich_prog',
      // Equipment progress keys
      'eq_exc_prog', 'eq_fill_prog', 'eq_pe_prog', 'eq_bit_prog', 'eq_brick_prog',
      'eq_dak_prog', 'eq_pc_prog', 'eq_rc_prog', 'eq_sog_prog', 'eq_steel_prog',
      'eq_steel_str_prog', 'eq_corrugated_prog'
    ];
    const initial: Record<string, number> = {};
    keys.forEach(k => {
      initial[k] = 0;
      const saved = localStorage.getItem(`survey_${k}`);
      if (saved !== null) {
        initial[k] = parseFloat(saved) || 0;
      }
    });
    return initial;
  });

  // Uploaded files local mock system
  const [uploads, setUploads] = useState<Record<string, { url: string; name: string }[]>>(() => {
    const initial: Record<string, { url: string; name: string }[]> = {
      cw: [],
      sk: [],
      eq: []
    };
    ['cw', 'sk', 'eq'].forEach(id => {
      const saved = localStorage.getItem(`survey_uploads_${id}`);
      if (saved) {
        try {
          initial[id] = JSON.parse(saved);
        } catch (e) {}
      }
    });
    return initial;
  });

  // Set file upload handler
  const handleUploadFile = (buildingId: 'cw' | 'sk' | 'eq', e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate Cloudinary/Server upload
    const mockUrl = URL.createObjectURL(file);
    const newUploads = [...uploads[buildingId], { url: mockUrl, name: file.name }];
    setUploads(prev => ({
      ...prev,
      [buildingId]: newUploads
    }));
    localStorage.setItem(`survey_uploads_${buildingId}`, JSON.stringify(newUploads));
    e.target.value = ''; // Reset input
  };

  const handleDeleteFile = (buildingId: 'cw' | 'sk' | 'eq', index: number) => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    const newUploads = uploads[buildingId].filter((_, i) => i !== index);
    setUploads(prev => ({
      ...prev,
      [buildingId]: newUploads
    }));
    localStorage.setItem(`survey_uploads_${buildingId}`, JSON.stringify(newUploads));
  };

  // Quantity data
  const boqData: Record<string, Record<string, { value: string; unit: string }>> = {
    project: {
      "إجمالي أعمال الحفر": { value: "6,295.51", unit: "م³" },
      "إجمالي أعمال الردم المدموك": { value: "5,331.09", unit: "م³" },
      "فرش مشمع بولي إيثيلين": { value: "10,053.30", unit: "م²" },
      "إجمالي العزل البيتوميني": { value: "5,186.02", unit: "م²" },
      "مباني قصية الردم (طوب)": { value: "176.45", unit: "م³" },
      "طبقة أساس من الدقشوم": { value: "10,030.00", unit: "م²" },
      "خرسانة عادية للأساسات": { value: "320.12", unit: "م³" },
      "خرسانة مسلحة للأساسات": { value: "729.64", unit: "م³" },
      "أرضيات خرسانية S.O.G": { value: "10,030.00", unit: "م²" },
      "إجمالي حديد التسليح": { value: "181.67", unit: "طن" },
      "هيكل جمالون معدني": { value: "320.00", unit: "طن" },
      "تغطيات ساندوتش بانل": { value: "8,120.00", unit: "م²" },
      "تغطيات صاج معرج": { value: "2,300.00", unit: "م²" }
    },
    carwash: {
      "أعمال الحفر": { value: "795.51", unit: "م³" },
      "أعمال الردم": { value: "670.17", unit: "م³" },
      "مشمع بولي إيثيلين": { value: "377.90", unit: "م²" },
      "عزل بيتوميني": { value: "768.27", unit: "م²" },
      "مباني قصية الردم": { value: "42.29", unit: "م³" },
      "طبقة أساس من الدقشوم": { value: "990.00", unit: "م²" },
      "خرسانة عادية": { value: "28.30", unit: "م³" },
      "خرسانة مسلحة": { value: "150.81", unit: "م³" },
      "أرضيات خرسانية S.O.G": { value: "990.00", unit: "م²" },
      "حديد التسليح": { value: "35.16", unit: "طن" },
      "هيكل جمالون معدني": { value: "8.00", unit: "طن" },
      "تغطيات صاج معرج": { value: "400.00", unit: "م²" }
    },
    sacks: {
      "أعمال الحفر": { value: "3,420.00", unit: "م³" },
      "أعمال الردم": { value: "2,844.64", unit: "م³" },
      "مشمع بولي إيثيلين": { value: "8,388.80", unit: "م²" },
      "عزل بيتوميني": { value: "2,411.61", unit: "م²" },
      "مباني قصية الردم": { value: "81.00", unit: "م³" },
      "طبقة أساس من الدقشوم": { value: "8,000.00", unit: "م²" },
      "خرسانة عادية": { value: "226.14", unit: "م³" },
      "خرسانة مسلحة": { value: "349.22", unit: "م³" },
      "أرضيات خرسانية S.O.G": { value: "8,000.00", unit: "م²" },
      "حديد التسليح": { value: "108.33", unit: "طن" },
      "هيكل جمالون معدني": { value: "240.00", unit: "طن" },
      "تغطيات ساندوتش بانل": { value: "8,120.00", unit: "م²" }
    },
    equipment: {
      "أعمال الحفر": { value: "2,080.00", unit: "م³" },
      "أعمال الردم": { value: "1,816.28", unit: "م³" },
      "مشمع بولي إيثيلين": { value: "1,286.60", unit: "م²" },
      "عزل بيتوميني": { value: "2,006.14", unit: "م²" },
      "مباني قصية الردم": { value: "53.16", unit: "م³" },
      "طبقة أساس من الدقشوم": { value: "1,040.00", unit: "م²" },
      "خرسانة عادية": { value: "65.68", unit: "م³" },
      "خرسانة مسلحة": { value: "229.61", unit: "م³" },
      "أرضيات خرسانية S.O.G": { value: "1,040.00", unit: "م²" },
      "حديد التسليح": { value: "38.18", unit: "طن" },
      "هيكل جمالون معدني": { value: "72.00", unit: "طن" },
      "تغطيات صاج معرج": { value: "1,900.00", unit: "م²" }
    }
  };

  // Generate selectable items in search dropdown based on building
  const searchItemsList = useMemo(() => {
    if (!searchBuilding || !boqData[searchBuilding]) return [];
    return Object.keys(boqData[searchBuilding]);
  }, [searchBuilding]);

  // Combined Table Rows
  const combinedRows = [
    { label: 'إجمالي أعمال الحفر', qty: 6295.51, unit: 'م³', priceKey: 'price_exc', progKey: 'prog_exc' },
    { label: 'إجمالي أعمال الردم المدموك', qty: 5331.09, unit: 'م³', priceKey: 'price_fill', progKey: 'prog_fill' },
    { label: 'فرش مشمع بولي إيثيلين', qty: 10053.30, unit: 'م²', priceKey: 'price_pe', progKey: 'prog_pe' },
    { label: 'إجمالي العزل البيتوميني (شامل القصية والرقاب)', qty: 5186.02, unit: 'م²', priceKey: 'price_bit', progKey: 'prog_bit' },
    { label: 'مباني قصية الردم (طوب 25سم)', qty: 176.45, unit: 'م³', priceKey: 'price_brick', progKey: 'prog_brick' },
    { label: 'طبقة أساس من الدقشوم (أسفل الأرضيات)', qty: 10030.00, unit: 'م²', priceKey: 'price_dak', progKey: 'prog_dak' },
    { label: 'خرسانة عادية للأساسات (P.C)', qty: 320.12, unit: 'م³', priceKey: 'price_pc', progKey: 'prog_pc', isHighlight: true },
    { label: 'خرسانة مسلحة (قواعد وميدات ورقاب)', qty: 729.64, unit: 'م³', priceKey: 'price_rc', progKey: 'prog_rc', isHighlight: true },
    { label: 'أرضيات خرسانية ممسوسة S.O.G', qty: 10030.00, unit: 'م²', priceKey: 'price_sog', progKey: 'prog_sog', isHighlight: true },
    { label: 'إجمالي حديد التسليح (BBS)', qty: 181.67, unit: 'طن', priceKey: 'price_steel', progKey: 'prog_steel', isHighlight: true },
    { label: 'هيكل جمالون معدني', qty: 320.00, unit: 'طن', priceKey: 'price_steel_str', progKey: 'prog_steel_str', isHighlight: true, isMetal: true },
    { label: 'تغطيات أسقف (ساندوتش بانل)', qty: 8120.00, unit: 'م²', priceKey: 'price_sandwich', progKey: 'prog_sandwich', isHighlight: true, isMetal: true },
    { label: 'تغطيات أسقف (صاج معرج)', qty: 2300.00, unit: 'م²', priceKey: 'price_corrugated', progKey: 'prog_corrugated', isHighlight: true, isMetal: true },
  ];

  // Carwash table rows
  const carwashRows = [
    { label: 'أعمال الحفر', qty: 795.50, unit: 'م³', priceKey: 'price_exc', progKey: 'cw_exc_prog' },
    { label: 'أعمال الردم', qty: 670.17, unit: 'م³', priceKey: 'price_fill', progKey: 'cw_fill_prog' },
    { label: 'مشمع بولي إيثيلين', qty: 377.90, unit: 'م²', priceKey: 'price_pe', progKey: 'cw_pe_prog' },
    { label: 'عزل بيتوميني', qty: 768.27, unit: 'م²', priceKey: 'price_bit', progKey: 'cw_bit_prog' },
    { label: 'مباني قصية الردم', qty: 42.29, unit: 'م³', priceKey: 'price_brick', progKey: 'cw_brick_prog' },
    { label: 'طبقة أساس من الدقشوم', qty: 990.00, unit: 'م²', priceKey: 'price_dak', progKey: 'cw_dak_prog' },
    { label: 'خرسانة عادية (P.C)', qty: 28.30, unit: 'م³', priceKey: 'price_pc', progKey: 'cw_pc_prog', isHighlight: true },
    { label: 'خرسانة مسلحة (R.C)', qty: 150.81, unit: 'م³', priceKey: 'price_rc', progKey: 'cw_rc_prog', isHighlight: true },
    { label: 'أرضيات خرسانية (S.O.G)', qty: 990.00, unit: 'م²', priceKey: 'price_sog', progKey: 'cw_sog_prog', isHighlight: true },
    { label: 'حديد التسليح', qty: 35.16, unit: 'طن', priceKey: 'price_steel', progKey: 'cw_steel_prog' },
    { label: 'هيكل جمالون معدني', qty: 8.00, unit: 'طن', priceKey: 'price_steel_str', progKey: 'cw_steel_str_prog', isHighlight: true, isMetal: true },
    { label: 'تغطيات أسقف (صاج معرج)', qty: 400.00, unit: 'م²', priceKey: 'price_corrugated', progKey: 'cw_corrugated_prog', isHighlight: true, isMetal: true },
  ];

  // Sacks Warehouse rows
  const sacksRows = [
    { label: 'أعمال الحفر', qty: 3420.00, unit: 'م³', priceKey: 'price_exc', progKey: 'sk_exc_prog' },
    { label: 'أعمال الردم', qty: 2844.64, unit: 'م³', priceKey: 'price_fill', progKey: 'sk_fill_prog' },
    { label: 'مشمع بولي إيثيلين', qty: 8388.80, unit: 'م²', priceKey: 'price_pe', progKey: 'sk_pe_prog' },
    { label: 'عزل بيتوميني', qty: 2411.61, unit: 'م²', priceKey: 'price_bit', progKey: 'sk_bit_prog' },
    { label: 'مباني قصية الردم', qty: 81.00, unit: 'م³', priceKey: 'price_brick', progKey: 'sk_brick_prog' },
    { label: 'طبقة أساس من الدقشوم', qty: 8000.00, unit: 'م²', priceKey: 'price_dak', progKey: 'sk_dak_prog' },
    { label: 'خرسانة عادية (P.C)', qty: 226.14, unit: 'م³', priceKey: 'price_pc', progKey: 'sk_pc_prog', isHighlight: true },
    { label: 'خرسانة مسلحة (R.C)', qty: 349.22, unit: 'م³', priceKey: 'price_rc', progKey: 'sk_rc_prog', isHighlight: true },
    { label: 'أرضيات خرسانية (S.O.G)', qty: 8000.00, unit: 'م²', priceKey: 'price_sog', progKey: 'sk_sog_prog', isHighlight: true },
    { label: 'حديد التسليح', qty: 108.33, unit: 'طن', priceKey: 'price_steel', progKey: 'sk_steel_prog' },
    { label: 'هيكل جمالون معدني', qty: 240.00, unit: 'طن', priceKey: 'price_steel_str', progKey: 'sk_steel_str_prog', isHighlight: true, isMetal: true },
    { label: 'تغطيات أسقف (ساندوتش بانل)', qty: 8120.00, unit: 'م²', priceKey: 'price_sandwich', progKey: 'sk_sandwich_prog', isHighlight: true, isMetal: true },
  ];

  // Equipment Hangar rows
  const equipmentRows = [
    { label: 'أعمال الحفر', qty: 2080.00, unit: 'م³', priceKey: 'price_exc', progKey: 'eq_exc_prog' },
    { label: 'أعمال الردم', qty: 1816.28, unit: 'م³', priceKey: 'price_fill', progKey: 'eq_fill_prog' },
    { label: 'مشمع بولي إيثيلين', qty: 1286.60, unit: 'م²', priceKey: 'price_pe', progKey: 'eq_pe_prog' },
    { label: 'عزل بيتوميني', qty: 2006.14, unit: 'م²', priceKey: 'price_bit', progKey: 'eq_bit_prog' },
    { label: 'مباني قصية الردم', qty: 53.16, unit: 'م³', priceKey: 'price_brick', progKey: 'eq_brick_prog' },
    { label: 'طبقة أساس من الدقشوم', qty: 1040.00, unit: 'م²', priceKey: 'price_dak', progKey: 'eq_dak_prog' },
    { label: 'خرسانة عادية (P.C)', qty: 65.68, unit: 'م³', priceKey: 'price_pc', progKey: 'eq_pc_prog', isHighlight: true },
    { label: 'خرسانة مسلحة (R.C)', qty: 229.61, unit: 'م³', priceKey: 'price_rc', progKey: 'eq_rc_prog', isHighlight: true },
    { label: 'أرضيات خرسانية (S.O.G)', qty: 1040.00, unit: 'م²', priceKey: 'price_sog', progKey: 'eq_sog_prog', isHighlight: true },
    { label: 'حديد التسليح', qty: 38.18, unit: 'طن', priceKey: 'price_steel', progKey: 'eq_steel_prog' },
    { label: 'هيكل جمالون معدني', qty: 72.00, unit: 'طن', priceKey: 'price_steel_str', progKey: 'eq_steel_str_prog', isHighlight: true, isMetal: true },
    { label: 'تغطيات أسقف (صاج معرج)', qty: 1900.00, unit: 'م²', priceKey: 'price_corrugated', progKey: 'eq_corrugated_prog', isHighlight: true, isMetal: true },
  ];

  // Calculated Values
  const totals = useMemo(() => {
    let combinedCost = 0;
    let combinedExecutedCost = 0;

    combinedRows.forEach(row => {
      const price = prices[row.priceKey] || 0;
      const prog = progress[row.progKey] || 0;
      const cost = row.qty * price;
      combinedCost += cost;
      combinedExecutedCost += cost * (prog / 100);
    });

    // Individual buildings average progress values
    const calculateBuildingAvg = (rowsList: typeof carwashRows) => {
      let sum = 0;
      rowsList.forEach(r => {
        sum += progress[r.progKey] || 0;
      });
      return rowsList.length ? (sum / rowsList.length).toFixed(1) : '0';
    };

    const cwAvg = calculateBuildingAvg(carwashRows);
    const skAvg = calculateBuildingAvg(sacksRows);
    const eqAvg = calculateBuildingAvg(equipmentRows);

    return {
      combinedCost,
      combinedExecutedCost,
      cwAvg,
      skAvg,
      eqAvg
    };
  }, [prices, progress]);

  // Handle price change
  const handlePriceChange = (key: string, val: string) => {
    if (!isAdmin) return;
    const clean = parseFloat(val.replace(/[^0-9.]/g, '')) || 0;
    setPrices(prev => {
      const updated = { ...prev, [key]: clean };
      localStorage.setItem(`survey_${key}`, String(clean));
      return updated;
    });
  };

  // Handle progress percentage change
  const handleProgressChange = (key: string, val: string) => {
    if (!isAdmin) return;
    let clean = parseFloat(val.replace(/[^0-9.]/g, '')) || 0;
    if (clean > 100) clean = 100;
    if (clean < 0) clean = 0;
    setProgress(prev => {
      const updated = { ...prev, [key]: clean };
      localStorage.setItem(`survey_${key}`, String(clean));
      return updated;
    });
  };

  // Helper format currency
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 0 }).format(num);
  };

  // Export to Excel (CSV)
  const exportToCSV = (rowsList: any[], filename: string) => {
    let csv = '\ufeffالبند,الكمية,الوحدة,السعر (ج.م),التكلفة الإجمالية (ج.م),نسبة الإنجاز %\n';
    rowsList.forEach(row => {
      const price = prices[row.priceKey] || 0;
      const cost = row.qty * price;
      const prog = progress[row.progKey] || 0;
      csv += `"${row.label}","${row.qty}","${row.unit}","${price}","${cost}","${prog}%"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div className={`space-y-6 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
      
      {/* Top Title Card */}
      <div className={`p-6 rounded-3xl border shadow-xl relative overflow-hidden transition ${
        isLight ? 'bg-gradient-to-r from-blue-50 via-white to-amber-50 border-slate-200' : 'bg-gradient-to-r from-[#0C2340] via-slate-900 to-[#102E52] border-slate-800'
      }`}>
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_24px]"></div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
              <Calculator className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-wide">
                لوحة حصر كميات المشروع والدفاتر التفصيلية
              </h1>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-1`}>
                دفتر الحصر الهندسي الإنشائي وحساب التكاليف ونسب الإنجاز الفردية والمجمعة
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <AcademyLogo size="sm" showText={true} />
            {onClose && (
              <button 
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition cursor-pointer"
              >
                عودة للعرض الرئيسي
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className={`flex flex-wrap p-1.5 rounded-2xl border ${
        isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'
      }`}>
        {[
          { id: 'overview', label: 'الرئيسية والبحث السريع', icon: Layers },
          { id: 'combined', label: 'الجدول المجمع للمشروع', icon: FileSpreadsheet },
          { id: 'carwash', label: 'حصر مبنى المغسلة', icon: Building },
          { id: 'sacks', label: 'حصر مخازن الشكاير', icon: Building },
          { id: 'equipment', label: 'حصر هنجر المعدات', icon: Building },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black scale-[1.02]'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: OVERVIEW ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Smart Search Tool */}
          <div className={`p-6 rounded-3xl border-2 border-r-8 border-purple-500/80 shadow-md ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <h3 className="text-sm font-black text-purple-500 flex items-center gap-2 mb-3">
              <Search className="w-4 h-4" />
              البحث الذكي الفوري في كميات بنود وحصر المشروع
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold block mb-1.5 opacity-75">اختر المبنى أو الهيكل الهندسي:</label>
                <select
                  value={searchBuilding}
                  onChange={(e) => {
                    setSearchBuilding(e.target.value);
                    setSearchItem('');
                  }}
                  className={`w-full text-xs font-bold p-3 rounded-xl border focus:outline-none ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <option value="">-- اختر المبنى أولاً --</option>
                  <option value="project">إجمالي المشروع بالكامل</option>
                  <option value="carwash">مبنى المغسلة</option>
                  <option value="sacks">مخازن الشكاير</option>
                  <option value="equipment">هنجر المعدات</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1.5 opacity-75">اختر بند الأعمال التفصيلي:</label>
                <select
                  value={searchItem}
                  onChange={(e) => setSearchItem(e.target.value)}
                  disabled={!searchBuilding}
                  className={`w-full text-xs font-bold p-3 rounded-xl border focus:outline-none ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <option value="">-- اختر البند الهندسي --</option>
                  {searchItemsList.map(item => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>

            {searchBuilding && searchItem && boqData[searchBuilding]?.[searchItem] && (
              <div className={`p-4 rounded-2xl border border-dashed border-purple-500/40 text-center animate-fadeIn ${
                isLight ? 'bg-purple-50/50' : 'bg-purple-950/20'
              }`}>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">الكمية الإنشائية المعتمدة والمدققة لبند {searchItem} هي:</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-2xl font-black text-purple-500">
                    {boqData[searchBuilding][searchItem].value}
                  </span>
                  <span className="text-xs font-bold opacity-80">{boqData[searchBuilding][searchItem].unit}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quantities Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-5 rounded-2xl border text-center border-t-4 border-t-blue-500 ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}>
              <span className="text-xs opacity-75 font-semibold">كميات أعمال الحفر والردم</span>
              <p className="text-2xl font-black text-blue-500 mt-2">11,626.60 م³</p>
              <span className="text-[10px] opacity-60">مشترك بين كافة المباني والهناجر</span>
            </div>

            <div className={`p-5 rounded-2xl border text-center border-t-4 border-t-emerald-500 ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}>
              <span className="text-xs opacity-75 font-semibold">خرسانة عادية ومسلحة (C+S)</span>
              <p className="text-2xl font-black text-emerald-500 mt-2">3,507.76 م³</p>
              <span className="text-[10px] opacity-60">شامل الميدات ورقاب الأعمدة والأرضيات</span>
            </div>

            <div className={`p-5 rounded-2xl border text-center border-t-4 border-t-purple-500 ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}>
              <span className="text-xs opacity-75 font-semibold">القيمة التقديرية لحصر الكميات</span>
              <p className="text-2xl font-black text-purple-500 mt-2">
                {formatCurrency(totals.combinedCost)} ج.م
              </p>
              <span className="text-[10px] opacity-60">تتأثر ديناميكياً بأسعار البنود المدخلة</span>
            </div>

            <div className={`p-5 rounded-2xl border text-center border-t-4 border-t-amber-500 ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}>
              <span className="text-xs opacity-75 font-semibold">إجمالي المنشآت والجمالونات</span>
              <p className="text-2xl font-black text-amber-500 mt-2">320.00 طن</p>
              <span className="text-[10px] opacity-60">هيكل الحديد المقاوم وساندوتش بانل</span>
            </div>
          </div>

          {/* Visual Progress Dashboard Bar */}
          <div className={`p-6 rounded-3xl border shadow-sm ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <h3 className="text-sm font-black text-amber-500 flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4" />
              مؤشرات الإنجاز العام وحالة الصب والتركيب للمباني
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span>مبنى المغسلة وعناصره</span>
                  <span className="text-blue-500">{totals.cwAvg}%</span>
                </div>
                <div className="w-full bg-slate-700/20 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${totals.cwAvg}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span>مخازن الشكاير (عدد 2 هنجر)</span>
                  <span className="text-amber-500">{totals.skAvg}%</span>
                </div>
                <div className="w-full bg-slate-700/20 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${totals.skAvg}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span>هنجر المعدات الثقيلة</span>
                  <span className="text-emerald-500">{totals.eqAvg}%</span>
                </div>
                <div className="w-full bg-slate-700/20 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${totals.eqAvg}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: COMBINED TABLE ================= */}
      {activeTab === 'combined' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border bg-emerald-500/10 border-emerald-500/30">
            <div>
              <h3 className="text-sm font-black text-emerald-600 dark:text-emerald-400">الجدول المجمع لحصر الكميات والتقدير المالي</h3>
              <p className="text-xs opacity-80 mt-0.5">يتزامن تلقائياً لتسعير البنود وحساب المستخلص لكافة التبويبات الفردية</p>
            </div>
            <button
              onClick={() => exportToCSV(combinedRows, 'Master_BOQ_Project.csv')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              تصدير الجدول المجمع (Excel)
            </button>
          </div>

          <div className="overflow-x-auto border rounded-2xl">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-gradient-to-r from-blue-950 to-slate-900 text-white font-bold">
                  <th className="p-3 text-right">البند / العنصر المجمع</th>
                  <th className="p-3 text-center">الكمية الإجمالية للمشروع</th>
                  <th className="p-3 text-center">الوحدة</th>
                  <th className="p-3 text-center">سعر الوحدة (ج.م) {isAdmin && <small className="text-amber-300 font-bold block">(اضغط للتعديل ✎)</small>}</th>
                  <th className="p-3 text-center">التكلفة التقديرية (ج.م)</th>
                  <th className="p-3 text-center">نسبة الإنجاز % {isAdmin && <small className="text-amber-300 font-bold block">(اضغط للتعديل ✎)</small>}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/10">
                {combinedRows.map((row, idx) => {
                  const price = prices[row.priceKey] || 0;
                  const cost = row.qty * price;
                  const prog = progress[row.progKey] || 0;

                  return (
                    <tr 
                      key={idx} 
                      className={`transition-colors hover:bg-slate-500/5 ${
                        row.isHighlight ? 'font-bold bg-slate-500/2' : ''
                      }`}
                    >
                      <td className={`p-3 text-right ${row.isMetal ? 'text-blue-500 dark:text-blue-400' : ''}`}>{row.label}</td>
                      <td className="p-3 text-center font-mono font-bold">{row.qty.toLocaleString()}</td>
                      <td className="p-3 text-center">{row.unit}</td>
                      <td className="p-3 text-center">
                        {isAdmin ? (
                          <input
                            type="text"
                            value={price}
                            onChange={(e) => handlePriceChange(row.priceKey, e.target.value)}
                            className={`w-24 text-center font-mono font-bold p-1 rounded-lg border text-xs focus:ring-1 focus:ring-amber-500 ${
                              isLight ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-[#3a321a] border-amber-500/50 text-amber-300'
                            }`}
                          />
                        ) : (
                          <span className="font-mono font-bold">{price.toLocaleString()}</span>
                        )}
                      </td>
                      <td className="p-3 text-center font-mono font-black text-amber-500">
                        {formatCurrency(cost)}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-16 bg-slate-700/20 h-2 rounded-full overflow-hidden hidden sm:block">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${prog}%` }}></div>
                          </div>
                          {isAdmin ? (
                            <input
                              type="text"
                              value={prog}
                              onChange={(e) => handleProgressChange(row.progKey, e.target.value)}
                              className={`w-12 text-center font-mono font-bold p-1 rounded-lg border text-xs focus:ring-1 focus:ring-amber-500 ${
                                isLight ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-[#3a321a] border-amber-500/50 text-amber-300'
                              }`}
                            />
                          ) : (
                            <span className="font-mono">{prog}%</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: CARWASH ================= */}
      {activeTab === 'carwash' && (
        <div className="space-y-6">
          {/* File Upload Section */}
          <div className={`p-5 rounded-2xl border-2 border-dashed ${
            isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-800'
          }`}>
            <h3 className="text-xs font-black text-blue-500 flex items-center gap-1.5 mb-2">
              <Upload className="w-4 h-4" />
              لوحات ورسومات ومستندات حصر المغسلة
            </h3>
            <p className="text-[11px] opacity-75 mb-3">يمكنك رفع وتثبيت لوحات الحصر التفصيلي للرجوع إليها في أي وقت</p>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleUploadFile('cw', e)}
                className={`text-xs p-2 rounded-xl border cursor-pointer ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}
              />
            </div>

            {uploads.cw.length > 0 && (
              <ul className="mt-4 space-y-2">
                {uploads.cw.map((file, idx) => (
                  <li key={idx} className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}>
                    <a href={file.url} target="_blank" rel="noreferrer" className="text-blue-500 font-bold hover:underline">
                      📄 {file.name}
                    </a>
                    {isAdmin && (
                      <button onClick={() => handleDeleteFile('cw', idx)} className="text-red-500 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Building Financial Summary */}
          <div className="overflow-x-auto border rounded-2xl">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-gradient-to-r from-blue-900 to-slate-900 text-white font-bold">
                  <th className="p-3 text-right">البند</th>
                  <th className="p-3 text-center">الكمية</th>
                  <th className="p-3 text-center">الوحدة</th>
                  <th className="p-3 text-center">السعر المزامَن (ج.م)</th>
                  <th className="p-3 text-center">التكلفة (ج.م)</th>
                  <th className="p-3 text-center">التنفيذ الفردي % {isAdmin && <span className="text-amber-300 font-bold block">(تعديل ✎)</span>}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/10">
                {carwashRows.map((row, idx) => {
                  const price = prices[row.priceKey] || 0;
                  const cost = row.qty * price;
                  const prog = progress[row.progKey] || 0;

                  return (
                    <tr key={idx} className="transition hover:bg-slate-500/5">
                      <td className="p-3 text-right">{row.label}</td>
                      <td className="p-3 text-center font-mono font-bold">{row.qty.toLocaleString()}</td>
                      <td className="p-3 text-center">{row.unit}</td>
                      <td className="p-3 text-center font-mono font-bold text-slate-500">{price.toLocaleString()}</td>
                      <td className="p-3 text-center font-mono font-black text-amber-500">{formatCurrency(cost)}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-16 bg-slate-700/20 h-2 rounded-full overflow-hidden hidden sm:block">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${prog}%` }}></div>
                          </div>
                          {isAdmin ? (
                            <input
                              type="text"
                              value={prog}
                              onChange={(e) => handleProgressChange(row.progKey, e.target.value)}
                              className={`w-12 text-center font-mono font-bold p-1 rounded-lg border text-xs focus:ring-1 focus:ring-amber-500 ${
                                isLight ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-[#3a321a] border-amber-500/50 text-amber-300'
                              }`}
                            />
                          ) : (
                            <span className="font-mono">{prog}%</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Calculation Sheet (دفتر الحصر التفصيلي) */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-blue-500 border-r-4 pr-2 border-blue-500">
              دفتر الحصر الهندسي التفصيلي (Calculation Sheet) - المغسلة
            </h3>
            <div className="overflow-x-auto border rounded-2xl">
              <table className="w-full text-right border-collapse text-[11px]">
                <thead>
                  <tr className="bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-100 font-bold">
                    <th className="p-2 text-right">بيان الأعمال</th>
                    <th className="p-2 text-center">الوحدة</th>
                    <th className="p-2 text-center">العدد</th>
                    <th className="p-2 text-center">الطول (م)</th>
                    <th className="p-2 text-center">العرض (م)</th>
                    <th className="p-2 text-center">الارتفاع/السمك (م)</th>
                    <th className="p-2 text-center">الكمية الإجمالية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/10">
                  <tr className="bg-slate-500/5 font-bold"><td colSpan={7} className="p-2 text-right text-blue-500">1. الأعمال الترابية والمباني والعزل</td></tr>
                  <tr><td className="p-2">حفر لزوم الأساسات والخزانات</td><td className="p-2 text-center">م³</td><td className="p-2 text-center">1</td><td className="p-2 text-center">---</td><td className="p-2 text-center">مساحة 318.20</td><td className="p-2 text-center">2.50</td><td className="p-2 text-center font-mono font-bold">795.51</td></tr>
                  <tr><td className="p-2">خصم الخرسانات المدفونة</td><td className="p-2 text-center">م³</td><td className="p-2 text-center">1</td><td className="p-2 text-center">---</td><td className="p-2 text-center">---</td><td className="p-2 text-center">---</td><td className="p-2 text-center font-mono font-bold text-red-500">(125.34)</td></tr>
                  <tr className="bg-amber-500/10 font-bold"><td colSpan={6} className="p-2 text-right">إجمالي الردم المدموك</td><td className="p-2 text-center font-mono text-amber-500">670.17 م³</td></tr>
                  <tr><td className="p-2">مشمع بولي إيثيلين (أرضيات+ميدات)</td><td className="p-2 text-center">م²</td><td className="p-2 text-center">1</td><td className="p-2 text-center">---</td><td className="p-2 text-center">---</td><td className="p-2 text-center">---</td><td className="p-2 text-center font-mono">377.90</td></tr>
                  <tr><td className="p-2">عزل بيتوميني للأساسات والميدات</td><td className="p-2 text-center">م²</td><td className="p-2 text-center">1</td><td className="p-2 text-center">---</td><td className="p-2 text-center">---</td><td className="p-2 text-center">---</td><td className="p-2 text-center font-mono">369.77</td></tr>
                  <tr><td className="p-2">عزل بيتوميني لرقاب الأعمدة (+15 سم)</td><td className="p-2 text-center">م²</td><td className="p-2 text-center">18</td><td className="p-2 text-center">---</td><td className="p-2 text-center">---</td><td className="p-2 text-center">متغير 1.75</td><td className="p-2 text-center font-mono">60.20</td></tr>
                  <tr><td className="p-2">عزل بيتوميني لقصية الردم (وجهين)</td><td className="p-2 text-center">م²</td><td className="p-2 text-center">2</td><td className="p-2 text-center">99.50</td><td className="p-2 text-center">---</td><td className="p-2 text-center">1.70</td><td className="p-2 text-center font-mono">338.30</td></tr>
                  <tr><td className="p-2">مباني قصية الردم (25 سم)</td><td className="p-2 text-center">م³</td><td className="p-2 text-center">1</td><td className="p-2 text-center">99.50</td><td className="p-2 text-center">0.25</td><td className="p-2 text-center">1.70</td><td className="p-2 text-center font-mono">42.29</td></tr>
                  
                  <tr className="bg-slate-500/5 font-bold"><td colSpan={7} className="p-2 text-right text-blue-500">2. أعمال الخرسانة العادية (P.C)</td></tr>
                  <tr><td className="p-2">قواعد عادية F1</td><td className="p-2 text-center">م³</td><td className="p-2 text-center">3</td><td className="p-2 text-center">2.00</td><td className="p-2 text-center">1.80</td><td className="p-2 text-center">0.30</td><td className="p-2 text-center font-mono">3.24</td></tr>
                  <tr><td className="p-2">قواعد عادية F2</td><td className="p-2 text-center">م³</td><td className="p-2 text-center">4</td><td className="p-2 text-center">2.40</td><td className="p-2 text-center">2.40</td><td className="p-2 text-center">0.30</td><td className="p-2 text-center font-mono">6.91</td></tr>
                  <tr><td className="p-2">قواعد عادية F3</td><td className="p-2 text-center">م³</td><td className="p-2 text-center">8</td><td className="p-2 text-center">2.50</td><td className="p-2 text-center">2.30</td><td className="p-2 text-center">0.30</td><td className="p-2 text-center font-mono">13.80</td></tr>
                  <tr className="bg-emerald-500/10 font-bold"><td colSpan={6} className="p-2 text-right">إجمالي الخرسانة العادية</td><td className="p-2 text-center font-mono text-emerald-500">28.30 م³</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: SACKS WAREHOUSE ================= */}
      {activeTab === 'sacks' && (
        <div className="space-y-6">
          {/* File Upload Section */}
          <div className={`p-5 rounded-2xl border-2 border-dashed ${
            isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-800'
          }`}>
            <h3 className="text-xs font-black text-blue-500 flex items-center gap-1.5 mb-2">
              <Upload className="w-4 h-4" />
              لوحات ورسومات ومستندات حصر مخازن الشكاير
            </h3>
            <p className="text-[11px] opacity-75 mb-3">يمكنك رفع وتثبيت لوحات الحصر التفصيلي للرجوع إليها في أي وقت</p>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleUploadFile('sk', e)}
                className={`text-xs p-2 rounded-xl border cursor-pointer ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}
              />
            </div>

            {uploads.sk.length > 0 && (
              <ul className="mt-4 space-y-2">
                {uploads.sk.map((file, idx) => (
                  <li key={idx} className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}>
                    <a href={file.url} target="_blank" rel="noreferrer" className="text-blue-500 font-bold hover:underline">
                      📄 {file.name}
                    </a>
                    {isAdmin && (
                      <button onClick={() => handleDeleteFile('sk', idx)} className="text-red-500 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Building Financial Summary */}
          <div className="overflow-x-auto border rounded-2xl">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-gradient-to-r from-amber-700 to-slate-900 text-white font-bold">
                  <th className="p-3 text-right">البند</th>
                  <th className="p-3 text-center">الكمية</th>
                  <th className="p-3 text-center">الوحدة</th>
                  <th className="p-3 text-center">السعر المزامَن (ج.م)</th>
                  <th className="p-3 text-center">التكلفة (ج.م)</th>
                  <th className="p-3 text-center">التنفيذ الفردي % {isAdmin && <span className="text-amber-300 font-bold block">(تعديل ✎)</span>}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/10">
                {sacksRows.map((row, idx) => {
                  const price = prices[row.priceKey] || 0;
                  const cost = row.qty * price;
                  const prog = progress[row.progKey] || 0;

                  return (
                    <tr key={idx} className="transition hover:bg-slate-500/5">
                      <td className="p-3 text-right">{row.label}</td>
                      <td className="p-3 text-center font-mono font-bold">{row.qty.toLocaleString()}</td>
                      <td className="p-3 text-center">{row.unit}</td>
                      <td className="p-3 text-center font-mono font-bold text-slate-500">{price.toLocaleString()}</td>
                      <td className="p-3 text-center font-mono font-black text-amber-500">{formatCurrency(cost)}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-16 bg-slate-700/20 h-2 rounded-full overflow-hidden hidden sm:block">
                            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${prog}%` }}></div>
                          </div>
                          {isAdmin ? (
                            <input
                              type="text"
                              value={prog}
                              onChange={(e) => handleProgressChange(row.progKey, e.target.value)}
                              className={`w-12 text-center font-mono font-bold p-1 rounded-lg border text-xs focus:ring-1 focus:ring-amber-500 ${
                                isLight ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-[#3a321a] border-amber-500/50 text-amber-300'
                              }`}
                            />
                          ) : (
                            <span className="font-mono">{prog}%</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Calculation Sheet (دفتر الحصر التفصيلي) */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-amber-500 border-r-4 pr-2 border-amber-500">
              دفتر الحصر الهندسي التفصيلي (Calculation Sheet) - مخازن الشكاير
            </h3>
            <div className="overflow-x-auto border rounded-2xl">
              <table className="w-full text-right border-collapse text-[11px]">
                <thead>
                  <tr className="bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100 font-bold">
                    <th className="p-2 text-right">بيان الأعمال</th>
                    <th className="p-2 text-center">الوحدة</th>
                    <th className="p-2 text-center">العدد</th>
                    <th className="p-2 text-center">الطول (م)</th>
                    <th className="p-2 text-center">العرض (م)</th>
                    <th className="p-2 text-center">الارتفاع/السمك (م)</th>
                    <th className="p-2 text-center">الكمية للهنجر الواحد</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/10">
                  <tr className="bg-slate-500/5 font-bold"><td colSpan={7} className="p-2 text-right text-amber-500">1. الأعمال الترابية والمباني والعزل</td></tr>
                  <tr><td className="p-2">حفر الأساسات بنظام الشرائح والقواعد</td><td className="p-2 text-center">م³</td><td className="p-2 text-center">1</td><td className="p-2 text-center">---</td><td className="p-2 text-center">مساحة 1315</td><td className="p-2 text-center">1.30</td><td className="p-2 text-center font-mono font-bold">1710.00</td></tr>
                  <tr><td className="p-2">خصم الخرسانات والرقاب المدفونة</td><td className="p-2 text-center">م³</td><td className="p-2 text-center">1</td><td className="p-2 text-center">---</td><td className="p-2 text-center">---</td><td className="p-2 text-center">---</td><td className="p-2 text-center font-mono font-bold text-red-500">(287.68)</td></tr>
                  <tr className="bg-amber-500/10 font-bold"><td colSpan={6} className="p-2 text-right">إجمالي الردم المدموك للهنجر الواحد</td><td className="p-2 text-center font-mono text-amber-500">1422.32 م³</td></tr>
                  <tr><td className="p-2">مشمع بولي إيثيلين (أرضيات)</td><td className="p-2 text-center">م²</td><td className="p-2 text-center">1</td><td className="p-2 text-center">---</td><td className="p-2 text-center">مساحة</td><td className="p-2 text-center">---</td><td className="p-2 text-center font-mono">4000.00</td></tr>
                  <tr><td className="p-2">مشمع ميدات أرضية</td><td className="p-2 text-center">م²</td><td className="p-2 text-center">1</td><td className="p-2 text-center">324.00</td><td className="p-2 text-center">0.60</td><td className="p-2 text-center">---</td><td className="p-2 text-center font-mono">194.40</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: EQUIPMENT HANGAR ================= */}
      {activeTab === 'equipment' && (
        <div className="space-y-6">
          {/* File Upload Section */}
          <div className={`p-5 rounded-2xl border-2 border-dashed ${
            isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-800'
          }`}>
            <h3 className="text-xs font-black text-blue-500 flex items-center gap-1.5 mb-2">
              <Upload className="w-4 h-4" />
              لوحات ورسومات ومستندات حصر هنجر المعدات
            </h3>
            <p className="text-[11px] opacity-75 mb-3">يمكنك رفع وتثبيت لوحات الحصر التفصيلي للرجوع إليها في أي وقت</p>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleUploadFile('eq', e)}
                className={`text-xs p-2 rounded-xl border cursor-pointer ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}
              />
            </div>

            {uploads.eq.length > 0 && (
              <ul className="mt-4 space-y-2">
                {uploads.eq.map((file, idx) => (
                  <li key={idx} className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}>
                    <a href={file.url} target="_blank" rel="noreferrer" className="text-blue-500 font-bold hover:underline">
                      📄 {file.name}
                    </a>
                    {isAdmin && (
                      <button onClick={() => handleDeleteFile('eq', idx)} className="text-red-500 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Building Financial Summary */}
          <div className="overflow-x-auto border rounded-2xl">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-700 to-slate-900 text-white font-bold">
                  <th className="p-3 text-right">البند</th>
                  <th className="p-3 text-center">الكمية</th>
                  <th className="p-3 text-center">الوحدة</th>
                  <th className="p-3 text-center">السعر المزامَن (ج.م)</th>
                  <th className="p-3 text-center">التكلفة (ج.م)</th>
                  <th className="p-3 text-center">التنفيذ الفردي % {isAdmin && <span className="text-amber-300 font-bold block">(تعديل ✎)</span>}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/10">
                {equipmentRows.map((row, idx) => {
                  const price = prices[row.priceKey] || 0;
                  const cost = row.qty * price;
                  const prog = progress[row.progKey] || 0;

                  return (
                    <tr key={idx} className="transition hover:bg-slate-500/5">
                      <td className="p-3 text-right">{row.label}</td>
                      <td className="p-3 text-center font-mono font-bold">{row.qty.toLocaleString()}</td>
                      <td className="p-3 text-center">{row.unit}</td>
                      <td className="p-3 text-center font-mono font-bold text-slate-500">{price.toLocaleString()}</td>
                      <td className="p-3 text-center font-mono font-black text-amber-500">{formatCurrency(cost)}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-16 bg-slate-700/20 h-2 rounded-full overflow-hidden hidden sm:block">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${prog}%` }}></div>
                          </div>
                          {isAdmin ? (
                            <input
                              type="text"
                              value={prog}
                              onChange={(e) => handleProgressChange(row.progKey, e.target.value)}
                              className={`w-12 text-center font-mono font-bold p-1 rounded-lg border text-xs focus:ring-1 focus:ring-amber-500 ${
                                isLight ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-[#3a321a] border-amber-500/50 text-amber-300'
                              }`}
                            />
                          ) : (
                            <span className="font-mono">{prog}%</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Calculation Sheet (دفتر الحصر التفصيلي) */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-emerald-500 border-r-4 pr-2 border-emerald-500">
              دفتر الحصر الهندسي التفصيلي (Calculation Sheet) - هنجر المعدات
            </h3>
            <div className="overflow-x-auto border rounded-2xl">
              <table className="w-full text-right border-collapse text-[11px]">
                <thead>
                  <tr className="bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100 font-bold">
                    <th className="p-2 text-right">بيان الأعمال</th>
                    <th className="p-2 text-center">الوحدة</th>
                    <th className="p-2 text-center">العدد</th>
                    <th className="p-2 text-center">الطول (م)</th>
                    <th className="p-2 text-center">العرض (م)</th>
                    <th className="p-2 text-center">الارتفاع/السمك (م)</th>
                    <th className="p-2 text-center">الكمية الإجمالية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/10">
                  <tr className="bg-slate-500/5 font-bold"><td colSpan={7} className="p-2 text-right text-emerald-500">1. الأعمال الترابية والمباني والعزل</td></tr>
                  <tr><td className="p-2">حفر لزوم أساسات هنجر المعدات الخرسانية</td><td className="p-2 text-center">م³</td><td className="p-2 text-center">1</td><td className="p-2 text-center">---</td><td className="p-2 text-center">مساحة 1040</td><td className="p-2 text-center">2.00</td><td className="p-2 text-center font-mono font-bold">2080.00</td></tr>
                  <tr><td className="p-2">خصم الخرسانات والرقاب المدفونة بالتربة</td><td className="p-2 text-center">م³</td><td className="p-2 text-center">1</td><td className="p-2 text-center">---</td><td className="p-2 text-center">---</td><td className="p-2 text-center">---</td><td className="p-2 text-center font-mono font-bold text-red-500">(263.72)</td></tr>
                  <tr className="bg-emerald-500/10 font-bold"><td colSpan={6} className="p-2 text-right">إجمالي الردم المدموك لهنجر المعدات</td><td className="p-2 text-center font-mono text-emerald-500">1816.28 م³</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
