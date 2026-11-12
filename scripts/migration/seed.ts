/**
 * Contenuti di partenza presi dal vecchio sito e dalla scheda Federbande (novembre 2026).
 * Vengono creati solo se il documento non esiste ancora: le modifiche dei redattori non vengono mai sovrascritte.
 * I testi segnati con [DA VERIFICARE] vanno controllati dalla banda.
 */

let k = 0
const key = () => `seed${(k++).toString(36)}`

export function block(text: string, style: "normal" | "h2" | "h3" = "normal") {
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  }
}

export const OLD_SITE = "https://www.bandagardolo.it"

export const eventTypes = [
  { slug: "concerto", nome: "Concerto" },
  { slug: "sfilata", nome: "Sfilata / servizio" },
  { slug: "festa", nome: "Festa" },
  { slug: "saggio", nome: "Saggio allievi" },
]

export const siteSettings = {
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
  iban: "IT67 I083 0401 8000 0000 4040 143",
  banca: "Banca per il Trentino Alto Adige",
  // Instagram e TikTok si aggiungono dal pannello: se il campo è vuoto l'icona non compare.
  social: {
    facebook: "https://www.facebook.com/corpomusicalegardolo",
    youtube: "https://www.youtube.com/channel/UCkOIRMK6qiA1IM0GQ8qnlTQ",
  },
}

export const partners = [
  { nome: "Comitato Associazioni Gardolesi", logoUrl: `${OLD_SITE}/cmgSite/images/logos/logo_01.gif` },
  { nome: "Provincia Autonoma di Trento", logoUrl: `${OLD_SITE}/cmgSite/images/logos/provincia_stemma_piccolo.png` },
]

export const homePage = {
  heroTitolo: "La banda di Gardolo, dal 1906.",
  heroSottotitolo:
    "Concerti, sfilate e corsi di musica per tutte le età: da oltre un secolo portiamo la musica nelle piazze, nei teatri e nelle feste del Trentino.",
  numeroEventiInEvidenza: 3,
  corsiTitolo: "Vuoi suonare in banda?",
  corsiTesto: "Corsi per tutti gli strumenti della banda, per ragazzi e adulti, da settembre a maggio.",
  sostieniTitolo: "Sostieni la banda con il 5x1000",
  sostieniTesto: "Basta una firma nella dichiarazione dei redditi e il nostro codice fiscale.",
}

const p = (nome: string, dal?: number, al?: number) => ({ _type: "periodPerson", _key: key(), nome, dal, al })

export const maestri = [
  p("Savino Giacomoni"), p("Silvestro Mosna"), p("Dario Giacomoni"), p("Marcello Piffer"), p("Giulio Uber"),
  p("Cornelio Moser"), p("Aldo Ruffo"), p("Giuseppe Saccomani"), p("Marco Bazzoli", 1989, 2001),
  p("Andrea Loss", 2001, 2004), p("Enrico Leo Di Vincenzo", 2004, 2009), p("Mauro Barbera", 2009, 2014),
  p("Adelio Sonn", 2015, 2021), p("Katia Girardini", 2021, 2025), p("Maurizio Peterlana", 2025),
]

export const presidenti = [
  p("Giovanni Cagol"), p("Massimo Andreatta"), p("Natale Mattedi"), p("Romano Gianni"), p("Eugenio Mosna"),
  p("Carmelo Cappelletti"), p("Narciso Berloffa"), p("Mimmo Nadalini"), p("Arturo Frizzera"), p("Marco Pocher"),
  p("Erino Tomasi"), p("Danilo Mattedi"), p("Giuseppe Welber"), p("Bruno Nardelli"), p("Adriano Gianni"),
  p("Dino Torta"), p("Luigi Paolazzi"), p("Marco Giovanazzi", 1993, 2004), p("Bruno Robol", 2004, 2022),
  p("Fabrizio Robol", 2022),
]

export const storiaIntro = "Oltre un secolo di musica a Gardolo: dalla fondazione nel 1906 a oggi."

/**
 * Storia unita da due fonti: la pagina Storia del vecchio sito (si ferma al 2021) e la scheda della banda
 * sul sito della Federazione dei Corpi Bandistici del Trentino (aggiunge le formazioni nate dalla banda).
 * Testo originale, con doppioni tolti e refusi corretti. L'ultimo capitolo è [DA VERIFICARE] dalla banda.
 */
