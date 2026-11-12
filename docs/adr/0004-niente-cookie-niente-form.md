# ADR 0004: nessun analytics, nessun cookie di terze parti, contatti solo via email

**Stato:** accettata · 2026-11-12

## Contesto
Il sito di un'associazione di volontari deve restare semplice da gestire e conforme al GDPR senza un banner di consenso.

## Decisione
- Nessuno strumento di analytics.
- Nessun embed che imposti cookie di terze parti. La mappa usa OpenStreetMap con link a Google Maps; niente iframe Google Maps né YouTube in v1.
- Nessun modulo di contatto: solo link `mailto:` a info@ e corsi@.

## Conseguenze
- Nessun banner cookie, nessun servizio email transazionale da configurare.
- Gli embed social futuri dovranno passare da un consenso esplicito (click-to-load) o rivedere questa ADR.
