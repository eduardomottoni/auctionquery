import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: { [key: string]: any } | null; // Define a proper user type later
  token: string | null;
  expirationTime: number | null; // Store expiration as a timestamp (milliseconds)
  status: 'idle' | 'loading' | 'failed';
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  expirationTime: null,
  status: 'idle',
};

// Helper to check if token is expired
const isTokenExpired = (expirationTime: number | null): boolean => {
    if (!expirationTime) return true;
    return Date.now() >= expirationTime;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: any; token: string; expirationTime: number }>) => {
      state.isAuthenticated = !isTokenExpired(action.payload.expirationTime); // Check on login
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.expirationTime = action.payload.expirationTime;
      state.status = 'idle';
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.expirationTime = null;
      state.status = 'idle';
    },
    setAuthLoading: (state) => {
      state.status = 'loading';
    },
    setAuthError: (state) => {
      state.status = 'failed';
    },
    // Action to check token validity (can be called periodically or on specific actions)
    checkTokenValidity: (state) => {
      if (state.isAuthenticated && isTokenExpired(state.expirationTime)) {
          // Token expired, log out
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
          state.expirationTime = null;
          state.status = 'idle';
      }
    },
    // Action to set initial state from persistence
    setInitialAuthState: (state, action: PayloadAction<Partial<AuthState>>) => {
        // Only update if persisted state exists and token is not expired
        const { token, expirationTime, user } = action.payload;
        if (token && expirationTime && !isTokenExpired(expirationTime)) {
            state.token = token;
            state.expirationTime = expirationTime;
            state.user = user || null; // Use persisted user if available
            state.isAuthenticated = true;
        }
        state.status = 'idle';
    },
  },
});

export const {
    loginSuccess,
    logout,
    setAuthLoading,
    setAuthError,
    checkTokenValidity,
    setInitialAuthState
} = authSlice.actions;

// Selector to check authentication status considering expiration
export const selectIsAuthenticated = (state: { auth: AuthState }): boolean => {
    return state.auth.isAuthenticated && !isTokenExpired(state.auth.expirationTime);
};

export default authSlice.reducer; 