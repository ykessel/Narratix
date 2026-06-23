import { client } from '@/lib/sanity/client'
import { relatedPostsQuery } from '@/lib/sanity/queries'
import { PostCard } from './PostCard'
import type { SanityPost } from '@/lib/sanity/types'

type Props = {
  currentSlug: string
  categoryIds: string[]
}

export async function RelatedPosts({ currentSlug, categoryIds }: Props) {
  if (categoryIds.length === 0) return null

  const posts: SanityPost[] = await client.fetch(
    relatedPostsQuery,
    { slug: currentSlug, categoryIds },
    { next: { tags: [`post:${currentSlug}`] } }
  )

  if (posts.length === 0) return null

  return (
    <section className="mt-20 pt-12 border-t border-border">
      <h2 className="font-display text-2xl font-bold text-text mb-8">
        Artículos relacionados
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  )
}
