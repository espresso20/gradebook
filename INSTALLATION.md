# Installation Guide

## macOS Installation

Due to Apple's security requirements, apps not signed with an Apple Developer certificate will show a security warning when first opened.

### Method 1: Right-Click to Open (Recommended)

1. Download the `.dmg` file from the [latest release](https://github.com/espresso20/gradebook/releases/latest)
2. Open the `.dmg` file and drag "Family Gradebook" to your Applications folder
3. **Right-click** (or Control-click) on "Family Gradebook" in Applications
4. Select **"Open"** from the menu
5. Click **"Open"** in the security dialog

After doing this once, you can open the app normally in the future.

### Method 2: Terminal Command

If right-click doesn't work, open Terminal and run:

```bash
xattr -cr "/Applications/Family Gradebook.app"
```

Then open the app normally.

### Method 3: System Settings

If you see a "damaged" or "can't be opened" error:

1. Try to open the app (it will be blocked)
2. Go to **System Settings** > **Privacy & Security**
3. Scroll down to find a message about "Family Gradebook"
4. Click **"Open Anyway"**
5. Confirm by clicking **"Open"**

## Windows Installation

1. Download the `.exe` file from the [latest release](https://github.com/espresso20/gradebook/releases/latest)
2. Run the installer
3. If Windows SmartScreen appears, click "More info" then "Run anyway"

## Linux Installation

1. Download the `.AppImage` file from the [latest release](https://github.com/espresso20/gradebook/releases/latest)
2. Make it executable: `chmod +x Family.Gradebook-*.AppImage`
3. Run it: `./Family.Gradebook-*.AppImage`

## Why These Steps Are Needed

Family Gradebook is not currently signed with an Apple Developer certificate (which costs $99/year). This is a common situation for open-source and community apps. The app is safe - macOS is just being cautious about unsigned apps from the internet.

If this project gains enough users, we may invest in code signing to remove these extra steps.

## Troubleshooting

### macOS: "The application is damaged"
This is actually a security warning, not real damage. Use one of the methods above to bypass Gatekeeper.

### Windows: Antivirus flags the app
Some antivirus software may flag unsigned applications. You can add an exception if you trust the source.

### App won't open after following steps
1. Make sure you're running a compatible OS version (macOS 10.13+, Windows 10+, modern Linux)
2. Check the [GitHub Issues](https://github.com/espresso20/gradebook/issues) for similar problems
3. Create a new issue with details about your system and error message
