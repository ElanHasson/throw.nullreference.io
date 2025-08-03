import Link from 'next/link'
import { format } from 'date-fns'
import { getAllPosts, groupPostsByYear } from '@/lib/posts'
import type { PostMeta } from '@/lib/types'

export const metadata = {
  title: "Archive | Throwin' Exceptions",
  description: 'All blog posts organized by date',
}

export default async function ArchivePage() {
  const posts = await getAllPosts()

  // Group posts by year
  const postsByYear = groupPostsByYear(posts)

  const years = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a))

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-12 text-4xl font-bold">Archive</h1>

        <div className="space-y-8">
          {years.map((year) => (
            <div key={year}>
              <h2 className="mb-4 text-2xl font-semibold">{year}</h2>
              <ul className="space-y-3">
                {postsByYear[Number(year)].map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex items-baseline gap-4 transition-colors hover:text-rose-600"
                    >
                      <time className="text-muted-foreground min-w-[100px] text-sm">
                        {format(new Date(post.date), 'MMM dd')}
                      </time>
                      <span>{post.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
