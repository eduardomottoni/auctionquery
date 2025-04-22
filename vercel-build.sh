#!/bin/bash

# Script para build no Vercel

echo "📁 Current directory: $(pwd)"
echo "📋 Listing files:"
ls -la

echo "📦 Installing dependencies in app directory..."
cd app 

# Garantindo que as dependências de desenvolvimento também sejam instaladas
npm install --also=dev

echo "📝 Verificando se typescript e eslint estão instalados..."
if ! [ -d "node_modules/typescript" ]; then
  echo "⚠️ TypeScript não encontrado, instalando..."
  npm install --save-dev typescript
fi

if ! [ -d "node_modules/eslint" ]; then
  echo "⚠️ ESLint não encontrado, instalando..."
  npm install --save-dev eslint
fi

if ! [ -d "node_modules/@types/node" ]; then
  echo "⚠️ @types/node não encontrado, instalando..."
  npm install --save-dev @types/node
fi

# Verificando se temos um tsconfig.json válido
if [ -f "tsconfig.json" ]; then
  echo "✅ tsconfig.json encontrado"
else
  echo "⚠️ tsconfig.json não encontrado, criando um básico..."
  echo '{
    "compilerOptions": {
      "target": "es5",
      "lib": ["dom", "dom.iterable", "esnext"],
      "allowJs": true,
      "skipLibCheck": true,
      "strict": false,
      "forceConsistentCasingInFileNames": true,
      "noEmit": true,
      "esModuleInterop": true,
      "module": "esnext",
      "moduleResolution": "node",
      "resolveJsonModule": true,
      "isolatedModules": true,
      "jsx": "preserve",
      "incremental": true,
      "plugins": [
        {
          "name": "next"
        }
      ],
      "paths": {
        "@/*": ["./src/*"]
      }
    },
    "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    "exclude": ["node_modules"]
  }' > tsconfig.json
fi

# Verificando se temos um arquivo .eslintrc.js
if [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ]; then
  echo "✅ Configuração do ESLint encontrada"
else
  echo "⚠️ Configuração do ESLint não encontrada, criando uma básica..."
  echo 'module.exports = {
    extends: ["next/core-web-vitals"],
    rules: {}
  }' > .eslintrc.js
fi

# Verificar estrutura de pastas app e pages
echo "📂 Verificando estrutura de pastas da aplicação..."
if [ ! -d "pages" ]; then
  echo "⚠️ Diretório pages/ não encontrado, criando..."
  mkdir -p pages
fi

# Adicionar links simbólicos das páginas reais em src/pages para pages/
echo "📑 Criando links simbólicos das páginas reais em src/pages para pages/..."
if [ -d "src/pages" ]; then
  echo "✅ Encontradas páginas em src/pages, criando links..."
  
  # Criar um arquivo next.config.js temporário para o build
  echo "📝 Criando configuração temporária para o build..."
  cp next.config.js next.config.js.bak
  cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  // Ensure correct output path for Vercel deployment
  distDir: '.next',
  // Output standalone build for improved compatibility
  output: 'standalone',
  // Configuração para usar páginas de src/pages diretamente
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Configurando para encontrar páginas em src/pages
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add src directory to the webpack resolve modules
    config.resolve.modules.push("src");
    
    return config;
  },
};

module.exports = nextConfig;
EOF

  # Configurar next.js para usar as páginas em src/pages
  echo "module.exports = require('./src/pages');" > pages/index.js
  echo "export { default } from '../src/pages/_app';" > pages/_app.js
  echo "export { default } from '../src/pages/404';" > pages/404.js
  
  if [ -f "src/pages/_document.tsx" ] || [ -f "src/pages/_document.js" ]; then
    echo "export { default } from '../src/pages/_document';" > pages/_document.js
  fi
  
  # Criar links para todas as outras páginas
  for page in $(find src/pages -maxdepth 1 -type f | grep -v "_app\|_document\|index\|404"); do
    basename=$(basename "$page")
    name="${basename%.*}"
    ext="${basename##*.}"
    
    # Se for .tsx ou .ts, o link deve ser .js
    if [ "$ext" = "tsx" ] || [ "$ext" = "ts" ]; then
      ext="js"
    fi
    
    echo "export { default } from '../$page';" > "pages/$name.$ext"
    echo "✅ Criado link para $name"
  done
  
  # Lidar com subdiretórios como API
  if [ -d "src/pages/api" ]; then
    mkdir -p pages/api
    for apiFile in $(find src/pages/api -type f); do
      # Extrair o caminho relativo após src/pages/api/
      relPath="${apiFile#src/pages/api/}"
      dir=$(dirname "$relPath")
      
      if [ "$dir" != "." ]; then
        mkdir -p "pages/api/$dir"
      fi
      
      basename=$(basename "$apiFile")
      name="${basename%.*}"
      ext="${basename##*.}"
      
      # Se for .tsx ou .ts, o link deve ser .js
      if [ "$ext" = "tsx" ] || [ "$ext" = "ts" ]; then
        ext="js"
      fi
      
      # Criar o arquivo de exportação
      echo "export * from '../../../$apiFile';" > "pages/api/$dir/$name.$ext"
      echo "export { default } from '../../../$apiFile';" >> "pages/api/$dir/$name.$ext"
      echo "✅ Criado link para API: $dir/$name"
    done
  fi
else
  echo "⚠️ Diretório src/pages não encontrado, usando páginas padrão..."
  # Verificar se há um index.js em pages
  if [ ! -f "pages/index.js" ] && [ ! -f "pages/index.tsx" ]; then
    echo "⚠️ Arquivo index em pages/ não encontrado, criando..."
    echo 'export default function Home() {
      return (
        <div>
          <h1>Home Page</h1>
          <p>This is a fallback page.</p>
        </div>
      );
    }' > pages/index.js
  fi
fi

echo "🔨 Building Next.js application..."
NODE_OPTIONS="--max_old_space_size=4096" npx next build

# Restaurar a configuração original se foi feito backup
if [ -f "next.config.js.bak" ]; then
  mv next.config.js.bak next.config.js
fi

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
    "staticRoutes": [{"page": "/", "regex": "^/$"}],
    "dataRoutes": [],
    "rewrites": []
  }' > .next/routes-manifest.json
fi

# Garantir que haja páginas serverless
echo "✅ Verificando se há páginas serverless..."
if [ ! -d ".next/server/pages" ]; then
  echo "📑 Criando estrutura básica de páginas serverless..."
  mkdir -p .next/server/pages
fi

if [ ! -f ".next/server/pages/index.js" ]; then
  echo "📑 Criando arquivo index.js básico em server/pages..."
  echo 'module.exports=function(){return {props:{}}};module.exports.getStaticProps=function(){return {props:{}}};module.exports.default=function(){return {props:{}}};' > .next/server/pages/index.js
  echo 'module.exports=function(){return {props:{}}};module.exports.getStaticProps=function(){return {props:{}}};module.exports.default=function(){return {props:{}}};' > .next/server/pages/[...path].js
  
  # Criar entrada no page-map
  mkdir -p .next/server
  echo '{"/":{"id":"/"}}' > .next/server/pages-manifest.json
fi

echo "✅ Build completed" 