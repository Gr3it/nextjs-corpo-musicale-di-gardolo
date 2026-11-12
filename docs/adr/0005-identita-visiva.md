# ADR 0005: identità visiva, un solo rosso e il logo che si fonde con lo sfondo

**Stato:** accettata · 2026-11-13

## Contesto
Il logo esiste in due versioni con lo sfondo pieno (rosso o bianco), non trasparente. La banda vuole un sito sobrio, senza l'oro del logo come colore dell'interfaccia e senza un uso eccessivo di card e riquadri.

## Decisione
- **Palette, nessun altro colore:**
  - accento `#5D0B19`, lo stesso dello sfondo del logo;
  - bianco `#FFFFFF`;
  - pannello `#FAF5F5` per staccare le sezioni;
  - inchiostro `#1C1214`, da cui derivano grigi e filetti.

  Token in `app/globals.css` (`brand`, `panel`, `ink`).
- **Logo senza bordo visibile:**
  - navbar e footer rossi con `logo-red-mark.png` / `logo-red.png`;
  - hero bianca con `logo-white.png`.

  I PNG sono ricavati da `logo.jpg` e `logo-white.jpg` portando lo sfondo esattamente a `#5D0B19` e `#FFFFFF` e ritagliando il margine. Un nuovo logo va trattato allo stesso modo.
- **Niente card:** liste con filetti (`divide-y`), fasce a pannello e date tipografiche al posto di riquadri e ombre.
- **Forme:** angoli vivi ovunque. Pulsanti e filtri sono a pillola (`rounded-full`).
- **Tipografia:** Fraunces per titoli e numeri delle date, Source Sans 3 per il testo, etichette in maiuscoletto spaziato (`eyebrow`) come la scritta del logo.

## Conseguenze
- L'oro compare solo dentro il logo.
- Il logo non è caricabile dal CMS: le tre versioni dipendono dal colore di fondo esatto.
- Un nuovo colore richiede di rivedere questa ADR.
