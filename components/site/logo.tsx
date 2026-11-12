import Image from "next/image"

import { cn } from "@/lib/utils"

/**
 * Il logo esiste in due versioni con lo sfondo pieno, uguale al colore su cui va appoggiato:
 * - rosso #5D0B19 per header e footer (si fonde con la barra rossa);
 * - bianco #FFFFFF per l'hero.
 * I PNG sono ricavati da logo.jpg / logo-white.jpg con lo sfondo portato al colore esatto.
 */
const variants = {
  /** Solo emblema (senza scritta), per la navbar. */
  mark: { src: "/logo-red-mark.png", width: 558, height: 578 },
  /** Logo completo su rosso, per il footer. */
  red: { src: "/logo-red.png", width: 558, height: 687 },
  /** Logo completo su bianco, per l'hero. */
  white: { src: "/logo-white.png", width: 591, height: 713 },
} as const

export function Logo({
  variant,
  className,
  priority,
  alt = "Logo del Corpo Musicale di Gardolo",
}: {
  variant: keyof typeof variants
  className?: string
  priority?: boolean
  alt?: string
}) {
  const v = variants[variant]
  return (
    <Image src={v.src} alt={alt} width={v.width} height={v.height} priority={priority} className={cn("h-auto", className)} />
  )
}
