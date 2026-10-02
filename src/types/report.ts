export interface ProjectInfo {
  companyName: string;
  subLocation: string;
  contractor: string;
  contractNumber: string;
  projectTitle: string;
  handoverDate: string; // e.g. 2026/07/08
  durationMonths: number; // 8 or 9
  plannedEndDate: string; // e.g. 2027/03/08 or 2026/03/08
  reportDate: string; // e.g. 2026/09/13
  overallProgress: number; // e.g. 16%
  logoUrl?: string;
  notes?: string;
}

export interface BoqItem {
  id: string;
  category: string;
  statement: string; // بيان الأعمال
  unit: string; // م3, م2, م.ط, عدد, طن, بند
  totalQuantity: number; // إجمالي الكمية طبقا للمقايسة
  executedQuantity: number; // الكمية المنفذة
  executionPercentage: number; // النسبة المنفذة %
  notes?: string; // ملاحظات
}

export interface ScheduleItem {
  id: string;
  taskIndex: number;
  statement: string; // بيان الأعمال
  // For months 1 to 9, indicates which facility/part is being worked on
  monthlyStatus: {
    [month: number]: string; // e.g. "هنجر (1-2)", "المغسلة + هنجر المعدات", "مكتمل", or ""
  };
}

export interface SlideImage {
  id: string;
  url: string;
  caption: string;
  description?: string;
}

export type SlideType = 'cover' | 'timeline' | 'boq' | 'photos' | 'summary' | 'custom';

export interface ReportSlide {
  id: string;
  slideNumber: number;
  type: SlideType;
  title: string;
  subTitle?: string;
  badgeText?: string;
  dateText?: string;
  images?: SlideImage[];
  layout?: 'single' | 'two-column' | 'three-column' | 'grid';
  customContent?: string;
}

export interface ReportData {
  projectInfo: ProjectInfo;
  boqItems: BoqItem[];
  scheduleItems: ScheduleItem[];
  slides: ReportSlide[];
}
