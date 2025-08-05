# throw.nullreference.io

Personal blog built with Next.js, MDX, and Tailwind CSS. Deployed on DigitalOcean App Platform.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Content**: [MDX](https://mdxjs.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform/)
- **Diagrams**: [Mermaid](https://mermaid.js.org/)

## Development

```bash
# Install dependencies
yarn install

# Run development server
yarn run dev

# Build for production
yarn run build

# Export static site
yarn run export
```

## Content Structure

- `/content/blog/` - Blog posts in MDX format
- `/content/pages/` - Standalone pages

## Deployment

The site is automatically deployed to DigitalOcean App Platform on push to the main branch.

See `.do/app.yaml` for deployment configuration.

## Contributing

Pull requests welcomed and accepted.

## License

Content is copyright © 2020-2024 Elan Hasson. All Rights Reserved.

Code samples and examples are MIT licensed.
