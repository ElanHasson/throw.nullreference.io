import { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface BlogLayoutProps {
  children: ReactNode
  frontmatter?: {
    title?: string
    date?: string
    description?: string
    tags?: string[]
    categories?: string[]
  }
}

export function BlogLayout({ children, frontmatter }: BlogLayoutProps) {
  return (
    <article className="mx-auto max-w-4xl px-4 py-8">
      {/* Back to blog link */}
      <Link
        href="/blog"
        className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to blog
      </Link>

      {/* Article header */}
      {frontmatter && (
        <header className="mb-8 space-y-4">
          {frontmatter.title && (
            <h1 className="text-4xl font-bold tracking-tight">{frontmatter.title}</h1>
          )}

          {frontmatter.description && (
            <p className="text-muted-foreground text-xl">{frontmatter.description}</p>
          )}

          <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
            {frontmatter.date && (
              <time dateTime={frontmatter.date}>
                {new Date(frontmatter.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}

            {frontmatter.categories && frontmatter.categories.length > 0 && (
              <div className="flex gap-2">
                {frontmatter.categories.map((category) => (
                  <span key={category} className="bg-muted rounded-full px-3 py-1 text-xs">
                    {category}
                  </span>
                ))}
              </div>
            )}
          </div>

          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {frontmatter.tags.map((tag) => (
                <span key={tag} className="bg-primary/10 text-primary rounded-md px-2 py-1 text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>
      )}

      {/* Article content with Tailwind Typography */}
      <div className="prose prose-lg dark:prose-invert max-w-none">{children}</div>
    </article>
  )
}
