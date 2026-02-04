#!/usr/bin/env node

/**
 * Release Script
 * Automates the release process: version bump, changelog, git tag, and push
 *
 * Usage:
 *   npm run release:patch          # Create a patch release
 *   npm run release:minor          # Create a minor release
 *   npm run release:major          # Create a major release
 *   npm run release -- --dry-run   # Test without pushing
 */

import { execSync } from 'child_process'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const packagePath = join(__dirname, '../package.json')
const changelogPath = join(__dirname, '../CHANGELOG.md')

// Parse command line arguments
const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
const versionType = args.find(arg => ['major', 'minor', 'patch'].includes(arg)) || 'patch'

const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function exec(command, options = {}) {
  if (isDryRun && options.skipInDryRun) {
    log(`   [DRY RUN] Would execute: ${command}`, 'cyan')
    return ''
  }

  try {
    return execSync(command, { encoding: 'utf8', stdio: 'inherit' })
  } catch (error) {
    log(`❌ Command failed: ${command}`, 'red')
    process.exit(1)
  }
}

function getVersion() {
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'))
  return packageJson.version
}

function updateChangelog(version, skipEdit = false) {
  const date = new Date().toISOString().split('T')[0]
  const newEntry = `\n## [${version}] - ${date}\n\n### Added\n- \n\n### Changed\n- \n\n### Fixed\n- \n\n`

  if (!existsSync(changelogPath)) {
    const initialContent = `# Changelog\n\nAll notable changes to this project will be documented in this file.\n\nThe format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),\nand this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).\n${newEntry}`
    writeFileSync(changelogPath, initialContent)
  } else {
    const content = readFileSync(changelogPath, 'utf8')
    const lines = content.split('\n')

    // Find where to insert (after header)
    let insertIndex = lines.findIndex(line => line.startsWith('## ['))
    if (insertIndex === -1) {
      insertIndex = lines.length
    }

    lines.splice(insertIndex, 0, ...newEntry.split('\n'))
    writeFileSync(changelogPath, lines.join('\n'))
  }

  log(`✅ Updated CHANGELOG.md for version ${version}`, 'green')

  if (!skipEdit) {
    log(`📝 Please edit CHANGELOG.md to add release notes before continuing.`, 'yellow')
    log(`\nPress Enter to continue or Ctrl+C to cancel...`, 'blue')

    // Wait for user input
    execSync('read', { stdio: 'inherit', shell: '/bin/bash' })
  }
}

function release() {
  if (!['major', 'minor', 'patch'].includes(versionType)) {
    log('❌ Invalid version type. Use: major, minor, or patch', 'red')
    log('   Example: npm run release patch', 'yellow')
    log('   Or: npm run release:patch -- --dry-run', 'yellow')
    process.exit(1)
  }

  log('\n' + '='.repeat(60), 'cyan')
  if (isDryRun) {
    log('🧪 DRY RUN MODE - No changes will be pushed to git', 'yellow')
  }
  log(`🚀 Starting ${versionType} release...`, 'cyan')
  log('='.repeat(60) + '\n', 'cyan')

  // 1. Check for uncommitted changes
  if (!isDryRun) {
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' })
      if (status) {
        log('❌ You have uncommitted changes. Please commit or stash them first.', 'red')
        process.exit(1)
      }
    } catch (error) {
      log('❌ Failed to check git status', 'red')
      process.exit(1)
    }
  }

  const oldVersion = getVersion()

  // 2. Bump version
  log(`📦 Bumping ${versionType} version...`, 'yellow')
  exec(`node ${join(__dirname, 'version.js')} ${versionType}`)

  // 3. Get new version
  const newVersion = getVersion()
  log(`   ${oldVersion} → ${newVersion}`, 'green')

  // 4. Generate version file
  log('\n📝 Generating version file...', 'yellow')
  exec(`node ${join(__dirname, 'generate-version.js')}`)

  // 5. Update changelog
  log('\n📋 Updating changelog...', 'yellow')
  updateChangelog(newVersion, isDryRun)

  if (isDryRun) {
    log('\n' + '='.repeat(60), 'cyan')
    log('🧪 DRY RUN COMPLETE', 'yellow')
    log('='.repeat(60), 'cyan')
    log('\n✅ Version bumped and changelog updated locally', 'green')
    log(`   New version: ${newVersion}`, 'green')
    log('\n📝 Review the changes:', 'blue')
    log('   - Check package.json for new version', 'blue')
    log('   - Check CHANGELOG.md for new entry', 'blue')
    log('   - Check src/version.js for generated version', 'blue')
    log('\n⚠️  Git commands that would have run:', 'yellow')
    log('   git add .', 'cyan')
    log(`   git commit -m "chore: release v${newVersion}"`, 'cyan')
    log(`   git tag -a v${newVersion} -m "Release v${newVersion}"`, 'cyan')
    log('   git push', 'cyan')
    log('   git push --tags', 'cyan')
    log('\n🔄 To undo these local changes:', 'blue')
    log('   git restore package.json CHANGELOG.md src/version.js', 'blue')
    log('\n🚀 To actually release:', 'blue')
    log(`   npm run release:${versionType}`, 'blue')
    log('')
    return
  }

  // 6. Git commit
  log('\n💾 Creating git commit...', 'yellow')
  exec('git add .', { skipInDryRun: true })
  exec(`git commit -m "chore: release v${newVersion}"`, { skipInDryRun: true })

  // 7. Create git tag
  log('🏷️  Creating git tag...', 'yellow')
  exec(`git tag -a v${newVersion} -m "Release v${newVersion}"`, { skipInDryRun: true })

  // 8. Push to remote
  log('🚢 Pushing to remote...', 'yellow')
  exec('git push', { skipInDryRun: true })
  exec('git push --tags', { skipInDryRun: true })

  log('\n' + '='.repeat(60), 'cyan')
  log(`✅ Release v${newVersion} complete!`, 'green')
  log('='.repeat(60), 'cyan')
  log(`\n📦 GitHub Actions will now build and publish the release.`, 'blue')
  log(`   Check: https://github.com/espresso20/gradebook/actions`, 'blue')
  log('')
}

release()
