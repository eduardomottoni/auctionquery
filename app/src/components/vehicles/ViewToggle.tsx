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

const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  return (
    <ToggleContainer>
      <Button
        variant={currentView === 'grid' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grid')}
        aria-label="Grid view"
        aria-pressed={currentView === 'grid'}
      >
        {/* You can replace text with icons */}
        Grid
      </Button>
      {/* Wrap List button */}
      <ListButtonWrapper>
      <Button
        variant={currentView === 'list' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        aria-label="List view"
        aria-pressed={currentView === 'list'}
      >
        {/* You can replace text with icons */}
        List
      </Button>
      </ListButtonWrapper>
    </ToggleContainer>
  );
};

export default ViewToggle; 