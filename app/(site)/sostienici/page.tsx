import { Download } from "lucide-react"
import type { Metadata } from "next"

import { Band, PageHeader, Section, SectionTitle } from "@/components/page-header"
import { RichText } from "@/components/rich-text"
import { getSiteSettings, getSostieniciPage, getTrasparenzaDocs } from "@/lib/content"

export const metadata: Metadata = {
  title: "Sostienici",
  description: "Sostieni il Corpo Musicale di Gardolo con il 5x1000.",
}

const categorie: Record<string, string> = {
  "5x1000": "Rendiconto 5x1000",
  bilancio: "Bilancio",
  statuto: "Statuto",
  contributi: "Contributi pubblici",
  altro: "Altro",
}

export default async function SostieniciPage() {
  const [page, settings, docs] = await Promise.all([getSostieniciPage(), getSiteSettings(), getTrasparenzaDocs()])

  return (
    <>
      <PageHeader eyebrow="5x1000" title="Sostienici">
        Una firma non ti costa nulla e aiuta la banda a far crescere i giovani musicisti di Gardolo.
      </PageHeader>

      {settings.codiceFiscale && (
        <Band className="py-12 sm:py-16">
          <p className="eyebrow text-brand">Il nostro codice fiscale</p>
          {/* 11 cifre: la dimensione segue la larghezza dello schermo per non uscire dal bordo su telefono. */}
          <p className="mt-3 font-heading text-[clamp(2.25rem,12.5vw,6rem)] leading-none font-semibold tracking-wide text-brand tabular-nums select-all">
            {settings.codiceFiscale}
          </p>
          <p className="mt-4 text-lg text-muted-foreground">
            Da indicare nel riquadro &laquo;Sostegno degli enti del Terzo Settore&raquo; della dichiarazione dei redditi.
          </p>
        </Band>
      )}

      {page.testo5x1000?.length || page.altriModi?.length ? (
        <Section>
          <RichText value={page.testo5x1000} className="text-lg" />
          {page.altriModi?.length ? (
            <div className="mt-12">
              <SectionTitle>Altri modi per sostenerci</SectionTitle>
              <RichText value={page.altriModi} className="text-lg" />
            </div>
          ) : null}
        </Section>
      ) : null}

      {/* Compare solo quando nello Studio c'è almeno un documento. */}
      {docs.length > 0 && (
        <section id="trasparenza" className="scroll-mt-24 border-t" aria-labelledby="trasparenza-titolo">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
            <SectionTitle id="trasparenza-titolo" eyebrow="Documenti">
              Trasparenza
            </SectionTitle>
            <ul className="divide-y border-y">
              {docs.map((d) => (
                <li key={d._id}>
                  <a
                    href={`${d.fileUrl}?dl=`}
                    className="group flex items-center gap-6 py-5 transition-colors hover:bg-panel sm:px-4"
                  >
                    <span className="w-16 shrink-0 font-heading text-2xl font-semibold text-brand tabular-nums">
                      {d.anno ?? "—"}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-semibold group-hover:underline">{d.titolo}</span>
                      <span className="block text-muted-foreground">
                        {categorie[d.categoria] ?? d.categoria}
                        {d.descrizione && ` — ${d.descrizione}`}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2 font-semibold text-brand">
                      <Download className="size-5" aria-hidden /> <span className="hidden sm:inline">PDF</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
