#!/bin/bash

# Family Gradebook - Multi-Platform Build Script
# This script builds the Electron app for all platforms (macOS, Windows, Linux)

set -e  # Exit on error

# Check if --no-version flag is passed
NO_VERSION=false
VERSION_TYPE="patch"

for arg in "$@"; do
  case $arg in
    --no-version)
      NO_VERSION=true
      shift
      ;;
    --major)
      VERSION_TYPE="major"
      shift
      ;;
    --minor)
      VERSION_TYPE="minor"
      shift
      ;;
    --patch)
      VERSION_TYPE="patch"
      shift
      ;;
  esac
done

# Increment version unless --no-version flag is used
if [ "$NO_VERSION" = false ]; then
  echo "📈 Incrementing version ($VERSION_TYPE)..."
  node scripts/version.js $VERSION_TYPE
  echo ""
fi

echo "🔖 Generating version file..."
node scripts/generate-version.js
echo ""

echo "🧹 Cleaning previous builds..."
rm -rf dist dist-electron

echo ""
echo "📦 Building React app with Vite..."
npm run build

echo ""
echo "🖥️  Building Electron app for all platforms..."
echo "   This may take several minutes..."
echo ""
npx electron-builder --mac --win --linux

echo ""
echo "✅ Build complete!"
echo ""
echo "📍 Your apps are located at:"
echo "   macOS:   dist-electron/mac/Family Gradebook.app"
echo "   Windows: dist-electron/Family Gradebook Setup 1.0.x.exe"
echo "   Linux:   dist-electron/Family Gradebook-1.0.x.AppImage"
echo ""
echo "📝 Platform-specific distribution:"
echo "   • macOS: Drag .app to Applications folder"
echo "   • Windows: Run the .exe installer"
echo "   • Linux: Make AppImage executable and run"
echo ""
