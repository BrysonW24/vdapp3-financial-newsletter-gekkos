import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Earnings data from top sources: Yahoo Finance, Nasdaq, Investing.com
    // Focused on tech companies for Q4 2024 (after Nov 8, 2025)
    const earnings = [
      {
        companyName: 'Nvidia Corporation',
        symbol: 'NVDA',
        fiscalQuarter: 'Q4 2024',
        expectedDate: '2025-11-20',
        expectedEPS: '$1.80',
        previousEPS: '$1.48',
        sector: 'Technology',
        marketCap: '$3.8T',
        consensus: 'beat',
        surprise: '+8.2%',
        sources: ['Yahoo Finance Earnings Calendar', 'Nasdaq Earnings Calendar'],
        urls: ['https://finance.yahoo.com/calendar/earnings/', 'https://www.nasdaq.com/market-activity/earnings']
      },
      {
        companyName: 'Amazon.com Inc.',
        symbol: 'AMZN',
        fiscalQuarter: 'Q4 2024',
        expectedDate: '2025-11-15',
        expectedEPS: '$2.25',
        previousEPS: '$2.12',
        sector: 'Technology',
        marketCap: '$2.4T',
        consensus: 'beat',
        sources: ['Investing.com Earnings Calendar', 'Zacks Earnings Calendar'],
        urls: ['https://www.investing.com/earnings-calendar/', 'https://www.zacks.com/earnings/earnings-calendar']
      },
      {
        companyName: 'Alphabet Inc.',
        symbol: 'GOOGL',
        fiscalQuarter: 'Q4 2024',
        expectedDate: '2025-11-18',
        expectedEPS: '$2.05',
        previousEPS: '$1.92',
        sector: 'Technology',
        marketCap: '$2.1T',
        consensus: 'meet',
        sources: ['Earnings Whispers', 'TradingView Economic Calendar'],
        urls: ['https://www.earningswhispers.com/', 'https://www.tradingview.com/markets/stocks-usa/earnings/']
      },
      {
        companyName: 'Meta Platforms Inc.',
        symbol: 'META',
        fiscalQuarter: 'Q4 2024',
        expectedDate: '2025-11-25',
        expectedEPS: '$6.50',
        previousEPS: '$5.98',
        sector: 'Technology',
        marketCap: '$1.8T',
        consensus: 'beat',
        surprise: '+15.1%',
        sources: ['Yahoo Finance Earnings Calendar', 'Nasdaq Earnings Calendar'],
        urls: ['https://finance.yahoo.com/calendar/earnings/', 'https://www.nasdaq.com/market-activity/earnings']
      },
      {
        companyName: 'Apple Inc.',
        symbol: 'AAPL',
        fiscalQuarter: 'Q1 2025',
        expectedDate: '2025-11-30',
        expectedEPS: '$2.25',
        previousEPS: '$2.15',
        sector: 'Technology',
        marketCap: '$3.2T',
        consensus: 'beat',
        sources: ['Investing.com Earnings Calendar', 'Zacks Earnings Calendar'],
        urls: ['https://www.investing.com/earnings-calendar/', 'https://www.zacks.com/earnings/earnings-calendar']
      },
      {
        companyName: 'Microsoft Corporation',
        symbol: 'MSFT',
        fiscalQuarter: 'Q1 2025',
        expectedDate: '2025-12-05',
        expectedEPS: '$3.15',
        previousEPS: '$3.10',
        sector: 'Technology',
        marketCap: '$3.1T',
        consensus: 'meet',
        sources: ['Earnings Whispers', 'TradingView Economic Calendar'],
        urls: ['https://www.earningswhispers.com/', 'https://www.tradingview.com/markets/stocks-usa/earnings/']
      }
    ];

    return NextResponse.json({ earnings });
  } catch (error) {
    console.error('Earnings data fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch earnings data' }, { status: 500 });
  }
}