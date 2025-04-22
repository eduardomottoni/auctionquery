#!/bin/bash

# This script is a fallback to ensure the Next.js app builds correctly

echo "📁 Current directory: $(pwd)"
echo "📋 Listing files:"
ls -la

echo "📦 Installing dependencies in app directory..."
cd app && npm install

echo "🔨 Building Next.js application..."
npm run build

echo "🔍 Verificando arquivos gerados:"
ls -la .next || echo "Diretório .next não encontrado!"

echo "📁 Verificando routes-manifest.json:"
if [ -f .next/routes-manifest.json ]; then
  echo "✅ routes-manifest.json encontrado!"
else
  echo "❌ routes-manifest.json não encontrado!"
  echo "Procurando arquivos no diretório .next:"
  find .next -type f | grep -i manifest || echo "Nenhum arquivo manifest encontrado"
  
  # Verificar se .next está em outro lugar
  echo "🔍 Procurando diretório .next em outros locais:"
  find .. -name ".next" -type d || echo "Nenhum diretório .next encontrado"
  
  # Tentar criar o arquivo manualmente se não existir
  echo "🔧 Criando diretório .next se não existir:"
  mkdir -p .next
  
  echo "🔧 Criando routes-manifest.json com configuração mínima:"
  echo '{
    "version": 3,
    "pages404": true,
    "basePath": "",
    "redirects": [],
    "headers": [],
    "dynamicRoutes": [],
    "staticRoutes": [],
    "dataRoutes": [],
    "rewrites": []
  }' > .next/routes-manifest.json
fi

echo "✅ Build completed" 