import type { SanityImage } from "@/lib/content"
import { imageAlt, imageSize, imageUrl } from "@/lib/image"

import type { GridPhoto } from "./photo-grid"

/** Converte le immagini Sanity nel formato serializzabile per la griglia client. */
export function toGridPhotos(images: SanityImage[] | undefined, fallbackAlt: string): GridPhoto[] {
  return (images ?? [])
    .filter((img) => img?.asset)
    .map((img, i) => ({
      src: imageUrl(img),
      ...imageSize(img),
      alt: imageAlt(img, `${fallbackAlt}, foto ${i + 1}`),
      caption: [img.didascalia, img.anno].filter(Boolean).join(" · ") || undefined,
      lqip: img.asset.metadata?.lqip,
    }))
}
