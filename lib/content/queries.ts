import { defineQuery } from "next-sanity"

import { PAST_FILTER, UPCOMING_FILTER } from "@/sanity/eventFilters"

const image = /* groq */ `{..., asset->{_id, url, metadata{dimensions, lqip}}}`

const eventSummary = /* groq */ `{
  _id, titolo, "slug": slug.current, inizio, fine, dataSoloAnno, senzaOrario, stato,
  tipo->{nome, "slug": slug.current},
  luogo{nome, indirizzo, comune},
  locandina${image},
  "numeroFoto": count(galleria)
}`

export const upcomingEventsQuery = defineQuery(
  `*[_type == "event" && ${UPCOMING_FILTER}] | order(inizio asc)[0...$limit]${eventSummary}`,
)

export const upcomingEventsByTypeQuery = defineQuery(
  `*[_type == "event" && ${UPCOMING_FILTER} && ($tipo == "" || tipo->slug.current == $tipo)]
    | order(inizio asc)${eventSummary}`,
)

export const pastEventsQuery = defineQuery(
  `*[_type == "event" && ${PAST_FILTER}
     && inizio >= $from && inizio < $to
     && ($tipo == "" || tipo->slug.current == $tipo)]
    | order(inizio desc)${eventSummary}`,
)

export const pastEventYearsQuery = defineQuery(
  `array::unique(*[_type == "event" && ${PAST_FILTER} && defined(inizio)]{"y": string::split(inizio, "-")[0]}.y)`,
)

export const eventTypesQuery = defineQuery(
  `*[_type == "eventType" && count(*[_type == "event" && references(^._id)]) > 0]
    | order(nome asc){nome, "slug": slug.current}`,
)

export const eventBySlugQuery = defineQuery(
  `*[_type == "event" && slug.current == $slug][0]{
    ...${eventSummary},
    luogo{nome, indirizzo, comune, posizione},
    descrizione[]{..., _type == "imageWithCaption" => ${image}},
    linkEsterno,
    galleria[]${image}
  }`,
)

export const eventSlugsQuery = defineQuery(
  `*[_type == "event" && defined(slug.current)] | order(inizio desc)[0...50].slug.current`,
)

export const galleryYearsQuery = defineQuery(
  `array::unique(*[_type == "event" && count(galleria) > 0]{"y": string::split(inizio, "-")[0]}.y)`,
)

export const galleryYearQuery = defineQuery(
  `*[_type == "event" && count(galleria) > 0 && inizio >= $from && inizio < $to] | order(inizio asc){
    _id, titolo, "slug": slug.current, inizio, dataSoloAnno,
    galleria[]${image}
  }`,
)

export const siteSettingsQuery = defineQuery(
  `*[_id == "siteSettings"][0]{..., partner[]{..., logo${image}}}`,
)

export const homePageQuery = defineQuery(`*[_id == "homePage"][0]{..., heroImmagine${image}}`)

export const storiaPageQuery = defineQuery(
  `*[_id == "storiaPage"][0]{
    ...,
    capitoli[]{..., immagine${image}, testo[]{..., _type == "imageWithCaption" => ${image}}},
    fotoStoriche[]${image},
    maestro{..., foto${image}}
  }`,
)


export const corsiPageQuery = defineQuery(
  `*[_id == "corsiPage"][0]{..., strumenti[]{..., immagine${image}}}`,
)

export const sostieniciPageQuery = defineQuery(`*[_id == "sostieniciPage"][0]`)

export const trasparenzaDocsQuery = defineQuery(
  `*[_type == "trasparenzaDoc"] | order(anno desc, titolo asc){
    _id, titolo, categoria, anno, descrizione, "fileUrl": file.asset->url
  }`,
)
