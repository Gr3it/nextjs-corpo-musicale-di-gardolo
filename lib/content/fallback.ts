import type { HomePage, SiteSettings } from "./types"

/**
 * Valori di riserva: usati finché Sanity non è configurato o se un campo è vuoto.
 * Dati presi dal vecchio sito bandagardolo.it e dalla scheda Federbande.
 */
export const fallbackSettings: SiteSettings = {
  nome: "Corpo Musicale di Gardolo",
  descrizione:
    "Il Corpo Musicale di Gardolo, banda dal 1906: concerti, eventi, corsi di musica per tutte le età a Gardolo (Trento).",
  email: "info@bandagardolo.it",
  emailCorsi: "corsi@bandagardolo.it",
  pec: "bandagardolo@pec.federbandetrentine.it",
  telefono: "340 4720799",
  indirizzo: "Piazzale Lionello Groff 8/1",
  cap: "38121",
  citta: "Gardolo (TN)",
  orariProve: "Martedì, 20:30 – 22:30",
  formaGiuridica: "Associazione di Promozione Sociale – Ente del Terzo Settore",
  codiceFiscale: "80019160227",
  partitaIva: "01436280224",
  social: {
    facebook: "https://www.facebook.com/corpomusicalegardolo",
    youtube: "https://www.youtube.com/channel/UCkOIRMK6qiA1IM0GQ8qnlTQ",
    // SEGNAPOSTO: da sostituire con i link veri nel pannello (Impostazioni sito → Social).
    instagram: "https://www.instagram.com/",
    tiktok: "https://www.tiktok.com/",
  },
  partner: [],
}

export const fallbackHome: HomePage = {
  heroTitolo: "La banda di Gardolo, dal 1906.",
  heroSottotitolo:
    "Concerti, sfilate e corsi di musica per tutte le età: da oltre un secolo portiamo la musica nelle piazze, nei teatri e nelle feste del Trentino.",
  numeroEventiInEvidenza: 3,
  corsiTitolo: "Vuoi suonare in banda?",
  corsiTesto: "Corsi per tutti gli strumenti della banda, per ragazzi e adulti, da settembre a maggio.",
  sostieniTitolo: "Sostieni la banda con il 5x1000",
  sostieniTesto: "Basta una firma nella dichiarazione dei redditi e il nostro codice fiscale.",
}
