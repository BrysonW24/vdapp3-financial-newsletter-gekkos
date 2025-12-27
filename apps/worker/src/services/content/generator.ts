// Content generation service using AI
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { logger } from '../../utils/logger';

export interface GeneratedContent {
  title: string;
  summary: string;
  body: string;
  keyPoints: string[];
}

interface AIConfig {
  provider: 'openai' | 'anthropic';
  apiKey?: string;
}

let openaiClient: OpenAI | null = null;
let anthropicClient: Anthropic | null = null;

/**
 * Initialize AI clients
 */
function initializeClients() {
  if (!openaiClient && process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  if (!anthropicClient && process.env.ANTHROPIC_API_KEY) {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
}

/**
 * Generate trading section summary
 */
export async function generateTradingSection(
  data: any,
  provider: 'openai' | 'anthropic' = 'openai'
): Promise<GeneratedContent> {
  try {
    initializeClients();

    logger.info(`Generating trading section content with ${provider}...`);

    const prompt = `
Based on the following market data, generate a brief trading update for a daily newsletter:

Market Indices:
${data.indices
  .map(
    (idx: any) =>
      `${idx.name} (${idx.code}): ${idx.value.toFixed(2)} (${idx.changePercent > 0 ? '+' : ''}${idx.changePercent.toFixed(2)}%)`
  )
  .join('\n')}

Top Stocks:
${data.stocks
  .map(
    (stock: any) =>
      `${stock.name} (${stock.code}): $${stock.price.toFixed(2)} (${stock.changePercent > 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%)`
  )
  .join('\n')}

Please provide:
1. A catchy title (5-8 words)
2. A 2-3 sentence summary
3. A brief market analysis (3-4 sentences)
4. 3 key points in bullet format

Format your response as JSON with keys: title, summary, body, keyPoints (array)
`;

    if (provider === 'openai' && openaiClient) {
      const response = await openaiClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('No content generated');

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Could not parse JSON response');

      const result = JSON.parse(jsonMatch[0]);
      logger.info('Trading section generated successfully');
      return result;
    } else if (provider === 'anthropic' && anthropicClient) {
      const response = await anthropicClient.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content =
        response.content[0].type === 'text' ? response.content[0].text : '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Could not parse JSON response');

      const result = JSON.parse(jsonMatch[0]);
      logger.info('Trading section generated successfully with Anthropic');
      return result;
    } else {
      // Fallback to mock data
      logger.warn('No AI provider available, using mock trading content');
      return {
        title: 'Markets Rally on Softer Inflation Data',
        summary:
          'Global markets advance as economic data suggests inflation is moderating. The ASX 200 leads regional gains.',
        body: 'Today\'s trading session saw broad-based gains across most sectors as investors digest positive economic indicators. The ASX 200 index reached a 3-month high, driven by strength in technology and financial stocks. International markets also performed well, with the S&P 500 and European indices posting solid gains. The narrative remains focused on the potential for interest rate cuts in the coming months.',
        keyPoints: [
          'ASX 200 reaches 3-month high at 7,500 points',
          'Big 4 banks show strength, averaging +0.7% gains',
          'Tech sector leads with major gainers in software and semiconductors',
        ],
      };
    }
  } catch (error) {
    logger.error('Failed to generate trading section', error);
    throw error;
  }
}

/**
 * Generate article summary
 */
export async function generateArticleSummary(
  article: { title: string; content?: string; summary?: string },
  provider: 'openai' | 'anthropic' = 'openai'
): Promise<string> {
  try {
    initializeClients();

    logger.info(`Generating article summary with ${provider}...`);

    const contentToSummarize = article.content || article.summary || article.title;

    const prompt = `
Summarize the following article in 2-3 sentences. Be concise and capture the main point.

Article Title: ${article.title}

Content:
${contentToSummarize}

Summary:
`;

    if (provider === 'openai' && openaiClient) {
      const response = await openaiClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 200,
      });

      const summary = response.choices[0].message.content;
      if (!summary) throw new Error('No summary generated');
      return summary.trim();
    } else if (provider === 'anthropic' && anthropicClient) {
      const response = await anthropicClient.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 200,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const summary =
        response.content[0].type === 'text' ? response.content[0].text : '';
      return summary.trim();
    } else {
      // Fallback summary
      logger.warn('No AI provider available, using article title as summary');
      return article.title;
    }
  } catch (error) {
    logger.error('Failed to generate article summary', error);
    return article.summary || article.title;
  }
}

/**
 * Generate insight for a specific category
 */
export async function generateCategoryInsight(
  category: string,
  articles: any[],
  provider: 'openai' | 'anthropic' = 'openai'
): Promise<GeneratedContent> {
  try {
    initializeClients();

    logger.info(`Generating ${category} insights with ${provider}...`);

    const articlesText = articles
      .slice(0, 5)
      .map((a) => `- ${a.title}`)
      .join('\n');

    const prompt = `
Based on these recent ${category} news articles, create a brief insight section for a daily financial newsletter:

${articlesText}

Please provide:
1. A catchy title (4-6 words)
2. A 2-3 sentence overview
3. A 3-4 sentence detailed analysis
4. 3 key insights in bullet format

Format as JSON with keys: title, summary, body, keyPoints (array)
`;

    if (provider === 'openai' && openaiClient) {
      const response = await openaiClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('No content generated');

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Could not parse JSON response');

      const result = JSON.parse(jsonMatch[0]);
      logger.info(`${category} insights generated successfully`);
      return result;
    } else if (provider === 'anthropic' && anthropicClient) {
      const response = await anthropicClient.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content =
        response.content[0].type === 'text' ? response.content[0].text : '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Could not parse JSON response');

      const result = JSON.parse(jsonMatch[0]);
      logger.info(`${category} insights generated successfully with Anthropic`);
      return result;
    } else {
      // Fallback mock content
      logger.warn(`No AI provider available, using mock ${category} content`);
      return {
        title: `Today's ${category.charAt(0).toUpperCase() + category.slice(1)} Watch`,
        summary: `Significant developments in ${category} as market dynamics continue to evolve.`,
        body: `Latest news highlights emerging trends and opportunities in the ${category} sector. Key developments suggest increased investor attention and activity.`,
        keyPoints: [
          `Market momentum in ${category} remains positive`,
          'Investor sentiment shows cautious optimism',
          'Key indicators point to continued activity',
        ],
      };
    }
  } catch (error) {
    logger.error(`Failed to generate ${category} insights`, error);
    throw error;
  }
}
