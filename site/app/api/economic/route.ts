import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type EconomicEvent = {
  date?: string;
  time: string;
  country: string;
  event: string;
  impact: string;
  forecast: string;
  previous: string;
};

type EodhdEconomicItem = {
  date?: string;
  time?: string;
  country?: string;
  event?: string;
  title?: string;
  importance?: string | number;
  impact?: string | number;
  estimate?: string | number | null;
  consensus?: string | number | null;
  forecast?: string | number | null;
  previous?: string | number | null;
};

function normalizeImpact(value?: string | number) {
  if (typeof value === 'number') {
    if (value >= 3) return 'high';
    if (value >= 2) return 'medium';
    return 'low';
  }

  const v = String(value || '').toLowerCase();
  if (v.includes('high') || v === '3') return 'high';
  if (v.includes('medium') || v.includes('med') || v === '2') return 'medium';
  return 'low';
}

function toText(value: string | number | null | undefined) {
  if (value === null || value === undefined) return '-';
  const str = String(value).trim();
  return str.length > 0 ? str : '-';
}

function mapEconomicItem(item: EodhdEconomicItem): EconomicEvent | null {
  const eventName = (item.event || item.title || '').trim();
  if (!eventName) return null;

  return {
    date: item.date,
    time: toText(item.time),
    country: toText(item.country),
    event: eventName,
    impact: normalizeImpact(item.importance ?? item.impact),
    forecast: toText(item.forecast ?? item.consensus ?? item.estimate),
    previous: toText(item.previous),
  };
}

export async function GET(request: NextRequest) {
  const token = process.env.EODHD_API_KEY?.trim();
  const date = request.nextUrl.searchParams.get('date') || new Date().toISOString().slice(0, 10);

  if (!token) {
    return NextResponse.json({
      events: [],
      isLive: false,
      source: 'eodhd',
      updatedAt: new Date().toISOString(),
      message: 'EODHD_API_KEY is missing.',
    });
  }

  const url = `https://eodhd.com/api/economic-events?from=${encodeURIComponent(date)}&to=${encodeURIComponent(
    date
  )}&api_token=${encodeURIComponent(token)}&fmt=json`;

  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      const body = (await response.text()).trim();
      return NextResponse.json({
        events: [],
        isLive: false,
        source: 'eodhd',
        updatedAt: new Date().toISOString(),
        message: `economic-events failed (${response.status}): ${body || 'Unknown error'}`,
      });
    }

    const payload = (await response.json()) as EodhdEconomicItem[];
    const events = Array.isArray(payload)
      ? payload.map(mapEconomicItem).filter((event): event is EconomicEvent => event !== null)
      : [];

    return NextResponse.json({
      events,
      isLive: true,
      source: 'eodhd',
      updatedAt: new Date().toISOString(),
      message: events.length > 0 ? undefined : 'No economic events returned for the selected date.',
    });
  } catch {
    return NextResponse.json({
      events: [],
      isLive: false,
      source: 'eodhd',
      updatedAt: new Date().toISOString(),
      message: 'economic-events request failed.',
    });
  }
}
