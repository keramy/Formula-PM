#!/bin/bash

# Formula PM Vite Migration Script
# This script migrates the React app from Create React App to Vite for better WSL2 performance

echo "🚀 Starting migration from Create React App to Vite..."
echo "This will significantly improve development server performance in WSL2"

# Navigate to the project directory
cd /mnt/c/Users/Kerem/Desktop/formula-pm/formula-project-app

# Backup current configuration
echo "📦 Creating backups..."
cp package.json package.json.backup
cp public/index.html public/index.html.backup

# Install Vite dependencies
echo "📥 Installing Vite dependencies..."
npm install --save-dev vite @vitejs/plugin-react @vitejs/plugin-react-swc vite-tsconfig-paths vite-plugin-eslint

# Remove react-scripts
echo "🗑️  Removing react-scripts..."
npm uninstall react-scripts

# Copy Vite configuration
echo "⚙️  Setting up Vite configuration..."
cp ../vite-migration/vite.config.js ./

# Move and update index.html for Vite
echo "📄 Updating index.html for Vite..."
mv public/index.html ./index.html

# Update index.html for Vite structure
sed -i 's/%PUBLIC_URL%\///g' index.html
sed -i 's/<title>.*<\/title>/<title>Formula PM<\/title>/' index.html

# Add script tag for Vite
if ! grep -q "src=\"\/src\/index.js\"" index.html; then
    sed -i 's/<\/body>/<script type="module" src="\/src\/index.js"><\/script>\n  <\/body>/' index.html
fi

# Update package.json scripts
echo "📝 Updating package.json scripts..."
# Create a temporary file with updated scripts
cat > temp_scripts.json << 'EOF'
{
  "start": "vite",
  "start:fast": "vite --host 0.0.0.0",
  "build": "vite build",
  "preview": "vite preview",
  "test": "vitest",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build",
  "analyze": "vite-bundle-analyzer dist/assets/*.js",
  "lighthouse": "lighthouse http://localhost:3000 --view"
}
EOF

# Update package.json using node
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const newScripts = JSON.parse(fs.readFileSync('temp_scripts.json', 'utf8'));
pkg.scripts = { ...pkg.scripts, ...newScripts };
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

# Clean up
rm temp_scripts.json

# Install testing dependencies for Vite
echo "🧪 Installing testing dependencies..."
npm install --save-dev vitest @testing-library/jest-dom

echo ""
echo "✅ Migration completed successfully!"
echo ""
echo "🎉 Your React app is now using Vite for much faster development!"
echo ""
echo "📋 Next steps:"
echo "  1. Start development server: npm start"
echo "  2. Test the application to ensure everything works"
echo "  3. If issues occur, restore from backups:"
echo "     - cp package.json.backup package.json"
echo "     - cp public/index.html.backup public/index.html"
echo "     - npm install"
echo ""
echo "🚀 Expected performance improvements:"
echo "  - Development server startup: 5-10x faster"
echo "  - Hot module replacement: Near instant"
echo "  - Build times: 2-3x faster"
echo ""
echo "🔧 To start development server: npm start"