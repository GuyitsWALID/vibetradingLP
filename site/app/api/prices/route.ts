import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type PricePoint = {
  pair: string;
  price: string;
  change: number;
  time: string;
};

type PricesResponse = {
  prices: PricePoint[];
  source: 'stooq' | 'frankfurter';
  isLive: boolean;
  updatedAt: string;
  status: 'live' | 'unavailable';
  message?: string;
};

type FrankfurterResponse = {
  amount?: number;
  base?: string;
  date?: string;
  rates?: Record<string, number>;
};

const CACHE_TTL_MS = 65_000;

let cachedResponse: PricesResponse | null = null;
let cachedAt = 0;

function getPriceDecimals(pair: string) {
  if (pair.includes('JPY')) return 3;
  if (pair.includes('XAU')) return 2;
  if (pair.includes('DXY')) return 3;
  return 5;
}

function formatQuoteTime(unixSeconds?: number) {
  if (!unixSeconds) return 'Daily';
  const date = new Date(unixSeconds * 1000);
  if (Number.isNaN(date.getTime())) return 'Daily';

  return (
    date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    }) + ' UTC'
  );
}

function mapPricePoint(pair: string, price: number, timestamp?: number): PricePoint {
  const decimals = getPriceDecimals(pair);
  return {
    pair,
    price: price.toFixed(decimals),
    change: 0,
    time: formatQuoteTime(timestamp),
  };
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function parseIsoDate(dateStr: string | undefined): Date | null {
  if (!dateStr) return null;
  const date = new Date(`${dateStr}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function previousDateIso(latestDate: string | undefined): string {
  const base = parseIsoDate(latestDate) || new Date();
  const prev = new Date(base);
  prev.setUTCDate(prev.getUTCDate() - 1);
  return toIsoDate(prev);
}

function buildFromUsdRates(rates: Record<string, number>, timestamp?: number) {
  const live: PricePoint[] = [];

  const eur = rates.EUR;
  const gbp = rates.GBP;
  const jpy = rates.JPY;
  const aud = rates.AUD;
  const cad = rates.CAD;
  const nzd = rates.NZD;

  if (typeof eur === 'number' && eur > 0) live.push(mapPricePoint('EUR/USD', 1 / eur, timestamp));
  if (typeof gbp === 'number' && gbp > 0) live.push(mapPricePoint('GBP/USD', 1 / gbp, timestamp));
  if (typeof jpy === 'number' && jpy > 0) live.push(mapPricePoint('USD/JPY', jpy, timestamp));
  if (typeof aud === 'number' && aud > 0) live.push(mapPricePoint('AUD/USD', 1 / aud, timestamp));
  if (typeof cad === 'number' && cad > 0) live.push(mapPricePoint('USD/CAD', cad, timestamp));
  if (typeof nzd === 'number' && nzd > 0) live.push(mapPricePoint('NZD/USD', 1 / nzd, timestamp));

  return live;
}

function parseStooqCsvRow(csv: string): {
  open?: number;
  close?: number;
  date?: string;
  time?: string;
} | null {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return null;

  const row = lines[1].split(',');
  if (row.length < 7) return null;

  const open = Number(row[3]);
  const close = Number(row[6]);
  const date = row[1];
  const time = row[2];

  return {
    open: Number.isFinite(open) ? open : undefined,
    close: Number.isFinite(close) ? close : undefined,
    date,
    time,
  };
}

async function fetchStooqOptionalAddons(): Promise<PricePoint[]> {
  const prices: PricePoint[] = [];

  const sources = [
    { pair: 'EUR/USD', symbol: 'eurusd' },
    { pair: 'GBP/USD', symbol: 'gbpusd' },
    { pair: 'USD/JPY', symbol: 'usdjpy' },
    { pair: 'AUD/USD', symbol: 'audusd' },
    { pair: 'USD/CAD', symbol: 'usdcad' },
    { pair: 'NZD/USD', symbol: 'nzdusd' },
    { pair: 'XAU/USD', symbol: 'xauusd' },
    { pair: 'DXY', symbol: 'dx.f' },
  ];

  for (const source of sources) {
    try {
      const url = `https://stooq.com/q/l/?s=${encodeURIComponent(source.symbol)}&f=sd2t2ohlcv&h&e=csv`;
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
          accept: 'text/csv,text/plain,*/*',
          'accept-language': 'en-US,en;q=0.9',
        },
      });
      if (!response.ok) continue;

      const csv = await response.text();
      const parsed = parseStooqCsvRow(csv);
      if (!parsed || typeof parsed.close !== 'number' || parsed.close <= 0) continue;

      const point = mapPricePoint(source.pair, parsed.close);
      if (typeof parsed.open === 'number' && parsed.open > 0) {
        point.change = Number((((parsed.close - parsed.open) / parsed.open) * 100).toFixed(2));
      }
      if (parsed.date && parsed.time && parsed.time !== 'N/D') {
        point.time = `${parsed.time} UTC`;
      }
      prices.push(point);
    } catch {
      // Ignore symbol-level failures and continue.
    }
  }

  return prices;
}

