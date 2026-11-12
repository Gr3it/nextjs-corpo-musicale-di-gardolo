import { ExternalLink, Mail } from "lucide-react"
import type { Metadata } from "next"

import { Band, PageHeader, Section, SectionTitle } from "@/components/page-header"
import { RichText } from "@/components/rich-text"
import { SanityImage } from "@/components/sanity-image"
import { buttonVariants } from "@/components/ui/button"
import { getCorsiPage, getSiteSettings, type CorsiPage } from "@/lib/content"
import { dateParts, formatEuro } from "@/lib/format"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Corsi musicali",
  description: "Corsi per tutti gli strumenti della banda a Gardolo: teoria, strumento e musica d'insieme per ragazzi e adulti.",
}

type Strumento = NonNullable<CorsiPage["strumenti"]>[number]

function groupByFamily(strumenti: Strumento[]) {
  const groups = new Map<string, Strumento[]>()
  for (const s of strumenti) {
    const key = s.famiglia ?? "Strumenti"
    groups.set(key, [...(groups.get(key) ?? []), s])
  }
  return [...groups]
}

export default async function CorsiPage() {
  const [corsi, settings] = await Promise.all([getCorsiPage(), getSiteSettings()])
  const email = settings.emailCorsi ?? settings.email

  return (
    <>
      <PageHeader eyebrow={corsi.annoScolastico ? `Anno ${corsi.annoScolastico}` : "Scuola di musica"} title="Corsi musicali">
        Impara a suonare uno strumento della banda, a qualsiasi età.
      </PageHeader>

      <Section className="grid gap-14 pt-0 sm:pt-0 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0">
          <RichText value={corsi.intro} className="text-lg" />

          {corsi.quote?.length ? (
            <div className="mt-12">
              <SectionTitle>Quote annuali</SectionTitle>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-brand">
                    <th className="eyebrow py-3 pr-4 font-bold text-brand">Voce</th>
                    <th className="eyebrow py-3 pr-4 font-bold text-brand">Per chi</th>
                    <th className="eyebrow py-3 text-right font-bold text-brand">Importo</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {corsi.quote.map((q, i) => (
                    <tr key={i}>
                      <td className="py-4 pr-4 align-top text-lg">
                        {q.voce}
                        {q.nota && <span className="block text-sm text-muted-foreground">{q.nota}</span>}
                      </td>
                      <td className="py-4 pr-4 align-top text-muted-foreground">{q.fascia}</td>
                      <td className="py-4 text-right align-top font-heading text-2xl font-semibold whitespace-nowrap tabular-nums">
                        {q.importo != null ? formatEuro(q.importo) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {corsi.pagamento?.length ? (
            <div className="mt-12">
              <SectionTitle>Come pagare</SectionTitle>
              <RichText value={corsi.pagamento} className="text-lg" />
            </div>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start lg:border-l lg:pl-10" aria-labelledby="iscrizioni">
          <h2 id="iscrizioni" className="eyebrow mb-4 text-brand">
            Iscrizioni
          </h2>
          {corsi.scadenze?.length ? (
            <ol className="divide-y border-y">
              {corsi.scadenze.map((s) => {
                const d = dateParts(s.data)
                return (
                  <li key={s.data + s.descrizione} className="grid grid-cols-[3.5rem_1fr] gap-4 py-4">
                    <span className="text-brand">
                      <span className="block font-heading text-4xl leading-none font-semibold tabular-nums">{d.giorno}</span>
                      <span className="eyebrow mt-1 block">{d.mese}</span>
                    </span>
                    <span className="self-center">{s.descrizione}</span>
                  </li>
                )
              })}
            </ol>
          ) : null}
          <div className="mt-6 flex flex-col gap-3">
            {corsi.linkIscrizione && (
              <a
                href={corsi.linkIscrizione}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: "lg" }), "h-12 text-base")}
              >
                Modulo di iscrizione <ExternalLink />
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center justify-center gap-2 py-2 font-semibold text-brand underline-offset-4 hover:underline"
              >
                <Mail className="size-4" /> {email}
              </a>
            )}
          </div>
        </aside>
      </Section>

      {corsi.strumenti?.length ? (
        <Band labelledBy="strumenti">
          <SectionTitle id="strumenti" eyebrow="Cosa puoi imparare">
            Gli strumenti della banda
          </SectionTitle>
          {groupByFamily(corsi.strumenti).map(([famiglia, list]) => (
            <div key={famiglia} className="mb-12 last:mb-0">
              <h3 className="eyebrow mb-5 border-b border-brand pb-3 text-brand">{famiglia}</h3>
              <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                {list.map((s) => (
                  <li key={s.nome}>
                    {s.immagine?.asset && (
                      <SanityImage
                        image={s.immagine}
                        alt={s.nome}
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        className="mb-4 aspect-square w-full object-cover"
                      />
                    )}
                    <p className="font-heading text-2xl font-semibold">{s.nome}</p>
                    {s.descrizione && <p className="mt-1 text-muted-foreground">{s.descrizione}</p>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Band>
      ) : null}
    </>
  )
}
