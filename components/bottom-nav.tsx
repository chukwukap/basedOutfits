"use client"

import { Home, Plus, Archive } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface BottomNavProps {
  scrollDirection?: "up" | "down"
  isScrolled?: boolean
}

export function BottomNav({ scrollDirection = "up", isScrolled = false }: BottomNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/",
      icon: Home,
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/post",
      icon: Plus,
      label: "Post",
      active: pathname === "/post",
    },
    {
      href: "/closet",
      icon: Archive,
      label: "Closet",
      active: pathname === "/closet",
    },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-background border-t transition-transform duration-300 ease-out"
      style={{
        transform: `translateY(${scrollDirection === "down" && isScrolled ? "85%" : "0%"})`,
      }}
    >
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-lg transition-colors",
                item.active ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
