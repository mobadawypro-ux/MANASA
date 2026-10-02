import { ReportData } from '../types/report';

export const INITIAL_REPORT_DATA: ReportData = {
  projectInfo: {
    companyName: 'الشركة الوطنية للأسمنت ببنى سويف',
    subLocation: 'مجمع مصانع الشركة الوطنية للأسمنت ببنى سويف',
    contractor: 'شركة الهلال للمقاولات العمومية',
    contractNumber: 'أمر إسناد رقم 24/2026',
    projectTitle: 'الموقف التنفيذي لإنشاء عدد 2 هنجر 40*100 وهنجر اصلاح للمعدات 52*20 م ومغسلة للمعدات',
    handoverDate: '2026/07/08',
    durationMonths: 8,
    plannedEndDate: '2027/03/08',
    reportDate: '2026/09/13',
    overallProgress: 16,
    notes: 'تم البدء في أعمال الحفر والإحلال وصب القواعد العادية والعزل وبدء حدادة القواعد المسلحة وفقاً للجدول الزمني المعتمد.'
  },
  boqItems: [
    // 1. أعمال الحفر والردم
    {
      id: 'boq-1',
      category: 'أعمال الحفر والردم',
      statement: 'حفر للأساسات في تربة صخرية أو رملية',
      unit: 'م٣',
      totalQuantity: 3250,
      executedQuantity: 2750,
      executionPercentage: 85,
      notes: 'تم تنفيذ الحفر حتى المناسيب التصميمية'
    },
    {
      id: 'boq-2',
      category: 'أعمال الحفر والردم',
      statement: 'ردم بتربة رملية معتمدة على طبقات مع الدمك والغمر',
      unit: 'م٣',
      totalQuantity: 2000,
      executedQuantity: 550,
      executionPercentage: 28,
      notes: 'جاري استكمال طبقات الردم والإحلال'
    },
    // 2. أعمال الخرسانة
    {
      id: 'boq-3',
      category: 'أعمال الخرسانة',
      statement: 'خرسانة عادية للأساسات سمك مناسب',
      unit: 'م٣',
      totalQuantity: 465,
      executedQuantity: 300,
      executionPercentage: 65,
      notes: 'تم صب الجزء الأكبر من خرسانة الأساسات العادية'
    },
    {
      id: 'boq-4',
      category: 'أعمال الخرسانة',
      statement: 'خرسانة مسلحة للأساسات ورقاب الأعمدة والسملات',
      unit: 'م٣',
      totalQuantity: 670,
      executedQuantity: 200,
      executionPercentage: 30,
      notes: 'جاري استكمال أعمال الحدادة والصب'
    },
    {
      id: 'boq-5',
      category: 'أعمال الخرسانة',
      statement: 'توريد وعمل ترابيع خرسانية ومسلحة بالفايبر البولي بروبلين لأرضيات الهناجر',
      unit: 'م٢',
      totalQuantity: 9200,
      executedQuantity: 0,
      executionPercentage: 0,
      notes: 'مرحلة لاحقة بعد الانتهاء من الهيكل المعدني'
    },
    // 3. أعمال العزل
    {
      id: 'boq-6',
      category: 'أعمال العزل',
      statement: 'طبقة عازلة وجهين بيتومين على البارد للأساسات الملامسة للتربة',
      unit: 'م٢',
      totalQuantity: 2650,
      executedQuantity: 50,
      executionPercentage: 2,
      notes: 'جاري عزل القواعد المصبوبة فور فك الشدات'
    },
    {
      id: 'boq-7',
      category: 'أعمال العزل',
      statement: 'فرش بولي إيثيلين سمك 200 ميكرون أسفل القواعد والأرضيات',
      unit: 'م٢',
      totalQuantity: 9000,
      executedQuantity: 200,
      executionPercentage: 3,
      notes: 'تم فرش المشمع أسفل القواعد العادية الجاري صبها'
    },
    // 4. أعمال المباني
    {
      id: 'boq-8',
      category: 'أعمال المباني',
      statement: 'توريد وعمل مباني طوب طفلي مفرغ أسمنتي',
      unit: 'م٣',
      totalQuantity: 850,
      executedQuantity: 0,
      executionPercentage: 0,
      notes: 'مخطط البدء بعد الهيكل الإنشائي'
    },
    {
      id: 'boq-9',
      category: 'أعمال المباني',
      statement: 'توريد وتركيب سفل من البازلت المقاوم للعوامل الجوية',
      unit: 'م.ط',
      totalQuantity: 560,
      executedQuantity: 0,
      executionPercentage: 0,
      notes: 'مرحلة التشطيبات الخارجية'
    },
    // 5. أعمال البياض
    {
      id: 'boq-10',
      category: 'أعمال البياض',
      statement: 'أعمال المحارة والطرطشة للواجهات والأسوار الداخلية',
      unit: 'م٢',
      totalQuantity: 7000,
      executedQuantity: 0,
      executionPercentage: 0,
      notes: ''
    },
    {
      id: 'boq-11',
      category: 'أعمال البياض',
      statement: 'أعمال السافيتو والتشطيبات الخارجية المقاومة للرطوبة',
      unit: 'م٢',
      totalQuantity: 3200,
      executedQuantity: 0,
      executionPercentage: 0,
      notes: ''
    },
    // 6. أعمال الدهانات
    {
      id: 'boq-12',
      category: 'أعمال الدهانات',
      statement: 'دهانات داخلية بلاستيكية مقاومة للغبار والزيوت',
      unit: 'م٢',
      totalQuantity: 4000,
      executedQuantity: 0,
      executionPercentage: 0,
      notes: ''
    },
    // 7. أعمال الأرضيات
    {
      id: 'boq-13',
      category: 'أعمال الأرضيات',
      statement: 'أعمال الإنترلوك للأفنية والممرات المحيطة بالهناجر',
      unit: 'م٢',
      totalQuantity: 5200,
      executedQuantity: 0,
      executionPercentage: 0,
      notes: ''
    },
    {
      id: 'boq-14',
      category: 'أعمال الأرضيات',
      statement: 'أعمال البردورة الخرسانية وتحديد مسارات المعدات',
      unit: 'م.ط',
      totalQuantity: 560,
      executedQuantity: 0,
      executionPercentage: 0,
      notes: ''
    },
    {
      id: 'boq-15',
      category: 'أعمال الأرضيات',
      statement: 'أعمال السيراميك والبورسلين لدورات المياه وغرف الإدارة',
      unit: 'م٢',
      totalQuantity: 145,
      executedQuantity: 0,
      executionPercentage: 0,
      notes: ''
    },
    // 8. أعمال السباكة
    {
      id: 'boq-16',
      category: 'أعمال السباكة',
      statement: 'سباكة متكاملة لعدد 3 دورات مياه ومغاسل',
      unit: 'عدد',
      totalQuantity: 3,
      executedQuantity: 0,
      executionPercentage: 0,
      notes: ''
    },
    {
      id: 'boq-17',
      category: 'أعمال السباكة',
      statement: 'تغذية ومرافق وشبكات الصرف والتغذية الرئيسية',
      unit: 'عدد بنود',
      totalQuantity: 5,
      executedQuantity: 0,
      executionPercentage: 0,
      notes: ''
    },
    // 9. أعمال معدنية
    {
      id: 'boq-18',
      category: 'أعمال معدنية',
      statement: 'أبواب مصفحة وجرارة لزوم دخول الشاحنات للهنجر',
      unit: 'عدد',
      totalQuantity: 8,
      executedQuantity: 0,
      executionPercentage: 0,
      notes: ''
    },
    {
      id: 'boq-19',
      category: 'أعمال معدنية',
      statement: 'مجرى مطر وجاليات تصريف السيول من الصاج المجلفن',
      unit: 'م.ط',
      totalQuantity: 110,
      executedQuantity: 0,
      executionPercentage: 0,
      notes: ''
    },
    {
      id: 'boq-20',
      category: 'أعمال معدنية',
      statement: 'شبابيك ألوميتال وقطاعات تهوية صناعية',
      unit: 'عدد',
      totalQuantity: 38,
      executedQuantity: 0,
      executionPercentage: 0,
      notes: ''
    },
    // 10. أعمال خشبية
    {
      id: 'boq-21',
      category: 'أعمال خشبية',
      statement: 'أبواب خشبية مكسوة قشرة مقاومة للرطوبة',
      unit: 'عدد',
      totalQuantity: 42,
      executedQuantity: 0,
      executionPercentage: 0,
      notes: ''
    },
    // 11. أعمال الجمالون المعدني
    {
      id: 'boq-22',
      category: 'أعمال الجمالون المعدني',
      statement: 'توريد وتركيب الجمالون والقطاعات الفولاذية والأعمدة المعدنية',
      unit: 'طن',
      totalQuantity: 305,
      executedQuantity: 0,
      executionPercentage: 0,
      notes: 'جاري التجهيز والتصنيع بالورش'
    },
    {
      id: 'boq-23',
      category: 'أعمال الجمالون المعدني',
      statement: 'أعمال تغطيات الساندوتش بانل المعزول والصاج المعرج للأسقف والحوائط',
      unit: 'م٢',
      totalQuantity: 12900,
      executedQuantity: 0,
      executionPercentage: 0,
      notes: 'التوريد بعد الانتهاء من الهيكل المعدني'
    },
    // 12. المرافق والكهرباء
    {
      id: 'boq-24',
      category: 'أعمال المرافق والكهرباء',
      statement: 'أعمال شبكة الكهرباء والإنارة الصناعية واللوحات التوزيعية',
      unit: 'عدد بنود',
      totalQuantity: 25,
      executedQuantity: 0,
      executionPercentage: 0,
      notes: ''
    },
    // 13. أعمال شبكة الحريق
    {
      id: 'boq-25',
      category: 'أعمال شبكة الحريق',
      statement: 'أعمال شبكة مكافحة الحريق والرشاشات الآلية وصناديق الحريق',
      unit: 'عدد بنود',
      totalQuantity: 20,
      executedQuantity: 0,
      executionPercentage: 0,
      notes: ''
    },
    // 14. أعمال معدات المغسلة
    {
      id: 'boq-26',
      category: 'أعمال معدات المغسلة',
      statement: 'توريد وتركيب وتشغيل معدات مغسلة المعدات الثقيلة والشاحنات',
      unit: 'عدد بنود',
      totalQuantity: 11,
      executedQuantity: 0,
      executionPercentage: 0,
      notes: ''
    }
  ],
  scheduleItems: [
    {
      id: 'sch-1',
      taskIndex: 1,
      statement: 'أعمال الحفر',
      monthlyStatus: {
        1: 'هنجر (1-2) + المغسلة',
        2: 'هنجر المعدات',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
        8: '',
        9: ''
      }
    },
    {
      id: 'sch-2',
      taskIndex: 2,
      statement: 'أعمال تطهير وضبط الحفر والردم والإحلال',
      monthlyStatus: {
        1: 'هنجر (1-2)',
        2: 'المغسلة + هنجر المعدات',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
        8: '',
        9: ''
      }
    },
    {
      id: 'sch-3',
      taskIndex: 3,
      statement: 'أعمال الخرسانة العادية لزوم الأساسات',
      monthlyStatus: {
        1: 'هنجر (1-2)',
        2: 'المغسلة + هنجر المعدات',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
        8: '',
        9: ''
      }
    },
    {
      id: 'sch-4',
      taskIndex: 4,
      statement: 'أعمال العزل للقواعد العادية',
      monthlyStatus: {
        1: 'هنجر (1-2)',
        2: 'المغسلة + هنجر المعدات',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
        8: '',
        9: ''
      }
    },
    {
      id: 'sch-5',
      taskIndex: 5,
      statement: 'أعمال الخرسانة المسلحة لزوم الأساسات',
      monthlyStatus: {
        1: '',
        2: 'هنجر (1-2)',
        3: 'المغسلة + هنجر المعدات',
        4: '',
        5: '',
        6: '',
        7: '',
        8: '',
        9: ''
      }
    },
    {
      id: 'sch-6',
      taskIndex: 6,
      statement: 'رقاب الأعمدة',
      monthlyStatus: {
        1: '',
        2: '',
        3: 'هنجر (1-2)',
        4: 'المغسلة + هنجر المعدات',
        5: '',
        6: '',
        7: '',
        8: '',
        9: ''
      }
    },
    {
      id: 'sch-7',
      taskIndex: 7,
      statement: 'مباني قصة الردم',
      monthlyStatus: {
        1: '',
        2: '',
        3: '',
        4: 'هنجر (1-2)',
        5: 'المغسلة + هنجر المعدات',
        6: '',
        7: '',
        8: '',
        9: ''
      }
    },
    {
      id: 'sch-8',
      taskIndex: 8,
      statement: 'أعمال العزل للخرسانة المسلحة وقصة الردم',
      monthlyStatus: {
        1: '',
        2: '',
        3: '',
        4: '',
        5: 'هنجر (1-2) + المغسلة',
        6: 'هنجر المعدات',
        7: '',
        8: '',
        9: ''
      }
    },
    {
      id: 'sch-9',
      taskIndex: 9,
      statement: 'الحفر الداخلي والردم',
      monthlyStatus: {
        1: '',
        2: '',
        3: '',
        4: '',
        5: 'هنجر (1-2) + المغسلة',
        6: 'هنجر المعدات',
        7: '',
        8: '',
        9: ''
      }
    },
    {
      id: 'sch-10',
      taskIndex: 10,
      statement: 'التركيبات المعدنية والجمالونات',
      monthlyStatus: {
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: 'هنجر (1-2)',
        7: 'هنجر المعدات + المغسلة',
        8: '',
        9: ''
      }
    },
    {
      id: 'sch-11',
      taskIndex: 11,
      statement: 'أعمال السور والطبانات',
      monthlyStatus: {
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
        7: 'هنجر (1-2) والمحيط',
        8: 'المغسلة + هنجر المعدات',
        9: ''
      }
    },
    {
      id: 'sch-12',
      taskIndex: 12,
      statement: 'أعمال التغذية والصحية',
      monthlyStatus: {
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
        8: 'هنجر (1-2) والمغسلة',
        9: 'المغسلة + هنجر المعدات'
      }
    },
    {
      id: 'sch-13',
      taskIndex: 13,
      statement: 'أعمال الأرضيات والترابيع الخرسانية',
      monthlyStatus: {
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
        8: 'هنجر (1-2)',
        9: 'المغسلة + هنجر المعدات'
      }
    },
    {
      id: 'sch-14',
      taskIndex: 14,
      statement: 'أعمال التشطيبات والبياض والدهانات',
      monthlyStatus: {
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
        8: '',
        9: 'هنجر (1-2) والمغسلة وهنجر المعدات'
      }
    },
    {
      id: 'sch-15',
      taskIndex: 15,
      statement: 'أعمال الكهرباء والإنارة',
      monthlyStatus: {
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
        8: '',
        9: 'كامل المشروع بالتوازي'
      }
    },
    {
      id: 'sch-16',
      taskIndex: 16,
      statement: 'أعمال ميكانيكية وتهوية',
      monthlyStatus: {
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
        8: '',
        9: 'كامل المشروع'
      }
    },
    {
      id: 'sch-17',
      taskIndex: 17,
      statement: 'أعمال مكافحة الحريق والإنذار',
      monthlyStatus: {
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
        8: '',
        9: 'كامل المشروع والتجارب'
      }
    }
  ],
  slides: [
    // Slide 1: Cover
    {
      id: 'slide-1',
      slideNumber: 1,
      type: 'cover',
      title: 'الموقف التنفيذي لإنشاء عدد 2 هنجر 40*100 وهنجر اصلاح للمعدات 52*20 م ومغسلة للمعدات',
      subTitle: 'الشركة الوطنية للأسمنت ببنى سويف - مجمع مصانع الشركة الوطنية للأسمنت ببنى سويف',
      dateText: 'سبتمبر 2026'
    },
    // Slide 2: Timeline & Duration
    {
      id: 'slide-2',
      slideNumber: 2,
      type: 'summary',
      title: 'بيانات وتوقيتات المشروع الإنشائي',
      subTitle: 'الموقف التنفيذي لإنشاء عدد 2 هنجر 40*100 وهنجر اصلاح للمعدات 52*20 م ومغسلة للمعدات'
    },
    // Slide 3: Gantt Schedule
    {
      id: 'slide-3',
      slideNumber: 3,
      type: 'timeline',
      title: 'المخطط الزمني وفقاً للمقاول لإنشاء عدد 2 هنجر 40*100 وهنجر اصلاح للمعدات 52*20 م ومغسلة للمعدات من 2026/8/1 وحتي 2027/5/1',
      subTitle: 'شركة الهلال للمقاولات العمومية - أمر إسناد رقم 24/2026 - مدة تنفيذ المشروع تسعة أشهر'
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
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى 2026/9/13',
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
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى 2026/9/13',
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
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى 2026/9/13',
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
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى 2026/9/13',
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
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى 2026/9/13',
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
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى 2026/9/13',
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
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى 2026/9/13',
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
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى 2026/9/13',
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
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى 2026/9/13',
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
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى 2026/9/13',
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
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى 2026/9/13',
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
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى 2026/9/13',
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
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى 2026/9/13',
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
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى 2026/9/13',
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
      subTitle: 'الأعمال التي تمت منذ بدء عملية الإنشاء بالهناجر حتى 2026/9/13',
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
  ]
};
