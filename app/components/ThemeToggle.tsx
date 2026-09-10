'use client';

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('chainpilot_theme') as 'dark' | 'light' | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('chainpilot_theme', nextTheme);
  };

  if (!mounted) {
    return (
      <button
        aria-label="Toggle visual theme"
        className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-widest bg-[#0a0d14] border border-[#1e283d] text-slate-400 opacity-60"
      >
        [ THEME: DARK ]
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle visual theme"
      className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-widest border transition-colors cursor-pointer ${
        theme === 'light'
          ? 'bg-slate-200 border-slate-400 text-slate-900 hover:bg-slate-300'
          : 'bg-[#0a0d14] border-[#1e283d] text-[#00F0FF] hover:border-[#00F0FF]/60'
      }`}
    >
      [ THEME: {theme.toUpperCase()} ]
    </button>
  );
}
