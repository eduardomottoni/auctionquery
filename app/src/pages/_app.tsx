import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from 'styled-components';
import { Provider as ReduxProvider } from 'react-redux';
import { useEffect } from 'react';
import { store, loadPersistedState } from '@/store';
import { setInitialFavorites } from '@/store/vehiclesSlice';
import { setInitialLastSearch } from '@/store/searchSlice';
import { setInitialAuthState } from '@/store/authSlice';
import theme from '@/styles/theme';
import GlobalStyles from '@/styles/GlobalStyles';
// import { Auth0Provider } from '@auth0/nextjs-auth0'; // Renamed from UserProvider in v4, not required by default

function App({ Component, pageProps }: AppProps) {
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
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {/* <Auth0Provider> */}
          <Component {...pageProps} />
        {/* </Auth0Provider> */}
      </ThemeProvider>
    </ReduxProvider>
  );
}

export default App;
