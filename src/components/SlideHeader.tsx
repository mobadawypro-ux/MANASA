import React from 'react';
import { ProjectInfo } from '../types/report';
import { Building2, Award } from 'lucide-react';
import { AcademyLogo } from './AcademyLogo';

interface SlideHeaderProps {
  projectInfo: ProjectInfo;
  currentSlideTitle?: string;
  themeStyle?: 'classic' | 'modern';
}

export const SlideHeader: React.FC<SlideHeaderProps> = ({
  projectInfo,
  currentSlideTitle,
  themeStyle = 'classic'
}) => {
  if (themeStyle === 'modern') {
    return (
      <div className="w-full mb-4">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">{projectInfo.companyName}</h2>
              <p className="text-xs text-amber-400 font-medium">{projectInfo.subLocation}</p>
            </div>
          </div>

          {/* Arab Academy Consultant Badge */}
          <div className="flex items-center bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-sm">
            <AcademyLogo size="sm" showText={true} customLogoUrl={projectInfo.consultantLogoUrl} />
          </div>

          <div className="text-left hidden sm:block">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              {projectInfo.contractNumber}
            </span>
          </div>
        </div>

        {currentSlideTitle && (
          <div className="mt-3 py-2 px-4 bg-gradient-to-r from-[#0C2340] via-[#163860] to-[#0C2340] text-amber-200 font-black text-sm md:text-base rounded-xl shadow-md text-center border border-amber-500/30">
            {currentSlideTitle}
          </div>
        )}
      </div>
    );
  }

  // Classic design matching the original presentation ribbon with Arab Academy consultant badge
  return (
    <div className="w-full mb-3 select-none">
      {/* Top Banner Ribbon - Executive Architectural Navy & Warm Bronze */}
      <div className="flex items-stretch shadow-md rounded-t-md overflow-hidden text-xs md:text-sm font-bold border-b border-amber-500/30">
        {/* Right side in RTL: Company Name with Corporate Midnight & Warm Bronze */}
        <div className="flex items-center gap-2 bg-[#0C2340] text-amber-300 px-4 py-2 shrink-0 border-l border-amber-500/20 shadow-inner">
          <div className="w-7 h-7 rounded-lg bg-[#071527] text-amber-400 flex items-center justify-center p-0.5 border border-amber-500/30 shadow-xs shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <span className="tracking-tight text-xs md:text-sm font-black whitespace-nowrap text-amber-200">
            {projectInfo.companyName}
          </span>
        </div>

        {/* Center in RTL: Sublocation Industrial Plant Deep Blue Ribbon */}
        <div className="flex-1 bg-[#102E52] text-slate-100 px-4 py-2 flex items-center justify-start text-xs md:text-sm shadow-inner overflow-hidden border-l border-white/10">
          <span className="truncate font-semibold tracking-wide text-slate-100">
            {projectInfo.subLocation}
          </span>
        </div>

        {/* Left side in RTL: Arab Academy Consultant Emblem & Badge */}
        <div className="flex items-center gap-2.5 bg-[#08182B] text-white px-4 py-2 shrink-0 border-r border-amber-500/30 shadow-inner">
          <AcademyLogo size="sm" showText={false} customLogoUrl={projectInfo.consultantLogoUrl} />
          <div className="flex flex-col text-right leading-tight">
            <span className="text-xs text-amber-300 font-black whitespace-nowrap">
              إعداد: الأكاديمية العربية
            </span>
            <span className="text-[10px] text-slate-300 font-semibold whitespace-nowrap hidden sm:inline">
              شركة الأكاديمية لتكنولوجيا المعلومات والاتصالات
            </span>
          </div>
        </div>
      </div>

      {/* Subheader Title Bar - Executive Royal Midnight Slate with Warm Gold Accent */}
      <div className="w-full bg-[#0A1B2F] text-white py-2 px-4 text-center font-bold text-xs md:text-sm shadow-sm border-t border-amber-500/20 flex items-center justify-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400"></span>
        <span className="text-white tracking-wide font-extrabold">
          {currentSlideTitle || projectInfo.projectTitle}
        </span>
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400"></span>
      </div>
    </div>
  );
};
