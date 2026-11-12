import type { Metadata } from "next"
import { Fraunces, Source_Sans_3 } from "next/font/google"

import { siteUrl } from "@/lib/site"

import "./globals.css"

const display = Fraunces({ variable: "--font-display", subsets: ["latin"], axes: ["opsz"] })
const body = Source_Sans_3({ variable: "--font-body", subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Corpo Musicale di Gardolo", template: "%s · Corpo Musicale di Gardolo" },
  description:
    "Il Corpo Musicale di Gardolo, banda dal 1906: concerti, eventi e corsi di musica a Gardolo (Trento).",
  icons: { icon: "/logo-red-mark.png", apple: "/logo-red-mark.png" },
  openGraph: { type: "website", locale: "it_IT", siteName: "Corpo Musicale di Gardolo", images: ["/logo-red.png"] },
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="it"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  )
}
