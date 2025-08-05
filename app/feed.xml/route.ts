import RSS from 'rss'
import { getAllPosts } from '@/lib/posts'

export const dynamic = 'force-static'

export async function GET() {
  const posts = await getAllPosts()

  const feed = new RSS({
    title: "Throwin' Exceptions",
    description:
      'A blog about software development, technology, and the beautiful chaos of debugging life.',
    site_url: 'https://throw.nullreference.io',
    feed_url: 'https://throw.nullreference.io/feed.xml',
    language: 'en',
    pubDate: new Date(),
    copyright: `© ${new Date().getFullYear()} Elan Hasson. All Rights Reserved.`,
  })

  posts.slice(0, 10).forEach((post) => {
    const item: {
      title: string
      description: string
      url: string
      guid: string
      date: Date
      enclosure?: {
        url: string
        type: string
      }
    } = {
      title: post.title,
      description: post.description || '',
      url: `https://throw.nullreference.io/blog/${post.slug}`,
      guid: `https://throw.nullreference.io/blog/${post.slug}`,
      date: new Date(post.date),
    }

    // Add image if thumbnail is specified
    if (post.thumbnail) {
      const extension = post.thumbnail.split('.').pop()?.toLowerCase()
      let imageType = 'image/png' // default

      switch (extension) {
        case 'jpg':
        case 'jpeg':
          imageType = 'image/jpeg'
          break
        case 'png':
          imageType = 'image/png'
          break
        case 'gif':
          imageType = 'image/gif'
          break
        case 'webp':
          imageType = 'image/webp'
          break
      }

      item.enclosure = {
        url: `https://throw.nullreference.io${post.thumbnail}`,
        type: imageType,
      }
    }

    feed.item(item)
  })

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
