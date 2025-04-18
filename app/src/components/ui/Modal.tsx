import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled, { keyframes } from 'styled-components';

// --- Keyframes for animations ---
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateY(-30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// --- Styled Components ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6); // Darker overlay
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
  overflow-y: auto; // Allow scrolling on the overlay if content overflows
  padding: 20px; // Padding for smaller screens
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  width: 90%; // Responsive width
  max-width: 800px; // Max width
  max-height: 90vh; // Max height
  overflow-y: auto; // Scroll within the modal content if needed
  animation: ${slideIn} 0.3s ease-out;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  line-height: 1;
  padding: 5px;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

// --- Component Props ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

// --- Modal Component ---
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    } else {
      document.removeEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Close modal when clicking outside the content area
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Use createPortal to render the modal outside the main component hierarchy
  return ReactDOM.createPortal(
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent ref={modalRef}>
        <CloseButton onClick={onClose} aria-label="Close modal">&times;</CloseButton>
        {title && <h2>{title}</h2>} {/* Optional title */}
        {children}
      </ModalContent>
    </ModalOverlay>,
    document.body // Append to the body element
  );
};

export default Modal; 