import Link from 'next/link'
import { GitHubIcon, MastodonIcon, LinkedInIcon, StackOverflowIcon, YouTubeIcon } from './icons'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:px-8 lg:py-20">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="mb-4 bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-lg font-bold text-transparent">
              Throwin&apos; Exceptions
            </h3>
            <p className="mb-6 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">
              A blog about software development, technology, and the beautiful chaos of debugging
              life.
            </p>
            <div className="flex space-x-5">
              <a
                href="https://github.com/ElanHasson"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400"
                aria-label="GitHub"
              >
                <GitHubIcon />
              </a>
              <a
                href="https://publicsquare.global/@elan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400"
                aria-label="Mastodon"
              >
                <MastodonIcon />
              </a>
              <a
                href="https://linkedin.com/in/ElanHasson"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
              <a
                href="https://stackoverflow.com/users/103302/elan-hasson"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400"
                aria-label="Stack Overflow"
              >
                <StackOverflowIcon />
              </a>
              <a
                href="https://www.youtube.com/channel/ElanHasson"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400"
                aria-label="YouTube"
              >
                <YouTubeIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/blog"
                  className="text-gray-600 transition-colors hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/series"
                  className="text-gray-600 transition-colors hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400"
                >
                  Series
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-gray-600 transition-colors hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/topics"
                  className="text-gray-600 transition-colors hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400"
                >
                  Topics
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-gray-600 transition-colors hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400"
                >
                  Search
                </Link>
              </li>
              <li>
                <Link
                  href="/archive"
                  className="text-gray-600 transition-colors hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400"
                >
                  Archive
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://github.com/ElanHasson/throw.nullreference.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 transition-colors hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400"
                >
                  View Source
                </a>
              </li>
              <li>
                <Link
                  href="/index.xml"
                  className="text-gray-600 transition-colors hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400"
                >
                  RSS Feed
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-6 border-t border-gray-200 pt-10 md:flex-row dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2014-{currentYear} Elan Hasson. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Built with Next.js, MDX, and ❤️
            </p>
            <a
              href="https://www.digitalocean.com/?refcode=0759a4937a7a&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://web-platforms.sfo2.digitaloceanspaces.com/WWW/Badge%203.svg"
                alt="DigitalOcean Referral Badge"
                className="h-10"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}