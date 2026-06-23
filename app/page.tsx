import { client } from '@/lib/sanity/client'
import { featuredPostQuery, recentPostsQuery } from '@/lib/sanity/queries'
import { PostCard } from '@/components/blog/PostCard'
import type { SanityPost } from '@/lib/sanity/types'

export const revalidate = 60

export default async function HomePage() {
  const [featured, recent]: [SanityPost | null, SanityPost[]] = await Promise.all([
    client.fetch(featuredPostQuery, {}, { next: { tags: ['post'] } }),
    client.fetch(recentPostsQuery, { limit: 6 }, { next: { tags: ['post'] } }),
  ])

  return (
    <main className="max-w-4xl mx-auto px-6 py-14">
      {/* Hero */}
      <section className="mb-16">
        <p className="text-xs font-sans font-medium text-accent tracking-widest uppercase mb-4">
          Desarrollo web moderno
        </p>
        <h1 className="font-display font-bold text-4xl md:text-5xl text-text leading-tight mb-4">
          Narratix
        </h1>
        <p className="text-muted font-sans text-lg max-w-xl leading-relaxed">
          Artículos sobre Next.js, TypeScript, diseño de interfaces y el oficio de construir
          productos web de calidad.
        </p>
      </section>

      {/* Featured post */}
      {featured && (
        <section className="mb-16">
          <p className="text-xs font-sans font-semibold text-muted tracking-widest uppercase mb-5">
            Destacado
          </p>
          <PostCard post={featured} featured />
        </section>
      )}

      {/* Recent posts */}
      {recent.length > 0 && (
        <section>
          <p className="text-xs font-sans font-semibold text-muted tracking-widest uppercase mb-7">
            Artículos recientes
          </p>
          <div className="grid sm:grid-cols-2 gap-10">
            {recent.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {!featured && recent.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted font-sans">
            Aún no hay artículos publicados.{' '}
            <a href="/studio" className="text-accent hover:underline">
              Ir al Studio →
            </a>
          </p>
        </div>
      )}
    </main>
  )
}
