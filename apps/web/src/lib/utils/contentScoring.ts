/**
 * Content Relevance Scoring System
 *
 * Provides algorithms to score and rank articles, IPOs, and other content
 * based on relevance, recency, source authority, and engagement signals.
 */

export interface Article {
  title: string;
  source: string;
  url: string;
  description?: string;
  publishedAt?: string;
  imageUrl?: string;
}

export interface ScoredArticle extends Article {
  relevanceScore: number;
  authorityScore: number;
  recencyScore: number;
  finalScore: number;
}

export interface IPO {
  companyName: string;
  symbol: string;
  sector: string;
  expectedDate: string;
  marketCap: string;
  [key: string]: any;
}

export interface ScoredIPO extends IPO {
  relevanceScore: number;
  attractivenessScore: number;
  finalScore: number;
}

/**
 * Source Authority Weights
 * Higher weight = more authoritative source
 */
const SOURCE_AUTHORITY: Record<string, number> = {
  'Reuters': 0.95,
  'AP': 0.95,
  'Bloomberg': 0.90,
  'Financial Times': 0.90,
  'Wall Street Journal': 0.90,
  'CNBC': 0.85,
  'MarketWatch': 0.80,
  'CoinDesk': 0.85,
  'TechCrunch': 0.85,
  'The Verge': 0.80,
  'Axios': 0.80,
  'Seeking Alpha': 0.75,
  'Yahoo Finance': 0.75,
  'Investopedia': 0.70,
};

/**
 * Topic Keywords for Relevance Scoring
 * Map of sector/topic to relevant keywords
 */
const TOPIC_KEYWORDS: Record<string, string[]> = {
  'technology': [
    'AI', 'machine learning', 'software', 'cloud', 'cybersecurity',
    'blockchain', 'web3', 'SaaS', 'developer', 'tech',
    'startup', 'innovation', 'digital', 'platform'
  ],
  'finance': [
    'banking', 'fintech', 'cryptocurrency', 'trading', 'investment',
    'stocks', 'bonds', 'ETF', 'portfolio', 'wealth', 'payment'
  ],
  'clean-energy': [
    'renewable', 'solar', 'wind', 'battery', 'electric',
    'sustainable', 'carbon', 'emission', 'climate', 'green',
    'energy transition', 'ESG'
  ],
  'healthcare': [
    'biotech', 'pharmaceutical', 'medical', 'drug', 'healthcare',
    'hospital', 'clinical', 'disease', 'treatment', 'FDA'
  ],
  'entertainment': [
    'movie', 'streaming', 'music', 'gaming', 'entertainment',
    'media', 'production', 'content', 'platform'
  ],
  'property': [
    'real estate', 'property', 'housing', 'real-estate', 'realestate',
    'apartment', 'residential', 'commercial', 'development'
  ],
};

/**
 * Interesting/Hot Sectors
 * These sectors get a boost in relevance scoring
 */
const HOT_SECTORS = [
  'Artificial Intelligence',
  'Biotechnology',
  'Clean Energy',
  'Cybersecurity',
  'Cloud Computing',
  'Renewable Energy',
  'Healthcare Technology',
];

/**
 * Get source authority score (0-1)
 */
function getSourceAuthorityScore(source: string): number {
  // Check exact match first
  if (source in SOURCE_AUTHORITY) {
    return SOURCE_AUTHORITY[source];
  }

  // Check partial matches
  const lowerSource = source.toLowerCase();
  for (const [authoritySource, score] of Object.entries(SOURCE_AUTHORITY)) {
    if (lowerSource.includes(authoritySource.toLowerCase())) {
      return score;
    }
  }

  // Default score for unknown sources
  return 0.50;
}

/**
 * Calculate recency score based on publication date
 * Articles from today get 1.0, older articles decay gradually
 */
