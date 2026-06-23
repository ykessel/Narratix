import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity/client'
import { groq } from 'next-sanity'

/**
 * Query liviana — no incluye body para mantener el payload pequeño.
 * Solo los campos necesarios para búsqueda y previsualización.
 */
const searchQuery = groq`
  *[_type == "post" && defined(slug.current) && defined(publishedAt)]
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    tags,
    categories[]->{ title, "slug": slug.current, color },
    publishedAt,
    "readingTime": round(length(pt::text(body)) / 5 / 200)
  }
`

// Caché de 1 hora; el webhook de revalidación reinicia esto también
export const revalidate = 3600

export async function GET() {
  try {
    const posts = await client.fetch(searchQuery, {}, { next: { revalidate: 3600 } })
    return NextResponse.json(posts, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    })
  } catch {
    return NextResponse.json({ error: 'Error al obtener los artículos' }, { status: 500 })
  }
}
