# Throwin' Exceptions Blog

A modern, feature-rich blog built with Next.js 15, TypeScript, and MDX. Live at [throw.nullreference.io](https://throw.nullreference.io).

## Features

- **MDX Blog Posts**: Write posts in Markdown with JSX components
- **Dynamic Mosaic Layout**: Blog posts display in a Pinterest-style grid with tiles that adapt size based on content
- **Series Support**: Group related posts into series
- **Categories & Tags**: Organize content with categories and tags
- **Dark Mode**: Toggle between light and dark themes
- **Search**: Full-text search powered by Fuse.js
- **RSS Feed**: Available at `/index.xml`
- **Responsive Design**: Optimized for all screen sizes including ultra-wide displays
- **Featured Images**: Clickable featured images with dynamic sizing

## Recent Updates

### Wide Screen Support
- All pages now use `max-w-7xl` containers for better wide screen utilization
- Blog page features responsive grid layouts (2-5 columns based on screen size)
- Header and content areas properly expand on ultra-wide displays

### Dynamic Blog Layout
- Implemented mosaic/tile layout where post cards vary in width based on:
  - Featured status
  - Presence of featured image
  - Title length (posts with titles >40 chars get wider tiles)
  - Description length
- Posts without featured images display with gradient backgrounds
- All images and post areas are clickable for better UX

## Getting Started

First, install dependencies:

```bash
yarn install
```

Then run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

- Blog posts are located in `/content/posts/`
- Add series metadata to posts using the `series` frontmatter field
- Categories and tags are automatically extracted from post frontmatter
- Featured images use the `featuredImage` frontmatter field

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
