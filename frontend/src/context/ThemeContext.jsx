import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

/**
 * Editorial ThemeContext
 * Enforces the curated light warm editorial palette
 */
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    try {
      localStorage.setItem('theme', 'dark');
    } catch (e) {}
  }, []);

  const toggleTheme = useCallback(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    setTheme('dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
