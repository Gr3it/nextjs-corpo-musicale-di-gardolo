import type { NextConfig } from "next"

/** Vecchi URL del sito Joomla → nuove pagine (301), per non perdere link e posizionamento. */
const OLD = "/cmgSite/index.php"
const legacyRedirects: [string, string][] = [
  [`${OLD}/storia/maestri-e-presidenti`, "/storia#maestri-e-presidenti"],
  [`${OLD}/storia`, "/storia"],
  [`${OLD}/corsi-musicali`, "/corsi"],
  [`${OLD}/galleria-fotografica/storiche`, "/storia#foto-storiche"],
  [`${OLD}/galleria-fotografica/:anno(\\d{4})`, "/galleria/:anno"],
  [`${OLD}/galleria-fotografica`, "/galleria"],
  [`${OLD}/contatti/prossimi-eventi/:path*`, "/eventi"],
  [`${OLD}/contatti/5x1000`, "/sostienici"],
  [`${OLD}/contatti`, "/contatti"],
  [OLD, "/"],
  ["/cmgSite", "/"],
]

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async redirects() {
    return legacyRedirects.map(([source, destination]) => ({ source, destination, permanent: true }))
  },
}

export default nextConfig
