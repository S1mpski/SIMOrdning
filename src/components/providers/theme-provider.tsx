'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { CssBaseline, ThemeProvider } from '@mui/material';

import { createAppTheme, type ThemeMode } from '@/theme/theme';

import { GlobalStyles } from '@mui/material';

import { createClient } from '@/lib/supabase/client';

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
      <GlobalStyles
        styles={{
          '@media print': {
            'body *': {
              visibility: 'hidden',
            },

            'body[data-print-report="income"] #print-income-report, body[data-print-report="income"] #print-income-report *':
              {
                visibility: 'visible',
              },

            'body[data-print-report="balance"] #print-balance-report, body[data-print-report="balance"] #print-balance-report *':
              {
                visibility: 'visible',
              },

            '#print-income-report, #print-balance-report': {
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
            },

            '.no-print': {
              display: 'none !important',
            },

            '@page': {
              size: 'A4',
              margin: '15mm',
            },
          },
        }}
      />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
