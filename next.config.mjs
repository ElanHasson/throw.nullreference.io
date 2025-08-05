import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import remarkToc from 'remark-toc'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeUnwrapImages from 'rehype-unwrap-images'
import inspectUrls from 'rehype-url-inspector'
import rehypeMdxImportMedia from 'rehype-mdx-import-media'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Note: redirects() is not supported with static export
  // Redirects should be handled at the server/hosting level
  experimental: {
    mdxRs: true,
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      remarkGfm, // GitHub Flavored Markdown
      [
        remarkToc,
        {
          // Table of contents generation
          heading: 'Table of Contents',
          maxDepth: 3,
        },
      ],
    ],
    rehypePlugins: [
      rehypeSlug, // Add IDs to headings
      [
        rehypeAutolinkHeadings, // Add links to headings
        {
          properties: {
            className: ['anchor'],
          },
        },
      ],
      rehypeUnwrapImages, // Unwrap images from paragraphs for better styling
      rehypeMdxImportMedia, // Convert relative media paths to imports
      [
        inspectUrls, // Inspect and modify URLs
        {
          inspectEach({ url, node }) {
            // Only modify external links
            if (
              url.href &&
              !url.href.startsWith('/') &&
              !url.href.startsWith('#') &&
              !url.href.startsWith('mailto:')
            ) {
              if (!node.properties) node.properties = {}
              node.properties.target = '_blank'
              node.properties.rel = 'noopener noreferrer'
            }
          },
        },
      ],
      [
        rehypePrettyCode,
        {
          theme: {
            dark: 'one-dark-pro',
            light: 'github-light',
          },
          keepBackground: true,
          onVisitLine(node) {
            // Prevent lines from collapsing in `display: grid` mode, and
            // allow empty lines to be copy/pasted
            if (node.children.length === 0) {
              node.children = [{ type: 'text', value: ' ' }]
            }
          },
        },
      ],
    ],
  },
})

export default withMDX(nextConfig)
