import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
}

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

  // Basic pagination logic (can be enhanced with page number links)
  return (
    <div className="flex items-center justify-between flex-wrap gap-y-2 mt-4">
      <div className="hidden sm:block">
        <span className="text-sm text-gray-700">
          Showing{' '}
          <span className="font-semibold text-gray-900">
            {totalItems === 0 ? 0 : (currentPage - 1) * 10 + 1}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-gray-900">
            {Math.min(currentPage * 10, totalItems)}
          </span>{' '}
          of <span className="font-semibold text-gray-900">{totalItems}</span> Results
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 hover:bg-gray-100"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 hover:bg-gray-100"
        >
          Next
        </button>
      </div>
    </div>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination; 