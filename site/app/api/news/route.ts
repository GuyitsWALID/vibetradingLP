import { NextResponse } from 'next/server';

type NewsApiArticle = {
  source?: { name?: string };
  title?: string;
  description?: string;
  publishedAt?: string;
  url?: string;
};

const FALLBACK_NEWS = [
  {
    id: 1,
    topic: 'ECB Dovish Surprise',
    source: 'Macro Desk',
    impact: 'high',
    time: '14:22',
    note: 'ECB cut rates by 25bps. Market is repricing the June meeting path.',
    url: null,
  },
  {
    id: 2,
    topic: 'BOE Holds at 5.25%',
    source: 'Rate Watch',
    impact: 'medium',
    time: '12:05',
    note: 'BOE statement stayed cautious, keeping the growth-inflation balance in focus.',
    url: null,
  },
  {
    id: 3,
    topic: 'Real Yields Slip',
    source: 'Bond Monitor',
    impact: 'high',
    time: '09:15',
    note: 'US real yields moved lower into session, supporting gold and risk sentiment.',
    url: null,
  },
];

function getImpact(text: string) {
  const normalized = text.toLowerCase();

  if (/(fed|fomc|ecb|boe|boj|cpi|inflation|nfp|payroll|gdp|rate decision|interest rate|recession|war)/.test(normalized)) {
    return 'high';
  }

  if (/(treasury|yield|pmi|employment|unemployment|retail sales|manufacturing|services)/.test(normalized)) {
    return 'medium';
  }

  return 'low';
}

function formatUtcHHmm(iso?: string) {
  if (!iso) return 'Live';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Live';

  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  });
}

export async function GET() {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(FALLBACK_NEWS);
  }

  try {
    const query = encodeURIComponent('forex OR "central bank" OR inflation OR "interest rates" OR "economic calendar"');
    const url = `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=8&apiKey=${apiKey}`;

    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!res.ok) {
      return NextResponse.json(FALLBACK_NEWS);
    }

    const data = await res.json();
    const articles: NewsApiArticle[] = Array.isArray(data?.articles) ? data.articles : [];

    if (articles.length === 0) {
      return NextResponse.json(FALLBACK_NEWS);
    }

    const mapped = articles.slice(0, 6).map((article, idx) => {
      const title = (article.title || 'Market update').trim();
      const description = (article.description || title).trim();
      const combined = `${title} ${description}`;

      return {
        id: idx + 1,
        topic: title,
        source: article.source?.name || 'NewsAPI',
        impact: getImpact(combined),
        time: formatUtcHHmm(article.publishedAt),
        note: description,
        url: article.url || null,
      };
    });

    return NextResponse.json(mapped.length > 0 ? mapped : FALLBACK_NEWS);
  } catch {
    return NextResponse.json(FALLBACK_NEWS);
  }
}
