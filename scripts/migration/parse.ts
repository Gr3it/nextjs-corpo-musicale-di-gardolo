/** Parsing dell'HTML del vecchio sito Joomla (bandagardolo.it/cmgSite). Funzioni pure, senza rete. */

const ENTITIES: Record<string, string> = {
  nbsp: " ", amp: "&", quot: '"', apos: "'", lt: "<", gt: ">",
  rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", ndash: "–", mdash: "—", hellip: "…", deg: "°",
  agrave: "à", egrave: "è", eacute: "é", igrave: "ì", ograve: "ò", ugrave: "ù",
  Agrave: "À", Egrave: "È", Eacute: "É", Igrave: "Ì", Ograve: "Ò", Ugrave: "Ù", laquo: "«", raquo: "»",
}

export function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n] ?? m)
}

export function htmlToText(html: string): string {
  return decodeEntities(html.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, ""))
    .replace(/\s+/g, " ")
    .trim()
}

export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

// ── Galleria ──────────────────────────────────────────────────────────────

export function parseGalleryYears(html: string): number[] {
  const years = new Set<number>()
  for (const m of html.matchAll(/galleria-fotografica\/(\d{4})"/g)) years.add(Number(m[1]))
  return [...years].sort((a, b) => b - a)
}

export type Album = { catId: string; titolo: string; images: { url: string; caption: string }[] }

/** Una pagina-anno ha una tab per album (`#cat-N`) e immagini marcate `os_fancybox-N`. */
export function parseAlbums(html: string): Album[] {
  const albums = new Map<string, Album>()
  for (const m of html.matchAll(/<a href="#cat-(\d+)"[^>]*class="tab-click-loadMore"[^>]*>([\s\S]*?)<\/a>/g)) {
    albums.set(m[1], { catId: m[1], titolo: htmlToText(m[2]), images: [] })
  }
  for (const m of html.matchAll(/data-os_fancybox="os_fancybox-(\d+)"[\s\S]*?href="([^"]+)"[\s\S]*?data-caption="([^"]*)"/g)) {
    const [, catId, url, caption] = m
    if (!/\/original\//.test(url)) continue
    if (!albums.has(catId)) albums.set(catId, { catId, titolo: "", images: [] })
    const album = albums.get(catId)!
    if (!album.images.some((i) => i.url === url)) album.images.push({ url, caption: htmlToText(caption) })
  }
  return [...albums.values()].filter((a) => a.images.length > 0)
}

const MONTHS: Record<string, number> = {
  gen: 1, feb: 2, mar: 3, apr: 4, mag: 5, giu: 6, lug: 7, ago: 8, set: 9, ott: 10, nov: 11, dic: 12,
}

export type AlbumDate = { year: number; month?: number; day?: number }

/**
 * Ricava la data dal titolo dell'album ("Concerto di Natale 19 Dic 2021") e ripulisce il titolo.
 * Se il titolo non contiene una data, resta solo l'anno della pagina.
 */
export function parseAlbumTitle(raw: string, pageYear: number): { titolo: string; date: AlbumDate } {
  let titolo = raw
  let date: AlbumDate = { year: pageYear }

  // Accetta anche intervalli: "13-14 Lug 2019", "27e 28 Mag 2016" (vale il primo giorno).
  const named = raw.match(
    /(?:(\d{1,2})\s*(?:[-–/]|e)\s*)?(\d{1,2})\s*°?\s+(gen|feb|mar|apr|mag|giu|lug|ago|set|ott|nov|dic)[a-z]*\.?\s+(\d{4})/i,
  )
  const numeric = raw.match(/(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/)
  if (named) {
    const year = Number(named[4])
    date = {
      day: Number(named[1] ?? named[2]),
      month: MONTHS[named[3].toLowerCase()],
      // Refusi nel vecchio sito (es. "2108" nella pagina 2018): vale l'anno della pagina.
      year: Math.abs(year - pageYear) > 1 ? pageYear : year,
    }
    titolo = raw.replace(named[0], "")
  } else if (numeric) {
    date = { day: Number(numeric[1]), month: Number(numeric[2]), year: Number(numeric[3]) }
    titolo = raw.replace(numeric[0], "")
  } else {
    titolo = raw.replace(new RegExp(`\\b${pageYear}\\b\\s*$`), "")
  }
  titolo = titolo.replace(/[\s\-–,:]+$/, "").replace(/^[\s\-–,:]+/, "").replace(/\s+/g, " ").trim()
  return { titolo: titolo || raw.trim() || `Evento ${pageYear}`, date }
}

/** ISO in UTC: le 10:00 UTC cadono sempre nello stesso giorno in Italia. Senza giorno → metà anno. */
export function albumDateToIso(d: AlbumDate): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  if (d.month && d.day) return `${d.year}-${pad(d.month)}-${pad(d.day)}T10:00:00.000Z`
  return `${d.year}-07-01T10:00:00.000Z`
}

/**
 * Campi dell'evento ricavati da un album: stessa regola per migrazione e anteprima.
 * `usedSlugs` evita doppioni tra album con lo stesso titolo e la stessa data.
 */
export function albumToEvent(album: Album, pageYear: number, usedSlugs: Set<string>) {
  const { titolo, date } = parseAlbumTitle(album.titolo, pageYear)
  const precise = Boolean(date.day && date.month)
  const inizio = albumDateToIso(date)
  let slug = `${slugify(titolo)}-${precise ? inizio.slice(0, 10) : date.year}`
  if (usedSlugs.has(slug)) slug = `${slug}-${album.catId}`
  usedSlugs.add(slug)
  return { _id: `joomla-album-${album.catId}`, titolo, slug, inizio, precise, year: date.year, tipo: guessEventType(titolo) }
}

export function guessEventType(titolo: string): string | undefined {
  if (/concert|concentro|rassegna|saggio musicale/i.test(titolo)) return "concerto"
  if (/sfilat|corteo|processione/i.test(titolo)) return "sfilata"
  if (/saggio|allievi/i.test(titolo)) return "saggio"
  if (/festa|sagra|inaugurazion/i.test(titolo)) return "festa"
  return undefined
}

// ── Foto storiche ─────────────────────────────────────────────────────────

/**
 * I file Joomla hanno nome `<slug><GUID>.jpg`, es. `banda-sociale-gardolo-1906DFB0EC27-D206-...jpg`.
 * Dallo slug ricaviamo didascalia e anno.
 */
export function captionFromFilename(url: string): { didascalia?: string; anno?: number } {
  const file = decodeURIComponent(url.split("/").pop() ?? "").replace(/\.[a-z]+$/i, "")
  const m = file.match(/^(.*)[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i)
  const slug = (m ? m[1] : file).replace(/-\d$/, "").replace(/-+$/, "")
  const yearMatch = slug.match(/(?:^|-)((?:18|19|20)\d{2})(?:-|$)/)
  const anno = yearMatch ? Number(yearMatch[1]) : undefined
  const words = (yearMatch ? slug.replace(yearMatch[0], "-") : slug)
    .replace(/^ver-/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  const didascalia = words && !/^(img|foto piccola)$/i.test(words) ? words[0].toUpperCase() + words.slice(1) : undefined
  return { didascalia, anno }
}
