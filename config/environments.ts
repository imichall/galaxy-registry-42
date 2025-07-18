export interface EnvironmentConfig {
  name: string
  apiUrl: string
  appName: string
  debug: boolean
  enableDevTools: boolean
  logLevel: 'debug' | 'info' | 'warn' | 'error'
  features: {
    hotReload: boolean
    analytics: boolean
    errorReporting: boolean
  }
}

export const environments: Record<string, EnvironmentConfig> = {
  local: {
    name: 'local',
    apiUrl: 'http://localhost:3000',
    appName: 'Galaxy Registry 42 (Local)',
    debug: true,
    enableDevTools: true,
    logLevel: 'debug',
    features: {
      hotReload: true,
      analytics: false,
      errorReporting: false
    }
  },

  production: {
    name: 'production',
    apiUrl: 'https://your-production-domain.com',
    appName: 'Galaxy Registry 42',
    debug: false,
    enableDevTools: false,
    logLevel: 'error',
    features: {
      hotReload: false,
      analytics: true,
      errorReporting: true
    }
  }
}

export const getEnvironmentConfig = (env: string = 'local'): EnvironmentConfig => {
  return environments[env] || environments.local
}