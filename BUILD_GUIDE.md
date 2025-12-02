# Build Guide - Family Gradebook

This guide explains how to build the Family Gradebook desktop application.

## Quick Build (Recommended)

### Option 1: Using the build script (Mac/Linux)

```bash
cd /Users/roffler/Documents/gradebook-app
./build.sh
```

### Option 2: Using npm scripts

```bash
# Build for your current platform (cleans first)
npm run electron:build

# Or build for specific platforms
npm run electron:build:mac      # macOS only
npm run electron:build:win      # Windows only
npm run electron:build:linux    # Linux only
```

## What the Build Does

1. **Cleans old builds** - Removes `dist/` and `dist-electron/` folders
2. **Builds React app** - Uses Vite to compile your React app into static files
3. **Builds Electron app** - Packages everything into a native desktop application

## Build Output

After building, you'll find:

### macOS
```
dist-electron/mac/Family Gradebook.app
```

### Windows
```
dist-electron/win/Family Gradebook Setup.exe
```

### Linux
```
dist-electron/linux/Family Gradebook.AppImage
```

## Installation After Build

### macOS

1. **Locate the app:**
   ```bash
   open dist-electron/mac
   ```

2. **Remove old version (if exists):**
   ```bash
   rm -rf /Applications/Family\ Gradebook.app
   ```

3. **Install new version:**
   - Drag `Family Gradebook.app` to Applications folder
   - Or use command line:
   ```bash
   cp -r "dist-electron/mac/Family Gradebook.app" /Applications/
   ```

4. **First launch:**
   - If you see "unidentified developer" warning:
     - Right-click app → Open → Open
   - Or use Terminal:
   ```bash
   xattr -cr "/Applications/Family Gradebook.app"
   open "/Applications/Family Gradebook.app"
   ```

### Windows

1. Run `Family Gradebook Setup.exe`
2. Follow installation wizard
3. App will be in Start Menu

### Linux

1. Make AppImage executable:
   ```bash
   chmod +x Family-Gradebook.AppImage
   ```

2. Run it:
   ```bash
   ./Family-Gradebook.AppImage
   ```

## Troubleshooting

### Build Fails with "electron-builder not found"

```bash
npm install
```

### Build Fails with Permission Error

```bash
chmod +x build.sh
npm run clean
```

### Old App Still Opening

macOS caches apps. Clear the cache:

```bash
# Remove old app completely
rm -rf /Applications/Family\ Gradebook.app

# Clear macOS launch services cache
/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -kill -r -domain local -domain system -domain user

# Install fresh build
cp -r "dist-electron/mac/Family Gradebook.app" /Applications/
```

### "Code signing" Errors

For development builds, code signing is disabled. If you see errors, add to `package.json`:

```json
"build": {
  "mac": {
    "identity": null
  }
}
```

### App Opens but Shows White Screen

Check the console in development mode:

```bash
npm run electron:dev
```

Look for JavaScript errors. Common issues:
- Missing files in `dist/` folder
- Incorrect paths in `electron/main.js`

### Data Not Persisting

Electron uses a different localStorage location than browsers. Your data is stored at:

**macOS:**
```
~/Library/Application Support/Family Gradebook/
```

**Windows:**
```
%APPDATA%/Family Gradebook/
```

**Linux:**
```
~/.config/Family Gradebook/
```

## Clean Build (Recommended)

Always do a clean build when:
- Pushing to GitHub
- Creating a release
- After making changes to Electron config
- After fixing bugs

```bash
npm run electron:build
```

This automatically cleans and rebuilds everything fresh.

## Build for Distribution

### Creating a Release

1. **Update version in package.json:**
   ```json
   "version": "1.0.1"
   ```

2. **Clean build:**
   ```bash
   npm run electron:build
   ```

3. **Test the build:**
   - Install and test on your machine
   - Check all features work
   - Test dark mode
   - Test data export/import

4. **Create GitHub Release:**
   - Go to your repository
   - Releases → Create new release
   - Tag: `v1.0.1`
   - Upload the built files:
     - `dist-electron/mac/Family Gradebook.app` (zip it first)
     - `dist-electron/win/Family Gradebook Setup.exe`
     - `dist-electron/linux/Family Gradebook.AppImage`

### Code Signing (Optional)

For distribution outside your personal use:

**macOS:**
1. Get an Apple Developer account ($99/year)
2. Create a Developer ID certificate
3. Update `package.json`:
   ```json
   "build": {
     "mac": {
       "identity": "Developer ID Application: Your Name (TEAMID)"
     }
   }
   ```

**Windows:**
1. Get a code signing certificate
2. Update `package.json`:
   ```json
   "build": {
     "win": {
       "certificateFile": "path/to/cert.pfx",
       "certificatePassword": "password"
     }
   }
   ```

## Development vs Production

### Development Build
```bash
npm run electron:dev
```
- Hot reload
- DevTools open
- Loads from `http://localhost:5173`
- Faster iteration

### Production Build
```bash
npm run electron:build
```
- Optimized bundle
- No DevTools
- Loads from `dist/index.html`
- Ready for distribution

## Build Configuration

All build settings are in `package.json` under the `"build"` section:

```json
"build": {
  "appId": "com.family.gradebook",
  "productName": "Family Gradebook",
  "directories": {
    "output": "dist-electron"
  },
  "files": [
    "dist/**/*",
    "electron/**/*"
  ],
  "mac": {
    "category": "public.app-category.education",
    "icon": "build/icon.icns"  // Optional: Add app icon
  },
  "win": {
    "target": "nsis",
    "icon": "build/icon.ico"  // Optional: Add app icon
  },
  "linux": {
    "target": "AppImage",
    "icon": "build/icon.png"  // Optional: Add app icon
  }
}
```

## Adding an App Icon (Optional)

1. Create icons in the required formats:
   - macOS: `build/icon.icns` (512x512 PNG)
   - Windows: `build/icon.ico` (256x256 ICO)
   - Linux: `build/icon.png` (512x512 PNG)

2. Use a tool like [electron-icon-builder](https://www.npmjs.com/package/electron-icon-builder):
   ```bash
   npm install --save-dev electron-icon-builder
   ```

3. Put your source icon (1024x1024 PNG) in `build/icon.png`

4. Build will automatically use the icons

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run dev` | Start web dev server |
| `npm run build` | Build React app only |
| `npm run electron:dev` | Run Electron in dev mode |
| `npm run clean` | Remove build folders |
| `npm run electron:build` | Clean + build for current OS |
| `npm run electron:build:mac` | Build macOS app |
| `npm run electron:build:win` | Build Windows app |
| `npm run electron:build:linux` | Build Linux app |

## Next Steps

After building:
1. Test the app thoroughly
2. Export your data before distributing (Settings → Export)
3. Create a GitHub release with built files
4. Share with the homeschool community!

---

**Need help?** Check the main [README.md](README.md) or open an issue on GitHub.
