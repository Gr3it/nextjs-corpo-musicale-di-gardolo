/** Tutte le date si mostrano nel fuso orario di Gardolo, anche se il server gira in UTC. */
const TZ = "Europe/Rome"

const fmt = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("it-IT", { timeZone: TZ, ...options })

const dayFmt = fmt({ day: "numeric" })
const monthShortFmt = fmt({ month: "short" })
const yearFmt = fmt({ year: "numeric" })
const weekdayFmt = fmt({ weekday: "long" })
const timeFmt = fmt({ hour: "2-digit", minute: "2-digit" })
const longFmt = fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" })
const dateOnlyFmt = fmt({ day: "numeric", month: "long", year: "numeric" })

export type DateParts = { giorno: string; mese: string; anno: string; giornoSettimana: string; ora: string }

export function dateParts(iso: string): DateParts {
  const d = new Date(iso)
  return {
    giorno: dayFmt.format(d),
    mese: monthShortFmt.format(d).replace(".", ""),
    anno: yearFmt.format(d),
    giornoSettimana: weekdayFmt.format(d),
    ora: timeFmt.format(d),
  }
}

export type EventDateInput = { inizio: string; fine?: string; dataSoloAnno?: boolean; senzaOrario?: boolean }

/** "sabato 14 novembre 2026, ore 20:30"; solo il giorno o solo l'anno quando l'ora o la data non sono note. */
export function formatEventDate({ inizio, fine, dataSoloAnno, senzaOrario }: EventDateInput): string {
  const d = new Date(inizio)
  if (dataSoloAnno) return yearFmt.format(d)
  const base = senzaOrario ? longFmt.format(d) : `${longFmt.format(d)}, ore ${timeFmt.format(d)}`
  if (!fine) return base
  const f = new Date(fine)
  const sameDay = dateOnlyFmt.format(d) === dateOnlyFmt.format(f)
  if (sameDay) return senzaOrario ? base : `${base} – ${timeFmt.format(f)}`
  return `${base} – ${longFmt.format(f)}`
}

export function formatDate(iso: string): string {
  return dateOnlyFmt.format(new Date(iso))
}

export function yearOf(iso: string): number {
  return Number(yearFmt.format(new Date(iso)))
}

export function formatEuro(value: number): string {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(value)
}

export function formatLocation(luogo?: { nome?: string; indirizzo?: string; comune?: string }): string {
  if (!luogo) return ""
  return [luogo.nome, luogo.indirizzo, luogo.comune].filter(Boolean).join(", ")
}
