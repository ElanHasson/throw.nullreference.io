import { test, expect } from '@playwright/test'

test.describe('Link Validation', () => {
  test('all internal links should be valid', async ({ page, baseURL }) => {
    // Start from the homepage
    await page.goto('/')

    // Collect all internal links
    const links = await page
      .locator('a[href^="/"]')
      .evaluateAll((elements) => elements.map((el) => el.getAttribute('href')).filter(Boolean))

    // Remove duplicates
    const uniqueLinks = [...new Set(links)]

    // Test each link
    const brokenLinks: string[] = []

    for (const link of uniqueLinks) {
      const response = await page.request.get(link!)
      if (!response.ok()) {
        brokenLinks.push(`${link} - ${response.status()}`)
      }
    }

    // Report broken links
    if (brokenLinks.length > 0) {
      console.error('Broken links found:', brokenLinks)
    }

    expect(brokenLinks).toHaveLength(0)
  })

  test('blog post links should be valid', async ({ page }) => {
    // Navigate to blog page
    await page.goto('/blog/')

    // Get all blog post links
    const blogLinks = await page
      .locator('a[href^="/blog/"]')
      .evaluateAll((elements) => elements.map((el) => el.getAttribute('href')).filter(Boolean))

    const uniqueBlogLinks = [...new Set(blogLinks)]
    const brokenBlogLinks: string[] = []

    for (const link of uniqueBlogLinks) {
      const response = await page.request.get(link!)
      if (!response.ok()) {
        brokenBlogLinks.push(`${link} - ${response.status()}`)
      }
    }

    expect(brokenBlogLinks).toHaveLength(0)
  })

  test('images should load correctly', async ({ page }) => {
    // Check homepage
    await page.goto('/')

    // Wait for images to load
    await page.waitForLoadState('networkidle')

    // Check for broken images
    const brokenImages = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'))
      return images.filter((img) => !img.complete || img.naturalHeight === 0).map((img) => img.src)
    })

    expect(brokenImages).toHaveLength(0)
  })

  test('external links should have correct attributes', async ({ page }) => {
    await page.goto('/blog/')

    // Check that external links have target="_blank" and rel="noopener noreferrer"
    const externalLinks = await page.locator('a[href^="http"]').evaluateAll((elements) =>
      elements.map((el) => ({
        href: el.getAttribute('href'),
        target: el.getAttribute('target'),
        rel: el.getAttribute('rel'),
      })),
    )

    for (const link of externalLinks) {
      expect(link.target).toBe('_blank')
      expect(link.rel).toContain('noopener')
      expect(link.rel).toContain('noreferrer')
    }
  })
})
