import { createTheme } from '@mui/material/styles';

// Тема для темного режима
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212', 
      paper: '#1f1f1f',   
    },
    text: {
      primary: '#ffffff',  
      secondary: '#bbbbbb', 
    },
    primary: {
      main: '#90caf9', 
      contrastText: '#000', 
    },
    secondary: {
      main: '#f48fb1', 
      contrastText: '#000', 
    },
    error: {
      main: '#f44336', 
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1f1f1f', 
          color: '#fff', 
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#fff', 
          textTransform: 'none', 
        },
        containedPrimary: {
          backgroundColor: '#1976d2',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#1565c0', 
          },
        },
        containedSecondary: {
          backgroundColor: '#d81b60',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#ad1457', 
          },
        },
        outlinedPrimary: {
          borderColor: '#90caf9',
          color: '#90caf9',
          '&:hover': {
            backgroundColor: 'rgba(144, 202, 249, 0.1)',
            borderColor: '#90caf9',
          },
        },
        outlinedSecondary: {
          borderColor: '#f48fb1',
          color: '#f48fb1',
          '&:hover': {
            backgroundColor: 'rgba(244, 143, 177, 0.1)',
            borderColor: '#f48fb1',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#90caf9', 
          '&:hover': {
            color: '#63a4ff', 
            textDecoration: 'underline', 
          },
        },
      },
    },
  },
});

// Тема для светлого режима
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#ffffff', 
      paper: '#fafafa',   
    },
    text: {
      primary: '#000000',  
      secondary: '#333333', 
    },
    primary: {
      main: '#1976d2', 
      contrastText: '#fff', 
    },
    secondary: {
      main: '#f48fb1', 
      contrastText: '#000', 
    },
    error: {
      main: '#f44336', 
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#fafafa', 
          color: '#000', 
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#000', 
          textTransform: 'none', 
        },
        containedPrimary: {
          backgroundColor: '#1976d2',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#1565c0', 
          },
        },
        containedSecondary: {
          backgroundColor: '#f48fb1',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#ad1457', 
          },
        },
        outlinedPrimary: {
          borderColor: '#90caf9',
          color: '#90caf9',
          '&:hover': {
            backgroundColor: 'rgba(144, 202, 249, 0.1)',
            borderColor: '#90caf9',
          },
        },
        outlinedSecondary: {
          borderColor: '#f48fb1',
          color: '#f48fb1',
          '&:hover': {
            backgroundColor: 'rgba(244, 143, 177, 0.1)',
            borderColor: '#f48fb1',
          },
        },
      },
    },
  },
});
