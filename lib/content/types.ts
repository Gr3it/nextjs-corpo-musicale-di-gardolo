import type { PortableTextBlock } from "next-sanity"

export type SanityImage = {
  asset: {
    _id: string
    url: string
    metadata?: { dimensions?: { width: number; height: number }; lqip?: string }
  }
  crop?: unknown
  hotspot?: unknown
  alt?: string
  didascalia?: string
  anno?: number
}

export type RichText = PortableTextBlock[]

export type EventStatus = "confermato" | "annullato" | "rinviato"

export type EventTypeRef = { nome: string; slug: string }

export type EventLocation = {
  nome?: string
  indirizzo?: string
  comune?: string
  posizione?: { lat: number; lng: number }
}

export type EventSummary = {
  _id: string
  titolo: string
  slug: string
  inizio: string
  fine?: string
  dataSoloAnno?: boolean
  senzaOrario?: boolean
  stato?: EventStatus
  tipo?: EventTypeRef
  luogo?: EventLocation
  locandina?: SanityImage
  numeroFoto: number
}

export type EventDetail = EventSummary & {
  descrizione?: RichText
  linkEsterno?: { etichetta?: string; url?: string }
  galleria?: SanityImage[]
}

export type EventPeriod = "prossimi" | "passati"

export type EventQuery = { periodo: EventPeriod; anno?: number; tipo?: string }

export type GalleryEvent = Pick<EventSummary, "_id" | "titolo" | "slug" | "inizio" | "dataSoloAnno"> & {
  galleria: SanityImage[]
}

export type SocialPlatform = "facebook" | "instagram" | "youtube" | "tiktok"

/** Un link per piattaforma; se manca, l'icona non viene mostrata. */
export type SocialAccounts = Partial<Record<SocialPlatform, string>>

export type SiteSettings = {
  nome: string
  descrizione: string
  email?: string
  emailCorsi?: string
  pec?: string
  telefono?: string
  indirizzo?: string
  cap?: string
  citta?: string
  posizione?: { lat: number; lng: number }
  orariProve?: string
  formaGiuridica?: string
  codiceFiscale?: string
  partitaIva?: string
  iban?: string
  banca?: string
  social: SocialAccounts
  partner: { nome: string; logo?: SanityImage; url?: string }[]
}

export type HomePage = {
  heroTitolo: string
  heroSottotitolo?: string
  heroImmagine?: SanityImage
  numeroEventiInEvidenza: number
  corsiTitolo?: string
  corsiTesto?: string
  sostieniTitolo?: string
  sostieniTesto?: string
}

export type PeriodPerson = { nome: string; dal?: number; al?: number }

export type StoriaChapter = { periodo: string; titolo: string; testo?: RichText; immagine?: SanityImage }

export type StoriaPage = {
  intro?: string
  capitoli?: StoriaChapter[]
  fotoStoriche?: SanityImage[]
  maestri?: PeriodPerson[]
  presidenti?: PeriodPerson[]
  /** La banda oggi: maestro in carica e direttivo. */
  maestro?: { nome?: string; foto?: SanityImage; bio?: RichText }
  direttivo?: { nome: string; ruolo: string }[]
}

export type CorsiPage = {
  annoScolastico?: string
  intro?: RichText
  quote?: { voce: string; fascia?: string; importo?: number; nota?: string }[]
  scadenze?: { data: string; descrizione: string }[]
  linkIscrizione?: string
  pagamento?: RichText
  strumenti?: { nome: string; famiglia?: string; descrizione?: string; immagine?: SanityImage }[]
}

export type SostieniciPage = { testo5x1000?: RichText; altriModi?: RichText }

/** Contenuti del vecchio sito salvati da `npm run snapshot`: anteprima finché Sanity non è collegato. */
export type Snapshot = {
  generatedAt: string
  partner: SiteSettings["partner"]
  storia: StoriaPage
  corsi: CorsiPage
  sostienici: SostieniciPage
  events: EventDetail[]
}

export type TrasparenzaDoc = {
  _id: string
  titolo: string
  categoria: string
  anno?: number
  descrizione?: string
  fileUrl: string
}
