import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '.'; // Import RootState for selector typing
import { fetchVehicles as fetchVehiclesService } from '@/services/vehicleService';
import { createSelector } from 'reselect';
import { Vehicle } from '@/types/vehicle'; // Import the central type definition

// TODO: Define a proper Vehicle type later, perhaps in @/types
// interface Vehicle {
//   id: number | string;
//   [key: string]: any; // Placeholder for other vehicle properties
// }

// Export the state interface
export interface VehiclesState {
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

// Async thunk for fetching vehicles - Ensure return type matches imported Vehicle
export const fetchVehicles = createAsyncThunk<Vehicle[], void, { rejectValue: string }>(
  'vehicles/fetchVehicles',
  async (_, { rejectWithValue }) => {
    try {
      const vehicles: Vehicle[] = await fetchVehiclesService(); // Explicitly type the result
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
        // Assign sequential IDs to the fetched vehicles
        state.allVehicles = action.payload.map((vehicle, index) => ({
          ...vehicle,
          id: `vehicle-${index}` // Create a unique string ID (e.g., "vehicle-0", "vehicle-1")
        }));
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
export const selectAllVehicles = (state: RootState): Vehicle[] => state.vehicles.allVehicles;
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
  (vehicles: Vehicle[], filters): Vehicle[] => {
    if (!vehicles || vehicles.length === 0) return [];
    if (Object.keys(filters).length === 0) return vehicles;

    return vehicles.filter(vehicle => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === '' || value === null || value === undefined) return true;

        let vehicleValue: any;

        // --- Handle Top Level Fields ---
        if (key === 'make' || key === 'model' || key === 'engineSize' || key === 'fuel' || key === 'year' || key === 'mileage' || key === 'startingBid') {
           if (!(key in vehicle)) return false;
           vehicleValue = vehicle[key as keyof Vehicle];
        }
        // --- Handle Nested Specification Fields ---
        else if (key === 'vehicleType' || key === 'colour' || key === 'transmission' || key === 'numberOfDoors' || key === 'co2Emissions' || key === 'noxEmissions' || key === 'numberOfKeys') {
            if (!('specification' in vehicle.details) || !(key in vehicle.details.specification)) return false;
            vehicleValue = vehicle.details.specification[key as keyof Vehicle['details']['specification']];
        }
        // --- Handle Nested Ownership Fields ---
        else if (key === 'logBook' || key === 'numberOfOwners' || key === 'dateOfRegistration') {
            if (!('ownership' in vehicle.details) || !(key in vehicle.details.ownership)) return false;
            vehicleValue = vehicle.details.ownership[key as keyof Vehicle['details']['ownership']];
        }
        // --- Handle Equipment Array --- (Example: Check if equipment includes a specific string)
        else if (key === 'equipment' && typeof value === 'string') {
            if (!('equipment' in vehicle.details) || !Array.isArray(vehicle.details.equipment)) return false;
            return vehicle.details.equipment.some(equip => equip.toLowerCase().includes(value.toLowerCase()));
        }
         else {
            // Unknown filter key - treat as non-match or handle differently
            console.warn(`Unknown filter key: ${key}`);
            return false;
        }

        // --- Perform Comparison based on type ---
        if (typeof value === 'string' && typeof vehicleValue === 'string') {
          return vehicleValue.toLowerCase().includes(value.toLowerCase());
        }
        if (typeof value === 'number' && typeof vehicleValue === 'number') {
          // Exact match for numbers like year, numberOfDoors, numberOfOwners
          return vehicleValue === value;
        }
        if (key === 'startingBid' || key === 'mileage') { // Example Range filter for bid/mileage
            if (typeof value === 'object' && value !== null && typeof vehicleValue === 'number') {
                const { min, max } = value as { min?: number; max?: number };
                if (min !== undefined && vehicleValue < min) return false;
                if (max !== undefined && vehicleValue > max) return false;
                return true;
            }
        }
        // Fallback comparison (adjust as needed)
        return vehicleValue == value;
      });
    });
  }
);

