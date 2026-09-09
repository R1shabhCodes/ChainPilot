'use client';

export default function ChainPilotCompass() {
  return (
    <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center select-none pointer-events-none">
      {/* Outer Glow Ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--accent-purple-glow)] via-transparent to-[var(--accent-orange-glow)] blur-xl opacity-70 animate-pulse"></div>

      {/* SVG Compass Instrument */}
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full text-[var(--accent-purple)] transition-transform duration-700 hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Geometric Ring */}
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke="var(--border-color-hover)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Inner Tech Ring */}
        <circle
          cx="60"
          cy="60"
          r="44"
          stroke="var(--accent-purple)"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />

        {/* Cardinal Ticks */}
        <line x1="60" y1="8" x2="60" y2="16" stroke="var(--accent-orange)" strokeWidth="2" strokeLinecap="round" />
        <line x1="60" y1="104" x2="60" y2="112" stroke="var(--accent-purple)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="8" y1="60" x2="16" y2="60" stroke="var(--accent-blue)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="104" y1="60" x2="112" y2="60" stroke="var(--accent-blue)" strokeWidth="1.5" strokeLinecap="round" />

        {/* Rotating Vector Compass Needle */}
        <g className="origin-center motion-safe:animate-[spin_24s_linear_infinite]">
          {/* North Pointer */}
          <polygon points="60,20 66,54 60,60" fill="var(--accent-orange)" opacity="0.9" />
          <polygon points="60,20 54,54 60,60" fill="var(--accent-orange)" opacity="0.6" />

          {/* South Pointer */}
          <polygon points="60,100 66,66 60,60" fill="var(--accent-purple)" opacity="0.8" />
          <polygon points="60,100 54,66 60,60" fill="var(--accent-purple)" opacity="0.4" />

          {/* West / East Crosshair Axis */}
          <line x1="28" y1="60" x2="92" y2="60" stroke="var(--accent-blue)" strokeWidth="1" strokeOpacity="0.5" />
        </g>

        {/* Center Orbit Hub */}
        <circle cx="60" cy="60" r="7" fill="var(--bg-surface)" stroke="var(--accent-orange)" strokeWidth="2" />
        <circle cx="60" cy="60" r="3" fill="var(--accent-orange)" />
      </svg>
    </div>
  );
}
