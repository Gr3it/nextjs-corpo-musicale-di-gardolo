import { ArrowLeft, ArrowRight } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { GalleryTabs } from "@/components/gallery/gallery-tabs"
import { toGridPhotos } from "@/components/gallery/to-grid-photos"
import { PageHeader } from "@/components/page-header"
import { getGalleryYear, getGalleryYears } from "@/lib/content"
import { formatDate } from "@/lib/format"

const PLACEHOLDER = "0"

export async function generateStaticParams() {
  const anni = await getGalleryYears()
  return (anni.length ? anni.map(String) : [PLACEHOLDER]).map((anno) => ({ anno }))
}

export async function generateMetadata({ params }: PageProps<"/galleria/[anno]">): Promise<Metadata> {
  const { anno } = await params
  return { title: `Galleria ${anno}`, description: `Le foto degli eventi del Corpo Musicale di Gardolo nel ${anno}.` }
}

const navLink = "inline-flex items-center gap-2 font-semibold text-brand underline-offset-4 hover:underline"

async function YearView({ params }: Pick<PageProps<"/galleria/[anno]">, "params">) {
  const anno = Number((await params).anno)
  if (!Number.isInteger(anno)) notFound()
  const [events, anni] = await Promise.all([getGalleryYear(anno), getGalleryYears()])
  if (events.length === 0) notFound()

  const idx = anni.indexOf(anno)
  const newer = idx > 0 ? anni[idx - 1] : undefined
  const older = idx >= 0 && idx < anni.length - 1 ? anni[idx + 1] : undefined

  const tabs = events.map((e) => ({
    id: e._id,
    titolo: e.titolo,
    slug: e.slug,
    data: e.dataSoloAnno ? undefined : formatDate(e.inizio),
    photos: toGridPhotos(e.galleria, e.titolo),
  }))

  return (
    <>
      <PageHeader eyebrow="Galleria" title={String(anno)}>
        {events.length === 1 ? "Un evento" : `${events.length} eventi`} con foto. Scegli un evento per vedere le sue foto.
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4 pb-20">
        <GalleryTabs tabs={tabs} />
        <nav aria-label="Altri anni" className="mt-16 flex items-center justify-between border-t pt-6">
          {older ? (
            <Link href={`/galleria/${older}`} className={navLink}>
              <ArrowLeft className="size-4" /> {older}
            </Link>
          ) : (
            <span />
          )}
          <Link href="/galleria" className="text-sm font-semibold text-muted-foreground hover:text-ink">
            Tutti gli anni
          </Link>
          {newer ? (
            <Link href={`/galleria/${newer}`} className={navLink}>
              {newer} <ArrowRight className="size-4" />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </>
  )
}

export default function GalleryYearPage(props: PageProps<"/galleria/[anno]">) {
  return (
    <Suspense fallback={<div className="mx-auto h-96 max-w-6xl px-4" aria-hidden />}>
      <YearView params={props.params} />
    </Suspense>
  )
}
