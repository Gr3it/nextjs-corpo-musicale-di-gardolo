import type { Metadata } from "next"

import { PhotoGrid } from "@/components/gallery/photo-grid"
import { toGridPhotos } from "@/components/gallery/to-grid-photos"
import { Band, PageHeader, Section, SectionTitle } from "@/components/page-header"
import { RichText } from "@/components/rich-text"
import { SanityImage } from "@/components/sanity-image"
import { StoriaNav, type StoriaNavItem } from "@/components/storia-nav"
import { getStoriaPage, type PeriodPerson } from "@/lib/content"
import { imageAlt } from "@/lib/image"

export const metadata: Metadata = {
  title: "Storia",
  description: "La storia del Corpo Musicale di Gardolo dal 1906 a oggi, con le foto storiche e l'elenco di maestri e presidenti.",
}

const chapterId = (i: number) => `capitolo-${i + 1}`

function period(p: PeriodPerson) {
  if (!p.dal) return null
  return `${p.dal} – ${p.al ?? "oggi"}`
}

function PeopleList({ title, people }: { title: string; people?: PeriodPerson[] }) {
  if (!people?.length) return null
  return (
    <div>
      <h3 className="eyebrow mb-3 text-brand">{title}</h3>
      <ol className="divide-y border-y">
        {people.map((p) => (
          <li key={`${p.nome}-${p.dal ?? ""}`} className="flex items-baseline justify-between gap-4 py-3">
            <span className="text-lg">{p.nome}</span>
            {period(p) && <span className="shrink-0 text-muted-foreground tabular-nums">{period(p)}</span>}
          </li>
        ))}
      </ol>
    </div>
  )
}

export default async function StoriaPage() {
  const storia = await getStoriaPage()
  const foto = toGridPhotos(storia.fotoStoriche, "Foto storica del Corpo Musicale di Gardolo")
  const hasPeople = Boolean(storia.maestri?.length || storia.presidenti?.length)

  // Tappe della linea del tempo: i capitoli, poi le sezioni d'archivio.
  const nav: StoriaNavItem[] = [
    ...(storia.capitoli ?? []).map((c, i) => ({ id: chapterId(i), label: c.periodo })),
    ...(foto.length ? [{ id: "foto-storiche", label: "Foto storiche", archivio: true }] : []),
    ...(hasPeople ? [{ id: "maestri-e-presidenti", label: "Maestri e presidenti", archivio: true }] : []),
  ]

  return (
    <>
      <PageHeader eyebrow="Dal 1906" title="La nostra storia">
        {storia.intro}
      </PageHeader>

      {nav.length > 1 && <StoriaNav items={nav} />}

      {storia.capitoli?.length ? (
        // Un capitolo per riga: periodo in grande a sinistra (fermo mentre si legge), testo a destra.
        <ol className="mx-auto max-w-6xl px-4 pb-6">
          {storia.capitoli.map((c, i) => (
            <li
              key={`${c.periodo}-${c.titolo}`}
              id={chapterId(i)}
              // scroll-mt e top: spazio per menu del sito (80px) + linea del tempo (~56px).
              className="grid scroll-mt-36 gap-x-16 gap-y-5 border-t py-12 first:border-t-0 sm:scroll-mt-40 sm:py-16 lg:grid-cols-[17rem_1fr]"
            >
              <header className="lg:sticky lg:top-44 lg:self-start">
                <p className="font-heading text-4xl leading-none font-semibold tracking-tight text-brand tabular-nums sm:text-5xl">
                  {c.periodo}
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">{c.titolo}</h2>
              </header>
              <div className="min-w-0">
                <RichText value={c.testo} className="text-lg [&>p:first-child]:mt-0" />
                {c.immagine?.asset && (
                  <figure className="mt-8 max-w-prose text-lg">
                    <SanityImage
                      image={c.immagine}
                      alt={imageAlt(c.immagine, c.titolo)}
                      sizes="(min-width: 1024px) 40rem, 100vw"
                      className="h-auto w-full"
                    />
                    {c.immagine.didascalia && (
                      <figcaption className="mt-2 text-sm text-muted-foreground">{c.immagine.didascalia}</figcaption>
                    )}
                  </figure>
                )}
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <Section className="pt-0 sm:pt-0">
          <p className="text-muted-foreground">La storia della banda sarà pubblicata a breve.</p>
        </Section>
      )}

      {foto.length > 0 && (
        <Band id="foto-storiche" labelledBy="foto-storiche-titolo">
          <SectionTitle id="foto-storiche-titolo" eyebrow="Archivio 1906 – 1990">
            Foto storiche
          </SectionTitle>
          <PhotoGrid photos={foto} title="Foto storiche" />
        </Band>
      )}

      {hasPeople ? (
        <section id="maestri-e-presidenti" className="scroll-mt-36 sm:scroll-mt-40" aria-labelledby="mp-titolo">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
            <SectionTitle id="mp-titolo">Maestri e presidenti</SectionTitle>
            <div className="grid gap-12 md:grid-cols-2 md:gap-16">
              <PeopleList title="Maestri" people={storia.maestri} />
              <PeopleList title="Presidenti" people={storia.presidenti} />
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