export const storiaCapitoli: {
  _key: string
  periodo: string
  titolo: string
  testo: ReturnType<typeof block>[]
  immagineUrl?: string
}[] = [
  {
    _key: key(),
    periodo: "1906–1929",
    titolo: "La banda sociale",
    immagineUrl: `${OLD_SITE}/cmgSite/images/photos/FotoStoriche/ver-FOTO-BANDA-FONDAZIONE.jpg`,
    testo: [
      block(
        "La banda nasce nell'autunno 1906 per iniziativa dello scomparso Circolo mandolinistico. A quell'epoca Gardolo era Comune e contava mille abitanti; i 40 bandisti sono quasi tutti contadini e la novità è salutata con grande entusiasmo da una popolazione che può contare su rarissimi momenti di svago. Il lavoro del maestro Savino Giacomoni, al quale dà una mano nelle lezioni il maestro Bussoli della Banda cittadina di Trento, consente una prima uscita ufficiale nell'autunno del 1907.",
      ),
      block(
        "La sede viene sistemata al piano terra della scuola elementare, mentre il Capitanato distrettuale rilascia il visto per la costituzione della banda, con il permesso «di far uso delle fascette con i colori di Trento, della tracolla e di altri distintivi ivi compreso il vistoso cappello ornato da una cetra sormontata da una penna di fagiano». I bandisti si tassano con una quota per integrare il prestito iniziale fatto da Antonio Moser «Nadasti».",
      ),
      block(
        "Dopo la pausa della prima guerra la vita culturale del paese si anima e nasce anche la fanfara della «Sportiva» di Gardolo, con 25 elementi. La banda difende storia e carisma in concorsi e convegni: ad Ala e a Trento conquista un terzo premio di categoria, suonando a fianco delle bande di Pergine, Ala e Folgaria.",
      ),
      block(
        "Nel 1926 la fanfara viene sciolta e la maggior parte dei musicisti confluisce nella banda sociale, che vede così aumentare di molto l'organico, ma calare le risorse finanziarie a fronte delle molte spese da sostenere. Sotto il peso dei debiti, nel 1929 l'attività cessa e gli strumenti passano ad altri complessi.",
      ),
    ],
  },
  {
    _key: key(),
    periodo: "Dopoguerra",
    titolo: "La rinascita",
    testo: [
      block(
        "Il silenzio si protrae fin dopo la seconda guerra, quando alcuni vecchi bandisti decidono di rifondare il Corpo musicale nell'ambito del CRAL, il Circolo ricreativo assistenza lavoratori. La direzione è assunta da Silvestro Mosna, uno dei pochi superstiti della vecchia formazione. La strada ora diventa molto più comoda e non mancano le soddisfazioni.",
      ),
      block(
        "Il decennio legato alla bacchetta di Giuseppe Saccomani è di intenso lavoro: una media di 20 concerti l'anno, una registrazione televisiva per il CONI, una musicassetta con 14 brani e l'inno ufficiale dei Giochi della Gioventù, registrato insieme al coro «Voci di Melta» diretto dal maestro Luciano Pisetta.",
      ),
    ],
  },
  {
    _key: key(),
    periodo: "Anni ’80",
    titolo: "Banda cittadina",
    testo: [
      block(
        "Negli anni Ottanta il Comune di Trento affida a Gardolo l'incarico «di esercitare le funzioni di banda cittadina qualora se ne presentasse la necessità, fino a quando ciò sarà ritenuto opportuno e necessario». Il 7 marzo 1983 l'assessore alla cultura Pietracci definisce compiti e oneri dell'incarico, cosa che suscita non poche polemiche con la banda di Trento.",
      ),
      block(
        "Il Comune pensa allora di congelare la definizione «Città di Trento» in attesa della rinascita della vecchia banda cittadina, che in quegli anni riprende a suonare dopo un lungo silenzio.",
      ),
    ],
  },
  {
    _key: key(),
    periodo: "1989–2004",
    titolo: "Due Flicorni d'oro",
    testo: [
      block(
        "Con il maestro Marco Bazzoli, alla guida dal 1989 al 2001 e forte di cinque diplomi di musica (trombone, strumentazione per banda, musica corale e direzione di coro, composizione e direzione d'orchestra), il Corpo musicale si ritaglia uno spazio ben preciso nella cultura musicale trentina. Nel 1993 vince il 1° premio nella categoria «piccola banda» al 2° Concorso internazionale «Flicorno d'oro» di Riva del Garda e il 2° premio al Concorso nazionale di Brescia; seguono il 5° e il 4° premio in prima categoria al 2° e al 3° «Flicorno» e l'assegnazione alla categoria «onore», con punteggio molto alto, nei due concorsi di classificazione delle bande del Trentino.",
      ),
      block(
        "I musicisti danno vita anche ad altre formazioni legate alla musica per strumenti a fiato: la «bandina» diretta da Armida Moser, nata nel 1990, primo esempio stabile di banda giovanile in Trentino; la «Big band», nata nel 1993 e diretta da Michele Tamanini; il «Gruppo degli ottoni» diretto da Augusto Righi, il «Quartetto di saxofono» e il «Quintetto classico».",
      ),
      block(
        "La banda tiene molti concerti in Italia e all'estero, raccogliendo consensi soprattutto tra gli appassionati di musica «colta». Nel 2000 è il primo gruppo bandistico a esibirsi nel rinnovato Teatro Sociale di Trento, rompendo il ventennale silenzio con le note della «Cenerentola» di Rossini.",
      ),
      block(
        "Nel 2001 Bazzoli è chiamato a dirigere la Civica Orchestra di Fiati di Milano e cede la bacchetta al giovane maestro Andrea Loss. Con lui, nel 2003, la banda vince il suo secondo «Flicorno d'oro», prima nella seconda categoria del VII Concorso internazionale di Riva del Garda. Nel novembre 2004, nelle manifestazioni del Comune di Trento dedicate al Settecento attorno alla fontana del Nettuno, suona per la prima volta nella Sala della Filarmonica di Trento.",
      ),
    ],
  },
  {
    _key: key(),
    periodo: "Dal 2005",
    titolo: "Gli ultimi vent'anni",
    testo: [
      block(
        "Da febbraio 2005 la banda è diretta dal maestro Enrico Leo Di Vincenzo, per più di dieci anni primo clarinetto sotto la direzione di Bazzoli. Virtuoso del suo strumento, è stato primo clarinetto nella Banda dell'Esercito dal 1991 al 1992, poi primo clarinetto solo nella Grande Banda Rappresentativa della Federazione dei Corpi Bandistici del Trentino e nella Civica Banda Musicale di Padova.",
      ),
      block(
        "Dal 2009 al 2014 la direzione passa al maestro Mauro Barbera, insegnante alla Scuola musicale C. Eccher di Cles e musicista professionista in orchestra e in diverse formazioni, tra cui il quintetto Jupiter Brass Quintet. Nel jazz ha suonato a Itinerari Jazz a Trento con Giancarlo Gazzani, Emilio Soana, Franco D'Andrea e Henry Threadgill, con la New Project Jazz Orchestra e la Moon Cin Jazz Orchestra, e nel 1995 con Chris de Burgh al «Golden Europa» di Bolzano. Con lui la banda cresce e partecipa a numerosi eventi in Trentino e non solo.",
      ),
      block(
        "Da gennaio 2015 all'estate 2021 la banda è guidata dal maestro Adelio Sonn, in un periodo ricco di appuntamenti musicali e sociali che rafforzano anche la vita dell'associazione. Dall'estate 2021 al 2025 la dirige Katia Girardini, forte di numerose collaborazioni a livello nazionale e internazionale; dal 2025 la bacchetta è affidata al maestro Maurizio Peterlana.",
      ),
    ],
  },
]

