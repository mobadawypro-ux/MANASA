import { NEW_BOQ_ITEMS } from './newBoqItems';
import { INITIAL_PROJECT_FILES, DEFAULT_FILE_CATEGORIES } from './initialProjectFiles';
import { UNIFIED_SCHEDULE_ITEMS } from './unifiedScheduleItems';
import { ReportData } from '../types/report';

export const INITIAL_REPORT_DATA: ReportData = {
  projectInfo: {
    companyName: 'الشركة الوطنية للأسمنت ببنى سويف',
    subLocation: 'مجمع مصانع الشركة الوطنية للأسمنت ببنى سويف',
    contractor: 'شركة الهلال للمقاولات العمومية',
    contractNumber: 'أمر إسناد رقم 24/2026',
    consultant: 'الأكاديمية العربية للعلوم والتكنولوجيا والنقل البحري - شركة الأكاديمية لتكنولوجيا المعلومات والاتصالات',
    projectTitle: 'مشروع إنشاء عدد (2) هنجر بمصنع الشكاير - عدد (1) هنجر بمصنع المعدات - عدد (1) مغسلة بمصنع المعدات',
    handoverDate: '2026/08/01',
    durationMonths: 5,
    plannedEndDate: '2026/12/31',
    reportDate: '2026/10/15',
    overallProgress: 16,
    notes: 'البرنامج الزمني المعتمد بتاريخ 2026/8/1 ومدة تنفيذ المشروع خمسة أشهر حتى 2026/12/31.'
  },
  boqItems: NEW_BOQ_ITEMS,
  scheduleItems: UNIFIED_SCHEDULE_ITEMS,
  slides: [
    // Slide 1: Cover
    {
      id: 'slide-1',
      slideNumber: 1,
      type: 'cover',
      title: 'مشروع إنشاء عدد (2) هنجر بمصنع الشكاير - عدد (1) هنجر بمصنع المعدات - عدد (1) مغسلة بمصنع المعدات',
      subTitle: 'الشركة الوطنية للأسمنت ببنى سويف - مجمع مصانع الشركة الوطنية للأسمنت ببنى سويف - أمر إسناد رقم 24/2026',
      dateText: 'أكتوبر 2026'
    },
    // Slide 2: Timeline & Duration
    {
      id: 'slide-2',
      slideNumber: 2,
      type: 'summary',
      title: 'بيانات وتوقيتات المشروع الإنشائي (مدة 5 أشهر)',
      subTitle: 'مشروع إنشاء عدد (2) هنجر بمصنع الشكاير - عدد (1) هنجر بمصنع المعدات - عدد (1) مغسلة بمصنع المعدات'
    },
    // Slide 3: Gantt Schedule
    {
      id: 'slide-3',
      slideNumber: 3,
      type: 'timeline',
      title: 'البرنامج الزمني المعتمد للمشروع (مدة تنفيذ خمسة أشهر من 2026/8/1 وحتى 2026/12/31)',
      subTitle: 'شركة الهلال للمقاولات العمومية - أمر إسناد رقم 24/2026 - مدة تنفيذ المشروع خمسة أشهر'
    },
    // Slide 4: BOQ Part 1
    {
      id: 'slide-4',
      slideNumber: 4,
      type: 'boq',
      title: 'الموقف التنفيذي للأعمال الإنشائية (الجزء الأول)',
      subTitle: 'أعمال الحفر والردم والخرسانات والعزل والمباني والبياض والدهانات'
    },
    // Slide 5: BOQ Part 2
    {
      id: 'slide-5',
      slideNumber: 5,
      type: 'boq',
      title: 'تابع الموقف التنفيذي للأعمال الإنشائية (الجزء الثاني)',
      subTitle: 'الأرضيات، السباكة، الأعمال المعدنية، الخشبية، الجمالون المعدني، المرافق والكهرباء، شبكة الحريق، والمغسلة'
    },
    // Slide 6: الحفر
    {
      id: 'slide-6',
      slideNumber: 6,
      type: 'photos',
      title: 'أعمال الحفر وضبط قاع الحفر بالهراس الميكانيكي',
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى تاريخ اليوم (2026/10/15)',
      layout: 'three-column',
      images: [
        {
          id: 'img-6-1',
          url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1000&q=80',
          caption: 'أعمال حفر الأساسات في التربة الصخرية وتكسير الصخور بالحفار الميكانيكي',
          description: 'تنفيذ قطاع الحفر الهندسي حسب المناسيب التصميمية المعتمدة'
        },
        {
          id: 'img-6-2',
          url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1000&q=80',
          caption: 'تطهير وضبط قاع الحفر والمسار الطولي لخطوط الهناجر',
          description: 'إزالة النواتج غير الصالحة وتجهيز القاع'
        },
        {
          id: 'img-6-3',
          url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=1000&q=80',
          caption: 'متابعة أعمال التسوية والحفر العام بواسطة اللوادر والحفارات الثقيلة',
          description: 'موقع العمل بمجمع مصانع الشركة الوطنية للأسمنت ببني سويف'
        }
      ]
    },
    // Slide 7: التسوية
    {
      id: 'slide-7',
      slideNumber: 7,
      type: 'photos',
      title: 'أعمال التسوية وضبط المناسيب المساحية',
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى تاريخ اليوم (2026/10/15)',
      layout: 'two-column',
      images: [
        {
          id: 'img-7-1',
          url: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1000&q=80',
          caption: 'تسوية قاع حفر الهنجر بالبلدوزر والتأكد من استواء الأرض الطبيعية',
          description: 'المتابعة بأجهزة المساحة والميزان المساحي الميداني'
        },
        {
          id: 'img-7-2',
          url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80',
          caption: 'مسار قاع الحفر والتأكد من خلوه من النتوءات الصخرية غير المطابقة',
          description: 'تجهيز الموقع لاستقبال طبقات الإحلال والرمل المعتمد'
        }
      ]
    },
    // Slide 8: الغمر بالمياه
    {
      id: 'slide-8',
      slideNumber: 8,
      type: 'photos',
      title: 'الغمر بالمياه لشرائح الحفر وطبقات الإحلال',
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى تاريخ اليوم (2026/10/15)',
      layout: 'single',
      images: [
        {
          id: 'img-8-1',
          url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80',
          caption: 'أعمال الغمر بالمياه بواسطة فنطاس المياه وخراطيم الضغط العالي للوصول لنسبة الرطوبة المثالية (OMC)',
          description: 'توزيع المياه المتجانس على كامل مسطح القواعد قبل بدء الدمك الميكانيكي'
        }
      ]
    },
    // Slide 9: الدمك
    {
      id: 'slide-9',
      slideNumber: 9,
      type: 'photos',
      title: 'أعمال دمك شرائح الحفر وطبقات الإحلال بالهراس الاهتزازي',
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى تاريخ اليوم (2026/10/15)',
      layout: 'single',
      images: [
        {
          id: 'img-9-1',
          url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1200&q=80',
          caption: 'دمك قاع الحفر بالهراس الاهتزازي الثقيل بعدد أشواط محدد للوصول إلى أقصى كثافة جافة',
          description: 'التجهيز لاختبارات التحميل والكثافة الحقلية'
        }
      ]
    },
    // Slide 10: اختبارات التربة (بروكتور)
    {
      id: 'slide-10',
      slideNumber: 10,
      type: 'photos',
      title: 'أعمال اختبار طبقات التربة - اختبار بروكتور ومخروط الرمل (Sand Cone Test)',
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى تاريخ اليوم (2026/10/15)',
      layout: 'two-column',
      images: [
        {
          id: 'img-10-1',
          url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
          caption: 'إجراء اختبار الكثافة الحقلية بطريقة مخروط الرمل القياسي لطبقة الإحلال',
          description: 'أخذ عينات التربة المدموكة ووزنها وتحديد نسبة الدمك المحققة'
        },
        {
          id: 'img-10-2',
          url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80',
          caption: 'قياس حجم الحفرة واستخراج رمل أوتاوا القياسي للمعايرة الحقلية',
          description: 'التحقق من تحقيق نسبة دمك لا تقل عن 95% من أقصى كثافة جافة (Modified Proctor)'
        }
      ]
    },
    // Slide 11: متابعة اختبارات التربة
    {
      id: 'slide-11',
      slideNumber: 11,
      type: 'photos',
      title: 'استكمال اختبارات استلام طبقات التأسيس بواسطة مهندس ضبط الجودة',
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى تاريخ اليوم (2026/10/15)',
      layout: 'three-column',
      images: [
        {
          id: 'img-11-1',
          url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1000&q=80',
          caption: 'تثبيت الصفيحة الحلقية المعدنية وحفر العينة بعناية تامة في موقع الهنجر',
          description: 'فريق ضبط الجودة للمقاول والاستشاري'
        },
        {
          id: 'img-11-2',
          url: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1000&q=80',
          caption: 'تفريغ رمل المعايرة داخل المخروط وحساب وزن الرمل المتبقي',
          description: 'التسجيل في نماذج الاستلام المعتمدة'
        },
        {
          id: 'img-11-3',
          url: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=1000&q=80',
          caption: 'حفظ العينات في أكياس محكمة الغلق لتحديد المحتوى المائي المعملي (Moisture Content)',
          description: 'مطابقة النتائج مع منحنى بروكتور القياسي المعتمد'
        }
      ]
    },
    // Slide 12: توثيق الاختبارات
    {
      id: 'slide-12',
      slideNumber: 12,
      type: 'photos',
      title: 'توثيق نتائج اختبارات التربة بالموقع مع استشاري المشروع',
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى تاريخ اليوم (2026/10/15)',
      layout: 'two-column',
      images: [
        {
          id: 'img-12-1',
          url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1000&q=80',
          caption: 'تأكيد تجاوز نسبة الدمك للحد الأدنى المطلوب وإعطاء إذن التجهيز للصب',
          description: 'محضر استلام تربة التأسيس الميداني'
        },
        {
          id: 'img-12-2',
          url: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1000&q=80',
          caption: 'جمع كافة بيانات المحطات المساحية ومناسيب قاع الحفر بدقة',
          description: 'أرشيف الجودة الخاص بالشركة الوطنية للأسمنت'
        }
      ]
    },
    // Slide 13: فرش المشمع
    {
      id: 'slide-13',
      slideNumber: 13,
      type: 'photos',
      title: 'أعمال فرش مشمع البولي إيثيلين سمك 200 ميكرون',
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى تاريخ اليوم (2026/10/15)',
      layout: 'single',
      images: [
        {
          id: 'img-13-1',
          url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
          caption: 'فرش مشمع البولي إيثيلين عالي الكثافة (200 ميكرون) مع التراكب لعدم تسرب مياه الخرسانة العادية للتربة',
          description: 'حماية الخرسانة والحفاظ على نسب مكوناتها الكيميائية'
        }
      ]
    },
    // Slide 14: نجارة القواعد العادية
    {
      id: 'slide-14',
      slideNumber: 14,
      type: 'photos',
      title: 'أعمال الشدات الخشبية لزوم القواعد العادية',
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى تاريخ اليوم (2026/10/15)',
      layout: 'two-column',
      images: [
        {
          id: 'img-14-1',
          url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1000&q=80',
          caption: 'تركيب وضبط جوانب النجارة الخشبية للقواعد العادية حسب اللوحات الإنشائية',
          description: 'التقوية التامة وتثبيت المحاور الهندسية'
        },
        {
          id: 'img-14-2',
          url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1000&q=80',
          caption: 'نظرة عامة على محاور القواعد العادية لهنجر 1 و 2 قبل الصب',
          description: 'جاهزية الموقع لبدء أعمال الصب بالمضخة'
        }
      ]
    },
    // Slide 15: صب القواعد العادية
    {
      id: 'slide-15',
      slideNumber: 15,
      type: 'photos',
      title: 'أعمال صب الخرسانة العادية بواسطة مضخة الخرسانة وسيارات الخلاطة الجاهزة',
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى تاريخ اليوم (2026/10/15)',
      layout: 'two-column',
      images: [
        {
          id: 'img-15-1',
          url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1000&q=80',
          caption: 'وصول خلاطات الخرسانة الجاهزة وضخ الخرسانة بالقواعد العادية',
          description: 'استخدام أسمنت مقاوم للكبريتات SRC مطابق للمواصفات'
        },
        {
          id: 'img-15-2',
          url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=1000&q=80',
          caption: 'دمك الخرسانة بالهزاز الميكانيكي وتسوية الوجه العلوي للقاعدة',
          description: 'التحقق من عدم وجود تعشيش وضمان الكثافة'
        }
      ]
    },
    // Slide 16: تمام صب القواعد العادية
    {
      id: 'slide-16',
      slideNumber: 16,
      type: 'photos',
      title: 'تمام صب القواعد العادية والبدء في أعمال المعالجة المائية',
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى تاريخ اليوم (2026/10/15)',
      layout: 'single',
      images: [
        {
          id: 'img-16-1',
          url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80',
          caption: 'صفوف القواعد العادية بعد فك الشدات الخشبية والبدء في الرش بالماء والمعالجة (Curing)',
          description: 'محاذاة كاملة واستقامة هندسية ممتازة وفق محاور الأعمدة'
        }
      ]
    },
    // Slide 17: أعمال العزل
    {
      id: 'slide-17',
      slideNumber: 17,
      type: 'photos',
      title: 'أعمال عزل القواعد العادية (عزل بيتوميني وأسمنتي)',
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى تاريخ اليوم (2026/10/15)',
      layout: 'two-column',
      images: [
        {
          id: 'img-17-1',
          url: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1000&q=80',
          caption: 'دهان وجهين من البيتومين المؤكسد على البارد لكافة أسطح القواعد العادية',
          description: 'حماية الأسطح الخرسانية من الأملاح والمياه الجوفية'
        },
        {
          id: 'img-17-2',
          url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80',
          caption: 'استكمال نجارة وتجهيز القواعد المسلحة فوق القواعد العادية المعزولة',
          description: 'نظافة الأسطح وجفاف العزل قبل وضع حديد التسليح'
        }
      ]
    },
    // Slide 18: أعمال القواعد المسلحة
    {
      id: 'slide-18',
      slideNumber: 18,
      type: 'photos',
      title: 'أعمال حدادة ونجارة القواعد المسلحة والسملات الرابطة',
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى تاريخ اليوم (2026/10/15)',
      layout: 'two-column',
      images: [
        {
          id: 'img-18-1',
          url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1000&q=80',
          caption: 'تجهيز الشدات الخشبية للقواعد المسلحة وتثبيت جوانب الصب',
          description: 'تأكيد أبعاد القواعد وسماكات الغطاء الخرساني (Concrete Cover)'
        },
        {
          id: 'img-18-2',
          url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1000&q=80',
          caption: 'رص حديد تسليح القواعد والسملات وتثبيت كانات أشاير الأعمدة ومسامير التثبيت (Anchor Bolts)',
          description: 'استخدام حديد تسليح عالي المقاومة مشوه معتمد من مصانع الحديد'
        }
      ]
    },
    // Slide 19: مكعبات الاختبار وتجهيز المسلحة
    {
      id: 'slide-19',
      slideNumber: 19,
      type: 'photos',
      title: 'تجهيز قوالب مكعبات اختبار الخرسانة المسلحة وتثبيت أقفاص التسليح',
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى تاريخ اليوم (2026/10/15)',
      layout: 'three-column',
      images: [
        {
          id: 'img-19-1',
          url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
          caption: 'تركيب حدادة السملات الرابطة بين القواعد المسلحة للهناجر',
          description: 'ربط سلك الترباط والكانات بانتظام'
        },
        {
          id: 'img-19-2',
          url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80',
          caption: 'تجهيز قوالب المكعبات الخرسانية القياسية (15*15*15 سم) لاختبار كسر الخرسانة بعد 7 و 28 يوم',
          description: 'اختبارات ضبط الجودة المستمرة للمشروع'
        },
        {
          id: 'img-19-3',
          url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1000&q=80',
          caption: 'استكمال نجارة رقاب الأعمدة وتحديد مناسيب الصب بدقة',
          description: 'مراعاة مسامير تثبيت أعمدة الجمالون المعدني Steel Trusses'
        }
      ]
    },
    // Slide 20: استكمال المسلحة والموقف العام
    {
      id: 'slide-20',
      slideNumber: 20,
      type: 'photos',
      title: 'الموقف التنفيذي لأعمال القواعد المسلحة واستكمال الصب والعزل',
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى تاريخ اليوم (2026/10/15)',
      layout: 'two-column',
      images: [
        {
          id: 'img-20-1',
          url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=1000&q=80',
          caption: 'استمرار أعمال حدادة وصب القواعد المسلحة لهنجر الإصلاح والمغسلة',
          description: 'متابعة وتيرة العمل لإنهاء مرحلة الأساسات في موعدها المخطط'
        },
        {
          id: 'img-20-2',
          url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1000&q=80',
          caption: 'رؤية شاملة للموقع والجاهزية لبدء أعمال الردم الداخلي والجمالونات',
          description: 'المتابعة اليومية بإشراف الإدارة الهندسية بالشركة الوطنية للأسمنت ببني سويف'
        }
      ]
    }
  ],
  projectFiles: INITIAL_PROJECT_FILES,
  customFileCategories: DEFAULT_FILE_CATEGORIES
};
