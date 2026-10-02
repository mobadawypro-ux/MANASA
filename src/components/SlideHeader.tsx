import React from 'react';
import { ProjectInfo } from '../types/report';
import { Building2, Award } from 'lucide-react';

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
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">{projectInfo.companyName}</h2>
              <p className="text-xs text-amber-400 font-medium">{projectInfo.subLocation}</p>
            </div>
          </div>

          <div className="text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              {projectInfo.contractNumber}
            </span>
          </div>
        </div>

        {currentSlideTitle && (
          <div className="mt-3 py-1.5 px-4 bg-gradient-to-r from-red-600 via-rose-700 to-red-600 text-white font-bold text-sm md:text-base rounded-md shadow-md text-center">
            {currentSlideTitle}
          </div>
        )}
      </div>
    );
  }

  // Classic design matching the PDF original presentation with high visual polish
  return (
    <div className="w-full mb-3 select-none">
      {/* Top Banner Ribbon */}
      <div className="flex items-stretch shadow-md rounded-t-sm overflow-hidden text-xs md:text-sm font-bold border-b border-amber-400/40">
        {/* Right side in RTL: Company Name with Yellow ribbon & Emblem */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 text-slate-900 px-4 py-2 shrink-0 shadow-inner">
          <div className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center p-0.5 border border-slate-700 shadow-sm">
            <Award className="w-4 h-4" />
          </div>
          <span className="tracking-tight text-xs md:text-sm font-black whitespace-nowrap">
            {projectInfo.companyName}
          </span>
        </div>

        {/* Center / Left side in RTL: Industrial Plant Blue Ribbon */}
        <div className="flex-1 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white px-4 py-2 flex items-center justify-start text-xs md:text-sm shadow-inner overflow-hidden">
          <span className="truncate drop-shadow">
            {projectInfo.subLocation}
          </span>
        </div>
      </div>

      {/* Red Accent Bar */}
      <div className="w-full bg-gradient-to-r from-red-800 via-red-600 to-red-800 text-white py-1.5 px-4 text-center font-bold text-xs md:text-sm shadow-md border-t border-red-500/30">
        <span className="drop-shadow-sm">
          {currentSlideTitle || projectInfo.projectTitle}
        </span>
      </div>
    </div>
  );
};
