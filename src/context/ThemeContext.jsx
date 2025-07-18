import React, { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const ThemeContext = createContext();

export const ThemeProviderCustom = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');
  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', next);
      return next;
    });
  };
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);
  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ThemeContext); 