# Code Signing Guide

## Current Status

The app is currently built with "adhoc" signing (unsigned), which causes macOS Gatekeeper security warnings. See [INSTALLATION.md](INSTALLATION.md) for user workarounds.

## Why Sign Your App?

**Benefits:**
- No security warnings for users
- Professional appearance
- Better user trust
- Required for Mac App Store distribution
- Auto-updates work more reliably

**Cost:**
- $99/year Apple Developer Program membership

## How to Implement Code Signing

### Step 1: Join Apple Developer Program

1. Sign up at https://developer.apple.com/programs/
2. Pay $99/year membership fee
3. Wait for approval (usually 24-48 hours)

### Step 2: Generate Certificates

1. Open **Keychain Access** on your Mac
2. Go to **Keychain Access** > **Certificate Assistant** > **Request a Certificate from a Certificate Authority**
3. Enter your email and select "Saved to disk"
4. Go to https://developer.apple.com/account/resources/certificates
5. Create a **Developer ID Application** certificate
6. Download and install it in Keychain Access

### Step 3: Get Your Team ID

1. Go to https://developer.apple.com/account
2. Find your **Team ID** (looks like: `ABC123XYZ4`)
3. Copy it for use in configuration

### Step 4: Configure electron-builder

Update `package.json` build section:

```json
{
  "build": {
    "appId": "com.family.gradebook",
    "productName": "Family Gradebook",
    "mac": {
      "category": "public.app-category.education",
      "icon": "build/icon.icns",
      "target": ["dmg", "zip"],
      "hardenedRuntime": true,
      "gatekeeperAssess": false,
      "entitlements": "build/entitlements.mac.plist",
      "entitlementsInherit": "build/entitlements.mac.plist",
      "identity": "Developer ID Application: Your Name (TEAMID)"
    },
    "afterSign": "scripts/notarize.js"
  }
}
```

### Step 5: Create Entitlements File

Create `build/entitlements.mac.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
</dict>
</plist>
```

### Step 6: Set Up Notarization (Optional but Recommended)

Notarization is required for macOS 10.15+ to avoid additional warnings.

1. Generate an app-specific password:
   - Go to https://appleid.apple.com
   - Sign In > Security > App-Specific Passwords
   - Generate password and save it

2. Store credentials in Keychain:
```bash
xcrun notarytool store-credentials "notarytool-profile" \
  --apple-id "your-email@example.com" \
  --team-id "ABC123XYZ4" \
  --password "app-specific-password"
```

3. Create `scripts/notarize.js`:

```javascript
const { notarize } = require('@electron/notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    tool: 'notarytool',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID
  });
};
```

4. Install notarization package:
```bash
npm install --save-dev @electron/notarize
```

5. Set environment variables for CI/CD:
```bash
# Local development (add to ~/.zshrc or ~/.bashrc)
export APPLE_ID="your-email@example.com"
export APPLE_PASSWORD="app-specific-password"
export APPLE_TEAM_ID="ABC123XYZ4"

# GitHub Actions (add to repository secrets)
# Settings > Secrets and variables > Actions > New repository secret
APPLE_ID=your-email@example.com
APPLE_PASSWORD=app-specific-password
APPLE_TEAM_ID=ABC123XYZ4
```

6. Update `.github/workflows/release.yml` to pass secrets:

```yaml
- name: Build app
  run: npm run electron:build
  env:
    APPLE_ID: ${{ secrets.APPLE_ID }}
    APPLE_PASSWORD: ${{ secrets.APPLE_PASSWORD }}
    APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}
```

### Step 7: Test Locally

```bash
npm run electron:build:mac
```

After signing, verify the signature:

```bash
codesign -dvv dist-electron/mac-arm64/Family\ Gradebook.app
# Should show: Authority=Developer ID Application: Your Name (TEAMID)

spctl -a -vv dist-electron/mac-arm64/Family\ Gradebook.app
# Should show: accepted
```

### Step 8: Update INSTALLATION.md

Once signed, update INSTALLATION.md to remove the Gatekeeper workaround instructions for macOS.

## Troubleshooting

### "No identity found" error
- Make sure you've installed the Developer ID Application certificate in Keychain Access
- Verify the certificate name matches exactly what's in package.json

### Notarization fails
- Check that your app-specific password is correct
- Ensure your Apple ID has 2FA enabled
- Wait 5-10 minutes - notarization can take time

### Certificate expired
- Certificates last 5 years but need to be renewed
- Renew through Apple Developer portal
- Download and install new certificate

## Cost-Benefit Analysis

**If you plan to:**
- Distribute to many users → **Worth it**
- Sell the app → **Required**
- Publish to Mac App Store → **Required**
- Just personal use / few users → **Not necessary**

## Alternative: Community Code Signing

Some open-source projects use:
- **Open Source Developer Certificate** (Apple sometimes provides for major projects)
- **Community signing parties** (not recommended for automated builds)
- **Transparency**: Document why app is unsigned and how to verify source

For now, the unsigned approach is fine for a personal/community project. Users just need to follow the steps in INSTALLATION.md.
