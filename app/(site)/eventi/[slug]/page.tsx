import { ArrowLeft, CalendarPlus, ExternalLink, MapPin } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"
import { Suspense } from "react"

import { EventDate, StatusLabel } from "@/components/events/event-card"
import { PhotoGrid } from "@/components/gallery/photo-grid"
import { toGridPhotos } from "@/components/gallery/to-grid-photos"
import { RichText } from "@/components/rich-text"
import { SanityImage } from "@/components/sanity-image"
import { buttonVariants } from "@/components/ui/button"
import { googleCalendarUrl, googleMapsUrl, osmEmbedUrl } from "@/lib/calendar"
import { getEventBySlug, getEventSlugs, type EventDetail } from "@/lib/content"
import { formatEventDate, formatLocation } from "@/lib/format"
import { imageUrl } from "@/lib/image"
import { siteUrl } from "@/lib/site"
import { cn } from "@/lib/utils"

/** Con Cache Components serve almeno un parametro: il segnaposto porta a notFound(). */
const PLACEHOLDER = "__nessun-evento__"

export async function generateStaticParams() {
  const slugs = await getEventSlugs()
  return (slugs.length ? slugs : [PLACEHOLDER]).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps<"/eventi/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) return { title: "Evento non trovato" }
  return {
    title: event.titolo,
    description: `${formatEventDate(event)}${event.luogo ? ` · ${formatLocation(event.luogo)}` : ""}`,
    openGraph: event.locandina?.asset ? { images: [`${imageUrl(event.locandina)}?w=1200`] } : undefined,
  }
}

function jsonLd(event: EventDetail) {
  const status = {
    confermato: "https://schema.org/EventScheduled",
    annullato: "https://schema.org/EventCancelled",
    rinviato: "https://schema.org/EventPostponed",
  }[event.stato ?? "confermato"]
  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: event.titolo,
    startDate: event.inizio,
    ...(event.fine ? { endDate: event.fine } : {}),
    eventStatus: status,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: `${siteUrl}/eventi/${event.slug}`,
    ...(event.locandina?.asset ? { image: [imageUrl(event.locandina)] } : {}),
    location: {
      "@type": "Place",
      name: event.luogo?.nome ?? event.luogo?.comune ?? "Gardolo",
      address: [event.luogo?.indirizzo, event.luogo?.comune].filter(Boolean).join(", ") || "Gardolo (TN)",
    },
    performer: { "@type": "MusicGroup", name: "Corpo Musicale di Gardolo" },
    organizer: { "@type": "Organization", name: "Corpo Musicale di Gardolo", url: siteUrl },
  }
}

function MetaRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t py-4">
      <dt className="eyebrow mb-1.5 text-muted-foreground">{label}</dt>
      <dd className="text-lg">{children}</dd>
    </div>
  )
}

async function EventView({ params }: Pick<PageProps<"/eventi/[slug]">, "params">) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) notFound()

  const mapsUrl = googleMapsUrl(event)
  const photos = toGridPhotos(event.galleria, event.titolo)
  const showCalendar = !event.dataSoloAnno && event.stato !== "annullato"
  const linkClass = "inline-flex items-center gap-2 font-semibold text-brand underline-offset-4 hover:underline"

  return (
    <article className="mx-auto max-w-6xl px-4 pt-8 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(event)).replace(/</g, "\\u003c") }}
      />
      <Link href="/eventi" className={cn(linkClass, "text-sm")}>
        <ArrowLeft className="size-4" /> Calendario eventi
      </Link>

      <header className="mt-10 grid gap-6 pb-10 lg:border-b sm:grid-cols-[auto_1fr] sm:gap-12">
        <EventDate inizio={event.inizio} soloAnno={event.dataSoloAnno} size="lg" />
        <div className="self-end">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            {event.tipo && <span className="eyebrow text-muted-foreground">{event.tipo.nome}</span>}
            <StatusLabel stato={event.stato} />
          </div>
          <h1
            className={cn(
              "text-4xl leading-[1.05] font-semibold tracking-tight sm:text-6xl",
              event.stato === "annullato" && "line-through decoration-brand",
            )}
          >
            {event.titolo}
          </h1>
        </div>
      </header>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0">
          {event.locandina?.asset && (
            <SanityImage
              image={event.locandina}
              alt={`Locandina: ${event.titolo}`}
              sizes="(min-width: 1024px) 640px, 100vw"
              priority
              className="mb-10 h-auto w-full max-w-xl"
            />
          )}
          <RichText value={event.descrizione} className="text-lg" />
          {photos.length > 0 && (
            <section className="mt-12" aria-labelledby="foto-evento">
              <h2 id="foto-evento" className="mb-5 text-3xl font-semibold tracking-tight">
                Foto
              </h2>
              <PhotoGrid photos={photos} title={event.titolo} />
            </section>
          )}
        </div>

        <aside className="order-first lg:sticky lg:top-28 lg:order-0 lg:self-start">
          <dl>
            <MetaRow label="Quando">
              <span className="block first-letter:uppercase">{formatEventDate(event)}</span>
            </MetaRow>
            {event.luogo && formatLocation(event.luogo) && (
              <MetaRow label="Dove">
                {event.luogo.nome && <span className="block font-semibold">{event.luogo.nome}</span>}
                {[event.luogo.indirizzo, event.luogo.comune].filter(Boolean).join(", ")}
                {mapsUrl && (
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={cn(linkClass, "mt-2 flex text-base")}>
                    <MapPin className="size-4" /> Apri in Google Maps
                  </a>
                )}
              </MetaRow>
            )}
            {showCalendar && (
              <MetaRow label="Aggiungi al calendario">
                <span className="flex flex-wrap gap-x-6 gap-y-2 text-base">
                  <a href={googleCalendarUrl(event, siteUrl)} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    <CalendarPlus className="size-4" /> Google
                  </a>
                  <a href={`/eventi/${event.slug}/calendar.ics`} className={linkClass}>
                    <CalendarPlus className="size-4" /> Apple / Outlook
                  </a>
                </span>
              </MetaRow>
            )}
          </dl>
          {event.linkEsterno?.url && (
            <a
              href={event.linkEsterno.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: "lg" }), "mt-4 h-12 w-full text-base")}
            >
              {event.linkEsterno.etichetta || "Maggiori informazioni"} <ExternalLink />
            </a>
          )}
          {event.luogo?.posizione && (
            <iframe
              title={`Mappa: ${event.luogo.nome ?? event.titolo}`}
              src={osmEmbedUrl(event.luogo.posizione)}
              className="mt-6 h-56 w-full border"
              loading="lazy"
            />
          )}
        </aside>
      </div>
    </article>
  )
}

export default function EventPage(props: PageProps<"/eventi/[slug]">) {
  return (
    <Suspense fallback={<div className="mx-auto h-96 max-w-6xl px-4" aria-hidden />}>
      <EventView params={props.params} />
    </Suspense>
  )
}
