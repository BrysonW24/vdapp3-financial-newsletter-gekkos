import { NextResponse } from 'next/server'
import { fetchTopMovers } from '@/lib/services/stock-movers'

export async function GET() {
  try {
    const movers = await fetchTopMovers()

    return NextResponse.json({
      success: true,
      data: movers,
    })
  } catch (error) {
    console.error('Stock movers API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch stock movers',
      },
      { status: 500 }
    )
  }
}
