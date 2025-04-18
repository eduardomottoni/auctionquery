import React, { createContext, useState, useMemo, useContext, ReactNode, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider, DefaultTheme } from 'styled-components';
import { lightTheme, darkTheme } from '@/styles/theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextProps {
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface AppThemeProviderProps {
  children: ReactNode;
}

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light'); // Default to light

  // Load saved theme preference from local storage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('appTheme') as ThemeMode | null;
    // Check system preference if no theme saved
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      setThemeMode(savedTheme);
    } else if (prefersDark) {
        setThemeMode('dark');
    }
  }, []);

  // Update local storage and body class when theme changes
  useEffect(() => {
    localStorage.setItem('appTheme', themeMode);
    // Optional: Add class to body for global non-styled-component styling
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(themeMode === 'light' ? 'light-theme' : 'dark-theme');
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Determine the current theme object based on the mode
  const currentTheme: DefaultTheme = useMemo(() => 
    themeMode === 'light' ? lightTheme : darkTheme,
    [themeMode]
  );

  const contextValue = useMemo(() => ({ themeMode, toggleTheme }), [themeMode, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={currentTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within an AppThemeProvider');
  }
  return context;
}; 