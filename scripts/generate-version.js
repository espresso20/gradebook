#!/usr/bin/env node

/**
 * Generate Version File
 * Creates a version.js file from package.json
 */

import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const packagePath = join(__dirname, '../package.json')
const versionPath = join(__dirname, '../src/version.js')

// Read version from package.json
const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'))
const version = packageJson.version

// Generate version.js file
const versionFileContent = `// Auto-generated file - do not edit manually
// Generated at: ${new Date().toISOString()}

export const VERSION = '${version}'
export const BUILD_DATE = '${new Date().toISOString()}'
`

writeFileSync(versionPath, versionFileContent)
console.log(`✅ Generated version.js with version ${version}`)
