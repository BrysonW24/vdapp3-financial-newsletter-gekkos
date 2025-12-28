import type { Metadata } from 'next'
import { Inter, Outfit, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Gekkos - Your Daily Finance Digest",
  description: 'Your automated daily digest of finance, markets, and knowledge. Covering ASX, global markets, crypto, property, and economic news.',
  keywords: ['finance', 'news', 'ASX', 'markets', 'cryptocurrency', 'property', 'economy', 'newsletter'],
  authors: [{ name: "Gekkos" }],
  openGraph: {
    title: "Gekkos",
    description: 'Your Daily Digest of Finance, Markets, and Knowledge',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
