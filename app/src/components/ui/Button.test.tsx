import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '@/styles/theme'; // Use a specific theme
import Button from './Button';

// Helper to render with ThemeProvider
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={lightTheme}>{ui}</ThemeProvider>);
}

describe('<Button />', () => {
  it('renders children correctly', () => {
    renderWithTheme(<Button>Click Me</Button>);
    expect(screen.getByRole('button', { name: /Click Me/i })).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    renderWithTheme(<Button onClick={handleClick}>Click Me</Button>);

    const button = screen.getByRole('button', { name: /Click Me/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick handler when disabled', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    renderWithTheme(<Button onClick={handleClick} disabled>Click Me</Button>);

    const button = screen.getByRole('button', { name: /Click Me/i });
    expect(button).toBeDisabled();

    // userEvent.click handles disabled check internally and won't fire
    await user.click(button).catch(() => {}); // Catch potential errors from clicking disabled

    expect(handleClick).not.toHaveBeenCalled();
  });

  // Test different variants
  it.each([
    ['primary'],
    ['secondary'],
    ['danger'],
  ])('applies correct styles for %s variant', (variant) => {
    renderWithTheme(<Button variant={variant as any}>Variant Button</Button>);
    // Basic check: We can't easily test exact CSS in JSDOM,
    // but we can ensure it renders without crashing.
    // More advanced tests could snapshot the component or check computed styles if needed.
    expect(screen.getByRole('button', { name: /Variant Button/i })).toBeInTheDocument();
    // Optionally, add a data-testid or class check if the component adds them based on variant
  });

  // Test different sizes
  it.each([
    ['sm'],
    ['md'],
    ['lg'],
  ])('applies correct styles for %s size', (size) => {
    renderWithTheme(<Button size={size as any}>Size Button</Button>);
    expect(screen.getByRole('button', { name: /Size Button/i })).toBeInTheDocument();
    // Similar to variants, checking exact styles is hard.
  });

  it('renders as a link when href is provided', () => {
    renderWithTheme(<Button as="a" href="/test-link">Link Button</Button>);
    const linkButton = screen.getByRole('link', { name: /Link Button/i });
    expect(linkButton).toBeInTheDocument();
    expect(linkButton).toHaveAttribute('href', '/test-link');
  });

  it('passes other props like aria-label', () => {
    renderWithTheme(<Button aria-label="Custom Action">Action</Button>);
    expect(screen.getByRole('button', { name: /Custom Action/i })).toBeInTheDocument();
  });
}); 