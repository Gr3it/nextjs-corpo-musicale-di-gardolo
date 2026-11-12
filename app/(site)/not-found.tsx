import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-24 sm:py-32">
      <p className="eyebrow text-brand">Errore 404</p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">Pagina non trovata</h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">
        La pagina che cerchi non esiste più o è stata spostata durante il rinnovo del sito.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
        <Link href="/eventi" className={cn(buttonVariants({ size: "lg" }), "h-12 px-7 text-base")}>
          Calendario eventi
        </Link>
        <Link href="/" className="inline-flex items-center gap-2 font-semibold text-brand underline-offset-8 hover:underline">
          Torna alla home <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  )
}
