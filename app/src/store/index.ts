import { configureStore } from '@reduxjs/toolkit';
// Remove direct State type imports - use RootState instead
import authReducer from './authSlice';
import vehiclesReducer from './vehiclesSlice';
import searchReducer from './searchSlice';
import { throttle } from 'lodash'; // Using lodash for throttling save operations

// --- Persistence Keys ---
const FAVORITES_KEY = 'favorites';
const LAST_SEARCH_KEY = 'lastSearch';
const AUTH_KEY = 'authState'; // Key for auth state

// Define the shape of the state we persist for auth
interface PersistedAuthState {
    token: string | null;
    expirationTime: number | null;
    user: { [key: string]: any } | null;
}

// Function to load state from localStorage (only call client-side)
export const loadPersistedState = () => {
  if (typeof window === 'undefined') {
    return { favorites: undefined, lastSearch: undefined, authState: undefined }; // Return empty on server
  }
  try {
    const serializedFavorites = localStorage.getItem(FAVORITES_KEY);
    const serializedLastSearch = localStorage.getItem(LAST_SEARCH_KEY);
    const serializedAuthState = localStorage.getItem(AUTH_KEY);

    const favorites = serializedFavorites ? JSON.parse(serializedFavorites) : undefined;
    const lastSearch = serializedLastSearch ? JSON.parse(serializedLastSearch) : undefined;
    const authState: PersistedAuthState | undefined = serializedAuthState ? JSON.parse(serializedAuthState) : undefined;

    return { favorites, lastSearch, authState };

  } catch (err) {
    console.error("Could not load state from localStorage", err);
    return { favorites: undefined, lastSearch: undefined, authState: undefined };
  }
};

// Function to save specific parts of the state to localStorage (only call client-side)
export const savePersistedState = (state: RootState) => {
  if (typeof window === 'undefined') return; // Don't run on server

  try {
    const serializedFavorites = JSON.stringify(state.vehicles.favorites);
    const serializedLastSearch = JSON.stringify(state.search.lastSearch);
    // Only persist necessary auth fields
    const authToPersist: PersistedAuthState = {
        token: state.auth.token,
        expirationTime: state.auth.expirationTime,
        user: state.auth.user
    };
    const serializedAuthState = JSON.stringify(authToPersist);

    localStorage.setItem(FAVORITES_KEY, serializedFavorites);
    localStorage.setItem(LAST_SEARCH_KEY, serializedLastSearch);
    localStorage.setItem(AUTH_KEY, serializedAuthState);

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
    // Pass the whole state to savePersistedState, it will select what to save
    savePersistedState(state);
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

// Remove conflicting re-export
// export type { RootState, AuthState, VehiclesState, SearchState }; 