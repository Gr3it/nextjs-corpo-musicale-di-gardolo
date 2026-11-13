"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

/** `archivio`: foto e maestri, dopo i capitoli; il primo è separato da un filetto. */
export type StoriaNavItem = { id: string; label: string; archivio?: boolean }

/**
 * Linea del tempo ferma sotto il menu: una tappa per capitolo, più foto e maestri.
 * Evidenzia la sezione che si sta leggendo e riempie un filo rosso man mano che si scorre.
 */
export function StoriaNav({ items }: { items: StoriaNavItem[] }) {
  const [active, setActive] = useState(items[0]?.id)
  const [progress, setProgress] = useState(0)
  const listRef = useRef<HTMLOListElement>(null)

  // Sezione attiva: quella che attraversa la fascia alta dello schermo.
  useEffect(() => {
    const sections = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => el !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: "-30% 0px -65% 0px" },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [items])

  // Avanzamento: dall'inizio del primo capitolo alla fine della pagina.
  useEffect(() => {
    const first = document.getElementById(items[0]?.id ?? "")
    if (!first) return
    let frame = 0
    const update = () => {
      frame = 0
      const start = first.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.3
      const end = document.documentElement.scrollHeight - window.innerHeight
      setProgress(end > start ? Math.min(1, Math.max(0, (window.scrollY - start) / (end - start))) : 0)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [items])

  // Su telefono la barra scorre in orizzontale: tiene in vista la tappa attiva.
  useEffect(() => {
    const link = listRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`)
    const list = listRef.current
    if (!link || !list || list.scrollWidth <= list.clientWidth) return
    list.scrollTo({ left: link.offsetLeft - list.clientWidth / 2 + link.offsetWidth / 2, behavior: "smooth" })
  }, [active])

  return (
    <nav aria-label="Sezioni della storia" className="sticky top-18 z-30 border-b bg-background/95 backdrop-blur sm:top-20">
      <div className="mx-auto max-w-6xl">
        <ol
          ref={listRef}
          // px-1 + px-3 dei link: il primo testo si allinea al margine della pagina.
          className="flex items-stretch overflow-x-auto px-1 scrollbar-none"
        >
          {items.map((item, i) => {
            const isActive = item.id === active
            const divider = item.archivio && !items[i - 1]?.archivio
            return (
              <li key={item.id} className={cn("flex shrink-0", divider && "ml-3 border-l pl-3 sm:ml-5 sm:pl-5")}>
                <a
                  href={`#${item.id}`}
                  data-id={item.id}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "flex items-center px-3 py-3.5 font-semibold whitespace-nowrap tabular-nums transition-colors",
                    // Capitoli nel serif delle date, sezioni d'archivio nel testo normale.
                    item.archivio ? "text-[0.95rem]" : "font-heading text-lg",
                    isActive ? "text-brand" : "text-muted-foreground hover:text-ink",
                  )}
                >
                  {item.label}
                </a>
              </li>
            )
          })}
        </ol>
      </div>
      {/* Filo di avanzamento, come il filetto del logo. */}
      <div className="absolute inset-x-0 -bottom-px h-0.5 origin-left bg-brand" style={{ transform: `scaleX(${progress})` }} aria-hidden />
    </nav>
  )
}
