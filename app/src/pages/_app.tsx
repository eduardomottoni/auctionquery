import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider as ReduxProvider } from 'react-redux';
import { useEffect } from 'react';
import { store, loadPersistedState } from '@/store';
import { setInitialFavorites } from '@/store/vehiclesSlice';
import { setInitialLastSearch } from '@/store/searchSlice';
import { setInitialAuthState } from '@/store/authSlice';
import GlobalStyles from '@/styles/GlobalStyles';
import Layout from "@/components/Layout";
import { AppThemeProvider } from '@/context/ThemeContext';

function AuctionApp({ Component, pageProps }: AppProps) {
  // Client-side state hydration
  useEffect(() => {
    const { favorites, lastSearch, authState } = loadPersistedState();
    if (favorites !== undefined) {
      store.dispatch(setInitialFavorites(favorites));
    }
    if (lastSearch !== undefined) {
      store.dispatch(setInitialLastSearch(lastSearch));
    }
    if (authState !== undefined) {
      // Dispatch action to set initial auth state from localStorage
      store.dispatch(setInitialAuthState(authState));
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Add other providers (e.g., Redux, Auth0) here as needed
  return (
    <ReduxProvider store={store}>
      <AppThemeProvider>
        <GlobalStyles />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppThemeProvider>
    </ReduxProvider>
  );
}

export default AuctionApp;
