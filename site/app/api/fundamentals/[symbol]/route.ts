import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  const token = process.env.EODHD_API_KEY?.trim();
  const rawSymbol = (params.symbol || '').trim();
  const symbol = rawSymbol.toUpperCase();
  const filter = request.nextUrl.searchParams.get('filter');

  if (!symbol) {
    return NextResponse.json({
      source: 'eodhd',
      isLive: false,
      message: 'Symbol is required.',
    }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({
      source: 'eodhd',
      isLive: false,
      symbol,
      message: 'EODHD_API_KEY is missing.',
    }, { status: 500 });
  }

  const url = new URL(`https://eodhd.com/api/fundamentals/${encodeURIComponent(symbol)}`);
  url.searchParams.set('api_token', token);
  url.searchParams.set('fmt', 'json');
  if (filter) url.searchParams.set('filter', filter);

  try {
    const response = await fetch(url.toString(), { cache: 'no-store' });
    if (!response.ok) {
      const body = (await response.text()).trim();
      return NextResponse.json({
        source: 'eodhd',
        isLive: false,
        symbol,
        message: `fundamentals failed (${response.status}): ${body || 'Unknown error'}`,
      }, { status: response.status });
    }

    const payload = await response.json();
    return NextResponse.json({
      source: 'eodhd',
      isLive: true,
      symbol,
      updatedAt: new Date().toISOString(),
      data: payload,
    });
  } catch {
    return NextResponse.json({
      source: 'eodhd',
      isLive: false,
      symbol,
      message: 'fundamentals request failed.',
    }, { status: 502 });
  }
}
