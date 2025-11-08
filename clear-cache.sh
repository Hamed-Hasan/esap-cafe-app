#!/bin/bash
# Bash script to clear all Expo caches

echo "🧹 Clearing Expo and Metro caches..."

# Clear Metro bundler cache
if [ -d "node_modules/.cache" ]; then
    echo "Removing node_modules/.cache..."
    rm -rf node_modules/.cache
fi

# Clear Expo cache
if [ -d "$HOME/.expo" ]; then
    echo "Removing Expo cache..."
    rm -rf "$HOME/.expo" 2>/dev/null
fi

# Clear temp folders
if [ -d ".expo" ]; then
    echo "Removing .expo folder..."
    rm -rf .expo 2>/dev/null
fi

echo "✅ Cache cleared! Now run: npm run web:clear"
echo "⚠️  Also clear your browser cache (Ctrl+Shift+Delete)"