function getRecencyScore(publishedAt?: string): number {
  if (!publishedAt) {
    return 0.7; // Default for unknown dates
  }

  try {
    const pubDate = new Date(publishedAt);
    const now = new Date();
    const hoursOld = (now.getTime() - pubDate.getTime()) / (1000 * 60 * 60);

    // Decay function: recent articles score higher
    if (hoursOld < 1) return 1.0;
    if (hoursOld < 4) return 0.95;
    if (hoursOld < 12) return 0.85;
    if (hoursOld < 24) return 0.75;
    if (hoursOld < 48) return 0.60;
    if (hoursOld < 72) return 0.45;

    return 0.30; // Very old articles
  } catch {
    return 0.7;
  }
}

/**
 * Calculate topic relevance score (0-1)
 * Checks if article title/description matches relevant keywords
 */
function getTopicRelevanceScore(
  title: string,
  description?: string,
  context?: string
): number {
  const fullText = `${title} ${description || ''} ${context || ''}`.toLowerCase();

  let maxScore = 0;

  // Check each topic's keywords
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    let topicScore = 0;
    let keywordMatches = 0;

    for (const keyword of keywords) {
      if (fullText.includes(keyword.toLowerCase())) {
        keywordMatches++;
      }
    }

    // Score based on keyword matches (max 3 matches)
    topicScore = Math.min(keywordMatches / 3, 1.0) * 0.8;

    // Boost score if text contains "startup", "innovation", "growth", etc.
    if (fullText.includes('startup') || fullText.includes('growth') ||
        fullText.includes('innovation') || fullText.includes('disrupt')) {
      topicScore += 0.15;
    }

    maxScore = Math.max(maxScore, topicScore);
  }

  return Math.min(maxScore, 1.0);
}

/**
 * Score a single article
 * Weights: Authority (40%), Recency (30%), Relevance (30%)
 */
export function scoreArticle(article: Article): ScoredArticle {
  const authorityScore = getSourceAuthorityScore(article.source);
  const recencyScore = getRecencyScore(article.publishedAt);
  const relevanceScore = getTopicRelevanceScore(
    article.title,
    article.description
  );

  // Weighted scoring
  const finalScore =
    (authorityScore * 0.40) +
    (recencyScore * 0.30) +
    (relevanceScore * 0.30);

  return {
    ...article,
    authorityScore,
    recencyScore,
    relevanceScore,
    finalScore
  };
}

/**
 * Score and sort articles by relevance
 */
export function scoreAndSortArticles(articles: Article[]): ScoredArticle[] {
  return articles
    .map(scoreArticle)
    .sort((a, b) => b.finalScore - a.finalScore);
}

/**
 * Get top N most relevant articles
 */
export function getTopArticles(articles: Article[], count: number = 5): ScoredArticle[] {
  return scoreAndSortArticles(articles).slice(0, count);
}

/**
 * Score IPOs based on attractiveness
 * Factors: Sector interest, Market cap, Upcoming date (soon = more interesting)
 */
