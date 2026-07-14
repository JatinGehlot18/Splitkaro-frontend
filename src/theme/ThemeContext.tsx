import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, Theme } from './theme';

type ThemeContextValue = {
  theme: Theme;
  isDark: boolean;
  setMode: (mode: 'light' | 'dark') => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [mode, setMode] = useState<'light' | 'dark'>(
    system === 'light' ? 'light' : 'dark',
  );

  const value = useMemo<ThemeContextValue>(() => {
    const isDark = mode === 'dark';
    return {
      isDark,
      theme: isDark ? darkTheme : lightTheme,
      setMode,
      toggle: () => setMode(m => (m === 'dark' ? 'light' : 'dark')),
    };
  }, [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
