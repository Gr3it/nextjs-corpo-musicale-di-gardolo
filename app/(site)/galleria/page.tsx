import { ArrowRight } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

import { PageHeader } from "@/components/page-header"
import { getGalleryYears } from "@/lib/content"

export const metadata: Metadata = {
  title: "Galleria fotografica",
  description: "Le foto dei concerti e degli eventi del Corpo Musicale di Gardolo, anno per anno.",
}

export default async function GalleriaPage() {
  const anni = await getGalleryYears()
  return (
    <>
      <PageHeader eyebrow="Foto" title="Galleria">
        Le foto dei nostri eventi, anno per anno. Le immagini più antiche, dal 1906, sono nella pagina{" "}
        <Link href="/storia#foto-storiche" className="font-semibold text-brand underline underline-offset-4">
          Storia
        </Link>
        .
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4 pb-20">
        {anni.length > 0 ? (
        // Indice tipografico a filetti, senza riquadri (ADR 0005).
        <ul className="grid grid-cols-2 gap-x-8 sm:grid-cols-3 sm:gap-x-12 lg:grid-cols-4">
          {anni.map((anno) => (
            <li key={anno} className="border-b">
              <Link
                href={`/galleria/${anno}`}
                className="group flex items-end justify-between py-6 transition-colors hover:text-brand sm:py-8"
              >
                <span className="font-heading text-5xl font-semibold tracking-tight tabular-nums sm:text-6xl">{anno}</span>
                <ArrowRight
                  className="mb-2 size-5 text-brand transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
          <li className="border-b">
            <Link
              href="/storia#foto-storiche"
              className="group flex h-full flex-col justify-end py-6 transition-colors hover:text-brand sm:py-8"
            >
              <span className="eyebrow text-brand">Archivio</span>
              <span className="mt-2 font-heading text-2xl font-semibold">Foto storiche 1906–1990</span>
            </Link>
          </li>
        </ul>
        ) : (
          <p className="text-lg text-muted-foreground">
            Le foto degli eventi compariranno qui appena verranno caricate. Intanto puoi sfogliare le{" "}
            <Link href="/storia#foto-storiche" className="font-semibold text-brand underline underline-offset-4">
              foto storiche
            </Link>
            .
          </p>
        )}
      </div>
    </>
  )
}
