/**
 * Regola unica "prossimo / passato" (vedi GLOSSARY.md), condivisa da sito e Studio.
 * Un evento resta "prossimo" fino alla sua fine, se indicata, altrimenti fino all'inizio.
 */
export const UPCOMING_FILTER = 'coalesce(fine, inizio) >= now()'
export const PAST_FILTER = 'coalesce(fine, inizio) < now()'
