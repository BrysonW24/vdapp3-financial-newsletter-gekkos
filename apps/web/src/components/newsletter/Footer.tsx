import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-financial text-white mt-20">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🦎</span>
              <h3 className="text-xl font-display font-bold">Gekkos</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Your trusted source for daily financial news, market analysis, and knowledge.
              Curated with care for the Australian finance community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-slate-300 hover:text-white transition-colors">
                  Today's Edition
                </Link>
              </li>
              <li>
                <Link href="/archive" className="text-slate-300 hover:text-white transition-colors">
                  Newsletter Archive
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#trading" className="text-slate-300 hover:text-white transition-colors">
                  Back to Top
                </a>
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Important Notice</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              This newsletter is for informational purposes only and does not constitute financial advice.
              Always consult with a qualified financial advisor before making investment decisions.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-300">
            <p>© {currentYear} Gekkos. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