export const chiSiamoPage = {
  intro: [
    block(
      "Il Corpo Musicale di Gardolo è un'associazione di promozione sociale nata nel 1906. Suoniamo in concerti, feste e cerimonie a Gardolo, a Trento e in tutto il Trentino, e ogni anno formiamo nuovi musicisti con i nostri corsi.",
    ),
  ],
  maestro: { nome: "Maurizio Peterlana", bio: [block("Biografia del Maestro in arrivo. [DA COMPLETARE]")] },
  direttivo: [
    { _key: key(), nome: "Fabrizio Robol", ruolo: "Presidente" },
    { _key: key(), nome: "Maurizio Peterlana", ruolo: "Maestro" },
    { _key: key(), nome: "Katia Girardini", ruolo: "Docente di musica" },
  ],
}

export const corsiPage = {
  annoScolastico: "2026/2027",
  intro: [
    block(
      "Il Corpo Musicale di Gardolo, attraverso la Federazione dei Corpi Bandistici del Trentino, organizza ogni anno corsi per tutti gli strumenti della banda, aperti a tutti, grandi e piccini. I corsi seguono il calendario scolastico provinciale, da settembre a maggio, con insegnanti qualificati.",
    ),
    block(
      "Ogni settimana: teoria musicale di gruppo (45 minuti), lezione individuale di strumento (30 minuti) e musica d'insieme. Lo strumento viene consegnato gratuitamente, in base alla disponibilità e al numero delle richieste.",
    ),
    block(
      "Appena avrai preso un po' di familiarità con lo strumento potrai entrare nella nostra bandina, per divertirti, fare nuove amicizie e suonare insieme ai tuoi amici. Quando sarai pronto, a giudizio del Maestro, entrerai a far parte del Corpo Musicale di Gardolo.",
    ),
  ],
  quote: [
    { _key: key(), voce: "Quota associativa", fascia: "Tutti", importo: 20 },
    { _key: key(), voce: "Quota strumento", fascia: "Junior, 8-30 anni", importo: 330, nota: "Età al 21/12/2026" },
    { _key: key(), voce: "Quota strumento", fascia: "Adulti, 31-65 anni", importo: 400, nota: "Età al 21/12/2026" },
    { _key: key(), voce: "Quota strumento", fascia: "Senior, 66 anni e oltre", nota: "In fase di definizione" },
    { _key: key(), voce: "Teoria e solfeggio", fascia: "Chi inizia il percorso", importo: 80 },
  ],
  scadenze: [
    { _key: key(), data: "2026-06-30", descrizione: "Termine per le iscrizioni" },
    { _key: key(), data: "2026-08-31", descrizione: "Solo nuovi iscritti al 1° anno, in base ai posti rimasti" },
  ],
  linkIscrizione: "https://forms.gle/2eo7NmrCKPjAMRGH8",
  pagamento: [
    block(
      "Bonifico a: Corpo Musicale di Gardolo, Banca per il Trentino Alto Adige, IBAN IT67 I083 0401 8000 0000 4040 143.",
    ),
    block("Causale: «Iscrizione corsi musicali 2026/2027» seguita da nome e cognome dell'allievo."),
  ],
}

