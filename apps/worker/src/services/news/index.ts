// News fetching service
import axios from 'axios';
import { logger } from '../../utils/logger';
import { NEWS_SOURCES } from '@newsletter/constants';

export interface NewsArticle {
  id: string;
  title: string;
  summary?: string;
  content?: string;
  url: string;
  source: string;
  category: 'property' | 'stocks' | 'crypto' | 'economy' | 'technology';
  imageUrl?: string;
  publishedAt: Date;
  fetchedAt: Date;
}

/**
 * Fetch news from Reuters (Property)
 */
async function fetchPropertyNews(): Promise<NewsArticle[]> {
  try {
    logger.info('Fetching property news...');

    // Mock property news for now
    return [
      {
        id: 'prop-1',
        title: 'Australian Property Market Shows Signs of Stabilization',
        summary: 'Latest data suggests the property market is finding equilibrium after recent rate hikes.',
        url: 'https://example.com/property/stabilization',
        source: NEWS_SOURCES.REUTERS,
        category: 'property',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        fetchedAt: new Date(),
      },
      {
        id: 'prop-2',
        title: 'Sydney Inner West Prices Rebound in Q4',
        summary: 'Premium suburbs see renewed buyer interest as lending conditions ease.',
        url: 'https://example.com/property/rebound',
        source: NEWS_SOURCES.AFR,
        category: 'property',
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        fetchedAt: new Date(),
      },
      {
        id: 'prop-3',
        title: 'REIT Performance Outpaces Direct Property Investment',
        summary: 'Listed property trusts delivering stronger returns than physical property markets.',
        url: 'https://example.com/property/reit',
        source: NEWS_SOURCES.BLOOMBERG,
        category: 'property',
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        fetchedAt: new Date(),
      },
    ];
  } catch (error) {
    logger.error('Failed to fetch property news', error);
    return [];
  }
}

/**
 * Fetch stock market news
 */
async function fetchStockNews(): Promise<NewsArticle[]> {
  try {
    logger.info('Fetching stock market news...');

    // Mock stock news
    return [
      {
        id: 'stock-1',
        title: 'ASX 200 Reaches 3-Month High Amid Rate Cut Expectations',
        summary: 'Market gains momentum as inflation concerns ease globally.',
        url: 'https://example.com/stocks/asx-high',
        source: NEWS_SOURCES.AFR,
        category: 'stocks',
        publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        fetchedAt: new Date(),
      },
      {
        id: 'stock-2',
        title: 'Tech Stocks Lead Market Gains on AI Optimism',
        summary: 'Software and semiconductor companies rally as AI adoption accelerates.',
        url: 'https://example.com/stocks/tech-rally',
        source: NEWS_SOURCES.WSJ,
        category: 'stocks',
        publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        fetchedAt: new Date(),
      },
      {
        id: 'stock-3',
        title: 'Banking Sector Eyes Recovery on Lending Improvement',
        summary: 'Major banks report stronger mortgage pipeline after rate stabilization.',
        url: 'https://example.com/stocks/banking',
        source: NEWS_SOURCES.BLOOMBERG,
        category: 'stocks',
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        fetchedAt: new Date(),
      },
    ];
  } catch (error) {
    logger.error('Failed to fetch stock news', error);
    return [];
  }
}

/**
 * Fetch cryptocurrency news
 */
async function fetchCryptoNews(): Promise<NewsArticle[]> {
  try {
    logger.info('Fetching cryptocurrency news...');

    // Mock crypto news
    return [
      {
        id: 'crypto-1',
        title: 'Bitcoin Surges Above $43k on Institutional Demand',
        summary: 'Major funds increase crypto allocations amid inflation hedging strategies.',
        url: 'https://example.com/crypto/bitcoin-surge',
        source: NEWS_SOURCES.COINDESK,
        category: 'crypto',
        publishedAt: new Date(Date.now() - 30 * 60 * 1000),
        fetchedAt: new Date(),
      },
      {
        id: 'crypto-2',
        title: 'Ethereum Network Upgrade Improves Scalability',
        summary: 'Latest update brings transaction costs down by 40% across Layer 2 solutions.',
        url: 'https://example.com/crypto/ethereum-upgrade',
        source: NEWS_SOURCES.COINTELEGRAPH,
        category: 'crypto',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        fetchedAt: new Date(),
      },
      {
        id: 'crypto-3',
        title: 'Solana Network Stability Improves with Recent Fixes',
        summary: 'Network downtime incidents significantly reduced after December upgrade.',
        url: 'https://example.com/crypto/solana-fix',
        source: NEWS_SOURCES.COINDESK,
        category: 'crypto',
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        fetchedAt: new Date(),
      },
    ];
  } catch (error) {
    logger.error('Failed to fetch crypto news', error);
    return [];
  }
}

