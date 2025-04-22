/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  
  // Configure Webpack
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add custom Babel loader if needed
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          // The babel config will be read from babel.config.js
          cacheDirectory: true,
        },
      },
    });

    // Return the modified config
    return config;
  },
};

module.exports = nextConfig; 