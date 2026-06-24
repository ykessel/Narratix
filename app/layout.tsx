import type { Metadata } from 'next'
import { Space_Grotesk, Lora, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'Narratix', template: '%s — Narratix' },
  description: 'A blog about modern web development, TypeScript, Next.js and interface design.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Narratix',
  },
  twitter: { card: 'summary_large_image' },
  alternates: { types: { 'application/rss+xml': '/feed.xml' } },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      {/*
        Script inline antes de cualquier render:
        lee localStorage y aplica data-theme al <html> para evitar FOUC.
        suppressHydrationWarning en <html> permite que el atributo sea
        diferente entre server (sin data-theme) y client (con tema guardado).
      */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('narratix-theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',t||(d?'dark':'light'));}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`
          ${spaceGrotesk.variable} ${lora.variable}
          ${inter.variable} ${jetbrainsMono.variable}
          bg-background text-text min-h-screen
        `}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
