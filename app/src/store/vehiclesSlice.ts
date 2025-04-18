import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.'; // Import RootState for selector typing

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
});

export const {
  setVehiclesLoading,
  setVehiclesSucceeded,
  setVehiclesFailed,
  addFavorite,
  removeFavorite,
  setInitialFavorites
} = vehiclesSlice.actions;

// Selector for favorites (example)
export const selectFavorites = (state: RootState) => state.vehicles.favorites;

export default vehiclesSlice.reducer; 