// Memoized selector for sorted vehicles - FIX Date comparison placement
export const selectSortedVehicles = createSelector(
  [selectFilteredVehicles, selectSearchSort],
  (vehicles: Vehicle[], sort): Vehicle[] => {
    if (!sort) return vehicles;

    const sortedVehicles = [...vehicles];
    sortedVehicles.sort((a, b) => {
        let fieldA: any;
        let fieldB: any;
        const sortField = sort.field;

        // Access fields - Add access for dateOfRegistration
        if (sortField === 'make' || sortField === 'model' || sortField === 'year' || sortField === 'mileage' || sortField === 'startingBid' || sortField === 'auctionDateTime') {
            fieldA = a[sortField as keyof Vehicle];
            fieldB = b[sortField as keyof Vehicle];
        } else if (sortField === 'colour' || sortField === 'transmission') {
            fieldA = a.details?.specification?.[sortField as keyof Vehicle['details']['specification']];
            fieldB = b.details?.specification?.[sortField as keyof Vehicle['details']['specification']];
        } else if (sortField === 'dateOfRegistration') {
             fieldA = a.details?.ownership?.dateOfRegistration;
             fieldB = b.details?.ownership?.dateOfRegistration;
        } else {
            console.warn(`Unsupported sort field: ${sortField}`);
            return 0;
        }

      let comparison = 0;
      // Handle dates specifically HERE
      if (sortField === 'auctionDateTime' || sortField === 'dateOfRegistration') {
          // Convert to timestamp for reliable comparison, handle null/undefined
          const timeA = fieldA ? new Date(fieldA).getTime() : (sort.direction === 'asc' ? Infinity : -Infinity); // push nulls based on direction
          const timeB = fieldB ? new Date(fieldB).getTime() : (sort.direction === 'asc' ? Infinity : -Infinity);
          comparison = timeA - timeB;
      } else {
        // General comparison (nulls/undefined handled based on direction)
        const nullVal = sort.direction === 'asc' ? Infinity : -Infinity;
        const valA = (fieldA === undefined || fieldA === null) ? nullVal : fieldA;
        const valB = (fieldB === undefined || fieldB === null) ? nullVal : fieldB;

        if (valA > valB) comparison = 1;
        else if (valA < valB) comparison = -1;
      }

      // Apply direction AFTER comparison is determined
      return sort.direction === 'desc' ? comparison * -1 : comparison;
    });

    return sortedVehicles;
  }
);

// Memoized selector for paginated vehicles
export const selectPaginatedVehicles = createSelector(
  [selectSortedVehicles, selectSearchPagination],
  (vehicles: Vehicle[], pagination): Vehicle[] => {
    const { page, limit } = pagination;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return vehicles.slice(startIndex, endIndex);
  }
);

// Selector for total count of filtered items (for pagination controls)
export const selectFilteredVehiclesCount = createSelector(
  [selectFilteredVehicles],
  (vehicles: Vehicle[]) => vehicles.length
);

export default vehiclesSlice.reducer;

// --- Selectors for Favorites Page ---

// Memoized selector to get the full vehicle objects for favorite IDs
export const selectFavoriteVehicles = createSelector(
  [selectAllVehicles, selectFavorites],
  (allVehicles, favoriteIds): Vehicle[] => {
    const favoriteMap = new Set(favoriteIds);
    return allVehicles.filter(vehicle => favoriteMap.has(vehicle.id));
  }
);

// Memoized selector for filtered favorite vehicles
// Reuses the same filtering logic as selectFilteredVehicles but applies it to favorites
export const selectFilteredFavoriteVehicles = createSelector(
  [selectFavoriteVehicles, selectSearchFilters],
  (favoriteVehicles: Vehicle[], filters): Vehicle[] => {
    if (Object.keys(filters).length === 0) return favoriteVehicles;

    // Apply the same filter logic used in selectFilteredVehicles
    return favoriteVehicles.filter(vehicle => {
      // (Copy the filtering logic from selectFilteredVehicles here)
       return Object.entries(filters).every(([key, value]) => {
        if (value === '' || value === null || value === undefined) return true;

        let vehicleValue: any;

        // --- Handle Top Level Fields ---
        if (key === 'make' || key === 'model' || key === 'engineSize' || key === 'fuel' || key === 'year' || key === 'mileage' || key === 'startingBid') {
           if (!(key in vehicle)) return false;
           vehicleValue = vehicle[key as keyof Vehicle];
        }
        // --- Handle Nested Specification Fields ---
        else if (key === 'vehicleType' || key === 'colour' || key === 'transmission' || key === 'numberOfDoors' || key === 'co2Emissions' || key === 'noxEmissions' || key === 'numberOfKeys') {
            if (!('specification' in vehicle.details) || !(key in vehicle.details.specification)) return false;
            vehicleValue = vehicle.details.specification[key as keyof Vehicle['details']['specification']];
        }
        // --- Handle Nested Ownership Fields ---
        else if (key === 'logBook' || key === 'numberOfOwners' || key === 'dateOfRegistration') {
            if (!('ownership' in vehicle.details) || !(key in vehicle.details.ownership)) return false;
            vehicleValue = vehicle.details.ownership[key as keyof Vehicle['details']['ownership']];
        }
        // --- Handle Equipment Array ---
        else if (key === 'equipment' && typeof value === 'string') {
            if (!('equipment' in vehicle.details) || !Array.isArray(vehicle.details.equipment)) return false;
            return vehicle.details.equipment.some(equip => equip.toLowerCase().includes(value.toLowerCase()));
        }
         else {
            console.warn(`Unknown filter key: ${key}`);
            return false;
        }

        // --- Perform Comparison based on type ---
        if (typeof value === 'string' && typeof vehicleValue === 'string') {
          return vehicleValue.toLowerCase().includes(value.toLowerCase());
        }
        if (typeof value === 'number' && typeof vehicleValue === 'number') {
          return vehicleValue === value;
        }
        if (key === 'startingBid' || key === 'mileage') { // Range filter
            if (typeof value === 'object' && value !== null && typeof vehicleValue === 'number') {
                const { min, max } = value as { min?: number; max?: number };
                if (min !== undefined && vehicleValue < min) return false;
                if (max !== undefined && vehicleValue > max) return false;
                return true;
            }
        }
        return vehicleValue == value;
      });
    });
  }
);

