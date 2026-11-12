import { CalendarIcon } from "@sanity/icons/Calendar"
import { TagIcon } from "@sanity/icons/Tag"
import { defineArrayMember, defineField, defineType } from "sanity"

export const eventType = defineType({
  name: "eventType",
  title: "Tipo evento",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({ name: "nome", title: "Nome", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug (per i filtri)",
      type: "slug",
      options: { source: "nome" },
      validation: (r) => r.required(),
    }),
  ],
})

export const event = defineType({
  name: "event",
  title: "Evento",
  type: "document",
  icon: CalendarIcon,
  groups: [
    { name: "principale", title: "Principale", default: true },
    { name: "luogo", title: "Luogo" },
    { name: "foto", title: "Foto" },
  ],
  fields: [
    defineField({
      name: "titolo",
      title: "Titolo",
      type: "string",
      group: "principale",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Indirizzo pagina (slug)",
      type: "slug",
      group: "principale",
      options: { source: "titolo", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "inizio",
      title: "Data e ora di inizio",
      type: "datetime",
      group: "principale",
      options: { timeStep: 15 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "fine",
      title: "Data e ora di fine",
      type: "datetime",
      group: "principale",
      options: { timeStep: 15 },
    }),
    defineField({
      name: "dataSoloAnno",
      title: "Mostra solo l'anno",
      type: "boolean",
      group: "principale",
      description: "Per gli eventi d'archivio di cui non si conosce la data esatta.",
      initialValue: false,
    }),
    defineField({
      name: "senzaOrario",
      title: "Ora non indicata",
      type: "boolean",
      group: "principale",
      description: "Mostra solo il giorno, senza orario (es. eventi di tutta la giornata o d'archivio).",
      initialValue: false,
      hidden: ({ document }) => Boolean(document?.dataSoloAnno),
    }),
    defineField({
      name: "tipo",
      title: "Tipo evento",
      type: "reference",
      group: "principale",
      to: [{ type: "eventType" }],
    }),
    defineField({
      name: "stato",
      title: "Stato",
      type: "string",
      group: "principale",
      options: {
        list: [
          { title: "Confermato", value: "confermato" },
          { title: "Annullato", value: "annullato" },
          { title: "Rinviato", value: "rinviato" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "confermato",
    }),
    defineField({
      name: "locandina",
      title: "Locandina / immagine",
      type: "imageWithCaption",
      group: "principale",
    }),
    defineField({
      name: "descrizione",
      title: "Descrizione e programma",
      type: "blockContent",
      group: "principale",
    }),
    defineField({
      name: "linkEsterno",
      title: "Link esterno (prenotazioni, biglietti...)",
      type: "object",
      group: "principale",
      fields: [
        defineField({ name: "etichetta", title: "Testo del pulsante", type: "string" }),
        defineField({ name: "url", title: "URL", type: "url" }),
      ],
    }),
    defineField({
      name: "luogo",
      title: "Luogo",
      type: "object",
      group: "luogo",
      fields: [
        defineField({ name: "nome", title: "Nome del luogo", type: "string", description: "Es. Teatro Gigi Cona" }),
        defineField({ name: "indirizzo", title: "Indirizzo", type: "string" }),
        defineField({ name: "comune", title: "Comune / frazione", type: "string", initialValue: "Gardolo (TN)" }),
        defineField({
          name: "posizione",
          title: "Posizione sulla mappa",
          type: "geopoint",
          description: "Facoltativa: se vuota la mappa usa l'indirizzo.",
        }),
      ],
    }),
    defineField({
      name: "galleria",
      title: "Foto dell'evento",
      type: "array",
      group: "foto",
      of: [defineArrayMember({ type: "imageWithCaption" })],
      options: { layout: "grid" },
    }),
  ],
  orderings: [
    { title: "Data, più recenti", name: "inizioDesc", by: [{ field: "inizio", direction: "desc" }] },
    { title: "Data, più vecchi", name: "inizioAsc", by: [{ field: "inizio", direction: "asc" }] },
  ],
  preview: {
    select: { title: "titolo", inizio: "inizio", soloAnno: "dataSoloAnno", media: "locandina", stato: "stato" },
    prepare: ({ title, inizio, soloAnno, media, stato }) => {
      const d = inizio ? new Date(inizio) : null
      const when = d
        ? soloAnno
          ? String(d.getFullYear())
          : d.toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" })
        : "senza data"
      return {
        title,
        subtitle: stato && stato !== "confermato" ? `${when} · ${stato.toUpperCase()}` : when,
        media,
      }
    },
  },
})
