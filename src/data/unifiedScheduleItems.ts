import { ScheduleItem } from '../types/report';

// 1. الجدول الزمني المعتمد لهناجر الشكاير (هنجر 1 وهنجر 2) - 17 بند
export const HANGAR_SHAKAYER_SCHEDULE: ScheduleItem[] = [
  {
    id: 'sch-sh-1',
    taskIndex: 1,
    statement: 'أعمال الحفر',
    durationText: '14 يوم',
    durationDays: 14,
    startDate: '2026/8/1',
    endDate: '2026/8/14',
    facility: 'هنجر الشكاير (1-2)',
    timelinePosition: 0
  },
  {
    id: 'sch-sh-2',
    taskIndex: 2,
    statement: 'أعمال تطهير وضبط الحفر والردم والإحلال',
    durationText: '7 أيام',
    durationDays: 7,
    startDate: '2026/8/15',
    endDate: '2026/8/21',
    facility: 'هنجر الشكاير (1-2)',
    timelinePosition: 1
  },
  {
    id: 'sch-sh-3',
    taskIndex: 3,
    statement: 'أعمال الخرسانة العادية لزوم الأساسات',
    durationText: '7 أيام',
    durationDays: 7,
    startDate: '2026/8/19',
    endDate: '2026/8/26',
    facility: 'هنجر الشكاير (1-2)',
    timelinePosition: 2
  },
  {
    id: 'sch-sh-4',
    taskIndex: 4,
    statement: 'أعمال العزل للقواعد العادية',
    durationText: '7 أيام',
    durationDays: 7,
    startDate: '2026/8/27',
    endDate: '2026/9/2',
    facility: 'هنجر الشكاير (1-2)',
    timelinePosition: 3
  },
  {
    id: 'sch-sh-5',
    taskIndex: 5,
    statement: 'أعمال الخرسانة المسلحة لزوم الأساسات',
    durationText: '20 يوم',
    durationDays: 20,
    startDate: '2026/9/1',
    endDate: '2026/9/20',
    facility: 'هنجر الشكاير (1-2)',
    timelinePosition: 4
  },
  {
    id: 'sch-sh-6',
    taskIndex: 6,
    statement: 'أعمال العزل للخرسانة المسلحة',
    durationText: '10 أيام',
    durationDays: 10,
    startDate: '2026/9/17',
    endDate: '2026/9/26',
    facility: 'هنجر الشكاير (1-2)',
    timelinePosition: 5
  },
  {
    id: 'sch-sh-7',
    taskIndex: 7,
    statement: 'رقاب الأعمدة',
    durationText: '17 يوم',
    durationDays: 17,
    startDate: '2026/9/14',
    endDate: '2026/10/5',
    facility: 'هنجر الشكاير (1-2)',
    timelinePosition: 6
  },
  {
    id: 'sch-sh-8',
    taskIndex: 8,
    statement: 'مباني قصة الردم',
    durationText: '14 يوم',
    durationDays: 14,
    startDate: '2026/9/25',
    endDate: '2026/10/8',
    facility: 'هنجر الشكاير (1-2)',
    timelinePosition: 7
  },
  {
    id: 'sch-sh-9',
    taskIndex: 9,
    statement: 'أعمال العزل لقصة الردم',
    durationText: '5 أيام',
    durationDays: 5,
    startDate: '2026/10/4',
    endDate: '2026/10/8',
    facility: 'هنجر الشكاير (1-2)',
    timelinePosition: 8
  },
  {
    id: 'sch-sh-10',
    taskIndex: 10,
    statement: 'التركيبات المعدنية',
    durationText: '45 يوم',
    durationDays: 45,
    startDate: '2026/9/25',
    endDate: '2026/11/8',
    facility: 'هنجر الشكاير (1-2)',
    timelinePosition: 9
  },
  {
    id: 'sch-sh-11',
    taskIndex: 11,
    statement: 'الحفر الداخلي والردم',
    durationText: '11 يوم',
    durationDays: 11,
    startDate: '2026/11/1',
    endDate: '2026/11/11',
    facility: 'هنجر الشكاير (1-2)',
    timelinePosition: 10
  },
  {
    id: 'sch-sh-12',
    taskIndex: 12,
    statement: 'أعمال السور والطبانات',
    durationText: '14 يوم',
    durationDays: 14,
    startDate: '2026/11/4',
    endDate: '2026/11/17',
    facility: 'هنجر الشكاير (1-2)',
    timelinePosition: 11
  },
  {
    id: 'sch-sh-13',
    taskIndex: 13,
    statement: 'أعمال الصحية',
    durationText: '10 أيام',
    durationDays: 10,
    startDate: '2026/11/11',
    endDate: '2026/11/20',
    facility: 'هنجر الشكاير (1-2)',
    timelinePosition: 12
  },
  {
    id: 'sch-sh-14',
    taskIndex: 14,
    statement: 'أعمال الأرضيات',
    durationText: '17 يوم',
    durationDays: 17,
    startDate: '2026/11/11',
    endDate: '2026/11/27',
    facility: 'هنجر الشكاير (1-2)',
    timelinePosition: 13
  },
  {
    id: 'sch-sh-15',
    taskIndex: 15,
    statement: 'أعمال التشطيبات',
    durationText: '25 يوم',
    durationDays: 25,
    startDate: '2026/11/7',
    endDate: '2026/11/30',
    facility: 'هنجر الشكاير (1-2)',
    timelinePosition: 14
  },
  {
    id: 'sch-sh-16',
    taskIndex: 16,
    statement: 'أعمال الكهرباء',
    durationText: '20 يوم',
    durationDays: 20,
    startDate: '2026/11/23',
    endDate: '2026/12/11',
    facility: 'هنجر الشكاير (1-2)',
    timelinePosition: 15
  },
  {
    id: 'sch-sh-17',
    taskIndex: 17,
    statement: 'أعمال الحريق',
    durationText: '20 يوم',
    durationDays: 20,
    startDate: '2026/12/12',
    endDate: '2026/12/31',
    facility: 'هنجر الشكاير (1-2)',
    timelinePosition: 16
  }
];

