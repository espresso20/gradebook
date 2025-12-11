#!/bin/bash

# Family Gradebook - Windows Build Script
# This script builds the Electron app for Windows

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
echo "🖥️  Building Electron app for Windows..."
npx electron-builder --win

echo ""
echo "✅ Build complete!"
echo ""
echo "📍 Your Windows app is located at:"
echo "   dist-electron/Family Gradebook Setup 1.0.x.exe"
echo ""
echo "📝 Next steps:"
echo "   1. Transfer the .exe file to a Windows machine"
echo "   2. Run the installer on Windows"
echo "   3. The app will be installed to Program Files"
echo ""
