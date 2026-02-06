# Installation Guide

## macOS Installation

Due to Apple's security requirements, apps not signed with an Apple Developer certificate will show a security warning when first opened.

**Download Format:** We recommend the **ZIP file** for macOS (e.g., `Family-Gradebook-X.X.X-universal-mac.zip`)

### Expected Security Warning

When you try to open the app, you'll see:

> **"Apple could not verify 'Family Gradebook' is free of malware that may harm your Mac or compromise your privacy."**

This is normal for unsigned apps. The app is safe - macOS is just being cautious.

### Method 1: System Settings (Recommended)

**For macOS Ventura (13.0) and newer:**

1. Download the ZIP file from the [latest release](https://github.com/espresso20/gradebook/releases/latest)
2. Extract the ZIP file (double-click it)
3. Drag "Family Gradebook" to your Applications folder
4. Try to open the app from Applications (it will be blocked)
5. Go to **System Settings** → **Privacy & Security**
6. Scroll down to the **Security** section
7. You'll see a message: _"Family Gradebook was blocked from use because it is not from an identified developer"_
8. Click **"Open Anyway"**
9. In the confirmation dialog, click **"Open"**

**After doing this once**, you can open the app normally in the future.

### Method 2: Right-Click to Open

**For macOS Monterey (12.0) and older, or as alternative:**

1. Download and extract the ZIP file
2. Drag "Family Gradebook" to Applications
3. **Right-click** (or Control-click) on "Family Gradebook" in Applications
4. Select **"Open"** from the menu
5. Click **"Open"** in the security dialog

### Method 3: Terminal Command

If the above methods don't work, open Terminal and run:

```bash
xattr -cr "/Applications/Family Gradebook.app"
open "/Applications/Family Gradebook.app"
```

This removes the quarantine flag that macOS applies to downloaded apps.

## Windows Installation

1. Download the `.exe` file from the [latest release](https://github.com/espresso20/gradebook/releases/latest)
2. Run the installer
3. If Windows SmartScreen appears, click "More info" then "Run anyway"
4. Follow the installation wizard
5. Launch from Start Menu or Desktop shortcut

## Linux Installation

1. Download the `.AppImage` file from the [latest release](https://github.com/espresso20/gradebook/releases/latest)
2. Make it executable: `chmod +x Family-Gradebook-*.AppImage`
3. Run it: `./Family-Gradebook-*.AppImage`

Or double-click the file if your file manager supports it.

## Why These Steps Are Needed

Family Gradebook is not currently signed with an Apple Developer certificate (which costs $99/year). This is common for open-source and community apps. The app is safe - macOS is just being cautious about apps from unidentified developers.

**Technical Details:**
- The app is built with universal binaries (works on both Intel and Apple Silicon Macs)
- All source code is open and auditable on GitHub
- Thousands of open-source apps work this way

If this project gains significant adoption, we may invest in Apple Developer signing to remove these extra steps.

## About DMG vs ZIP

We recommend the **ZIP file** for macOS because:
- More reliable installation for unsigned apps
- Avoids filesystem compatibility issues
- Standard format that works across all macOS versions

The **DMG file** is also available but may show additional security warnings and is generally more complex for unsigned apps.

## Troubleshooting

### macOS: "Apple could not verify..." message
This is expected for unsigned apps. Follow Method 1 or Method 2 above.

### macOS: Can't find "Open Anyway" button
- Make sure you tried to open the app first (so macOS knows to block it)
- The button appears in System Settings → Privacy & Security after the first open attempt
- Try Method 3 (terminal command) as an alternative

### macOS: "The application is damaged"
This usually means you're using an older version. Please download the latest release (v1.0.14+) which uses universal binaries.

### Windows: Antivirus flags the app
Some antivirus software may flag unsigned applications. You can add an exception if you trust the source (all code is open source on GitHub).

### App won't open after following steps
1. Make sure you're running a compatible OS version:
   - macOS 10.13 (High Sierra) or later
   - Windows 10 or later
   - Modern Linux distribution
2. Check the [GitHub Issues](https://github.com/espresso20/gradebook/issues) for similar problems
3. Create a new issue with details about your system and error message

## Need Help?

- Check existing [GitHub Issues](https://github.com/espresso20/gradebook/issues)
- Create a new issue if you're still having trouble
- Include your OS version and the exact error message
