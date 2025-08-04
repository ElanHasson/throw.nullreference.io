import { defineConfig } from '@playwright/test'
import baseConfig from './playwright.config'

/**
 * Configuration for testing the static built site
 */
export default defineConfig({
  ...baseConfig,

  /* Run your local server with the built static files */
  webServer: {
    command: 'npx serve@latest out -p 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
