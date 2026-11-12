import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { EventRow } from "@/components/events/event-card"
import { FeaturedEvent } from "@/components/events/featured-event"
import { Band } from "@/components/page-header"
import { Logo } from "@/components/site/logo"
import { SocialLinks } from "@/components/site/social-links"
import { buttonVariants } from "@/components/ui/button"
import { getHomePage, getSiteSettings, getUpcomingEvents } from "@/lib/content"
import { cn } from "@/lib/utils"

export default async function HomePage() {
  const [home, settings] = await Promise.all([getHomePage(), getSiteSettings()])
  const [featured, ...next] = await getUpcomingEvents(home.numeroEventiInEvidenza)

  return (
    <>
      {/* Hero su bianco puro: il logo bianco si fonde con lo sfondo. */}
      <section className="mx-auto grid max-w-6xl items-center gap-6 px-4 pt-10 pb-6 md:grid-cols-[1fr_22rem] md:gap-12 md:pt-14 lg:grid-cols-[1fr_26rem]">
        <div className="order-2 md:order-1">
          <p className="eyebrow mb-5 text-brand">Corpo Musicale di Gardolo · Trento</p>
          <h1 className="text-5xl leading-[1.02] font-semibold tracking-tight text-brand sm:text-7xl">{home.heroTitolo}</h1>
          {home.heroSottotitolo && (
            <p className="mt-6 max-w-xl text-xl leading-relaxed text-muted-foreground">{home.heroSottotitolo}</p>
          )}
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href="/eventi" className={cn(buttonVariants({ size: "lg" }), "h-12 px-7 text-base")}>
              Calendario eventi
            </Link>
            <Link
              href="/corsi"
              className="inline-flex items-center gap-2 text-base font-semibold text-brand underline-offset-8 hover:underline"
            >
              Corsi di musica <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
        <Logo variant="white" priority className="order-1 mx-auto w-48 sm:w-60 md:order-2 md:w-full" />
      </section>

      {/* Eventi in evidenza: sempre i prossimi per data (ADR 0002). */}
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-20 sm:pt-16" aria-labelledby="eventi-evidenza">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="eventi-evidenza" className="eyebrow text-brand">
            Il prossimo appuntamento
          </h2>
          <Link
            href="/eventi"
            className="inline-flex items-center gap-1.5 font-semibold text-brand underline-offset-8 hover:underline"
          >
            Calendario eventi <ArrowRight className="size-4" />
          </Link>
        </div>

        {featured ? (
          <>
            <FeaturedEvent event={featured} />
            {next.length > 0 && (
              <div className="mt-16">
                <h2 className="eyebrow mb-2 text-muted-foreground">Poi in calendario</h2>
                <ul className="divide-y border-y">
                  {next.map((event) => (
                    <li key={event._id}>
                      <EventRow event={event} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <div className="border-t-2 border-brand pt-8">
            <p className="font-heading text-3xl font-semibold">Al momento non ci sono eventi in programma.</p>
            <p className="mt-3 max-w-xl text-lg text-muted-foreground">
              Seguici sui social per sapere quando suoneremo, oppure sfoglia l&apos;
              <Link href="/eventi?periodo=passati" className="font-semibold text-brand underline underline-offset-4">
                archivio degli eventi
              </Link>
              .
            </p>
            <SocialLinks social={settings.social} showLabels className="mt-6 text-brand" />
          </div>
        )}
      </section>

      {/* Corsi e 5x1000 su pannello, divisi da un filetto verticale. */}
      <Band className="grid gap-12 md:grid-cols-2 md:gap-0 md:divide-x">
        <div className="md:pr-12">
          <p className="eyebrow mb-4 text-brand">Scuola di musica</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{home.corsiTitolo}</h2>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">{home.corsiTesto}</p>
          <Link
            href="/corsi"
            className="mt-6 inline-flex items-center gap-1.5 font-semibold text-brand underline-offset-8 hover:underline"
          >
            Corsi di musica <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="md:pl-12">
          <p className="eyebrow mb-4 text-brand">5x1000</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{home.sostieniTitolo}</h2>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">{home.sostieniTesto}</p>
          {settings.codiceFiscale && (
            <p className="mt-5 font-heading text-4xl font-semibold tracking-wide text-brand tabular-nums select-all">
              {settings.codiceFiscale}
            </p>
          )}
          <Link
            href="/sostienici"
            className="mt-6 inline-flex items-center gap-1.5 font-semibold text-brand underline-offset-8 hover:underline"
          >
            Come sostenerci <ArrowRight className="size-4" />
          </Link>
        </div>
      </Band>
    </>
  )
}
