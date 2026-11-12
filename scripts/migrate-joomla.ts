/**
 * Migrazione una tantum dal vecchio sito Joomla a Sanity.
 *
 *   npm run migrate -- --dry-run          # solo analisi, nessuna scrittura
 *   npm run migrate                       # tutto
 *   npm run migrate -- --anni=2021,2019   # solo alcuni anni della galleria
 *
 * Idempotente: ogni documento ha un _id fisso e viene creato solo se non esiste,
 * quindi rilanciarlo non crea duplicati e non sovrascrive le modifiche dei redattori.
 */
import { createClient, type SanityClient } from "@sanity/client"
import { config } from "dotenv"

import { BASE, getHtml, UA } from "./migration/fetch"
import { albumToEvent, captionFromFilename, parseAlbums, parseGalleryYears } from "./migration/parse"
import * as seed from "./migration/seed"

config({ path: ".env.local" })

const args = process.argv.slice(2)
const DRY = args.includes("--dry-run")
const onlyYears = args
  .find((a) => a.startsWith("--anni="))
  ?.slice("--anni=".length)
  .split(",")
  .map(Number)

function makeClient(): SanityClient | null {
  if (DRY) return null
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const token = process.env.SANITY_WRITE_TOKEN
  if (!projectId || !token) {
    console.error("Mancano NEXT_PUBLIC_SANITY_PROJECT_ID o SANITY_WRITE_TOKEN in .env.local")
    process.exit(1)
  }
  return createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
    apiVersion: "2026-11-01",
    token,
    useCdn: false,
  })
}

const client = makeClient()

async function exists(id: string): Promise<boolean> {
  if (!client) return false
  return Boolean(await client.getDocument(id))
}

/** Scarica un'immagine e la carica su Sanity (che deduplica per contenuto). */
async function uploadImage(url: string): Promise<{ _type: "reference"; _ref: string } | null> {
  if (!client) return null
  try {
    const res = await fetch(url, { headers: UA })
    if (!res.ok) throw new Error(String(res.status))
    const buffer = Buffer.from(await res.arrayBuffer())
    const filename = decodeURIComponent(url.split("/").pop() ?? "foto.jpg")
    const asset = await client.assets.upload("image", buffer, {
      filename,
      source: { name: "joomla", id: url, url },
    })
    return { _type: "reference", _ref: asset._id }
  } catch (err) {
    console.warn(`  ! immagine saltata ${url}: ${(err as Error).message}`)
    return null
  }
}

/** Esegue `fn` su tutti gli elementi con al massimo `limit` operazioni in parallelo, mantenendo l'ordine. */
async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T, i: number) => Promise<R>): Promise<R[]> {
  const out = new Array<R>(items.length)
  let next = 0
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++
        out[i] = await fn(items[i], i)
      }
    }),
  )
  return out
}

async function create(doc: { _id: string; _type: string; [k: string]: unknown }) {
  if (!client) return
  await client.createIfNotExists(doc)
}

// ── 1. Contenuti di base ──────────────────────────────────────────────────

async function migrateSeed() {
  console.log("\n▸ Tipi evento, impostazioni e pagine")
  for (const t of seed.eventTypes) {
    await create({ _id: `eventType-${t.slug}`, _type: "eventType", nome: t.nome, slug: { _type: "slug", current: t.slug } })
  }

  if (!(await exists("siteSettings"))) {
    const partner = await mapLimit(seed.partners, 2, async (p, i) => {
      const logo = await uploadImage(p.logoUrl)
      return { _key: `partner${i}`, nome: p.nome, ...(logo ? { logo: { _type: "image", asset: logo } } : {}) }
    })
    await create({ _id: "siteSettings", _type: "siteSettings", ...seed.siteSettings, partner })
  }
  await create({ _id: "homePage", _type: "homePage", ...seed.homePage })
  await create({ _id: "chiSiamoPage", _type: "chiSiamoPage", ...seed.chiSiamoPage })
  await create({ _id: "corsiPage", _type: "corsiPage", ...seed.corsiPage })
  await create({ _id: "sostieniciPage", _type: "sostieniciPage", ...seed.sostieniciPage })
  console.log(DRY ? "  (dry-run) 4 tipi evento, 5 pagine" : "  ok")

  console.log("\n▸ Eventi della vecchia pagina 'Prossimi eventi'")
  for (const e of seed.legacyEvents) {
    console.log(`  ${e.inizio.slice(0, 10)}  ${e.titolo}`)
    if (await exists(e._id)) continue
    const asset = DRY ? null : await uploadImage(e.locandinaUrl)
    await create({
      _id: e._id,
      _type: "event",
      titolo: e.titolo,
      slug: { _type: "slug", current: e.slug },
      inizio: e.inizio,
      stato: "confermato",
      tipo: { _type: "reference", _ref: `eventType-${e.tipo}` },
      luogo: e.luogo,
      ...(asset ? { locandina: { _type: "imageWithCaption", asset } } : {}),
    })
  }
}

