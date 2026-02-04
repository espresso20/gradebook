# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Family Gradebook** - An Electron desktop application for homeschool families to track students, courses, grades, and attendance.

- **Type**: Electron + React + Vite desktop app
- **Version**: 1.0.9
- **Repository**: https://github.com/espresso20/gradebook
- **Primary Maintainer**: Adam Roffler (espresso20)

## Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite 5** - Build tool and dev server
- **Tailwind CSS 3** - Styling
- **React Router Dom 6** - Routing
- **Lucide React** - Icon library
- **date-fns** - Date utilities

### Desktop
- **Electron 27** - Desktop app wrapper
- **electron-builder 24** - Build and packaging
- **electron-updater 6** - Auto-update functionality

### Development
- **Node.js 16+** required
- **npm 7+** for package management

## Application Architecture

### Data Flow
- **State Management**: React useState/useEffect at App.jsx root level
- **Data Store**: `src/lib/store.js` - localStorage-based persistence layer
- **Grade Calculations**: `src/lib/database.js` - weighted averages, GPA, letter grades
- **Routing**: React Router with conditional rendering based on student existence

### Key Architectural Patterns

**1. Conditional App Flow**
The app has two distinct states managed in `App.jsx`:
- **No Students**: Shows Welcome page, limits navigation
- **Has Students**: Full app with Dashboard, profiles, courses, attendance

**2. Data Persistence**
- All data stored in browser localStorage with `gradebook_` prefix
- Keys: `students`, `school_years`, `courses`, `grades`, `attendance`, `settings`
- Export/import as JSON for backups
- No backend or database - fully offline

**3. Grade Calculation System**
- **Categories**: Tests, Quizzes, Homework with custom weights
- **Weighted Grades**: Each category averaged, then weighted by percentage
- **Attendance Impact**: Optional 33% contribution to final grade (configurable per course)
- **Letter Grades**: Two grading scales (simple A-F or advanced A+/A/A-)
- **GPA**: Calculated from letter grades × credit hours

**4. School Year Management**
- Multiple school years with start/end dates
- One active year at a time
- Historical data preserved when creating new years
- Year switching affects all views and reports

## Project Structure

```
gradebook/
├── electron/              # Electron main process
│   ├── main.cjs          # Main process entry, auto-updater config
│   └── preload.cjs       # IPC bridge
├── src/
│   ├── App.jsx           # Root component, routing, state management
│   ├── main.jsx          # React entry point
│   ├── pages/            # Route components (Dashboard, StudentProfile, etc.)
│   ├── components/       # Reusable UI (Layout, Sidebar, Modals)
│   ├── lib/
│   │   ├── store.js      # localStorage abstraction layer
│   │   └── database.js   # Grade calculation logic
│   └── version.js        # Auto-generated (DO NOT EDIT)
├── scripts/              # Automation
│   ├── release.js        # Full release workflow
│   ├── test-build.js     # Pre-release validation
│   ├── version.js        # Semver bumping
│   └── generate-version.js # Creates src/version.js
└── .github/workflows/
    └── release.yml       # CI/CD for multi-platform builds
```

## Development Workflow

### Local Development

**Web Development Mode** (faster, for UI work):
```bash
npm run dev
# Opens http://localhost:5173
# Hot reload enabled
```

**Electron Development Mode** (for testing desktop features):
```bash
npm run electron:dev
# Runs Vite dev server + Electron window
# Auto-restart on changes
```

### Building for Production

**Platform-Specific Builds**:
```bash
npm run electron:build:mac    # macOS .dmg + .zip
npm run electron:build:win    # Windows .exe
npm run electron:build:linux  # Linux .AppImage
```

**All Platforms** (if on macOS with Windows/Linux builders):
```bash
npm run electron:build
```

Output goes to `dist-electron/` directory.

## Testing Workflow

### Pre-Release Testing (Important!)

Before creating a release, run the automated build test:

```bash
npm run test:build
```

This script:
1. Cleans previous builds
2. Builds the app for your current platform
3. Validates output files exist and have valid size
4. Reports success/failure with details

**Expected Output**:
- macOS: `.dmg` and `.zip` files (>1MB each)
- Windows: `.exe` file (>1MB)
- Linux: `.AppImage` file (>1MB)

After automated tests pass:
1. Manually launch the built app from `dist-electron/`
2. Test core functionality (add student, add course, add grade)
3. Verify the UI looks correct

## Release Process

### Semantic Versioning

