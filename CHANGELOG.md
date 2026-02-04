# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.6] - 2026-02-04

### Added
- Auto-update functionality using electron-updater
- Automated build and release pipeline with GitHub Actions
- Release automation scripts for version management
- CHANGELOG.md for tracking changes

### Changed
- Package configuration to support GitHub Releases
- Build configuration to generate update-ready packages for all platforms

### Infrastructure
- GitHub Actions workflow for automated builds on Mac, Windows, and Linux
- Semantic versioning workflow with git tags
- Auto-update checking on app startup (production only)

## [1.0.5] - Previous Release

Initial public release with core gradebook functionality.

### Features
- Multi-student course management
- Flexible grading system (simple and advanced scales)
- Weighted grade categories
- GPA calculation
- Attendance tracking with calendar view
- School year management
- Professional report cards
- Export/Import data management
- Dark mode support
- Cross-platform support (macOS, Windows, Linux)
