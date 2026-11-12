import type { EventDetail } from "@/lib/content"
import { formatLocation } from "@/lib/format"

const DEFAULT_DURATION_MS = 2 * 60 * 60 * 1000

/** 2026-11-14T19:30:00.000Z → 20261114T193000Z */
function toIcsDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
}

function endOf(event: Pick<EventDetail, "inizio" | "fine">): Date {
  return event.fine ? new Date(event.fine) : new Date(new Date(event.inizio).getTime() + DEFAULT_DURATION_MS)
}

/** Giorno in Italia come YYYYMMDD, per gli eventi senza orario (tutto il giorno). */
function toIcsDay(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome" }).format(d).replace(/-/g, "")
}

function nextDay(d: Date): Date {
  return new Date(d.getTime() + 24 * 60 * 60 * 1000)
}

/** Coppia inizio/fine nel formato iCalendar; gli eventi senza orario diventano "tutto il giorno". */
function icsRange(event: EventDetail): { start: string; end: string; allDay: boolean } {
  if (event.senzaOrario) {
    const start = new Date(event.inizio)
    return { start: toIcsDay(start), end: toIcsDay(nextDay(event.fine ? new Date(event.fine) : start)), allDay: true }
  }
  return { start: toIcsDate(new Date(event.inizio)), end: toIcsDate(endOf(event)), allDay: false }
}

function escapeIcs(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/[,;]/g, (m) => `\\${m}`)
}

export function eventUrl(siteUrl: string, slug: string) {
  return `${siteUrl}/eventi/${slug}`
}

export function buildIcs(event: EventDetail, siteUrl: string): string {
  const url = eventUrl(siteUrl, event.slug)
  const { start, end, allDay } = icsRange(event)
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Corpo Musicale di Gardolo//Eventi//IT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event._id}@bandagardolo.it`,
    `DTSTAMP:${toIcsDate(new Date(event.inizio))}`,
    allDay ? `DTSTART;VALUE=DATE:${start}` : `DTSTART:${start}`,
    allDay ? `DTEND;VALUE=DATE:${end}` : `DTEND:${end}`,
    `SUMMARY:${escapeIcs(event.titolo)}`,
    `LOCATION:${escapeIcs(formatLocation(event.luogo))}`,
    `URL:${url}`,
    `DESCRIPTION:${escapeIcs(`Corpo Musicale di Gardolo – ${url}`)}`,
    event.stato === "annullato" ? "STATUS:CANCELLED" : "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
  return lines.join("\r\n") + "\r\n"
}

export function googleCalendarUrl(event: EventDetail, siteUrl: string): string {
  const { start, end } = icsRange(event)
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.titolo,
    dates: `${start}/${end}`,
    location: formatLocation(event.luogo),
    details: `Corpo Musicale di Gardolo – ${eventUrl(siteUrl, event.slug)}`,
  })
  return `https://calendar.google.com/calendar/render?${params}`
}

export function googleMapsUrl(event: Pick<EventDetail, "luogo">): string | null {
  const { luogo } = event
  if (luogo?.posizione) return `https://www.google.com/maps/search/?api=1&query=${luogo.posizione.lat},${luogo.posizione.lng}`
  const q = formatLocation(luogo)
  return q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : null
}

/** Iframe OpenStreetMap (nessun cookie di tracciamento, ADR 0004). Serve la posizione. */
export function osmEmbedUrl(pos: { lat: number; lng: number }): string {
  const d = 0.004
  const bbox = [pos.lng - d, pos.lat - d / 2, pos.lng + d, pos.lat + d / 2].join(",")
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${pos.lat},${pos.lng}`
}
