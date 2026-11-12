import { defineArrayMember, defineField, defineType } from "sanity"

/** Immagine con testo alternativo e didascalia, usata ovunque nel sito. */
export const imageWithCaption = defineType({
  name: "imageWithCaption",
  title: "Immagine",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Testo alternativo",
      type: "string",
      description: "Descrive l'immagine per chi usa uno screen reader.",
    }),
    defineField({ name: "didascalia", title: "Didascalia", type: "string" }),
  ],
})

/** Testo formattato (titoli, grassetto, link, immagini). */
export const blockContent = defineType({
  name: "blockContent",
  title: "Testo",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normale", value: "normal" },
        { title: "Titolo", value: "h2" },
        { title: "Sottotitolo", value: "h3" },
        { title: "Citazione", value: "blockquote" },
      ],
      marks: {
        annotations: [
          defineArrayMember({
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              defineField({
                name: "href",
                title: "URL",
                type: "url",
                validation: (r) =>
                  r.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({ type: "imageWithCaption" }),
  ],
})

/** Persona con periodo (maestri, presidenti). */
export const periodPerson = defineType({
  name: "periodPerson",
  title: "Persona",
  type: "object",
  fields: [
    defineField({ name: "nome", title: "Nome", type: "string", validation: (r) => r.required() }),
    defineField({ name: "dal", title: "Dal (anno)", type: "number" }),
    defineField({ name: "al", title: "Al (anno)", type: "number", description: "Vuoto se in carica." }),
  ],
  preview: {
    select: { nome: "nome", dal: "dal", al: "al" },
    prepare: ({ nome, dal, al }) => ({
      title: nome,
      subtitle: dal ? `${dal} – ${al ?? "oggi"}` : undefined,
    }),
  },
})

export const objectTypes = [imageWithCaption, blockContent, periodPerson]
