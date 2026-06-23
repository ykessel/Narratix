import { ImageResponse } from 'next/og'
import { client } from '@/lib/sanity/client'
import { postOGQuery } from '@/lib/sanity/queries'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const revalidate = 3600

// ─── Font loader ──────────────────────────────────────────

async function loadFont(family: string, weight: number): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@${weight}&display=swap`,
    {
      headers: {
        // User-agent that returns woff2 URLs
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    }
  ).then((r) => r.text())

  const url = css.match(/src: url\(([^)]+)\) format\('woff2'\)/)?.[1]
  if (!url) throw new Error(`Font URL not found for ${family} ${weight}`)
  return fetch(url).then((r) => r.arrayBuffer())
}

// ─── Types ────────────────────────────────────────────────

type OGPost = {
  title: string
  excerpt?: string
  publishedAt?: string
  readingTime?: number
  categories?: Array<{ _id: string; title: string; slug: string; color?: string }>
}

// ─── OG Image ─────────────────────────────────────────────

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const [post, fontRegular, fontBold] = await Promise.all([
    client.fetch<OGPost | null>(postOGQuery, { slug }),
    loadFont('Space Grotesk', 400),
    loadFont('Space Grotesk', 700),
  ])

  const title = post?.title ?? 'Narratix'
  const excerpt = post?.excerpt ?? 'Blog sobre desarrollo web moderno, Next.js y TypeScript.'
  const categories = post?.categories ?? []
  const readingTime = post?.readingTime ?? 0
  const publishedAt = post?.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('es', { month: 'short', year: 'numeric' })
    : null

  // Ajuste de tamaño de fuente según longitud del título
  const titleSize = title.length > 70 ? 50 : title.length > 50 ? 58 : 68

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fafaf9',
          fontFamily: '"Space Grotesk"',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Barra de acento superior */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            backgroundColor: '#7c3aed',
            display: 'flex',
          }}
        />

        {/* Gradiente decorativo — esquina inferior derecha */}
        <div
          style={{
            position: 'absolute',
            bottom: -120,
            right: -80,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(124,58,237,0.08) 0%, rgba(124,58,237,0.02) 50%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Contenido principal */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '56px 80px 48px',
            flex: 1,
          }}
        >
          {/* Categorías */}
          {categories.length > 0 && (
            <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
              {categories.slice(0, 3).map((cat) => (
                <span
                  key={cat._id}
                  style={{
                    padding: '6px 18px',
                    backgroundColor: cat.color ? `${cat.color}20` : '#ede9fe',
                    color: cat.color ?? '#7c3aed',
                    borderRadius: 100,
                    fontSize: 16,
                    fontWeight: 500,
                    border: `1px solid ${cat.color ? `${cat.color}35` : '#ddd6fe'}`,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {cat.title}
                </span>
              ))}
            </div>
          )}

          {/* Título */}
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 700,
              color: '#1c1917',
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              marginBottom: 24,
              flex: 1,
              maxWidth: 900,
              display: 'flex',
              alignItems: 'flex-start',
            }}
          >
            {title.length > 90 ? `${title.slice(0, 88)}…` : title}
          </div>

          {/* Excerpt */}
          <div
            style={{
              fontSize: 22,
              color: '#78716c',
              lineHeight: 1.55,
              marginBottom: 36,
              maxWidth: 780,
              display: 'flex',
            }}
          >
            {excerpt.length > 130 ? `${excerpt.slice(0, 128)}…` : excerpt}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid #e7e5e4',
              paddingTop: 24,
            }}
          >
            {/* Logo */}
            <span
              style={{
                fontSize: 30,
                fontWeight: 700,
                color: '#1c1917',
                display: 'flex',
                alignItems: 'baseline',
              }}
            >
              Narratix
              <span style={{ color: '#7c3aed' }}>.</span>
            </span>

            {/* Meta: tiempo de lectura + fecha */}
            <span
              style={{
                fontSize: 18,
                color: '#a8a29e',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {readingTime > 0 && (
                <>
                  <span>{readingTime} min lectura</span>
                  {publishedAt && (
                    <span style={{ margin: '0 2px', color: '#d6d3d1' }}>·</span>
                  )}
                </>
              )}
              {publishedAt && <span>{publishedAt}</span>}
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Space Grotesk', data: fontRegular, weight: 400, style: 'normal' },
        { name: 'Space Grotesk', data: fontBold, weight: 700, style: 'normal' },
      ],
    }
  )
}
