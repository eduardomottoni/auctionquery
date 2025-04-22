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
  
  // Configuração para permitir o uso dos dois tipos de rotas
  experimental: {
    // appDir não é mais usado no Next.js 15.3.1, foi substituído por serverActions
    serverActions: true,
  },
  
  // Configuração específica para Vercel
  generateBuildId: async () => {
    // Você pode usar este ID para garantir que o build seja único
    return `build-${new Date().getTime()}`;
  },

  // Adicionar rewrite para direcionar / para a página principal da aplicação
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/src/pages/index',
      },
      {
        source: '/:path*',
        destination: '/src/pages/:path*',
      }
    ];
  }
};

module.exports = nextConfig; 