#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function updateNetlifyDomain(newDomain) {
    if (!newDomain) {
        console.error('❌ Please provide a domain name')
        console.log('Usage: node scripts/update-netlify-domain.js your-app-name.netlify.app')
        process.exit(1)
    }

    // Ensure domain starts with https://
    if (!newDomain.startsWith('http')) {
        newDomain = `https://${newDomain}`
    }

    const netlifyTomlPath = path.join(process.cwd(), 'netlify.toml')
    const packageJsonPath = path.join(process.cwd(), 'package.json')

    // Update netlify.toml
    try {
        let netlifyContent = fs.readFileSync(netlifyTomlPath, 'utf8')
        netlifyContent = netlifyContent.replace(
            /NUXT_PUBLIC_API_URL = ".*"/,
            `NUXT_PUBLIC_API_URL = "${newDomain}"`
        )
        fs.writeFileSync(netlifyTomlPath, netlifyContent)
        console.log(`✅ Updated netlify.toml with domain: ${newDomain}`)
    } catch (error) {
        console.error('❌ Failed to update netlify.toml:', error.message)
    }

    // Update package.json build:netlify script
    try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
        const buildScript = packageJson.scripts['build:netlify']

        if (buildScript) {
            const updatedScript = buildScript.replace(
                /NUXT_PUBLIC_API_URL=https:\/\/[^\s]+/,
                `NUXT_PUBLIC_API_URL=${newDomain}`
            )
            packageJson.scripts['build:netlify'] = updatedScript
            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
            console.log('✅ Updated package.json build script')
        }
    } catch (error) {
        console.error('❌ Failed to update package.json:', error.message)
    }

    console.log('')
    console.log('🚀 Next steps:')
    console.log('1. Commit and push changes to your repository')
    console.log('2. Netlify will automatically rebuild with the new domain')
    console.log(`3. Your app will be available at: ${newDomain}`)
}

const domain = process.argv[2]
updateNetlifyDomain(domain)