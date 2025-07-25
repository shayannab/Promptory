import React from 'react';

// Minimal spark-inspired logo for Promptory
export default function SparkLogo({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="22" fill="url(#grad)" fillOpacity="0.15" />
      <path
        d="M24 8 L27 20 L40 24 L27 28 L24 40 L21 28 L8 24 L21 20 Z"
        fill="url(#spark)"
        stroke="url(#sparkStroke)"
        strokeWidth="2"
        strokeLinejoin="round"
        filter="url(#glow)"
      />
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#A78BFA" />
        </linearGradient>
        <linearGradient id="spark" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34D399" />
          <stop offset="1" stopColor="#6366F1" />
        </linearGradient>
        <linearGradient id="sparkStroke" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE68A" />
          <stop offset="1" stopColor="#818CF8" />
        </linearGradient>
        <filter id="glow" x="-10" y="-10" width="68" height="68" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
} 