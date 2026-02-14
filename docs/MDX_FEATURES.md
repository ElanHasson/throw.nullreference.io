# MDX Features Documentation

This blog platform supports enhanced MDX features for rich content authoring.

## Code Blocks

### Basic Syntax Highlighting

All code blocks automatically get syntax highlighting based on the language specified:

````markdown
```typescript
const greeting = "Hello, World!";
console.log(greeting);
```
````

### Copy Button

Every code block automatically includes a copy button that appears on hover. Click it to copy the code to your clipboard.

### Line Numbers

Add `showLineNumbers` to display line numbers:

````markdown
```typescript showLineNumbers
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```
````

### Line Highlighting

Highlight specific lines using curly braces with line numbers or ranges:

````markdown
```typescript {2-4}
function example() {
  const highlighted = true;  // This line is highlighted
  const alsoHighlighted = true;  // This too
  const stillHighlighted = true;  // And this
  const notHighlighted = false;
}
```
````

Multiple selections:
````markdown
```typescript {1,3,5}
const first = "highlighted";
const second = "not highlighted";
const third = "highlighted";
const fourth = "not highlighted";
const fifth = "highlighted";
```
````

### Combined Features

You can combine line numbers and highlighting:

````markdown
```typescript showLineNumbers {2-4,6}
function processData(data: any[]) {
  // Validate input
  if (!Array.isArray(data)) {
    throw new Error("Input must be an array");
  }
  // Process each item
  return data.map(item => transform(item));
}
```
````

## Custom Components

### Alert Component

Display important information in styled alert boxes:

```markdown
<Alert type="info">
This is an informational message.
</Alert>

<Alert type="success">
Operation completed successfully!
</Alert>

<Alert type="warning">
Please review before proceeding.
</Alert>

<Alert type="error">
An error occurred. Please try again.
</Alert>
```

### Figure Component

Enhanced image component with caption support:

```markdown
<Figure 
  src="/images/example.png" 
  alt="Description of image" 
  caption="Optional caption text"
  width={600}
  height={400}
/>
```

### Mermaid Diagrams

Create diagrams using Mermaid syntax:

```markdown
<MermaidDiagram chart={`
graph TD
  A[Start] --> B[Process]
  B --> C{Decision}
  C -->|Yes| D[Action 1]
  C -->|No| E[Action 2]
  D --> F[End]
  E --> F
`} />
```

### CTA Card

Call-to-action cards for important links or actions:

```markdown
<CTACard 
  title="Get Started"
  description="Learn how to use all these features"
  href="/docs/getting-started"
/>
```

### GitHub Gist Embeds

Embed GitHub Gists directly in your posts with syntax highlighting:

```markdown
<!-- Embed entire gist -->
<GistEmbed gist="username/gistId" />

<!-- Embed specific file from a gist -->
<GistEmbed gist="username/gistId" file="specific-file.js" />

<!-- Using full URL -->
<GistEmbed gist="https://gist.github.com/username/gistId" />
```

Example:
```markdown
<GistEmbed gist="ElanHasson/50b3d97c72703535b32542d05ee2bd7d" />
```

Features:
- Automatic syntax highlighting
- Dark mode support
- Responsive layout
- Shows file names and metadata
- Direct links to the original Gist

## Writing MDX Posts

### File Structure

Posts should be organized in the following structure:
```
private/blogs/
└── your-post-slug/
    ├── index.mdx        # Main post content
    └── media/           # Images and other media
        ├── image1.png
        └── image2.jpg
```

### Metadata

Every MDX file must export metadata:

```javascript
export const metadata = {
  title: "Your Post Title",
  featuredImage: "/blog/your-post-slug/featured.jpg",
  publishDate: "2024-01-01",
  excerpt: "Brief description of your post",
  tags: ["tag1", "tag2"],
  categories: ["category1"],
  author: {
    name: "Your Name",
    bio: "Brief bio",
    avatar: "/images/avatar.jpg"
  },
  seo: {
    metaTitle: "SEO Title",
    metaDescription: "SEO Description"
  }
};
```

### Using Images

Images should be placed in the `media` folder and referenced with relative paths:

```markdown
![Alt text](./media/image.png)
```

Or use the Figure component for more control:

```markdown
<Figure 
  src="./media/image.png" 
  alt="Alt text" 
  caption="Image caption"
/>
```

## Best Practices

1. **Use semantic headings**: Start with `##` (H2) for main sections in your post
2. **Add alt text to images**: Always provide descriptive alt text for accessibility
3. **Use appropriate alert types**: Choose the right alert type for your message
4. **Highlight important code**: Use line highlighting to draw attention to key parts
5. **Add line numbers for tutorials**: When explaining code step-by-step, use line numbers
6. **Keep code blocks concise**: Break up large code blocks into smaller, focused examples
7. **Test your MDX locally**: Always preview your post before publishing

## Keyboard Shortcuts

When viewing code blocks:
- Hover over any code block to reveal the copy button
- Click the copy button or use keyboard focus to copy code
- The button shows a checkmark when successfully copied

## Theme Support

All components automatically adapt to light and dark themes:
- Code blocks use GitHub Light/Dark themes
- Alerts have theme-aware colors
- Mermaid diagrams adjust to the current theme
- Images respect the user's theme preference