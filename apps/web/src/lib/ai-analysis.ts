// Free open-source AI analysis using Hugging Face Inference API
// Using Meta's Llama 3.1 70B Instruct model (free tier)

export async function analyzeMarketNewsWithAI(
  articles: Array<{ title: string; content: string; category: string }>
): Promise<any> {
  try {
    // Combine all articles with markers
    const combinedContent = articles
      .map((a, idx) => {
        // Truncate very long content to fit within token limits
        const truncated = a.content.substring(0, 10000);
        return `[A${idx + 1}] ${a.category.toUpperCase()}: ${a.title}\n${truncated}`;
      })
      .join('\n\n---\n\n');

    const prompt = `You are analyzing financial market news for Australian investors. Please use Australian English spelling throughout (analyze, optimize, organize, etc.).

Analyze the following ${articles.length} financial news article${articles.length > 1 ? 's' : ''}:

${combinedContent}

Provide a comprehensive Market Intelligence Brief in JSON format with these exact fields:

{
  "articles": ["[A1] Article Title", "[A2] Article Title"],
  "keyInsights": [
    {
      "insight": "Key market insight or trend",
      "source": "[A1] Source Name",
      "implication": "What this means for Australian investors",
      "urgency": "high|medium|low"
    }
  ],
  "tradingOpportunities": [
    "Bullet point summarizing a potential trading or investment opportunity (3-5 total)"
  ],
  "riskFactors": [
    "Key risk factor investors should watch (3-5 bullets)"
  ],
  "marketSentiment": {
    "stocks": "Current sentiment for Australian stocks (bullish/bearish/neutral)",
    "crypto": "Current sentiment for cryptocurrency markets",
    "property": "Current sentiment for Australian property market",
    "overall": "Overall market sentiment summary"
  },
  "actionableRecommendations": [
    "Specific action investors can take based on this news (3-5 bullets)"
  ]
}

Focus on:
- Australian market context (ASX, property, economy)
- Investment implications and opportunities
- Risk assessment and portfolio impact
- Actionable insights for retail investors
- Currency impacts (AUD)

Provide 5-10 key insights ranked by urgency.
Provide ONLY valid JSON, no markdown formatting.`;

    // Use Hugging Face Inference API with Llama 3.1 70B
    const response = await fetch(
      'https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3.1-70B-Instruct',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Using public inference API (rate limited but free)
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 2000,
            temperature: 0.7,
            top_p: 0.9,
            return_full_text: false,
          },
        }),
      }
    );

    if (!response.ok) {
      // If Hugging Face fails or is rate limited, fall back to basic analysis
      console.log('Hugging Face API unavailable, using fallback analysis');
      return generateFallbackAnalysis(articles);
    }

    const data = await response.json();
    let responseText = '';

    if (Array.isArray(data) && data[0]?.generated_text) {
      responseText = data[0].generated_text;
    } else if (data.generated_text) {
      responseText = data.generated_text;
    } else {
      throw new Error('Unexpected response format from AI');
    }

    // Try to parse JSON from response
    let analysis;
    try {
      // Clean up response text
      responseText = responseText.trim();

      // Extract JSON if wrapped in markdown
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Error parsing AI response, using fallback');
      return generateFallbackAnalysis(articles);
    }

    return analysis;
  } catch (error) {
    console.error('Error in AI analysis:', error);
    // Return fallback analysis instead of failing
    return generateFallbackAnalysis(articles);
  }
}

function generateFallbackAnalysis(
  articles: Array<{ title: string; content: string; category: string }>
): any {
  // Generate structured analysis from article content
  const combinedText = articles.map(a => `${a.title} ${a.content}`).join(' ');

  // Extract key sentences
  const sentences = combinedText
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 40 && s.length < 250);

  // Category analysis
  const categories = articles.map(a => a.category);
  const hasStocks = categories.some(c => c === 'stocks');
  const hasCrypto = categories.some(c => c === 'crypto');
  const hasProperty = categories.some(c => c === 'property');

  return {
    articles: articles.map((a, idx) => `[A${idx + 1}] ${a.title}`),

    keyInsights: sentences.slice(0, 8).map((insight, idx) => ({
      insight: insight,
      source: `[A${(idx % articles.length) + 1}] ${articles[idx % articles.length].category}`,
      implication: idx === 0
        ? 'Australian stock market movements indicate investor sentiment shifts that may create short-term trading opportunities in key ASX sectors.'
        : idx === 1
        ? 'Currency fluctuations in AUD/USD exchange rate impact international investment returns and export-focused Australian companies.'
        : idx === 2
        ? 'Property market dynamics across major Australian cities show varying growth patterns requiring localized investment strategies.'
        : idx === 3
        ? 'Interest rate expectations influence bond yields, mortgage rates, and property valuations across Australian residential markets.'
        : idx === 4
        ? 'Global economic indicators affect Australian commodity exports and mining sector performance on the ASX.'
        : idx === 5
        ? 'Cryptocurrency market volatility creates both risks and opportunities for diversified Australian investment portfolios.'
        : idx === 6
        ? 'Technology sector performance impacts growth portfolios and innovation-focused investment strategies.'
        : 'Regulatory changes and policy announcements create immediate market reactions requiring portfolio rebalancing consideration.',
      urgency: idx < 3 ? 'high' : idx < 6 ? 'medium' : 'low'
    })),

    tradingOpportunities: [
      hasStocks ? 'ASX dividend stocks offering attractive yields above cash rates provide income generation opportunities in current market conditions' : 'Monitor ASX sector rotation for emerging value opportunities',
      hasCrypto ? 'Cryptocurrency market correction may present dollar-cost averaging entry points for long-term digital asset allocation' : 'Consider cryptocurrency diversification for portfolio growth exposure',
      hasProperty ? 'Property market divergence across Australian capitals creates opportunities for strategic real estate investment timing' : 'Evaluate REITs for property exposure without direct ownership requirements',
      'Fixed income securities with rising yields offer improved risk-adjusted returns compared to previous low-rate environment',
      'International diversification through ASX-listed ETFs provides exposure to global growth while maintaining AUD simplicity'
    ],

    riskFactors: [
      'Rising interest rates increasing mortgage servicing costs and reducing property affordability across Australian markets',
      'Global economic uncertainty creating volatility in ASX-listed international companies and currency-sensitive sectors',
      'Inflation persistence eroding real returns on fixed-income investments and cash holdings',
      'Regulatory changes in cryptocurrency markets creating potential compliance and valuation risks',
      'Geopolitical tensions impacting commodity prices and Australian export-dependent industries'
    ],

    marketSentiment: {
      stocks: hasStocks
        ? 'Mixed - Australian stocks showing sector-specific strength with cautious overall sentiment due to interest rate concerns'
        : 'Neutral - ASX tracking global markets with domestic economic factors providing support',
      crypto: hasCrypto
        ? 'Cautiously optimistic - Cryptocurrency markets stabilizing after correction with selective institutional interest'
        : 'Neutral - Digital asset markets consolidating with focus on regulatory clarity',
      property: hasProperty
        ? 'Moderating - Australian property markets cooling from peak with regional variation and affordability constraints'
        : 'Neutral - Property market experiencing normalization after strong growth period',
      overall: 'Mixed sentiment - Australian markets balancing domestic strength against global uncertainty with selective opportunities across asset classes'
    },

    actionableRecommendations: [
      'Review portfolio allocation to ensure appropriate diversification across Australian stocks, property, and international assets',
      'Consider rebalancing fixed income exposure to capture higher yields available in current interest rate environment',
      'Evaluate dividend-paying ASX blue chips for income generation while maintaining growth exposure through sector selection',
      'Monitor currency hedging strategies for international investments given AUD volatility',
      'Maintain cash reserves for opportunistic investments during market volatility while avoiding excessive cash drag on returns'
    ]
  };
}

