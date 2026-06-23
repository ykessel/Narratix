/**
 * Seed script — crea autor, categorías y 6 posts en Sanity.
 *
 * Prerrequisitos:
 *   npm install -D tsx          (solo la primera vez)
 *
 * Ejecución:
 *   npx tsx scripts/seed-posts.ts
 *
 * El script lee .env.local automáticamente. Asegúrate de tener:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=...
 *   NEXT_PUBLIC_SANITY_DATASET=production
 *   SANITY_API_TOKEN=...   ← necesita rol "Editor" o "Administrator"
 *
 * Es idempotente: ejecutarlo varias veces no duplica documentos.
 */

import { createClient, type SanityClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

// ─── Cargar .env.local sin depender de dotenv ────────────

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const match = line.match(/^([^#=\s][^=]*)=(.*)$/)
    if (match) {
      const [, key, raw] = match
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = raw.trim().replace(/^["']|["']$/g, '')
      }
    }
  }
}
loadEnvLocal()

// ─── Cliente Sanity ───────────────────────────────────────

function getClient(): SanityClient {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const token     = process.env.SANITY_API_TOKEN
  const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

  if (!projectId) throw new Error('Falta NEXT_PUBLIC_SANITY_PROJECT_ID en .env.local')
  if (!token)     throw new Error('Falta SANITY_API_TOKEN en .env.local')

  return createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false })
}

// ─── Generador de keys únicos ─────────────────────────────

let _counter = 0
const k = () => `k${String(++_counter).padStart(5, '0')}`

// ─── Helpers de Portable Text ─────────────────────────────

type Block = Record<string, unknown>

const p = (...segments: Array<string | { text: string; marks: string[] }>): Block => ({
  _type: 'block', _key: k(), style: 'normal',
  markDefs: [],
  children: segments.map(seg =>
    typeof seg === 'string'
      ? { _type: 'span', _key: k(), text: seg, marks: [] }
      : { _type: 'span', _key: k(), text: seg.text, marks: seg.marks }
  ),
})

const bold  = (text: string) => ({ text, marks: ['strong'] })
const code  = (text: string) => ({ text, marks: ['code'] })

const h2 = (text: string): Block => ({
  _type: 'block', _key: k(), style: 'h2',
  markDefs: [],
  children: [{ _type: 'span', _key: k(), text, marks: [] }],
})

const h3 = (text: string): Block => ({
  _type: 'block', _key: k(), style: 'h3',
  markDefs: [],
  children: [{ _type: 'span', _key: k(), text, marks: [] }],
})

const codeBlock = (codeStr: string, language = 'typescript', filename?: string): Block => ({
  _type: 'codeBlock', _key: k(), code: codeStr, language,
  ...(filename ? { filename } : {}),
})

const callout = (text: string, type: 'tip' | 'info' | 'warning' | 'danger' = 'info'): Block => ({
  _type: 'callout', _key: k(), type, text,
})

// ─── Documentos ───────────────────────────────────────────

const AUTHOR_ID = 'author-yan-kessel'

const author = {
  _id:  AUTHOR_ID,
  _type: 'author',
  name: 'Yan Kessel',
  slug: { _type: 'slug', current: 'yan-kessel' },
  bio: 'Desarrollador web full-stack especializado en Next.js, TypeScript y diseño de interfaces. Escribo sobre lo que aprendo construyendo productos reales.',
  social: {
    github:   'yankessel',
    twitter:  'yankessel',
    linkedin: 'yankessel',
  },
}

const categories = [
  { _id: 'cat-nextjs',      _type: 'category', title: 'Next.js',     slug: { _type: 'slug', current: 'nextjs'      }, color: '#0070f3', description: 'Framework de React para producción.' },
  { _id: 'cat-typescript',  _type: 'category', title: 'TypeScript',  slug: { _type: 'slug', current: 'typescript'  }, color: '#3178c6', description: 'JavaScript con tipos estáticos.' },
  { _id: 'cat-css',         _type: 'category', title: 'CSS',         slug: { _type: 'slug', current: 'css'         }, color: '#e44d26', description: 'Estilos, layouts y diseño visual.' },
  { _id: 'cat-react',       _type: 'category', title: 'React',       slug: { _type: 'slug', current: 'react'       }, color: '#61dafb', description: 'Biblioteca de UI para JavaScript.' },
  { _id: 'cat-animaciones', _type: 'category', title: 'Animaciones', slug: { _type: 'slug', current: 'animaciones' }, color: '#a855f7', description: 'Motion design y animaciones web.' },
  { _id: 'cat-performance', _type: 'category', title: 'Performance', slug: { _type: 'slug', current: 'performance' }, color: '#10b981', description: 'Optimización y métricas web.' },
]

// ─── Posts ────────────────────────────────────────────────

const posts = [

  // ── 1. Turbopack + Next.js 16 (featured) ────────────────
  {
    _id:   'post-nextjs-turbopack',
    _type: 'post',
    title: 'Next.js 16 con Turbopack: menos espera, más código',
    slug:  { _type: 'slug', current: 'nextjs-16-turbopack' },
    excerpt: 'Turbopack llega a producción en Next.js 16. Guía práctica de configuración, qué ganas en velocidad y qué debes tener en cuenta antes de migrar.',
    publishedAt: '2026-04-15T09:00:00Z',
    featured: true,
    author:     { _type: 'reference', _ref: AUTHOR_ID },
    categories: [{ _type: 'reference', _ref: 'cat-nextjs' }],
    tags: ['Next.js', 'Turbopack', 'performance', 'bundler', 'DX'],
    body: [
      p('Desde que Next.js 15 anunció Turbopack como beta, la comunidad esperaba el momento en que se convirtiera en el bundler por defecto. Con Next.js 16, eso ya es una realidad: Turbopack está activado en desarrollo sin ninguna flag adicional.'),

      h2('¿Qué es Turbopack y por qué importa?'),
      p('Turbopack es el sucesor de Webpack, escrito en Rust. La promesa es simple: compilaciones iniciales hasta ', bold('5× más rápidas'), ' y actualizaciones de módulos (HMR) casi instantáneas gracias a un sistema de caché incremental a nivel de función. A diferencia de Webpack, que recalcula el grafo completo de dependencias en cada cambio, Turbopack solo recompila las funciones que realmente cambiaron.'),

      callout('En un proyecto con 3.000 módulos, Turbopack reduce el tiempo de startup de ~8s a ~1.5s. En proyectos con más de 10.000 módulos, la diferencia puede ser de 10× o más.', 'info'),

      h2('Activarlo en Next.js 16'),
      p('Con Next.js 16, Turbopack ya es el default en desarrollo. Si venías de versiones anteriores y tenías ', code('--turbopack'), ' explícito en el script ', code('dev'), ', ya no es necesario:'),

      codeBlock(`{
  "scripts": {
    "dev":   "next dev",      // Turbopack activo automáticamente
    "build": "next build",    // Sigue usando Webpack/SWC en producción
    "start": "next start"
  }
}`, 'json', 'package.json'),

      p('En producción, Turbopack todavía no se usa (sigue siendo Webpack/SWC), pero el equipo de Vercel lo tiene en la hoja de ruta para Next.js 17.'),

      h2('Compatibilidad con tu configuración actual'),
      p('La mayoría de configuraciones en ', code('next.config.ts'), ' funcionan sin cambios. Las excepciones más comunes son los loaders personalizados de Webpack que no tienen equivalente en Turbopack. Si usas ', code('babel-loader'), ' con transformaciones muy específicas, puede que necesites migrar a SWC transforms.'),

      codeBlock(`// next.config.ts — sin cambios para la mayoría de proyectos
import type { NextConfig } from 'next'

const config: NextConfig = {
  // Ya no es necesario experimental.turbo
  // Los plugins de webpack compatibles siguen funcionando
  images: {
    remotePatterns: [{ hostname: 'cdn.sanity.io' }],
  },
}

export default config`, 'typescript', 'next.config.ts'),

      callout('Si un plugin de Webpack falla, busca su equivalente nativo o revisa la lista oficial de compatibilidad de Turbopack en la documentación de Next.js.', 'warning'),

      h2('El cambio que más vas a notar en el día a día'),
      p('No es el tiempo de compilación inicial, sino el tiempo entre que guardas un archivo y ves el cambio en el navegador. Con Webpack, modificar un componente profundo en el árbol tomaba 800ms–2s. Con Turbopack, el mismo cambio se refleja en menos de 100ms. El flujo de desarrollo se siente fundamentalmente diferente.'),

      p('El otro cambio notable es el uso de memoria. Turbopack gestiona la caché de forma más eficiente y no crece indefinidamente como tendía a hacer Webpack en proyectos grandes ejecutados durante horas.'),
    ],
  },

  // ── 2. TypeScript avanzado ───────────────────────────────
  {
    _id:   'post-typescript-patterns',
    _type: 'post',
    title: 'TypeScript que escala: discriminated unions, template literals y conditional types',
    slug:  { _type: 'slug', current: 'typescript-patrones-avanzados' },
    excerpt: 'Tres patrones de TypeScript que transforman cómo modelas el dominio de tu app. Con ejemplos reales y progresivos que puedes aplicar hoy.',
    publishedAt: '2026-03-20T09:00:00Z',
    featured: false,
    author:     { _type: 'reference', _ref: AUTHOR_ID },
    categories: [{ _type: 'reference', _ref: 'cat-typescript' }],
    tags: ['TypeScript', 'patrones', 'tipado', 'discriminated unions', 'utility types'],
    body: [
      p('TypeScript es más que añadir tipos a JavaScript. Con los patrones correctos, el compilador se convierte en un aliado que previene clases enteras de bugs antes de que lleguen a producción. Estos tres patrones cambian la forma en que modelas tu dominio.'),

      h2('Discriminated Unions: estados imposibles inexpresables'),
      p('El patrón más poderoso de TypeScript. Permite modelar estados del dominio de forma que el compilador ', bold('garantice que nunca accedas a datos que no existen'), '.'),

      codeBlock(`// ❌ El problema: estado inconsistente
type FetchState = {
  loading: boolean
  data?: User
  error?: string
}
// Nada impide: { loading: true, data: someUser, error: "oops" }

// ✅ La solución: discriminated union
type FetchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: string }

function render(state: FetchState) {
  if (state.status === 'success') {
    // TypeScript sabe que data existe — sin optional chaining
    console.log(state.data.name)
  }
  if (state.status === 'error') {
    console.error(state.error) // error siempre es string aquí
  }
}`, 'typescript'),

      callout('El discriminante (en este caso, status) debe ser un literal type. Usar boolean o number funciona, pero los string literals son los más legibles y los que el compilador maneja mejor en los narrowing checks.', 'tip'),

      h2('Template Literal Types: tipos que describen el dominio'),
      p('Los template literal types permiten construir tipos de string con la misma expresividad que las template literals de JavaScript. Son especialmente útiles para APIs de eventos, variantes de componentes y rutas.'),

      codeBlock(`type Size  = 'sm' | 'md' | 'lg' | 'xl'
type Color = 'primary' | 'secondary' | 'danger' | 'ghost'

// Describe todas las combinaciones válidas de clase
type ButtonVariant = \`btn-\${Color}-\${Size}\`
// = 'btn-primary-sm' | 'btn-primary-md' | ... (16 combinaciones)

// Aplicado a event emitters tipados
type EventMap = {
  click: MouseEvent
  keydown: KeyboardEvent
  resize: UIEvent
}
type EventName = \`on\${Capitalize<keyof EventMap>}\`
// = 'onClick' | 'onKeydown' | 'onResize'

// Extrayendo el nombre del evento desde el handler
type ExtractEvent<T extends string> =
  T extends \`on\${infer E}\` ? Uncapitalize<E> : never
type Event = ExtractEvent<'onClick'>  // 'click'`, 'typescript'),

      h2('Conditional Types para APIs genéricas'),
      p('Los conditional types resuelven un problema muy común: funciones que devuelven tipos distintos según sus argumentos. Con ellos puedes crear APIs que son tanto genéricas como precisas.'),

      codeBlock(`// Extraer el tipo interno de una Promise
type Awaited<T> = T extends Promise<infer U> ? U : T
type Resolved = Awaited<Promise<string>>  // string
type Direct   = Awaited<number>           // number

// Utility type para inferir el return type sin Promise
type SyncReturn<T extends (...args: never[]) => unknown> =
  ReturnType<T> extends Promise<infer R> ? R : ReturnType<T>

// Ejemplo práctico: función overloaded con tipos precisos
function parseInput(input: string): string
function parseInput(input: number): number
function parseInput(input: string | number): string | number {
  return typeof input === 'string' ? input.trim() : input * 2
}

// TypeScript infiere el tipo correcto según el argumento
const a = parseInput('hello')  // string
const b = parseInput(42)       // number`, 'typescript'),

      callout('Los utility types de TypeScript (Partial, Required, Pick, Omit, ReturnType, Parameters) están construidos sobre estos mismos mecanismos. Entenderlos te da la base para crear tus propios helpers de tipo.', 'tip'),

      h2('Combinar los tres patrones'),
      p('El verdadero poder aparece cuando combinas estos patrones. Una discriminated union con template literal types como discriminante, cuya resolución usa conditional types, puede describir APIs complejas con total precisión de tipos y zero overhead en runtime.'),
    ],
  },

  // ── 3. CSS Dark Mode ─────────────────────────────────────
  {
    _id:   'post-css-dark-mode',
    _type: 'post',
    title: 'Dark mode sin flash: CSS custom properties y prevención de FOUC',
    slug:  { _type: 'slug', current: 'dark-mode-css-variables-fouc' },
    excerpt: 'Implementar dark mode parece sencillo hasta que ves el destello blanco al recargar. Esta guía resuelve el FOUC de raíz con CSS variables y un script inline.',
    publishedAt: '2026-02-28T09:00:00Z',
    featured: false,
    author:     { _type: 'reference', _ref: AUTHOR_ID },
    categories: [{ _type: 'reference', _ref: 'cat-css' }],
    tags: ['CSS', 'dark mode', 'custom properties', 'FOUC', 'UX'],
    body: [
      p('Dark mode parece sencillo hasta que tu usuario recarga la página y ve un destello de fondo blanco antes de que JavaScript aplique el tema guardado. Ese momento se llama FOUC (Flash of Unstyled Content) y arruina la experiencia. La buena noticia: es completamente evitable.'),

      h2('Por qué el toggle de className no escala'),
      p('La solución naive es añadir/quitar una clase ', code('dark'), ' en el ', code('body'), ' desde JavaScript. El problema: React necesita hidratarse antes de ejecutar ese código. Entre el HTML inicial (sin clase) y la hidratación (con clase), el usuario ve el tema incorrecto durante 200–400ms. En conexiones lentas, puede ser más de un segundo.'),

      h2('CSS custom properties: el enfoque correcto'),
      p('La solución es definir todo el sistema de colores con CSS variables y cambiar su valor según el atributo ', code('data-theme'), ' en el elemento ', code('html'), '. El cambio es puramente CSS, instantáneo, y no requiere ningún re-render de React.'),

      codeBlock(`:root {
  /* Formato R G B — permite modificadores de opacidad en Tailwind */
  --color-background: 250 250 249;  /* #fafaf9 */
  --color-text:       28  25  23;   /* #1c1917 */
  --color-accent:     124 58  237;  /* #7c3aed */
}

[data-theme="dark"] {
  --color-background: 17  17  16;   /* #111110 */
  --color-text:       232 230 227;  /* #e8e6e3 */
  --color-accent:     167 139 250;  /* #a78bfa — más claro para dark */
}

body {
  background-color: rgb(var(--color-background));
  color:            rgb(var(--color-text));
  transition: background-color 250ms ease, color 250ms ease;
}`, 'css', 'globals.css'),

      callout('Usa formato RGB sin paréntesis (250 250 249) en lugar de hex (#fafaf9). Esto permite aplicar opacidad directamente: rgb(var(--color-accent) / 0.15). Con hex, esto no funciona en CSS moderno.', 'tip'),

      h2('Prevenir el FOUC con un script inline'),
      p('La clave está en ejecutar código JavaScript ', bold('sincrónicamente'), ' antes de que React renderice. Un script inline en el ', code('<head>'), ' sin ', code('defer'), ' ni ', code('async'), ' se ejecuta de forma bloqueante — exactamente lo que queremos aquí.'),

      codeBlock(`// app/layout.tsx — el script corre ANTES del primer paint
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: \`(function(){
              try {
                var t = localStorage.getItem('app-theme');
                var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.setAttribute('data-theme', t || (d ? 'dark' : 'light'));
              } catch(e) {}
            })();\`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}`, 'typescript', 'app/layout.tsx'),

      callout('suppressHydrationWarning en <html> es necesario porque el servidor renderiza el elemento sin data-theme, pero el cliente lo añade antes de la hidratación. Sin esta prop, React lanzaría un warning de mismatch.', 'info'),

      h2('El componente ThemeToggle sin hydration mismatch'),
      p('El estado inicial del toggle debe ser ', code('null'), ', no ', code('"light"'), '. Si asumes un tema inicial, el HTML generado por el servidor y el cliente pueden diferir, causando el warning de hydration. Con ', code('null'), ' renderizas un placeholder vacío hasta que el componente se monta y puede leer el tema real.'),

      codeBlock(`'use client'
import { useState, useEffect } from 'react'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null)

  useEffect(() => {
    // Leer el tema que el script inline ya aplicó
    const current = document.documentElement.getAttribute('data-theme') as 'light' | 'dark'
    setTheme(current ?? 'light')
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('app-theme', next)
  }

  // Placeholder del mismo tamaño para evitar layout shift
  if (!theme) return <div className="w-8 h-8" />

  return <button onClick={toggle}>{theme === 'dark' ? '☀️' : '🌙'}</button>
}`, 'typescript', 'ThemeToggle.tsx'),
    ],
  },

  // ── 4. React 19 ─────────────────────────────────────────
  {
    _id:   'post-react-19',
    _type: 'post',
    title: 'React 19 en producción: lo que realmente cambia en tu código',
    slug:  { _type: 'slug', current: 'react-19-novedades-produccion' },
    excerpt: 'React 19 trae el compilador automático, el hook use(), mejoras en Server Components y Optimistic UI nativo. Un repaso honesto de qué adoptar hoy.',
    publishedAt: '2026-01-15T09:00:00Z',
    featured: false,
    author:     { _type: 'reference', _ref: AUTHOR_ID },
    categories: [{ _type: 'reference', _ref: 'cat-react' }],
    tags: ['React', 'React 19', 'Server Components', 'compilador', 'useOptimistic'],
    body: [
      p('React 19 es la actualización más significativa desde los hooks. Trae el compilador oficial, el hook ', code('use()'), ', mejoras en Server Components y Optimistic UI nativo. Pero no todo requiere migración inmediata. Aquí lo que realmente cambia en el código de todos los días.'),

      h2('El compilador: adiós a useMemo y useCallback manuales'),
      p('El cambio más impactante a largo plazo es el compilador de React, que analiza tu código en build time y añade memoización automática. Ya no necesitas envolver funciones y valores en ', code('useCallback'), ' y ', code('useMemo'), ' como medida defensiva.'),

      codeBlock(`// Antes de React 19 — memoización manual y verbosa
function ProductList({ products, onSelect }: Props) {
  const sorted = useMemo(
    () => [...products].sort((a, b) => a.price - b.price),
    [products]
  )
  const handleSelect = useCallback(
    (id: string) => onSelect(id),
    [onSelect]
  )
  return <List items={sorted} onSelect={handleSelect} />
}

// Con React 19 + compilador — el compilador infiere qué memoizar
function ProductList({ products, onSelect }: Props) {
  const sorted = [...products].sort((a, b) => a.price - b.price)
  return <List items={sorted} onSelect={onSelect} />
}`, 'typescript'),

      callout('El compilador solo optimiza código que siga las reglas de React (no mutaciones directas de estado, hooks condicionales, etc.). Si tienes code smells, el compilador los detecta y desactiva la optimización para ese componente, no para toda la app.', 'warning'),

      h2('El hook use(): consumir promesas en render'),
      p(code('use()'), ' es una función especial que puede suspender un componente mientras espera una promesa. A diferencia de ', code('await'), ', puede llamarse condicionalmente y dentro de callbacks, lo que abre patrones que antes eran imposibles.'),

      codeBlock(`import { use, Suspense } from 'react'

// El Server Component crea la promesa pero NO la awaita
async function PostPage({ slug }: { slug: string }) {
  const postPromise = fetchPost(slug) // Promise<Post>
  return (
    <Suspense fallback={<PostSkeleton />}>
      <PostContent promise={postPromise} />
    </Suspense>
  )
}

// El Client Component la resuelve con use()
'use client'
function PostContent({ promise }: { promise: Promise<Post> }) {
  const post = use(promise) // Suspende hasta resolver
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.excerpt}</p>
    </article>
  )
}`, 'typescript'),

      h2('useOptimistic: UI que no espera al servidor'),
      p(code('useOptimistic'), ' permite mostrar el estado esperado de una acción ', bold('antes de que el servidor responda'), ', y revertirlo automáticamente si la operación falla. Es la forma idiomática de React 19 para construir interfaces que se sienten instantáneas.'),

      codeBlock(`import { useOptimistic, useTransition } from 'react'

function CommentList({ postId, comments }: Props) {
  const [optimisticComments, addOptimistic] = useOptimistic(
    comments,
    (current, newComment: Comment) => [...current, newComment]
  )
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    const text = formData.get('text') as string
    const tempComment: Comment = {
      id:   crypto.randomUUID(),
      text, author: 'Tú',
      createdAt: new Date().toISOString(),
    }

    startTransition(async () => {
      addOptimistic(tempComment)      // UI actualiza inmediatamente
      await createComment(postId, text) // Si falla → revierte solo
    })
  }

  return (
    <>
      {optimisticComments.map(c => (
        <div key={c.id} style={{ opacity: isPending ? 0.7 : 1 }}>
          {c.text}
        </div>
      ))}
      <form action={handleSubmit}>
        <input name="text" required />
        <button type="submit">Comentar</button>
      </form>
    </>
  )
}`, 'typescript'),

      callout('useOptimistic funciona junto con Server Actions de React. Si usas Next.js con el App Router, las acciones del formulario pueden ser async functions del servidor sin necesidad de una API route.', 'tip'),
    ],
  },

  // ── 5. Framer Motion ─────────────────────────────────────
  {
    _id:   'post-framer-motion',
    _type: 'post',
    title: 'Animaciones de layout con Framer Motion: fluidez sin sacrificar rendimiento',
    slug:  { _type: 'slug', current: 'framer-motion-layout-animations' },
    excerpt: 'layout={true} en Framer Motion hace magia, pero si no entiendes LayoutGroup y layoutId, tus animaciones se romperán. Aquí explicamos cuándo y cómo usarlos.',
    publishedAt: '2025-12-10T09:00:00Z',
    featured: false,
    author:     { _type: 'reference', _ref: AUTHOR_ID },
    categories: [{ _type: 'reference', _ref: 'cat-animaciones' }],
    tags: ['Framer Motion', 'animaciones', 'React', 'layout', 'UX'],
    body: [
      p('Framer Motion es la librería de animaciones más usada en el ecosistema React. Pero hay una diferencia importante entre usar ', code('motion.div'), ' para fade-ins y entender cuándo y por qué animar con ', code('layout={true}'), '. Esa diferencia separa las animaciones que impresionan de las que se rompen.'),

      h2('Transform vs Layout animations: la distinción clave'),
      p('Las animaciones normales (opacity, x, y, scale) usan transforms de CSS que se ejecutan en el compositor del navegador ', bold('sin forzar un reflow'), '. Son baratas. Las layout animations son diferentes: animan cambios reales en el tamaño y posición de un elemento en el DOM, y necesitan recalcular geometría.'),

      codeBlock(`// Animación normal — solo transforma visualmente, sin reflow
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
/>

// Layout animation — anima cambios estructurales en el DOM
<motion.div layout>
  {isExpanded && <ExtraContent />}
</motion.div>
// Cuando ExtraContent aparece y cambia la altura,
// motion.div anima la transición de altura automáticamente`, 'typescript'),

      callout('Usa layout={true} solo cuando el tamaño o posición de un elemento cambie por razones externas (otro elemento que aparece, un grid que se reorganiza). Para movimientos controlados, prefiere animate con x/y.', 'tip'),

      h2('layoutId: transiciones entre componentes distintos'),
      p('La característica más poderosa de las layout animations es ', code('layoutId'), '. Permite que dos elementos distintos en el DOM compartan una animación de transición. Cuando uno desmonta y el otro monta con el mismo ', code('layoutId'), ', Framer Motion interpola la transición entre los dos.'),

      codeBlock(`// El clásico: tarjeta que se expande a modal
function Gallery() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {items.map(item => (
          <motion.div
            key={item.id}
            layoutId={\`card-\${item.id}\`}
            onClick={() => setSelected(item.id)}
            className="cursor-pointer rounded-xl overflow-hidden"
          >
            <motion.img layoutId={\`img-\${item.id}\`} src={item.image} />
            <motion.h3 layoutId={\`title-\${item.id}\`} className="p-3">
              {item.title}
            </motion.h3>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            layoutId={\`card-\${selected}\`}
            className="fixed inset-0 z-50 flex flex-col"
            onClick={() => setSelected(null)}
          >
            {/* Este div "se convierte" visualmente en la tarjeta */}
            <motion.img layoutId={\`img-\${selected}\`} className="w-full" />
            <motion.h2 layoutId={\`title-\${selected}\`} className="p-6 text-2xl">
              {items.find(i => i.id === selected)?.title}
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}`, 'typescript'),

      h2('useMotionValue y springs para interactividad física'),
      p('Para animaciones que responden al cursor o al scroll, ', code('useMotionValue'), ' + ', code('useSpring'), ' dan una sensación física más natural que las animaciones basadas en tiempo. Los springs siguen al valor de forma orgánica, con inercia y amortiguación.'),

      codeBlock(`import { useMotionValue, useSpring, useTransform, motion } from 'framer-motion'

function TiltCard({ children }: { children: React.ReactNode }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring suaviza el movimiento — stiffness y damping controlan la física
  const rotateX = useSpring(useTransform(mouseY, [-150, 150], [12, -12]), {
    stiffness: 400, damping: 30
  })
  const rotateY = useSpring(useTransform(mouseX, [-150, 150], [-12, 12]), {
    stiffness: 400, damping: 30
  })

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left - width  / 2)
    mouseY.set(clientY - top  - height / 2)
  }

  return (
    <motion.div
      onMouseMove={onMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0) }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className="rounded-2xl bg-white p-6 shadow-xl"
    >
      {children}
    </motion.div>
  )
}`, 'typescript'),

      callout('useMotionValue no causa re-renders. El DOM se actualiza directamente a través del motor de animación. Esto lo hace ideal para animaciones de alta frecuencia como seguimiento del cursor o scroll.', 'info'),
    ],
  },

  // ── 6. Core Web Vitals ───────────────────────────────────
  {
    _id:   'post-core-web-vitals',
    _type: 'post',
    title: 'Core Web Vitals en 2025: LCP, CLS e INP sin sacrificar la experiencia',
    slug:  { _type: 'slug', current: 'core-web-vitals-lcp-cls-inp' },
    excerpt: 'Google sigue penalizando sitios lentos. Pero optimizar para métricas no debería arruinar la experiencia. Aquí el balance práctico para cada métrica.',
    publishedAt: '2025-11-20T09:00:00Z',
    featured: false,
    author:     { _type: 'reference', _ref: AUTHOR_ID },
    categories: [{ _type: 'reference', _ref: 'cat-performance' }, { _type: 'reference', _ref: 'cat-nextjs' }],
    tags: ['performance', 'Core Web Vitals', 'LCP', 'CLS', 'INP', 'SEO'],
    body: [
      p('En 2025, los Core Web Vitals siguen siendo una señal de ranking en Google. Pero la trampa es optimizar para las métricas en lugar de para la experiencia real. Los dos objetivos se alinean más de lo que parece, si entiendes qué mide cada métrica realmente.'),

      h2('LCP: la imagen de portada lo decide todo'),
      p('Largest Contentful Paint mide cuándo el elemento más grande de la pantalla es visible. En blogs, suele ser la imagen de portada. El error más común es no marcarla como prioritaria, dejando que el navegador la descubra tarde.'),

      codeBlock(`// ❌ Sin prioridad — el navegador la descarga cuando le toca
<Image
  src={coverUrl}
  alt={title}
  fill
  className="object-cover"
/>

// ✅ priority — añade fetchpriority="high" y un <link rel="preload">
<Image
  src={coverUrl}
  alt={title}
  fill
  priority                                          // Solo en el elemento LCP
  sizes="(max-width: 768px) 100vw, 1200px"         // Evita cargar versión enorme
  className="object-cover"
/>`, 'typescript'),

      callout('Usa priority solo en la imagen above-the-fold. Aplicarlo a todas las imágenes hace que el navegador no pueda priorizar nada, y el LCP empeora en lugar de mejorar.', 'warning'),

      h2('CLS: reserva espacio antes de que llegue el contenido'),
      p('Cumulative Layout Shift penaliza el movimiento inesperado del contenido. Los culpables más frecuentes son imágenes sin dimensiones, fuentes web sin fallback y contenido inyectado por JavaScript tras la carga.'),

      codeBlock(`// ❌ Sin dimensiones — el layout salta al cargar la imagen
<img src={avatarUrl} alt="Avatar" className="rounded-full" />

// ✅ Reservar espacio con aspect-ratio o width/height explícitos
<div className="relative w-16 h-16 rounded-full overflow-hidden">
  <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
</div>

// Para fuentes: next/font gestiona font-display automáticamente
// Pero si usas @font-face manual, añade font-display: optional
// para eliminar el FOUT por completo (a costa de usar la fuente de fallback
// en la primera carga si la red es lenta)`, 'typescript'),

      h3('El truco del font size adjustment'),
      p('Cuando el navegador intercambia la fuente web por el fallback y viceversa, las diferencias de métricas (altura de x, ascent, descent) causan un salto de layout. La propiedad ', code('size-adjust'), ' ajusta el fallback para que tenga el mismo tamaño que la web font, eliminando el salto visualmente.'),

      codeBlock(`/* Ajustar la fuente de fallback para que coincida en métricas */
@font-face {
  font-family: 'Lora Fallback';
  src: local('Georgia');
  size-adjust: 97%;           /* Ajustar hasta que los bloques tengan el mismo alto */
  ascent-override:  94%;
  descent-override: 24%;
}

/* En Next.js, next/font calcula estos valores automáticamente */`, 'css'),

      h2('INP: los handlers síncronos son el problema'),
      p('Interaction to Next Paint (sustituto de FID desde marzo 2024) mide el tiempo entre la interacción del usuario y el siguiente frame pintado. Los handlers de click muy pesados que bloquean el hilo principal son la causa más común de un INP alto.'),

      codeBlock(`// ❌ Filtrando 50.000 items en el hilo principal durante un click
function handleSearch(query: string) {
  const results = largeDataset.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase())
  )
  setResults(results)  // Bloquea el hilo hasta terminar
}

// ✅ Con startTransition — el input responde inmediatamente
// y los resultados se calculan en tiempo libre
import { startTransition, useState } from 'react'

function SearchBox() {
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState<Item[]>([])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setQuery(q)                     // Actualización urgente (el input)

    startTransition(() => {
      setResults(                   // Actualización no urgente (los resultados)
        largeDataset.filter(item =>
          item.title.toLowerCase().includes(q.toLowerCase())
        )
      )
    })
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      <ResultList items={results} />
    </>
  )
}`, 'typescript'),

      callout('Para datasets muy grandes (>100.000 items), startTransition sigue corriendo en el hilo principal. En ese caso, considera Web Workers con Comlink o una librería de búsqueda indexada como Fuse.js.', 'info'),

      h2('Medir antes de optimizar'),
      p('Las herramientas más útiles son Chrome DevTools (pestaña Performance, Lighthouse), ', code('web-vitals'), ' de Google (la librería, no la extensión) y el Chrome User Experience Report (CrUX) para datos reales de campo. Los datos de laboratorio de Lighthouse son un buen punto de partida, pero los datos de campo son los que Google usa para el ranking.'),
    ],
  },

]

// ─── Main ─────────────────────────────────────────────────

async function seed() {
  const client = getClient()

  console.log('\n🌱 Iniciando seed de Narratix...\n')

  // Crear autor
  console.log('📝 Creando autor...')
  await client.createOrReplace(author)
  console.log(`   ✓ ${author.name}`)

  // Crear categorías
  console.log('\n📁 Creando categorías...')
  for (const cat of categories) {
    await client.createOrReplace(cat)
    console.log(`   ✓ ${cat.title}`)
  }

  // Crear posts
  console.log('\n📄 Creando posts...')
  for (const post of posts) {
    await client.createOrReplace(post)
    const date = new Date(post.publishedAt).toLocaleDateString('es', {
      day: '2-digit', month: 'short', year: 'numeric'
    })
    console.log(`   ✓ ${post.title.slice(0, 60)}… (${date})`)
  }

  console.log(`\n✅ Seed completado:`)
  console.log(`   • 1 autor`)
  console.log(`   • ${categories.length} categorías`)
  console.log(`   • ${posts.length} posts`)
  console.log('\n→ Abre http://localhost:3000 para ver el resultado.\n')
}

seed().catch((err) => {
  console.error('\n❌ Error durante el seed:', err.message)
  if (err.message?.includes('Unauthorized') || err.message?.includes('403')) {
    console.error('   Verifica que SANITY_API_TOKEN tenga rol Editor o Administrator.')
  }
  process.exit(1)
})
