import { Metadata } from 'next'
import EducationNav from '@/components/education/EducationNav'

export const metadata: Metadata = {
  title: 'Education Hub | Gekkos Financial Education',
  description: 'Learn finance fundamentals, economic indicators, stock selection, and investment strategies. Free comprehensive financial education for investors.',
  keywords: ['financial education', 'investing', 'economic indicators', 'stock selection', 'investment strategies', 'finance learning', 'market education'],
  openGraph: {
    title: 'Gekkos Education Hub',
    description: 'Free financial education for investors - Learn the fundamentals of finance, markets, and investing',
    type: 'website',
  },
}

export default function EducationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <EducationNav />
      {children}
    </>
  )
}
