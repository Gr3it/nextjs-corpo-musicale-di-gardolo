import { cacheLife } from "next/cache"
import Link from "next/link"
import { Image as SanityNextImage } from "next-sanity/image"

import { getSiteSettings, getTrasparenzaDocs } from "@/lib/content"
import { imageSize, imageUrl } from "@/lib/image"
import { mainNav } from "@/lib/site"

import { Logo } from "./logo"
import { SocialLinks } from "./social-links"

async function currentYear() {
  "use cache"
  cacheLife("days")
  return new Date().getFullYear()
}

export async function Footer() {
  const [s, docs, year] = await Promise.all([getSiteSettings(), getTrasparenzaDocs(), currentYear()])
  return (
    <footer className="mt-auto bg-brand text-white">
      {/* Su desktop il logo occupa due righe: a destra le tre colonne e, sotto, i sostenitori. */}
      <div className="mx-auto grid max-w-6xl gap-x-12 gap-y-8 px-4 pt-16 pb-12 sm:grid-cols-2 lg:grid-cols-[15rem_1fr_1fr_1fr]">
        <Logo variant="red" className="w-40 lg:row-span-2 lg:w-full lg:self-center" />

        <div>
          <h2 className="eyebrow mb-5 text-white/70">Sede e prove</h2>
          <address className="space-y-1 not-italic">
            {s.indirizzo && <p>{s.indirizzo}</p>}
            <p>{[s.cap, s.citta].filter(Boolean).join(" ")}</p>
          </address>
          {s.orariProve && <p className="mt-4">Prove: {s.orariProve}</p>}
        </div>

        <div>
          <h2 className="eyebrow mb-5 text-white/70">Contatti</h2>
          <ul className="space-y-1">
            {s.email && (
              <li>
                <a href={`mailto:${s.email}`} className="underline-offset-4 hover:underline">
                  {s.email}
                </a>
              </li>
            )}
            {s.emailCorsi && (
              <li>
                <a href={`mailto:${s.emailCorsi}`} className="underline-offset-4 hover:underline">
                  {s.emailCorsi}
                </a>
              </li>
            )}
            {s.telefono && (
              <li>
                <a href={`tel:${s.telefono.replace(/\s/g, "")}`} className="underline-offset-4 hover:underline">
                  {s.telefono}
                </a>
              </li>
            )}
          </ul>
          <SocialLinks social={s.social} className="mt-5 -ml-2" />
        </div>

        <nav aria-label="Pagine del sito">
          <h2 className="eyebrow mb-5 text-white/70">Il sito</h2>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="underline-offset-4 hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {s.partner.length > 0 && (
          <div className="border-t border-white/15 pt-8 text-sm sm:col-span-2 lg:col-span-3">
            <h2 className="eyebrow mb-5 text-white/70">Con il sostegno di</h2>
            <ul className="flex flex-wrap items-center gap-x-10 gap-y-5">
              {s.partner.map((p) => {
                const content = (
                  <>
                    {p.logo?.asset && (
                      <SanityNextImage
                        src={imageUrl(p.logo)}
                        alt=""
                        // Dimensioni reali del file: con un rapporto fisso la CDN di Sanity ritaglia i loghi.
                        {...imageSize(p.logo, { width: 160, height: 160 })}
                        sizes="128px"
                        className="h-16 w-auto shrink-0"
                      />
                    )}
                    <span className="max-w-40 leading-snug">{p.nome}</span>
                  </>
                )
                return (
                  <li key={p.nome}>
                    {p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 underline-offset-4 hover:underline"
                      >
                        {content}
                      </a>
                    ) : (
                      <div className="flex items-center gap-3">{content}</div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-2 border-t border-white/15 py-6 text-sm text-white/70 lg:flex-row lg:justify-between lg:gap-8">
          <p>
            © {year} {s.nome}
            {s.formaGiuridica && ` · ${s.formaGiuridica}`}
            {s.codiceFiscale && ` · C.F. ${s.codiceFiscale}`}
            {s.partitaIva && ` · P.IVA ${s.partitaIva}`}
          </p>
          <p className="flex gap-5">
            {/* Come la sezione in Sostienici: solo se ci sono documenti. */}
            {docs.length > 0 && (
              <Link href="/sostienici#trasparenza" className="hover:underline">
                Trasparenza
              </Link>
            )}
            <Link href="/studio" className="hover:underline">
              Area riservata
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