/**
 * Fetch technology news
 */
async function fetchTechNews(): Promise<NewsArticle[]> {
  try {
    logger.info('Fetching technology news...');

    // Mock tech news
    return [
      {
        id: 'tech-1',
        title: 'OpenAI Releases Major Update to GPT-4 Model',
        summary: 'New features improve reasoning and reduce hallucinations in enterprise applications.',
        url: 'https://example.com/tech/gpt4-update',
        source: NEWS_SOURCES.BLOOMBERG,
        category: 'technology',
        publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        fetchedAt: new Date(),
      },
      {
        id: 'tech-2',
        title: 'Cloud Computing Costs Rise as AI Demand Explodes',
        summary: 'GPU shortages and high compute demands driving infrastructure expenses higher.',
        url: 'https://example.com/tech/cloud-costs',
        source: NEWS_SOURCES.WSJ,
        category: 'technology',
        publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        fetchedAt: new Date(),
      },
      {
        id: 'tech-3',
        title: 'Quantum Computing Breakthrough Announced by IBM',
        summary: 'New error correction method brings practical quantum computing closer to reality.',
        url: 'https://example.com/tech/quantum',
        source: NEWS_SOURCES.REUTERS,
        category: 'technology',
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        fetchedAt: new Date(),
      },
    ];
  } catch (error) {
    logger.error('Failed to fetch tech news', error);
    return [];
  }
}

/**
 * Fetch economic news
 */
async function fetchEconomyNews(): Promise<NewsArticle[]> {
  try {
    logger.info('Fetching economy news...');

    // Mock economy news
    return [
      {
        id: 'econ-1',
        title: 'RBA Signals Potential Rate Cut in Mid-2024',
        summary: 'Central bank sees inflation moderating faster than expected in coming months.',
        url: 'https://example.com/economy/rba-rates',
        source: NEWS_SOURCES.AFR,
        category: 'economy',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        fetchedAt: new Date(),
      },
      {
        id: 'econ-2',
        title: 'Australian GDP Growth Slows to 0.1% in Q3',
        summary: 'Weaker consumer spending and investment offset population-driven growth.',
        url: 'https://example.com/economy/gdp',
        source: NEWS_SOURCES.REUTERS,
        category: 'economy',
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        fetchedAt: new Date(),
      },
      {
        id: 'econ-3',
        title: 'Global Trade Tensions Ease Following Negotiations',
        summary: 'International talks reduce tariff pressures on supply chains.',
        url: 'https://example.com/economy/trade',
        source: NEWS_SOURCES.BLOOMBERG,
        category: 'economy',
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        fetchedAt: new Date(),
      },
    ];
  } catch (error) {
    logger.error('Failed to fetch economy news', error);
    return [];
  }
}

/**
 * Main function to fetch all news
 */
export async function fetchAllNews(): Promise<NewsArticle[]> {
  try {
    logger.info('Starting news fetch from all sources...');

    const [propertyNews, stockNews, cryptoNews, techNews, economyNews] = await Promise.all([
      fetchPropertyNews(),
      fetchStockNews(),
      fetchCryptoNews(),
      fetchTechNews(),
      fetchEconomyNews(),
    ]);

    const allNews = [
      ...propertyNews,
      ...stockNews,
      ...cryptoNews,
      ...techNews,
      ...economyNews,
    ];

    logger.info(`Successfully fetched ${allNews.length} news articles`);

    return allNews;
  } catch (error) {
    logger.error('News fetch failed', error);
    throw error;
  }
}
