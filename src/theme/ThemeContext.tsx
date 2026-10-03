import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'hybrid';

const STORAGE_KEY = 'drax-theme';
const MODES: ThemeMode[] = ['light', 'dark', 'hybrid'];

/**
 * The inline script in index.html sets data-mode before first paint;
 * trust it when present so there is never a wrong-theme flash.
 */
const readInitialMode = (): ThemeMode => {
  const fromDom = document.documentElement.dataset.mode as ThemeMode | undefined;
  if (fromDom && MODES.includes(fromDom)) return fromDom;
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored && MODES.includes(stored)) return stored;
  } catch {
    /* storage unavailable — fall through */
  }
  return 'hybrid';
};

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'hybrid',
  setMode: () => undefined
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(readInitialMode);

  useEffect(() => {
    document.documentElement.dataset.mode = mode;

    /* Keep mobile browser chrome in step with the surface */
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mode === 'dark' ? '#0b0b0a' : '#ece9e2');

    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* private mode — persistence is best-effort */
    }
  }, [mode]);

  const setMode = useCallback((next: ThemeMode) => setModeState(next), []);

  return <ThemeContext.Provider value={{ mode, setMode }}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => useContext(ThemeContext);
