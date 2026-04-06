import { NextRequest, NextResponse } from 'next/server';

const FALLBACK_PRICES = [
  { pair: 'EUR/USD', price: '1.08742', change: 0.12, time: 'Live' },
  { pair: 'GBP/USD', price: '1.27385', change: -0.08, time: 'Live' },
  { pair: 'USD/JPY', price: '149.420', change: 0.34, time: 'Live' },
  { pair: 'XAU/USD', price: '2248.60', change: 0.56, time: 'Live' },
  { pair: 'AUD/USD', price: '0.65432', change: -0.15, time: 'Live' },
  { pair: 'USD/CAD', price: '1.36102', change: 0.04, time: 'Live' },
  { pair: 'NZD/USD', price: '0.60870', change: -0.22, time: 'Live' },
  { pair: 'DXY', price: '98.040', change: -0.18, time: 'Live' },
];

// Yahoo Finance uses X suffix for forex pairs
const SYMBOLS = 'EURUSD=X,GBPUSD=X,USDJPY=X,XAUUSD=X,AUDUSD=X,USDCAD=X,NZDUSD=X,DX-Y.NYB';
const DISPLAY_NAMES: Record<string, string> = {
  'EURUSD=X': 'EUR/USD',
  'GBPUSD=X': 'GBP/USD',
  'USDJPY=X': 'USD/JPY',
  'XAUUSD=X': 'XAU/USD',
  'AUDUSD=X': 'AUD/USD',
  'USDCAD=X': 'USD/CAD',
  'NZDUSD=X': 'NZD/USD',
  'DX-Y.NYB': 'DXY',
};

export async function GET(request: NextRequest) {
  try {
    const res = await fetch(
      `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${SYMBOLS}`,
      {
        next: { revalidate: 10 },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json(FALLBACK_PRICES);
    }

    const data = await res.json();
    const results = data?.quoteResponse?.result;

    if (!results || results.length === 0) {
      return NextResponse.json(FALLBACK_PRICES);
    }

    const prices = results.map((item: any) => {
      const symbol = item.symbol;
      const pair = DISPLAY_NAMES[symbol] || symbol;
      const price = item.regularMarketPrice || 0;
      const changePercent = item.regularMarketChangePercent || 0;

      let decimals = 5;
      if (pair.includes('JPY') || pair === 'DXY') decimals = 3;
      if (pair.includes('XAU')) decimals = 2;

      return {
        pair,
        price: price.toFixed(decimals),
        change: parseFloat(changePercent.toFixed(2)),
        time: 'Live',
      };
    });

    return NextResponse.json(prices.length > 0 ? prices : FALLBACK_PRICES);
  } catch {
    return NextResponse.json(FALLBACK_PRICES);
  }
}
