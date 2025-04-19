import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';
import { ThemeProvider } from 'styled-components';
import { lightTheme as theme } from '@/styles/theme'; // Use a specific theme

// Helper function to render with providers
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe('<Modal />', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    // Mock portal rendering - append div#modal-root to body if it doesn't exist
    // Or ensure tests run in an environment where document.body is available
    // For simplicity, we assume document.body exists
  });

  it('does not render when isOpen is false', () => {
    renderWithTheme(<Modal isOpen={false} onClose={mockOnClose} title="Test Modal">Content</Modal>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders correctly when isOpen is true', () => {
    renderWithTheme(<Modal isOpen={true} onClose={mockOnClose} title="Test Modal"><div>Modal Content</div></Modal>);

    // Check for elements by role, title, and content
    expect(screen.getByRole('dialog')).toBeInTheDocument(); // Modal content area often has dialog role implicitly
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
    expect(screen.getByLabelText(/Close modal/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<Modal isOpen={true} onClose={mockOnClose}>Content</Modal>);

    await user.click(screen.getByLabelText(/Close modal/i));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    renderWithTheme(<Modal isOpen={true} onClose={mockOnClose}>Content</Modal>);

    // Simulate Escape key press on the document
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<Modal isOpen={true} onClose={mockOnClose}><div>Content</div></Modal>);

    // The overlay is typically the parent element
    // Clicking the body or an element outside the modal content should trigger it
    // Be careful with targeting; getByRole('dialog') targets the content
    // We need to click the overlay itself. Let's click the body as an approximation.
    // await user.click(document.body);
    // Click the overlay using its test id
    await user.click(screen.getByTestId('modal-overlay'));

    // Check if onClose was called. This might be flaky depending on exact implementation.
    // A better approach might be adding a test-id to the overlay.
    // For now, let's assume clicking body outside the content works.
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

   it('does NOT call onClose when modal content is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<Modal isOpen={true} onClose={mockOnClose}><div>Modal Content Click Test</div></Modal>);

    await user.click(screen.getByText('Modal Content Click Test'));
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  // Add tests for focus management if implemented
}); 