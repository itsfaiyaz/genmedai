#!/bin/bash

# 0. Setup Environment
echo "🔧 Setting up environment..."
# Try to load nvm if available
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
nvm use 20

# Prompt for App Name
read -p "Enter Frappe App Name (default: genmedai): " frappe_app_name
frappe_app_name=${frappe_app_name:-genmedai}

# Prompt for Frontend Directory
read -p "Enter React App Directory Name (default: frontend): " react_app_name
react_app_name=${react_app_name:-frontend}

APP_NAME="$frappe_app_name"
FRONTEND_DIR="$react_app_name"

echo "🚀 Starting Frontend Configuration for $APP_NAME in $FRONTEND_DIR..."

# 1. Install Dependencies
echo "📦 Installing dependencies..."
cd $FRONTEND_DIR
yarn add frappe-react-sdk lucide-react react-router-dom
yarn add -D tailwindcss postcss autoprefixer @types/node

# 2. Create Proxy Options (TypeScript)
echo "pw Creating proxyOptions.ts..."
cat > proxyOptions.ts <<EOF
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const common_site_config_path = path.resolve(__dirname, '../../../sites/common_site_config.json');
let webserver_port = 8000;

try {
  if (fs.existsSync(common_site_config_path)) {
    const common_site_config = JSON.parse(fs.readFileSync(common_site_config_path, 'utf-8'));
    webserver_port = common_site_config.webserver_port || 8000;
  }
} catch (e) {
  console.warn("Could not read common_site_config.json, defaulting to port 8000");
}

export default {
	'^/(app|api|assets|files|private)': {
		target: \`http://127.0.0.1:\${webserver_port}\`,
		ws: true,
		changeOrigin: true,
	},
};
EOF

# 3. Update Vite Config
echo "⚙️ Updating vite.config.ts..."
cat > vite.config.ts <<EOF
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import proxyOptions from './proxyOptions.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 8080,
    proxy: proxyOptions
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: '../$APP_NAME/public/$FRONTEND_DIR',
    emptyOutDir: true,
    target: 'es2015',
  },
});
EOF

# 3.1 Update tsconfig.node.json to include proxyOptions.ts
echo "⚙️ Updating tsconfig.node.json..."
# We use a temporary node script to update tsconfig.node.json
node -e "
const fs = require('fs');
try {
  const tsconfig = require('./tsconfig.node.json');
  if (!tsconfig.include.includes('proxyOptions.ts')) {
    tsconfig.include.push('proxyOptions.ts');
    fs.writeFileSync('tsconfig.node.json', JSON.stringify(tsconfig, null, 2));
    console.log('Updated tsconfig.node.json');
  }
} catch (e) {
  console.log('tsconfig.node.json not found or invalid, skipping update.');
}
"

# 4. Create Tailwind Config
echo "🎨 Creating tailwind.config.js..."
cat > tailwind.config.js <<EOF
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

# 5. Create PostCSS Config
echo "🎨 Creating postcss.config.js..."
cat > postcss.config.js <<EOF
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# 6. Update CSS
echo "🎨 Updating src/index.css..."
cat > src/index.css <<EOF
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

# 7. Update Package.json
echo "📝 Updating $FRONTEND_DIR/package.json..."
# We use a temporary node script to merge the new scripts/deps into existing package.json to preserve other fields
node -e "
const fs = require('fs');
const pkg = require('./package.json');

pkg.scripts = {
  ...pkg.scripts,
  'dev': 'vite',
  'build': 'vite build --base=/assets/$APP_NAME/$FRONTEND_DIR/ && yarn copy-html-entry',
  'lint': 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
  'preview': 'vite preview',
  'copy-html-entry': 'cp ../$APP_NAME/public/$FRONTEND_DIR/index.html ../$APP_NAME/www/$FRONTEND_DIR.html'
};

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

# 8. Update App.tsx with FrappeProvider
echo "⚛️ Updating src/App.tsx..."
cat > src/App.tsx <<EOF
import { FrappeProvider } from 'frappe-react-sdk';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <FrappeProvider>
      <BrowserRouter basename={import.meta.env.DEV ? '/' : '/$FRONTEND_DIR'}>
        <Routes>
          <Route path="/" element={
            <div className="p-10">
              <h1 className="text-3xl font-bold underline text-blue-600">
                Hello $APP_NAME!
              </h1>
              <p className="mt-4">React + Vite + Tailwind + Frappe</p>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </FrappeProvider>
  );
}

export default App;
EOF

# 9. Update Hooks.py
echo "🪝 Updating hooks.py..."
cd ..
HOOKS_FILE="$APP_NAME/hooks.py"

# Check if website_route_rules already exists, if not append it
if ! grep -q "website_route_rules" "$HOOKS_FILE"; then
cat >> "$HOOKS_FILE" <<EOF

website_route_rules = [
    {"from_route": "/$FRONTEND_DIR/<path:app_path>", "to_route": "$FRONTEND_DIR"},
    {"from_route": "/$FRONTEND_DIR", "to_route": "$FRONTEND_DIR"},
]
EOF
fi

# 10. Create Root Package.json
echo "📦 Creating root package.json..."
cat > package.json <<EOF
{
  "name": "$APP_NAME",
  "private": true,
  "scripts": {
    "build": "cd $FRONTEND_DIR && yarn install && yarn build"
  }
}
EOF

echo "✅ Configuration Complete! Run 'bench build --app $APP_NAME' to build the frontend."
