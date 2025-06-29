#!/bin/bash

# Script to remove backup files and folders
cd "C:\Users\Kerem\Desktop\formula-pm\docs\ai-agent-system"

echo "🗑️ Removing backup files and folders..."

# Remove backup directories and files
if [ -d "business-logic.backup" ]; then
    rm -rf "business-logic.backup"
    echo "✅ Removed business-logic.backup"
fi

if [ -d "workflows.backup" ]; then
    rm -rf "workflows.backup"
    echo "✅ Removed workflows.backup"
fi

if [ -d "patterns.backup" ]; then
    rm -rf "patterns.backup"
    echo "✅ Removed patterns.backup"
fi

if [ -d "api.backup" ]; then
    rm -rf "api.backup"
    echo "✅ Removed api.backup"
fi

if [ -d "components.backup" ]; then
    rm -rf "components.backup"
    echo "✅ Removed components.backup"
fi

if [ -f "implementation_summary.backup" ]; then
    rm "implementation_summary.backup"
    echo "✅ Removed implementation_summary.backup"
fi

echo "🎉 All backup files removed!"
echo "📁 Final clean structure:"
ls -la
