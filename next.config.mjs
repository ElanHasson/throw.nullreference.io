import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import remarkToc from 'remark-toc'
import remarkGithub from 'remark-github'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeUnwrapImages from 'rehype-unwrap-images'

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
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      remarkGfm, // GitHub Flavored Markdown
      [remarkGithub, {
        // Auto-link GitHub references
        repository: 'https://github.com/nullreferencecorp/throw.nullreference.io'
      }],
      [remarkToc, {
        // Table of contents generation
        heading: 'Table of Contents',
        maxDepth: 3
      }]
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
      [rehypePrettyCode, {
        // Use shiki for syntax highlighting
        theme: 'github-dark',
        onVisitLine(node) {
          // Prevent lines from collapsing in `display: grid` mode, and
          // allow empty lines to be copy/pasted
          if (node.children.length === 0) {
            node.children = [{type: 'text', value: ' '}]
          }
        },
        onVisitHighlightedLine(node) {
          if (!node.properties.className) {
            node.properties.className = []
          }
          node.properties.className.push('highlighted')
        },
        onVisitHighlightedWord(node) {
          node.properties.className = ['word']
        }
      }]
    ],
  },
})

export default withMDX(nextConfig)
