// Shared TypeScript types for Gekkos

// Newsletter types
export interface Newsletter {
  id: string
  date: string
  sections: NewsletterSection[]
}

export interface NewsletterSection {
  type: 'trading' | 'property' | 'stocks' | 'crypto' | 'economy' | 'technology' | 'knowledge' | 'entertainment' | 'graphic' | 'quote'
  data: any
}

// Market data types
export interface MarketIndex {
  name: string
  code: string
  value: number
  change: number
  changePercent: number
  flag: string
}

export interface Stock {
  name: string
  code: string
  price: number
  change: number
  changePercent: number
}

// Article types
export interface Article {
  title: string
  source: string
  url: string
  summary?: string
  publishedAt?: string
}

// More types will be added as needed
