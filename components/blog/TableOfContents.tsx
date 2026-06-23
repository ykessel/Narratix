'use client'

import { useEffect, useState } from 'react'
import type { TOCItem } from '@/lib/utils/generateTOC'

type Props = { items: TOCItem[] }

export function TableOfContents({ items }: Props) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (items.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 }
    )

    items.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <nav aria-label="Tabla de contenidos" className="text-sm font-sans">
      <p className="text-xs font-semibold text-muted tracking-widest uppercase mb-3">
        Contenidos
      </p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: item.level === 2 ? 0 : item.level === 3 ? '0.875rem' : '1.5rem' }}
          >
            <a
              href={`#${item.id}`}
              className={`block py-0.5 leading-snug transition-colors duration-150 ${
                activeId === item.id
                  ? 'text-accent font-medium'
                  : 'text-muted hover:text-text'
              }`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
