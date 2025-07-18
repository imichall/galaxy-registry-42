import { useRuntimeConfig } from 'nuxt/app'

export const useEnvironment = () => {
  const config = useRuntimeConfig() as any

  // Environment detection
  const isLocal = config.public.environment === 'local'
  const isProduction = config.public.environment === 'production'
  const isDevelopment = !isProduction

  // Environment-specific values
  const apiUrl = config.public.apiUrl
  const appName = config.public.appName
  const debug = config.public.debug
  const enableDevTools = config.public.enableDevTools

  // Environment-specific methods
  const log = (message: string, level: 'info' | 'warn' | 'error' = 'info') => {
    if (debug || isDevelopment) {
      console[level](`[${config.public.environment.toUpperCase()}] ${message}`)
    }
  }

  const getApiEndpoint = (endpoint: string) => {
    return `${apiUrl}/api/${endpoint.replace(/^\//, '')}`
  }

  return {
    // Environment flags
    isLocal,
    isProduction,
    isDevelopment,

    // Configuration values
    apiUrl,
    appName,
    debug,
    enableDevTools,
    environment: config.public.environment,

    // Helper methods
    log,
    getApiEndpoint,

    // Raw config access
    config
  }
}