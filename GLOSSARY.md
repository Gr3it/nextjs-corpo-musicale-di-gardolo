# Glossario di dominio

Linguaggio condiviso per il sito del Corpo Musicale di Gardolo. Codice, schemi Sanity e testi dell'interfaccia usano questi termini.

**Banda / Corpo Musicale**: il Corpo Musicale di Gardolo APS, l'associazione proprietaria del sito. Fondata nel 1906.

**Evento** (`event`): qualsiasi uscita pubblica della banda: concerto, sfilata, servizio religioso, saggio degli allievi, festa. Ha una data di inizio, un luogo, un tipo e opzionalmente una locandina e una galleria di foto. Ogni foto pubblicata sul sito appartiene a un evento, salvo le foto storiche.

**Prossimo evento**: un evento la cui data di inizio è uguale o successiva al momento attuale. Il confronto lo fa Sanity con `now()`, mai il browser.

**Evento passato**: un evento la cui data di inizio è precedente al momento attuale. Gli eventi passati formano l'**archivio**.

**Evento in evidenza**: uno dei primi N prossimi eventi, ordinati per data crescente. È una regola calcolata, non un flag modificabile dai redattori (vedi [ADR 0002](docs/adr/0002-eventi-in-evidenza-automatici.md)).

**Tipo evento** (`eventType`): categoria di un evento (concerto, sfilata, ...). L'elenco è gestito dai redattori ed è usato per i filtri della lista eventi.

**Data solo anno** (`dataSoloAnno`): flag di un evento la cui data esatta non è nota. Riguarda gli album migrati dal vecchio sito. Il sito mostra solo l'anno.

**Stato evento**: `confermato` (default), `annullato` o `rinviato`. Un evento annullato o rinviato resta visibile, con un'etichetta.

**Galleria evento**: le foto allegate a un evento. Sostituisce il concetto di "album" del vecchio sito Joomla.

**Galleria** (pagina): vista delle gallerie evento raggruppate per anno. Ogni anno ha una tab per ogni evento con foto, come nel vecchio sito.

**Foto storica**: foto della banda dal 1906 al 1990 circa, non legata a un evento. Vive nella pagina Storia (`storiaPage.fotoStoriche`).

**Maestro**: il direttore musicale della banda. **Presidente**: il legale rappresentante dell'associazione. Gli elenchi storici di entrambi sono nella pagina Storia.

**Documento di trasparenza** (`trasparenzaDoc`): un PDF pubblicato per obblighi o trasparenza dell'ente del Terzo Settore, come rendiconto 5x1000, statuto o bilancio.

**Impostazioni sito** (`siteSettings`): documento unico con i dati istituzionali (contatti, sede, codice fiscale, social, partner) usati in header, footer e contatti.

**Redattore**: volontario che aggiorna i contenuti dal pannello admin (Sanity Studio su `/studio`). Non è un tecnico.
