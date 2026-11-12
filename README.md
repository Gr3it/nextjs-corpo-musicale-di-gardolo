# Corpo Musicale di Gardolo: sito web

Next.js 16 (App Router, Cache Components) + Sanity (pannello admin su `/studio`) + Tailwind/shadcn. Hosting su Vercel.

- Linguaggio di dominio: [GLOSSARY.md](GLOSSARY.md)
- Decisioni architetturali: [docs/adr/](docs/adr/)

## Avvio rapido

```bash
npm install
cp .env.example .env.local   # poi compila i valori
npm run dev                  # http://localhost:3000, pannello su /studio
```

Il sito funziona anche senza Sanity configurato: mostra un'**anteprima con i contenuti del vecchio sito** (eventi, gallerie, storia, corsi) salvata in `lib/content/snapshot.json`, più i dati istituzionali di riserva (`lib/content/fallback.ts`). L'anteprima si rigenera con `npm run snapshot`; le sue immagini sono ancora quelle del vecchio sito (ADR 0006).

## 1. Creare il progetto Sanity (una volta)

1. Crea un account e un progetto su [sanity.io/manage](https://www.sanity.io/manage) (piano Free), con dataset `production`.
2. Copia il **Project ID** in `.env.local` → `NEXT_PUBLIC_SANITY_PROJECT_ID`.
3. In **API → CORS origins** aggiungi `http://localhost:3000` e l'URL di produzione (es. `https://www.bandagardolo.it`), entrambi con *Allow credentials*.
4. In **Members** invita i redattori: sul piano Free sono tutti *Administrator*.

## 2. Migrare i contenuti dal vecchio sito

1. In **API → Tokens** crea un token con permesso *Editor* e mettilo in `SANITY_WRITE_TOKEN` (solo in `.env.local`, mai su Vercel).
2. Prova senza scrivere nulla:
   ```bash
   npm run migrate -- --dry-run
   ```
3. Esegui la migrazione (51 album con 887 foto, 24 foto storiche, storia in 5 capitoli, corsi, contatti). La storia unisce il testo del vecchio sito e quello della scheda Federbande ed è scritta in `scripts/migration/seed.ts`:
   ```bash
   npm run migrate
   ```
   Lo script è idempotente: se si interrompe, rilancialo e riprende senza duplicati. Non sovrascrive mai i documenti già esistenti.
4. Dopo la migrazione revoca il token.

Cosa controllare nello Studio dopo la migrazione:
- testi segnati con `[DA VERIFICARE]` o `[DA COMPLETARE]` (ultimo capitolo della storia, 2021-2025; bio del Maestro);
- album d'archivio senza data precisa: hanno *Mostra solo l'anno*, si può correggere la data;
- didascalie delle foto storiche, ricavate dai nomi dei file;
- **Impostazioni sito**: PEC, account Instagram, posizione della sede sulla mappa.

## 3. Pubblicare su Vercel

1. Importa il repository su Vercel (preset Next.js).
2. Variabili d'ambiente: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SITE_URL`, `SANITY_REVALIDATE_SECRET` (una stringa casuale lunga).
3. **Webhook per aggiornare il sito appena si pubblica** (sanity.io/manage → API → Webhooks):
   - URL: `https://<dominio>/api/revalidate`
   - Dataset: `production`, trigger: create, update, delete
   - Filter: lascia vuoto
   - Secret: lo stesso valore di `SANITY_REVALIDATE_SECRET`

   Senza webhook il sito si aggiorna comunque entro un'ora.
4. Dominio: quando `bandagardolo.it` punta a Vercel, i vecchi indirizzi `/cmgSite/index.php/...` vengono reindirizzati (301) alle nuove pagine (`next.config.ts`).

> Nota: il piano Hobby di Vercel è per uso personale e non commerciale. Per un'associazione conviene verificarne i termini.

## Come funziona

| Cosa | Dove |
|---|---|
| Accesso ai contenuti (unico punto, query GROQ + cache) | `lib/content/` |
| Regola "prossimo / passato" (sito e Studio) | `sanity/eventFilters.ts` |
| Schemi e struttura del pannello | `sanity/schemaTypes/`, `sanity/structure.ts` |
| Pagine | `app/(site)/` |
| Export calendario `.ics` | `app/(site)/eventi/[slug]/calendar.ics/route.ts` |
| Webhook di rivalidazione | `app/api/revalidate/route.ts` |
| Migrazione dal vecchio sito | `scripts/migrate-joomla.ts` |
| Anteprima senza Sanity (contenuti del vecchio sito) | `scripts/snapshot-joomla.ts` → `lib/content/snapshot.json` |

- **Eventi in evidenza** in home: sempre i prossimi N per data, con N impostabile nella pagina Home dello Studio (ADR 0002).
- **Galleria**: le foto si caricano dentro l'evento; `/galleria/[anno]` le raggruppa per anno (ADR 0003).
- **Immagini**: servite dalla CDN di Sanity, non dall'ottimizzazione immagini di Vercel (ADR 0001).
- **Nessun cookie né analytics**: mappe OpenStreetMap, contatti via `mailto:` (ADR 0004).
