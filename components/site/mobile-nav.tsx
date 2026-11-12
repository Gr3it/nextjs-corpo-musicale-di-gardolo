"use client"

import { Menu } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { mainNav } from "@/lib/site"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="-mr-2 inline-flex size-11 items-center justify-center text-white hover:bg-white/10 lg:hidden"
        aria-label="Apri il menu"
      >
        <Menu className="size-6" />
      </SheetTrigger>
      <SheetContent side="right" className="w-80 border-l-0 bg-brand text-white">
        <SheetHeader>
          <SheetTitle className="eyebrow text-white/70">Menu</SheetTitle>
        </SheetHeader>
        <nav aria-label="Menu principale" className="px-4">
          <ul className="flex flex-col">
            {[{ href: "/", label: "Home" }, ...mainNav].map((item) => (
              <li key={item.href} className="border-b border-white/15">
                <Link href={item.href} onClick={() => setOpen(false)} className="block py-3.5 font-heading text-2xl">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
