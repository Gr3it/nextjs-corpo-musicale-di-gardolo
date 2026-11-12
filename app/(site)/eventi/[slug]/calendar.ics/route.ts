import { buildIcs } from "@/lib/calendar"
import { getEventBySlug } from "@/lib/content"
import { siteUrl } from "@/lib/site"

export async function GET(_req: Request, ctx: RouteContext<"/eventi/[slug]/calendar.ics">) {
  const { slug } = await ctx.params
  const event = await getEventBySlug(slug)
  if (!event || event.dataSoloAnno) return new Response("Evento non trovato", { status: 404 })

  return new Response(buildIcs(event, siteUrl), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
    },
  })
}
