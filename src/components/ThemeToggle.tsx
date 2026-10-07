import React, { useState } from 'react';
import { MoonIcon, SunIcon } from './Icons';

type Theme = 'dark' | 'light';

const current = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

/** Small sun / moon switch. Dark is the default; the choice is remembered. */
export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [theme, setTheme] = useState<Theme>(current);

  const flip = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    root.classList.add('theme-fade');
    root.dataset.theme = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'light' ? '#ddd5c5' : '#121214');
    window.setTimeout(() => root.classList.remove('theme-fade'), 500);
    try {
      localStorage.setItem('drax-theme', next);
    } catch {
      // private mode: it just won't be remembered
    }
    setTheme(next);
  };

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`}
      onClick={flip}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      title={theme === 'dark' ? 'Light' : 'Dark'}
    >
      {theme === 'dark' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
    </button>
  );
};
