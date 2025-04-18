import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '.'; // Import RootState for selector typing
import { fetchVehicles as fetchVehiclesService } from '@/services/vehicleService';
import { createSelector } from 'reselect';

// TODO: Define a proper Vehicle type later, perhaps in @/types
interface Vehicle {
  id: number | string;
  [key: string]: any; // Placeholder for other vehicle properties
}

interface VehiclesState {
  allVehicles: Vehicle[];
  favorites: (number | string)[]; // Array of vehicle IDs
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Load initial favorites from localStorage here (or handle in store setup)
// const initialFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');

const initialState: VehiclesState = {
  allVehicles: [],
  favorites: [], // Load initialFavorites here if doing it this way
  status: 'idle',
  error: null,
};

// Async thunk for fetching vehicles
export const fetchVehicles = createAsyncThunk(
  'vehicles/fetchVehicles',
  async (_, { rejectWithValue }) => {
    try {
      const vehicles = await fetchVehiclesService();
      return vehicles;
    } catch (error) {
      if (error instanceof Error) {
          return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred while fetching vehicles');
    }
  }
);

const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    setVehiclesLoading: (state) => {
      state.status = 'loading';
    },
    setVehiclesSucceeded: (state, action: PayloadAction<Vehicle[]>) => {
      state.allVehicles = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
    setVehiclesFailed: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    addFavorite: (state, action: PayloadAction<number | string>) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<number | string>) => {
      state.favorites = state.favorites.filter(id => id !== action.payload);
    },
    setInitialFavorites: (state, action: PayloadAction<(number | string)[]>) => {
        state.favorites = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action: PayloadAction<Vehicle[]>) => {
        state.status = 'succeeded';
        state.allVehicles = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const {
  setVehiclesLoading,
  setVehiclesSucceeded,
  setVehiclesFailed,
  addFavorite,
  removeFavorite,
  setInitialFavorites
} = vehiclesSlice.actions;

// --- Selectors --- 

// Basic selectors
export const selectAllVehicles = (state: RootState) => state.vehicles.allVehicles;
export const selectVehiclesStatus = (state: RootState) => state.vehicles.status;
export const selectVehiclesError = (state: RootState) => state.vehicles.error;
export const selectFavorites = (state: RootState) => state.vehicles.favorites;

// Selectors from search slice needed for filtering/sorting/pagination
const selectSearchFilters = (state: RootState) => state.search.filters;
const selectSearchSort = (state: RootState) => state.search.sort;
const selectSearchPagination = (state: RootState) => state.search.pagination;

// Memoized selector for filtered vehicles
export const selectFilteredVehicles = createSelector(
  [selectAllVehicles, selectSearchFilters],
  (vehicles, filters) => {
    if (!vehicles || vehicles.length === 0) return [];
    if (Object.keys(filters).length === 0) return vehicles; // No filters applied

    // Basic filtering logic (extend as needed based on actual filter types)
    return vehicles.filter(vehicle => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === '' || value === null || value === undefined) return true; // Ignore empty filters
        
        // Basic case-insensitive string search for make/model (example)
        if ((key === 'make' || key === 'model') && typeof value === 'string') {
          return vehicle[key]?.toLowerCase().includes(value.toLowerCase());
        }
        // Exact match for year (example)
        if (key === 'year' && typeof value === 'number') {
          return vehicle[key] === value;
        }
        // Range for price (example - assuming filter value is { min: number, max: number })
        if (key === 'price' && typeof value === 'object' && value !== null) {
          const { min, max } = value;
          const price = vehicle.price;
          if (min !== undefined && price < min) return false;
          if (max !== undefined && price > max) return false;
          return true;
        }
        // Default: check if property exists and matches loosely
        return vehicle.hasOwnProperty(key) && vehicle[key] == value;
      });
    });
  }
);

// Memoized selector for sorted vehicles
export const selectSortedVehicles = createSelector(
  [selectFilteredVehicles, selectSearchSort],
  (vehicles, sort) => {
    if (!sort) return vehicles; // No sorting applied

    const sortedVehicles = [...vehicles]; // Create a mutable copy
    sortedVehicles.sort((a, b) => {
      const fieldA = a[sort.field];
      const fieldB = b[sort.field];

      let comparison = 0;
      if (fieldA > fieldB) {
        comparison = 1;
      } else if (fieldA < fieldB) {
        comparison = -1;
      }

      return sort.direction === 'desc' ? comparison * -1 : comparison;
    });

    return sortedVehicles;
  }
);

// Memoized selector for paginated vehicles
export const selectPaginatedVehicles = createSelector(
  [selectSortedVehicles, selectSearchPagination],
  (vehicles, pagination) => {
    const { page, limit } = pagination;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return vehicles.slice(startIndex, endIndex);
  }
);

// Selector for total count of filtered items (for pagination controls)
export const selectFilteredVehiclesCount = createSelector(
  [selectFilteredVehicles],
  (vehicles) => vehicles.length
);

export default vehiclesSlice.reducer; 