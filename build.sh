#!/bin/bash

# Family Gradebook - Clean Build Script
# This script performs a clean build of the Electron desktop app

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
