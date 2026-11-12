import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/** Intestazione di pagina: bianca, titolo grande in serif, filetto affusolato del logo. */
export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-14 pb-10 sm:pt-20">
      {eyebrow && <p className="eyebrow mb-4 text-brand">{eyebrow}</p>}
      <h1 className="text-5xl font-semibold tracking-tight text-ink sm:text-6xl">{title}</h1>
      {children && <div className="mt-5 max-w-2xl text-lg text-muted-foreground">{children}</div>}
      <div className="rule-tapered mt-10 w-full text-brand/30" aria-hidden />
    </div>
  )
}

export function Section({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("mx-auto max-w-6xl px-4 py-12 sm:py-16", className)}>{children}</section>
}

/** Fascia a tutta larghezza su pannello leggermente rosato, per staccare le sezioni. */
export function Band({ children, className, id, labelledBy }: { children: ReactNode; className?: string; id?: string; labelledBy?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className="scroll-mt-24 bg-panel">
      <div className={cn("mx-auto max-w-6xl px-4 py-14 sm:py-20", className)}>{children}</div>
    </section>
  )
}

export function SectionTitle({ id, eyebrow, children }: { id?: string; eyebrow?: string; children: ReactNode }) {
  return (
    <div className="mb-8">
      {eyebrow && <p className="eyebrow mb-3 text-brand">{eyebrow}</p>}
      <h2 id={id} className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {children}
      </h2>
    </div>
  )
}
