import { NextResponse } from 'next/server'
import { fetchTechNews } from '@/lib/services/news-data'

export async function GET() {
  try {
    const news = await fetchTechNews()

    return NextResponse.json({
      success: true,
      data: news,
    })
  } catch (error) {
    console.error('Tech news API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tech news',
      },
      { status: 500 }
    )
  }
}
