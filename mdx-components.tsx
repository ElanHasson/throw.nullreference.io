import type { MDXComponents } from 'mdx/types'
import { Figure } from '@/components/mdx/figure'
import { Alert } from '@/components/mdx/alert'
import { YouTube } from '@/components/mdx/youtube'
import { MermaidDiagram } from '@/components/mdx/mermaid'
import { RawHTML } from '@/components/mdx/raw-html'
import { SVG } from '@/components/mdx/svg'
import Link from 'next/link'
import Image from 'next/image'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    // Custom components
    Figure,
    Alert,
    YouTube,
    MermaidDiagram,
    RawHTML,
    SVG,
    Link,

    // Override default elements
    a: ({ href, children, ...props }) => {
      // Handle internal links
      if (href?.startsWith('/')) {
        return (
          <Link href={href} {...props}>
            {children}
          </Link>
        )
      }
      // External links
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      )
    },

    img: ({ src, alt, title, ...props }) => {
      if (!src) return null

      // Handle Hugo-style positioning (#center, #floatright, #floatleft)
      let cleanSrc = src
      let className = 'rounded-lg'

      if (src.includes('#')) {
        const [imagePath, position] = src.split('#')
        cleanSrc = imagePath

        switch (position) {
          case 'center':
            className += ' mx-auto block'
            break
          case 'floatright':
            className += ' float-right ml-4 mb-4'
            break
          case 'floatleft':
            className += ' float-left mr-4 mb-4'
            break
        }
      }

      // Handle query params for width
      const urlParts = cleanSrc.split('?')
      cleanSrc = urlParts[0]
      const params = new URLSearchParams(urlParts[1] || '')
      const widthParam = params.get('width')
      const heightParam = params.get('height')

      const width = widthParam ? parseInt(widthParam) : 800
      const height = heightParam ? parseInt(heightParam) : 400

      return (
        <Image
          src={cleanSrc}
          alt={alt || ''}
          title={title}
          width={width}
          height={height}
          className={className}
          unoptimized
        />
      )
    },

    // Add typography styles
    h1: (props) => <h1 className="mt-8 mb-4 text-4xl font-bold" {...props} />,
    h2: (props) => <h2 className="mt-6 mb-3 text-3xl font-semibold" {...props} />,
    h3: (props) => <h3 className="mt-4 mb-2 text-2xl font-semibold" {...props} />,
    h4: (props) => <h4 className="mt-3 mb-2 text-xl font-semibold" {...props} />,
    p: (props) => <p className="mb-4" {...props} />,
    ul: (props) => <ul className="mb-4 list-inside list-disc" {...props} />,
    ol: (props) => <ol className="mb-4 list-inside list-decimal" {...props} />,
    li: (props) => <li className="mb-1" {...props} />,
    blockquote: (props) => (
      <blockquote className="my-4 border-l-4 border-gray-300 pl-4 italic" {...props} />
    ),
    // Don't override code and pre - let rehype-pretty-code handle them
    table: (props) => (
      <div className="mb-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300" {...props} />
      </div>
    ),
    th: (props) => (
      <th
        className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
        {...props}
      />
    ),
    td: (props) => <td className="px-3 py-2 text-sm whitespace-nowrap" {...props} />,
  }
}
