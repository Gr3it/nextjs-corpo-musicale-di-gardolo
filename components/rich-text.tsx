import { PortableText, type PortableTextComponents } from "next-sanity"

import type { RichText as RichTextValue, SanityImage as SanityImageType } from "@/lib/content"
import { cn } from "@/lib/utils"

import { SanityImage } from "./sanity-image"

const components: PortableTextComponents = {
  types: {
    imageWithCaption: ({ value }: { value: SanityImageType }) =>
      value?.asset ? (
        <figure className="my-8">
          <SanityImage image={value} sizes="(min-width: 768px) 720px, 100vw" className="h-auto w-full" />
          {value.didascalia && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">{value.didascalia}</figcaption>
          )}
        </figure>
      ) : null,
  },
  marks: {
    link: ({ value, children }) => {
      const href: string = value?.href ?? "#"
      const external = /^https?:\/\//.test(href)
      return (
        <a
          href={href}
          className="font-semibold text-brand underline underline-offset-4"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      )
    },
  },
  block: {
    h2: ({ children }) => <h2 className="mt-12 mb-4 text-3xl font-semibold tracking-tight">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 mb-3 text-xl font-semibold">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-brand pl-6 font-heading text-2xl italic">{children}</blockquote>
    ),
    normal: ({ children }) => <p className="my-4 leading-relaxed">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="my-4 list-disc space-y-1 pl-6">{children}</ul>,
    number: ({ children }) => <ol className="my-4 list-decimal space-y-1 pl-6">{children}</ol>,
  },
}

export function RichText({ value, className }: { value?: RichTextValue; className?: string }) {
  if (!value?.length) return null
  return (
    <div className={cn("max-w-prose text-[1.0625rem]", className)}>
      <PortableText value={value} components={components} />
    </div>
  )
}
