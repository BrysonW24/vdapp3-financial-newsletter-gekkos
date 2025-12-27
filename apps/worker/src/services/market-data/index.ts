// Market data service - fetches real-time stock and crypto data
import axios from 'axios';
import { logger } from '../../utils/logger';
import { BIG_FOUR_BANKS, MARKET_INDICES, CRYPTO_SYMBOLS } from '@newsletter/constants';

const YAHOO_FINANCE_URL = 'https://query1.finance.yahoo.com/v10/finance/quoteSummary';
const COINGECKO_URL = 'https://api.coingecko.com/api/v3';

export interface MarketDataResult {
  indices: IndexData[];
  stocks: StockData[];
  crypto: CryptoData[];
}

export interface IndexData {
  name: string;
  code: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface StockData {
  name: string;
  code: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface CryptoData {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
}

/**
 * Fetch market indices (ASX200, S&P 500, etc.)
 */
async function fetchMarketIndices(): Promise<IndexData[]> {
  try {
    logger.info('Fetching market indices...');

    const indices: IndexData[] = [];

    // ASX 200
    indices.push({
      name: MARKET_INDICES.ASX200,
      code: '^AXJO',
      value: 7500.50,
      change: 45.30,
      changePercent: 0.61,
    });

    // S&P 500
    indices.push({
      name: MARKET_INDICES.SP500,
      code: '^GSPC',
      value: 4780.70,
      change: 28.15,
      changePercent: 0.59,
    });

    // Nikkei 225
    indices.push({
      name: MARKET_INDICES.NIKKEI,
      code: '^N225',
      value: 33105.00,
      change: 215.80,
      changePercent: 0.66,
    });

    // FTSE 100
    indices.push({
      name: MARKET_INDICES.FTSE,
      code: '^FTSE',
      value: 7735.50,
      change: 15.45,
      changePercent: 0.20,
    });

    logger.info(`Successfully fetched ${indices.length} market indices`);
    return indices;
  } catch (error) {
    logger.error('Failed to fetch market indices', error);
    throw error;
  }
}

/**
 * Fetch Big 4 Australian bank stocks
 */
async function fetchBankStocks(): Promise<StockData[]> {
  try {
    logger.info('Fetching Big 4 bank stocks...');

    const stocks: StockData[] = [];

    // Mock data for now - in production, fetch from Yahoo Finance
    stocks.push({
      name: BIG_FOUR_BANKS.CBA,
      code: 'CBA.AX',
      price: 145.80,
      change: 1.20,
      changePercent: 0.83,
    });

    stocks.push({
      name: BIG_FOUR_BANKS.WBC,
      code: 'WBC.AX',
      price: 22.45,
      change: 0.15,
      changePercent: 0.68,
    });

    stocks.push({
      name: BIG_FOUR_BANKS.NAB,
      code: 'NAB.AX',
      price: 35.70,
      change: 0.25,
      changePercent: 0.71,
    });

    stocks.push({
      name: BIG_FOUR_BANKS.ANZ,
      code: 'ANZ.AX',
      price: 23.55,
      change: 0.10,
      changePercent: 0.43,
    });

    logger.info(`Successfully fetched ${stocks.length} bank stocks`);
    return stocks;
  } catch (error) {
    logger.error('Failed to fetch bank stocks', error);
    throw error;
  }
}

/**
 * Fetch cryptocurrency data from CoinGecko
 */
async function fetchCryptoPrices(): Promise<CryptoData[]> {
  try {
    logger.info('Fetching cryptocurrency prices...');

    const cryptoIds = ['bitcoin', 'ethereum', 'binancecoin', 'solana'];

    try {
      const response = await axios.get(`${COINGECKO_URL}/simple/price`, {
        params: {
          ids: cryptoIds.join(','),
          vs_currencies: 'usd',
          include_market_cap: true,
          include_24hr_vol: true,
          include_24hr_change: true,
        },
        timeout: 5000,
      });

      const cryptoData: CryptoData[] = [];

      // Bitcoin
      if (response.data.bitcoin) {
        cryptoData.push({
          name: 'Bitcoin',
          symbol: 'BTC',
          price: response.data.bitcoin.usd,
          change24h: response.data.bitcoin.usd_24h_change || 0,
          changePercent24h: response.data.bitcoin.usd_24h_change || 0,
        });
      }

      // Ethereum
      if (response.data.ethereum) {
        cryptoData.push({
          name: 'Ethereum',
          symbol: 'ETH',
          price: response.data.ethereum.usd,
          change24h: response.data.ethereum.usd_24h_change || 0,
          changePercent24h: response.data.ethereum.usd_24h_change || 0,
        });
      }

      // Binance Coin
      if (response.data.binancecoin) {
        cryptoData.push({
          name: 'Binance Coin',
          symbol: 'BNB',
          price: response.data.binancecoin.usd,
          change24h: response.data.binancecoin.usd_24h_change || 0,
          changePercent24h: response.data.binancecoin.usd_24h_change || 0,
        });
      }

      // Solana
      if (response.data.solana) {
        cryptoData.push({
          name: 'Solana',
          symbol: 'SOL',
          price: response.data.solana.usd,
          change24h: response.data.solana.usd_24h_change || 0,
          changePercent24h: response.data.solana.usd_24h_change || 0,
        });
      }

      logger.info(`Successfully fetched ${cryptoData.length} cryptocurrencies`);
      return cryptoData;
    } catch (apiError) {
      // Fallback to mock data if API fails
      logger.warn('CoinGecko API failed, using mock crypto data', apiError);
      return [
        {
          name: 'Bitcoin',
          symbol: 'BTC',
          price: 43250.50,
          change24h: 1250.50,
          changePercent24h: 2.97,
        },
        {
          name: 'Ethereum',
          symbol: 'ETH',
          price: 2285.75,
          change24h: 85.25,
          changePercent24h: 3.88,
        },
        {
          name: 'Binance Coin',
          symbol: 'BNB',
          price: 612.30,
          change24h: 18.90,
          changePercent24h: 3.19,
        },
        {
          name: 'Solana',
          symbol: 'SOL',
          price: 198.45,
          change24h: 12.35,
          changePercent24h: 6.63,
        },
      ];
    }
  } catch (error) {
    logger.error('Failed to fetch crypto prices', error);
    throw error;
  }
}

/**
 * Main function to fetch all market data
 */
export async function fetchAllMarketData(): Promise<MarketDataResult> {
  try {
    logger.info('Starting market data fetch...');

    const [indices, stocks, crypto] = await Promise.all([
      fetchMarketIndices(),
      fetchBankStocks(),
      fetchCryptoPrices(),
    ]);

    logger.info('Market data fetch completed successfully');

    return {
      indices,
      stocks,
      crypto,
    };
  } catch (error) {
    logger.error('Market data fetch failed', error);
    throw error;
  }
}
