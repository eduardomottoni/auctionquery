import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (size: number) => void;
  totalItems: number;
}

const ITEMS_PER_PAGE_OPTIONS = [10, 50, 100];

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
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

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onItemsPerPageChange(Number(event.target.value));
  };

  // Basic pagination logic (can be enhanced with page number links)
  return (
    <div className="flex items-center justify-between flex-wrap gap-y-2 mt-4">
      <div className="hidden sm:block">
        <span className="text-sm text-gray-700">
          Showing{' '}
          <span className="font-semibold text-gray-900">
            {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-gray-900">
            {Math.min(currentPage * itemsPerPage, totalItems)}
          </span>{' '}
          of <span className="font-semibold text-gray-900">{totalItems}</span> Results
        </span>
      </div>
      <div className="flex items-center space-x-2">
         <label htmlFor="itemsPerPage" className="text-sm text-gray-700">Items per page:</label>
         <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
         >
            {ITEMS_PER_PAGE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                    {size}
                </option>
            ))}
         </select>
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
};

export default Pagination; 