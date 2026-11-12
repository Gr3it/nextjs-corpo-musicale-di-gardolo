import { BookIcon } from "@sanity/icons/Book"
import { CogIcon } from "@sanity/icons/Cog"
import { HeartIcon } from "@sanity/icons/Heart"
import { HomeIcon } from "@sanity/icons/Home"
import { InlineIcon } from "@sanity/icons/Inline"
import { UsersIcon } from "@sanity/icons/Users"
import { defineArrayMember, defineField, defineType } from "sanity"

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Impostazioni sito",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "generale", title: "Generale", default: true },
    { name: "contatti", title: "Contatti" },
    { name: "fiscale", title: "Dati fiscali" },
    { name: "social", title: "Social e partner" },
  ],
  fields: [
    defineField({ name: "nome", title: "Nome associazione", type: "string", group: "generale" }),
    defineField({ name: "descrizione", title: "Descrizione per Google", type: "text", rows: 3, group: "generale" }),
    defineField({ name: "email", title: "Email principale", type: "string", group: "contatti" }),
    defineField({ name: "emailCorsi", title: "Email corsi", type: "string", group: "contatti" }),
    defineField({ name: "pec", title: "PEC", type: "string", group: "contatti" }),
    defineField({ name: "telefono", title: "Telefono", type: "string", group: "contatti" }),
    defineField({ name: "indirizzo", title: "Indirizzo sede", type: "string", group: "contatti" }),
    defineField({ name: "cap", title: "CAP", type: "string", group: "contatti" }),
    defineField({ name: "citta", title: "Località", type: "string", group: "contatti" }),
    defineField({ name: "posizione", title: "Posizione sede sulla mappa", type: "geopoint", group: "contatti" }),
    defineField({
      name: "orariProve",
      title: "Orari prove",
      type: "string",
      group: "contatti",
      description: "Es. Martedì, 20:30 – 22:30",
    }),
    defineField({ name: "formaGiuridica", title: "Forma giuridica", type: "string", group: "fiscale" }),
    defineField({ name: "codiceFiscale", title: "Codice fiscale", type: "string", group: "fiscale" }),
    defineField({ name: "partitaIva", title: "Partita IVA", type: "string", group: "fiscale" }),
    defineField({ name: "iban", title: "IBAN", type: "string", group: "fiscale" }),
    defineField({ name: "banca", title: "Banca", type: "string", group: "fiscale" }),
    defineField({
      name: "social",
      title: "Account social",
      type: "object",
      group: "social",
      description: "Incolla il link del profilo. Se un campo è vuoto, l'icona non compare sul sito.",
      fields: [
        defineField({ name: "facebook", title: "Facebook", type: "url" }),
        defineField({ name: "instagram", title: "Instagram", type: "url" }),
        defineField({ name: "youtube", title: "YouTube", type: "url" }),
        defineField({ name: "tiktok", title: "TikTok", type: "url" }),
      ],
    }),
    defineField({
      name: "partner",
      title: "Partner e patrocini (footer)",
      type: "array",
      group: "social",
      of: [
        defineArrayMember({
          type: "object",
          name: "partnerItem",
          fields: [
            defineField({ name: "nome", title: "Nome", type: "string", validation: (r) => r.required() }),
            defineField({ name: "logo", title: "Logo", type: "image" }),
            defineField({ name: "url", title: "Sito", type: "url" }),
          ],
          preview: { select: { title: "nome", media: "logo" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Impostazioni sito" }) },
})

export const homePage = defineType({
  name: "homePage",
  title: "Home",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({ name: "heroTitolo", title: "Titolo principale", type: "string" }),
    defineField({ name: "heroSottotitolo", title: "Sottotitolo", type: "text", rows: 2 }),
    defineField({ name: "heroImmagine", title: "Immagine di sfondo", type: "imageWithCaption" }),
    defineField({
      name: "numeroEventiInEvidenza",
      title: "Quanti eventi in evidenza mostrare",
      type: "number",
      initialValue: 3,
      validation: (r) => r.min(1).max(6).integer(),
    }),
    defineField({ name: "corsiTitolo", title: "Box corsi: titolo", type: "string" }),
    defineField({ name: "corsiTesto", title: "Box corsi: testo", type: "text", rows: 3 }),
    defineField({ name: "sostieniTitolo", title: "Box 5x1000: titolo", type: "string" }),
    defineField({ name: "sostieniTesto", title: "Box 5x1000: testo", type: "text", rows: 3 }),
  ],
  preview: { prepare: () => ({ title: "Home" }) },
})

export const storiaPage = defineType({
  name: "storiaPage",
  title: "Storia",
  type: "document",
  icon: BookIcon,
  groups: [
    { name: "testo", title: "Testo", default: true },
    { name: "foto", title: "Foto storiche" },
    { name: "persone", title: "Maestri e presidenti" },
  ],
  fields: [
    defineField({ name: "intro", title: "Introduzione", type: "text", rows: 3, group: "testo" }),
    defineField({
      name: "capitoli",
      title: "Capitoli",
      description: "La storia divisa per periodi, in ordine cronologico. Sul sito il periodo compare in grande accanto al testo.",
      type: "array",
      group: "testo",
      of: [
        defineArrayMember({
          type: "object",
          name: "capitolo",
          fields: [
            defineField({
              name: "periodo",
              title: "Periodo",
              type: "string",
              description: "Breve: «1906–1929», «Dopoguerra», «Dal 2005».",
              validation: (r) => r.required().max(16),
            }),
            defineField({ name: "titolo", title: "Titolo", type: "string", validation: (r) => r.required() }),
            defineField({ name: "testo", title: "Testo", type: "blockContent" }),
            defineField({ name: "immagine", title: "Foto (facoltativa)", type: "imageWithCaption" }),
          ],
          preview: {
            select: { periodo: "periodo", titolo: "titolo", media: "immagine" },
            prepare: ({ periodo, titolo, media }) => ({ title: titolo, subtitle: periodo, media }),
          },
        }),
      ],
    }),
    defineField({
      name: "fotoStoriche",
      title: "Foto storiche",
      type: "array",
      group: "foto",
      options: { layout: "grid" },
      of: [
        defineArrayMember({
          type: "image",
          name: "fotoStorica",
          title: "Foto storica",
          options: { hotspot: true },
          fields: [
            defineField({ name: "didascalia", title: "Didascalia", type: "string" }),
            defineField({ name: "anno", title: "Anno", type: "number" }),
            defineField({ name: "alt", title: "Testo alternativo", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "maestri",
      title: "Maestri",
      type: "array",
      group: "persone",
      of: [defineArrayMember({ type: "periodPerson" })],
    }),
    defineField({
      name: "presidenti",
      title: "Presidenti",
      type: "array",
      group: "persone",
      of: [defineArrayMember({ type: "periodPerson" })],
    }),
  ],
  preview: { prepare: () => ({ title: "Storia" }) },
})

export const chiSiamoPage = defineType({
  name: "chiSiamoPage",
  title: "Chi siamo",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({ name: "intro", title: "Introduzione", type: "blockContent" }),
    defineField({
      name: "maestro",
      title: "Il Maestro",
      type: "object",
      fields: [
        defineField({ name: "nome", title: "Nome", type: "string" }),
        defineField({ name: "foto", title: "Foto", type: "imageWithCaption" }),
        defineField({ name: "bio", title: "Biografia", type: "blockContent" }),
      ],
    }),
    defineField({
      name: "direttivo",
      title: "Direttivo e collaboratori",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "ruolo",
          fields: [
            defineField({ name: "nome", title: "Nome", type: "string", validation: (r) => r.required() }),
            defineField({ name: "ruolo", title: "Ruolo", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "nome", subtitle: "ruolo" } },
        }),
      ],
    }),
    defineField({
      name: "formazioni",
      title: "Formazioni (banda giovanile, gruppi...)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "formazione",
          fields: [
            defineField({ name: "nome", title: "Nome", type: "string", validation: (r) => r.required() }),
            defineField({ name: "descrizione", title: "Descrizione", type: "text", rows: 3 }),
            defineField({ name: "immagine", title: "Immagine", type: "imageWithCaption" }),
          ],
          preview: { select: { title: "nome", media: "immagine" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Chi siamo" }) },
})

export const corsiPage = defineType({
  name: "corsiPage",
  title: "Corsi musicali",
  type: "document",
  icon: InlineIcon,
  fields: [
    defineField({ name: "annoScolastico", title: "Anno scolastico", type: "string", description: "Es. 2026/2027" }),
    defineField({ name: "intro", title: "Presentazione", type: "blockContent" }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "quota",
          fields: [
            defineField({ name: "voce", title: "Voce", type: "string", validation: (r) => r.required() }),
            defineField({ name: "fascia", title: "Per chi", type: "string", description: "Es. Junior 8-30 anni" }),
            defineField({ name: "importo", title: "Importo (€)", type: "number" }),
            defineField({ name: "nota", title: "Nota", type: "string" }),
          ],
          preview: {
            select: { voce: "voce", fascia: "fascia", importo: "importo" },
            prepare: ({ voce, fascia, importo }) => ({
              title: voce,
              subtitle: [fascia, importo != null ? `€ ${importo}` : null].filter(Boolean).join(" · "),
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "scadenze",
      title: "Scadenze",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "scadenza",
          fields: [
            defineField({ name: "data", title: "Data", type: "date", validation: (r) => r.required() }),
            defineField({ name: "descrizione", title: "Descrizione", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "descrizione", subtitle: "data" } },
        }),
      ],
    }),
    defineField({ name: "linkIscrizione", title: "Link modulo di iscrizione", type: "url" }),
    defineField({ name: "pagamento", title: "Istruzioni di pagamento", type: "blockContent" }),
    defineField({
      name: "strumenti",
      title: "Strumenti insegnati",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "strumento",
          fields: [
            defineField({ name: "nome", title: "Nome", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "famiglia",
              title: "Famiglia",
              type: "string",
              options: { list: ["Legni", "Ottoni", "Percussioni"] },
            }),
            defineField({ name: "descrizione", title: "Descrizione", type: "text", rows: 2 }),
            defineField({ name: "immagine", title: "Immagine", type: "imageWithCaption" }),
          ],
          preview: { select: { title: "nome", subtitle: "famiglia", media: "immagine" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Corsi musicali" }) },
})

export const sostieniciPage = defineType({
  name: "sostieniciPage",
  title: "Sostienici",
  type: "document",
  icon: HeartIcon,
  fields: [
    defineField({ name: "testo5x1000", title: "Testo 5x1000", type: "blockContent" }),
    defineField({ name: "altriModi", title: "Altri modi per sostenerci", type: "blockContent" }),
  ],
  preview: { prepare: () => ({ title: "Sostienici" }) },
})

export const singletonTypes = [siteSettings, homePage, storiaPage, chiSiamoPage, corsiPage, sostieniciPage]
export const singletonNames = new Set<string>(singletonTypes.map((t) => t.name))
