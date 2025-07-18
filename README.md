# Galaxy Registry 42

User Data Management System

## Environment Configuration

This project supports multiple environments with different configurations.

### Available Environments

- **local** - Local development environment
- **production** - Production environment

### Setting Up Environment

1. **Automatic Setup (Recommended)**
   ```bash
   # Set local environment
   npm run env:local

   # Set production environment
   npm run env:production
   ```

2. **Manual Setup**
   ```bash
   # Copy example environment file
   cp .env.example .env

   # Edit .env file with your values
   ```

### Environment Variables

| Variable | Description | Local Default | Production Default |
|----------|-------------|---------------|-------------------|
| `NODE_ENV` | Node environment | `development` | `production` |
| `NUXT_ENV` | Nuxt environment | `local` | `production` |
| `NUXT_PUBLIC_API_URL` | API base URL | `http://localhost:3000` | Your production URL |
| `NUXT_PUBLIC_APP_NAME` | Application name | `Galaxy Registry 42 (Local)` | `Galaxy Registry 42` |
| `NUXT_DEBUG` | Enable debug mode | `true` | `false` |
| `NUXT_PUBLIC_ENABLE_DEV_TOOLS` | Enable dev tools | `true` | `false` |

### Development Commands

```bash
# Environment management
npm run env:local          # Set local environment
npm run env:production     # Set production environment
npm run env:show           # Show current .env file
npm run env:help           # Show environment help

# Development
npm run dev:local          # Start with local environment
npm run dev                # Start with current .env

# Production
npm run build:production   # Build for production
npm run preview            # Preview production build
node .output/server/index.mjs  # Run production server directly
```

### Using Environment in Code

```typescript
// In any Vue component or composable
const { environment, isLocal, isProduction, apiUrl, log } = useEnvironment()

// Log environment-specific messages
log('This is a debug message')

// Get API endpoint
const endpoint = getApiEndpoint('users')

// Check environment
if (isLocal) {
  // Local-specific code
}
```

## Production Deployment

### Building for Production

```bash
npm run env:production     # Set production environment
npm run build             # Build the application
node .output/server/index.mjs  # Start production server
```

The production server will run on **http://localhost:3000**

### Production Features

- **Vue DevTools**: Disabled in production for security
- **Nuxt DevTools**: Disabled in production
- **Debug logging**: Disabled
- **Code minification**: Enabled
- **Asset compression**: Enabled

### Environment Differences

| Feature | Local Development | Production |
|---------|------------------|------------|
| Vue DevTools | ✅ Enabled | ❌ Disabled |
| Nuxt DevTools | ✅ Enabled | ❌ Disabled |
| Debug Logs | ✅ Enabled | ❌ Disabled |
| Hot Reload | ✅ Enabled | ❌ Disabled |
| Minification | ❌ Disabled | ✅ Enabled |

## Installation

```bash
npm install
npm run env:local
npm run dev
```

## Features

- 📊 Tree table with characters, nemesis and secrets
- 🔄 Expand and collapse nested tables
- ❌ Delete records with confirmation dialog
- 🎨 Clean and responsive CSS design

## Data Structure

The data contains characters with hierarchy:
- **Characters** - main characters
- **Nemesis** - enemies of characters
- **Secrets** - secret codes of nemesis

## Technology Stack

- Nuxt 3
- Vue 3 Composition API
- TypeScript
- CSS