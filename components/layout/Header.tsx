'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'
import { SearchModal } from '@/components/search/SearchModal'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const navLinks = [
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
]

export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [isMac, setIsMac] = useState(false)
  const { scrollY } = useScroll()

  // Detectar plataforma para mostrar ⌘ o Ctrl
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().includes('MAC'))
  }, [])

  useEffect(() => {
    return scrollY.on('change', (v) => setScrolled(v > 40))
  }, [scrollY])

  // Atajo global Cmd/Ctrl + K para abrir búsqueda
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Ocultar header dentro del Studio de Sanity
  if (pathname.startsWith('/studio')) return null

  return (
    <>
      <motion.header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-background/90 backdrop-blur-md border-b border-border'
            : 'bg-transparent'
        }`}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-display font-bold text-xl text-text hover:text-accent transition-colors duration-200"
          >
            Narratix<span className="text-accent">.</span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-sans transition-colors duration-200 ${
                  pathname.startsWith(link.href)
                    ? 'text-accent font-medium'
                    : 'text-muted hover:text-text'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Botón de búsqueda */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 text-muted hover:text-text transition-colors duration-200 group"
              aria-label="Buscar artículos"
            >
              <SearchIcon />
              {/* Hint del atajo de teclado — visible solo en pantallas medianas+ */}
              <span className="hidden md:flex items-center gap-0.5">
                <kbd className="px-1.5 py-0.5 rounded border border-border bg-background/60 font-mono text-[10px] text-muted/60 group-hover:border-border group-hover:text-muted transition-colors leading-none">
                  {isMac ? '⌘' : 'Ctrl'}
                </kbd>
                <kbd className="px-1.5 py-0.5 rounded border border-border bg-background/60 font-mono text-[10px] text-muted/60 group-hover:border-border group-hover:text-muted transition-colors leading-none">
                  K
                </kbd>
              </span>
            </button>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* RSS */}
            <a
              href="/feed.xml"
              title="RSS Feed"
              className="text-muted hover:text-accent transition-colors duration-200"
              aria-label="RSS Feed"
            >
              <RSSIcon />
            </a>
          </nav>
        </div>
      </motion.header>

      {/* Modal de búsqueda — fuera del header para evitar z-index issues */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

// ─── Icons ────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg
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

function RSSIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
    </svg>
  )
}
