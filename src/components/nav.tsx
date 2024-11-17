"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { Menu, FolderOpen, BookOpen, PlusCircle, Zap, Settings } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Nav() {
  const menuItems = [
    { href: "/groups", label: "Groups", icon: <FolderOpen className="h-5 w-5" /> },
    { href: "/study", label: "Study", icon: <BookOpen className="h-5 w-5" /> },
    { href: "/manage", label: "Manage", icon: <Settings className="h-5 w-5" /> },
    { href: "/create", label: "Create", icon: <PlusCircle className="h-5 w-5" /> },
  ]

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Zap className="h-5 w-5" />
          Flashy
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          {menuItems.map((item, index) => (
            <Button
              key={item.href}
              asChild
              variant={index === menuItems.length - 1 ? "default" : "ghost"}
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
          <ThemeToggle />
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 px-4 py-2 text-lg font-medium transition-colors hover:text-primary rounded-md hover:bg-muted"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
} 