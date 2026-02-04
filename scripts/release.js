#!/usr/bin/env node

/**
 * Release Script
 * Automates the release process: version bump, changelog, git tag, and push
 */

import { execSync } from 'child_process'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const packagePath = join(__dirname, '../package.json')
const changelogPath = join(__dirname, '../CHANGELOG.md')

function exec(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'inherit' })
  } catch (error) {
    console.error(`❌ Command failed: ${command}`)
    process.exit(1)
  }
}

function getVersion() {
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'))
  return packageJson.version
}

function updateChangelog(version) {
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

  console.log(`✅ Updated CHANGELOG.md for version ${version}`)
  console.log(`📝 Please edit CHANGELOG.md to add release notes before continuing.`)
  console.log(`\nPress Enter to continue or Ctrl+C to cancel...`)

  // Wait for user input
  execSync('read', { stdio: 'inherit', shell: '/bin/bash' })
}

function release() {
  // Get version type from command line
  const versionType = process.argv[2] || 'patch'

  if (!['major', 'minor', 'patch'].includes(versionType)) {
    console.error('❌ Invalid version type. Use: major, minor, or patch')
    console.error('   Example: npm run release patch')
    process.exit(1)
  }

  console.log(`\n🚀 Starting ${versionType} release...\n`)

  // 1. Check for uncommitted changes
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' })
    if (status) {
      console.error('❌ You have uncommitted changes. Please commit or stash them first.')
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Failed to check git status')
    process.exit(1)
  }

  // 2. Bump version
  console.log(`📦 Bumping ${versionType} version...`)
  exec(`node ${join(__dirname, 'version.js')} ${versionType}`)

  // 3. Get new version
  const newVersion = getVersion()

  // 4. Generate version file
  console.log('📝 Generating version file...')
  exec(`node ${join(__dirname, 'generate-version.js')}`)

  // 5. Update changelog
  console.log('📋 Updating changelog...')
  updateChangelog(newVersion)

  // 6. Git commit
  console.log('💾 Creating git commit...')
  exec('git add .')
  exec(`git commit -m "chore: release v${newVersion}"`)

  // 7. Create git tag
  console.log('🏷️  Creating git tag...')
  exec(`git tag -a v${newVersion} -m "Release v${newVersion}"`)

  // 8. Push to remote
  console.log('🚢 Pushing to remote...')
  exec('git push')
  exec('git push --tags')

  console.log(`\n✅ Release v${newVersion} complete!`)
  console.log(`\n📦 GitHub Actions will now build and publish the release.`)
  console.log(`   Check: https://github.com/espresso20/gradebook/actions`)
}

release()
