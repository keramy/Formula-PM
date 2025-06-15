#!/bin/bash

# Formula PM - GitHub Pages Deployment Script

echo "🚀 Deploying Formula PM to GitHub Pages..."

# Step 1: Build the React app
echo "📦 Building React application..."
cd formula-project-app
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix the errors and try again."
    exit 1
fi

# Step 2: Copy build files to root
echo "📁 Copying build files to root directory..."
cd ..
cp -r formula-project-app/build/* .

# Step 3: Ensure .nojekyll file exists
echo "📝 Creating .nojekyll file..."
touch .nojekyll

# Step 4: Git operations
echo "📤 Preparing Git commit..."

# Check if there are changes
if git diff --quiet && git diff --staged --quiet; then
    echo "✅ No changes detected. Deploy complete!"
    exit 0
fi

# Add all files
git add .

# Commit with timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
git commit -m "Deploy Formula PM to GitHub Pages - $TIMESTAMP

🎯 Features included:
- Enhanced task management with List/Board/Calendar views
- Debounced search functionality (300ms delay)
- Collapsible sidebar with toggle
- Excel template download for scope management
- Clean team member cards
- Context-aware UI (Save Changes vs Add Task)
- Real-time collaboration features

🤖 Generated with Claude Code"

echo "✅ Build and commit complete!"
echo "📋 Next steps:"
echo "   1. Push to GitHub: git push origin main"
echo "   2. Enable GitHub Pages in repository settings"
echo "   3. Set source to 'GitHub Actions'"
echo "   4. Your app will be available at: https://keramy.github.io/formula-pm"
echo ""
echo "🌐 GitHub Pages URL: https://keramy.github.io/formula-pm"