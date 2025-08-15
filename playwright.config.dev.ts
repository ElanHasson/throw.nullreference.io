import { defineConfig } from '@playwright/test'
import baseConfig from './playwright.config'

/**
 * Configuration for testing the development server
 */
export default defineConfig({
  ...baseConfig,

  /* Run your local dev server */
  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 minutes for dev server to start
  },
})
