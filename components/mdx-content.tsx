import { getMDXComponent } from 'next-contentlayer/hooks'
import { mdxComponents } from './mdx-wrapper'

interface MDXContentProps {
  code: string
}

export function MDXContent({ code }: MDXContentProps) {
  const Component = getMDXComponent(code)
  
  return <Component components={mdxComponents} />
}