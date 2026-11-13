export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bandagardolo.it").replace(/\/$/, "")

export const mainNav = [
  { href: "/eventi", label: "Eventi" },
  { href: "/corsi", label: "Corsi" },
  { href: "/storia", label: "Storia" },
  { href: "/galleria", label: "Galleria" },
  { href: "/sostienici", label: "Sostienici" },
  { href: "/contatti", label: "Contatti" },
] as const
