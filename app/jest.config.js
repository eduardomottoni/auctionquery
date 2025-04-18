const nextJest = require('next/jest');

// Providing the path to your Next.js app to load next.config.js and .env files in your test environment
const createJestConfig = nextJest({
  dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured by next/jest)
    // Example: '@/components/(.*)$': '<rootDir>/src/components/$1',
    // Ensure tsconfig paths are handled by next/jest
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  preset: 'ts-jest', // Use ts-jest preset
  testPathIgnorePatterns: [ // Ignore node_modules and .next
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
  ],
  transform: {
    // Use ts-jest for ts/tsx files
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
    // Handle other file types if necessary (e.g., CSS Modules, images)
    // '\\.(css|less|scss|sass)$|': 'identity-obj-proxy',
    // '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$|': '<rootDir>/__mocks__/fileMock.js',
  },
  // Add coverage configuration
  collectCoverage: true,
  coverageProvider: 'v8', // or 'babel'
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}', // Include all ts/tsx files in src
    '!src/**/*.d.ts', // Exclude type definition files
    '!src/**/_app.tsx', // Exclude Next.js specific files if not testing them
    '!src/**/_document.tsx',
    '!src/pages/api/**', // Exclude API routes
    '!src/styles/**', // Exclude styles
    '!src/types/**', // Exclude type definitions
    // Add any other files/directories to exclude
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig); 