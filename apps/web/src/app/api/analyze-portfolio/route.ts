import { NextRequest, NextResponse } from 'next/server'
import { generatePortfolioInsights } from '@/lib/ai-analysis'

export async function POST(request: NextRequest) {
  try {
    const { assets } = await request.json()

    if (!assets || !Array.isArray(assets)) {
      return NextResponse.json(
        { error: 'Invalid request: assets array required' },
        { status: 400 }
      )
    }

    // Generate portfolio insights using free Hugging Face LLM
    const insights = await generatePortfolioInsights(assets)

    return NextResponse.json({
      success: true,
      insights,
      model: 'Meta Llama 3.1 70B Instruct (Free)',
      provider: 'Hugging Face Inference API'
    })
  } catch (error) {
    console.error('Error analyzing portfolio:', error)
    return NextResponse.json(
      { error: 'Failed to analyze portfolio' },
      { status: 500 }
    )
  }
}
