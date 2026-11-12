import { revalidateTag } from "next/cache"
import type { NextRequest } from "next/server"
import { parseBody } from "next-sanity/webhook"

import { CONTENT_TAG } from "@/lib/content"

/**
 * Webhook di Sanity: a ogni pubblicazione invalida tutta la cache dei contenuti.
 * Configurazione in sanity.io/manage → API → Webhooks (vedi README).
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) return new Response("SANITY_REVALIDATE_SECRET mancante", { status: 500 })

  const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true)
  if (!isValidSignature) return new Response("Firma non valida", { status: 401 })

  revalidateTag(CONTENT_TAG, { expire: 0 })
  return Response.json({ revalidated: true, type: body?._type ?? null })
}
