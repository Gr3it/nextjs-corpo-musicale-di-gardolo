"use client"

import Link from "next/link"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { PhotoGrid, type GridPhoto } from "./photo-grid"

type Tab = { id: string; titolo: string; slug: string; data?: string; photos: GridPhoto[] }

/** Una scheda per evento, come nella galleria del vecchio sito (ADR 0003). */
export function GalleryTabs({ tabs }: { tabs: Tab[] }) {
  return (
    <Tabs defaultValue={tabs[0]?.id}>
      <TabsList
        variant="line"
        className="h-auto w-full flex-wrap justify-start gap-x-6 gap-y-0 border-b p-0 group-data-horizontal/tabs:h-auto"
      >
        {tabs.map((t) => (
          <TabsTrigger
            key={t.id}
            value={t.id}
            className="h-auto flex-none rounded-none border-0 px-0 py-3 text-left text-base font-semibold whitespace-normal text-muted-foreground after:bg-brand hover:text-ink data-active:text-brand group-data-horizontal/tabs:after:bottom-[-1px]"
          >
            {t.titolo}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((t) => (
        <TabsContent key={t.id} value={t.id} className="pt-8">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h2 className="text-3xl font-semibold tracking-tight">{t.titolo}</h2>
            <p className="text-muted-foreground">
              {t.data && <>{t.data} · </>}
              {t.photos.length} foto ·{" "}
              <Link href={`/eventi/${t.slug}`} className="font-semibold text-brand underline-offset-4 hover:underline">
                Vai all&apos;evento
              </Link>
            </p>
          </div>
          <PhotoGrid photos={t.photos} title={t.titolo} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
