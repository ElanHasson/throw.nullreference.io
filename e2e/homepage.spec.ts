import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/')

    // Check page title
    await expect(page).toHaveTitle(/Throwin' Exceptions/)

    // Check main heading is visible
    const heading = page.getByRole('heading', { name: /Hey, I'm Elan/i })
    await expect(heading).toBeVisible()

    // Check navigation links are present
    const nav = page.getByRole('navigation')
    await expect(nav.getByRole('link', { name: 'Blog' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'About' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Archive' })).toBeVisible()
  })

  test('should have working navigation', async ({ page }) => {
    await page.goto('/')

    // Click on Blog link in navigation
    await page.getByRole('navigation').getByRole('link', { name: 'Blog' }).click()
    await expect(page).toHaveURL('/blog')

    // Go back and click Archive
    await page.goBack()
    await page.getByRole('navigation').getByRole('link', { name: 'Archive' }).click()
    await expect(page).toHaveURL('/archive')
  })

  test('should have working theme toggle', async ({ page }) => {
    await page.goto('/')

    // Check initial theme
    const html = page.locator('html')
    const initialTheme = await html.getAttribute('class')

    // Find and click theme toggle button
    const themeToggle = page.getByRole('button', { name: /toggle.*theme/i })
    await themeToggle.click()

    // Check theme changed
    const newTheme = await html.getAttribute('class')
    expect(newTheme).not.toBe(initialTheme)
  })

  test('should display recent blog posts', async ({ page }) => {
    await page.goto('/')

    // Check for recent posts section
    const recentPostsHeading = page.getByRole('heading', { name: 'Recent Posts' })
    await expect(recentPostsHeading).toBeVisible()

    // Check that at least one blog post is displayed
    const blogPosts = page.locator('article')
    await expect(blogPosts).toHaveCount(3) // Based on the code, it shows 3 recent posts
  })
})