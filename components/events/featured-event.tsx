import { ArrowRight, MapPin } from "lucide-react"
import Link from "next/link"

import { SanityImage } from "@/components/sanity-image"
import { buttonVariants } from "@/components/ui/button"
import type { EventSummary } from "@/lib/content"
import { dateParts, formatLocation } from "@/lib/format"
import { cn } from "@/lib/utils"

import { EventDate, StatusLabel } from "./event-card"

/** Il prossimo appuntamento in evidenza: data monumentale, titolo grande, locandina se c'è. */
export function FeaturedEvent({ event }: { event: EventSummary }) {
  const d = dateParts(event.inizio)
  const where = formatLocation(event.luogo)
  const hasPoster = Boolean(event.locandina?.asset)

  return (
    <article
      className={cn(
        "grid gap-8 border-t-2 border-brand pt-8 md:gap-12",
        hasPoster ? "md:grid-cols-[auto_1fr_16rem]" : "md:grid-cols-[auto_1fr]",
      )}
    >
      <EventDate inizio={event.inizio} size="lg" />
      <div className="min-w-0 self-end">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          {event.tipo && <span className="eyebrow text-muted-foreground">{event.tipo.nome}</span>}
          <StatusLabel stato={event.stato} />
        </div>
        <h3 className="text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl">
          <Link href={`/eventi/${event.slug}`} className="decoration-brand decoration-2 underline-offset-8 hover:underline">
            {event.titolo}
          </Link>
        </h3>
        <p className="mt-4 text-lg first-letter:uppercase">
          {d.giornoSettimana} {d.giorno} {d.mese}
          {!event.senzaOrario && <>, ore {d.ora}</>}
        </p>
        {where && (
          <p className="mt-1 flex items-start gap-2 text-lg text-muted-foreground">
            <MapPin className="mt-1 size-5 shrink-0 text-brand" aria-hidden />
            {where}
          </p>
        )}
        <Link href={`/eventi/${event.slug}`} className={cn(buttonVariants({ size: "lg" }), "mt-7 h-12 px-6 text-base")}>
          Dettagli dell&apos;evento <ArrowRight />
        </Link>
      </div>
      {hasPoster && event.locandina && (
        <Link href={`/eventi/${event.slug}`} className="relative block aspect-3/4 w-full max-w-64 overflow-hidden">
          <SanityImage
            image={event.locandina}
            alt={`Locandina: ${event.titolo}`}
            fill
            priority
            sizes="16rem"
            className="object-cover"
          />
        </Link>
      )}
    </article>
  )
}
