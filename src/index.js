import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles'; // для переключения тем

import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary';
import { darkTheme, lightTheme } from './styles/theme'; // Убедитесь, что путь правильный

const root = ReactDOM.createRoot(document.getElementById('root'));

// Главный компонент, который включает тему
function Root() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light'); // Состояние для темы

  // Эффект, чтобы сохранить выбранную тему в localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Функция для переключения темы
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <ErrorBoundary>
        <BrowserRouter>
          <App toggleTheme={toggleTheme} theme={theme} />
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
