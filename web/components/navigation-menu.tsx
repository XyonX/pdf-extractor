"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, List } from "lucide-react"
import Link from "next/link"

interface NavigationMenuProps {
  currentPage: "home" | "list" | "review" | "edit"
}

export function NavigationMenu({ currentPage }: NavigationMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="p-2">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64 p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center p-4 border-b border-border">
            <div className="text-sm font-mono font-light tracking-wider text-foreground">
              <span className="text-black">PDF</span>
              <span className="text-muted-foreground mx-1">|</span>
              <span className="font-extralight">EXTRACTOR</span>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <div className="space-y-2">
              <Link href="/" onClick={() => setIsOpen(false)}>
                <Button
                  variant={currentPage === "home" ? "default" : "ghost"}
                  className="w-full justify-start gap-3 h-12"
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Button>
              </Link>
              <Link href="/invoices" onClick={() => setIsOpen(false)}>
                <Button
                  variant={currentPage === "list" ? "default" : "ghost"}
                  className="w-full justify-start gap-3 h-12"
                >
                  <List className="h-4 w-4" />
                  <span>Invoice List</span>
                </Button>
              </Link>
            </div>
          </nav>

          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground text-center">Frontend Demo</div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default NavigationMenu
