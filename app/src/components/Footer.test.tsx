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
    // Update regex to match the actual text
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear}.*Constellation Auction`, 'i'))).toBeInTheDocument();
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
  });

  // Add more tests if Footer has links or other interactive elements
}); 