import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: { [key: string]: any } | null; // Define a proper user type later
  token: string | null;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  status: 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: any; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = 'idle';
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.status = 'idle';
    },
    setAuthLoading: (state) => {
      state.status = 'loading';
    },
    setAuthError: (state) => {
      state.status = 'failed';
    },
  },
});

export const { loginSuccess, logout, setAuthLoading, setAuthError } = authSlice.actions;

export default authSlice.reducer; 