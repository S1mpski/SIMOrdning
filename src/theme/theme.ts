import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',

    primary: {
      main: '#1f2937',
    },

    background: {
      default: '#f6f7f9',
      paper: '#ffffff',
    },

    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },

    divider: '#e5e7eb',
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
          backgroundColor: '#f9fafb',
          color: '#4b5563',
        },
      },
    },
  },
});

export default theme;
