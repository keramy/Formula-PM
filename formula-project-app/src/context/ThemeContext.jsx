import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createFormulaTheme } from '../theme';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    // Get saved theme from localStorage or default to light
    const savedMode = localStorage.getItem('formulaThemeMode');
    return savedMode || 'light';
  });

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('formulaThemeMode', newMode);
  };

  const theme = createFormulaTheme(mode);

  const contextValue = {
    mode,
    toggleTheme,
    theme,
    isDarkMode: mode === 'dark'
  };

  useEffect(() => {
    // Save theme preference to localStorage whenever it changes
    localStorage.setItem('formulaThemeMode', mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;