export function scoreIPO(ipo: IPO): ScoredIPO {
  // Sector relevance
  let sectorScore = 0.5;
  if (ipo.sector) {
    const ipoSector = ipo.sector.toLowerCase();

    // Check if in hot sectors
    if (HOT_SECTORS.some(s => ipoSector.includes(s.toLowerCase()))) {
      sectorScore = 0.95;
    } else if (ipoSector.includes('technology') || ipoSector.includes('tech')) {
      sectorScore = 0.85;
    } else if (ipoSector.includes('finance') || ipoSector.includes('fintech')) {
      sectorScore = 0.80;
    } else if (ipoSector.includes('healthcare') || ipoSector.includes('health')) {
      sectorScore = 0.75;
    }
  }

  // Market cap attractiveness
  let marketCapScore = 0.5;
  if (ipo.marketCap && ipo.marketCap !== 'TBD') {
    const marketCapStr = ipo.marketCap.toLowerCase();

    // Prefer mid-cap IPOs ($1B-$5B)
    if (marketCapStr.includes('1') || marketCapStr.includes('2') ||
        marketCapStr.includes('3') || marketCapStr.includes('4')) {
      marketCapScore = 0.90;
    } else if (marketCapStr.includes('500m')) {
      marketCapScore = 0.80;
    } else if (marketCapStr.includes('5b') || marketCapStr.includes('10b')) {
      marketCapScore = 0.75;
    }
  }

  // Date proximity score - upcoming IPOs are more interesting
  let dateScore = 0.5;
  if (ipo.expectedDate && ipo.expectedDate !== 'TBD') {
    try {
      const expectedDate = new Date(ipo.expectedDate);
      const now = new Date();
      const daysUntilIPO = (expectedDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

      if (daysUntilIPO < 0) {
        // Already happened
        dateScore = 0.3;
      } else if (daysUntilIPO < 7) {
        // This week - very hot
        dateScore = 0.95;
      } else if (daysUntilIPO < 14) {
        // Next 2 weeks
        dateScore = 0.85;
      } else if (daysUntilIPO < 30) {
        // Within a month
        dateScore = 0.70;
      } else if (daysUntilIPO < 90) {
        // Within 3 months
        dateScore = 0.55;
      }
    } catch {
      dateScore = 0.5;
    }
  }

  // Weighted scoring
  // Sector (40%), Market Cap (30%), Date Proximity (30%)
  const finalScore =
    (sectorScore * 0.40) +
    (marketCapScore * 0.30) +
    (dateScore * 0.30);

  const relevanceScore = sectorScore;
  const attractivenessScore = (marketCapScore * 0.5) + (dateScore * 0.5);

  return {
    ...ipo,
    relevanceScore,
    attractivenessScore,
    finalScore
  };
}

/**
 * Score and sort IPOs by attractiveness
 */
export function scoreAndSortIPOs(ipos: IPO[]): ScoredIPO[] {
  return ipos
    .map(scoreIPO)
    .sort((a, b) => b.finalScore - a.finalScore);
}

/**
 * Get top N most attractive IPOs
 */
export function getTopIPOs(ipos: IPO[], count: number = 3): ScoredIPO[] {
  return scoreAndSortIPOs(ipos).slice(0, count);
}

/**
 * Get articles filtered by sector/topic
 */
export function filterArticlesBySector(articles: Article[], sector: string): Article[] {
  const keywords = TOPIC_KEYWORDS[sector.toLowerCase()] || [];

  return articles.filter(article => {
    const text = `${article.title} ${article.description || ''}`.toLowerCase();
    return keywords.some(keyword => text.includes(keyword.toLowerCase()));
  });
}

/**
 * Content Selection Strategy
 * Returns a curated selection of most relevant content per category
 */
export interface ContentSelection {
  topArticles: ScoredArticle[];
  topIPOs: ScoredIPO[];
  hasRelevantTechNews: boolean;
  hasRelevantFinanceNews: boolean;
  hasHotIPOs: boolean;
}

export function selectBestContent(
  articles: Article[],
  ipos: IPO[]
): ContentSelection {
  const scoredArticles = scoreAndSortArticles(articles);
  const scoredIPOs = scoreAndSortIPOs(ipos);

  // Check if we have high-scoring content
  const topArticles = scoredArticles.slice(0, 5);
  const topIPOs = scoredIPOs.slice(0, 3);

  // Check for hot content
  const hasRelevantTechNews = topArticles.some(a => a.finalScore > 0.7);
  const hasRelevantFinanceNews = topArticles.some(a =>
    a.title.toLowerCase().includes('ipo') ||
    a.title.toLowerCase().includes('market') ||
    a.finalScore > 0.75
  );
  const hasHotIPOs = topIPOs.some(ipo => ipo.finalScore > 0.8);

  return {
    topArticles,
    topIPOs,
    hasRelevantTechNews,
    hasRelevantFinanceNews,
    hasHotIPOs
  };
}
