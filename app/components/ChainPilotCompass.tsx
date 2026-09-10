'use client';

import React from 'react';

export default function ChainPilotCompass() {
  return (
    <div className="relative w-full max-w-[600px] aspect-square flex items-center justify-center select-none">
      
      {/* SVG Signature Hard-Edged Technical Instrument */}
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="subtle-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Structural Background Grid / Crosshairs */}
        <line x1="200" y1="0" x2="200" y2="400" stroke="#141a29" strokeWidth="1" />
        <line x1="0" y1="200" x2="400" y2="200" stroke="#141a29" strokeWidth="1" />
        <circle cx="200" cy="200" r="180" stroke="#1e283d" strokeWidth="1" strokeDasharray="4 8" />

        {/* Outer Orbital Telemetry Ring (Slow Counter-Clockwise Rotation) */}
        <g className="origin-center animate-[spin_60s_linear_infinite_reverse]">
          <circle cx="200" cy="200" r="160" stroke="#141a29" strokeWidth="2" />
          
          {/* Node Attachments */}
          <rect x="196" y="36" width="8" height="8" fill="#00F0FF" />
          <rect x="356" y="196" width="8" height="8" fill="#1e283d" />
          <rect x="196" y="356" width="8" height="8" fill="#ff5c16" />
          <rect x="36" y="196" width="8" height="8" fill="#baf24a" />
          
          {/* Tick Data Points */}
          <circle cx="200" cy="40" r="2" fill="#020306" />
          <circle cx="360" cy="200" r="2" fill="#00F0FF" />
        </g>

        {/* Concentric Liquidity Sectors (Sharp Geometry) */}
        
        {/* Active Range Sector (Cyan/Lime vibe) */}
        <path
          d="M 200 60 A 140 140 0 0 1 340 200"
          stroke="#baf24a"
          strokeWidth="12"
          strokeLinecap="square"
        />


        {/* Out-of-Bounds Exposure Sector (Orange) */}
        <path
          d="M 60 200 A 140 140 0 0 1 200 60"
          stroke="#ff5c16"
          strokeWidth="6"
          strokeLinecap="square"
          opacity="0.8"
        />


        {/* Deep Out of bounds */}
        <path
          d="M 200 340 A 140 140 0 0 1 60 200"
          stroke="#1e283d"
          strokeWidth="6"
          strokeLinecap="square"
        />

        {/* Precision Calibration Inner Ring (Clockwise Rotation) */}
        <g className="origin-center animate-[spin_40s_linear_infinite]">
          <circle
            cx="200"
            cy="200"
            r="110"
            stroke="#00F0FF"
            strokeWidth="1"
            strokeDasharray="2 6"
            opacity="0.6"
          />
          {/* Calibration Marks */}
          <line x1="200" y1="80" x2="200" y2="90" stroke="#00F0FF" strokeWidth="2" />
          <line x1="320" y1="200" x2="310" y2="200" stroke="#baf24a" strokeWidth="2" />
          <line x1="200" y1="320" x2="200" y2="310" stroke="#00F0FF" strokeWidth="2" />
          <line x1="80" y1="200" x2="90" y2="200" stroke="#ff5c16" strokeWidth="2" />
        </g>

        {/* Central Vector Needle (Oscillating) */}
        <g className="origin-center animate-[spin_15s_ease-in-out_infinite]">
          {/* North Vector Arrow */}
          <polygon points="200,85 208,200 200,210" fill="#00F0FF" opacity="0.9" />
          <polygon points="200,85 192,200 200,210" fill="#00F0FF" opacity="0.4" />

          {/* South Counterweight */}
          <polygon points="200,315 205,200 200,190" fill="#1e283d" opacity="0.8" />
          <polygon points="200,315 195,200 200,190" fill="#1e283d" opacity="0.4" />
        </g>

        {/* Central Hub Mechanism */}
        <circle cx="200" cy="200" r="22" fill="#06080d" stroke="#00F0FF" strokeWidth="3" />
        <circle cx="200" cy="200" r="10" fill="#020306" stroke="#baf24a" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="3" fill="#00F0FF" />

      </svg>
    </div>
  );
}
