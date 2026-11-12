import type { ReactNode, SVGProps } from "react"

import type { SocialAccounts, SocialPlatform } from "@/lib/content"
import { cn } from "@/lib/utils"

/** Icone a tratto 2px, nello stile di lucide (che non include più i loghi dei brand). */
function StrokeIcon({ children, ...props }: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

const platforms: { id: SocialPlatform; label: string; icon: (p: SVGProps<SVGSVGElement>) => ReactNode }[] = [
  {
    id: "facebook",
    label: "Facebook",
    icon: (p) => (
      <StrokeIcon {...p}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </StrokeIcon>
    ),
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: (p) => (
      <StrokeIcon {...p}>
        <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" />
      </StrokeIcon>
    ),
  },
  {
    id: "youtube",
    label: "YouTube",
    icon: (p) => (
      <StrokeIcon {...p}>
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <path d="m10 15 5-3-5-3z" />
      </StrokeIcon>
    ),
  },
  {
    id: "tiktok",
    label: "TikTok",
    icon: (p) => (
      <StrokeIcon {...p}>
        <path d="M9 11.5a4.5 4.5 0 1 0 4.5 4.5V2.5a5.5 5.5 0 0 0 5.5 5.5" />
      </StrokeIcon>
    ),
  },
]

/** Mostra solo le piattaforme che hanno un link nel CMS, sempre nello stesso ordine. */
export function SocialLinks({
  social,
  className,
  showLabels = false,
}: {
  social: SocialAccounts
  className?: string
  showLabels?: boolean
}) {
  const active = platforms.filter((p) => social[p.id])
  if (active.length === 0) return null
  return (
    <ul className={cn("flex flex-wrap items-center", showLabels ? "gap-x-6 gap-y-3" : "gap-1", className)}>
      {active.map(({ id, label, icon: Icon }) => (
        <li key={id}>
          <a
            href={social[id]}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 transition-opacity hover:opacity-70",
              showLabels ? "py-1 font-semibold underline-offset-4 hover:underline" : "p-2",
            )}
          >
            <Icon className="size-5" />
            {showLabels ? label : <span className="sr-only">{label}</span>}
          </a>
        </li>
      ))}
    </ul>
  )
}
