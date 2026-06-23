import { client } from '@/lib/sanity/client'
import { allPostsQuery } from '@/lib/sanity/queries'
import type { SanityPost } from '@/lib/sanity/types'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export async function GET() {
  const posts: SanityPost[] = await client.fetch(allPostsQuery, {}, { next: { revalidate: 3600 } })

  const items = posts
    .slice(0, 20)
    .map((post) => {
      const url = `${BASE_URL}/blog/${post.slug.current}`
      const date = post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date().toUTCString()
      const categories = post.categories?.map((c) => `<category>${c.title}</category>`).join('') ?? ''
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${date}</pubDate>
      ${post.excerpt ? `<description><![CDATA[${post.excerpt}]]></description>` : ''}
      ${categories}
    </item>`
    })
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Narratix</title>
    <link>${BASE_URL}</link>
    <description>Blog sobre desarrollo web moderno, Next.js y TypeScript.</description>
    <language>es</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
