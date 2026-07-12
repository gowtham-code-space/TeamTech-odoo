import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  useEffect(() => {
    // Load and apply theme globally on app initialization
    const theme = localStorage.getItem('theme') || 'system';
    const root = window.document.documentElement;
    
    const apply = (selectedTheme) => {
      root.classList.remove('light', 'dark');
      if (selectedTheme === 'dark') {
        root.classList.add('dark');
      } else if (selectedTheme === 'light') {
        root.classList.add('light');
      } else {
        const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.add(isSystemDark ? 'dark' : 'light');
      }
    };

    apply(theme);

    // Listen for system preference changes if system theme is selected
    const systemThemeListener = (e) => {
      const currentTheme = localStorage.getItem('theme') || 'system';
      if (currentTheme === 'system') {
        root.classList.remove('light', 'dark');
        root.classList.add(e.matches ? 'dark' : 'light');
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', systemThemeListener);
    
    return () => {
      mediaQuery.removeEventListener('change', systemThemeListener);
    };
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
