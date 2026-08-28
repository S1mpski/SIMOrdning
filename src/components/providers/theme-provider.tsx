'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

type ThemeMode = 'light' | 'dark';

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
      const newMode = currentMode === 'light' ? 'dark' : 'light';

      localStorage.setItem('theme-mode', newMode);

      return newMode;
    });
  }

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,

          ...(mode === 'light'
            ? {
                background: {
                  default: '#f7f8fa',
                  paper: '#ffffff',
                },
              }
            : {
                background: {
                  default: '#121212',
                  paper: '#1e1e1e',
                },
              }),
        },

        shape: {
          borderRadius: 8,
        },

        typography: {
          fontFamily:
            'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
      }),
    [mode],
  );

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
