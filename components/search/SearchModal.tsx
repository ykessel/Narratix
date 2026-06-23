'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────

type SearchPost = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  tags?: string[]
  categories?: Array<{ title: string; slug: string; color?: string }>
  publishedAt?: string
  readingTime?: number
}

// ─── Search logic ─────────────────────────────────────────

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

function scorePost(post: SearchPost, query: string): number {
  const q = normalize(query)
  let score = 0
  if (normalize(post.title).includes(q)) score += 10
  if (normalize(post.excerpt ?? '').includes(q)) score += 5
  if (post.tags?.some((t) => normalize(t).includes(q))) score += 3
  if (post.categories?.some((c) => normalize(c.title).includes(q))) score += 3
  return score
}

function searchPosts(posts: SearchPost[], query: string): SearchPost[] {
  if (!query.trim()) return []
  return posts
    .map((post) => ({ post, score: scorePost(post, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ post }) => post)
}

// ─── Highlight helper ─────────────────────────────────────

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim() || !text) return <>{text}</>
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
  const testRe = new RegExp(`^${escaped}$`, 'i')
  return (
    <>
      {parts.map((part, i) =>
        testRe.test(part) ? (
          <mark
            key={i}
            className="bg-violet-100 text-violet-700 rounded px-0.5 not-italic font-medium"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

// ─── Category pill ────────────────────────────────────────

function CategoryPill({ category }: { category: { title: string; color?: string } }) {
  const style = category.color
    ? {
        backgroundColor: `${category.color}18`,
        color: category.color,
        borderColor: `${category.color}35`,
      }
    : {}
  return (
    <span
      className="inline-block px-1.5 py-0.5 text-[10px] font-sans font-medium rounded border border-border text-muted"
      style={category.color ? style : undefined}
    >
      {category.title}
    </span>
  )
}

// ─── Keyboard shortcut hint ───────────────────────────────

function KbdHint({ keys, label }: { keys: string[]; label: string }) {
  return (
    <span className="flex items-center gap-1 font-sans text-[10px] text-muted">
      {keys.map((k) => (
        <kbd
          key={k}
          className="px-1 py-0.5 rounded border border-border bg-background text-[10px] font-mono leading-none"
        >
          {k}
        </kbd>
      ))}
      <span>{label}</span>
    </span>
  )
}

// ─── Icons ────────────────────────────────────────────────

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg
      className="animate-spin text-muted shrink-0"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

// ─── Main component ───────────────────────────────────────

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const [query, setQuery] = useState('')
  const [posts, setPosts] = useState<SearchPost[] | null>(null) // null = no cargado aún
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const results = posts ? searchPosts(posts, query) : []

  // Cargar posts la primera vez que se abre el modal
  useEffect(() => {
    if (isOpen && posts === null && !loading) {
      setLoading(true)
      fetch('/api/search')
        .then((res) => res.json())
        .then((data: unknown) => {
          setPosts(Array.isArray(data) ? (data as SearchPost[]) : [])
        })
        .catch(() => setPosts([]))
        .finally(() => setLoading(false))
    }
  }, [isOpen, posts, loading])

  // Enfocar input y limpiar query al abrir
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setSelectedIndex(0)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Resetear índice seleccionado cuando cambian los resultados
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Mantener el ítem seleccionado visible en el scroll
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const item = list.children[selectedIndex] as HTMLElement | undefined
    item?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  const navigateToSelected = useCallback(() => {
    const result = results[selectedIndex]
    if (result) {
      router.push(`/blog/${result.slug}`)
      onClose()
    }
  }, [results, selectedIndex, router, onClose])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((i) => Math.max(i - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          navigateToSelected()
          break
      }
    },
    [results.length, onClose, navigateToSelected]
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-text/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal card */}
          <div className="fixed inset-x-0 top-0 z-50 flex items-start justify-center pt-[10vh] px-4">
            <motion.div
              className="w-full max-w-xl bg-surface rounded-2xl shadow-2xl border border-border overflow-hidden"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleKeyDown}
              role="dialog"
              aria-modal="true"
              aria-label="Buscar artículos"
            >
              {/* ── Input ── */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
                <SearchIcon className="shrink-0 text-muted" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar artículos..."
                  className="flex-1 bg-transparent font-sans text-sm text-text placeholder:text-muted focus:outline-none"
                  aria-label="Buscar artículos"
                  autoComplete="off"
                  spellCheck={false}
                />
                {loading && <Spinner />}
                <button
                  onClick={onClose}
                  className="shrink-0 p-1.5 rounded-lg text-muted hover:text-text hover:bg-background transition-colors"
                  aria-label="Cerrar búsqueda"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* ── Results ── */}
              {query.trim().length > 0 && (
                <>
                  {results.length > 0 ? (
                    <>
                      <ul
                        ref={listRef}
                        className="max-h-80 overflow-y-auto divide-y divide-border"
                        role="listbox"
                        aria-label="Resultados de búsqueda"
                      >
                        {results.map((post, i) => (
                          <li key={post._id} role="option" aria-selected={i === selectedIndex}>
                            <Link
                              href={`/blog/${post.slug}`}
                              onClick={onClose}
                              onMouseEnter={() => setSelectedIndex(i)}
                              className={`flex flex-col gap-1 px-4 py-3 transition-colors duration-100 ${
                                i === selectedIndex ? 'bg-accent-light' : 'hover:bg-background'
                              }`}
                            >
                              {/* Categories */}
                              {post.categories && post.categories.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-0.5">
                                  {post.categories.slice(0, 2).map((cat) => (
                                    <CategoryPill key={cat.slug} category={cat} />
                                  ))}
                                </div>
                              )}

                              {/* Title */}
                              <p className="font-sans font-medium text-sm text-text leading-snug">
                                <Highlight text={post.title} query={query} />
                              </p>

                              {/* Excerpt snippet */}
                              {post.excerpt && (
                                <p className="font-sans text-xs text-muted line-clamp-1 leading-relaxed">
                                  <Highlight text={post.excerpt.slice(0, 130)} query={query} />
                                </p>
                              )}

                              {/* Meta */}
                              <p className="font-sans text-[10px] text-muted/60 flex items-center gap-1.5 mt-0.5">
                                {(post.readingTime ?? 0) > 0 && (
                                  <>
                                    <span>{post.readingTime} min lectura</span>
                                    <span aria-hidden>·</span>
                                  </>
                                )}
                                {post.publishedAt && (
                                  <span>
                                    {new Date(post.publishedAt).toLocaleDateString('es', {
                                      month: 'short',
                                      year: 'numeric',
                                    })}
                                  </span>
                                )}
                                {post.tags && post.tags.length > 0 && (
                                  <>
                                    <span aria-hidden>·</span>
                                    <span className="truncate max-w-[160px]">
                                      {post.tags.slice(0, 3).join(', ')}
                                    </span>
                                  </>
                                )}
                              </p>
                            </Link>
                          </li>
                        ))}
                      </ul>

                      {/* Keyboard hints footer */}
                      <div className="px-4 py-2.5 border-t border-border bg-background/60 flex items-center gap-4">
                        <KbdHint keys={['↑', '↓']} label="navegar" />
                        <KbdHint keys={['↵']} label="abrir" />
                        <KbdHint keys={['Esc']} label="cerrar" />
                        <span className="ml-auto font-sans text-[10px] text-muted/50">
                          {results.length} resultado{results.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </>
                  ) : !loading ? (
                    /* No results */
                    <div className="px-4 py-12 text-center">
                      <p className="font-sans text-sm text-muted">
                        Sin resultados para{' '}
                        <span className="font-medium text-text">"{query}"</span>
                      </p>
                      <p className="font-sans text-xs text-muted/60 mt-1">
                        Intenta con otras palabras clave
                      </p>
                    </div>
                  ) : null}
                </>
              )}

              {/* Empty state — sin query */}
              {!query.trim() && posts !== null && (
                <div className="px-4 py-8 text-center">
                  <p className="font-sans text-xs text-muted/70">
                    {posts.length > 0
                      ? `${posts.length} artículo${posts.length !== 1 ? 's' : ''} disponibles`
                      : 'Aún no hay artículos publicados'}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
