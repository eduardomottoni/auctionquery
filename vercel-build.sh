#!/bin/bash

# This script is a fallback to ensure the Next.js app builds correctly

echo "📁 Current directory: $(pwd)"
echo "📋 Listing files:"
ls -la

echo "📦 Installing dependencies in app directory..."
cd app && npm install

echo "🔨 Building Next.js application..."
cd app && npm run build

echo "✅ Build completed" 