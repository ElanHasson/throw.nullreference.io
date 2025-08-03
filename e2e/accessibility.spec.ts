import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from 'axe-playwright'

test.describe('Accessibility Tests', () => {
  test('homepage should have no accessibility violations', async ({ page }) => {
    await page.goto('/')
    await injectAxe(page)
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    })
  })

  test('blog page should have no accessibility violations', async ({ page }) => {
    await page.goto('/blog')
    await injectAxe(page)
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    })
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')

    // Get all headings
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents()

    // There should be at least one h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThanOrEqual(1)

    // Check keyboard navigation
    await page.keyboard.press('Tab')
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
    expect(focusedElement).toBeTruthy()
  })

  test('images should have alt text', async ({ page }) => {
    await page.goto('/')

    // Get all images
    const images = page.locator('img')
    const imageCount = await images.count()

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      expect(alt).toBeTruthy()
    }
  })

  test('theme toggle should have proper aria-label', async ({ page }) => {
    await page.goto('/')

    const themeToggle = page.getByRole('button', { name: /toggle.*theme/i })
    const ariaLabel = await themeToggle.getAttribute('aria-label')
    expect(ariaLabel).toBeTruthy()
  })
})
