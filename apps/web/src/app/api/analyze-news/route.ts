import { NextRequest, NextResponse } from 'next/server'
import { analyzeMarketNewsWithAI } from '@/lib/ai-analysis'

export async function POST(request: NextRequest) {
  try {
    const { articles } = await request.json()

    if (!articles || !Array.isArray(articles)) {
      return NextResponse.json(
        { error: 'Invalid request: articles array required' },
        { status: 400 }
      )
    }

    // Analyze the news articles using free Hugging Face LLM
    const analysis = await analyzeMarketNewsWithAI(articles)

    return NextResponse.json({
      success: true,
      analysis,
      model: 'Meta Llama 3.1 70B Instruct (Free)',
      provider: 'Hugging Face Inference API'
    })
  } catch (error) {
    console.error('Error analyzing news:', error)
    return NextResponse.json(
      { error: 'Failed to analyze news articles' },
      { status: 500 }
    )
  }
}
