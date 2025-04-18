import React from 'react';
import styled from 'styled-components';
import Button from '@/components/ui/Button'; // Use our reusable button

export type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const ToggleContainer = styled.div`
  display: flex;
  justify-content: flex-end; // Position toggle to the right
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  return (
    <ToggleContainer>
      <Button
        variant={currentView === 'grid' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grid')}
        style={{ marginRight: '8px' }} // Add spacing between buttons
        aria-label="Grid view"
        aria-pressed={currentView === 'grid'}
      >
        {/* You can replace text with icons */} ️
        Grid
      </Button>
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
    </ToggleContainer>
  );
};

export default ViewToggle; 