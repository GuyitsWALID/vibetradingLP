import { NextRequest, NextResponse } from 'next/server';

const RAPIDAPI_HOST = 'forex-factory-scraper1.p.rapidapi.com';

type CalendarEvent = {
  date: string | null;
  time: string;
  country: string;
  event: string;
  impact: string;
  forecast: string;
  previous: string;
};

type CalendarResponse = {
  events: CalendarEvent[];
  isLive: boolean;
};

const FALLBACK_CALENDAR = [
  {
    time: '13:30',
    country: 'US',
    event: 'NFP Non-Farm Payrolls',
    impact: 'high',
    forecast: '180K',
    previous: '205K',
  },
  {
    time: '15:00',
    country: 'EU',
    event: 'ECB Rate Decision',
    impact: 'high',
    forecast: '4.50%',
    previous: '4.50%',
  },
  {
    time: '10:00',
    country: 'UK',
    event: 'GDP QoQ',
    impact: 'medium',
    forecast: '0.1%',
    previous: '-0.1%',
  },
  {
    time: '08:30',
    country: 'CA',
    event: 'Trade Balance',
    impact: 'low',
    forecast: '2.1B',
    previous: '1.8B',
  },
];

function extractTag(xml: string, tagName: string) {
  const match = xml.match(new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, 'i'));
  return (match?.[1] || '').trim();
}

