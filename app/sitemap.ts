import type { MetadataRoute } from "next"

import { getEventSlugs, getGalleryYears } from "@/lib/content"
import { mainNav, siteUrl } from "@/lib/site"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, anni] = await Promise.all([getEventSlugs(), getGalleryYears()])
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    ...mainNav.map((item) => ({ url: `${siteUrl}${item.href}`, priority: item.href === "/eventi" ? 0.9 : 0.7 })),
    ...slugs.map((slug) => ({ url: `${siteUrl}/eventi/${slug}`, priority: 0.6 })),
    ...anni.map((anno) => ({ url: `${siteUrl}/galleria/${anno}`, priority: 0.4 })),
  ]
}
