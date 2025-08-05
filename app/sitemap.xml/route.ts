import { NextResponse } from 'next/server'
import { getAllPosts, getAllTags, getAllSeries } from '@/lib/posts'

export const dynamic = 'force-static'

export async function GET() {
  const posts = await getAllPosts()
  const tags = await getAllTags()
  const series = await getAllSeries()
  
  const siteUrl = process.env.SITE_URL || 'https://throw.nullreference.io'
  const currentDate = new Date().toISOString()
  
  // Static pages
  const staticPages = [
    { url: siteUrl, lastmod: currentDate, priority: '1.0' },
    { url: `${siteUrl}/blog`, lastmod: currentDate, priority: '0.9' },
    { url: `${siteUrl}/search`, lastmod: currentDate, priority: '0.8' },
    { url: `${siteUrl}/series`, lastmod: currentDate, priority: '0.8' },
    { url: `${siteUrl}/topics`, lastmod: currentDate, priority: '0.8' },
    { url: `${siteUrl}/archive`, lastmod: currentDate, priority: '0.7' },
  ]
  
  // Blog posts
  const postPages = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastmod: new Date(post.date).toISOString(),
    priority: '0.9',
  }))
  
  // Series pages
  const seriesPages = series.map((seriesName) => ({
    url: `${siteUrl}/series/${seriesName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
    lastmod: currentDate,
    priority: '0.7',
  }))
  
  // Topic pages
  const topicPages = tags.map((tag) => ({
    url: `${siteUrl}/topics/${tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
    lastmod: currentDate,
    priority: '0.6',
  }))
  
  const allPages = [...staticPages, ...postPages, ...seriesPages, ...topicPages]
  
  const sitemapItems = allPages
    .map(({ url, lastmod, priority }) => `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${priority}</priority>
    <changefreq>weekly</changefreq>
  </url>`)
    .join('')

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapItems}
</urlset>`

  return new NextResponse(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}