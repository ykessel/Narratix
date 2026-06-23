import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils/formatDate'
import { urlFor } from '@/lib/sanity/client'
import { CategoryBadge } from './CategoryBadge'
import type { SanityPost } from '@/lib/sanity/types'

type Props = {
  post: SanityPost
  featured?: boolean
}

export function PostCard({ post, featured = false }: Props) {
  const imageUrl = post.coverImage
    ? urlFor(post.coverImage).width(featured ? 1200 : 800).height(featured ? 630 : 420).fit('crop').auto('format').url()
    : null

  return (
    <article className={`group ${featured ? 'col-span-full' : ''}`}>
      <Link href={`/blog/${post.slug.current}`} className="block">
        {/* Cover image */}
        {imageUrl && (
          <div className={`relative overflow-hidden rounded-2xl bg-stone-100 mb-4 ${featured ? 'aspect-[2/1]' : 'aspect-[16/9]'}`}>
            <Image
              src={imageUrl}
              alt={post.coverImage?.alt ?? post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes={featured ? '(max-width: 768px) 100vw, 900px' : '(max-width: 768px) 100vw, 440px'}
              priority={featured}
            />
          </div>
        )}

        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.categories.map((cat) => (
              <CategoryBadge key={cat._id} category={cat} size="sm" asLink={false} />
            ))}
          </div>
        )}

        {/* Title */}
        <h2
          className={`font-display font-bold text-text group-hover:text-accent transition-colors duration-200 leading-tight mb-2 ${
            featured ? 'text-2xl md:text-3xl' : 'text-xl'
          }`}
        >
          {post.title}
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-muted font-sans text-sm leading-relaxed line-clamp-2 mb-3">
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-muted font-sans">
          {post.author && (
            <span className="font-medium text-text/70">{post.author.name}</span>
          )}
          {post.author && post.publishedAt && <span>·</span>}
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          )}
          {post.readingTime && (
            <>
              <span>·</span>
              <span>{post.readingTime} min de lectura</span>
            </>
          )}
        </div>
      </Link>
    </article>
  )
}
