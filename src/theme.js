// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#b71c1c', // vermelho forte
    },
    secondary: {
      main: '#424242', // cinza escuro
    },
    background: {
      default: '#121212', // fundo preto
      paper: '#1e1e1e',   // papel/carta cinza escuro
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #b71c1c 0%, #ff1744 100%)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1c1c1c',
          color: '#fff',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(255, 23, 68, 0.5)',
        },
      },
    },
  },
});

export default theme;
