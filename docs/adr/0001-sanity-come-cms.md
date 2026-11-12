# ADR 0001: Sanity come CMS headless

**Stato:** accettata · 2026-11-12

## Contesto
I contenuti (eventi, corsi, testi, foto) devono essere aggiornati da 1-3 volontari non tecnici. Il sito gira su Next.js su Vercel Hobby. Ogni servizio aggiunto deve avere un piano gratuito sufficiente. La galleria storica porta centinaia di immagini.

## Decisione
Usiamo **Sanity** (piano Free). Lo Studio è integrato nell'app Next.js su `/studio`. Le immagini sono servite dalla CDN di Sanity tramite `next-sanity/image`.

## Alternative scartate
- **Payload CMS**: open source e tutto nel repo, ma richiede un database e uno storage esterni gratuiti da mantenere.
- **CMS git-based (Keystatic, Tina)**: niente infrastruttura, ma ogni modifica diventa un commit con rebuild. È scomodo per molti eventi e immagini e per redattori non tecnici.

## Conseguenze
- Piano Free: 20 utenti, solo i ruoli Administrator e Viewer, quindi tutti i redattori sono admin. Inoltre 100 GB di asset, 10.000 documenti e 2 webhook.
- Il dataset è pubblico in lettura: ci vanno solo contenuti destinati al sito.
- Le immagini non passano dall'ottimizzazione di Vercel, che su Hobby ha un limite di 5.000 trasformazioni al mese.
- Esiste un piano Sanity per il non-profit, se in futuro servisse.
