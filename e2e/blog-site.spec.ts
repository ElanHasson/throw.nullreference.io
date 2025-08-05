import { test, expect } from '@playwright/test'

test.describe('Blog Site E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage before each test
    await page.goto('/')
  })

  test('should display homepage with correct branding and header', async ({ page }) => {
    // Verify the page loads successfully
    await expect(page).toHaveTitle(/throw.nullreference.io/i)
    
    // Verify the header is visible and sticky
    const header = page.locator('header')
    await expect(header).toBeVisible()
    await expect(header).toHaveClass(/sticky/)
    
    // Verify the main branding text "Throwin' Exceptions"
    const brandingText = page.locator('text="Throwin\' Exceptions"').first()
    await expect(brandingText).toBeVisible()
    
    // Verify the branding link goes to homepage
    const brandingLink = page.locator('a[href="/"]').filter({ hasText: "Throwin' Exceptions" })
    await expect(brandingLink).toBeVisible()
  })

  test('should have all navigation links visible and functional', async ({ page }) => {
    // Verify Blog navigation link
    const blogLink = page.locator('nav a[href="/blog"]')
    await expect(blogLink).toBeVisible()
    await expect(blogLink).toHaveText('Blog')
    
    // Verify Series navigation link  
    const seriesLink = page.locator('nav a[href="/series"]')
    await expect(seriesLink).toBeVisible()
    await expect(seriesLink).toHaveText('Series')
    
    // Verify Topics navigation link
    const topicsLink = page.locator('nav a[href="/topics"]')
    await expect(topicsLink).toBeVisible()
    await expect(topicsLink).toHaveText('Topics')
    
    // Verify Search link in header
    const searchLink = page.locator('a[href="/search"][aria-label="Search"]')
    await expect(searchLink).toBeVisible()
  })

  test('should have working theme toggle functionality', async ({ page }) => {
    // Find the theme toggle button
    const themeToggle = page.locator('button[aria-label="Toggle theme"]')
    await expect(themeToggle).toBeVisible()
    
    // Get initial theme state by checking for dark class on html element
    const html = page.locator('html')
    const initialTheme = await html.getAttribute('class')
    const isDarkInitially = initialTheme?.includes('dark') ?? false
    
    // Click the theme toggle
    await themeToggle.click()
    
    // Wait for theme change and verify it switched
    await page.waitForTimeout(500) // Allow time for theme transition
    const newTheme = await html.getAttribute('class')
    const isDarkAfterClick = newTheme?.includes('dark') ?? false
    
    // Verify theme actually changed
    expect(isDarkAfterClick).not.toBe(isDarkInitially)
    
    // Click again to toggle back
    await themeToggle.click()
    await page.waitForTimeout(500)
    const finalTheme = await html.getAttribute('class')
    const isDarkFinal = finalTheme?.includes('dark') ?? false
    
    // Verify theme switched back to original state
    expect(isDarkFinal).toBe(isDarkInitially)
  })

  test('should navigate to blog page successfully', async ({ page }) => {
    // Click on the Blog navigation link
    const blogLink = page.locator('nav a[href="/blog"]')
    await blogLink.click()
    
    // Verify we're on the blog page
    await expect(page).toHaveURL('/blog')
    
    // Verify the page loads with content
    await expect(page.locator('h1, h2').first()).toBeVisible()
    
    // Verify header is still present on blog page
    const header = page.locator('header')
    await expect(header).toBeVisible()
    
    // Verify branding link still works from blog page
    const brandingLink = page.locator('a[href="/"]').filter({ hasText: "Throwin' Exceptions" })
    await expect(brandingLink).toBeVisible()
  })

  test('should display footer with correct content and links', async ({ page }) => {
    // Find the footer element
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    
    // Verify footer branding
    const footerBranding = footer.locator('text="Throwin\' Exceptions"')
    await expect(footerBranding).toBeVisible()
    
    // Verify footer description
    const description = footer.locator('text*="A blog about software development"')
    await expect(description).toBeVisible()
    
    // Verify social media links
    const githubLink = footer.locator('a[href="https://github.com/ElanHasson"][aria-label="GitHub"]')
    await expect(githubLink).toBeVisible()
    
    const mastodonLink = footer.locator('a[href="https://publicsquare.global/@elan"][aria-label="Mastodon"]')
    await expect(mastodonLink).toBeVisible()
    
    const linkedinLink = footer.locator('a[href="https://linkedin.com/in/ElanHasson"][aria-label="LinkedIn"]')
    await expect(linkedinLink).toBeVisible()
    
    // Verify Quick Links section
    const quickLinksSection = footer.locator('text="Quick Links"')
    await expect(quickLinksSection).toBeVisible()
    
    // Verify footer navigation links
    const footerBlogLink = footer.locator('a[href="/blog"]')
    await expect(footerBlogLink).toBeVisible()
    
    const footerSeriesLink = footer.locator('a[href="/series"]')
    await expect(footerSeriesLink).toBeVisible()
    
    const footerTopicsLink = footer.locator('a[href="/topics"]')
    await expect(footerTopicsLink).toBeVisible()
    
    // Verify copyright information
    const currentYear = new Date().getFullYear()
    const copyrightText = footer.locator(`text*="© 2014-${currentYear} Elan Hasson"`)
    await expect(copyrightText).toBeVisible()
    
    // Verify "Built with" text
    const builtWithText = footer.locator('text*="Built with Next.js, MDX"')
    await expect(builtWithText).toBeVisible()
    
    // Verify DigitalOcean badge
    const digitalOceanBadge = footer.locator('img[alt="DigitalOcean Referral Badge"]')
    await expect(digitalOceanBadge).toBeVisible()
  })

  test('should take screenshots of homepage layout', async ({ page }) => {
    // Take full page screenshot of homepage
    await page.screenshot({ 
      path: '/home/elan/repos/github.com/ElanHasson/throw.nullreference.io/e2e/screenshots/homepage-full.png', 
      fullPage: true 
    })
    
    // Take screenshot of just the header
    const header = page.locator('header')
    await header.screenshot({ 
      path: '/home/elan/repos/github.com/ElanHasson/throw.nullreference.io/e2e/screenshots/header.png' 
    })
    
    // Take screenshot of the footer
    const footer = page.locator('footer')
    await footer.screenshot({ 
      path: '/home/elan/repos/github.com/ElanHasson/throw.nullreference.io/e2e/screenshots/footer.png' 
    })
  })

  test('should take screenshots of blog page layout', async ({ page }) => {
    // Navigate to blog page
    await page.goto('/blog')
    
    // Take full page screenshot of blog page
    await page.screenshot({ 
      path: '/home/elan/repos/github.com/ElanHasson/throw.nullreference.io/e2e/screenshots/blog-page-full.png', 
      fullPage: true 
    })
  })

  test('should test theme toggle with screenshots', async ({ page }) => {
    // Create screenshots directory if it doesn't exist
    await page.evaluate(() => {
      // This runs in browser context, so we can't use Node.js fs directly
      // The directory will be created when we save screenshots
    })
    
    // Take screenshot in initial theme
    await page.screenshot({ 
      path: '/home/elan/repos/github.com/ElanHasson/throw.nullreference.io/e2e/screenshots/theme-initial.png', 
      fullPage: true 
    })
    
    // Toggle theme
    const themeToggle = page.locator('button[aria-label="Toggle theme"]')
    await themeToggle.click()
    await page.waitForTimeout(1000) // Wait for theme transition
    
    // Take screenshot after theme toggle
    await page.screenshot({ 
      path: '/home/elan/repos/github.com/ElanHasson/throw.nullreference.io/e2e/screenshots/theme-toggled.png', 
      fullPage: true 
    })
  })

  test('should verify responsive navigation on mobile viewports', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Verify header is still visible on mobile
    const header = page.locator('header')
    await expect(header).toBeVisible()
    
    // Verify branding is still visible
    const brandingText = page.locator('text="Throwin\' Exceptions"').first()
    await expect(brandingText).toBeVisible()
    
    // Verify theme toggle is still accessible
    const themeToggle = page.locator('button[aria-label="Toggle theme"]')
    await expect(themeToggle).toBeVisible()
    
    // Take mobile screenshot
    await page.screenshot({ 
      path: '/home/elan/repos/github.com/ElanHasson/throw.nullreference.io/e2e/screenshots/mobile-homepage.png', 
      fullPage: true 
    })
  })

  test('should verify all critical pages load without errors', async ({ page }) => {
    const criticalPages = ['/', '/blog', '/series', '/topics', '/search']
    
    for (const path of criticalPages) {
      await page.goto(path)
      
      // Verify page loads without JavaScript errors
      const errors: string[] = []
      page.on('pageerror', (error) => {
        errors.push(error.message)
      })
      
      // Verify header is present on each page
      const header = page.locator('header')
      await expect(header).toBeVisible()
      
      // Verify footer is present on each page  
      const footer = page.locator('footer')
      await expect(footer).toBeVisible()
      
      // Verify no critical JavaScript errors occurred
      expect(errors).toHaveLength(0)
    }
  })
})