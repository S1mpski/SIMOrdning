import { createTheme } from '@mui/material/styles';

export type ThemeMode = 'light' | 'dark';

export function createAppTheme(mode: ThemeMode) {
  return createTheme({
    palette: {
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

    shape: {
      borderRadius: 8,
    },

    typography: {
      fontFamily: 'Arial, Helvetica, sans-serif',

      h4: {
        fontSize: '1.75rem',
        fontWeight: 700,
      },

      h6: {
        fontWeight: 600,
      },

      body2: {
        fontSize: '0.875rem',
      },
    },

    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 600,
            backgroundColor: mode === 'light' ? '#f9fafb' : '#202328',
            color: mode === 'light' ? '#4b5563' : '#d1d5db',
          },
        },
      },
    },
  });
}