// ── 2. Storia + foto storiche ─────────────────────────────────────────────

async function migrateStoria() {
  console.log("\n▸ Storia")
  const historic = parseAlbums(await getHtml(`${BASE}/galleria-fotografica/storiche`)).flatMap((a) => a.images)
  console.log(`  ${seed.storiaCapitoli.length} capitoli (testo unito vecchio sito + Federbande, in seed.ts)`)
  console.log(`  ${historic.length} foto storiche`)
  for (const img of historic) {
    const c = captionFromFilename(img.url)
    if (DRY) console.log(`    · ${c.anno ?? "????"}  ${c.didascalia ?? "(senza didascalia)"}`)
  }
  if (DRY || (await exists("storiaPage"))) return

  const capitoli = await mapLimit(seed.storiaCapitoli, 2, async ({ immagineUrl, ...capitolo }) => {
    const asset = immagineUrl ? await uploadImage(immagineUrl) : null
    return {
      _type: "capitolo",
      ...capitolo,
      ...(asset ? { immagine: { _type: "imageWithCaption", asset, alt: "Foto della banda" } } : {}),
    }
  })

  const fotoStoriche = await mapLimit(historic, 4, async (img, i) => {
    const asset = await uploadImage(img.url)
    if (!asset) return null
    const { didascalia, anno } = captionFromFilename(img.url)
    return { _type: "fotoStorica", _key: `storica${i}`, asset, didascalia: img.caption || didascalia, anno }
  })

  await create({
    _id: "storiaPage",
    _type: "storiaPage",
    intro: seed.storiaIntro,
    capitoli,
    fotoStoriche: fotoStoriche.filter(Boolean),
    maestri: seed.maestri,
    presidenti: seed.presidenti,
  })
  console.log("  ok")
}

// ── 3. Galleria: ogni album diventa un evento passato (ADR 0003) ───────────

async function migrateGallery() {
  console.log("\n▸ Galleria")
  const index = await getHtml(`${BASE}/galleria-fotografica`)
  const years = parseGalleryYears(index).filter((y) => !onlyYears || onlyYears.includes(y))
  console.log(`  anni: ${years.join(", ")}`)

  const usedSlugs = new Set<string>()
  let totalAlbums = 0
  let totalPhotos = 0

  for (const year of years) {
    const albums = parseAlbums(await getHtml(`${BASE}/galleria-fotografica/${year}`))
    console.log(`\n  ${year}: ${albums.length} album`)
    for (const album of albums) {
      const { _id: id, titolo, slug, inizio, precise, year: anno, tipo } = albumToEvent(album, year, usedSlugs)
      totalAlbums++
      totalPhotos += album.images.length
      console.log(
        `    ${precise ? inizio.slice(0, 10) : `${anno}      `}  ${String(album.images.length).padStart(3)} foto  ${titolo}${tipo ? `  [${tipo}]` : ""}`,
      )
      if (DRY || (await exists(id))) continue

      const galleria = (
        await mapLimit(album.images, 4, async (img, i) => {
          const asset = await uploadImage(img.url)
          return asset
            ? { _type: "imageWithCaption", _key: `foto${i}`, asset, ...(img.caption ? { didascalia: img.caption } : {}) }
            : null
        })
      ).filter(Boolean)

      await create({
        _id: id,
        _type: "event",
        titolo,
        slug: { _type: "slug", current: slug },
        inizio,
        dataSoloAnno: !precise,
        senzaOrario: precise,
        stato: "confermato",
        ...(tipo ? { tipo: { _type: "reference", _ref: `eventType-${tipo}` } } : {}),
        galleria,
      })
    }
  }
  console.log(`\n  Totale: ${totalAlbums} album, ${totalPhotos} foto`)
}

async function main() {
  console.log(DRY ? "Migrazione Joomla → Sanity (DRY RUN: nessuna scrittura)" : "Migrazione Joomla → Sanity")
  if (!onlyYears) {
    await migrateSeed()
    await migrateStoria()
  }
  await migrateGallery()
  console.log("\nFatto.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
