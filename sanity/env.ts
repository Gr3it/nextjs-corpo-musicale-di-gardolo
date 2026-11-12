export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ""
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production"
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-11-01"

/** False finché il progetto Sanity non è configurato in `.env.local`: il sito usa i dati di riserva. */
export const isSanityConfigured = projectId.length > 0
