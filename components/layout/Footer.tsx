import Link from 'next/link'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-muted text-sm font-sans">
        <p>© {year} Narratix — Yan Kessel</p>
        <div className="flex items-center gap-5">
          <Link href="/blog" className="hover:text-text transition-colors">Blog</Link>
          <Link href="/about" className="hover:text-text transition-colors">About</Link>
          <a href="/feed.xml" className="hover:text-accent transition-colors">RSS</a>
          <a
            href="https://github.com/yankessel"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text transition-colors"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </footer>
  )
}
