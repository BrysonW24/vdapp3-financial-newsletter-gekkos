// Job handlers for different job types
import { Job } from 'bullmq';
import { logger } from '../utils/logger';
import { fetchAllMarketData } from '../services/market-data';
import { fetchAllNews, NewsArticle } from '../services/news';
import { buildNewsletter, saveNewsletter, saveArticles, publishNewsletter } from '../services/content/builder';
import { contentFetchQueue, contentSummarizeQueue, newsletterQueue } from '../queue/queues';

/**
 * Handle fetch-markets job
 */
export async function handleFetchMarkets(job: Job): Promise<any> {
  try {
    logger.info(`[Job ${job.id}] Fetching market data...`);

    const marketData = await fetchAllMarketData();

    logger.info(`[Job ${job.id}] Market data fetched successfully`);

    return {
      success: true,
      data: marketData,
      timestamp: new Date(),
    };
  } catch (error) {
    logger.error(`[Job ${job.id}] Failed to fetch market data`, error);
    throw error;
  }
}

/**
 * Handle fetch-news job
 */
export async function handleFetchNews(job: Job): Promise<any> {
  try {
    logger.info(`[Job ${job.id}] Fetching news...`);

    const news = await fetchAllNews();

    logger.info(`[Job ${job.id}] News fetched successfully, ${news.length} articles found`);

    // Queue news articles for summarization
    await contentSummarizeQueue.add(
      'summarize-articles',
      { articles: news },
      {
        jobId: `summarize-${job.id}`,
      }
    );

    return {
      success: true,
      articleCount: news.length,
      timestamp: new Date(),
    };
  } catch (error) {
    logger.error(`[Job ${job.id}] Failed to fetch news`, error);
    throw error;
  }
}

/**
 * Handle generate-newsletter job
 */
export async function handleGenerateNewsletter(job: Job): Promise<any> {
  try {
    logger.info(`[Job ${job.id}] Generating newsletter...`);

    const { marketData, news } = job.data;

    if (!marketData || !news) {
      throw new Error('Missing required data: marketData or news');
    }

    const aiProvider =
      (process.env.AI_PROVIDER as 'openai' | 'anthropic') || 'openai';
    const newsLetterData = await buildNewsletter(marketData, news, aiProvider);

    logger.info(`[Job ${job.id}] Newsletter built, saving to database...`);

    const savedNewsletter = await saveNewsletter(newsLetterData);
    await saveArticles(news);

    logger.info(`[Job ${job.id}] Newsletter saved with ID: ${savedNewsletter.id}`);

    return {
      success: true,
      newsletterId: savedNewsletter.id,
      timestamp: new Date(),
    };
  } catch (error) {
    logger.error(`[Job ${job.id}] Failed to generate newsletter`, error);
    throw error;
  }
}

/**
 * Handle summarize-articles job
 */
export async function handleSummarizeArticles(job: Job): Promise<any> {
  try {
    logger.info(`[Job ${job.id}] Summarizing articles...`);

    const { articles } = job.data;

    if (!articles || !Array.isArray(articles)) {
      throw new Error('Invalid articles data');
    }

    logger.info(`[Job ${job.id}] Summarized ${articles.length} articles`);

    return {
      success: true,
      articleCount: articles.length,
      timestamp: new Date(),
    };
  } catch (error) {
    logger.error(`[Job ${job.id}] Failed to summarize articles`, error);
    throw error;
  }
}

/**
 * Handle publish-newsletter job
 */
export async function handlePublishNewsletter(job: Job): Promise<any> {
  try {
    logger.info(`[Job ${job.id}] Publishing newsletter...`);

    const { newsletterId } = job.data;

    if (!newsletterId) {
      throw new Error('Missing newsletterId');
    }

    await publishNewsletter(newsletterId);

    logger.info(`[Job ${job.id}] Newsletter ${newsletterId} published successfully`);

    return {
      success: true,
      newsletterId,
      timestamp: new Date(),
    };
  } catch (error) {
    logger.error(`[Job ${job.id}] Failed to publish newsletter`, error);
    throw error;
  }
}

/**
 * Handle daily orchestration job
 */
export async function handleDailyOrchestration(job: Job): Promise<any> {
  try {
    logger.info(`[Job ${job.id}] Starting daily newsletter orchestration...`);

    // Step 1: Fetch market data and news in parallel
    const marketDataJobId = `market-${Date.now()}`;
    const newsJobId = `news-${Date.now()}`;

    const [marketDataJob, newsJob] = await Promise.all([
      contentFetchQueue.add(
        'fetch-markets',
        { timestamp: new Date() },
        { jobId: marketDataJobId }
      ),
      contentFetchQueue.add(
        'fetch-news',
        { timestamp: new Date() },
        { jobId: newsJobId }
      ),
    ]);

    logger.info(
      `[Job ${job.id}] Data fetching jobs queued: market=${marketDataJobId}, news=${newsJobId}`
    );

    // Wait for both to complete
    const [marketResult, newsResult] = await Promise.all([
      marketDataJob.waitUntilFinished(contentFetchQueue.events),
      newsJob.waitUntilFinished(contentFetchQueue.events),
    ]);

    logger.info(`[Job ${job.id}] Data fetching completed, assembling newsletter...`);

    // Step 2: Generate newsletter
    const newsletterJobId = `newsletter-${Date.now()}`;
    const newsletterJob = await newsletterQueue.add(
      'generate-newsletter',
      {
        marketData: marketResult,
        news: newsResult || [],
      },
      { jobId: newsletterJobId }
    );

    const newsletterResult = await newsletterJob.waitUntilFinished(
      newsletterQueue.events
    );

    logger.info(
      `[Job ${job.id}] Newsletter generated: ${newsletterResult?.newsletterId}`
    );

    // Step 3: Publish newsletter
    const publishJobId = `publish-${Date.now()}`;
    const publishJob = await newsletterQueue.add(
      'publish-newsletter',
      {
        newsletterId: newsletterResult?.newsletterId,
      },
      { jobId: publishJobId }
    );

    await publishJob.waitUntilFinished(newsletterQueue.events);

    logger.info(`[Job ${job.id}] Daily orchestration completed successfully`);

    return {
      success: true,
      newsletterId: newsletterResult?.newsletterId,
      marketDataJobId,
      newsJobId,
      newsletterJobId,
      publishJobId,
      timestamp: new Date(),
    };
  } catch (error) {
    logger.error(`[Job ${job.id}] Daily orchestration failed`, error);
    throw error;
  }
}
