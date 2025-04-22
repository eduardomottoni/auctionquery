import React from 'react';
import styled from 'styled-components';
import Button from '@/components/ui/Button'; // Use our reusable button
import { media } from '@/styles/theme'; // Import media helper

export type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const ToggleContainer = styled.div`
  display: flex;
  justify-content: flex-end; // Position toggle to the right
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  gap: ${({ theme }) => theme.spacing.sm}; // Add gap instead of margin
`;

// Wrapper to control visibility of List button
const ListButtonWrapper = styled.div`
  ${media.down('sm')} { // Hide on small screens and below
    display: none;
  }
`;

const ToggleButton = styled.button<{ active: boolean }>`
  background-color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.background};
  color: ${({ theme, active }) => active ? theme.colors.textLight : theme.colors.text};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.border};
  }
`;

const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  return (
    <ToggleContainer data-testid="view-toggle">
      <ToggleButton 
        onClick={() => onViewChange('grid')} 
        active={currentView === 'grid'}
        data-testid="grid-icon"
        aria-label="Grid View"
      >
        Grid
      </ToggleButton>
      <ListButtonWrapper>
        <ToggleButton 
          onClick={() => onViewChange('list')} 
          active={currentView === 'list'}
          data-testid="list-icon"
          aria-label="List View"
        >
          List
        </ToggleButton>
      </ListButtonWrapper>
    </ToggleContainer>
  );
};

export default ViewToggle; 