import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

import { EventRow } from "@/components/events/event-card"
import { PageHeader } from "@/components/page-header"
import { getEventFilters, getEvents, type EventPeriod } from "@/lib/content"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Eventi",
  description: "Calendario dei concerti e degli eventi del Corpo Musicale di Gardolo, con l'archivio degli anni passati.",
}

type Filters = { periodo: EventPeriod; anno?: number; tipo: string }

function parseFilters(sp: Record<string, string | string[] | undefined>, anniDisponibili: number[]): Filters {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)
  const periodo: EventPeriod = one(sp.periodo) === "passati" ? "passati" : "prossimi"
  const tipo = one(sp.tipo) ?? ""
  if (periodo === "prossimi") return { periodo, tipo }
  const anno = Number(one(sp.anno))
  return { periodo, tipo, anno: anniDisponibili.includes(anno) ? anno : anniDisponibili[0] }
}

function href(f: Filters) {
  const p = new URLSearchParams({ periodo: f.periodo })
  if (f.periodo === "passati" && f.anno) p.set("anno", String(f.anno))
  if (f.tipo) p.set("tipo", f.tipo)
  return `/eventi?${p}`
}

function Chip({ active, href, children }: { active: boolean; href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
        active ? "border-brand bg-brand text-white" : "border-border text-ink hover:border-brand hover:text-brand",
      )}
    >
      {children}
    </Link>
  )
}

async function EventsView({ searchParams }: Pick<PageProps<"/eventi">, "searchParams">) {
  const [sp, { anni, tipi }] = await Promise.all([searchParams, getEventFilters()])
  const f = parseFilters(sp, anni)
  const events = await getEvents(f)

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20">
      <nav aria-label="Periodo" className="flex gap-8 border-b">
        {(["prossimi", "passati"] as const).map((periodo) => (
          <Link
            key={periodo}
            href={href({ periodo, tipo: f.tipo, anno: periodo === "passati" ? anni[0] : undefined })}
            scroll={false}
            aria-current={f.periodo === periodo ? "page" : undefined}
            className={cn(
              "-mb-px border-b-2 pt-1 pb-3 font-heading text-xl font-semibold transition-colors sm:text-2xl",
              f.periodo === periodo ? "border-brand text-brand" : "border-transparent text-muted-foreground hover:text-ink",
            )}
          >
            {periodo === "prossimi" ? "In programma" : "Archivio"}
          </Link>
        ))}
      </nav>

      <div className="space-y-3 py-6">
        {f.periodo === "passati" && anni.length > 0 && (
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Anno">
            <span className="eyebrow mr-2 w-12 text-muted-foreground">Anno</span>
            {anni.map((anno) => (
              <Chip key={anno} active={f.anno === anno} href={href({ ...f, anno })}>
                {anno}
              </Chip>
            ))}
          </div>
        )}
        {tipi.length > 0 && (
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Tipo di evento">
            <span className="eyebrow mr-2 w-12 text-muted-foreground">Tipo</span>
            <Chip active={!f.tipo} href={href({ ...f, tipo: "" })}>
              Tutti
            </Chip>
            {tipi.map((t) => (
              <Chip key={t.slug} active={f.tipo === t.slug} href={href({ ...f, tipo: t.slug })}>
                {t.nome}
              </Chip>
            ))}
          </div>
        )}
      </div>

      {events.length > 0 ? (
        <ul className="divide-y border-y">
          {events.map((event) => (
            <li key={event._id}>
              <EventRow event={event} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="border-t-2 border-brand py-10">
          <p className="font-heading text-2xl font-semibold">
            {f.periodo === "prossimi" ? "Nessun evento in programma, per ora." : "Nessun evento con questi filtri."}
          </p>
          <p className="mt-2 text-muted-foreground">
            {f.periodo === "prossimi" ? (
              <>
                Intanto puoi sfogliare l&apos;
                <Link href={href({ periodo: "passati", tipo: "" })} className="font-semibold text-brand underline underline-offset-4">
                  archivio
                </Link>
                .
              </>
            ) : (
              <Link href={href({ ...f, tipo: "" })} className="font-semibold text-brand underline underline-offset-4">
                Mostra tutti i tipi di evento
              </Link>
            )}
          </p>
        </div>
      )}
    </div>
  )
}

function EventsSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-20" aria-hidden>
      <div className="h-12 border-b" />
      <div className="mt-20 divide-y border-y">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="grid grid-cols-[4.5rem_1fr] gap-5 py-6 sm:grid-cols-[6rem_1fr] sm:px-4">
            <div className="h-14 w-12 animate-pulse bg-panel" />
            <div className="space-y-3">
              <div className="h-3 w-24 animate-pulse bg-panel" />
              <div className="h-6 w-2/3 animate-pulse bg-panel" />
              <div className="h-4 w-1/2 animate-pulse bg-panel" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function EventiPage(props: PageProps<"/eventi">) {
  return (
    <>
      <PageHeader eyebrow="Calendario" title="Eventi">
        Concerti, sfilate, feste e appuntamenti della banda. Nell&apos;archivio trovi gli eventi passati, con le loro foto.
      </PageHeader>
      <Suspense fallback={<EventsSkeleton />}>
        <EventsView searchParams={props.searchParams} />
      </Suspense>
    </>
  )
}
