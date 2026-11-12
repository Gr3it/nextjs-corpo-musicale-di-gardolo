import { ArrowRight, Images } from "lucide-react"
import Link from "next/link"

import { SanityImage } from "@/components/sanity-image"
import type { EventStatus, EventSummary } from "@/lib/content"
import { dateParts, formatLocation } from "@/lib/format"
import { cn } from "@/lib/utils"

/** Data tipografica: giorno grande in serif, mese e giorno della settimana in maiuscoletto. */
export function EventDate({
  inizio,
  soloAnno,
  size = "md",
  className,
}: {
  inizio: string
  soloAnno?: boolean
  size?: "md" | "lg"
  className?: string
}) {
  const d = dateParts(inizio)
  if (soloAnno) {
    return (
      <div className={cn("text-brand", className)}>
        <span className={cn("block font-heading font-semibold tabular-nums", size === "lg" ? "text-6xl" : "text-3xl")}>
          {d.anno}
        </span>
      </div>
    )
  }
  return (
    <div className={cn("text-brand", className)}>
      <span
        className={cn(
          "block font-heading leading-[0.85] font-semibold tabular-nums",
          size === "lg" ? "text-8xl sm:text-9xl" : "text-5xl",
        )}
      >
        {d.giorno}
      </span>
      <span className={cn("eyebrow block", size === "lg" ? "mt-3 text-sm" : "mt-1.5")}>
        {d.mese} {d.anno}
      </span>
    </div>
  )
}

export function StatusLabel({ stato }: { stato?: EventStatus }) {
  if (!stato || stato === "confermato") return null
  return <span className="eyebrow bg-brand px-2 py-0.5 text-white">{stato}</span>
}

export function EventMeta({ event, className }: { event: EventSummary; className?: string }) {
  const d = dateParts(event.inizio)
  const where = formatLocation(event.luogo)
  return (
    <p className={cn("text-muted-foreground", className)}>
      {!event.dataSoloAnno && (
        <span className="inline-block first-letter:uppercase">
          {d.giornoSettimana}
          {!event.senzaOrario && <>, ore {d.ora}</>}
        </span>
      )}
      {!event.dataSoloAnno && where && <span aria-hidden> · </span>}
      {where}
    </p>
  )
}

/** Riga del cartellone: data · titolo e luogo · locandina. Separatori a filetto, nessuna card. */
export function EventRow({ event }: { event: EventSummary }) {
  return (
    <Link
      href={`/eventi/${event.slug}`}
      className="group grid grid-cols-[4.5rem_1fr] items-start gap-x-5 py-6 transition-colors hover:bg-panel sm:grid-cols-[6rem_1fr_auto] sm:gap-x-8 sm:px-4"
    >
      <EventDate inizio={event.inizio} soloAnno={event.dataSoloAnno} />
      <div className="min-w-0">
        <div className="mb-1.5 flex flex-wrap items-center gap-3">
          {event.tipo && <span className="eyebrow text-muted-foreground">{event.tipo.nome}</span>}
          <StatusLabel stato={event.stato} />
        </div>
        <h3
          className={cn(
            "text-xl font-semibold tracking-tight decoration-brand decoration-1 underline-offset-4 group-hover:underline sm:text-2xl",
            event.stato === "annullato" && "line-through",
          )}
        >
          {event.titolo}
        </h3>
        <EventMeta event={event} className="mt-1.5" />
        {event.numeroFoto > 0 && (
          <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-brand">
            <Images className="size-4" aria-hidden /> {event.numeroFoto} foto
          </p>
        )}
      </div>
      {event.locandina?.asset ? (
        <div className="relative col-start-2 mt-4 aspect-3/4 w-24 overflow-hidden sm:col-start-3 sm:mt-0">
          <SanityImage image={event.locandina} alt="" fill sizes="96px" className="object-cover" />
        </div>
      ) : (
        <ArrowRight
          className="hidden size-5 self-center text-brand opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100 sm:block"
          aria-hidden
        />
      )}
    </Link>
  )
}
