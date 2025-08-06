import Link from 'next/link'
import { getAllPosts } from '@/lib/posts-utils'
import { format } from 'date-fns'
import { FeaturedImage } from '@/components/featured-image'
import { DynamicFeaturedImage } from '@/components/ui/dynamic-featured-image'
import { DynamicPlaceholder } from '@/components/ui/dynamic-placeholder'
import { SeriesPill } from '@/components/ui/series-pill'
import { SmartPillContainer } from '@/components/ui/smart-pill-container'
import { FeaturedBadge } from '@/components/ui/featured-badge'
import { DynamicDescription } from '@/components/ui/dynamic-description'

export const metadata = {
  title: "Blog | Throwin' Exceptions",
  description: 'All blog posts about technology, software development, and random thoughts',
}

export default async function BlogPage() {
  const posts = await getAllPosts()
  const featuredPosts = posts.filter(post => post.featured)
  const regularPosts = posts.filter(post => !post.featured)

  return (
    <div className="w-full">
      <div className="container mx-auto max-w-[2000px] px-4 sm:px-6 py-20 lg:px-8 lg:py-24 xl:px-12 2xl:px-16">
      {/* Hero Section */}
      <div className="mb-20 text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl bg-gradient-to-r from-gray-900 via-rose-600 to-gray-900 bg-clip-text text-transparent dark:from-gray-100 dark:via-rose-400 dark:to-gray-100 pb-2">
          Latest Thoughts
        </h1>
        <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-600 dark:text-gray-400">
          Technology insights, software development stories, and everything in between.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="space-y-16">
          {/* Featured Posts Section */}
          {featuredPosts.length > 0 && (
            <section>
              <h2 className="mb-12 text-3xl font-bold text-gray-900 dark:text-gray-100">Featured Posts</h2>
              <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {featuredPosts.map((post, index) => (
                  <article
                    key={post.slug}
                    className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:bg-gray-900 dark:shadow-gray-800/25"
                  >
                    {post.featuredImage && (
                      <Link href={`/blog/${post.slug}`} className="block">
                        <div className="aspect-[16/9] overflow-hidden">
                          <FeaturedImage
                            src={post.featuredImage}
                            alt={`Featured image for ${post.title}`}
                            priority={index < 4}
                            variant="large"
                          />
                        </div>
                      </Link>
                    )}
                    
                    <div className="p-8">
                      <div className="mb-4 flex flex-wrap items-center gap-3">
                        <time className="text-sm font-medium text-rose-600 dark:text-rose-400">
                          {format(new Date(post.date), 'MMM d, yyyy')}
                        </time>
                        <FeaturedBadge />
                        {post.series && <SeriesPill series={post.series} />}
                      </div>
                      
                      <h3 className="mb-4 text-2xl font-bold leading-tight">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="transition-colors group-hover:text-rose-600 dark:group-hover:text-rose-400"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      
                      {post.description && (
                        <p className="mb-6 text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                          {post.description}
                        </p>
                      )}
                      
                      {post.tags && post.tags.length > 0 && (
                        <SmartPillContainer tags={post.tags} pillSize="md" />
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
          
          {/* Regular Posts Grid */}
          <section>
            <h2 className="mb-12 text-3xl font-bold text-gray-900 dark:text-gray-100">All Posts</h2>
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6">
              {regularPosts.map((post, index) => {
                // Determine if card should span more columns based on content
                const hasLongTitle = post.title.length > 45
                const hasLongSeries = post.series && post.series.length > 35
                const hasLongDescription = post.description && post.description.length > 120
                
                // Dynamic column span logic
                let colSpanClass = 'col-span-1'
                
                // Long series names need more space
                if (hasLongSeries) {
                  colSpanClass = 'sm:col-span-2 lg:col-span-2 xl:col-span-2'
                }
                // Long titles without series can also span wider
                else if (hasLongTitle && !post.series) {
                  colSpanClass = 'sm:col-span-2 lg:col-span-2'
                }
                // Posts with both long content and multiple tags
                else if (hasLongDescription && post.tags && post.tags.length > 4) {
                  colSpanClass = 'sm:col-span-2'
                }

                return (
                  <article
                    key={post.slug}
                    className={`group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-2 hover:border-gray-200 dark:bg-gray-900 dark:border-gray-800 dark:shadow-gray-800/25 dark:hover:border-gray-700 ${colSpanClass}`}
                  >
                    {post.featuredImage ? (
                      <Link href={`/blog/${post.slug}`} className="block">
                        <DynamicFeaturedImage
                          src={post.featuredImage}
                          alt={`Featured image for ${post.title}`}
                          priority={index < 8}
                          colSpanClass={colSpanClass}
                          hasLongTitle={hasLongTitle}
                          hasSeries={!!post.series}
                          tagCount={post.tags?.length || 0}
                          descriptionLength={post.description?.length || 0}
                        />
                      </Link>
                    ) : (
                      <Link href={`/blog/${post.slug}`} className="block">
                        <DynamicPlaceholder
                          colSpanClass={colSpanClass}
                          hasLongTitle={hasLongTitle}
                          hasSeries={!!post.series}
                          tagCount={post.tags?.length || 0}
                          descriptionLength={post.description?.length || 0}
                        />
                      </Link>
                    )}
                    
                    <div className="p-6">
                      <div className="mb-3 flex flex-col gap-2 text-sm">
                        <div className="flex items-start gap-3">
                          <time className="font-medium text-rose-600 dark:text-rose-400 flex-shrink-0 whitespace-nowrap mt-1">
                            {format(new Date(post.date), 'MMM d')}
                          </time>
                          {post.series && (
                            <div className="flex-1 min-w-0">
                              <SeriesPill series={post.series} size="sm" className="!whitespace-normal !inline-block leading-relaxed" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <h3 className={`mb-3 text-lg font-bold leading-tight text-gray-900 dark:text-gray-100 ${hasLongTitle ? 'line-clamp-3' : 'line-clamp-2'}`}>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="transition-colors group-hover:text-rose-600 dark:group-hover:text-rose-400"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      
                      {post.description && (
                        <DynamicDescription 
                          description={post.description}
                          className="mb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed"
                          colSpanClass={colSpanClass}
                          hasLongTitle={hasLongTitle}
                          hasSeries={!!post.series}
                          tagCount={post.tags?.length || 0}
                        />
                      )}
                      
                      {post.tags && post.tags.length > 0 && (
                        <SmartPillContainer tags={post.tags} pillSize="sm" />
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            No posts available yet. Check back soon!
          </p>
        </div>
      )}
      </div>
    </div>
  )
}