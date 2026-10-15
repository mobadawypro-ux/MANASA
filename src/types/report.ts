export interface ProjectInfo {
  companyName: string;
  subLocation: string;
  contractor: string;
  contractNumber: string;
  consultant?: string; // e.g. "الأكاديمية العربية للعلوم والتكنولوجيا والنقل البحري"
  consultantLogoUrl?: string;
  projectTitle: string;
  handoverDate: string; // e.g. 2026/07/08
  durationMonths: number; // 8 or 9
  plannedEndDate: string; // e.g. 2027/03/08 or 2026/03/08
  reportDate: string; // e.g. 2026/09/13
  overallProgress: number; // e.g. 16%
  logoUrl?: string;
  notes?: string;
  cloudinaryCloudName?: string;
  cloudinaryUploadPreset?: string;
}

export interface BoqItem {
  id: string;
  itemNumber?: number; // 1 to 74
  category: string; // أولاً: الأعمال المدنية والتشطيبات, ثانياً: الأعمال المعدنية, ثالثاً: الأعمال الكهربائية, رابعاً: أعمال شبكة الحريق والإنذار, خامساً: أعمال السباكة ومعدات المغسلة, سادساً: معدات متخصصة أخرى
  statement: string; // بيان الأعمال
  unit: string; // م3, م2, م.ط, عدد, طن, بند, إلخ
  equipmentHangarQty?: number; // هنجر المعدات
  carWashQty?: number; // المغسلة
  storageHangarsQty?: number; // 2 هنجر مخازن
  totalQuantity: number; // إجمالي الكمية طبقا للمقايسة
  executedQuantity: number; // الكمية المنفذة
  executionPercentage: number; // النسبة المنفذة %
  notes?: string; // ملاحظات
  price?: number; // الفئة (جنيه)
  totalPrice?: number; // إجمالي السعر المقايس (الفئة * إجمالي الكمية)
  payoutRatio?: number; // نسبة الصرف % (مثال: 100)
  executedValue?: number; // القيمة المنفذة (جنيه)
}

export type UserRole = 'admin' | 'guest';

export interface ScheduleItem {
  id: string;
  taskIndex: number;
  statement: string; // بيان الأعمال
  durationText?: string; // e.g. "14 يوم", "7 أيام", "45 يوم"
  durationDays?: number; // number of days
  startDate?: string; // e.g. "2026/8/1"
  endDate?: string; // e.g. "2026/8/14"
  facility?: string; // e.g. "هنجر (1-2)"
  timelinePosition?: number; // column index 0 to 16 for staircase visualization
  // For months 1 to 5
  monthlyStatus?: {
    [month: number]: string;
  };
}

export interface SlideImage {
  id: string;
  url: string;
  caption: string;
  description?: string;
}

export type SlideType = 'cover' | 'timeline' | 'boq' | 'photos' | 'summary' | 'custom';

export const PROJECT_FACILITIES = [
  'هنجر الشكاير 1',
  'هنجر الشكاير 2',
  'هنجر المعدات',
  'مغسلة المعدات',
  'عام - كامل المشروع'
] as const;

export type ProjectFacility = (typeof PROJECT_FACILITIES)[number];

export interface ReportSlide {
  id: string;
  slideNumber: number;
  type: SlideType;
  title: string;
  subTitle?: string;
  badgeText?: string;
  dateText?: string;
  facility?: ProjectFacility | string; // هنجر الشكاير 1 | هنجر الشكاير 2 | هنجر المعدات | مغسلة المعدات
  images?: SlideImage[];
  layout?: 'single' | 'two-column' | 'three-column' | 'grid';
  customContent?: string;
}

export interface ProjectFile {
  id: string;
  title: string; // عنوان المستند
  category: string; // أوراق الموقع, توريدات, حصر, مستخلص, مخططات ورسومات, إلخ
  description?: string; // توصيف الملف وملاحظاته الهندسية
  fileUrl: string; // رابط الملف (PDF Data URL أو Google Drive أو رابط ويب)
  fileName: string; // اسم الملف الأصلي
  fileSize?: string; // حجم الملف (مثال: 1.4 MB)
  fileType: 'pdf' | 'document' | 'spreadsheet' | 'image' | 'other';
  uploadDate: string; // تاريخ الرفع
  documentDate?: string; // تاريخ المستند الرسمي
  referenceNumber?: string; // رقم الإشارة / كود المستند
  uploadedBy?: string; // الجهة الصادرة أو المعتمدة
}

export interface ReportData {
  projectInfo: ProjectInfo;
  boqItems: BoqItem[];
  scheduleItems: ScheduleItem[];
  slides: ReportSlide[];
  projectFiles?: ProjectFile[];
  customFileCategories?: string[];
}
