import { cacheLife } from "next/cache"
import Link from "next/link"
import { Image as SanityNextImage } from "next-sanity/image"

import { getSiteSettings } from "@/lib/content"
import { imageUrl } from "@/lib/image"
import { mainNav } from "@/lib/site"

import { Logo } from "./logo"
import { SocialLinks } from "./social-links"

async function currentYear() {
  "use cache"
  cacheLife("days")
  return new Date().getFullYear()
}

export async function Footer() {
  const [s, year] = await Promise.all([getSiteSettings(), currentYear()])
  return (
    <footer className="mt-auto bg-brand text-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pt-16 pb-12 sm:grid-cols-2 lg:grid-cols-[13rem_1fr_1fr_1fr]">
        <Logo variant="red" className="w-36 lg:w-full" />

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
      </div>

      {s.partner.length > 0 && (
        <div className="mx-auto max-w-6xl px-4">
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/15 py-6 text-sm text-white/75">
            <li className="eyebrow text-white/60">Con il sostegno di</li>
            {s.partner.map((p) => {
              const content = p.logo?.asset ? (
                <SanityNextImage
                  src={imageUrl(p.logo)}
                  alt={p.nome}
                  width={160}
                  height={64}
                  className="h-10 w-auto bg-white object-contain p-1"
                />
              ) : (
                p.nome
              )
              return (
                <li key={p.nome}>
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {content}
                    </a>
                  ) : (
                    content
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-2 border-t border-white/15 py-6 text-sm text-white/70 lg:flex-row lg:justify-between lg:gap-8">
          <p>
            © {year} {s.nome}
            {s.formaGiuridica && ` · ${s.formaGiuridica}`}
            {s.codiceFiscale && ` · C.F. ${s.codiceFiscale}`}
            {s.partitaIva && ` · P.IVA ${s.partitaIva}`}
          </p>
          <p className="flex gap-5">
            <Link href="/sostienici#trasparenza" className="hover:underline">
              Trasparenza
            </Link>
            <Link href="/studio" className="hover:underline">
              Area riservata
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
