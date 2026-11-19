/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AunaraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showTagline?: boolean;
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

export const AunaraLogo: React.FC<AunaraLogoProps> = ({
  size = 'md',
  showWordmark = true,
  showTagline = false,
  layout = 'horizontal',
  className = ''
}) => {
  const iconDimensions =
    size === 'sm'
      ? 'w-8 h-8'
      : size === 'lg'
      ? 'w-14 h-14'
      : size === 'xl'
      ? 'w-20 h-20'
      : 'w-10 h-10';

  const titleClasses =
    size === 'sm'
      ? 'text-lg'
      : size === 'lg'
      ? 'text-2xl'
      : size === 'xl'
      ? 'text-3xl'
      : 'text-xl';

  return (
    <div
      className={`inline-flex ${
        layout === 'vertical' ? 'flex-col items-center gap-2' : 'items-center gap-2.5'
      } select-none ${className}`}
    >
      {/* Aunara Playful Ribbon-Loop "A" Brand Mark */}
      <svg
        viewBox="0 0 120 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconDimensions} shrink-0`}
        aria-label="Logo AUNARA"
      >
        <defs>
          <filter id="aunaraShadow" x="-15%" y="-15%" width="130%" height="135%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#1E303B" floodOpacity="0.18" />
          </filter>

          <linearGradient id="ribbonCoral" x1="18" y1="44" x2="54" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F59B7E" />
            <stop offset="55%" stopColor="#EB766D" />
            <stop offset="100%" stopColor="#E16565" />
          </linearGradient>

          <linearGradient id="ribbonArch" x1="28" y1="50" x2="88" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F29577" />
            <stop offset="52%" stopColor="#C8D36B" />
            <stop offset="100%" stopColor="#6BB88F" />
          </linearGradient>

          <linearGradient id="ribbonInner" x1="42" y1="78" x2="72" y2="35" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F7A97C" />
            <stop offset="55%" stopColor="#B8D46A" />
            <stop offset="100%" stopColor="#77BE99" />
          </linearGradient>

          <linearGradient id="ribbonTeal" x1="65" y1="30" x2="95" y2="84" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#5EB5B0" />
            <stop offset="60%" stopColor="#3B8F96" />
            <stop offset="100%" stopColor="#2E747E" />
          </linearGradient>
        </defs>

        <g filter="url(#aunaraShadow)">
          {/* Back Outer Arch Ribbon (Coral -> Lime -> Teal) */}
          <path
            d="M27 53 C27 32, 43 13, 60 13 C77 13, 88 30, 82 52"
            stroke="url(#ribbonArch)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Inner Left-to-Right Loop Crossbar */}
          <path
            d="M46 76 C50 60, 52 38, 60 36 C67 34, 72 52, 83 68"
            stroke="url(#ribbonInner)"
            strokeWidth="11.5"
            strokeLinecap="round"
          />

          {/* Left Coral U-Loop Ribbon */}
          <path
            d="M29 44 L29 66 C29 79, 43 81, 47 68 L56 38"
            stroke="url(#ribbonCoral)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Right Teal U-Loop Ribbon */}
          <path
            d="M59 46 C68 57, 74 79, 84 78 C95 77, 94 56, 86 38"
            stroke="url(#ribbonTeal)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Left Coral Circular Node */}
          <circle cx="29" cy="44" r="10.5" fill="#F59E7D" />
          <circle cx="29" cy="44" r="4.5" fill="#FFFDF8" fillOpacity="0.88" />

          {/* Right Teal Circular Node */}
          <circle cx="86" cy="37" r="10.5" fill="#59B2AE" />
          <circle cx="86" cy="37" r="4.5" fill="#FFFDF8" fillOpacity="0.88" />
        </g>

        {/* Floating Playful Sparkle Dots */}
        {/* Coral Left Dots */}
        <circle cx="22" cy="19" r="2.2" fill="#EB7F6E" />
        <circle cx="15" cy="27" r="3.2" fill="#F19879" />
        <circle cx="11" cy="43" r="1.8" fill="#EB766D" />

        {/* Lime Bottom Dots */}
        <circle cx="53" cy="87" r="2" fill="#A9CA6B" />
        <circle cx="62" cy="89" r="3" fill="#B6D36F" />
        <circle cx="71" cy="86" r="1.8" fill="#8CC18A" />

        {/* Teal Right Dots */}
        <circle cx="104" cy="37" r="2" fill="#58B0AC" />
        <circle cx="107" cy="48" r="3.1" fill="#46999E" />
        <circle cx="103" cy="59" r="2.1" fill="#3C848D" />
      </svg>

      {showWordmark && (
        <div className={layout === 'vertical' ? 'text-center leading-none' : 'text-left leading-none'}>
          <span
            className={`${titleClasses} font-black tracking-tight lowercase text-[#1F3347] dark:text-[#F7F2E9] block`}
            style={{ letterSpacing: '-0.02em' }}
          >
            aunara
          </span>
          {showTagline && (
            <p className="text-[10px] font-bold uppercase text-[#6CAAA4] dark:text-[#84C2BC] tracking-wider mt-0.5">
              Create • Play • Learn
            </p>
          )}
        </div>
      )}
    </div>
  );
};
