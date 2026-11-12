# ADR 0003: le foto appartengono agli eventi

**Stato:** accettata · 2026-11-12

## Contesto
Il vecchio sito Joomla ha una galleria per anno (2003-2021). Ogni anno ha più album, uno per evento. Nel nuovo sito gli eventi sono il contenuto centrale.

## Decisione
Non esiste un tipo "album": le foto sono un campo `galleria` dell'evento. La pagina `/galleria/[anno]` è una vista derivata che raggruppa gli eventi con foto per anno, con una tab per evento. Ogni album del vecchio sito viene migrato come evento passato. Se la data esatta non è nota, l'evento ha `dataSoloAnno`.

Unica eccezione: le **foto storiche** (1906-1990), che non sono legate a un evento e vivono nella pagina Storia.

## Conseguenze
- Un solo posto dove caricare le foto: l'evento. La galleria si aggiorna da sola.
- Il dettaglio evento mostra le foto di quell'evento.