This project follows [Semantic Versioning](https://semver.org/):
- **Patch** (1.0.6 → 1.0.7): Bug fixes, small improvements
- **Minor** (1.0.6 → 1.1.0): New features, backwards compatible
- **Major** (1.0.6 → 2.0.0): Breaking changes

### Dry Run Release (Test Without Pushing)

Test the release workflow without pushing to git:

```bash
npm run release:dry-run
```

This will:
- Bump version locally
- Update CHANGELOG.md locally
- Show what git commands would run
- Provide instructions to undo changes

Review the changes, then restore if needed:
```bash
git restore package.json CHANGELOG.md src/version.js
```

### Creating a Release

**Prerequisites**:
- All changes committed
- Build tests passing (`npm run test:build`)
- CHANGELOG ready with notes

**Release Commands**:
```bash
npm run release:patch   # Bug fixes (1.0.6 → 1.0.7)
npm run release:minor   # New features (1.0.6 → 1.1.0)
npm run release:major   # Breaking changes (1.0.6 → 2.0.0)
```

**What Happens**:
1. Version bumped in `package.json`
2. `src/version.js` regenerated
3. CHANGELOG.md updated with new entry (you'll be prompted to edit)
4. Git commit created: `chore: release vX.X.X`
5. Git tag created: `vX.X.X`
6. Changes and tag pushed to GitHub
7. GitHub Actions triggered (builds all platforms)
8. GitHub Release created with binaries attached

**Monitor Build**:
- GitHub Actions: https://github.com/espresso20/gradebook/actions
- Build takes ~10-15 minutes
- Releases appear at: https://github.com/espresso20/gradebook/releases

### GitHub Actions CI/CD

**Workflow**: `.github/workflows/release.yml`

**Triggers**: Git tags matching `v*.*.*` (e.g., `v1.0.7`)

**Build Matrix**:
- macOS (macos-latest)
- Windows (windows-latest)
- Linux (ubuntu-latest)

**Outputs**:
- macOS: `.dmg` and `.zip`
- Windows: `.exe` (NSIS installer)
- Linux: `.AppImage`

**Cost**: FREE (unlimited minutes on public repos)

## Auto-Update System

**Implementation**: electron-updater

**Configuration**:
- Main process: `electron/main.cjs` (lines with autoUpdater)
- Package config: `package.json` build.publish section
- Update source: GitHub Releases

**Behavior**:
- Checks for updates 3 seconds after app launch (production only)
- Shows in-app notification when update available
- User can download and install via IPC messages
- Auto-installs on next app restart

**IPC Channels**:
- `update-available` - New version found
- `download-progress` - Download progress updates
- `update-downloaded` - Ready to install
- `download-update` - User requests download
- `install-update` - User requests install

## Important Notes

### File Locations

**Generated Files** (don't edit manually):
- `src/version.js` - Auto-generated from package.json
- `dist/` - Vite build output
- `dist-electron/` - Electron build output

**Configuration Files**:
- `package.json` - Main config (version, scripts, dependencies)
- `vite.config.js` - Vite build config
- `tailwind.config.js` - Tailwind styling config
- `electron/main.cjs` - Electron main process

### Data Storage

- **Storage**: Browser localStorage (keys prefixed with `gradebook_`)
- **Location**: Electron user data directory
- **Persistence**: `src/lib/store.js` manages all CRUD operations
- **Export/Import**: JSON format for full backup/restore
- **No Backend**: Completely offline, privacy-focused

### Common Issues

**Build Fails with "Could not resolve ../version"**:
- Missing `src/version.js` - run `npm run generate:version` before building
- All `electron:build:*` commands now include this step automatically

**CI Build Fails with 403 Forbidden**:
- GitHub Actions needs `permissions: contents: write` in workflow
- Already fixed in `.github/workflows/release.yml`

**Auto-Updater Not Working**:
- Only works in production builds (not dev mode)
- Requires valid GitHub Release with proper semver tag
- Check `electron/main.cjs` has correct repository config (espresso20/gradebook)

**GitHub Actions Transient Failures**:
- Node.js download timeouts occasionally happen
- Use "Re-run failed jobs" button in GitHub Actions UI
- Not a code issue - infrastructure hiccup

## Best Practices

### Before Committing
- Test in both web and electron modes
- Run `npm run test:build` before releases
- Update CHANGELOG.md with meaningful notes

### Release Checklist
- [ ] All features tested locally
- [ ] `npm run test:build` passes
- [ ] CHANGELOG updated with user-facing changes
- [ ] No uncommitted changes
- [ ] README reflects any new features/changes

### Code Style
- **Styling**: Tailwind CSS only (no custom CSS files except index.css)
- **React**: Functional components with hooks, no class components
- **Modules**: ES modules (import/export) in React code
- **Electron**: CommonJS (.cjs) for main process and preload scripts
- **State**: Prop drilling from App.jsx root (no Redux/Context)
- **Colors**: Custom Tailwind theme with terracotta, sage, gold, cream palette

## Useful Commands

```bash
# Development
npm run dev                  # Web dev server
npm run electron:dev         # Electron dev mode

# Building
npm run test:build           # Automated build test
npm run electron:build:mac   # Build for macOS
npm run electron:build:win   # Build for Windows
npm run electron:build:linux # Build for Linux

# Release
npm run release:dry-run      # Test release without pushing
npm run release:patch        # Create patch release
npm run release:minor        # Create minor release
npm run release:major        # Create major release

# Version Management
npm run version:patch        # Bump patch version only
npm run version:minor        # Bump minor version only
npm run version:major        # Bump major version only
npm run generate:version     # Regenerate src/version.js

# Cleanup
npm run clean                # Remove dist directories
```

## Architecture Decisions

### Why Electron?
- Desktop app with offline-first approach
- Local data storage for privacy
- Cross-platform with native installers
- No need for backend infrastructure

### Why Vite?
- Fast dev server with HMR
- Modern build tooling
- Easy React integration
- Better DX than webpack

### Why electron-updater?
- GitHub Releases integration
- Auto-update without complex server setup
- Free for open-source projects
- Industry standard

### Why Semantic Versioning?
- Clear communication of changes
- Industry standard
- Works well with automated tooling
- Users understand impact of updates
