/**
 * Anteprima senza Sanity: legge il vecchio sito Joomla e scrive `lib/content/snapshot.json`.
 *
 *   npm run snapshot
 *
 * Usa gli stessi parser e testi della migrazione (`npm run migrate`), ma invece di caricare tutto su Sanity
 * salva un file che il sito mostra solo finché Sanity non è configurato (vedi `lib/content/snapshot.ts`).
 * Le immagini restano sul vecchio sito: quando il dominio passa a Vercel non si vedranno più,
 * quindi prima di quel momento va collegato Sanity e lanciata la migrazione.
 */
import { writeFileSync } from "node:fs"
import { join } from "node:path"

import type { EventDetail, EventTypeRef, SanityImage, Snapshot } from "../lib/content/types"
import { BASE, getHtml, UA } from "./migration/fetch"
import { albumToEvent, captionFromFilename, parseAlbums, parseGalleryYears } from "./migration/parse"
import * as seed from "./migration/seed"

const OUT = join(process.cwd(), "lib", "content", "snapshot.json")

/** Immagine ospitata sul vecchio sito, nella forma che il sito si aspetta da Sanity. */
function image(url: string, extra: Partial<SanityImage> = {}): SanityImage {
  return { asset: { _id: `joomla:${url}`, url }, ...extra }
}

const tipi = new Map<string, EventTypeRef>(seed.eventTypes.map((t) => [t.slug, t]))

/**
 * URL delle immagini che rispondono davvero (HEAD, 6 alla volta). Il vecchio sito ha qualche foto rotta:
 * la migrazione le salta perché l'upload fallisce, l'anteprima fa lo stesso.
 */
async function reachable(urls: string[]): Promise<Set<string>> {
  const ok = new Set<string>()
  let next = 0
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (next < urls.length) {
        const url = urls[next++]
        const res = await fetch(url, { method: "HEAD", headers: UA }).catch(() => null)
        if (res?.ok && res.headers.get("content-type")?.startsWith("image/")) ok.add(url)
        else console.warn(`  ! immagine saltata (${res?.status ?? "errore di rete"}) ${url}`)
      }
    }),
  )
  return ok
}

async function events(): Promise<EventDetail[]> {
  const legacy: EventDetail[] = seed.legacyEvents.map((e) => ({
    _id: e._id,
    titolo: e.titolo,
    slug: e.slug,
    inizio: e.inizio,
    stato: "confermato",
    tipo: tipi.get(e.tipo),
    luogo: e.luogo,
    locandina: image(e.locandinaUrl),
    numeroFoto: 0,
  }))

  const years = parseGalleryYears(await getHtml(`${BASE}/galleria-fotografica`))
  const usedSlugs = new Set<string>()
  const albums: EventDetail[] = []
  for (const year of years) {
    const found = parseAlbums(await getHtml(`${BASE}/galleria-fotografica/${year}`))
    console.log(`  ${year}: ${found.length} album, ${found.reduce((n, a) => n + a.images.length, 0)} foto`)
    for (const album of found) {
      const e = albumToEvent(album, year, usedSlugs)
      albums.push({
        _id: e._id,
        titolo: e.titolo,
        slug: e.slug,
        inizio: e.inizio,
        dataSoloAnno: !e.precise,
        senzaOrario: e.precise,
        stato: "confermato",
        tipo: e.tipo ? tipi.get(e.tipo) : undefined,
        galleria: album.images.map((img) => image(img.url, img.caption ? { didascalia: img.caption } : {})),
        numeroFoto: album.images.length,
      })
    }
  }
  return [...legacy, ...albums].sort((a, b) => b.inizio.localeCompare(a.inizio))
}

async function storia(): Promise<Snapshot["storia"]> {
  const fotoStoriche = parseAlbums(await getHtml(`${BASE}/galleria-fotografica/storiche`))
    .flatMap((a) => a.images)
    .map((img) => {
      const { didascalia, anno } = captionFromFilename(img.url)
      return image(img.url, { didascalia: img.caption || didascalia, anno })
    })
  console.log(`  storia: ${seed.storiaCapitoli.length} capitoli, ${fotoStoriche.length} foto storiche`)
  return {
    intro: seed.storiaIntro,
    capitoli: seed.storiaCapitoli.map(({ immagineUrl, ...capitolo }) => ({
      ...capitolo,
      ...(immagineUrl ? { immagine: image(immagineUrl, { alt: "Foto della banda" }) } : {}),
    })),
    fotoStoriche,
    maestri: seed.maestri,
    presidenti: seed.presidenti,
    ...seed.bandaOggi,
  }
}

async function main() {
  console.log(`Anteprima dal vecchio sito → ${OUT}`)
  const [storiaPage, allEvents] = await Promise.all([storia(), events()])

  const photos = [...allEvents.flatMap((e) => e.galleria ?? []), ...(storiaPage.fotoStoriche ?? [])]
  const ok = await reachable(photos.map((img) => img.asset.url))
  const keep = (imgs?: SanityImage[]) => imgs?.filter((img) => ok.has(img.asset.url))
  storiaPage.fotoStoriche = keep(storiaPage.fotoStoriche)
  const eventList = allEvents.map((e) => {
    if (!e.galleria) return e
    const galleria = keep(e.galleria) ?? []
    return { ...e, galleria, numeroFoto: galleria.length }
  })

  const snapshot: Snapshot = {
    generatedAt: new Date().toISOString(),
    partner: seed.partners.map((p) => ({ nome: p.nome, logo: image(p.logoUrl) })),
    storia: storiaPage,
    corsi: seed.corsiPage,
    sostienici: seed.sostieniciPage,
    events: eventList,
  }
  writeFileSync(OUT, `${JSON.stringify(snapshot, null, 1)}\n`)
  const foto = eventList.reduce((n, e) => n + e.numeroFoto, 0)
  console.log(`Fatto: ${eventList.length} eventi, ${foto} foto di eventi, ${storiaPage.fotoStoriche?.length ?? 0} foto storiche.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
