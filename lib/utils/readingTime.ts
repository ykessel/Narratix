import type { SanityBlock } from '@/lib/sanity/types'

/** Extrae texto plano de un array de Portable Text blocks */
function toPlainText(blocks: SanityBlock[]): string {
  return blocks
    .map((block) => {
      if (block._type !== 'block' || !block.children) return ''
      return block.children.map((child) => child.text).join('')
    })
    .join('\n')
}

/** Retorna el tiempo de lectura estimado en minutos */
export function readingTime(body: SanityBlock[]): number {
  const text = toPlainText(body)
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}
