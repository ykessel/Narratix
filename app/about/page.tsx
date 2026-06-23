import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description: 'Sobre Narratix y su autor, Yan Kessel.',
}

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-14">
      <h1 className="font-display font-bold text-4xl text-text mb-8">About</h1>

      <div className="prose prose-lg font-sans max-w-none">
        <p>
          <strong>Narratix</strong> es un blog sobre desarrollo web moderno. Aquí escribo sobre
          Next.js, TypeScript, diseño de interfaces y el proceso de construir productos digitales
          de calidad.
        </p>
        <p>
          Soy <strong>Yan Kessel</strong>, desarrollador web full-stack con foco en el frontend.
          Me interesan la performance, la accesibilidad y las experiencias de usuario que se
          sienten naturales.
        </p>
        <p>
          Si algo de lo que escribo te resulta útil, puedes seguirme en{' '}
          <a href="https://github.com/yankessel" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>{' '}
          o suscribirte al{' '}
          <a href="/feed.xml">RSS feed</a> para no perderte nada.
        </p>
      </div>

      <div className="mt-10 flex gap-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-sans text-sm font-medium rounded-full hover:bg-accent-dark transition-colors"
        >
          Leer el blog →
        </Link>
        <a
          href="mailto:kesselyanniel@gmail.com"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-muted font-sans text-sm rounded-full hover:border-muted hover:text-text transition-colors"
        >
          Contacto
        </a>
      </div>
    </main>
  )
}
