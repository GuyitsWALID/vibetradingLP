// Live Market Data Utility
// Fetches real-time prices from TwelveData API

const TWELVEDATA_API_KEY = process.env.TWELVEDATA_API_KEY || 'd9f05bffb03b4f29a5d4abb6b88c0392';

export interface PriceData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  timestamp: string;
}

export const PAIRS = [
  { symbol: 'EUR/USD', name: 'Euro / US Dollar' },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar' },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen' },
  { symbol: 'XAU/USD', name: 'Gold Spot' },
  { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar' },
  { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar' },
  { symbol: 'NZD/USD', name: 'New Zealand Dollar / US Dollar' },
  { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc' },
  { symbol: 'DXY', name: 'US Dollar Index' },
  { symbol: 'BTC/USD', name: 'Bitcoin / US Dollar' },
];

async function fetchPrice(symbol: string): Promise<PriceData | null> {
  try {
    const response = await fetch(
      `https://api.twelvedata.com/price?symbol=${encodeURIComponent(symbol)}&apikey=${TWELVEDATA_API_KEY}`,
      { next: { revalidate: 5 } } // Revalidate every 5 seconds
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.price) {
      return {
        symbol,
        name: PAIRS.find(p => p.symbol === symbol)?.name || symbol,
        price: parseFloat(data.price),
        change: 0, // Would need historical data for this
        changePercent: 0,
        high: 0,
        low: 0,
        timestamp: new Date().toISOString(),
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    return null;
  }
}

export async function fetchAllPrices(): Promise<PriceData[]> {
  const promises = PAIRS.map(pair => fetchPrice(pair.symbol));
  const results = await Promise.all(promises);
  return results.filter((p): p is PriceData => p !== null);
}

export async function getQuote(symbol: string) {
  try {
    const response = await fetch(
      `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbol)}&apikey=${TWELVEDATA_API_KEY}`,
      { next: { revalidate: 5 } }
    );
    
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    return null;
  }
}
