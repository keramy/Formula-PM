#!/bin/bash

# Script to rename all .js files containing JSX to .jsx
cd /mnt/c/Users/Kerem/Desktop/formula-pm/formula-project-app/src

# Find all .js files and check if they contain JSX syntax
find . -name "*.js" -type f | while read file; do
    # Check if file contains JSX patterns like <Component or />
    if grep -qE '<[A-Z]|</|/>' "$file"; then
        # Get the new filename with .jsx extension
        newfile="${file%.js}.jsx"
        echo "Renaming $file to $newfile"
        mv "$file" "$newfile"
    fi
done

echo "JSX file renaming complete!"