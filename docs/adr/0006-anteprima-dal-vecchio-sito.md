# ADR 0006: anteprima con i contenuti del vecchio sito finché Sanity non è collegato

**Stato:** accettata · 2026-11-13

## Contesto
Il progetto Sanity non esiste ancora, ma la banda vuole vedere il nuovo sito con i contenuti veri: eventi, gallerie, storia e corsi. La migrazione (`npm run migrate`) scrive solo su Sanity.

## Decisione
- `npm run snapshot` legge il vecchio sito Joomla con gli **stessi parser e testi della migrazione** (`scripts/migration/`). Salva il risultato in `lib/content/snapshot.json`, già nella forma restituita dalle query.
- `lib/content` usa lo snapshot **solo se Sanity non è configurato**. Applica in memoria le stesse regole delle query (prossimo/passato, filtri, gallerie per anno). Con Sanity collegato lo snapshot non viene mai letto.
- Le immagini dello snapshot puntano al vecchio sito. `lib/image.ts` riconosce gli asset non Sanity e usa l'URL originale. Le foto che non rispondono vengono scartate, come fa la migrazione.
- La storia non viene più letta dalla pagina del vecchio sito: è scritta in `seed.ts`, divisa in capitoli. Unisce il vecchio sito e la scheda della banda sul sito della Federazione dei Corpi Bandistici del Trentino.

## Conseguenze
- Le immagini dell'anteprima si vedono solo finché `bandagardolo.it` serve ancora il vecchio Joomla. **Prima di spostare il dominio su Vercel vanno collegati Sanity e lanciata la migrazione.**
- Le foto dell'anteprima non passano dalla CDN di Sanity: arrivano a piena risoluzione (circa 1200 px) e le gallerie sono più lente.
- Correzioni ai testi di partenza (`seed.ts`) valgono sia per l'anteprima sia per la migrazione. Dopo la migrazione i testi si modificano solo nello Studio.
