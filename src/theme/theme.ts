import { createTheme } from '@mui/material/styles';

export type ThemeMode = 'light' | 'dark';

declare module '@mui/material/styles' {
  interface Palette {
    simBlue: {
      main: string;
      dark: string;
      light: string;
    };
  }

  interface PaletteOptions {
    simBlue?: {
      main: string;
      dark: string;
      light: string;
    };
  }
}

export function createAppTheme(mode: ThemeMode) {
  return createTheme({
    palette: {
      simBlue: {
        main: '#0878F9',
        light: '#0878F9',
        dark: '#173B70',
      },
      mode,

      primary: {
        main: mode === 'light' ? '#1f2937' : '#f3f4f6',
      },

      background:
        mode === 'light'
          ? {
              default: '#f6f7f9',
              paper: '#ffffff',
            }
          : {
              default: '#111315',
              paper: '#1b1d20',
            },

      text:
        mode === 'light'
          ? {
              primary: '#1f2937',
              secondary: '#6b7280',
            }
          : {
              primary: '#f3f4f6',
              secondary: '#9ca3af',
            },

      divider: mode === 'light' ? '#e5e7eb' : '#2f3338',
    },

    // resten av ditt theme...
  });
}
