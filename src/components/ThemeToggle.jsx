import React from 'react';
import { useThemeStore } from '../store/theme';

export default function ThemeToggle({ className = '' }) {
  const { dark, toggle } = useThemeStore();

  return (
    <button
      onClick={toggle}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none ${className}`}
      style={{ background: dark ? 'linear-gradient(135deg, #7c3aed, #2563eb)' : '#e5e7eb' }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full flex items-center justify-center text-sm shadow-sm transition-all duration-300 bg-white"
        style={{ transform: dark ? 'translateX(28px)' : 'translateX(0)' }}
      >
        {dark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
