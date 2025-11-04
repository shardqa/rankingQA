import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QA Influencers Ranking - Top Quality Assurance Professionals',
  description: 'Discover and follow the most influential QA professionals worldwide based on LinkedIn followers and community impact.',
  keywords: ['QA', 'Quality Assurance', 'Testing', 'LinkedIn', 'Influencers', 'Ranking'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
