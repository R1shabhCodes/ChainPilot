'use client';

import React from 'react';

export default function ChainPilotCompass() {
  return (
    <div className="relative w-full max-w-[380px] aspect-square flex items-center justify-center select-none">
      {/* Background Ambient Glow Layer */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#00F0FF]/10 via-[#BAF24A]/10 to-[#D075FF]/10 blur-2xl opacity-80 animate-pulse"></div>

      {/* SVG Signature Liquidity Range Compass Instrument */}
      <svg
        viewBox="0 0 300 300"
        className="w-full h-full drop-shadow-[0_0_25px_rgba(0,240,255,0.15)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Cyan Glow Filter */}
          <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Lime Glow Filter */}
          <filter id="glow-lime" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Radial Gradient Fill for Center */}
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#05070C" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Center Glow Field */}
        <circle cx="150" cy="150" r="130" fill="url(#centerGlow)" />

        {/* Outer Orbit Tick Ring (Slow Rotating Counter-Clockwise) */}
        <g className="origin-center animate-[spin_40s_linear_infinite_reverse]">
          <circle
            cx="150"
            cy="150"
            r="138"
            stroke="#172033"
            strokeWidth="1.5"
            strokeDasharray="4 8"
          />
          <circle
            cx="150"
            cy="150"
            r="126"
            stroke="#1c2842"
            strokeWidth="1"
            strokeDasharray="2 16"
          />
          {/* Outer Cardinal Orbit Nodes */}
          <circle cx="150" cy="12" r="3" fill="#00F0FF" filter="url(#glow-cyan)" />
          <circle cx="288" cy="150" r="3" fill="#BAF24A" filter="url(#glow-lime)" />
          <circle cx="150" cy="288" r="3" fill="#FF5C16" />
          <circle cx="12" cy="150" r="3" fill="#D075FF" />
        </g>

        {/* Active Concentration Range Band (Concentric Ring Sector) */}
        <circle
          cx="150"
          cy="150"
          r="105"
          stroke="#00F0FF"
          strokeWidth="1"
          strokeOpacity="0.25"
        />

        <path
          d="M 150 45 A 105 105 0 0 1 255 150"
          stroke="#BAF24A"
          strokeWidth="6"
          strokeLinecap="square"
          filter="url(#glow-lime)"
          opacity="0.9"
        />

        <path
          d="M 45 150 A 105 105 0 0 1 150 255"
          stroke="#FF5C16"
          strokeWidth="4"
          strokeLinecap="square"
          opacity="0.6"
        />

        {/* Inner Tech Calibration Scale Ring (Rotating Clockwise) */}
        <g className="origin-center animate-[spin_30s_linear_infinite]">
          <circle
            cx="150"
            cy="150"
            r="82"
            stroke="#00F0FF"
            strokeWidth="1.5"
            strokeDasharray="6 14"
            strokeOpacity="0.5"
          />

          {/* Tick Markers along Calibration Scale */}
          <line x1="150" y1="64" x2="150" y2="72" stroke="#00F0FF" strokeWidth="2" />
          <line x1="236" y1="150" x2="228" y2="150" stroke="#BAF24A" strokeWidth="2" />
          <line x1="150" y1="236" x2="150" y2="228" stroke="#00F0FF" strokeWidth="2" />
          <line x1="64" y1="150" x2="72" y2="150" stroke="#FF5C16" strokeWidth="2" />
        </g>

        {/* Dynamic Oscillating Range Vector Needle */}
        <g className="origin-center animate-[spin_20s_ease-in-out_infinite]">
          {/* Primary Compass Pointer */}
          <polygon points="150,55 156,140 150,150" fill="#00F0FF" opacity="0.9" filter="url(#glow-cyan)" />
          <polygon points="150,55 144,140 150,150" fill="#00F0FF" opacity="0.5" />

          {/* Counterweight Pointer */}
          <polygon points="150,245 154,160 150,150" fill="#FF5C16" opacity="0.8" />
          <polygon points="150,245 146,160 150,150" fill="#FF5C16" opacity="0.4" />
        </g>

        {/* Center Precision Hub */}
        <circle cx="150" cy="150" r="14" fill="#05070C" stroke="#00F0FF" strokeWidth="2" />
        <circle cx="150" cy="150" r="6" fill="#BAF24A" filter="url(#glow-lime)" />
        <circle cx="150" cy="150" r="2" fill="#05070C" />

        {/* Telemetry Labels Overlay */}
        <text x="150" y="32" fill="#00F0FF" fontSize="9" fontFamily="monospace" textAnchor="middle" letterSpacing="2" fontWeight="bold">
          [ ACTIVE POOL RANGE ]
        </text>
        <text x="150" y="278" fill="#64748B" fontSize="8" fontFamily="monospace" textAnchor="middle" letterSpacing="1.5">
          TICK BOUNDARIES: VERIFIED
        </text>
      </svg>
    </div>
  );
}
