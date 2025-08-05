import { notFound } from 'next/navigation'
import { getFullPost, getAllPosts, getAdjacentPosts } from '@/lib/posts'
import PostHeader from '@/components/post-header'
import PostFooter from '@/components/post-footer'
import PostThumbnail from '@/components/post-thumbnail'
import PostNavigation from '@/components/post-navigation'
import Breadcrumb from '@/components/breadcrumb'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
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
      authors: ['Elan Hasson'],
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

  const { previousPost, nextPost } = await getAdjacentPosts(slug)

  return (
    <article className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <Breadcrumb items={[{ label: 'Blog', href: '/blog' }, { label: post.title }]} />
          </div>

          <PostHeader post={post} />

          {post.thumbnail && (
            <div className="mb-16">
              <PostThumbnail src={post.thumbnail} alt={post.title} />
            </div>
          )}

          <div className="mx-auto max-w-4xl">
            <div className="prose prose-lg prose-gray dark:prose-invert prose-headings:scroll-mt-20 prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:text-lg prose-p:leading-8 prose-li:text-lg prose-li:leading-8 prose-blockquote:border-l-4 prose-blockquote:border-rose-500 prose-blockquote:bg-rose-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:my-6 dark:prose-blockquote:bg-rose-900/20 dark:prose-blockquote:border-rose-400 prose-pre:bg-transparent prose-pre:p-0 prose-code:bg-transparent prose-code:p-0 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none max-w-none">
              {children}
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-4xl">
            <PostFooter post={post} />
            <PostNavigation previousPost={previousPost} nextPost={nextPost} />
          </div>
        </div>
      </div>
    </article>
  )
}
