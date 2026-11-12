import { Image } from "next-sanity/image"

import type { SanityImage as SanityImageType } from "@/lib/content"
import { imageAlt, imageSize, imageUrl } from "@/lib/image"

type Props = {
  image: SanityImageType
  alt?: string
  sizes?: string
  className?: string
  priority?: boolean
  fill?: boolean
}

/** Immagine servita dalla CDN di Sanity: non consuma l'ottimizzazione immagini di Vercel (ADR 0001). */
export function SanityImage({ image, alt, sizes = "100vw", className, priority, fill }: Props) {
  const altText = alt ?? imageAlt(image, "")
  const common = {
    src: imageUrl(image),
    sizes,
    className,
    priority,
    placeholder: image.asset.metadata?.lqip ? ("blur" as const) : undefined,
    blurDataURL: image.asset.metadata?.lqip,
  }
  if (fill) return <Image {...common} alt={altText} fill />
  const { width, height } = imageSize(image)
  return <Image {...common} alt={altText} width={width} height={height} />
}
