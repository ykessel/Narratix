import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { client, urlFor } from '@/lib/sanity/client'
import { postBySlugQuery, allPostSlugsQuery } from '@/lib/sanity/queries'
import { PostMeta } from '@/components/blog/PostMeta'
import { PostBody } from '@/components/blog/PostBody'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { ReadingProgress } from '@/components/blog/ReadingProgress'
import { generateTOC } from '@/lib/utils/generateTOC'
import type { SanityPost } from '@/lib/sanity/types'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await client.fetch(allPostSlugsQuery)
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post: SanityPost | null = await client.fetch(postBySlugQuery, { slug })
  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      // OG image generada automáticamente por opengraph-image.tsx (no se sobreescribe aquí)
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post: SanityPost | null = await client.fetch(
    postBySlugQuery,
    { slug },
    { next: { tags: [`post:${slug}`] } }
  )

  if (!post) notFound()

  const toc = post.body ? generateTOC(post.body) : []
  const categoryIds = post.categories?.map((c) => c._id) ?? []
  const coverImageUrl = post.coverImage
    ? urlFor(post.coverImage).width(1200).height(630).fit('crop').auto('format').url()
    : null

  return (
    <>
      <ReadingProgress />

      <main>
        {/* ── Hero ──────────────────────────────────────── */}
        <header className="max-w-4xl mx-auto px-6 pt-12 pb-10">
          <PostMeta post={post} />

          <h1 className="font-display font-bold text-text leading-tight mt-6 mb-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}
          >
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-muted font-sans text-xl leading-relaxed max-w-2xl">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* ── Cover image ───────────────────────────────── */}
        {coverImageUrl && (
          <div className="max-w-5xl mx-auto px-6 mb-12">
            <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden bg-stone-100">
              <Image
                src={coverImageUrl}
                alt={post.coverImage?.alt ?? post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>
          </div>
        )}

        {/* ── Body + TOC ────────────────────────────────── */}
        <div className="max-w-4xl mx-auto px-6">
          <div className={`flex gap-16 ${toc.length > 0 ? 'lg:grid lg:grid-cols-[1fr_220px]' : ''}`}>
            {/* Article */}
            <article className="min-w-0">
              {post.body && <PostBody value={post.body} />}
            </article>

            {/* Sticky TOC — solo en desktop */}
            {toc.length > 2 && (
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <TableOfContents items={toc} />
                </div>
              </aside>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-border">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-sans text-muted border border-border px-2.5 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Related posts */}
          <RelatedPosts currentSlug={slug} categoryIds={categoryIds} />
        </div>
      </main>
    </>
  )
}
