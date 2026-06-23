# Narratix

Minimal blog platform built with Next.js 16 and Sanity CMS. Features a clean reading experience with rich content, dynamic OG images, client-side search and light/dark mode.

## Features

- **Sanity CMS** — structured content with custom schemas for posts, authors and categories
- **Blog** — post listing with category filters, reading time and rich portable text rendering
- **Client-side search** — modal with ⌘K shortcut, score-based ranking, accent-insensitive matching and text highlight
- **Dynamic OG images** — per-post Open Graph images generated on the edge with `next/og` and Space Grotesk font
- **Light / dark mode** — CSS custom properties, system preference detection, zero-FOUC, persisted in `localStorage`
- **Sanity Studio** — embedded at `/studio` for content management

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| CMS | Sanity v3 |
| Styling | Tailwind CSS + Typography plugin |
| Animations | Framer Motion |
| OG Images | `next/og` (edge runtime) |
| Language | TypeScript |

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/your-username/narratix.git
cd narratix
pnpm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=   # from sanity.io/manage
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=                # write token for Studio
```

**Create a Sanity project:** run `pnpm sanity init` or go to [sanity.io/manage](https://sanity.io/manage).

### 3. Seed content (optional)

```bash
npx tsx scripts/seed-posts.ts
```

Creates 1 author, 6 categories and 6 full blog posts in your Sanity dataset.

### 4. Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Studio is at [http://localhost:3000/studio](http://localhost:3000/studio).

## Project structure

```
app/
  page.tsx                        # Home — featured posts
  blog/
    page.tsx                      # Post listing
    [slug]/
      page.tsx                    # Post detail
      opengraph-image.tsx         # Dynamic OG image (edge)
  about/page.tsx                  # About page
  studio/[[...tool]]/page.tsx     # Embedded Sanity Studio
  api/search/route.ts             # Search endpoint (GROQ)
components/
  layout/                         # Header, Footer
  blog/                           # PostCard, PostBody, CategoryBadge
  search/                         # SearchModal with keyboard navigation
  ui/                             # ThemeToggle
lib/
  sanity/                         # Client, queries, image builder
sanity/
  schemas/                        # Post, author, category schemas
scripts/
  seed-posts.ts                   # Content seeder
```

## Scripts

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm sanity       # Open Sanity CLI
```
