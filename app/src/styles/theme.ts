import { DefaultTheme } from 'styled-components';

// Define color palettes
const lightColors = {
  primary: '#0070f3',
  secondary: '#1a1a1a', // Used for headings/dark text on light bg
  accent: '#ff4081',
  background: '#ffffff',
  text: '#333333',
  textLight: '#666666',
  border: '#f0f0f0',
  error: '#f44336',
  success: '#4caf50',
  buttonPrimaryText: '#ffffff', // White text for light mode primary button
};

const darkColors = {
  primary: '#58a6ff', // Lighter blue for dark bg
  secondary: '#c9d1d9', // Light text for dark bg
  accent: '#f78166',
  background: '#0d1117', // Dark background
  text: '#e6edf3', // Main text color for dark bg
  textLight: '#8b949e', // Lighter text for sub-details on dark bg
  border: '#30363d', // Darker border
  error: '#f85149',
  success: '#56d364',
  buttonPrimaryText: '#0d1117', // Dark text (matching dark bg) for dark mode primary button
};

// Define the structure for the theme object
const baseTheme = {
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
      md: '6px',
      lg: '8px',
      round: '50%',
    },
    shadows: {
      sm: '0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.08)',
      md: '0 4px 8px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 20px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.08)',
    },
    zIndex: {
      modal: 1000,
      tooltip: 1100,
      header: 500,
    }
};

// Create specific light and dark themes by merging colors
export const lightTheme: DefaultTheme = { ...baseTheme, colors: lightColors };
export const darkTheme: DefaultTheme = { ...baseTheme, colors: darkColors };

// Media query helper (remains the same)
export const media = {
  up: (breakpoint: keyof DefaultTheme['breakpoints']) =>
    `@media (min-width: ${baseTheme.breakpoints[breakpoint]})`,
  down: (breakpoint: keyof DefaultTheme['breakpoints']) => {
    const keys = Object.keys(baseTheme.breakpoints) as Array<keyof DefaultTheme['breakpoints']>;
    const index = keys.indexOf(breakpoint);
    const maxWidth = index > 0 ? `calc(${baseTheme.breakpoints[keys[index]]} - 1px)` : '0px';
    return index > 0 ? `@media (max-width: ${maxWidth})` : '';
  },
  between: (
    min: keyof DefaultTheme['breakpoints'],
    max: keyof DefaultTheme['breakpoints']
  ) => {
    const keys = Object.keys(baseTheme.breakpoints) as Array<keyof DefaultTheme['breakpoints']>;
    const maxIndex = keys.indexOf(max);
    const maxWidth = maxIndex > 0 ? `calc(${baseTheme.breakpoints[keys[maxIndex]]} - 1px)` : '0px';
    return `@media (min-width: ${baseTheme.breakpoints[min]}) and (max-width: ${maxWidth})`;
  },
};

// Update ColorType definition
type ColorType = typeof lightColors & typeof darkColors;

declare module 'styled-components' {
  export interface DefaultTheme extends Omit<typeof baseTheme, 'colors'> {
    colors: ColorType;
  }
}

// Default export can be one of the themes, or leave it out if managed by provider
// export default lightTheme; 