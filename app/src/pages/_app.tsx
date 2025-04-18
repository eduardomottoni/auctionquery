import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from 'styled-components';
import theme from '@/styles/theme';
import GlobalStyles from '@/styles/GlobalStyles';
// import { Auth0Provider } from '@auth0/nextjs-auth0'; // Renamed from UserProvider in v4, not required by default
// import { Provider as ReduxProvider } from 'react-redux';
// import { store } from '@/store'; // Assuming store setup is in @/store/index.ts

export default function App({ Component, pageProps }: AppProps) {
  // Add other providers (e.g., Redux, Auth0) here as needed
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {/* <Auth0Provider> */}
        {/* <ReduxProvider store={store}> */}
          <Component {...pageProps} />
        {/* </ReduxProvider> */}
      {/* </Auth0Provider> */}
    </ThemeProvider>
  );
}
