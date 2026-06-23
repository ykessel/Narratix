import Link from 'next/link'
import type { SanityCategory } from '@/lib/sanity/types'

type Props = {
  category: Pick<SanityCategory, 'title' | 'slug' | 'color'>
  size?: 'sm' | 'md'
  asLink?: boolean
}

export function CategoryBadge({ category, size = 'md', asLink = true }: Props) {
  const color = category.color ?? '#7c3aed'

  const classes = `
    inline-flex items-center font-sans font-medium rounded-full transition-opacity hover:opacity-80
    ${size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'}
  `

  const style = {
    backgroundColor: `${color}18`,
    color,
    border: `1px solid ${color}30`,
  }

  if (!asLink) {
    return (
      <span className={classes} style={style}>
        {category.title}
      </span>
    )
  }

  return (
    <Link href={`/categories/${category.slug.current}`} className={classes} style={style}>
      {category.title}
    </Link>
  )
}
