import { DocumentPdfIcon } from "@sanity/icons/DocumentPdf"
import { defineField, defineType } from "sanity"

export const trasparenzaDoc = defineType({
  name: "trasparenzaDoc",
  title: "Documento di trasparenza",
  type: "document",
  icon: DocumentPdfIcon,
  fields: [
    defineField({ name: "titolo", title: "Titolo", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "categoria",
      title: "Categoria",
      type: "string",
      options: {
        list: [
          { title: "Rendiconto 5x1000", value: "5x1000" },
          { title: "Bilancio / rendiconto", value: "bilancio" },
          { title: "Statuto", value: "statuto" },
          { title: "Contributi pubblici", value: "contributi" },
          { title: "Altro", value: "altro" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "anno", title: "Anno di riferimento", type: "number" }),
    defineField({
      name: "file",
      title: "File PDF",
      type: "file",
      options: { accept: "application/pdf" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "descrizione", title: "Descrizione breve", type: "text", rows: 2 }),
  ],
  orderings: [{ title: "Anno", name: "annoDesc", by: [{ field: "anno", direction: "desc" }] }],
  preview: {
    select: { title: "titolo", anno: "anno", categoria: "categoria" },
    prepare: ({ title, anno, categoria }) => ({ title, subtitle: [categoria, anno].filter(Boolean).join(" · ") }),
  },
})
