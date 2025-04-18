import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define more specific types for filters, sort, etc. as needed
interface FilterCriteria { [key: string]: any; }
interface SortCriteria { field: string; direction: 'asc' | 'desc'; }
interface PaginationState { page: number; limit: number; }
interface LastSearchState {
  filters: FilterCriteria;
  sort: SortCriteria | null;
  pagination: PaginationState;
}

interface SearchState {
  filters: FilterCriteria;
  sort: SortCriteria | null;
  pagination: PaginationState;
  lastSearch: LastSearchState | null; // To store the last applied search for persistence
}

// Load initial lastSearch from localStorage here (or handle in store setup)
// const initialLastSearch = JSON.parse(localStorage.getItem('lastSearch') || 'null');

const initialState: SearchState = {
  filters: {},
  sort: null,
  pagination: {
    page: 1,
    limit: 25, // Or 10, or your preferred default
  },
  lastSearch: null, // Or initialize similarly to pagination
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<FilterCriteria>) => {
      state.filters = action.payload;
      state.pagination.page = 1; // Reset page when filters change
    },
    updateFilter: (state, action: PayloadAction<{ key: string; value: any }>) => {
      state.filters = { ...state.filters, [action.payload.key]: action.payload.value };
      state.pagination.page = 1; // Reset page when a filter changes
    },
    setSort: (state, action: PayloadAction<SortCriteria | null>) => {
      state.sort = action.payload;
      state.pagination.page = 1; // Reset page when sort changes
    },
    setPagination: (state, action: PayloadAction<{ page: number; limit: number }>) => {
      state.pagination = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1; // Reset to page 1 when limit changes
    },
    setLastSearch: (state) => {
        // Save the current search state for persistence
        state.lastSearch = {
            filters: state.filters,
            sort: state.sort,
            pagination: state.pagination // Store current pagination too
        };
    },
    setInitialLastSearch: (state, action: PayloadAction<SearchState['lastSearch']>) => {
        state.lastSearch = action.payload;
        // Also restore the active search state from the loaded lastSearch
        if (action.payload) {
            state.filters = action.payload.filters ?? {};
            state.sort = action.payload.sort ?? null;
            state.pagination = action.payload.pagination ?? { page: 1, limit: 25 }; // Use default if missing
        }
    },
    resetSearch: (state) => {
        state.filters = {};
        state.sort = null;
        state.pagination = { page: 1, limit: 10 };
        // Optionally reset lastSearch too, or keep it
        // state.lastSearch = null;
    }
  },
});

export const {
  setFilters,
  updateFilter,
  setSort,
  setPagination,
  setPage,
  setLimit,
  setLastSearch,
  setInitialLastSearch,
  resetSearch
} = searchSlice.actions;

export default searchSlice.reducer; 