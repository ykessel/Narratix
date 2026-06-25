import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { codeToHtml } from 'shiki'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/client'
import { Callout } from './Callout'
import type { SanityBlock } from '@/lib/sanity/types'

// Genera el mismo id que generateTOC para que scroll spy funcione
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[áàä]/g, 'a').replace(/[éèë]/g, 'e')
    .replace(/[íìï]/g, 'i').replace(/[óòö]/g, 'o')
    .replace(/[úùü]/g, 'u').replace(/ñ/g, 'n')
    .replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

type Props = { value: SanityBlock[] }

export async function PostBody({ value }: Props) {
  // ── Pre-render code blocks con Shiki (server-side) ──────
  const codeCache = new Map<string, string>()

  for (const block of value) {
    if (block._type === 'codeBlock' && block._key && block.code) {
      const html = await codeToHtml(block.code, {
        lang: block.language ?? 'text',
        theme: 'github-dark-dimmed',
      })
      codeCache.set(block._key, html)
    }
  }

  // ── Componentes de PortableText ──────────────────────────
  const components: PortableTextComponents = {
    block: {
      h2: ({ children, value: v }) => {
        const text = v.children?.map((c: any) => c.text).join('') ?? ''
        return <h2 id={slugify(text)}>{children}</h2>
      },
      h3: ({ children, value: v }) => {
        const text = v.children?.map((c: any) => c.text).join('') ?? ''
        return <h3 id={slugify(text)}>{children}</h3>
      },
      h4: ({ children, value: v }) => {
        const text = v.children?.map((c: any) => c.text).join('') ?? ''
        return <h4 id={slugify(text)}>{children}</h4>
      },
    },
    marks: {
      link: ({ children, value: v }) => (
        <a
          href={v.href}
          target={v.blank ? '_blank' : undefined}
          rel={v.blank ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      ),
    },
    types: {
      // Bloque de código con Shiki pre-renderizado
      codeBlock: ({ value: v }) => {
        const html = codeCache.get(v._key)
        return (
          <div className="not-prose my-8">
            {v.filename && (
              <div className="code-filename">{v.filename}</div>
            )}
            {html ? (
              <div dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <pre className="shiki bg-code-bg p-5 rounded-xl overflow-x-auto">
                <code className="text-sm font-mono text-stone-200">{v.code}</code>
              </pre>
            )}
          </div>
        )
      },

      // Imagen con caption
      image: ({ value: v }) => {
        if (!v?.asset) return null
        const src = urlFor(v).width(900).auto('format').url()
        return (
          <figure className="not-prose my-8">
            <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: '16/9' }}>
              <Image
                src={src}
                alt={v.alt ?? ''}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 860px"
              />
            </div>
            {v.caption && (
              <figcaption className="text-center text-sm text-muted font-sans mt-2">
                {v.caption}
              </figcaption>
            )}
          </figure>
        )
      },

      // Callout / Alert
      callout: ({ value: v }) => (
        <Callout type={v.type ?? 'info'} text={v.text ?? ''} />
      ),
    },
  }

  return (
    <div className="prose prose-lg max-w-none">
      <PortableText value={value as Parameters<typeof PortableText>[0]['value']} components={components} />
    </div>
  )
}
