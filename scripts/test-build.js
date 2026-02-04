#!/usr/bin/env node

/**
 * Pre-Release Build Testing Script
 * Builds the app for the current platform and validates the output
 */

import { execSync } from 'child_process'
import { existsSync, statSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function exec(command, options = {}) {
  try {
    return execSync(command, {
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    })
  } catch (error) {
    if (!options.silent) {
      log(`❌ Command failed: ${command}`, 'red')
    }
    throw error
  }
}

function getPlatformInfo() {
  const platform = process.platform

  switch (platform) {
    case 'darwin':
      return {
        name: 'macOS',
        buildCommand: 'electron:build:mac',
        outputDir: 'dist-electron',
        expectedFiles: ['.dmg', '.zip'],
        checkFiles: (files) => {
          const dmg = files.find(f => f.endsWith('.dmg'))
          const zip = files.find(f => f.endsWith('.zip'))
          return { dmg, zip }
        }
      }
    case 'win32':
      return {
        name: 'Windows',
        buildCommand: 'electron:build:win',
        outputDir: 'dist-electron',
        expectedFiles: ['.exe'],
        checkFiles: (files) => {
          const exe = files.find(f => f.endsWith('.exe'))
          return { exe }
        }
      }
    case 'linux':
      return {
        name: 'Linux',
        buildCommand: 'electron:build:linux',
        outputDir: 'dist-electron',
        expectedFiles: ['.AppImage'],
        checkFiles: (files) => {
          const appImage = files.find(f => f.endsWith('.AppImage'))
          return { appImage }
        }
      }
    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }
}

function getFileSizeMB(filePath) {
  const stats = statSync(filePath)
  return (stats.size / (1024 * 1024)).toFixed(2)
}

async function runTests() {
  const startTime = Date.now()

  log('\n' + '='.repeat(60), 'cyan')
  log('🧪 PRE-RELEASE BUILD TESTING', 'cyan')
  log('='.repeat(60) + '\n', 'cyan')

  const platform = getPlatformInfo()
  log(`📦 Platform: ${platform.name}`, 'blue')
  log(`🔨 Build Command: npm run ${platform.buildCommand}\n`, 'blue')

  // Step 1: Clean previous builds
  log('🧹 Step 1: Cleaning previous builds...', 'yellow')
  try {
    exec('npm run clean')
    log('✅ Clean complete\n', 'green')
  } catch (error) {
    log('⚠️  Clean failed (this is ok if no previous build exists)\n', 'yellow')
  }

  // Step 2: Build the application
  log('🔨 Step 2: Building application...', 'yellow')
  log('   (This may take a few minutes)\n', 'blue')

  try {
    exec(`npm run ${platform.buildCommand}`)
    log('✅ Build completed successfully\n', 'green')
  } catch (error) {
    log('❌ Build failed!', 'red')
    log('   Check the error messages above for details', 'red')
    process.exit(1)
  }

  // Step 3: Validate output files
  log('🔍 Step 3: Validating build output...', 'yellow')

  const outputDir = join(__dirname, '..', platform.outputDir)

  if (!existsSync(outputDir)) {
    log(`❌ Output directory not found: ${outputDir}`, 'red')
    process.exit(1)
  }

  const allFiles = getAllFiles(outputDir)
  const buildArtifacts = platform.checkFiles(allFiles)

  log(`\n📁 Build artifacts found:`, 'blue')
  let artifactCount = 0

  for (const [type, file] of Object.entries(buildArtifacts)) {
    if (file) {
      artifactCount++
      const fullPath = join(outputDir, file)
      const size = getFileSizeMB(fullPath)
      log(`   ✓ ${type.toUpperCase()}: ${file} (${size} MB)`, 'green')
    } else {
      log(`   ✗ ${type.toUpperCase()}: Not found`, 'red')
    }
  }

  if (artifactCount === 0) {
    log('\n❌ No build artifacts found!', 'red')
    process.exit(1)
  }

  // Step 4: Basic validation checks
  log('\n🔬 Step 4: Running validation checks...', 'yellow')

  const checks = []

  // Check that at least one expected file type exists
  const hasExpectedFiles = platform.expectedFiles.some(ext =>
    allFiles.some(f => f.endsWith(ext))
  )
  checks.push({
    name: 'Expected file types present',
    passed: hasExpectedFiles
  })

  // Check that build artifacts are not empty (at least 1MB)
  const hasValidSize = Object.values(buildArtifacts).some(file => {
    if (!file) return false
    const fullPath = join(outputDir, file)
    const size = getFileSizeMB(fullPath)
    return parseFloat(size) > 1
  })
  checks.push({
    name: 'Build artifacts have valid size (>1MB)',
    passed: hasValidSize
  })

  // Display check results
  log('')
  checks.forEach(check => {
    if (check.passed) {
      log(`   ✅ ${check.name}`, 'green')
    } else {
      log(`   ❌ ${check.name}`, 'red')
    }
  })

  const allChecksPassed = checks.every(c => c.passed)

  // Final summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(1)

  log('\n' + '='.repeat(60), 'cyan')
  if (allChecksPassed) {
    log('✅ BUILD TEST PASSED', 'green')
    log(`\n🎉 Your ${platform.name} build is ready for release!`, 'green')
    log(`⏱️  Total time: ${duration}s`, 'blue')
    log('\n📦 Next steps:', 'cyan')
    log('   1. Manually test the built app to ensure it works', 'blue')
    log(`   2. Find your app in: ${outputDir}`, 'blue')
    log('   3. If everything works, run: npm run release:patch', 'blue')
  } else {
    log('❌ BUILD TEST FAILED', 'red')
    log('\n⚠️  Some validation checks failed', 'yellow')
    log('   Review the errors above and fix before releasing', 'yellow')
    process.exit(1)
  }
  log('='.repeat(60) + '\n', 'cyan')
}

function getAllFiles(dir, fileList = []) {
  const files = readdirSync(dir)

  files.forEach(file => {
    const filePath = join(dir, file)
    try {
      if (statSync(filePath).isDirectory()) {
        getAllFiles(filePath, fileList)
      } else {
        fileList.push(file)
      }
    } catch (error) {
      // Skip files that can't be accessed
    }
  })

  return fileList
}

// Run the tests
runTests().catch(error => {
  log('\n❌ Test script failed with error:', 'red')
  console.error(error)
  process.exit(1)
})