export const sostieniciPage = {
  testo5x1000: [
    block(
      "Nella prossima dichiarazione dei redditi puoi destinare il 5x1000 al Corpo Musicale di Gardolo: basta firmare nel riquadro dedicato agli enti del Terzo Settore e indicare il nostro codice fiscale 80019160227.",
    ),
    block("A te non costa nulla, per noi significa strumenti, corsi e nuova musica. Grazie! — La Direzione"),
  ],
}

/** I due eventi presenti nella vecchia pagina "Prossimi eventi". Orari in ora italiana (CEST = UTC+2). */
export const legacyEvents = [
  {
    _id: "joomla-evento-2024-05-25",
    titolo: "La Banda in Piazza",
    slug: "la-banda-in-piazza-2024",
    inizio: "2024-05-25T14:00:00.000Z",
    tipo: "concerto",
    luogo: { nome: "Piazza della Chiesa", comune: "Gardolo (TN)" },
    locandinaUrl: `${OLD_SITE}/cmgSite/images/concerts/CMG_concerto_25_05_2024.jpeg`,
  },
  {
    _id: "joomla-evento-2023-10-28",
    titolo: "La Fiaba in Musica",
    slug: "la-fiaba-in-musica-2023",
    inizio: "2023-10-28T15:30:00.000Z",
    tipo: "concerto",
    luogo: { nome: "Teatro Gigi Cona", comune: "Gardolo (TN)" },
    locandinaUrl: `${OLD_SITE}/cmgSite/images/concerts/LaFiabaInMusica_700x989.png`,
  },
]
