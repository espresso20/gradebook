#!/usr/bin/env node

/**
 * Version Management Script
 * Increments the version number and updates package.json
 */

import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const packagePath = join(__dirname, '../package.json')

function incrementVersion(type = 'patch') {
  // Read package.json
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'))
  const currentVersion = packageJson.version

  // Parse version
  const [major, minor, patch] = currentVersion.split('.').map(Number)

  let newVersion
  switch (type) {
    case 'major':
      newVersion = `${major + 1}.0.0`
      break
    case 'minor':
      newVersion = `${major}.${minor + 1}.0`
      break
    case 'patch':
    default:
      newVersion = `${major}.${minor}.${patch + 1}`
      break
  }

  // Update package.json
  packageJson.version = newVersion
  writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n')

  console.log(`✅ Version updated: ${currentVersion} → ${newVersion}`)
  return newVersion
}

// Get version type from command line argument
const versionType = process.argv[2] || 'patch'

if (!['major', 'minor', 'patch'].includes(versionType)) {
  console.error('❌ Invalid version type. Use: major, minor, or patch')
  process.exit(1)
}

incrementVersion(versionType)
