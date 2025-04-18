import { DefaultTheme } from 'styled-components';

const theme: DefaultTheme = {
  colors: {
    primary: '#0070f3',
    secondary: '#1a1a1a',
    accent: '#ff4081',
    background: '#ffffff',
    text: '#333333',
    textLight: '#f0f0f0',
    border: '#eaeaea',
    error: '#f44336',
    success: '#4caf50',
  },
  typography: {
    fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      md: '1rem',     // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      xxl: '1.5rem', // 24px
      h1: '2.5rem',  // 40px
      h2: '2rem',    // 32px
      h3: '1.75rem', // 28px
      h4: '1.5rem',  // 24px
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700,
    },
    lineHeight: {
      body: 1.6,
      heading: 1.2,
    }
  },
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem',  // 8px
    md: '1rem',    // 16px
    lg: '1.5rem',  // 24px
    xl: '2rem',    // 32px
    xxl: '3rem',   // 48px
  },
  breakpoints: {
    xs: '0px',      // Mobile first
    sm: '600px',    // Small tablets
    md: '960px',    // Tablets
    lg: '1280px',   // Laptops/Desktops
    xl: '1920px',   // Large desktops
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    round: '50%',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    md: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    lg: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
  },
  zIndex: {
    modal: 1000,
    tooltip: 1100,
    header: 500,
  }
};

// Helper for media queries
export const media = {
  up: (breakpoint: keyof DefaultTheme['breakpoints']) =>
    `@media (min-width: ${theme.breakpoints[breakpoint]})`,
  down: (breakpoint: keyof DefaultTheme['breakpoints']) => {
    // Find the breakpoint key
    const keys = Object.keys(theme.breakpoints) as Array<keyof DefaultTheme['breakpoints']>;
    const index = keys.indexOf(breakpoint);
    // Use the next smaller breakpoint as max-width, or 0 if it's the smallest
    const maxWidth = index > 0 ? `calc(${theme.breakpoints[keys[index]]} - 1px)` : '0px';
    // Avoid creating a media query for the smallest breakpoint 'xs'
    return index > 0 ? `@media (max-width: ${maxWidth})` : '';
  },
  between: (
    min: keyof DefaultTheme['breakpoints'],
    max: keyof DefaultTheme['breakpoints']
  ) => {
    const keys = Object.keys(theme.breakpoints) as Array<keyof DefaultTheme['breakpoints']>;
    const maxIndex = keys.indexOf(max);
    const maxWidth = maxIndex > 0 ? `calc(${theme.breakpoints[keys[maxIndex]]} - 1px)` : '0px';
    return `@media (min-width: ${theme.breakpoints[min]}) and (max-width: ${maxWidth})`;
  },
};

// Augment styled-components' DefaultTheme with our theme structure
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
      textLight: string;
      border: string;
      error: string;
      success: string;
    };
    typography: {
      fontFamily: string;
      fontSize: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        xxl: string;
        h1: string;
        h2: string;
        h3: string;
        h4: string;
      };
      fontWeight: {
        light: number;
        regular: number;
        medium: number;
        bold: number;
      };
      lineHeight: {
        body: number;
        heading: number;
      };
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    breakpoints: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    borderRadius: {
        sm: string;
        md: string;
        lg: string;
        round: string;
    };
    shadows: {
        sm: string;
        md: string;
        lg: string;
    };
    zIndex: {
      modal: number;
      tooltip: number;
      header: number;
    };
  }
}

export default theme; 