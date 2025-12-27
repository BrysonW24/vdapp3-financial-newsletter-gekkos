import { NextResponse } from 'next/server'
import {
  fetchWithTimeout,
  isRetryableError,
} from '@/lib/utils/fetch-utils'
import { quoteCache } from '@/lib/utils/cache-utils'

// Fallback hardcoded quotes for error scenarios
const fallbackQuotes = [
  {
    text: 'Innovation distinguishes between a leader and a follower.',
    author: 'Steve Jobs',
    title: 'Co-founder of Apple Inc.',
    context: 'This powerful statement reminds us that true progress comes from pushing boundaries and thinking differently. In both business and technology, those who embrace innovation lead the way forward.',
    category: 'Innovation',
    source: 'Fallback'
  },
  {
    text: 'The best way to predict the future is to create it.',
    author: 'Peter Drucker',
    title: 'Management Consultant',
    context: 'Rather than waiting for opportunities, successful people actively shape their own destiny through proactive planning and execution.',
    category: 'Strategy',
    source: 'Fallback'
  },
  {
    text: 'Success is not final, failure is not fatal: It is the courage to continue that counts.',
    author: 'Winston Churchill',
    title: 'Prime Minister of the United Kingdom',
    context: 'Resilience and perseverance are the true markers of long-term success, not short-term victories or setbacks.',
    category: 'Resilience',
    source: 'Fallback'
  },
  {
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    title: 'Co-founder of Apple Inc.',
    context: 'Passion drives excellence. When you love your work, quality and innovation follow naturally.',
    category: 'Work',
    source: 'Fallback'
  },
  {
    text: 'Your most unhappy customers are your greatest source of learning.',
    author: 'Bill Gates',
    title: 'Co-founder of Microsoft',
    context: 'Customer feedback, even when negative, provides invaluable insights for improvement and growth.',
    category: 'Customer Service',
    source: 'Fallback'
  }
];

interface Quote {
  text: string;
  author: string;
  title: string;
  context: string;
  category: string;
  source?: string;
}

async function generateQuoteWithLLM(): Promise<Quote | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.warn('ANTHROPIC_API_KEY not set, will use fallback quotes')
    return null
  }

  try {
    const response = await fetchWithTimeout(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: `Generate a unique, inspirational quote about business, technology, entrepreneurship, or innovation.

Format your response as valid JSON (only the JSON, no markdown or additional text):
{
  "text": "the quote text",
  "author": "author name",
  "title": "author's role or title",
  "context": "2-3 sentences explaining why this quote matters for business/technology",
  "category": "category name like Innovation, Leadership, Strategy, Resilience, etc"
}

Make sure:
- The quote is original and unique
- It's truly inspirational and relevant to business/tech/life
- The context explains practical value
- All text is properly escaped for JSON`,
            },
          ],
        }),
      },
      10000 // 10s timeout for LLM
    )

    if (isRetryableError(response)) {
      console.warn(`Anthropic API error: ${response.status} ${response.statusText}`)
      return null
    }

    if (!response.ok) {
      console.error('Anthropic API error:', response.statusText)
      return null
    }

    const data = await response.json()
    const content = data.content[0]?.text

    if (!content) {
      console.error('No content in Anthropic response')
      return null
    }

    // Parse the JSON from the response
    const quote = JSON.parse(content)
    quote.source = 'Claude AI Generated'
    return quote as Quote
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error generating quote with LLM:', error.message)
    } else {
      console.error('Error generating quote with LLM:', error)
    }
    return null
  }
}


export async function GET() {
  try {
    // Use unified caching layer
    // This will automatically handle cache expiration at midnight
    const quote = await quoteCache.get('daily-quote', async () => {
      // Try to generate a new quote with LLM
      const generatedQuote = await generateQuoteWithLLM();

      if (generatedQuote) {
        return generatedQuote;
      }

      // Fallback to rotating hardcoded quotes if LLM fails
      console.log('LLM generation failed, using fallback quotes');
      const today = new Date();
      const startOfYear = new Date(today.getFullYear(), 0, 0);
      const dayOfYear = Math.floor(
        (today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
      );
      const quoteIndex = dayOfYear % fallbackQuotes.length;

      return fallbackQuotes[quoteIndex];
    });

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Quote fetch error:', error);
    // Return first fallback quote on any error
    return NextResponse.json(fallbackQuotes[0]);
  }
}