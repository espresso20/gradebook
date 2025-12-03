#!/bin/bash

# Icon Generation Script for Family Gradebook
# Generates macOS .icns file from PNG source

set -e

echo "🎨 Generating macOS app icon..."

# Check if source PNG exists
if [ ! -f "build/icon.png" ]; then
    echo "❌ Source icon not found at build/icon.png"
    echo ""
    echo "The icon.png should have been generated from icon.svg"
    echo "If it's missing, run:"
    echo "  qlmanage -t -s 1024 -o build/ build/icon.svg"
    echo "  mv build/icon.svg.png build/icon.png"
    exit 1
fi

echo "✓ Found source icon: build/icon.png"

# Create temporary iconset directory
ICONSET_DIR="FamilyGradebook.iconset"
rm -rf "$ICONSET_DIR"
mkdir "$ICONSET_DIR"

echo "📐 Generating icon sizes using sips..."

# Generate all required icon sizes using macOS built-in sips
sips -z 16 16 build/icon.png --out "$ICONSET_DIR/icon_16x16.png" > /dev/null 2>&1
sips -z 32 32 build/icon.png --out "$ICONSET_DIR/icon_16x16@2x.png" > /dev/null 2>&1
sips -z 32 32 build/icon.png --out "$ICONSET_DIR/icon_32x32.png" > /dev/null 2>&1
sips -z 64 64 build/icon.png --out "$ICONSET_DIR/icon_32x32@2x.png" > /dev/null 2>&1
sips -z 128 128 build/icon.png --out "$ICONSET_DIR/icon_128x128.png" > /dev/null 2>&1
sips -z 256 256 build/icon.png --out "$ICONSET_DIR/icon_128x128@2x.png" > /dev/null 2>&1
sips -z 256 256 build/icon.png --out "$ICONSET_DIR/icon_256x256.png" > /dev/null 2>&1
sips -z 512 512 build/icon.png --out "$ICONSET_DIR/icon_256x256@2x.png" > /dev/null 2>&1
sips -z 512 512 build/icon.png --out "$ICONSET_DIR/icon_512x512.png" > /dev/null 2>&1
sips -z 1024 1024 build/icon.png --out "$ICONSET_DIR/icon_512x512@2x.png" > /dev/null 2>&1

echo "✓ Generated all icon sizes"

# Convert to .icns
echo "🔨 Creating .icns file..."
iconutil -c icns "$ICONSET_DIR" -o build/icon.icns

# Clean up
rm -rf "$ICONSET_DIR"

echo "✅ Icon generated successfully!"
echo ""
echo "📍 Icon saved to: build/icon.icns"
echo ""
echo "🚀 Next steps:"
echo "   1. Build your app: ./build.sh"
echo "   2. The custom icon will be applied automatically"
echo ""
