import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { getFullPost } from '@/lib/posts'
import { allPostMeta } from '@/.contentlayer/generated'

export async function generateStaticParams() {
  return allPostMeta
    .filter(post => !post.draft)
    .map((post) => ({
      slug: post.slug,
    }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getFullPost(slug)
  
  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: ['Jagadesh'],
    },
  }
}

interface BlogPostLayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export default async function BlogPostLayout({ children, params }: BlogPostLayoutProps) {
  const { slug } = await params
  const post = getFullPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <time dateTime={post.date}>
              {format(new Date(post.date), 'LLLL d, yyyy')}
            </time>
            
            {post.readingTime && (
              <>
                <span>•</span>
                <span>{post.readingTime.text}</span>
              </>
            )}
            
            {post.wordCount && (
              <>
                <span>•</span>
                <span>{post.wordCount.toLocaleString()} words</span>
              </>
            )}
            
            {post.categories && post.categories.length > 0 && (
              <>
                <span>•</span>
                <div className="flex flex-wrap gap-2">
                  {post.categories.map((category) => (
                    <span
                      key={category}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </header>

        {post.thumbnail && (
          <div className="mb-12">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="rounded-lg shadow-lg"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none dark:prose-invert">
          {children}
        </div>

        {post.tags && post.tags.length > 0 && (
          <footer className="mt-12 border-t pt-8">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-rose-100 px-4 py-2 text-sm font-medium text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </footer>
        )}

        {post.series && (
          <div className="mt-8 rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
            <h3 className="mb-2 text-lg font-semibold">Part of the series:</h3>
            <p className="text-rose-600 dark:text-rose-400">{post.series}</p>
          </div>
        )}
      </div>
    </article>
  )
}