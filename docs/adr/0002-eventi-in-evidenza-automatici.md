# ADR 0002: eventi in evidenza calcolati automaticamente per data

**Stato:** accettata · 2026-11-12

## Contesto
La home mostra gli eventi "in evidenza", come fa il sito della Federazione Corpi Bandistici del Trentino. Il vecchio sito è rimasto fermo per anni perché richiedeva aggiornamenti manuali.

## Decisione
Gli eventi in evidenza sono **sempre i prossimi N eventi per data** (inizio ≥ `now()` di Sanity). Non esiste un flag "in evidenza" nel CMS.

## Conseguenze
- Nessuna manutenzione: un evento esce dalla home da solo quando è passato.
- Non si può "fissare" in cima un evento lontano. Se servirà, si aggiungerà un flag con una nuova ADR.
- Le liste di eventi hanno una cache con durata oraria, oltre alla rivalidazione da webhook. Così il passaggio da prossimo a passato avviene senza interventi.
