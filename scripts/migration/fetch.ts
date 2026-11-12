/** Accesso al vecchio sito Joomla, condiviso da migrazione (`npm run migrate`) e anteprima (`npm run snapshot`). */
import { OLD_SITE } from "./seed"

export const BASE = `${OLD_SITE}/cmgSite/index.php`
export const UA = { "User-Agent": "Mozilla/5.0 (migrazione sito Corpo Musicale di Gardolo)" }

export async function getHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: UA })
  if (!res.ok) throw new Error(`${res.status} su ${url}`)
  return res.text()
}
