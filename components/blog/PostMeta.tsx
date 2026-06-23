import Image from 'next/image'
import { formatDate } from '@/lib/utils/formatDate'
import { urlFor } from '@/lib/sanity/client'
import { CategoryBadge } from './CategoryBadge'
import type { SanityPost } from '@/lib/sanity/types'

type Props = { post: SanityPost }

export function PostMeta({ post }: Props) {
  const avatarUrl = post.author?.avatar
    ? urlFor(post.author.avatar).width(80).height(80).fit('crop').url()
    : null

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      {/* Author */}
      {post.author && (
        <div className="flex items-center gap-2.5">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={post.author.name}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center text-accent text-xs font-display font-bold">
              {post.author.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-sm font-sans font-medium text-text">{post.author.name}</span>
        </div>
      )}

      {/* Date */}
      {post.publishedAt && (
        <time
          dateTime={post.publishedAt}
          className="text-sm font-sans text-muted"
        >
          {formatDate(post.publishedAt)}
        </time>
      )}

      {/* Reading time */}
      {post.readingTime && (
        <span className="text-sm font-sans text-muted">
          {post.readingTime} min de lectura
        </span>
      )}

      {/* Categories */}
      {post.categories && post.categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {post.categories.map((cat) => (
            <CategoryBadge key={cat._id} category={cat} />
          ))}
        </div>
      )}
    </div>
  )
}
