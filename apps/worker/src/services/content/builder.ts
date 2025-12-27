// Newsletter builder service - assembles all content into a complete newsletter
import { logger } from '../../utils/logger';
import { prisma } from '@newsletter/database';
import {
  generateTradingSection,
  generateArticleSummary,
  generateCategoryInsight,
} from './generator';

export interface NewsletterData {
  date: Date;
  tradingData: any;
  propertyData: any;
  stocksData: any;
  cryptoData: any;
  economyData: any;
  technologyData: any;
  knowledgeData: any;
  entertainmentData: any;
  graphicData: any;
  quoteData: any;
}

/**
 * Build a complete newsletter
 */
export async function buildNewsletter(
  marketData: any,
  news: any[],
  aiProvider: 'openai' | 'anthropic' = 'openai'
): Promise<NewsletterData> {
  try {
    logger.info('Building newsletter...');

    // Separate news by category
    const newsCategories = {
      property: news.filter((n) => n.category === 'property'),
      stocks: news.filter((n) => n.category === 'stocks'),
      crypto: news.filter((n) => n.category === 'crypto'),
      economy: news.filter((n) => n.category === 'economy'),
      technology: news.filter((n) => n.category === 'technology'),
    };

    // Generate all sections in parallel
    const [
      tradingSection,
      propertySection,
      stocksSection,
      cryptoSection,
      economySection,
      technologySection,
      quoteData,
    ] = await Promise.all([
      generateTradingSection(marketData, aiProvider),
      generateCategoryInsight('property', newsCategories.property, aiProvider),
      generateCategoryInsight('stocks', newsCategories.stocks, aiProvider),
      generateCategoryInsight('cryptocurrency', newsCategories.crypto, aiProvider),
      generateCategoryInsight('economy', newsCategories.economy, aiProvider),
      generateCategoryInsight('technology', newsCategories.technology, aiProvider),
      getQuoteOfDay(),
    ]);

    const newsLetterData: NewsletterData = {
      date: new Date(),
      tradingData: {
        ...tradingSection,
        indices: marketData.indices,
        stocks: marketData.stocks,
      },
      propertyData: {
        ...propertySection,
        articles: newsCategories.property.slice(0, 5),
      },
      stocksData: {
        ...stocksSection,
        articles: newsCategories.stocks.slice(0, 5),
      },
      cryptoData: {
        ...cryptoSection,
        crypto: marketData.crypto,
        articles: newsCategories.crypto.slice(0, 5),
      },
      economyData: {
        ...economySection,
        articles: newsCategories.economy.slice(0, 5),
      },
      technologyData: {
        ...technologySection,
        articles: newsCategories.technology.slice(0, 5),
      },
      knowledgeData: {
        title: 'Today\'s Financial Lesson',
        topic: 'Understanding Dollar-Cost Averaging',
        description:
          'DCA is an investment strategy where you invest a fixed amount regularly regardless of price.',
        lesson:
          'This approach reduces timing risk and emotionally-driven decisions in volatile markets.',
        keyTakeaways: [
          'Reduces impact of market volatility',
          'Removes emotion from investing',
          'Suitable for long-term investors',
        ],
      },
      entertainmentData: {
        title: 'Weekend Entertainment',
        highlight: 'Netflix releases new financial thriller series',
        description: 'A gripping drama about traders in a high-frequency trading firm.',
      },
      graphicData: {
        title: 'Market Performance This Week',
        type: 'chart',
        description: 'ASX 200 performance over the past 7 days',
      },
      quoteData,
    };

    logger.info('Newsletter built successfully');
    return newsLetterData;
  } catch (error) {
    logger.error('Failed to build newsletter', error);
    throw error;
  }
}

/**
 * Save newsletter to database
 */
export async function saveNewsletter(data: NewsletterData): Promise<any> {
  try {
    logger.info('Saving newsletter to database...');

    // Get today's date at midnight UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Check if newsletter already exists for today
    const existing = await prisma.newsletter.findUnique({
      where: { date: today },
    });

    if (existing) {
      logger.info('Updating existing newsletter for today...');
      const updated = await prisma.newsletter.update({
        where: { id: existing.id },
        data: {
          tradingData: data.tradingData,
          propertyData: data.propertyData,
          stocksData: data.stocksData,
          cryptoData: data.cryptoData,
          economyData: data.economyData,
          technologyData: data.technologyData,
          knowledgeData: data.knowledgeData,
          entertainmentData: data.entertainmentData,
          graphicData: data.graphicData,
          quoteData: data.quoteData,
        },
      });
      return updated;
    } else {
      logger.info('Creating new newsletter for today...');
      const created = await prisma.newsletter.create({
        data: {
          date: today,
          tradingData: data.tradingData,
          propertyData: data.propertyData,
          stocksData: data.stocksData,
          cryptoData: data.cryptoData,
          economyData: data.economyData,
          technologyData: data.technologyData,
          knowledgeData: data.knowledgeData,
          entertainmentData: data.entertainmentData,
          graphicData: data.graphicData,
          quoteData: data.quoteData,
        },
      });
      return created;
    }
  } catch (error) {
    logger.error('Failed to save newsletter to database', error);
    throw error;
  }
}

/**
 * Save articles to database
 */
export async function saveArticles(articles: any[]): Promise<void> {
  try {
    logger.info(`Saving ${articles.length} articles to database...`);

    for (const article of articles) {
      await prisma.article.upsert({
        where: { url: article.url },
        update: {
          summary: article.summary,
        },
        create: {
          title: article.title,
          url: article.url,
          source: article.source,
          category: article.category,
          summary: article.summary,
          imageUrl: article.imageUrl,
          publishedAt: article.publishedAt,
        },
      });
    }

    logger.info('Articles saved successfully');
  } catch (error) {
    logger.error('Failed to save articles to database', error);
    throw error;
  }
}

/**
 * Get quote of the day
 */
async function getQuoteOfDay(): Promise<any> {
  try {
    // Get a random unused quote from database
    const quote = await prisma.quote.findFirst({
      where: { used: false },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (quote) {
      // Mark as used
      await prisma.quote.update({
        where: { id: quote.id },
        data: {
          used: true,
          usedAt: new Date(),
        },
      });

      return {
        text: quote.text,
        author: quote.author,
        title: quote.title,
        category: quote.category,
      };
    }

    // Fallback to default quote
    return {
      text: 'The stock market is a device for transferring money from the impatient to the patient.',
      author: 'Warren Buffett',
      title: 'Investor & Philanthropist',
      category: 'investing',
    };
  } catch (error) {
    logger.error('Failed to get quote of the day', error);
    return {
      text: 'The stock market is a device for transferring money from the impatient to the patient.',
      author: 'Warren Buffett',
      title: 'Investor & Philanthropist',
      category: 'investing',
    };
  }
}

/**
 * Publish newsletter
 */
export async function publishNewsletter(newsletterId: string): Promise<void> {
  try {
    logger.info(`Publishing newsletter ${newsletterId}...`);

    await prisma.newsletter.update({
      where: { id: newsletterId },
      data: {
        published: true,
        updatedAt: new Date(),
      },
    });

    logger.info('Newsletter published successfully');
  } catch (error) {
    logger.error('Failed to publish newsletter', error);
    throw error;
  }
}
