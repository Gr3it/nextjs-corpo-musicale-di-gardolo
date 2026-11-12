import { MapPin } from "lucide-react"
import type { Metadata } from "next"
import type { ReactNode } from "react"

import { PageHeader, Section } from "@/components/page-header"
import { SocialLinks } from "@/components/site/social-links"
import { osmEmbedUrl } from "@/lib/calendar"
import { getSiteSettings } from "@/lib/content"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Contatti",
  description: "Sede, orari delle prove ed email del Corpo Musicale di Gardolo.",
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 border-b py-5 sm:grid-cols-[11rem_1fr] sm:gap-6">
      <dt className="eyebrow pt-1.5 text-muted-foreground">{label}</dt>
      <dd className="text-xl">{children}</dd>
    </div>
  )
}

const link = "font-semibold text-brand underline-offset-4 hover:underline break-all"

export default async function ContattiPage() {
  const s = await getSiteSettings()
  const address = [s.indirizzo, [s.cap, s.citta].filter(Boolean).join(" ")].filter(Boolean).join(", ")
  const mapsUrl = address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : null
  const hasSocial = Object.values(s.social).some(Boolean)

  return (
    <>
      <PageHeader eyebrow="Scrivici" title="Contatti">
        Per informazioni sulla banda, sui concerti o sui corsi scrivici: ti risponderemo il prima possibile.
      </PageHeader>

      <Section className={cn("grid gap-14 pt-0 sm:pt-0", s.posizione && "lg:grid-cols-[1fr_24rem]")}>
        <dl className="max-w-3xl border-t">
          {s.email && (
            <Row label="Informazioni">
              <a href={`mailto:${s.email}`} className={link}>
                {s.email}
              </a>
            </Row>
          )}
          {s.emailCorsi && (
            <Row label="Corsi di musica">
              <a href={`mailto:${s.emailCorsi}`} className={link}>
                {s.emailCorsi}
              </a>
            </Row>
          )}
          {s.telefono && (
            <Row label="Telefono">
              <a href={`tel:${s.telefono.replace(/\s/g, "")}`} className={link}>
                {s.telefono}
              </a>
            </Row>
          )}
          {s.pec && (
            <Row label="PEC">
              <a href={`mailto:${s.pec}`} className={link}>
                {s.pec}
              </a>
            </Row>
          )}
          {address && (
            <Row label="Sede">
              {address}
              {mapsUrl && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center gap-1.5 text-base font-semibold text-brand underline-offset-4 hover:underline"
                >
                  <MapPin className="size-4" /> Apri in Google Maps
                </a>
              )}
            </Row>
          )}
          {s.orariProve && <Row label="Prove">{s.orariProve}</Row>}
          {hasSocial && (
            <Row label="Seguici">
              <SocialLinks social={s.social} showLabels className="text-base text-brand" />
            </Row>
          )}
        </dl>

        <div>
          {s.posizione && (
            <iframe title="Mappa della sede" src={osmEmbedUrl(s.posizione)} className="h-80 w-full border" loading="lazy" />
          )}
          <p className={cn("text-sm leading-relaxed text-muted-foreground", s.posizione && "mt-6")}>
            {s.nome}
            {s.formaGiuridica && (
              <>
                <br />
                {s.formaGiuridica}
              </>
            )}
            <br />
            {s.codiceFiscale && `C.F. ${s.codiceFiscale}`}
            {s.partitaIva && ` · P.IVA ${s.partitaIva}`}
          </p>
        </div>
      </Section>
    </>
  )
}
