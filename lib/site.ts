export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bandagardolo.it").replace(/\/$/, "")

export const mainNav = [
  { href: "/eventi", label: "Eventi" },
  { href: "/galleria", label: "Galleria" },
  { href: "/storia", label: "Storia" },
  { href: "/chi-siamo", label: "Chi siamo" },
  { href: "/corsi", label: "Corsi" },
  { href: "/sostienici", label: "Sostienici" },
  { href: "/contatti", label: "Contatti" },
] as const
