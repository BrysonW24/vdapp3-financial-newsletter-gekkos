import { NextResponse } from 'next/server'
import { fetchCryptoNews } from '@/lib/services/news-data'

export async function GET() {
  try {
    const news = await fetchCryptoNews()

    return NextResponse.json({
      success: true,
      data: news,
    })
  } catch (error) {
    console.error('Crypto news API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch crypto news',
      },
      { status: 500 }
    )
  }
}
