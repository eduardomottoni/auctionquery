#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'ignore' });
} catch (error) {
  console.log('Installing Vercel CLI...');
  execSync('npm install -g vercel', { stdio: 'inherit' });
}

console.log('\n=== Vercel Project Setup ===\n');
console.log('This script will help you set up your Vercel project for deployment.');
console.log('It will configure Vercel to build from the app directory.\n');

// Run Vercel login if needed
console.log('1. Logging in to Vercel...');
try {
  execSync('vercel whoami', { stdio: 'ignore' });
  console.log('   Already logged in to Vercel.');
} catch (error) {
  console.log('   Please log in to Vercel:');
  execSync('vercel login', { stdio: 'inherit' });
}

// Run Vercel link
console.log('\n2. Linking to Vercel project...');
try {
  execSync('vercel link', { stdio: 'inherit' });
} catch (error) {
  console.error('   Error linking to Vercel project:', error.message);
  process.exit(1);
}

console.log('\n3. Setting up Vercel build configuration...');

// Create/update vercel.json if it doesn't exist
const vercelConfigPath = path.join(process.cwd(), 'vercel.json');
const vercelConfig = {
  buildCommand: "npm run build",
  outputDirectory: "app/.next",
  framework: "nextjs"
};

fs.writeFileSync(vercelConfigPath, JSON.stringify(vercelConfig, null, 2));
console.log('   Created/updated vercel.json configuration.');

console.log('\n4. Getting project IDs for GitHub Actions...');
console.log('   To use GitHub Actions for automatic deployment, add these secrets to your GitHub repository:');
console.log('   - VERCEL_TOKEN: Your Vercel API token (from https://vercel.com/account/tokens)');

try {
  const projectInfo = execSync('vercel project ls --json').toString();
  const project = JSON.parse(projectInfo.trim().split('\n')[0]);
  
  console.log(`   - VERCEL_ORG_ID: ${project.accountId}`);
  console.log(`   - VERCEL_PROJECT_ID: ${project.id}`);
} catch (error) {
  console.log('   Could not retrieve project IDs automatically. Please get them from your Vercel project settings.');
}

console.log('\n=== Setup Complete ===');
console.log('Your project is now configured for Vercel deployment!');
console.log('Run "npm run vercel:deploy" to deploy manually or push to GitHub for automatic deployment.'); 