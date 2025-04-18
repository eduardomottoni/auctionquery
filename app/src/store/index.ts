import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import vehiclesReducer from './vehiclesSlice';
import searchReducer from './searchSlice';
import { throttle } from 'lodash'; // Using lodash for throttling save operations

// --- Persistence Keys ---
const FAVORITES_KEY = 'favorites';
const LAST_SEARCH_KEY = 'lastSearch';

// Function to load state from localStorage (only call client-side)
export const loadPersistedState = () => {
  if (typeof window === 'undefined') {
    return { favorites: undefined, lastSearch: undefined }; // Return empty on server
  }
  try {
    const serializedFavorites = localStorage.getItem(FAVORITES_KEY);
    const serializedLastSearch = localStorage.getItem(LAST_SEARCH_KEY);

    const favorites = serializedFavorites ? JSON.parse(serializedFavorites) : undefined;
    const lastSearch = serializedLastSearch ? JSON.parse(serializedLastSearch) : undefined;

    return { favorites, lastSearch };

  } catch (err) {
    console.error("Could not load state from localStorage", err);
    return { favorites: undefined, lastSearch: undefined };
  }
};

// Function to save specific parts of the state to localStorage (only call client-side)
export const savePersistedState = (state: RootState) => {
  if (typeof window === 'undefined') return; // Don't run on server

  try {
    const serializedFavorites = JSON.stringify(state.vehicles.favorites);
    const serializedLastSearch = JSON.stringify(state.search.lastSearch);
    localStorage.setItem(FAVORITES_KEY, serializedFavorites);
    localStorage.setItem(LAST_SEARCH_KEY, serializedLastSearch);
  } catch (err) {
    console.error("Could not save state to localStorage", err);
  }
};

// Don't load preloadedState from localStorage directly here
// const preloadedState = loadState();

// --------------------------------------

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vehicles: vehiclesReducer,
    search: searchReducer,
  },
  // preloadedState: undefined, // Store starts with initial slice state
});

// --- Store Subscription for Persistence ---
// Only subscribe and save on the client side
if (typeof window !== 'undefined') {
  store.subscribe(throttle(() => {
    const state = store.getState();
    // Pass only the relevant parts needed for saving
    savePersistedState({
        auth: state.auth, // Pass auth state even if not persisting it directly
        vehicles: { favorites: state.vehicles.favorites, allVehicles: [], status: 'idle', error: null }, // Pass only favorites for saving, fulfill interface
        search: { lastSearch: state.search.lastSearch, filters: {}, sort: null, pagination: { page: 1, limit: 10 } } // Pass only lastSearch, fulfill interface
    } as RootState);
  }, 1000));
}
// -----------------------------------------------------

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Define typed hooks
import { TypedUseSelectorHook, useDispatch as useReduxDispatch, useSelector as useReduxSelector } from 'react-redux';

export const useDispatch: () => AppDispatch = useReduxDispatch;
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector; 