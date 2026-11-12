import { ArrowRight } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

import { Band, PageHeader, Section, SectionTitle } from "@/components/page-header"
import { RichText } from "@/components/rich-text"
import { SanityImage } from "@/components/sanity-image"
import { getChiSiamoPage, getSiteSettings } from "@/lib/content"

export const metadata: Metadata = {
  title: "Chi siamo",
  description: "Il Corpo Musicale di Gardolo: il maestro, il direttivo e le formazioni della banda.",
}

export default async function ChiSiamoPage() {
  const [page, settings] = await Promise.all([getChiSiamoPage(), getSiteSettings()])
  const { maestro, direttivo, formazioni } = page

  return (
    <>
      <PageHeader eyebrow="La banda" title="Chi siamo" />

      {page.intro?.length ? (
        <Section className="pt-0 sm:pt-0">
          <RichText value={page.intro} className="text-xl" />
        </Section>
      ) : null}

      {maestro?.nome && (
        <Band labelledBy="maestro">
          <div className="grid gap-10 md:grid-cols-[18rem_1fr] md:gap-16">
            {maestro.foto?.asset && (
              <SanityImage
                image={maestro.foto}
                alt={`Il maestro ${maestro.nome}`}
                sizes="18rem"
                className="aspect-4/5 w-full object-cover"
              />
            )}
            <div className={maestro.foto?.asset ? "" : "md:col-span-2"}>
              <p className="eyebrow mb-3 text-brand">Il Maestro</p>
              <h2 id="maestro" className="text-4xl font-semibold tracking-tight sm:text-5xl">
                {maestro.nome}
              </h2>
              <RichText value={maestro.bio} className="mt-4 text-lg" />
            </div>
          </div>
        </Band>
      )}

      {formazioni?.length ? (
        <Section>
          <SectionTitle>Le nostre formazioni</SectionTitle>
          <ul className="divide-y border-y">
            {formazioni.map((f) => (
              <li key={f.nome} className="grid gap-6 py-8 sm:grid-cols-[14rem_1fr]">
                {f.immagine?.asset ? (
                  <SanityImage image={f.immagine} alt={f.nome} sizes="14rem" className="aspect-3/2 w-full object-cover" />
                ) : (
                  <span className="hidden sm:block" />
                )}
                <div>
                  <h3 className="text-2xl font-semibold">{f.nome}</h3>
                  {f.descrizione && <p className="mt-2 max-w-prose text-lg text-muted-foreground">{f.descrizione}</p>}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {direttivo?.length ? (
        <Section>
          <SectionTitle>Direttivo e collaboratori</SectionTitle>
          <dl className="grid border-t sm:grid-cols-2 lg:grid-cols-3">
            {direttivo.map((d) => (
              <div key={`${d.nome}-${d.ruolo}`} className="border-b py-5 sm:pr-8">
                <dt className="eyebrow text-muted-foreground">{d.ruolo}</dt>
                <dd className="mt-1 font-heading text-2xl font-semibold">{d.nome}</dd>
              </div>
            ))}
          </dl>
        </Section>
      ) : null}

      <Section className="border-t">
        <p className="max-w-2xl font-heading text-3xl font-semibold tracking-tight">
          Vuoi suonare con noi? Le prove sono {settings.orariProve ? settings.orariProve.toLowerCase() : "ogni settimana"}.
        </p>
        <Link
          href="/contatti"
          className="mt-5 inline-flex items-center gap-2 font-semibold text-brand underline-offset-8 hover:underline"
        >
          Scrivici <ArrowRight className="size-4" />
        </Link>
      </Section>
    </>
  )
}
