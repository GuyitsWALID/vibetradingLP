import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

async function fetchLatestNews() {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return FALLBACK_NEWS;
  }

  try {
    const query = encodeURIComponent('forex OR "central bank" OR inflation OR "interest rates" OR "economic calendar"');
    const url = `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=8&apiKey=${apiKey}`;

    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!res.ok) {
      return FALLBACK_NEWS;
    }

    const data = await res.json();
    const articles: NewsApiArticle[] = Array.isArray(data?.articles) ? data.articles : [];

    if (articles.length === 0) {
      return FALLBACK_NEWS;
    }

    return articles.slice(0, 6).map((article, idx) => {
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
  } catch {
    return FALLBACK_NEWS;
  }
}

function toSseChunk(event: string, payload: unknown) {
  return `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
}

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  let cancelled = false;
  let interval: NodeJS.Timeout | null = null;
  let heartbeat: NodeJS.Timeout | null = null;
  let controllerRef: ReadableStreamDefaultController<Uint8Array> | null = null;

  const cleanup = () => {
    if (cancelled) return;
    cancelled = true;
    if (interval) clearInterval(interval);
    if (heartbeat) clearInterval(heartbeat);
    interval = null;
    heartbeat = null;
    try {
      controllerRef?.close();
    } catch {
      // Stream may already be closed.
    }
    controllerRef = null;
  };

  const safeEnqueue = (chunk: string) => {
    if (cancelled || !controllerRef) return false;
    try {
      controllerRef.enqueue(encoder.encode(chunk));
      return true;
    } catch {
      cleanup();
      return false;
    }
  };

  request.signal.addEventListener('abort', cleanup);

  const stream = new ReadableStream({
    start(controller) {
      controllerRef = controller;

      const push = async () => {
        if (cancelled) return;

        try {
          const news = await fetchLatestNews();
          safeEnqueue(toSseChunk('news', { news, updatedAt: new Date().toISOString() }));
        } catch {
          safeEnqueue(
            toSseChunk('news', {
              news: FALLBACK_NEWS,
              updatedAt: new Date().toISOString(),
            })
          );
        }
      };

      void push();
      interval = setInterval(() => {
        void push();
      }, 15000);

      heartbeat = setInterval(() => {
        if (!cancelled) safeEnqueue(': keepalive\n\n');
      }, 12000);

      safeEnqueue(': connected\n\n');
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
