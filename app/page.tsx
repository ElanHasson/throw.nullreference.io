import Link from 'next/link'
import { format } from 'date-fns'
import { getRecentPosts, getFeaturedPosts } from '@/lib/posts'
import type { PostMeta } from '@/lib/types'

export default async function HomePage() {
  const recentPosts = await getRecentPosts()
  const featuredPosts = await getFeaturedPosts()

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 dark:from-rose-950/20 dark:via-pink-950/10 dark:to-purple-950/20" />

        {/* Floating orbs animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="animate-blob absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 opacity-20 mix-blend-multiply blur-3xl filter" />
          <div className="animate-blob animation-delay-2000 absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 opacity-20 mix-blend-multiply blur-3xl filter" />
          <div className="animate-blob animation-delay-4000 absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 opacity-20 mix-blend-multiply blur-3xl filter" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="animate-fade-in mb-6 text-5xl font-bold md:text-7xl">
              <span className="inline-block">Throwin&apos;</span>{' '}
              <span className="bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                Exceptions
              </span>
            </h1>

            <p className="animate-fade-in animation-delay-200 mx-auto mb-12 max-w-3xl text-xl text-gray-600 md:text-2xl dark:text-gray-300">
              A blog about software development, technology, and the beautiful chaos of debugging
              life
            </p>

            <div className="animate-fade-in animation-delay-400 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-rose-600 to-purple-600 px-8 py-4 text-lg font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                Read the Blog
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>

              <Link
                href="/learn"
                className="inline-flex items-center justify-center rounded-full border-2 border-gray-200 bg-white/80 px-8 py-4 text-lg font-medium text-gray-700 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-rose-400 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-200 dark:hover:border-rose-400"
              >
                Start Learning
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="h-6 w-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* About Me Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 p-12 dark:from-gray-800 dark:to-gray-900">
              <div className="grid items-center gap-8 md:grid-cols-2">
                <div>
                  <h2 className="mb-6 text-4xl font-bold">Hey, I'm Jagadesh 👋</h2>
                  <p className="mb-4 text-lg text-gray-600 dark:text-gray-300">
                    I'm a software engineer passionate about building distributed systems, exploring
                    new technologies, and sharing what I learn along the way.
                  </p>
                  <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
                    Currently working at DigitalOcean on the App Platform team, I've spent over 20
                    years writing code and love diving deep into complex problems.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="rounded-full bg-rose-100 px-4 py-2 text-sm font-medium text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
                      .NET
                    </span>
                    <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                      Go
                    </span>
                    <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      Distributed Systems
                    </span>
                    <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                      Orleans
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-rose-400 to-purple-400 opacity-20 blur-3xl"></div>
                  <img
                    src="/static/images/profile.jpg"
                    alt="Jagadesh's profile"
                    className="relative rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="bg-gray-50 py-20 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold">Featured Posts</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Popular articles and deep dives worth reading
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {featuredPosts.map((post, index) => (
                <article
                  key={post.slug}
                  className={`group animate-fade-in rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:bg-gray-800`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    <time className="text-sm font-medium text-rose-600 dark:text-rose-400">
                      {format(new Date(post.date), 'LLLL d, yyyy')}
                    </time>
                    <h3 className="mt-2 mb-3 text-xl font-bold transition-colors group-hover:text-rose-600 dark:group-hover:text-rose-400">
                      {post.title}
                    </h3>
                    {post.description && (
                      <p className="line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                        {post.description}
                      </p>
                    )}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="bg-gray-50 py-20 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold">Recent Posts</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Thoughts on code, technology, and everything in between
              </p>
            </div>

            <div className="grid gap-8">
              {recentPosts.map((post, index) => (
                <article
                  key={post.slug}
                  className={`group animate-fade-in relative rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:bg-gray-800`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10" />

                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <time className="text-sm font-medium text-rose-600 dark:text-rose-400">
                        {format(new Date(post.date), 'LLLL d, yyyy')}
                      </time>

                      <h3 className="mt-2 mb-3 text-2xl font-bold transition-colors group-hover:text-rose-600 dark:group-hover:text-rose-400">
                        {post.title}
                      </h3>

                      {post.description && (
                        <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                          {post.description}
                        </p>
                      )}
                    </div>

                    <div className="ml-6 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
                      <svg
                        className="h-6 w-6 text-rose-600 dark:text-rose-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium text-rose-600 transition-colors hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
              >
                View all posts
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold">What You&apos;ll Find Here</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Deep dives, tutorials, and random musings
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: (
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  ),
                  title: 'Code Deep Dives',
                  description:
                    'Exploring complex topics in software development with practical examples',
                },
                {
                  icon: (
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  ),
                  title: 'Learning Resources',
                  description: 'Tutorials and guides to help you level up your development skills',
                },
                {
                  icon: (
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                  ),
                  title: 'Tech Discussions',
                  description: 'Thoughts on industry trends, tools, and the future of technology',
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-gray-50 p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800"
                >
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">
                    {feature.icon}
                  </div>
                  <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
