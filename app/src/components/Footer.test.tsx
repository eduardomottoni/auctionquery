import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '@/styles/theme'; // Assuming lightTheme is appropriate

// Helper to wrap with ThemeProvider
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={lightTheme}>{ui}</ThemeProvider>);
}

describe('<Footer />', () => {
  it('renders copyright information', () => {
    renderWithTheme(<Footer />);
    // Check for text containing the current year and company name/relevant text
    // Using a regex to be flexible with spacing and exact wording
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear}.*Constellation \(Sandbox\)`, 'i'))).toBeInTheDocument();
    // Add more specific checks if needed, e.g., for links
  });

  // Add more tests if Footer has links or other interactive elements
}); 