import { Footer } from "@/components/site/footer"
import { Header } from "@/components/site/header"

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#contenuto"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-background focus:px-4 focus:py-2"
      >
        Vai al contenuto
      </a>
      <Header />
      <main id="contenuto" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  )
}
