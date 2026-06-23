export type SanityImage = {
  _type: 'image'
  asset: { _ref: string; _type: 'reference' }
  hotspot?: { x: number; y: number; width: number; height: number }
  alt?: string
}

export type SanityAuthor = {
  _id: string
  name: string
  bio?: string
  avatar?: SanityImage
  social?: {
    twitter?: string
    github?: string
    linkedin?: string
  }
}

export type SanityCategory = {
  _id: string
  title: string
  slug: { current: string }
  description?: string
  color?: string
}

export type SanityPost = {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  coverImage?: SanityImage
  body?: SanityBlock[]
  publishedAt?: string
  featured?: boolean
  author?: SanityAuthor
  categories?: SanityCategory[]
  tags?: string[]
  readingTime?: number
}

export type SanityBlock = {
  _key: string
  _type: string
  style?: string
  children?: Array<{ _key: string; _type: string; text: string; marks?: string[] }>
  markDefs?: Array<{ _key: string; _type: string; href?: string; blank?: boolean }>
  // Custom block types
  code?: string
  language?: string
  filename?: string
  type?: 'tip' | 'info' | 'warning' | 'danger'
  text?: string
}
