"use client";

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [lightMode, setLightMode] = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined' && localStorage.getItem('vision-theme') === 'light';
    setLightMode(stored);
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('light-mode', stored);
    }
  }, []);

  const toggle = () => {
    const next = !lightMode;
    setLightMode(next);
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('light-mode', next);
      localStorage.setItem('vision-theme', next ? 'light' : 'dark');
    }
  };

  return (
    <button
      type="button"
      className="theme-toggle-global"
      onClick={toggle}
      title={lightMode ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-label="Toggle theme"
    >
      {lightMode ? '🌙' : '☀️'}
    </button>
  );
}
