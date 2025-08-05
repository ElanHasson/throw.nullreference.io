import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { GlobalKeyboardShortcuts } from '@/components/global-keyboard-shortcuts'
import { GoogleAnalytics } from '@/components/google-analytics'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: "Throwin' Exceptions",
  description: 'A blog about software development, technology, and life',
  metadataBase: new URL('https://throw.nullreference.io'),
  icons: {
    icon: [
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/icons/apple-touch-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/apple-touch-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/icons/apple-touch-icon-120x120.png', sizes: '120x120', type: 'image/png' },
      { url: '/icons/apple-touch-icon-114x114.png', sizes: '114x114', type: 'image/png' },
      { url: '/icons/apple-touch-icon-76x76.png', sizes: '76x76', type: 'image/png' },
      { url: '/icons/apple-touch-icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/icons/apple-touch-icon-60x60.png', sizes: '60x60', type: 'image/png' },
      { url: '/icons/apple-touch-icon-57x57.png', sizes: '57x57', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "Throwin' Exceptions",
    description: 'A blog about software development, technology, and life',
    url: 'https://throw.nullreference.io',
    siteName: "Throwin' Exceptions",
    images: [
      {
        url: '/images/profile.jpg',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  verification: {
    me: [
      'https://publicsquare.global/@elan',
      'https://hachyderm.io/@elan',
      'https://mastodon.social/@elanhasson',
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetBrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GlobalKeyboardShortcuts />
          <div className="flex min-h-screen flex-col">
            <Header />
            <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
        <GoogleAnalytics />
      </body>
    </html>
  )
}
