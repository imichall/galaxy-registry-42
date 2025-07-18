// @ts-ignore
export default defineNuxtConfig({
  devtools: {
    enabled: process.env.NODE_ENV !== 'production' && process.env.NUXT_DEBUG === 'true'
  },
  css: ['~/assets/css/main.css'],
  modules: [],

  // Runtime configuration
  runtimeConfig: {
    // Private keys (only available on server-side)
    secretKey: process.env.NUXT_SECRET_KEY || 'default-secret-key',

    // Public keys (exposed to client-side)
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3000',
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'Galaxy Registry 42',
      environment: process.env.NUXT_ENV || 'local',
      enableDevTools: process.env.NUXT_PUBLIC_ENABLE_DEV_TOOLS === 'true',
      debug: process.env.NUXT_DEBUG === 'true'
    }
  },

  app: {
    head: {
      title: process.env.NUXT_PUBLIC_APP_NAME || 'Galaxy Registry 42',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' }
      ]
    }
  },

  // Vite configuration for Vue DevTools
  vite: {
    define: {
      __VUE_PROD_DEVTOOLS__: process.env.NODE_ENV !== 'production'
    }
  },

  // Environment-specific configuration
  ...(process.env.NODE_ENV === 'production' && {
    nitro: {
      minify: true,
      compressPublicAssets: true,
    },
    experimental: {
      payloadExtraction: false
    }
  })
})