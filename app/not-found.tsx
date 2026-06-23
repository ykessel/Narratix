import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-24 text-center">
      <p className="font-mono text-sm text-muted mb-4">404</p>
      <h1 className="font-display font-bold text-4xl text-text mb-4">Página no encontrada</h1>
      <p className="text-muted font-sans mb-8">
        El artículo que buscas no existe o fue movido.
      </p>
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-sans text-sm font-medium rounded-full hover:bg-accent-dark transition-colors"
      >
        ← Volver al blog
      </Link>
    </main>
  )
}
