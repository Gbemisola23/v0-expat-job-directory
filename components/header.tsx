import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="ExpatLinkUp" width={369} height={80} className="h-[80px] w-auto" priority />
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              Browse Jobs
            </Button>
          </Link>
          <Link href="/post">
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Post a Job
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              Admin
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
