import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function loadFont(family: string, weight: number): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@${weight}&display=swap`,
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    }
  ).then((r) => r.text())

  const url = css.match(/src: url\(([^)]+)\) format\('woff2'\)/)?.[1]
  if (!url) throw new Error(`Font URL not found for ${family} ${weight}`)
  return fetch(url).then((r) => r.arrayBuffer())
}

const topics = ['Next.js', 'TypeScript', 'React', 'CSS', 'Web APIs', 'Performance']

export default async function OGImage() {
  const fontBold = await loadFont('Space Grotesk', 700)

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

        {/* Gradiente decorativo — centro-izquierda */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: -200,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(124,58,237,0.06) 0%, rgba(124,58,237,0.01) 60%, transparent 80%)',
            transform: 'translateY(-50%)',
            display: 'flex',
          }}
        />

        {/* Gradiente decorativo — inferior derecha */}
        <div
          style={{
            position: 'absolute',
            bottom: -150,
            right: -100,
            width: 550,
            height: 550,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(124,58,237,0.07) 0%, rgba(124,58,237,0.02) 50%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Contenido */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 100px',
            flex: 1,
          }}
        >
          {/* Eyebrow */}
          <span
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: '#7c3aed',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 24,
              display: 'flex',
            }}
          >
            Blog de desarrollo web
          </span>

          {/* Headline */}
          <div
            style={{
              fontSize: 80,
              fontWeight: 700,
              color: '#1c1917',
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              marginBottom: 32,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span>Ideas sobre</span>
            <span>
              desarrollo
              <span style={{ color: '#7c3aed' }}> moderno.</span>
            </span>
          </div>

          {/* Descripción */}
          <p
            style={{
              fontSize: 22,
              color: '#78716c',
              lineHeight: 1.5,
              marginBottom: 48,
              maxWidth: 680,
              display: 'flex',
            }}
          >
            Artículos sobre Next.js, TypeScript, React y diseño de interfaces de alta calidad.
          </p>

          {/* Topics chips */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {topics.map((topic) => (
              <span
                key={topic}
                style={{
                  padding: '8px 20px',
                  backgroundColor: '#f5f3ff',
                  color: '#6d28d9',
                  border: '1px solid #ede9fe',
                  borderRadius: 100,
                  fontSize: 16,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 100px',
            borderTop: '1px solid #e7e5e4',
          }}
        >
          <span
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: '#1c1917',
              display: 'flex',
              alignItems: 'baseline',
            }}
          >
            Narratix<span style={{ color: '#7c3aed' }}>.</span>
          </span>
          <span style={{ fontSize: 16, color: '#a8a29e', display: 'flex' }}>
            narratix.vercel.app
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Space Grotesk', data: fontBold, weight: 700, style: 'normal' }],
    }
  )
}
