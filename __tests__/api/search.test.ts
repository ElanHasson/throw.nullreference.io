/**
 * @jest-environment node
 */

// Mock modules before any imports
jest.mock('fs', () => ({
  promises: {
    readdir: jest.fn(),
    readFile: jest.fn()
  }
}))
jest.mock('path')

import { GET } from '@/app/api/search/route'
import { promises as fs } from 'fs'
import path from 'path'

// Mock process.cwd to ensure consistent paths
jest.spyOn(process, 'cwd').mockReturnValue('/test')

const mockFs = fs as jest.Mocked<typeof fs>
const mockPath = path as jest.Mocked<typeof path>

// Mock console methods to avoid noise in tests
const consoleSpy = {
  warn: jest.spyOn(console, 'warn').mockImplementation(),
  error: jest.spyOn(console, 'error').mockImplementation()
}

describe('/api/search', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset path.join implementation
    mockPath.join.mockReset()
    mockPath.join.mockImplementation((...args) => args.join('/'))
    // Reset fs mocks
    mockFs.readdir.mockReset()
    mockFs.readFile.mockReset()
  })

  afterAll(() => {
    consoleSpy.warn.mockRestore()
    consoleSpy.error.mockRestore()
  })

  it('should return empty array when blog directory does not exist', async () => {
    mockFs.readdir.mockRejectedValue(new Error('ENOENT: no such file or directory'))

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual([])
    expect(consoleSpy.error).toHaveBeenCalledWith('Failed to read blog directory:', expect.any(Error))
  })

  it('should skip directories starting with [', async () => {
    const mockEntries = [
      { name: 'valid-post', isDirectory: () => true },
      { name: '[slug]', isDirectory: () => true },
      { name: 'another-post', isDirectory: () => true }
    ]

    mockFs.readdir.mockResolvedValue(mockEntries as any)
    mockFs.readFile
      .mockResolvedValueOnce(`---
title: "Valid Post"
date: 2023-01-01
description: "A valid post"
---
This is post content.`)
      .mockResolvedValueOnce(`---
title: "Another Post"  
date: 2023-01-02
---
More content here.`)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveLength(2)
    expect(data[0].title).toBe('Another Post') // Sorted by date desc
    expect(data[1].title).toBe('Valid Post')
    expect(mockFs.readFile).toHaveBeenCalledTimes(2) // Only called for valid directories
  })

  it('should parse frontmatter and clean content correctly', async () => {
    const mockEntries = [
      { name: 'test-post', isDirectory: () => true }
    ]

    const mdxContent = `---
title: "Test Post"
date: 2023-01-01T10:00:00Z
description: "A test post"
featured: true
tags: ["javascript", "testing"]
categories: ["development"]
---

# Heading

This is **bold** and *italic* text.

![Image](./image.png)

[Link text](https://example.com)

Here's some \`inline code\` and:

\`\`\`javascript
const test = "code block";
\`\`\`

<CustomComponent prop="value" />

Final paragraph.`

    mockFs.readdir.mockResolvedValue(mockEntries as any)
    mockFs.readFile.mockResolvedValue(mdxContent)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveLength(1)
    
    const post = data[0]
    expect(post.title).toBe('Test Post')
    expect(post.description).toBe('A test post')
    expect(post.date).toBe('2023-01-01T10:00:00.000Z')
    expect(post.featured).toBe(true)
    expect(post.tags).toEqual(['javascript', 'testing'])
    expect(post.categories).toEqual(['development'])
    expect(post.slug).toBe('test-post')
    expect(post.url).toBe('/blog/test-post')
    
    // Content should be cleaned
    expect(post.content).not.toContain('**')
    expect(post.content).not.toContain('*')
    expect(post.content).not.toContain('`')
    expect(post.content).not.toContain('#')
    expect(post.content).not.toContain('![')
    expect(post.content).not.toContain('<CustomComponent')
    expect(post.content).toContain('Heading')
    expect(post.content).toContain('bold and italic text')
    expect(post.content).toContain('Link text')
    expect(post.content).toContain('inline code')
    expect(post.content).toContain('Final paragraph')
  })

  it('should handle missing frontmatter fields gracefully', async () => {
    const mockEntries = [
      { name: 'minimal-post', isDirectory: () => true }
    ]

    const mdxContent = `---
title: "Minimal Post"
---
Just some content.`

    mockFs.readdir.mockResolvedValue(mockEntries as any)
    mockFs.readFile.mockResolvedValue(mdxContent)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveLength(1)
    
    const post = data[0]
    expect(post.title).toBe('Minimal Post')
    expect(post.description).toBe('')
    expect(post.date).toBe('')
    expect(post.featured).toBe(false)
    expect(post.tags).toEqual([])
    expect(post.categories).toEqual([])
  })

  it('should handle posts without frontmatter', async () => {
    const mockEntries = [
      { name: 'no-frontmatter', isDirectory: () => true }
    ]

    const mdxContent = `Just plain content without frontmatter.`

    mockFs.readdir.mockResolvedValue(mockEntries as any)
    mockFs.readFile.mockResolvedValue(mdxContent)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveLength(1)
    
    const post = data[0]
    expect(post.title).toBe('no-frontmatter') // Falls back to directory name
    expect(post.content).toBe('Just plain content without frontmatter.')
  })

  it('should sort posts by date descending', async () => {
    const mockEntries = [
      { name: 'old-post', isDirectory: () => true },
      { name: 'new-post', isDirectory: () => true },
      { name: 'middle-post', isDirectory: () => true }
    ]

    mockFs.readdir.mockResolvedValue(mockEntries as any)
    mockFs.readFile
      .mockResolvedValueOnce(`---
title: "Old Post"
date: 2023-01-01
---
Old content`)
      .mockResolvedValueOnce(`---
title: "New Post"
date: 2023-03-01
---
New content`)
      .mockResolvedValueOnce(`---
title: "Middle Post"
date: 2023-02-01
---
Middle content`)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveLength(3)
    expect(data[0].title).toBe('New Post')
    expect(data[1].title).toBe('Middle Post')
    expect(data[2].title).toBe('Old Post')
  })

  it('should handle file read errors gracefully', async () => {
    const mockEntries = [
      { name: 'good-post', isDirectory: () => true },
      { name: 'bad-post', isDirectory: () => true }
    ]

    mockFs.readdir.mockResolvedValue(mockEntries as any)
    mockFs.readFile
      .mockResolvedValueOnce(`---
title: "Good Post"
---
Good content`)
      .mockRejectedValueOnce(new Error('File not found'))

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveLength(1)
    expect(data[0].title).toBe('Good Post')
    expect(consoleSpy.warn).toHaveBeenCalledWith(
      expect.stringContaining('Failed to read'),
      expect.any(Error)
    )
  })

  it('should return 500 on unexpected errors', async () => {
    // Mock a more severe error that would cause the main try/catch to trigger
    mockPath.join.mockImplementation(() => {
      throw new Error('Unexpected path error')
    })

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({ error: 'Failed to generate search index' })
    expect(consoleSpy.error).toHaveBeenCalledWith('Search API error:', expect.any(Error))
  })
})