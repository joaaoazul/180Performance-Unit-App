// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#b71c1c', // Vermelho forte
    },
    secondary: {
      main: '#424242', // Cinza escuro
    },
    background: {
      default: '#f5f5f5', // Fundo claro
      paper: '#ffffff',   // Cartões brancos
    },
    text: {
      primary: '#212121', // Preto/cinza escuro
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    // Barra de topo com gradiente leve
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #b71c1c 0%, #ff1744 100%)',
        },
      },
    },
    // Drawer para sidebar escura
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1e1e2f', // Sidebar escura
          color: '#fff',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
