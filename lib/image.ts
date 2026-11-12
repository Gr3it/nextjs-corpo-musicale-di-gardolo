import { createImageUrlBuilder } from "@sanity/image-url"

import { dataset, projectId } from "@/sanity/env"
import type { SanityImage } from "@/lib/content"

const builder = createImageUrlBuilder({ projectId: projectId || "placeholder", dataset })

/**
 * URL base dell'immagine sulla CDN di Sanity (con ritaglio e hotspot applicati).
 * Larghezza e formato li aggiunge il loader di `next-sanity/image`.
 * Le immagini dell'anteprima senza Sanity (`lib/content/snapshot.ts`) non sono asset Sanity:
 * si usa l'URL originale del vecchio sito, che ignora i parametri del loader.
 */
export function imageUrl(image: SanityImage): string {
  if (!image.asset._id.startsWith("image-")) return image.asset.url
  return builder.image(image).url()
}

export function imageSize(image: SanityImage, fallback = { width: 1200, height: 800 }) {
  const d = image.asset.metadata?.dimensions
  return d ? { width: d.width, height: d.height } : fallback
}

export function imageAlt(image: SanityImage | undefined, fallback: string): string {
  return image?.alt || image?.didascalia || fallback
}
