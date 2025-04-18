import React from 'react';
import styled from 'styled-components';

interface ItemsPerPageSelectorProps {
  itemsPerPage: number;
  onItemsPerPageChange: (size: number) => void;
}

const ITEMS_PER_PAGE_OPTIONS = [10, 50, 100];

const SelectorWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text};
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const ItemsPerPageSelector: React.FC<ItemsPerPageSelectorProps> = ({ 
  itemsPerPage, 
  onItemsPerPageChange 
}) => {

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onItemsPerPageChange(Number(event.target.value));
  };

  return (
    <SelectorWrapper>
      <Label htmlFor="itemsPerPageSelect">Items per page:</Label>
      {/* eslint-disable-next-line jsx-a11y/no-onchange -- Linter struggles with styled select */}
      <Select
        id="itemsPerPageSelect"
        value={itemsPerPage}
        onChange={handleSelectChange}
        aria-label="Select number of items per page"
      >
        {ITEMS_PER_PAGE_OPTIONS.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </Select>
    </SelectorWrapper>
  );
};

export default ItemsPerPageSelector; 