// Memoized selector for sorted favorite vehicles
// Reuses the same sorting logic as selectSortedVehicles but applies it to filtered favorites
export const selectSortedFavoriteVehicles = createSelector(
  [selectFilteredFavoriteVehicles, selectSearchSort],
  (filteredFavoriteVehicles: Vehicle[], sort): Vehicle[] => {
    if (!sort) return filteredFavoriteVehicles;

    // Apply the same sort logic used in selectSortedVehicles
    const sortedVehicles = [...filteredFavoriteVehicles];
    sortedVehicles.sort((a, b) => {
      // (Copy the sorting logic from selectSortedVehicles here)
        let fieldA: any;
        let fieldB: any;
        const sortField = sort.field;

        if (sortField === 'make' || sortField === 'model' || sortField === 'year' || sortField === 'mileage' || sortField === 'startingBid' || sortField === 'auctionDateTime') {
            fieldA = a[sortField as keyof Vehicle];
            fieldB = b[sortField as keyof Vehicle];
        } else if (sortField === 'colour' || sortField === 'transmission') {
            fieldA = a.details?.specification?.[sortField as keyof Vehicle['details']['specification']];
            fieldB = b.details?.specification?.[sortField as keyof Vehicle['details']['specification']];
        } else if (sortField === 'dateOfRegistration') {
             fieldA = a.details?.ownership?.dateOfRegistration;
             fieldB = b.details?.ownership?.dateOfRegistration;
        } else {
            console.warn(`Unsupported sort field: ${sortField}`);
            return 0;
        }

      let comparison = 0;
      if (sortField === 'auctionDateTime' || sortField === 'dateOfRegistration') {
          const timeA = fieldA ? new Date(fieldA).getTime() : (sort.direction === 'asc' ? Infinity : -Infinity);
          const timeB = fieldB ? new Date(fieldB).getTime() : (sort.direction === 'asc' ? Infinity : -Infinity);
          comparison = timeA - timeB;
      } else {
        const nullVal = sort.direction === 'asc' ? Infinity : -Infinity;
        const valA = (fieldA === undefined || fieldA === null) ? nullVal : fieldA;
        const valB = (fieldB === undefined || fieldB === null) ? nullVal : fieldB;

        if (valA > valB) comparison = 1;
        else if (valA < valB) comparison = -1;
      }
      return sort.direction === 'desc' ? comparison * -1 : comparison;
    });
    return sortedVehicles;
  }
);

// Selector for the total count of *filtered* favorite vehicles
export const selectFilteredFavoriteVehiclesCount = createSelector(
  [selectFilteredFavoriteVehicles],
  (vehicles: Vehicle[]) => vehicles.length
);

// Selector for paginated favorite vehicles
export const selectPaginatedFavoriteVehicles = createSelector(
  [selectSortedFavoriteVehicles, selectSearchPagination],
  (vehicles: Vehicle[], pagination): Vehicle[] => {
    const { page, limit } = pagination;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return vehicles.slice(startIndex, endIndex);
  }
); 