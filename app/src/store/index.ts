import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import vehiclesReducer from './vehiclesSlice';
import searchReducer from './searchSlice';
import { throttle } from 'lodash'; // Using lodash for throttling save operations

// --- Persistence Setup ---

const FAVORITES_KEY = 'favorites';
const LAST_SEARCH_KEY = 'lastSearch';

// Function to load state from localStorage
const loadState = () => {
  try {
    const serializedFavorites = localStorage.getItem(FAVORITES_KEY);
    const serializedLastSearch = localStorage.getItem(LAST_SEARCH_KEY);

    const favorites = serializedFavorites ? JSON.parse(serializedFavorites) : undefined;
    const lastSearch = serializedLastSearch ? JSON.parse(serializedLastSearch) : undefined;

    // Return structure matching the store shape for preloadedState
    let preloadedState = {};
    if (favorites !== undefined) {
        preloadedState = { ...preloadedState, vehicles: { favorites } };
    }
    if (lastSearch !== undefined) {
        // Ensure lastSearch is correctly nested under the search slice
        preloadedState = { ...preloadedState, search: { lastSearch } };
    }

    return preloadedState;

  } catch (err) {
    console.error("Could not load state from localStorage", err);
    return undefined; // Return undefined if loading fails
  }
};

// Function to save specific parts of the state to localStorage
const saveState = (state: RootState) => {
  try {
    const serializedFavorites = JSON.stringify(state.vehicles.favorites);
    const serializedLastSearch = JSON.stringify(state.search.lastSearch);
    localStorage.setItem(FAVORITES_KEY, serializedFavorites);
    localStorage.setItem(LAST_SEARCH_KEY, serializedLastSearch);
  } catch (err) {
    console.error("Could not save state to localStorage", err);
  }
};

const preloadedState = loadState();

// --------------------------------------

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vehicles: vehiclesReducer,
    search: searchReducer,
  },
  preloadedState,
});

// --- Store Subscription for Persistence ---
// Throttle save operations to avoid excessive localStorage writes (e.g., max once per second)
store.subscribe(throttle(() => {
  const state = store.getState();
  saveState({
      vehicles: { favorites: state.vehicles.favorites }, // Only pass relevant part
      search: { lastSearch: state.search.lastSearch } // Only pass relevant part
  } as RootState); // Cast to RootState, acknowledging other parts are missing
}, 1000));
// -----------------------------------------------------

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Define typed hooks
import { TypedUseSelectorHook, useDispatch as useReduxDispatch, useSelector as useReduxSelector } from 'react-redux';

export const useDispatch: () => AppDispatch = useReduxDispatch;
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector; 