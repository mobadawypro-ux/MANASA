import { ProjectFacility, PROJECT_FACILITIES } from '../types/report';

export interface FacilityStyle {
  name: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  borderClass: string;
  outerRing: string;
  glowShadow: string;
  accentText: string;
  tagColor: string;
  dotColor: string;
  bannerBg: string;
  iconName: string;
  englishLabel: string;
}

export const FACILITY_THEMES: Record<string, {
  light: FacilityStyle;
  dark: FacilityStyle;
}> = {
  'هنجر الشكاير 1': {
    light: {
      name: 'هنجر الشكاير 1',
      badgeBg: 'bg-emerald-600',
      badgeText: 'text-white',
      borderColor: '#059669',
      borderClass: 'border-emerald-500 border-2',
      outerRing: 'ring-2 ring-emerald-500/25',
      glowShadow: 'shadow-lg shadow-emerald-500/10',
      accentText: 'text-emerald-700',
      tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold',
      dotColor: 'bg-emerald-500',
      bannerBg: 'bg-gradient-to-r from-emerald-900/90 via-[#0C2340] to-emerald-900/90',
      iconName: 'Warehouse',
      englishLabel: 'Sack Hangar 1'
    },
    dark: {
      name: 'هنجر الشكاير 1',
      badgeBg: 'bg-emerald-600',
      badgeText: 'text-white',
      borderColor: '#10b981',
      borderClass: 'border-emerald-500/70 border-2',
      outerRing: 'ring-2 ring-emerald-500/30',
      glowShadow: 'shadow-xl shadow-emerald-500/10',
      accentText: 'text-emerald-400',
      tagColor: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40 font-bold',
      dotColor: 'bg-emerald-400',
      bannerBg: 'bg-gradient-to-r from-emerald-950 via-[#0A1D33] to-emerald-950',
      iconName: 'Warehouse',
      englishLabel: 'Sack Hangar 1'
    }
  },
  'هنجر الشكاير 2': {
    light: {
      name: 'هنجر الشكاير 2',
      badgeBg: 'bg-amber-500',
      badgeText: 'text-slate-950 font-black',
      borderColor: '#d97706',
      borderClass: 'border-amber-500 border-2',
      outerRing: 'ring-2 ring-amber-500/25',
      glowShadow: 'shadow-lg shadow-amber-500/10',
      accentText: 'text-amber-700',
      tagColor: 'bg-amber-50 text-amber-900 border-amber-300 font-bold',
      dotColor: 'bg-amber-500',
      bannerBg: 'bg-gradient-to-r from-amber-900/90 via-[#0C2340] to-amber-900/90',
      iconName: 'Building2',
      englishLabel: 'Sack Hangar 2'
    },
    dark: {
      name: 'هنجر الشكاير 2',
      badgeBg: 'bg-amber-500',
      badgeText: 'text-slate-950 font-black',
      borderColor: '#f59e0b',
      borderClass: 'border-amber-500/70 border-2',
      outerRing: 'ring-2 ring-amber-500/30',
      glowShadow: 'shadow-xl shadow-amber-500/10',
      accentText: 'text-amber-400',
      tagColor: 'bg-amber-950/70 text-amber-300 border-amber-500/40 font-bold',
      dotColor: 'bg-amber-400',
      bannerBg: 'bg-gradient-to-r from-amber-950 via-[#0A1D33] to-amber-950',
      iconName: 'Building2',
      englishLabel: 'Sack Hangar 2'
    }
  },
  'هنجر المعدات': {
    light: {
      name: 'هنجر المعدات',
      badgeBg: 'bg-blue-600',
      badgeText: 'text-white',
      borderColor: '#2563eb',
      borderClass: 'border-blue-500 border-2',
      outerRing: 'ring-2 ring-blue-500/25',
      glowShadow: 'shadow-lg shadow-blue-500/10',
      accentText: 'text-blue-700',
      tagColor: 'bg-blue-50 text-blue-900 border-blue-300 font-bold',
      dotColor: 'bg-blue-500',
      bannerBg: 'bg-gradient-to-r from-blue-900/90 via-[#0C2340] to-blue-900/90',
      iconName: 'Wrench',
      englishLabel: 'Equipment Hangar'
    },
    dark: {
      name: 'هنجر المعدات',
      badgeBg: 'bg-blue-600',
      badgeText: 'text-white',
      borderColor: '#3b82f6',
      borderClass: 'border-blue-500/70 border-2',
      outerRing: 'ring-2 ring-blue-500/30',
      glowShadow: 'shadow-xl shadow-blue-500/10',
      accentText: 'text-blue-400',
      tagColor: 'bg-blue-950/70 text-blue-300 border-blue-500/40 font-bold',
      dotColor: 'bg-blue-400',
      bannerBg: 'bg-gradient-to-r from-blue-950 via-[#0A1D33] to-blue-950',
      iconName: 'Wrench',
      englishLabel: 'Equipment Hangar'
    }
  },
  'مغسلة المعدات': {
    light: {
      name: 'مغسلة المعدات',
      badgeBg: 'bg-purple-600',
      badgeText: 'text-white',
      borderColor: '#9333ea',
      borderClass: 'border-purple-500 border-2',
      outerRing: 'ring-2 ring-purple-500/25',
      glowShadow: 'shadow-lg shadow-purple-500/10',
      accentText: 'text-purple-700',
      tagColor: 'bg-purple-50 text-purple-900 border-purple-300 font-bold',
      dotColor: 'bg-purple-500',
      bannerBg: 'bg-gradient-to-r from-purple-900/90 via-[#0C2340] to-purple-900/90',
      iconName: 'Droplets',
      englishLabel: 'Car Wash Area'
    },
    dark: {
      name: 'مغسلة المعدات',
      badgeBg: 'bg-purple-600',
      badgeText: 'text-white',
      borderColor: '#a855f7',
      borderClass: 'border-purple-500/70 border-2',
      outerRing: 'ring-2 ring-purple-500/30',
      glowShadow: 'shadow-xl shadow-purple-500/10',
      accentText: 'text-purple-400',
      tagColor: 'bg-purple-950/70 text-purple-300 border-purple-500/40 font-bold',
      dotColor: 'bg-purple-400',
      bannerBg: 'bg-gradient-to-r from-purple-950 via-[#0A1D33] to-purple-950',
      iconName: 'Droplets',
      englishLabel: 'Car Wash Area'
    }
  }
};