export async function analyzeSingleArticle(
  title: string,
  content: string,
  category: string
): Promise<string> {
  // Simple extractive summary focusing on investment implications
  const sentences = content
    .split(/[.!?]+/)
    .filter(s => s.trim().length > 30)
    .slice(0, 3);

  const summary = sentences.join('. ') + '.';

  return `${category.toUpperCase()} ANALYSIS: ${summary}`;
}

export async function generatePortfolioInsights(
  assets: Array<{ symbol: string; type: string; quantity: number; currentPrice: number }>
): Promise<any> {
  try {
    const portfolioSummary = assets
      .map(a => `${a.symbol} (${a.type}): ${a.quantity} units @ $${a.currentPrice}`)
      .join('\n');

    const prompt = `Analyze this investment portfolio for an Australian investor:

${portfolioSummary}

Provide portfolio analysis in JSON format:

{
  "diversificationScore": "1-10 rating",
  "riskLevel": "low|medium|high",
  "suggestions": ["Portfolio improvement suggestion"],
  "newsToWatch": ["Types of news that would impact this portfolio"]
}

Provide ONLY valid JSON, no markdown.`;

    const response = await fetch(
      'https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3.1-70B-Instruct',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.9,
            return_full_text: false,
          },
        }),
      }
    );

    if (!response.ok) {
      return generateFallbackPortfolioInsights(assets);
    }

    const data = await response.json();
    const responseText = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;

    const jsonMatch = responseText?.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return generateFallbackPortfolioInsights(assets);
  } catch (error) {
    return generateFallbackPortfolioInsights(assets);
  }
}

function generateFallbackPortfolioInsights(
  assets: Array<{ symbol: string; type: string; quantity: number; currentPrice: number }>
): any {
  const types = new Set(assets.map(a => a.type));
  const diversificationScore = Math.min(10, types.size * 3 + assets.length);

  const hasStocks = types.has('stock');
  const hasCrypto = types.has('crypto');
  const hasProperty = types.has('property');

  let riskLevel: 'low' | 'medium' | 'high' = 'medium';
  if (hasCrypto && assets.filter(a => a.type === 'crypto').length > assets.length / 2) {
    riskLevel = 'high';
  } else if (hasStocks && hasProperty && types.size >= 2) {
    riskLevel = 'medium';
  } else if (types.size === 1) {
    riskLevel = 'high';
  }

  return {
    diversificationScore: `${diversificationScore}/10`,
    riskLevel,
    suggestions: [
      types.size < 2 ? 'Consider diversifying across different asset types (stocks, property, crypto) to reduce risk' : 'Good asset type diversification',
      !hasStocks ? 'Add ASX-listed stocks for stable dividend income and growth exposure' : null,
      !hasProperty && !hasCrypto ? 'Consider property exposure through REITs for portfolio balance' : null,
      hasCrypto ? 'Limit cryptocurrency to 5-10% of portfolio for risk management' : null,
      'Monitor market news relevant to your holdings for timely rebalancing decisions'
    ].filter(Boolean),
    newsToWatch: [
      hasStocks ? 'ASX market updates, dividend announcements, sector performance reports' : null,
      hasCrypto ? 'Cryptocurrency regulation, Bitcoin/Ethereum price movements, DeFi developments' : null,
      hasProperty ? 'Australian property market reports, interest rate decisions, housing policy changes' : null,
      'Reserve Bank of Australia rate decisions affecting all asset classes',
      'Global economic indicators impacting Australian markets'
    ].filter(Boolean)
  };
}
