# Icon Guide

## Current Status
The app currently uses the default Electron icon. Custom icons are needed for professional distribution.

## Required Icon Formats

### macOS (.icns)
- **File**: `build/icon.icns`
- **Size**: 1024x1024px base image
- **Format**: .icns (contains multiple resolutions)

### Windows (.ico or .png)
- **File**: `build/icon.png`
- **Size**: 256x256px minimum (512x512px recommended)
- **Format**: .png (electron-builder converts to .ico)

### Linux
- Uses the same `build/icon.png` as Windows

## Quick Setup

### Option 1: Use an Icon Generator Tool

1. Create a 1024x1024px PNG of your icon
2. Use https://www.electronjs.org/apps/electron-icon-maker or similar
3. Place generated files in `build/` directory

### Option 2: Manual Creation

**For macOS:**
```bash
# Install iconutil (comes with Xcode)
mkdir icon.iconset
# Add multiple sizes:
# icon_512x512@2x.png (1024x1024)
# icon_512x512.png (512x512)
# icon_256x256@2x.png (512x512)
# ... etc
iconutil -c icns icon.iconset -o build/icon.icns
```

**For Windows/Linux:**
```bash
# Just save your 512x512 PNG as:
mkdir -p build
cp your-icon.png build/icon.png
```

## Testing Locally

After adding icons:
```bash
npm run electron:build:mac
open "dist-electron/mac-arm64/Family Gradebook.app"
```

The app should now show your custom icon.

## Icon Design Tips

- Use a simple, recognizable design
- Test at small sizes (16x16, 32x32)
- Avoid thin lines or small text
- Use transparent background
- Consider both light and dark backgrounds

## CI/CD

Icons in the `build/` directory will be automatically used by GitHub Actions builds once committed to the repository.
