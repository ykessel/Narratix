import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Webhook de Sanity para ISR on-demand.
 * Configura en: sanity.io → tu proyecto → API → Webhooks
 *   URL: https://tu-dominio.com/api/revalidate
 *   HTTP method: POST
 *   Header: x-webhook-secret = tu SANITY_REVALIDATE_SECRET
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-webhook-secret')

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const slug: string | undefined = body?.slug?.current ?? body?.slug

    if (slug) {
      revalidatePath(`/blog/${slug}`)
    }

    // Revalidar listados siempre
    revalidatePath('/')
    revalidatePath('/blog')

    return NextResponse.json({ revalidated: true, slug: slug ?? 'all', timestamp: Date.now() })
  } catch {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}
