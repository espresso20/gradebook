#!/bin/bash

# Icon Generation Script for Family Gradebook
# Generates macOS .icns file from PNG source

set -e

echo "🎨 Generating macOS app icon..."

# Check if ImageMagick is installed
if ! command -v magick &> /dev/null; then
    echo "❌ ImageMagick not found. Installing via Homebrew..."
    if command -v brew &> /dev/null; then
        brew install imagemagick
    else
        echo "❌ Homebrew not installed. Please install ImageMagick manually:"
        echo "   https://imagemagick.org/script/download.php"
        exit 1
    fi
fi

# Check if source PNG exists
if [ ! -f "build/icon.png" ]; then
    echo "❌ Source icon not found at build/icon.png"
    echo ""
    echo "Please create a 1024x1024 PNG icon first:"
    echo "  1. Design your icon (graduation cap on terracotta background)"
    echo "  2. Export as PNG: build/icon.png"
    echo "  3. Run this script again"
    echo ""
    echo "Or convert the SVG to PNG:"
    echo "  - Upload build/icon.svg to https://cloudconvert.com/svg-to-png"
    echo "  - Set size to 1024x1024"
    echo "  - Download as build/icon.png"
    exit 1
fi

echo "✓ Found source icon: build/icon.png"

# Create temporary iconset directory
ICONSET_DIR="FamilyGradebook.iconset"
rm -rf "$ICONSET_DIR"
mkdir "$ICONSET_DIR"

echo "📐 Generating icon sizes..."

# Generate all required icon sizes
magick build/icon.png -resize 16x16 "$ICONSET_DIR/icon_16x16.png"
magick build/icon.png -resize 32x32 "$ICONSET_DIR/icon_16x16@2x.png"
magick build/icon.png -resize 32x32 "$ICONSET_DIR/icon_32x32.png"
magick build/icon.png -resize 64x64 "$ICONSET_DIR/icon_32x32@2x.png"
magick build/icon.png -resize 128x128 "$ICONSET_DIR/icon_128x128.png"
magick build/icon.png -resize 256x256 "$ICONSET_DIR/icon_128x128@2x.png"
magick build/icon.png -resize 256x256 "$ICONSET_DIR/icon_256x256.png"
magick build/icon.png -resize 512x512 "$ICONSET_DIR/icon_256x256@2x.png"
magick build/icon.png -resize 512x512 "$ICONSET_DIR/icon_512x512.png"
magick build/icon.png -resize 1024x1024 "$ICONSET_DIR/icon_512x512@2x.png"

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
