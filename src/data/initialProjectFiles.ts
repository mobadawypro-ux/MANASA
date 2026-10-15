import { ProjectFile } from '../types/report';

export const DEFAULT_FILE_CATEGORIES = [
  'أوراق الموقع',
  'توريدات',
  'حصر',
  'مستخلصات',
  'مخططات ورسومات',
  'تقارير الجودة والاختبارات'
];

export const INITIAL_PROJECT_FILES: ProjectFile[] = [
  // 1. أوراق الموقع
  {
    id: 'file-1',
    title: 'أمر الإسناد الرسمي رقم 24/2026 لمشروع إنشاء الهناجر والمغسلة',
    category: 'أوراق الموقع',
    description: 'أمر الإسناد الصادر من الشركة الوطنية للأسمنت ببني سويف لشركة الهلال للمقاولات العمومية، بمدة تنفيذ 5 أشهر بقيمة الأعمال المعتمدة.',
    fileUrl: '',
    fileName: 'Contract_Award_Order_24_2026.pdf',
    fileSize: '1.8 MB',
    fileType: 'pdf',
    uploadDate: '2026/08/02',
    documentDate: '2026/08/01',
    referenceNumber: 'ص/24/2026-أسمنت',
    uploadedBy: 'إدارة المشروعات - الشركة الوطنية'
  },
  {
    id: 'file-2',
    title: 'محضر تسليم الموقع المشترك مع استشاري الأكاديمية البحرية',
    category: 'أوراق الموقع',
    description: 'محضر المعاينة المشتركة وتسليم موقع العمل بمجمع مصانع الشركة الوطنية للأسمنت، وتثبيت نقاط الربط المساحية والشيرب.',
    fileUrl: '',
    fileName: 'Site_Handover_Minutes_2026_08_01.pdf',
    fileSize: '1.2 MB',
    fileType: 'pdf',
    uploadDate: '2026/08/03',
    documentDate: '2026/08/01',
    referenceNumber: 'محضر-01/تسليم',
    uploadedBy: 'استشاري الأكاديمية العربية'
  },
  {
    id: 'file-3',
    title: 'تقرير أبحاث التربة وجسات قاع الحفر والمسار الصخري',
    category: 'أوراق الموقع',
    description: 'تقرير معمل ميكانيكا التربة المعتمد الموضح لقدرة تحمل التربة (Bearing Capacity) وإجهادات التأسيس وقاع الحفر بالهناجر.',
    fileUrl: '',
    fileName: 'Soil_Investigation_Boreholes_Report.pdf',
    fileSize: '3.4 MB',
    fileType: 'pdf',
    uploadDate: '2026/08/05',
    documentDate: '2026/07/28',
    referenceNumber: 'SOIL-GEO-2026-08',
    uploadedBy: 'معمل أبحاث التربة والاستشارات'
  },

  // 2. توريدات
  {
    id: 'file-4',
    title: 'إذن توريد واختبارات دفعة حديد التسليح عالي المقاومة B400D',
    category: 'توريدات',
    description: 'إذن استلام وتوريد الدفعة الأولى من حديد التسليح بأقطار (12، 16، 18 مم) مصحوباً بشهادات الاختبار الميكانيكي ومطابقة المواصفات القياسية.',
    fileUrl: '',
    fileName: 'Steel_Delivery_Test_Certificate_Batch1.pdf',
    fileSize: '2.1 MB',
    fileType: 'pdf',
    uploadDate: '2026/08/18',
    documentDate: '2026/08/17',
    referenceNumber: 'SUP-STL-001',
    uploadedBy: 'مهندس ضبط الجودة - شركة الهلال'
  },
  {
    id: 'file-5',
    title: 'شهادة جودة واختبارات الأسمنت البورتلاندي المقاوم للكبريتات SRC',
    category: 'توريدات',
    description: 'شهادة نتائج الاختبارات الكيميائية والفيزيائية لأسمنت الخرسانات العادية والمسلحة من إنتاج مصنع بني سويف للمشروع.',
    fileUrl: '',
    fileName: 'Cement_SRC_Quality_Certificate_2026.pdf',
    fileSize: '1.5 MB',
    fileType: 'pdf',
    uploadDate: '2026/08/20',
    documentDate: '2026/08/19',
    referenceNumber: 'CEM-SRC-QC-88',
    uploadedBy: 'قطاع مراقبة الجودة والإنتاج'
  },
  {
    id: 'file-6',
    title: 'محضر فحص واعتماد عينات الصاج المعرج والجمالونات المعدنية',
    category: 'توريدات',
    description: 'اعتماد العينات الفنية لقطاعات الحديد الإنشائي المجمع وسُمك الصاج المعرج المجلفن والمدهون حرارياً لهناجر المخازن والمعدات.',
    fileUrl: '',
    fileName: 'Corrugated_Sheets_Steel_Approval_Doc.pdf',
    fileSize: '2.7 MB',
    fileType: 'pdf',
    uploadDate: '2026/09/10',
    documentDate: '2026/09/08',
    referenceNumber: 'MAT-APP-STL-04',
    uploadedBy: 'طاقم إشراف الأكاديمية البحرية'
  },

  // 3. حصر
  {
    id: 'file-7',
    title: 'دفتر حصر الأعمال الترابية والحفر العام للهناجر والمغسلة',
    category: 'حصر',
    description: 'شيتات الحصر المساحي وقراءات الميزانية الشبكية لكميات الحفر بالتربة الصخرية بإجمالي 7580 م3 معتمدة هندسياً.',
    fileUrl: '',
    fileName: 'Earthworks_Excavation_Quantity_Survey.pdf',
    fileSize: '3.1 MB',
    fileType: 'pdf',
    uploadDate: '2026/09/01',
    documentDate: '2026/08/25',
    referenceNumber: 'QS-EARTH-2026-01',
    uploadedBy: 'المكتب الفني - شركة الهلال'
  },
  {
    id: 'file-8',
    title: 'شيت حصر الخرسانات العادية والمسلحة للقواعد ورقاب الأعمدة',
    category: 'حصر',
    description: 'بيان حصر مقاسات القواعد العادية والمسلحة المنفذة ومكعبات الصب الفعلية مقارنة ببنود المقايسة المسعرة المعتمدة.',
    fileUrl: '',
    fileName: 'Concrete_Footings_Quantity_Survey_Sheet.pdf',
    fileSize: '2.4 MB',
    fileType: 'pdf',
    uploadDate: '2026/09/22',
    documentDate: '2026/09/20',
    referenceNumber: 'QS-CONC-FT-02',
    uploadedBy: 'المكتب الفني واستشاري المشروع'
  },

  // 4. مستخلصات
  {
    id: 'file-9',
    title: 'المستخلص الجاري رقم (1) عن الأعمال المنفذة حتى 2026/10/02',
    category: 'مستخلصات',
    description: 'المستخلص الهندسي والمالي الجاري رقم 1 متضمناً نسب الصرف للأعمال المنفذة (الحفر والردم والخرسانات) بمطابقة بنود المقايسة الـ 74.',
    fileUrl: '',
    fileName: 'Interim_Payment_Certificate_IPC_01.pdf',
    fileSize: '4.2 MB',
    fileType: 'pdf',
    uploadDate: '2026/10/03',
    documentDate: '2026/10/02',
    referenceNumber: 'IPC-01-2026-CEMENT',
    uploadedBy: 'استشاري المشروع والمقاول'
  },
  {
    id: 'file-10',
    title: 'مذكرة صرف الدفعة المقدمة والخطابات البنكية المعتمدة',
    category: 'مستخلصات',
    description: 'شهادة سداد الدفعة المقدمة وخطاب الضمان البنكي الصادر والنهائي طبقاً لشروط وأحكام أمر الإسناد 24/2026.',
    fileUrl: '',
    fileName: 'Advance_Payment_Bank_Guarantee_Doc.pdf',
    fileSize: '1.9 MB',
    fileType: 'pdf',
    uploadDate: '2026/08/10',
    documentDate: '2026/08/08',
    referenceNumber: 'ADV-PAY-01-FIN',
    uploadedBy: 'الإدارة المالية - الشركة الوطنية'
  },

  // 5. مخططات ورسومات
  {
    id: 'file-11',
    title: 'المخطط العام التنفيذي المعتمد (Approved General Layout)',
    category: 'مخططات ورسومات',
    description: 'اللوحة المعمارية والتنظيمية المعتمدة لتوزيع هناجر الشكاير (1-2) وهنجر المعدات ومغسلة المعدات ومسارات الحركة وشبكة المرافق.',
    fileUrl: '',
    fileName: 'General_Layout_Hangars_Carwash_Approved.pdf',
    fileSize: '5.8 MB',
    fileType: 'pdf',
    uploadDate: '2026/08/05',
    documentDate: '2026/08/03',
    referenceNumber: 'DWG-GEN-01-REV2',
    uploadedBy: 'الأكاديمية العربية - قسم التصميم'
  },

  // 6. تقارير الجودة والاختبارات
  {
    id: 'file-12',
    title: 'نتائج اختبارات تكسير مكعبات الخرسانة العادية والمسلحة (7 و 28 يوم)',
    category: 'تقارير الجودة والاختبارات',
    description: 'شهادات تكسير مكعبات الخرسانة المعتمدة من المعمل المعتمد ومطابقة إجهاد الكسر fcu للمواصفات القياسية المصرية للكود.',
    fileUrl: '',
    fileName: 'Concrete_Compressive_Strength_Test_Report.pdf',
    fileSize: '2.3 MB',
    fileType: 'pdf',
    uploadDate: '2026/09/28',
    documentDate: '2026/09/27',
    referenceNumber: 'LAB-TEST-CUBES-2026',
    uploadedBy: 'معمل مراقبة الجودة المعملي'
  }
];
