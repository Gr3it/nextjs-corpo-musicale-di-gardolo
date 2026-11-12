/**
 * Anteprima con i contenuti del vecchio sito, usata SOLO finché Sanity non è configurato.
 * Il file `snapshot.json` si rigenera con `npm run snapshot`; con Sanity collegato non viene mai letto.
 * Le funzioni applicano in memoria le stesse regole delle query GROQ (`queries.ts`, `sanity/eventFilters.ts`).
 */
import { yearOf } from "@/lib/format"

import data from "./snapshot.json"
import type { EventDetail, EventQuery, EventSummary, EventTypeRef, GalleryEvent, Snapshot } from "./types"

export const snapshot = data as unknown as Snapshot

/** Come `UPCOMING_FILTER`: un evento è "prossimo" fino alla sua fine, se indicata, altrimenti fino all'inizio. */
function isUpcoming(e: EventSummary, now: number) {
  return new Date(e.fine ?? e.inizio).getTime() >= now
}

/** Solo i campi di `eventSummary` in `queries.ts`: le liste non portano con sé le gallerie. */
function toSummary(e: EventDetail): EventSummary {
  const summary = { ...e }
  delete summary.descrizione
  delete summary.galleria
  delete summary.linkEsterno
  return summary
}

export function snapshotEvents({ periodo, anno, tipo = "" }: EventQuery, now = Date.now()): EventSummary[] {
  return snapshot.events
    .filter((e) => (periodo === "prossimi" ? isUpcoming(e, now) : !isUpcoming(e, now)))
    .filter((e) => periodo === "prossimi" || yearOf(e.inizio) === anno)
    .filter((e) => !tipo || e.tipo?.slug === tipo)
    .sort((a, b) => (periodo === "prossimi" ? 1 : -1) * a.inizio.localeCompare(b.inizio))
    .map(toSummary)
}

export function snapshotFilters(now = Date.now()): { anni: string[]; tipi: EventTypeRef[] } {
  const anni = snapshot.events.filter((e) => !isUpcoming(e, now)).map((e) => String(yearOf(e.inizio)))
  const tipi = new Map(snapshot.events.flatMap((e) => (e.tipo ? [[e.tipo.slug, e.tipo] as const] : [])))
  return { anni, tipi: [...tipi.values()].sort((a, b) => a.nome.localeCompare(b.nome)) }
}

export function snapshotEventBySlug(slug: string): EventDetail | null {
  return snapshot.events.find((e) => e.slug === slug) ?? null
}

/** Ultimi 50 eventi per data, come `eventSlugsQuery`. */
export function snapshotEventSlugs(): string[] {
  return snapshot.events.slice(0, 50).map((e) => e.slug)
}

const withPhotos = () => snapshot.events.filter((e) => e.galleria?.length)

export function snapshotGalleryYears(): string[] {
  return withPhotos().map((e) => String(yearOf(e.inizio)))
}

export function snapshotGalleryYear(anno: number): GalleryEvent[] {
  return withPhotos()
    .filter((e) => yearOf(e.inizio) === anno)
    .sort((a, b) => a.inizio.localeCompare(b.inizio))
    .map(({ _id, titolo, slug, inizio, dataSoloAnno, galleria }) => ({
      _id,
      titolo,
      slug,
      inizio,
      dataSoloAnno,
      galleria: galleria ?? [],
    }))
}
