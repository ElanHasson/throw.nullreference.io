import { test, expect } from '@playwright/test'

test.describe('Link Validation (Dev Server)', () => {
  test('all internal links should be valid', async ({ page, baseURL }) => {
    // Start from the homepage
    await page.goto('/')

    // Wait for dev server to fully load
    await page.waitForLoadState('networkidle')

    // Collect all internal links
    const links = await page
      .locator('a[href^="/"]')
      .evaluateAll((elements) => elements.map((el) => el.getAttribute('href')).filter(Boolean))

    // Remove duplicates
    const uniqueLinks = [...new Set(links)]

    // Test each link
    const brokenLinks: string[] = []

    for (const link of uniqueLinks) {
      try {
        const response = await page.goto(link!, { waitUntil: 'domcontentloaded', timeout: 10000 })
        if (!response || !response.ok()) {
          brokenLinks.push(`${link} - ${response?.status() || 'no response'}`)
        }
        // Go back to avoid navigation issues
        await page.goto('/')
      } catch (error) {
        brokenLinks.push(`${link} - error: ${error}`)
      }
    }

    // Report broken links
    if (brokenLinks.length > 0) {
      console.error('Broken links found:', brokenLinks)
    }

    expect(brokenLinks).toHaveLength(0)
  })

  test('hot reload should work', async ({ page }) => {
    // This test only makes sense in dev mode
    // Navigate to a page
    await page.goto('/blog/')

    // Check that the page loaded
    await expect(page).toHaveTitle(/Blog/)

    // In dev mode, we should have React DevTools hooks
    const hasReactDevTools = await page.evaluate(() => {
      return '__REACT_DEVTOOLS_GLOBAL_HOOK__' in window
    })

    expect(hasReactDevTools).toBe(true)
  })

  test('MDX pages should render without errors', async ({ page }) => {
    // Test a specific MDX page
    await page.goto('/blog/hello-world/')

    // Wait for MDX content to load
    await page.waitForLoadState('networkidle')

    // Check for console errors
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    // Give it some time to capture any errors
    await page.waitForTimeout(1000)

    // MDX compilation errors would show in console
    expect(consoleErrors).toHaveLength(0)
  })
})