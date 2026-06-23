import type { Metadata } from 'next'
import { client } from '@/lib/sanity/client'
import { allPostsQuery, allCategoriesQuery } from '@/lib/sanity/queries'
import { PostCard } from '@/components/blog/PostCard'
import { CategoryBadge } from '@/components/blog/CategoryBadge'
import type { SanityPost, SanityCategory } from '@/lib/sanity/types'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Todos los artículos sobre desarrollo web, Next.js, TypeScript y diseño.',
}

export const revalidate = 60

type Props = {
  searchParams: Promise<{ category?: string }>
}

export default async function BlogPage({ searchParams }: Props) {
  const { category } = await searchParams

  const [allPosts, categories]: [SanityPost[], SanityCategory[]] = await Promise.all([
    client.fetch(allPostsQuery, {}, { next: { tags: ['post'] } }),
    client.fetch(allCategoriesQuery, {}, { next: { tags: ['category'] } }),
  ])

  const filtered = category
    ? allPosts.filter((p) => p.categories?.some((c) => c.slug.current === category))
    : allPosts

  return (
    <main className="max-w-4xl mx-auto px-6 py-14">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display font-bold text-4xl text-text mb-2">Blog</h1>
        <p className="text-muted font-sans">
          {allPosts.length} artículo{allPosts.length !== 1 ? 's' : ''} publicado{allPosts.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <a
            href="/blog"
            className={`inline-flex items-center text-xs font-sans px-3 py-1.5 rounded-full border transition-colors ${
              !category
                ? 'bg-accent text-white border-accent'
                : 'border-border text-muted hover:border-muted'
            }`}
          >
            Todos ({allPosts.length})
          </a>
          {categories.map((cat) => (
            <a
              key={cat._id}
              href={`/blog?category=${cat.slug.current}`}
              className={`inline-flex items-center text-xs font-sans px-3 py-1.5 rounded-full border transition-colors ${
                category === cat.slug.current
                  ? 'bg-accent text-white border-accent'
                  : 'border-border text-muted hover:border-muted'
              }`}
            >
              {cat.title}
            </a>
          ))}
        </div>
      )}

      {/* Posts grid */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-10">
          {filtered.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-muted font-sans py-12 text-center">
          No hay artículos en esta categoría aún.
        </p>
      )}
    </main>
  )
}
