import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Copyright © 2020-{currentYear} Elan Hasson. All Rights Reserved.
          </p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <Link href="/search" className="hover:text-foreground">
            Search
          </Link>
          <Link href="/offline" className="hover:text-foreground">
            Offline
          </Link>
          <a 
            href="https://github.com/ElanHasson/throw.nullreference.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}