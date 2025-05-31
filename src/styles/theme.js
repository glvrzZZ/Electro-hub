import { createTheme } from '@mui/material/styles';

// Тема для темного режима
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212', // основной фон - темный
      paper: '#1f1f1f',   // фон карточек и панелей
    },
    text: {
      primary: '#ffffff',  // основной цвет текста - белый
      secondary: '#bbbbbb', // для второстепенного текста
    },
    primary: {
      main: '#90caf9', // светло-синий для акцентов
      contrastText: '#000', // для темного текста на primary кнопках
    },
    secondary: {
      main: '#f48fb1', // розовый акцент
      contrastText: '#000', // для темного текста на secondary кнопках
    },
    error: {
      main: '#f44336', // красный цвет для ошибок
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1f1f1f', // фон для бумажных компонентов
          color: '#fff', // белый текст для компонента
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#fff', // белый текст на кнопках
          textTransform: 'none', // отключаем преобразование текста в верхний регистр
        },
        containedPrimary: {
          backgroundColor: '#1976d2',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#1565c0', // цвет при наведении
          },
        },
        containedSecondary: {
          backgroundColor: '#d81b60',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#ad1457', // цвет при наведении
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
          color: '#90caf9', // светло-синий цвет ссылок
          '&:hover': {
            color: '#63a4ff', // светлый синий при наведении
            textDecoration: 'underline', // подчеркивание при наведении
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
      default: '#ffffff', // белый фон
      paper: '#fafafa',   // фон карточек и панелей
    },
    text: {
      primary: '#000000',  // основной цвет текста - черный
      secondary: '#333333', // для второстепенного текста
    },
    primary: {
      main: '#1976d2', // основной синий для акцентов
      contrastText: '#fff', // белый текст на primary кнопках
    },
    secondary: {
      main: '#f48fb1', // розовый акцент
      contrastText: '#000', // черный текст на secondary кнопках
    },
    error: {
      main: '#f44336', // красный цвет для ошибок
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#fafafa', // фон для бумажных компонентов
          color: '#000', // черный текст для компонента
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#000', // черный текст на кнопках
          textTransform: 'none', // отключаем преобразование текста в верхний регистр
        },
        containedPrimary: {
          backgroundColor: '#1976d2',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#1565c0', // цвет при наведении
          },
        },
        containedSecondary: {
          backgroundColor: '#f48fb1',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#ad1457', // цвет при наведении
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