export const DEFAULT_FACILITY_STYLE: { light: FacilityStyle; dark: FacilityStyle } = {
  light: {
    name: 'المشروع بالكامل / عام',
    badgeBg: 'bg-[#0C2340]',
    badgeText: 'text-amber-300',
    borderColor: '#cbd5e1',
    borderClass: 'border-slate-200 border',
    outerRing: '',
    glowShadow: 'shadow-sm',
    accentText: 'text-slate-700',
    tagColor: 'bg-slate-100 text-slate-700 border-slate-300 font-semibold',
    dotColor: 'bg-amber-400',
    bannerBg: 'bg-gradient-to-r from-[#0C2340] via-[#102E52] to-[#0C2340]',
    iconName: 'HardHat',
    englishLabel: 'General Scope'
  },
  dark: {
    name: 'المشروع بالكامل / عام',
    badgeBg: 'bg-[#0C2340]',
    badgeText: 'text-amber-300',
    borderColor: '#1e293b',
    borderClass: 'border-slate-800 border',
    outerRing: '',
    glowShadow: 'shadow-xl',
    accentText: 'text-slate-300',
    tagColor: 'bg-slate-900 text-slate-300 border-slate-700 font-semibold',
    dotColor: 'bg-amber-400',
    bannerBg: 'bg-gradient-to-r from-[#0C2340] via-[#102E52] to-[#0C2340]',
    iconName: 'HardHat',
    englishLabel: 'General Scope'
  }
};

export const getFacilityStyle = (facility?: string | null, isLight = false): FacilityStyle => {
  if (!facility || !FACILITY_THEMES[facility]) {
    return isLight ? DEFAULT_FACILITY_STYLE.light : DEFAULT_FACILITY_STYLE.dark;
  }
  return isLight ? FACILITY_THEMES[facility].light : FACILITY_THEMES[facility].dark;
};