function decodeEntities(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripCdataArtifacts(value: string) {
  return value
    .replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1')
    .replace(/<!\[CDATA\[/gi, '')
    .replace(/\]\]>/g, '')
    .replace(/<!/g, '')
    .trim();
}

function normalizeTime(rawTime: string) {
  const cleaned = stripCdataArtifacts(rawTime);

  // Converts formats like 9:15am / 09:15PM -> 9:15 am / 09:15 pm
  const ampmMatch = cleaned.match(/^(\d{1,2}:\d{2})\s*([aApP][mM])$/);
  if (ampmMatch) {
    return `${ampmMatch[1]} ${ampmMatch[2].toLowerCase()}`;
  }

  return cleaned;
}

function normalizeImpact(rawImpact: string) {
  const impact = rawImpact.toLowerCase();

  if (impact.includes('high') || impact.includes('red')) {
    return 'high';
  }

  if (impact.includes('medium') || impact.includes('orange')) {
    return 'medium';
  }

  return 'low';
}

function getTodayUtcDateKey() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseEventDate(rawDate: string) {
  const cleaned = stripCdataArtifacts(rawDate)
    .replace(/,/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return null;

  // yyyy-mm-dd
  let match = cleaned.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) {
    const [, y, m, d] = match;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  // mm-dd-yyyy
  match = cleaned.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (match) {
    const [, m, d, y] = match;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  // mm/dd/yyyy
  match = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    const [, m, d, y] = match;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  const monthMap: Record<string, string> = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
  };

  // Thu Apr 9, Apr 9, Apr 9 2026
  const normalized = cleaned
    .replace(/^(mon|tue|wed|thu|fri|sat|sun)\s+/i, '')
    .toLowerCase();

  match = normalized.match(/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})(?:\s+(\d{4}))?$/);
  if (match) {
    const [, mon, day, year] = match;
    const y = year || String(new Date().getUTCFullYear());
    return `${y}-${monthMap[mon]}-${day.padStart(2, '0')}`;
  }

  const parsed = new Date(cleaned);
  if (!Number.isNaN(parsed.getTime())) {
    const year = parsed.getUTCFullYear();
    const month = String(parsed.getUTCMonth() + 1).padStart(2, '0');
    const day = String(parsed.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return null;
}

function getTimeSortScore(time: string) {
  const normalized = time.toLowerCase().trim();

  if (normalized.includes('all day')) return -1;
  if (normalized.includes('tentative')) return 9998;
  if (normalized === 'tba') return 9999;

  const match = normalized.match(/^(\d{1,2}):(\d{2})\s*([ap]m)$/);
  if (!match) return 9997;

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3];

  if (period === 'pm' && hour !== 12) hour += 12;
  if (period === 'am' && hour === 12) hour = 0;

  return hour * 60 + minute;
}

function toCountryCode(rawCountry: string) {
  const normalized = rawCountry.trim().toUpperCase();
  if (normalized.length <= 3) {
    return normalized;
  }
  return normalized.slice(0, 2);
}

function applyCalendarImpactPriority(events: CalendarEvent[]) {
  const highMedium = events.filter((item) => item.impact === 'high' || item.impact === 'medium');

  if (highMedium.length > 0) {
    return highMedium.slice(0, 8);
  }

  return events.filter((item) => item.impact === 'low').slice(0, 8);
}

function splitDateKey(dateKey: string) {
  const match = dateKey.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
}

function getRapidApiKey() {
  return (
    process.env.RAPIDAPI_KEY ||
    process.env.RAPID_API_KEY ||
    process.env.X_RAPIDAPI_KEY ||
    ''
  );
}

function normalizeRapidApiItem(item: Record<string, unknown>): CalendarEvent {
  const dateKey = parseEventDate(String(item.date ?? item.event_date ?? item.day ?? ''));
  const time = normalizeTime(String(item.time ?? item.event_time ?? item.eventTime ?? 'TBA'));
  const country = toCountryCode(String(item.currency ?? item.country ?? item.currency_code ?? item.ccy ?? 'NA'));
  const event = stripCdataArtifacts(String(item.event_name ?? item.event ?? item.title ?? 'Economic event'));
  const impact = normalizeImpact(String(item.impact ?? item.impact_level ?? item.volatility ?? 'low'));
  const forecast = stripCdataArtifacts(String(item.forecast ?? item.consensus ?? item.expected ?? 'N/A'));
  const previous = stripCdataArtifacts(String(item.previous ?? item.prior ?? item.last ?? 'N/A'));

  return {
    date: dateKey,
    time,
    country,
    event,
    impact,
    forecast,
    previous,
  };
}

async function fetchRapidApiCalendar(selectedDate: string) {
  const key = getRapidApiKey();
  const dateParts = splitDateKey(selectedDate);

  if (!key || !dateParts) {
    return null;
  }

  const baseParams = new URLSearchParams({
    year: String(dateParts.year),
    month: String(dateParts.month),
    day: String(dateParts.day),
    currency: 'ALL',
    event_name: 'ALL',
    timezone: 'GMT+00:00 UTC',
    time_format: '12h',
  });

  const endpoints = [
    `https://${RAPIDAPI_HOST}/get_real_time_calendar_details?calendar=Forex&${baseParams.toString()}`,
    `https://${RAPIDAPI_HOST}/get_calendar_details?${baseParams.toString()}`,
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': RAPIDAPI_HOST,
          'x-rapidapi-key': key,
        },
        next: { revalidate: 300 },
      });

      if (!response.ok) {
        continue;
      }

      const payload: any = await response.json();
      const rawItems: unknown[] =
        (Array.isArray(payload) ? payload : null) ||
        (Array.isArray(payload?.data) ? payload.data : null) ||
        (Array.isArray(payload?.result) ? payload.result : null) ||
        (Array.isArray(payload?.events) ? payload.events : null) ||
        [];

      const parsed: CalendarEvent[] = rawItems
        .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
        .map(normalizeRapidApiItem)
        .filter((item) => item.event && item.event !== 'Economic event' && item.date === selectedDate)
        .sort((a, b) => getTimeSortScore(a.time) - getTimeSortScore(b.time));

      const prioritized = applyCalendarImpactPriority(parsed);

      if (prioritized.length > 0) {
        return prioritized;
      }
    } catch {
      // Move to next endpoint candidate or fallback provider.
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  const selectedDate = request.nextUrl.searchParams.get('date') || getTodayUtcDateKey();

  try {
    const rapidApiEvents = await fetchRapidApiCalendar(selectedDate);
    if (rapidApiEvents) {
      const response: CalendarResponse = {
        events: rapidApiEvents,
        isLive: true,
      };
      return NextResponse.json(response);
    }

    const res = await fetch('https://nfs.faireconomy.media/ff_calendar_thisweek.xml', {
      next: { revalidate: 300 },
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!res.ok) {
      const response: CalendarResponse = {
        events: applyCalendarImpactPriority(FALLBACK_CALENDAR.map((item) => ({ ...item, date: selectedDate }))),
        isLive: false,
      };
      return NextResponse.json(response);
    }

    const xml = await res.text();
    const eventBlocks = xml.match(/<event>[\s\S]*?<\/event>/gi) || [];

    if (eventBlocks.length === 0) {
      const response: CalendarResponse = {
        events: applyCalendarImpactPriority(FALLBACK_CALENDAR.map((item) => ({ ...item, date: selectedDate }))),
        isLive: false,
      };
      return NextResponse.json(response);
    }

    const parsed = eventBlocks
      .map((block) => {
        const eventDate = parseEventDate(decodeEntities(extractTag(block, 'date')) || '');
        const time = normalizeTime(decodeEntities(extractTag(block, 'time')) || 'TBA');
        const country = toCountryCode(stripCdataArtifacts(decodeEntities(extractTag(block, 'country')) || 'NA'));
        const event = stripCdataArtifacts(decodeEntities(extractTag(block, 'title')) || 'Economic event');
        const impact = normalizeImpact(stripCdataArtifacts(decodeEntities(extractTag(block, 'impact')) || 'low'));
        const forecast = stripCdataArtifacts(decodeEntities(extractTag(block, 'forecast')) || 'N/A');
        const previous = stripCdataArtifacts(decodeEntities(extractTag(block, 'previous')) || 'N/A');

        return {
          date: eventDate,
          time,
          country,
          event,
          impact,
          forecast,
          previous,
        };
      })
      .filter((item) => item.event && item.event !== 'Economic event' && item.date === selectedDate)
      .sort((a, b) => getTimeSortScore(a.time) - getTimeSortScore(b.time));

    const prioritized = applyCalendarImpactPriority(parsed);

    const response: CalendarResponse = {
      events: prioritized,
      isLive: true,
    };

    return NextResponse.json(response);
  } catch {
    const response: CalendarResponse = {
      events: applyCalendarImpactPriority(FALLBACK_CALENDAR.map((item) => ({ ...item, date: selectedDate }))),
      isLive: false,
    };
    return NextResponse.json(response);
  }
}
