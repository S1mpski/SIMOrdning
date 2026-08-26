import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    primary: {
      main: '#222222',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
});

export default theme;
