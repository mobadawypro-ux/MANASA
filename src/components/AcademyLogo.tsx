import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface AcademyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
  customLogoUrl?: string;
  onClick?: () => void;
}

export const AcademyLogo: React.FC<AcademyLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  textColor,
  customLogoUrl,
  onClick
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [imageError, setImageError] = useState(false);

  // Retrieve logo from prop or persistent cache
  const activeLogoUrl = customLogoUrl || (() => {
    try {
      return localStorage.getItem('cement_app_academy_logo_v1') || undefined;
    } catch (e) {
      return undefined;
    }
  })();

  // Generous, prominent dimensions to ensure 100% clarity & legibility
  const sizeMap = {
    sm: { 
      container: 'h-10 sm:h-12 w-auto', 
      emblem: 'w-10 h-10 sm:w-11 sm:h-11',
      text: 'text-xs sm:text-sm font-black', 
      subtext: 'text-[10px] sm:text-[11px] font-bold' 
    },
    md: { 
      container: 'h-14 sm:h-16 w-auto', 
      emblem: 'w-14 h-14 sm:w-16 sm:h-16',
      text: 'text-sm sm:text-base font-black', 
      subtext: 'text-xs sm:text-sm font-bold' 
    },
    lg: { 
      container: 'h-20 sm:h-24 w-auto', 
      emblem: 'w-20 h-20 sm:w-24 sm:h-24',
      text: 'text-base sm:text-lg font-black', 
      subtext: 'text-xs sm:text-sm font-bold' 
    },
    xl: { 
      container: 'h-28 sm:h-32 w-auto', 
      emblem: 'w-28 h-28 sm:w-32 sm:h-32',
      text: 'text-xl sm:text-2xl font-black', 
      subtext: 'text-sm sm:text-base font-bold' 
    }
  };

  const currentSize = sizeMap[size];
  const titleColor = textColor || (isLight ? 'text-slate-950' : 'text-white');
  const subtitleColor = isLight ? 'text-blue-800' : 'text-amber-400';

  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center gap-3 ${className} select-none ${onClick ? 'cursor-pointer hover:opacity-95 transition' : ''}`}
    >
      {/* High-Definition Emblem Container */}
      <div className={`flex items-center gap-2 shrink-0 ${currentSize.container}`}>
        {activeLogoUrl && !imageError ? (
          <div className={`${currentSize.emblem} bg-white rounded-2xl p-1.5 shadow-lg border-2 border-amber-400/60 flex items-center justify-center overflow-hidden shrink-0`}>
            <img 
              src={activeLogoUrl} 
              alt="شعار الأكاديمية العربية للعلوم والتكنولوجيا والنقل البحري" 
              onError={() => setImageError(true)}
              className="w-full h-full object-contain filter drop-shadow-sm" 
            />
          </div>
        ) : (
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Primary Unified Emblem: AASTMT Official Crest */}
            <div className={`${currentSize.emblem} relative bg-white rounded-full p-1 shadow-lg border-2 border-amber-500/80 flex items-center justify-center shrink-0`}>
              <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-sm">
                <defs>
                  <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                  <linearGradient id="navyCenter" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e3a8a" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                  <linearGradient id="laurelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#16a34a" />
                    <stop offset="100%" stopColor="#15803d" />
                  </linearGradient>
                </defs>

                {/* Outer Concentric Rings */}
                <circle cx="60" cy="60" r="58" fill="#ffffff" stroke="url(#goldRing)" strokeWidth="3" />
                <circle cx="60" cy="60" r="54" fill="none" stroke="#1e3a8a" strokeWidth="1.5" strokeDasharray="3 1.5" />

                {/* Left Laurel Wreath (Lush and High-Definition) */}
                <g fill="url(#laurelGrad)">
                  <path d="M 30 95 C 14 78 14 42 34 24 C 28 34 26 55 34 78 Z" />
                  <ellipse cx="22" cy="46" rx="9" ry="4" transform="rotate(-30 22 46)" />
                  <ellipse cx="19" cy="60" rx="9" ry="4" transform="rotate(-10 19 60)" />
                  <ellipse cx="22" cy="74" rx="9" ry="4" transform="rotate(15 22 74)" />
                  <ellipse cx="30" cy="86" rx="9" ry="4.5" transform="rotate(40 30 86)" />
                  {/* Golden Berries */}
                  <circle cx="28" cy="42" r="2.2" fill="#f59e0b" />
                  <circle cx="25" cy="56" r="2.2" fill="#f59e0b" />
                  <circle cx="28" cy="70" r="2.2" fill="#f59e0b" />
                </g>

                {/* Right Laurel Wreath */}
                <g fill="url(#laurelGrad)">
                  <path d="M 90 95 C 106 78 106 42 86 24 C 92 34 94 55 86 78 Z" />
                  <ellipse cx="98" cy="46" rx="9" ry="4" transform="rotate(30 98 46)" />
                  <ellipse cx="101" cy="60" rx="9" ry="4" transform="rotate(10 101 60)" />
                  <ellipse cx="98" cy="74" rx="9" ry="4" transform="rotate(-15 98 74)" />
                  <ellipse cx="90" cy="86" rx="9" ry="4.5" transform="rotate(-40 90 86)" />
                  {/* Golden Berries */}
                  <circle cx="92" cy="42" r="2.2" fill="#f59e0b" />
                  <circle cx="95" cy="56" r="2.2" fill="#f59e0b" />
                  <circle cx="92" cy="70" r="2.2" fill="#f59e0b" />
                </g>

                {/* Top Radiant Golden Star & Arab League Crescent */}
                <path d="M 48 18 C 55 12 65 12 72 18 C 65 15 55 15 48 18 Z" fill="#f59e0b" />
                <polygon
                  points="60,8 63,16 71,16 65,21 67,29 60,24 53,29 55,21 49,16 57,16"
                  fill="#fbbf24"
                  stroke="#d97706"
                  strokeWidth="0.8"
                />

                {/* Central Navy Disc */}
                <circle cx="60" cy="60" r="32" fill="url(#navyCenter)" stroke="url(#goldRing)" strokeWidth="2.5" />

                {/* Nautical Helm / Gear Teeth on Ring */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                  <rect
                    key={angle}
                    x="58.5"
                    y="25"
                    width="3"
                    height="5"
                    rx="1.5"
                    fill="#fbbf24"
                    transform={`rotate(${angle} 60 60)`}
                  />
                ))}

                {/* Maritime Waves in Navy Disc */}
                <path
                  d="M 34 76 Q 47 70 60 76 Q 73 82 86 76"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 38 82 Q 49 78 60 82 Q 71 86 82 82"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Central Golden Anchor */}
                <g stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
                  <line x1="60" y1="36" x2="60" y2="72" />
                  <line x1="50" y1="46" x2="70" y2="46" />
                  <path d="M 44 60 C 44 74 76 74 76 60" />
                  <polygon points="44,56 41,64 47,64" fill="#fbbf24" stroke="none" />
                  <polygon points="76,56 73,64 79,64" fill="#fbbf24" stroke="none" />
                  {/* Top Anchor Ring */}
                  <circle cx="60" cy="35" r="4.5" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
                </g>

                {/* Central Open Book of Science / Knowledge */}
                <g fill="#ffffff" opacity="0.95">
                  <path d="M 60 55 C 54 52 46 53 44 57 L 44 68 C 46 64 54 63 60 66 Z" />
                  <path d="M 60 55 C 66 52 74 53 76 57 L 76 68 C 74 64 66 63 60 66 Z" />
                </g>

                {/* Arching Banner Text: Arab Academy */}
                <path id="aastmtArch" d="M 22 42 Q 60 2 98 42" fill="none" />
                <text fontSize="7.2" fontWeight="900" fill="#1e3a8a" letterSpacing="0.2">
                  <textPath href="#aastmtArch" startOffset="50%" textAnchor="middle">
                    جامعة الدول العربية
                  </textPath>
                </text>
              </svg>
            </div>

            {/* Secondary Badge: ICT Company & Technology Orbits */}
            <div className={`${currentSize.emblem} relative bg-white rounded-full p-1 shadow-lg border-2 border-blue-600/80 flex items-center justify-center shrink-0`}>
              <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-sm">
                {/* Outer Ring */}
                <circle cx="60" cy="60" r="58" fill="#ffffff" stroke="#1e3a8a" strokeWidth="2.5" />
                <circle cx="60" cy="60" r="53" fill="none" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3 2" />

                {/* Technology Glowing Center */}
                <circle cx="60" cy="60" r="34" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />

                {/* 3 Prominent High-Contrast Dynamic Orbits (Cyan, Emerald, Amber-Orange) */}
                <ellipse
                  cx="54"
                  cy="50"
                  rx="22"
                  ry="10"
                  transform="rotate(-28 54 50)"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="4.2"
                  strokeLinecap="round"
                />
                <circle cx="70" cy="42" r="3.5" fill="#0284c7" />

                <ellipse
                  cx="60"
                  cy="60"
                  rx="24"
                  ry="10"
                  transform="rotate(22 60 60)"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="4.2"
                  strokeLinecap="round"
                />
                <circle cx="42" cy="54" r="3.5" fill="#16a34a" />

                <ellipse
                  cx="66"
                  cy="70"
                  rx="22"
                  ry="9.5"
                  transform="rotate(-18 66 70)"
                  fill="none"
                  stroke="#ea580c"
                  strokeWidth="4.2"
                  strokeLinecap="round"
                />
                <circle cx="82" cy="74" r="3.5" fill="#ea580c" />

                {/* Central Anchor Silhouette */}
                <path
                  d="M 60 48 L 60 76 M 48 66 C 53 78 67 78 72 66"
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="60" cy="45" r="3.5" fill="#0f172a" />

                {/* Top/Bottom Arabic Curve */}
                <path id="ictCurve" d="M 16 100 Q 60 126 104 100" fill="none" />
                <text fontSize="6.8" fontWeight="900" fill="#0f172a">
                  <textPath href="#ictCurve" startOffset="50%" textAnchor="middle">
                    تكنولوجيا المعلومات
                  </textPath>
                </text>
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* High-Contrast Bold Typography */}
      {showText && (
        <div className="flex flex-col text-right leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-black ${titleColor} ${currentSize.text} tracking-tight drop-shadow-xs`}>
              الأكاديمية العربية للعلوم والتكنولوجيا والنقل البحري
            </span>
          </div>
          <span className={`font-black ${subtitleColor} ${currentSize.subtext} mt-0.5 tracking-normal`}>
            شركة الأكاديمية لتكنولوجيا المعلومات والاتصالات • الجهة الاستشارية ومُعد التقرير
          </span>
        </div>
      )}
    </div>
  );
};
