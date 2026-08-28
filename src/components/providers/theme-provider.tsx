'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { CssBaseline, ThemeProvider } from '@mui/material';

import { createAppTheme, type ThemeMode } from '@/theme/theme';

type ThemeModeContextType = {
  mode: ThemeMode;
  toggleTheme: () => void;
};

const ThemeModeContext = createContext<ThemeModeContextType>({
  mode: 'light',
  toggleTheme: () => {},
});

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

export default function AppThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode');

    if (savedMode === 'light' || savedMode === 'dark') {
      setMode(savedMode);
    }
  }, []);

  function toggleTheme() {
    setMode((currentMode) => {
      const newMode: ThemeMode = currentMode === 'light' ? 'dark' : 'light';

      localStorage.setItem('theme-mode', newMode);

      return newMode;
    });
  }

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider
      value={{
        mode,
        toggleTheme,
      }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
