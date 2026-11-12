"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Image } from "next-sanity/image"
import { useCallback, useEffect, useState } from "react"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

export type GridPhoto = {
  src: string
  width: number
  height: number
  alt: string
  caption?: string
  lqip?: string
}

/** Griglia di foto con visualizzatore a schermo intero (frecce da tastiera incluse). */
export function PhotoGrid({ photos, title }: { photos: GridPhoto[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null)
  const open = index !== null
  const go = useCallback(
    (delta: number) => setIndex((i) => (i === null ? i : (i + delta + photos.length) % photos.length)),
    [photos.length],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1)
      if (e.key === "ArrowLeft") go(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, go])

  const current = index !== null ? photos[index] : null

  return (
    <>
      <ul className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((p, i) => (
          <li key={p.src}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block aspect-square w-full overflow-hidden bg-panel focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                placeholder={p.lqip ? "blur" : undefined}
                blurDataURL={p.lqip}
                className="object-cover transition duration-300 group-hover:scale-[1.03]"
              />
              <span className="sr-only">Apri foto {i + 1} di {photos.length}</span>
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={open} onOpenChange={(o) => !o && setIndex(null)}>
        <DialogContent className="max-w-[min(96vw,1200px)] border-0 bg-ink p-2 text-white ring-0 sm:max-w-[min(96vw,1200px)]">
          <DialogTitle className="sr-only">
            {title}: foto {(index ?? 0) + 1} di {photos.length}
          </DialogTitle>
          {current && (
            <figure className="flex flex-col items-center gap-2">
              <div className="relative h-[75vh] w-full">
                <Image src={current.src} alt={current.alt} fill sizes="96vw" className="object-contain" />
              </div>
              <figcaption className="flex w-full items-center justify-between gap-4 px-2 pb-1 text-sm text-white/80">
                <span>{current.caption ?? ""}</span>
                <span className="shrink-0 tabular-nums">
                  {(index ?? 0) + 1} / {photos.length}
                </span>
              </figcaption>
            </figure>
          )}
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-brand p-2.5 hover:bg-brand/85"
                aria-label="Foto precedente"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-brand p-2.5 hover:bg-brand/85"
                aria-label="Foto successiva"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
