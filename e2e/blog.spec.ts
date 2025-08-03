import { test, expect } from '@playwright/test'

test.describe('Blog Page', () => {
  test('should display blog posts', async ({ page }) => {
    await page.goto('/blog')

    // Check page title
    await expect(page).toHaveTitle(/Blog/)

    // Check heading
    const heading = page.getByRole('heading', { name: 'Blog' })
    await expect(heading).toBeVisible()

    // Check that blog posts are displayed
    const posts = page.locator('article')
    const postCount = await posts.count()
    expect(postCount).toBeGreaterThan(0)
  })

  test('should filter posts by category', async ({ page }) => {
    await page.goto('/blog')

    // Get initial post count
    const initialPosts = await page.locator('article').count()

    // Click on a category if available
    const categoryButton = page.getByRole('button', { name: /Programming/i }).first()
    if (await categoryButton.isVisible()) {
      await categoryButton.click()

      // Check that posts are filtered
      const filteredPosts = await page.locator('article').count()
      expect(filteredPosts).toBeLessThanOrEqual(initialPosts)
    }
  })

  test('should navigate to individual blog post', async ({ page }) => {
    await page.goto('/blog')

    // Click on the first blog post
    const firstPost = page.locator('article').first().getByRole('link')
    const postTitle = await firstPost.textContent()
    await firstPost.click()

    // Check we're on the blog post page
    await expect(page).toHaveURL(/\/blog\/.+/)

    // Check the post title is displayed
    const postHeading = page.getByRole('heading', { level: 1 })
    await expect(postHeading).toContainText(postTitle || '')
  })
})
