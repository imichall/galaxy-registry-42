#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const environments = {
    local: {
        NODE_ENV: 'development',
        NUXT_ENV: 'local',
        NUXT_PUBLIC_API_URL: 'http://localhost:3000',
        NUXT_PUBLIC_APP_NAME: 'Galaxy Registry 42 (Local)',
        NUXT_DEBUG: 'true',
        NUXT_LOG_LEVEL: 'debug',
        NUXT_PUBLIC_ENABLE_DEV_TOOLS: 'true',
        NUXT_PUBLIC_HOT_RELOAD: 'true'
    },
    production: {
        NODE_ENV: 'production',
        NUXT_ENV: 'production',
        NUXT_PUBLIC_API_URL: 'https://your-production-domain.com',
        NUXT_PUBLIC_APP_NAME: 'Galaxy Registry 42',
        NUXT_DEBUG: 'false',
        NUXT_LOG_LEVEL: 'error',
        NUXT_PUBLIC_ENABLE_DEV_TOOLS: 'false',
        NUXT_PUBLIC_HOT_RELOAD: 'false',
        NUXT_SECRET_KEY: 'your-secret-key-here'
    }
}

function createEnvFile(environment) {
    const config = environments[environment]
    if (!config) {
        console.error(`❌ Environment "${environment}" not found. Available environments: ${Object.keys(environments).join(', ')}`)
        process.exit(1)
    }

    const envPath = path.join(process.cwd(), '.env')

    if (fs.existsSync(envPath)) {
        console.log(`⚠️  .env file already exists, overwriting with ${environment} configuration`)
    } else {
        console.log(`📝 .env file not found, creating new ${environment} configuration`)
    }

    const envContent = Object.entries(config)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n')

    try {
        fs.writeFileSync(envPath, envContent)
        console.log(`✅ Environment set to: ${environment}`)
        console.log(`📁 Created .env file with ${Object.keys(config).length} variables`)

        console.log(`🔧 Current settings:`)
        console.log(`   - Node environment: ${config.NODE_ENV}`)
        console.log(`   - API URL: ${config.NUXT_PUBLIC_API_URL}`)
        console.log(`   - Debug mode: ${config.NUXT_DEBUG}`)
    } catch (error) {
        console.error(`❌ Failed to create .env file: ${error.message}`)
        process.exit(1)
    }
}

function showCurrentEnv() {
    const envPath = path.join(process.cwd(), '.env')

    if (!fs.existsSync(envPath)) {
        console.log('❌ No .env file found')
        console.log('💡 Run "npm run env:local" or "npm run env:production" to create one')
        return
    }

    console.log('📄 Current .env file contents:')
    const content = fs.readFileSync(envPath, 'utf8')
    console.log(content)
}

function showHelp() {
    console.log('🌍 Environment Configuration Tool')
    console.log('')
    console.log('Usage:')
    console.log('  node scripts/set-env.js [environment]')
    console.log('  node scripts/set-env.js --show     # Show current .env')
    console.log('  node scripts/set-env.js --help     # Show this help')
    console.log('')
    console.log('Available environments:')
    Object.keys(environments).forEach(env => {
        console.log(`  - ${env}`)
    })
    console.log('')
    console.log('Examples:')
    console.log('  npm run env:local')
    console.log('  npm run env:production')
}

const argument = process.argv[2]

if (!argument || argument === '--help' || argument === '-h') {
    showHelp()
    process.exit(0)
}

if (argument === '--show' || argument === '-s') {
    showCurrentEnv()
    process.exit(0)
}

createEnvFile(argument)