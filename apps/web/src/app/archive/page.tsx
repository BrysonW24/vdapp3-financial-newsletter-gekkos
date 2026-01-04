import Link from 'next/link'
import Header from '@/components/newsletter/Header'
import Footer from '@/components/newsletter/Footer'
import NewsletterLayout from '@/components/newsletter/NewsletterLayout'
import BackToTop from '@/components/education/BackToTop'

export default function ArchivePage() {
  // Mock data - will be replaced with real database queries
  const editions = [
    { date: '2024-01-15', summary: 'ASX hits new highs, RBA holds rates steady' },
    { date: '2024-01-14', summary: 'Tech sector rallies, Bitcoin breaks $67K' },
    { date: '2024-01-13', summary: 'Property market shows resilience despite rate pressures' },
    { date: '2024-01-12', summary: 'Banking sector leads market gains, CBA announces dividend' },
    { date: '2024-01-11', summary: 'US Fed signals potential rate cuts, markets respond positively' },
    { date: '2024-01-10', summary: 'Crypto markets surge, Ethereum upgrade confirmed' },
    { date: '2024-01-09', summary: 'Economic data suggests soft landing possible' },
    { date: '2024-01-08', summary: 'ASX 200 gains 1.2%, materials sector outperforms' },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <NewsletterLayout>
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
            Newsletter Archive
          </h1>
          <p className="text-lg text-slate-600">
            Browse past editions of Gekkos
          </p>
        </div>

        <div className="space-y-4">
          {editions.map((edition) => (
            <Link
              key={edition.date}
              href={`/archive/${edition.date}`}
              className="block section-card hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">📅</span>
                    <h3 className="text-xl font-bold text-slate-900">
                      {formatDate(edition.date)}
                    </h3>
                  </div>
                  <p className="text-slate-600 ml-11">{edition.summary}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center gap-1 text-gecko-600 font-medium">
                    Read →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <button className="btn-primary">
            Load More Editions
          </button>
        </div>
      </div>

      <Footer />
      <BackToTop />
    </NewsletterLayout>
  )
}
