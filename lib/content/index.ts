/**
 * Unico punto di accesso ai contenuti del sito.
 * Le pagine non scrivono GROQ: chiamano queste funzioni.
 * Le regole "prossimo/passato" e "in evidenza" vivono qui e in `sanity/eventFilters.ts`.
 */
import { cacheLife, cacheTag } from "next/cache"

import { client } from "@/sanity/client"

import { fallbackHome, fallbackSettings } from "./fallback"
import * as q from "./queries"
import {
  snapshot,
  snapshotEventBySlug,
  snapshotEvents,
  snapshotEventSlugs,
  snapshotFilters,
  snapshotGalleryYear,
  snapshotGalleryYears,
} from "./snapshot"
import type {
  ChiSiamoPage,
  CorsiPage,
  EventDetail,
  EventQuery,
  EventSummary,
  EventTypeRef,
  GalleryEvent,
  HomePage,
  SiteSettings,
  SostieniciPage,
  StoriaPage,
  TrasparenzaDoc,
} from "./types"

export type * from "./types"

/** Tag unico invalidato dal webhook di Sanity (`app/api/revalidate`). */
export const CONTENT_TAG = "sanity"

async function fetchContent<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  if (!client) return null
  return client.fetch<T>(query, params)
}

/** Restituisce l'intervallo ISO [1 gen anno, 1 gen anno+1). */
function yearRange(anno: number) {
  return { from: `${anno}-01-01`, to: `${anno + 1}-01-01` }
}

function toYears(values: (string | null)[] | null): number[] {
  const years = (values ?? []).map(Number).filter((y) => Number.isInteger(y) && y > 1800)
  return [...new Set(years)].sort((a, b) => b - a)
}

// ── Eventi ────────────────────────────────────────────────────────────────
// Senza Sanity configurato i contenuti arrivano dall'anteprima del vecchio sito (`snapshot.ts`).

/** Eventi in evidenza: sempre i prossimi N per data (ADR 0002). */
export async function getUpcomingEvents(limit: number): Promise<EventSummary[]> {
  "use cache"
  cacheTag(CONTENT_TAG)
  cacheLife("hours")
  if (!client) return snapshotEvents({ periodo: "prossimi" }).slice(0, limit)
  return (await fetchContent<EventSummary[]>(q.upcomingEventsQuery, { limit })) ?? []
}

export async function getEvents({ periodo, anno, tipo = "" }: EventQuery): Promise<EventSummary[]> {
  "use cache"
  cacheTag(CONTENT_TAG)
  cacheLife("hours")
  if (!client) return snapshotEvents({ periodo, anno, tipo })
  if (periodo === "prossimi") {
    return (await fetchContent<EventSummary[]>(q.upcomingEventsByTypeQuery, { tipo })) ?? []
  }
  if (!anno) return []
  return (await fetchContent<EventSummary[]>(q.pastEventsQuery, { ...yearRange(anno), tipo })) ?? []
}

/** Anni con eventi passati (decrescenti) e tipi evento usati: alimentano i filtri. */
export async function getEventFilters(): Promise<{ anni: number[]; tipi: EventTypeRef[] }> {
  "use cache"
  cacheTag(CONTENT_TAG)
  cacheLife("hours")
  if (!client) {
    const { anni, tipi } = snapshotFilters()
    return { anni: toYears(anni), tipi }
  }
  const [anni, tipi] = await Promise.all([
    fetchContent<string[]>(q.pastEventYearsQuery),
    fetchContent<EventTypeRef[]>(q.eventTypesQuery),
  ])
  return { anni: toYears(anni), tipi: tipi ?? [] }
}

export async function getEventBySlug(slug: string): Promise<EventDetail | null> {
  "use cache"
  cacheTag(CONTENT_TAG)
  cacheLife("hours")
  if (!client) return snapshotEventBySlug(slug)
  return fetchContent<EventDetail>(q.eventBySlugQuery, { slug })
}

/** Slug da prerenderizzare in build (gli ultimi 50 eventi). */
export async function getEventSlugs(): Promise<string[]> {
  "use cache"
  cacheTag(CONTENT_TAG)
  cacheLife("hours")
  if (!client) return snapshotEventSlugs()
  return (await fetchContent<string[]>(q.eventSlugsQuery)) ?? []
}

// ── Galleria (ADR 0003: vista derivata dagli eventi) ──────────────────────

export async function getGalleryYears(): Promise<number[]> {
  "use cache"
  cacheTag(CONTENT_TAG)
  cacheLife("hours")
  if (!client) return toYears(snapshotGalleryYears())
  return toYears(await fetchContent<string[]>(q.galleryYearsQuery))
}

export async function getGalleryYear(anno: number): Promise<GalleryEvent[]> {
  "use cache"
  cacheTag(CONTENT_TAG)
  cacheLife("hours")
  if (!client) return snapshotGalleryYear(anno)
  return (await fetchContent<GalleryEvent[]>(q.galleryYearQuery, yearRange(anno))) ?? []
}

// ── Pagine e impostazioni ─────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache"
  cacheTag(CONTENT_TAG)
  cacheLife("hours")
  if (!client) return { ...fallbackSettings, partner: snapshot.partner }
  const data = await fetchContent<Partial<SiteSettings>>(q.siteSettingsQuery)
  return withFallback(fallbackSettings, data)
}

export async function getHomePage(): Promise<HomePage> {
  "use cache"
  cacheTag(CONTENT_TAG)
  cacheLife("hours")
  const data = await fetchContent<Partial<HomePage>>(q.homePageQuery)
  return withFallback(fallbackHome, data)
}

export async function getStoriaPage(): Promise<StoriaPage> {
  "use cache"
  cacheTag(CONTENT_TAG)
  cacheLife("hours")
  if (!client) return snapshot.storia
  return (await fetchContent<StoriaPage>(q.storiaPageQuery)) ?? {}
}

export async function getChiSiamoPage(): Promise<ChiSiamoPage> {
  "use cache"
  cacheTag(CONTENT_TAG)
  cacheLife("hours")
  if (!client) return snapshot.chiSiamo
  return (await fetchContent<ChiSiamoPage>(q.chiSiamoPageQuery)) ?? {}
}

export async function getCorsiPage(): Promise<CorsiPage> {
  "use cache"
  cacheTag(CONTENT_TAG)
  cacheLife("hours")
  if (!client) return snapshot.corsi
  return (await fetchContent<CorsiPage>(q.corsiPageQuery)) ?? {}
}

export async function getSostieniciPage(): Promise<SostieniciPage> {
  "use cache"
  cacheTag(CONTENT_TAG)
  cacheLife("hours")
  if (!client) return snapshot.sostienici
  return (await fetchContent<SostieniciPage>(q.sostieniciPageQuery)) ?? {}
}

export async function getTrasparenzaDocs(): Promise<TrasparenzaDoc[]> {
  "use cache"
  cacheTag(CONTENT_TAG)
  cacheLife("hours")
  return (await fetchContent<TrasparenzaDoc[]>(q.trasparenzaDocsQuery)) ?? []
}

/** Unisce i dati di Sanity ai valori di riserva, ignorando i campi vuoti. */
function withFallback<T extends object>(fallback: T, data: Partial<T> | null): T {
  if (!data) return fallback
  const merged = { ...fallback } as Record<string, unknown>
  for (const [key, value] of Object.entries(data)) {
    const empty = value == null || value === "" || (Array.isArray(value) && value.length === 0)
    if (!empty) merged[key] = value
  }
  return merged as T
}
