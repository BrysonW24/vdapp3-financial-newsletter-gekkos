import { NextResponse } from 'next/server'
import { fetchFinancialNews } from '@/lib/services/news-data'

export async function GET() {
  try {
    const news = await fetchFinancialNews()

    return NextResponse.json({
      success: true,
      data: news,
    })
  } catch (error) {
    console.error('News API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch news data',
      },
      { status: 500 }
    )
  }
}
