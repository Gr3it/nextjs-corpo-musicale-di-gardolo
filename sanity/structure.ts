import { CalendarIcon } from "@sanity/icons/Calendar"
import { ClockIcon } from "@sanity/icons/Clock"
import { CogIcon } from "@sanity/icons/Cog"
import { DocumentsIcon } from "@sanity/icons/Documents"
import type { StructureResolver } from "sanity/structure"
import { PAST_FILTER, UPCOMING_FILTER } from "./eventFilters"

const singleton = (S: Parameters<StructureResolver>[0], type: string, title: string) =>
  S.listItem()
    .title(title)
    .id(type)
    .child(S.document().schemaType(type).documentId(type).title(title))

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenuti")
    .items([
      S.listItem()
        .title("Eventi")
        .icon(CalendarIcon)
        .child(
          S.list()
            .title("Eventi")
            .items([
              S.listItem()
                .title("Prossimi eventi")
                .icon(CalendarIcon)
                .child(
                  S.documentList()
                    .title("Prossimi eventi")
                    .schemaType("event")
                    .filter(`_type == "event" && ${UPCOMING_FILTER}`)
                    .defaultOrdering([{ field: "inizio", direction: "asc" }]),
                ),
              S.listItem()
                .title("Eventi passati (archivio)")
                .icon(ClockIcon)
                .child(
                  S.documentList()
                    .title("Eventi passati")
                    .schemaType("event")
                    .filter(`_type == "event" && ${PAST_FILTER}`)
                    .defaultOrdering([{ field: "inizio", direction: "desc" }]),
                ),
              S.divider(),
              S.documentTypeListItem("event").title("Tutti gli eventi"),
              S.documentTypeListItem("eventType").title("Tipi di evento"),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title("Pagine")
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title("Pagine")
            .items([
              singleton(S, "homePage", "Home"),
              singleton(S, "chiSiamoPage", "Chi siamo"),
              singleton(S, "storiaPage", "Storia"),
              singleton(S, "corsiPage", "Corsi musicali"),
              singleton(S, "sostieniciPage", "Sostienici"),
            ]),
        ),
      S.documentTypeListItem("trasparenzaDoc").title("Documenti di trasparenza"),
      S.divider(),
      singleton(S, "siteSettings", "Impostazioni sito").icon(CogIcon),
    ])
