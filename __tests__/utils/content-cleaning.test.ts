// Test the content cleaning logic
// This tests the regex patterns used in the search API

import { cleanContent } from '@/utils/content-cleaning'

describe('Content Cleaning', () => {
  describe('JSX tag removal', () => {
    it('should remove simple JSX tags', () => {
      const input = 'Before <Component /> after'
      const result = cleanContent(input)
      expect(result).toBe('Before  after')
    })

    it('should remove JSX tags with props', () => {
      const input = 'Before <Component prop="value" className="test" /> after'
      const result = cleanContent(input)
      expect(result).toBe('Before  after')
    })

    it('should remove nested JSX tags', () => {
      const input = 'Before <div><span>content</span></div> after'
      const result = cleanContent(input)
      expect(result).toBe('Before content after')
    })

    it('should remove multiline JSX', () => {
      const input = `Before <Component
        prop="value"
        another={true}
      /> after`
      const result = cleanContent(input)
      expect(result).toBe('Before  after')
    })
  })

  describe('Image removal', () => {
    it('should remove simple images', () => {
      const input = 'Before ![alt text](image.png) after'
      const result = cleanContent(input)
      expect(result).toBe('Before  after')
    })

    it('should remove images with titles', () => {
      const input = 'Before ![alt text](image.png "title") after'
      const result = cleanContent(input)
      expect(result).toBe('Before  after')
    })

    it('should remove images with query params', () => {
      const input = 'Before ![alt](image.png?width=300&height=200) after'
      const result = cleanContent(input)
      expect(result).toBe('Before  after')
    })

    it('should remove images with Hugo-style positioning', () => {
      const input = 'Before ![alt](image.png#center) after'
      const result = cleanContent(input)
      expect(result).toBe('Before  after')
    })
  })

  describe('Link conversion', () => {
    it('should convert simple links to text', () => {
      const input = 'Check out [this link](https://example.com) for more info'
      const result = cleanContent(input)
      expect(result).toBe('Check out this link for more info')
    })

    it('should convert internal links', () => {
      const input = 'See [another post](/blog/other-post) here'
      const result = cleanContent(input)
      expect(result).toBe('See another post here')
    })

    it('should handle multiple links', () => {
      const input = 'Visit [site A](http://a.com) and [site B](http://b.com)'
      const result = cleanContent(input)
      expect(result).toBe('Visit site A and site B')
    })

    it('should handle links with special characters', () => {
      const input = 'Read [the "guide"](https://example.com) now'
      const result = cleanContent(input)
      expect(result).toBe('Read the "guide" now')
    })
  })

  describe('Heading removal', () => {
    it('should remove h1 headings', () => {
      const input = '# Main Title\nContent here'
      const result = cleanContent(input)
      expect(result).toBe('Main Title\nContent here')
    })

    it('should remove h2-h6 headings', () => {
      const input = '## Section\n### Subsection\n#### Sub-subsection\n##### Level 5\n###### Level 6'
      const result = cleanContent(input)
      expect(result).toBe('Section\nSubsection\nSub-subsection\nLevel 5\nLevel 6')
    })

    it('should handle headings with multiple spaces', () => {
      const input = '#    Spaced Heading'
      const result = cleanContent(input)
      expect(result).toBe('Spaced Heading')
    })
  })

  describe('Bold and italic removal', () => {
    it('should remove bold markdown', () => {
      const input = 'This is **bold text** here'
      const result = cleanContent(input)
      expect(result).toBe('This is bold text here')
    })

    it('should remove italic markdown', () => {
      const input = 'This is *italic text* here'
      const result = cleanContent(input)
      expect(result).toBe('This is italic text here')
    })

    it('should handle nested bold and italic', () => {
      const input = 'This is ***bold and italic*** text'
      const result = cleanContent(input)
      expect(result).toBe('This is bold and italic text')
    })

    it('should handle multiple bold/italic in same line', () => {
      const input = 'Some **bold** and *italic* and **more bold** text'
      const result = cleanContent(input)
      expect(result).toBe('Some bold and italic and more bold text')
    })
  })

  describe('Code removal', () => {
    it('should remove inline code', () => {
      const input = 'Use the `console.log()` function'
      const result = cleanContent(input)
      expect(result).toBe('Use the console.log() function')
    })

    it('should remove code blocks', () => {
      const input = 'Before\n```javascript\nconst test = "code";\nconsole.log(test);\n```\nAfter'
      const result = cleanContent(input)
      expect(result).toBe('Before\nAfter')
    })

    it('should remove code blocks with language', () => {
      const input = '```typescript\ninterface Test {\n  name: string;\n}\n```\nContent after'
      const result = cleanContent(input)
      expect(result).toBe('Content after')
    })

    it('should handle multiple inline code snippets', () => {
      const input = 'Use `npm install` then `npm start` to run'
      const result = cleanContent(input)
      expect(result).toBe('Use npm install then npm start to run')
    })
  })

  describe('Whitespace normalization', () => {
    it('should remove extra newlines', () => {
      const input = 'Line 1\n\n\nLine 2\n\n\n\nLine 3'
      const result = cleanContent(input)
      expect(result).toBe('Line 1\nLine 2\nLine 3')
    })

    it('should trim leading and trailing whitespace', () => {
      const input = '   Content with spaces   \n\n'
      const result = cleanContent(input)
      expect(result).toBe('Content with spaces')
    })

    it('should handle tabs and spaces in empty lines', () => {
      const input = 'Line 1\n  \t  \nLine 2'
      const result = cleanContent(input)
      expect(result).toBe('Line 1\nLine 2')
    })
  })

  describe('Complex content', () => {
    it('should handle realistic blog post content', () => {
      const input = `# Getting Started with React

This is an introduction to **React** development.

![React Logo](./react-logo.png)

## What is React?

React is a *JavaScript* library for building user interfaces. You can install it with:

\`\`\`bash
npm install react
\`\`\`

For more information, check out the [official docs](https://reactjs.org).

<Alert type="info">
This is a custom component.
</Alert>

Use \`useState\` for state management.`

      const result = cleanContent(input)

      expect(result).toContain('Getting Started with React')
      expect(result).toContain('This is an introduction to React development')
      expect(result).toContain('What is React?')
      expect(result).toContain('React is a JavaScript library')
      expect(result).toContain('official docs')
      expect(result).toContain('Use useState for state management')

      expect(result).not.toContain('#')
      expect(result).not.toContain('**')
      expect(result).not.toContain('*')
      expect(result).not.toContain('![')
      expect(result).not.toContain('```')
      expect(result).not.toContain('<Alert')
      expect(result).not.toContain('`')
    })

    it('should handle empty content', () => {
      const result = cleanContent('')
      expect(result).toBe('')
    })

    it('should handle content with only markdown syntax', () => {
      const input = '**bold** *italic* `code`'
      const result = cleanContent(input)
      expect(result).toBe('bold italic code')
    })

    it('should preserve regular text', () => {
      const input = 'This is just regular text with no special formatting.'
      const result = cleanContent(input)
      expect(result).toBe(input)
    })
  })
})
