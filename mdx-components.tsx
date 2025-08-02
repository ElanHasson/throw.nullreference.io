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
    
    img: ({ src, alt, ...props }) => {
      if (!src) return null
      return (
        <Image
          src={src}
          alt={alt || ''}
          width={800}
          height={400}
          className="rounded-lg"
          unoptimized
        />
      )
    },
    
    // Add typography styles
    h1: (props) => <h1 className="text-4xl font-bold mb-4 mt-8" {...props} />,
    h2: (props) => <h2 className="text-3xl font-semibold mb-3 mt-6" {...props} />,
    h3: (props) => <h3 className="text-2xl font-semibold mb-2 mt-4" {...props} />,
    h4: (props) => <h4 className="text-xl font-semibold mb-2 mt-3" {...props} />,
    p: (props) => <p className="mb-4" {...props} />,
    ul: (props) => <ul className="list-disc list-inside mb-4" {...props} />,
    ol: (props) => <ol className="list-decimal list-inside mb-4" {...props} />,
    li: (props) => <li className="mb-1" {...props} />,
    blockquote: (props) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
    ),
    code: (props) => (
      <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5" {...props} />
    ),
    pre: (props) => (
      <pre className="bg-gray-900 text-gray-100 rounded-md p-4 overflow-x-auto mb-4" {...props} />
    ),
    table: (props) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full divide-y divide-gray-300" {...props} />
      </div>
    ),
    th: (props) => (
      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />
    ),
    td: (props) => (
      <td className="px-3 py-2 whitespace-nowrap text-sm" {...props} />
    ),
  }
}