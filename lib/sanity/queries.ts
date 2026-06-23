import { groq } from 'next-sanity'

// ─── Fragmentos reutilizables ────────────────────────────
const postCardFields = groq`
  _id,
  title,
  slug,
  excerpt,
  coverImage { asset, hotspot, alt },
  publishedAt,
  featured,
  author->{ _id, name, avatar { asset } },
  categories[]->{ _id, title, slug, color },
  tags,
  "readingTime": round(length(pt::text(body)) / 5 / 200)
`

// ─── Queries ─────────────────────────────────────────────

/** Todos los posts (para listado y sitemap) */
export const allPostsQuery = groq`
  *[_type == "post" && defined(slug.current) && defined(publishedAt)]
  | order(publishedAt desc)
  { ${postCardFields} }
`

/** Posts destacados para la homepage */
export const featuredPostQuery = groq`
  *[_type == "post" && featured == true && defined(slug.current)]
  | order(publishedAt desc) [0]
  { ${postCardFields} }
`

/** Posts recientes (sin el destacado) */
export const recentPostsQuery = groq`
  *[_type == "post" && featured != true && defined(slug.current) && defined(publishedAt)]
  | order(publishedAt desc) [0...$limit]
  { ${postCardFields} }
`

/** Posts por categoría */
export const postsByCategoryQuery = groq`
  *[_type == "post" && defined(slug.current) && $categorySlug in categories[]->slug.current]
  | order(publishedAt desc)
  { ${postCardFields} }
`

/** Post individual por slug (con body completo) */
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    coverImage { asset, hotspot, alt },
    body,
    publishedAt,
    featured,
    tags,
    author->{ _id, name, bio, avatar { asset }, social },
    categories[]->{ _id, title, slug, color },
    "readingTime": round(length(pt::text(body)) / 5 / 200)
  }
`

/** Posts relacionados (misma categoría, distinto slug) */
export const relatedPostsQuery = groq`
  *[
    _type == "post"
    && slug.current != $slug
    && count(categories[@._ref in $categoryIds]) > 0
    && defined(publishedAt)
  ]
  | order(publishedAt desc) [0...3]
  { ${postCardFields} }
`

/** Todas las categorías */
export const allCategoriesQuery = groq`
  *[_type == "category"] | order(title asc) {
    _id, title, slug, description, color,
    "postCount": count(*[_type == "post" && references(^._id)])
  }
`

/** Slugs de todos los posts (para generateStaticParams) */
export const allPostSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)] { "slug": slug.current }
`

/** Datos mínimos para generar OG images (sin body) */
export const postOGQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    title,
    excerpt,
    publishedAt,
    categories[]->{ _id, title, "slug": slug.current, color },
    "readingTime": round(length(pt::text(body)) / 5 / 200)
  }
`
