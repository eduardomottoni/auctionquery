// Custom app component for Next.js
import React from 'react';
import App from 'next/app';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

// Only uncomment this method if you need to wait for data
// MyApp.getInitialProps = async (appContext) => {
//   const appProps = await App.getInitialProps(appContext);
//   return { ...appProps };
// };

export default MyApp; 