import { test, expect } from '@playwright/test'

test.describe('MDX Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog/mdx-features-demo/')
  })

  test('should display the page title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('MDX Features Demo')
  })

  test('should display table of contents', async ({ page }) => {
    const tocHeading = page.locator('h2:has-text("Table of Contents")')
    await expect(tocHeading).toBeVisible()
  })

  test('should display GitHub Flavored Markdown features', async ({ page }) => {
    // Check for table
    const table = page.locator('table')
    await expect(table).toBeVisible()
    await expect(table.locator('th')).toContainText(['Feature', 'Status', 'Notes'])

    // Check for task lists
    const taskList = page.locator('ul:has(input[type="checkbox"])')
    await expect(taskList).toBeVisible()

    // Check for strikethrough
    const strikethrough = page.locator('del')
    await expect(strikethrough).toBeVisible()
    await expect(strikethrough).toContainText('Like this')

    // Check for footnotes
    const footnote = page.locator('sup').first()
    await expect(footnote).toBeVisible()
  })

  test('should display syntax highlighted code blocks', async ({ page }) => {
    // Check for code blocks with syntax highlighting
    const codeBlocks = page.locator('pre code')
    await expect(codeBlocks).toHaveCount(3) // JavaScript, TypeScript, Python, Rust

    // Check if syntax highlighting is applied (should have span elements)
    const highlightedCode = page.locator('pre code span').first()
    await expect(highlightedCode).toBeVisible()
  })

  test('should display Mermaid diagrams', async ({ page }) => {
    // Wait for Mermaid to render
    await page.waitForTimeout(2000)

    // Check for Mermaid SVG elements
    const mermaidDiagrams = page.locator('.mermaid svg')
    await expect(mermaidDiagrams).toHaveCount(2)

    // Check if diagrams contain expected elements
    const flowchartNodes = page.locator('.mermaid svg .node')
    await expect(flowchartNodes.first()).toBeVisible()
  })

  test('should have working anchor links on headings', async ({ page }) => {
    // Check for anchor links
    const headingWithAnchor = page.locator('h2:has(.anchor)')
    await expect(headingWithAnchor.first()).toBeVisible()

    // Hover over heading to show anchor
    await headingWithAnchor.first().hover()
    const anchorLink = headingWithAnchor.first().locator('.anchor')
    await expect(anchorLink).toBeVisible()
  })

  test('should display images properly', async ({ page }) => {
    const image = page.locator('img[alt="Demo Image"]')
    await expect(image).toBeVisible()

    // Check if image is unwrapped from paragraph
    const imageParent = await image.locator('..')
    const tagName = await imageParent.evaluate((el) => el.tagName.toLowerCase())
    expect(tagName).not.toBe('p')
  })

  test('should apply Tailwind Typography styles', async ({ page }) => {
    // Check for prose class
    const proseContent = page.locator('.prose')
    await expect(proseContent.first()).toBeVisible()

    // Check for dark mode support
    const darkProseContent = page.locator('.dark\\:prose-invert')
    await expect(darkProseContent.first()).toBeVisible()
  })
})