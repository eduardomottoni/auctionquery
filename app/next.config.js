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
  
  // Ensure correct output path for Vercel deployment
  distDir: process.env.VERCEL ? '.next' : '.next',
  
  // Output standalone build for improved compatibility
  output: 'standalone',
  
  // Configuração para permitir o uso dos dois tipos de rotas (app/ e pages/)
  experimental: {
    appDir: true,  // Permite uso do app directory
  },
  
  // Configuração específica para Vercel
  generateBuildId: async () => {
    // Você pode usar este ID para garantir que o build seja único
    return `build-${new Date().getTime()}`;
  }
};

module.exports = nextConfig; 