export async function GET() {
  const now = Date.now();
  if (cachedResponse && now - cachedAt < CACHE_TTL_MS) {
    return NextResponse.json(cachedResponse);
  }

  const updatedAt = new Date().toISOString();
  try {
    const stooqPrices = await fetchStooqOptionalAddons();
    const stooqCorePairs = new Set(stooqPrices.map((item) => item.pair));
    const hasStooqCore = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'NZD/USD']
      .every((pair) => stooqCorePairs.has(pair));

    // Stooq is less delayed (intraday) and should be the primary source when core pairs are available.
    if (hasStooqCore) {
      const successResponse: PricesResponse = {
        prices: stooqPrices,
        source: 'stooq',
        isLive: false,
        updatedAt,
        status: 'live',
        message: 'Delayed',
      };
      cachedResponse = successResponse;
      cachedAt = now;
      return NextResponse.json(successResponse);
    }

    const latestResponse = await fetch(
      'https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,JPY,CAD,AUD,NZD',
      { cache: 'no-store' }
    );

    if (!latestResponse.ok) {
      const body = (await latestResponse.text()).trim();
      const fallbackResponse: PricesResponse = {
        prices: [],
        source: 'frankfurter',
        isLive: false,
        updatedAt,
        status: 'unavailable',
        message: `frankfurter latest failed (${latestResponse.status}): ${body || 'Unknown error'}`,
      };
      cachedResponse = fallbackResponse;
      cachedAt = now;
      return NextResponse.json(fallbackResponse);
    }

    const latestPayload = (await latestResponse.json()) as FrankfurterResponse;
    const latestRates = latestPayload.rates || {};

    const prevDate = previousDateIso(latestPayload.date);
    const previousResponse = await fetch(
      `https://api.frankfurter.app/${prevDate}?from=USD&to=EUR,GBP,JPY,CAD,AUD,NZD`,
      { cache: 'no-store' }
    );

    let previousRates: Record<string, number> = {};
    if (previousResponse.ok) {
      const previousPayload = (await previousResponse.json()) as FrankfurterResponse;
      previousRates = previousPayload.rates || {};
    }

    const timestamp = Math.floor(new Date(`${latestPayload.date || updatedAt}T00:00:00Z`).getTime() / 1000);
    const basePrices = buildFromUsdRates(latestRates, timestamp).map((item) => {
      const [base, quote] = item.pair.split('/');
      const prevRaw = quote === 'USD'
        ? previousRates[base]
        : base === 'USD'
          ? previousRates[quote]
          : undefined;

      let prevPrice: number | undefined;
      if (typeof prevRaw === 'number' && prevRaw > 0) {
        prevPrice = quote === 'USD' ? 1 / prevRaw : prevRaw;
      }

      if (!prevPrice || prevPrice <= 0) return item;

      const current = Number(item.price);
      const change = ((current - prevPrice) / prevPrice) * 100;
      return { ...item, change: Number(change.toFixed(2)) };
    });

    const livePrices = basePrices;

    if (livePrices.length > 0) {
      const successResponse: PricesResponse = {
        prices: livePrices,
        source: 'frankfurter',
        isLive: false,
        updatedAt,
        status: 'live',
        message: 'Delayed',
      };
      cachedResponse = successResponse;
      cachedAt = now;
      return NextResponse.json(successResponse);
    }

    const fallbackResponse: PricesResponse = {
      prices: [],
      source: 'frankfurter',
      isLive: false,
      updatedAt,
      status: 'unavailable',
      message: 'Frankfurter returned no usable FX rates for configured pairs.',
    };

    cachedResponse = fallbackResponse;
    cachedAt = now;
    return NextResponse.json(fallbackResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Frankfurter request failed.';
    const response: PricesResponse = {
      prices: [],
      source: 'frankfurter',
      isLive: false,
      updatedAt,
      status: 'unavailable',
      message,
    };
    cachedResponse = response;
    cachedAt = now;
    return NextResponse.json(response);
  }
}
