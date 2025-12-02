#!/bin/bash

# Family Gradebook - Clean Build Script
# This script performs a clean build of the Electron desktop app

set -e  # Exit on error

echo "🧹 Cleaning previous builds..."
rm -rf dist dist-electron

echo ""
echo "📦 Building React app with Vite..."
npm run build

echo ""
echo "🖥️  Building Electron app..."
npx electron-builder --mac

echo ""
echo "✅ Build complete!"
echo ""
echo "📍 Your app is located at:"
echo "   dist-electron/mac/Family Gradebook.app"
echo ""
echo "📝 Next steps:"
echo "   1. Test the app by double-clicking it"
echo "   2. If it works, drag it to your Applications folder"
echo "   3. If you see 'unidentified developer' warning:"
echo "      - Right-click the app → Open → Open"
echo ""
