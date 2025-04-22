// build.js - Script to help Vercel build the project
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting build process from root directory');

// Ensure we're in the project root
const projectRoot = process.cwd();
console.log(`Current directory: ${projectRoot}`);

// Path to app directory
const appDir = path.join(projectRoot, 'app');

// Check if app directory exists
if (!fs.existsSync(appDir)) {
  console.error('❌ Error: app directory not found!');
  process.exit(1);
}

try {
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit', cwd: appDir });
  
  console.log('🔨 Building Next.js application...');
  execSync('npm run build', { stdio: 'inherit', cwd: appDir });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error(`❌ Build failed: ${error.message}`);
  process.exit(1);
} 