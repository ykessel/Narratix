import type { SanityBlock } from '@/lib/sanity/types'

export type TOCItem = {
  id: string
  text: string
  level: 2 | 3 | 4
}

/** Genera un slug-id limpio a partir de un texto */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[áàä]/g, 'a')
    .replace(/[éèë]/g, 'e')
    .replace(/[íìï]/g, 'i')
    .replace(/[óòö]/g, 'o')
    .replace(/[úùü]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
}

/** Extrae todos los headings (h2, h3, h4) del body de Portable Text */
export function generateTOC(body: SanityBlock[]): TOCItem[] {
  return body
    .filter(
      (block) =>
        block._type === 'block' &&
        ['h2', 'h3', 'h4'].includes(block.style ?? '')
    )
    .map((block) => {
      const text = block.children?.map((c) => c.text).join('') ?? ''
      return {
        id: slugify(text),
        text,
        level: parseInt((block.style ?? 'h2').replace('h', '')) as 2 | 3 | 4,
      }
    })
    .filter((item) => item.text.length > 0)
}
