import React from 'react';
import styled from 'styled-components';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
}

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

const PageInfo = styled.div`
  @media (max-width: 640px) {
    display: none;
  }
`;

const PageControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 6px 12px;
  border: 1px solid ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.colors.buttonPrimaryText : theme.colors.text};
  font-weight: ${({ $active }) => $active ? 'bold' : 'normal'};
  cursor: pointer;
  
  &:hover {
    background-color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.background};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageEllipsis = styled.span`
  padding: 6px 12px;
  color: ${({ theme }) => theme.colors.text};
`;

const Pagination: React.FC<PaginationProps> = React.memo(({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show page 1
    pageNumbers.push(1);
    
    // Calculate range of visible pages (2 before and 2 after current)
    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);
    
    // If we're at the start, show more pages after
    if (currentPage < 4) {
      endPage = Math.min(totalPages - 1, 5);
    }
    
    // If we're at the end, show more pages before
    if (currentPage > totalPages - 3) {
      startPage = Math.max(2, totalPages - 4);
    }
    
    // Add ellipsis after page 1 if needed
    if (startPage > 2) {
      pageNumbers.push('ellipsis1');
    }
    
    // Add pages in the middle
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push('ellipsis2');
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  if (totalPages <= 1) return null;

  return (
    <PaginationContainer data-testid="pagination">
      <PageInfo>
        <span>
          Showing{' '}
          <strong>
            {totalItems === 0 ? 0 : (currentPage - 1) * 10 + 1}
          </strong>{' '}
          to{' '}
          <strong>
            {Math.min(currentPage * 10, totalItems)}
          </strong>{' '}
          of <strong>{totalItems}</strong> Results
        </span>
      </PageInfo>
      <PageControls>
        <PageButton 
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="Go to first page"
        >
          &laquo;
        </PageButton>
        
        <PageButton 
          onClick={handlePrevious} 
          disabled={currentPage === 1}
          aria-label="Go to previous page"
          data-testid="prev-page"
        >
          &lsaquo;
        </PageButton>
        
        {getPageNumbers().map((page, index) => {
          if (page === 'ellipsis1' || page === 'ellipsis2') {
            return <PageEllipsis key={`${page}`}>...</PageEllipsis>;
          }
          
          return (
            <PageButton
              key={`page-${page}`}
              $active={currentPage === page}
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </PageButton>
          );
        })}
        
        <PageButton 
          onClick={handleNext} 
          disabled={currentPage === totalPages || totalPages === 0}
          aria-label="Go to next page"
          data-testid="next-page"
        >
          &rsaquo;
        </PageButton>
        
        <PageButton 
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Go to last page"
        >
          &raquo;
        </PageButton>
      </PageControls>
    </PaginationContainer>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination; 