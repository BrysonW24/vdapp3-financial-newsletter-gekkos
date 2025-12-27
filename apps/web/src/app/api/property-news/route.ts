import { NextResponse } from 'next/server'
import { fetchPropertyNews } from '@/lib/services/news-data'

export async function GET() {
  try {
    const news = await fetchPropertyNews()

    return NextResponse.json({
      success: true,
      data: news,
    })
  } catch (error) {
    console.error('Property news API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch property news',
      },
      { status: 500 }
    )
  }
}
