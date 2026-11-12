import Link from "next/link"

import { mainNav } from "@/lib/site"

import { Logo } from "./logo"
import { MobileNav } from "./mobile-nav"

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-brand text-white">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-6 px-4 sm:h-20">
        <Link href="/" className="flex items-center gap-3" aria-label="Corpo Musicale di Gardolo, home">
          <Logo variant="mark" alt="" priority className="w-12 sm:w-14" />
          <span className="leading-none">
            <span className="eyebrow block text-[0.65rem] text-white/75">Corpo Musicale</span>
            <span className="mt-1 block font-heading text-2xl font-semibold">Gardolo</span>
          </span>
        </Link>
        <nav aria-label="Menu principale" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="py-2 text-[0.95rem] font-semibold text-white/90 decoration-white/60 decoration-2 underline-offset-8 transition-colors hover:text-white hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <MobileNav />
      </div>
    </header>
  )
}
