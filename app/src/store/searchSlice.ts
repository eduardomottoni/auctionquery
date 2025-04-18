import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define more specific types for filters, sort, etc. as needed
interface FilterCriteria { [key: string]: any; }
interface SortCriteria { field: string; direction: 'asc' | 'desc'; }
interface PaginationState { page: number; limit: number; totalItems?: number; }
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
  pagination: { page: 1, limit: 10 }, // Default pagination
  lastSearch: null, // Load initialLastSearch here if doing it this way
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
    setPagination: (state, action: PayloadAction<Partial<PaginationState>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setLastSearch: (state) => {
        // Save the current search state for persistence
        state.lastSearch = {
            filters: state.filters,
            sort: state.sort,
            pagination: state.pagination // Store current pagination too
        };
    },
    setInitialLastSearch: (state, action: PayloadAction<LastSearchState | null>) => {
        state.lastSearch = action.payload;
        // Optionally restore filters/sort/pagination from lastSearch if needed
        // if (action.payload) {
        //     state.filters = action.payload.filters;
        //     state.sort = action.payload.sort;
        //     state.pagination = action.payload.pagination;
        // }
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
  setLastSearch,
  setInitialLastSearch,
  resetSearch
} = searchSlice.actions;

export default searchSlice.reducer; 