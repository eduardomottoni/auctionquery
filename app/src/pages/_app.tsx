import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from 'styled-components';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';
import theme from '@/styles/theme';
import GlobalStyles from '@/styles/GlobalStyles';
// import { Auth0Provider } from '@auth0/nextjs-auth0'; // Renamed from UserProvider in v4, not required by default

export default function App({ Component, pageProps }: AppProps) {
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
