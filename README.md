# throw.nullreference.io

Personal blog built with Next.js, MDX, and Tailwind CSS. Deployed on DigitalOcean App Platform.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Content**: [MDX](https://mdxjs.com/) with [ContentLayer](https://contentlayer.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform/)
- **Diagrams**: [Mermaid](https://mermaid.js.org/)

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Export static site
npm run export
```

## Content Structure

- `/content/blog/` - Blog posts in MDX format
- `/content/learn/` - Learning resources and documentation
- `/content/pages/` - Standalone pages

## Deployment

The site is automatically deployed to DigitalOcean App Platform on push to the main branch.

See `.do/app.yaml` for deployment configuration.

## Contributing

Pull requests welcomed and accepted.

## License

Content is copyright © 2020-2024 Elan Hasson. All Rights Reserved.

Code samples and examples are MIT licensed.