// 2. الجدول الزمني المعتمد لمنطقة هنجر المعدات والمغسلة - 19 بند طبقاً للوثيقة المرفقة
export const EQUIPMENT_WASH_SCHEDULE: ScheduleItem[] = [
  {
    id: 'sch-eq-1',
    taskIndex: 18,
    statement: 'أعمال الحفر',
    durationText: '19 يوم',
    durationDays: 19,
    startDate: '2026/9/1',
    endDate: '2026/9/19',
    facility: 'هنجر المعدات + المغسلة',
    timelinePosition: 2
  },
  {
    id: 'sch-eq-2',
    taskIndex: 19,
    statement: 'أعمال تطهير وضبط الحفر والردم والإحلال',
    durationText: '14 يوم',
    durationDays: 14,
    startDate: '2026/9/12',
    endDate: '2026/9/25',
    facility: 'هنجر المعدات + المغسلة',
    timelinePosition: 4
  },
  {
    id: 'sch-eq-3',
    taskIndex: 20,
    statement: 'أعمال الخرسانة العادية لزوم الأساسات',
    durationText: '7 أيام',
    durationDays: 7,
    startDate: '2026/9/26',
    endDate: '2026/10/5',
    facility: 'هنجر المعدات + المغسلة',
    timelinePosition: 6
  },
  {
    id: 'sch-eq-4',
    taskIndex: 21,
    statement: 'أعمال العزل للقواعد العادية',
    durationText: '5 أيام',
    durationDays: 5,
    startDate: '2026/10/1',
    endDate: '2026/10/5',
    facility: 'المعدات والمغسلة',
    timelinePosition: 7
  },
  {
    id: 'sch-eq-5',
    taskIndex: 22,
    statement: 'أعمال الخرسانة المسلحة لزوم الأساسات',
    durationText: '15 يوم',
    durationDays: 15,
    startDate: '2026/10/1',
    endDate: '2026/10/15',
    facility: 'هنجر المعدات + المغسلة',
    timelinePosition: 7
  },
  {
    id: 'sch-eq-6',
    taskIndex: 23,
    statement: 'أعمال العزل للخرسانة المسلحة',
    durationText: '10 أيام',
    durationDays: 10,
    startDate: '2026/10/8',
    endDate: '2026/10/17',
    facility: 'هنجر المعدات + المغسلة',
    timelinePosition: 8
  },
  {
    id: 'sch-eq-7',
    taskIndex: 24,
    statement: 'رقاب الأعمدة',
    durationText: '8 أيام',
    durationDays: 8,
    startDate: '2026/10/13',
    endDate: '2026/10/20',
    facility: 'هنجر المعدات + المغسلة',
    timelinePosition: 9
  },
  {
    id: 'sch-eq-8',
    taskIndex: 25,
    statement: 'أعمال الخرسانة المسلحة لزوم الأعمدة والأسقف',
    durationText: '14 يوم',
    durationDays: 14,
    startDate: '2026/10/17',
    endDate: '2026/10/30',
    facility: 'المغسلة',
    timelinePosition: 9
  },
  {
    id: 'sch-eq-9',
    taskIndex: 26,
    statement: 'مباني قصة الردم',
    durationText: '10 أيام',
    durationDays: 10,
    startDate: '2026/10/17',
    endDate: '2026/10/26',
    facility: 'هنجر المعدات + المغسلة',
    timelinePosition: 9
  },
  {
    id: 'sch-eq-10',
    taskIndex: 27,
    statement: 'أعمال العزل لقصة الردم',
    durationText: '6 أيام',
    durationDays: 6,
    startDate: '2026/10/21',
    endDate: '2026/10/26',
    facility: 'هنجر المعدات + المغسلة',
    timelinePosition: 10
  },
  {
    id: 'sch-eq-11',
    taskIndex: 28,
    statement: 'التركيبات المعدنية',
    durationText: '20 يوم',
    durationDays: 20,
    startDate: '2026/10/20',
    endDate: '2026/11/13',
    facility: 'هنجر المعدات',
    timelinePosition: 10
  },
  {
    id: 'sch-eq-12',
    taskIndex: 29,
    statement: 'الردم وتسوية الطبانة',
    durationText: '13 يوم',
    durationDays: 13,
    startDate: '2026/11/1',
    endDate: '2026/11/13',
    facility: 'هنجر المعدات + المغسلة',
    timelinePosition: 11
  },
  {
    id: 'sch-eq-13',
    taskIndex: 30,
    statement: 'أعمال السور والطبانة',
    durationText: '10 أيام',
    durationDays: 10,
    startDate: '2026/11/6',
    endDate: '2026/11/15',
    facility: 'هنجر المعدات + المغسلة',
    timelinePosition: 12
  },
  {
    id: 'sch-eq-14',
    taskIndex: 31,
    statement: 'أعمال الصحية',
    durationText: '10 أيام',
    durationDays: 10,
    startDate: '2026/11/11',
    endDate: '2026/11/20',
    facility: 'هنجر المعدات + المغسلة',
    timelinePosition: 13
  },
  {
    id: 'sch-eq-15',
    taskIndex: 32,
    statement: 'أعمال الأرضيات',
    durationText: '17 يوم',
    durationDays: 17,
    startDate: '2026/11/11',
    endDate: '2026/11/27',
    facility: 'هنجر المعدات + المغسلة',
    timelinePosition: 13
  },
  {
    id: 'sch-eq-16',
    taskIndex: 33,
    statement: 'أعمال التشطيبات',
    durationText: '25 يوم',
    durationDays: 25,
    startDate: '2026/11/15',
    endDate: '2026/12/8',
    facility: 'هنجر المعدات + المغسلة',
    timelinePosition: 14
  },
  {
    id: 'sch-eq-17',
    taskIndex: 34,
    statement: 'أعمال الكهرباء',
    durationText: '20 يوم',
    durationDays: 20,
    startDate: '2026/11/23',
    endDate: '2026/12/11',
    facility: 'هنجر المعدات + المغسلة',
    timelinePosition: 15
  },
  {
    id: 'sch-eq-18',
    taskIndex: 35,
    statement: 'أعمال ميكانيكية',
    durationText: '20 يوم',
    durationDays: 20,
    startDate: '2026/12/1',
    endDate: '2026/12/20',
    facility: 'هنجر المعدات + المغسلة',
    timelinePosition: 16
  },
  {
    id: 'sch-eq-19',
    taskIndex: 36,
    statement: 'أعمال الحريق',
    durationText: '20 يوم',
    durationDays: 20,
    startDate: '2026/12/12',
    endDate: '2026/12/31',
    facility: 'هنجر المعدات + المغسلة',
    timelinePosition: 17
  }
];

// 3. الجدول الزمني الموحد المدمج لكافة مناطق المشروع (36 بند عمل معتمد)
export const UNIFIED_SCHEDULE_ITEMS: ScheduleItem[] = [
  ...HANGAR_SHAKAYER_SCHEDULE,
  ...EQUIPMENT_WASH_SCHEDULE
];
