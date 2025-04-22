import React from 'react';
import styled from 'styled-components';

interface FavoritesToggleProps {
  showOnlyFavorites: boolean;
  onToggle: (showOnlyFavorites: boolean) => void;
}

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  cursor: pointer;
`;

const Checkbox = styled.input`
  cursor: pointer;
  width: 18px;
  height: 18px;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

const StarIcon = styled.span`
  color: ${({ theme }) => theme.colors.accent};
  font-size: 1.1rem;
  margin-right: ${({ theme }) => theme.spacing.xs};
`;

const FavoritesToggle: React.FC<FavoritesToggleProps> = ({ 
  showOnlyFavorites, 
  onToggle 
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onToggle(event.target.checked);
  };

  return (
    <ToggleWrapper>
      <Label htmlFor="favorites-toggle">
        <Checkbox
          id="favorites-toggle"
          type="checkbox"
          checked={showOnlyFavorites}
          onChange={handleChange}
          aria-label="Show only favorite vehicles"
        />
        <StarIcon>★</StarIcon>
        Show only favorites
      </Label>
    </ToggleWrapper>
  );
};

export default FavoritesToggle; 