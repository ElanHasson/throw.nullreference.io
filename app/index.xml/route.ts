import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/posts'

export const dynamic = 'force-static'

export async function GET() {
  const posts = await getAllPosts()
  
  const siteUrl = process.env.SITE_URL || 'https://throw.nullreference.io'
  const buildDate = new Date().toUTCString()
  
  const rssItems = posts
    .slice(0, 20) // Latest 20 posts
    .map((post) => {
      const postUrl = `${siteUrl}/blog/${post.slug}`
      const pubDate = new Date(post.date).toUTCString()
      
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description || post.title}]]></description>
      <pubDate>${pubDate}</pubDate>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      ${post.tags?.map(tag => `<category><![CDATA[${tag}]]></category>`).join('') || ''}
    </item>`
    })
    .join('')

  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Throwin' Exceptions</title>
    <description>Join me as I go through my daily journey of struggling with under-documented technology, random ideas, and life in general.</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <pubDate>${buildDate}</pubDate>
    <ttl>60</ttl>
    ${rssItems}
  </channel>
</rss>`

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}