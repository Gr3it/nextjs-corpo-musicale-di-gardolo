import { NextStudio } from "next-sanity/studio"

import { isSanityConfigured } from "@/sanity/env"
import config from "@/sanity.config"

export { metadata, viewport } from "next-sanity/studio"

export function generateStaticParams() {
  return [{ tool: [] }]
}

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main className="mx-auto max-w-xl p-10">
        <h1 className="text-2xl font-semibold">Pannello non ancora configurato</h1>
        <p className="mt-4">
          Imposta <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> in <code>.env.local</code> (vedi README) e riavvia il server.
        </p>
      </main>
    )
  }
  return <NextStudio config={config} />
}
