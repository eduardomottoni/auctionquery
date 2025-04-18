import searchReducer, {
    setFilters,
    updateFilter,
    setSort,
    setPage,
    setLimit,
    setLastSearch,
    resetSearch,
    // Add other actions if needed
  } from './searchSlice';
  
  // Define a type for the initial state if not directly exported from slice
  // import { SearchState } from './searchSlice';
  
  describe('search slice', () => {
    const initialState = {
      filters: {},
      sort: null,
      pagination: {
        page: 1,
        limit: 25,
      },
      lastSearch: null,
    };
  
    it('should handle initial state', () => {
      expect(searchReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  
    it('should handle setFilters', () => {
      const actual = searchReducer(initialState, setFilters({ make: 'Toyota' }));
      expect(actual.filters).toEqual({ make: 'Toyota' });
      expect(actual.pagination.page).toBe(1); // Should reset page
    });
  
    it('should handle updateFilter', () => {
      const stateWithFilter = { ...initialState, filters: { make: 'Toyota' } };
      const actual = searchReducer(stateWithFilter, updateFilter({ key: 'model', value: 'Camry' }));
      expect(actual.filters).toEqual({ make: 'Toyota', model: 'Camry' });
      expect(actual.pagination.page).toBe(1); // Should reset page
    });
  
    it('should handle setSort', () => {
      const sortCriteria = { field: 'year', direction: 'desc' as const };
      const actual = searchReducer(initialState, setSort(sortCriteria));
      expect(actual.sort).toEqual(sortCriteria);
      expect(actual.pagination.page).toBe(1); // Should reset page
    });
  
    it('should handle setPage', () => {
      const actual = searchReducer(initialState, setPage(3));
      expect(actual.pagination.page).toBe(3);
    });
  
    it('should handle setLimit', () => {
      const actual = searchReducer(initialState, setLimit(50));
      expect(actual.pagination.limit).toBe(50);
      expect(actual.pagination.page).toBe(1); // Should reset page
    });
  
    it('should handle setLastSearch', () => {
        const currentState = { ...initialState, filters: { year: 2022 }, pagination: { page: 2, limit: 10 } };
        const actual = searchReducer(currentState, setLastSearch());
        expect(actual.lastSearch).toEqual({
            filters: currentState.filters,
            sort: currentState.sort,
            pagination: currentState.pagination
        });
    });

    it('should handle resetSearch', () => {
        const currentState = { 
            filters: { make: 'Honda' }, 
            sort: { field: 'price', direction: 'asc' as const }, 
            pagination: { page: 5, limit: 50 }, 
            lastSearch: null
        };
        const actual = searchReducer(currentState, resetSearch());
        expect(actual.filters).toEqual({});
        expect(actual.sort).toBeNull();
        expect(actual.pagination).toEqual({ page: 1, limit: 10 }); // Resets to defaults
    });

    // Add more tests for other actions like setInitialLastSearch
  });
 