import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // Posts redirects
      {
        source: '/posts/:slug*',
        destination: '/blog/:slug*',
        permanent: true,
      },
      // Docs redirects
      {
        source: '/docs/Learning-Go/:path*',
        destination: '/learn/go/:path*',
        permanent: true,
      },
      // Category redirects
      {
        source: '/categories/:slug*',
        destination: '/topics/:slug*',
        permanent: true,
      },
      // Tags redirects
      {
        source: '/tags/:slug*',
        destination: '/topics/:slug*',
        permanent: true,
      },
      // Series redirects
      {
        source: '/series/:slug*',
        destination: '/topics/:slug*',
        permanent: true,
      },
      // Archives redirect
      {
        source: '/archives',
        destination: '/archive',
        permanent: true,
      },
    ]
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm, remarkFrontmatter],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['anchor'],
          },
        },
      ],
      rehypeHighlight,
    ],
  },
})

export default withMDX(nextConfig)