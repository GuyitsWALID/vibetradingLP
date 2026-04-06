# Vibe Trading — System Architecture

**Date**: 2026-04-05  
**Author**: RUBY (Senior Software Engineer Agent)  
**Version**: 1.0  
**Status**: Draft

---

## 1. System Overview

Vibe Trading is a fundamentals-first forex & macro trading community platform. It delivers real-time market data, economic calendar intelligence, news squawk feeds, thesis-driven signals, and community interaction — all gated by a role-based access model.

### Core Principles
- **Fundamentals-first**: Every UI element ties back to macro reasoning
- **Real-time low-latency**: WebSocket architecture for price updates and squawk
- **Cache-heavy**: Aggressive caching for external data to respect rate limits
- **Role-based gating**: Free users see thesis; paid see exact levels
- **Mobile-first**: Bottom-nav, swipeable cards, collapsible details

---

## 2. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript | SSR/SSG for SEO, Server Components for data-heavy views |
| **Styling** | Tailwind CSS v3, CSS Variables for theming | Utility-first, dark-mode default, brand tokens |
| **Backend** | Next.js API Routes + standalone WS server (Node.js/ws) | Unified codebase, WS needs standalone for scale |
| **Database** | PostgreSQL (Prisma ORM) — SQLite for local dev | Relational integrity, easy migration path |
| **Caching** | Redis (upstash/serverless for MVP) | Pub/sub for WS, rolling cache for calendar data |
| **Auth** | JWT (jsonwebtoken) + httpOnly cookies + bcrypt | Stateless auth, WS handshake via signed tokens |
| **Real-time** | WebSocket (ws library) + Redis pub/sub | Sub-second price ticks, squawk stream distribution |
| **Deployment** | Vercel (frontend) + Fly.io/Railway (WS server + DB) | Serverless frontend, persistent WS backend |

### Brand Colors
- Background: `#0B0F14` (charcoal)
- Primary: `#00A3FF` (electric blue)
- Secondary: `#D4AF37` (muted gold)
- Bullish: `#00D26A`
- Bearish: `#FF4757`

---

## 3. System Architecture Diagram

```
                    ┌─────────────────────────────────────────────┐
                    │                CLIENTS                       │
                    │  Browser (Next.js SSR/CSR) / Mobile PWA     │
                    └──────────────┬──────────────────────────────┘
                                   │ HTTPS + WSS
                    ┌──────────────▼──────────────────────────────┐
                    │            VERCEL (CDN + Edge)               │
                    │  Next.js 14 App Router / API Routes          │
                    └──┬──────────┬──────────┬──────────┬──────────┘
                       │          │          │          │
           ┌───────────▼───┐ ┌───▼────────┐ │ ┌──────▼──────────┐
           │ API: Auth     │ │ API: Data  │ │ │ API: Signals    │
           │ JWT / Session │ │ Calendar   │ │ │ Thesis / PnL    │
           └───────┬───────┘ └─────┬──────┘ │ └──────┬──────────┘
                   │               │        │        │
        ┌──────────▼───────────────▼────────▼────────▼──────────┐
        │                  REDIS (Cache + Pub/Sub)               │
        │  - Calendar data (24h rolling TTL)                    │
        │  - Live price cache (1s TTL)                          │
        │  - Squawk dedup keys                                  │
        │  - Rate limiting counters                             │
        │  - WS channel pub/sub hub                             │
        └──┬────────────────────────────┬───────────────────────┘
           │                            │
    ┌──────▼──────┐            ┌────────▼────────┐
    │ PostgreSQL  │            │ WS Server        │
    │ (Prisma)    │            │ (Fly.io/Railway) │
    │             │            │                  │
    │ Users       │            │ Subscriptions:   │
    │ Signals     │   ┌────────│ - prices:{pair}  │
    │ Calendar    │   │        │ - squawk:global  │
    │ Chat msgs   │   │        │ - squawk:{tag}   │
    │ Education   │   │        │ - alerts:{uid}   │
    └─────────────┘   │        └──┬───────┬───────┘
                      │           │       │
                ┌─────▼────┐ ┌────▼─────┐ │
                │ Forex    │ │ Financial│ │
                │ Factory  │ │ Juice WS │ │
                │ Calendar │ │ Squawk   │ │
                └──────────┘ └──────────┘ │
                           ┌──────────────▼──────┐
                           │ Market Data Provider│
                           │ (Twelve Data /      │
                           │  Finnhub WS)        │
                           └─────────────────────┘
```

---

## 4. Data Flow

### 4.1 Real-time Price Pipeline
```
Market Data WS (Twelve Data)
        │
        ▼
Price Ingest Service (Node.js ws server)
        │
        ├─ Validate & normalize tick
        ├─ Calculate simple SMA/volatility for anomaly detection
        ├─ Publish to Redis: "prices:EURUSD" → latest price
        └─ Broadcast to subscribed WS clients via Redis pub/sub
                │
                ▼
        Client WS (browser receives tick)
                │
                ▼
        React state update → price card re-render
```

### 4.2 Economic Calendar Pipeline
```
Forex Factory (scrape/RSS)
        │  ← every 5 minutes
        ▼
Calendar Ingest Service
        │
        ├─ Parse HTML/JSON → structured events
        ├─ Classify impact: Red(3) / Orange(2) / Yellow(1)
        ├─ Normalize fields: title, country, impact, time(UTC),
        │   forecast, previous, actual
        └─ Cache in Redis (TTL 24h for historical, 1h for upcoming)
                │
                └─ Persist to PostgreSQL for signal history
                        │
                        ▼
                Next.js API Route /calendar
                        │
                        ▼
                Server Component (RSC) fetches from Postgres + Redis
```

### 4.3 News Squawk Pipeline
```
Financial Juice WebSocket
        │
        ▼
Squawk Consumer (Node.js ws server)
        │
        ├─ Tag extraction (keyword: Fed, ECB, CPI, NFP, GDP, Rate)
        ├─ Deduplication: hash headline → Redis SET (TTL 5min)
        ├─ Impact scoring based on keyword weight
        └─ Publish to Redis channels:
           - squawk:global (all squawk)
           - squawk:fed
           - squawk:ecb
           - squawk:high-impact (score >= threshold)
                │
                ▼
        WS Server broadcasts to subscribed clients
        Client filters by user preference
```

---

## 5. API Design

### 5.1 REST Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Login, returns JWT (httpOnly cookie) |
| POST | `/api/auth/refresh` | Public | Refresh token |
| POST | `/api/auth/logout` | Auth | Invalidate session |
| GET | `/api/prices/latest` | Public | Latest cached prices for major pairs |
| GET | `/api/calendar` | Public | Economic events (filtered by date, impact) |
| GET | `/api/calendar/:id` | Public | Single event detail |
| GET | `/api/squawk` | Member+ | Recent squawk headlines |
| GET | `/api/signals` | Free (gated) | Signal feed (free sees thesis, paid sees levels) |
| POST | `/api/signals` | Analyst+ | Create signal |
| GET | `/api/signals/:id` | Free (gated) | Signal detail |
| GET | `/api/chat/:eventPair` | Member+ | Threaded messages for event pair |
| POST | `/api/chat/:eventPair` | Member+ | Post message |
| GET | `/api/dashboard` | Auth | User dashboard data (watchlist, PnL, progress) |
| PUT | `/api/dashboard/watchlist` | Auth | Update watchlist |
| GET | `/api/education` | Auth | Course modules |
| GET | `/api/education/:id` | Member+ | Module content |
| POST | `/api/education/:id/complete` | Member+ | Mark complete |
| GET | `/api/admin/audit` | Admin | Audit log |

### 5.2 WebSocket Protocol

All WS connections require a JWT token passed in the query string on connect.

#### Connection
```
wss://ws.vibetrading.com/connect?token=<jwt>
```

#### Client → Server Messages
```json
// Subscribe to channel
{ "action": "subscribe", "channel": "prices:EURUSD" }
{ "action": "subscribe", "channel": "squawk:high-impact" }
{ "action": "subscribe", "channel": "squawk:fed" }
{ "action": "subscribe", "channel": "alerts" }

// Unsubscribe
{ "action": "unsubscribe", "channel": "prices:EURUSD" }

// Heartbeat (server sends, client responds)
{ "action": "pong", "ts": 1700000000000 }
```

#### Server → Client Messages
```json
// Price tick
{
  "type": "price",
  "channel": "prices:EURUSD",
  "data": {
    "pair": "EURUSD",
    "bid": 1.0842,
    "ask": 1.0844,
    "change": 0.12,
    "changePercent": 0.11,
    "ts": 1700000000000
  }
}

// Squawk
{
  "type": "squawk",
  "data": {
    "headline": "COLUMBIA: FED'S WALLER SAYS...",
    "source": "FJ",
    "tags": ["fed", "high-impact"],
    "score": 8,
    "ts": 1700000000000
  }
}

// Price alert (based on user watchlist thresholds)
{
  "type": "alert",
  "data": {
    "pair": "EURUSD",
    "message": "EUR/USD approaching resistance at 1.0850",
    "ts": 1700000000000
  }
}

// Heartbeat
{ "type": "ping", "ts": 1700000000000 }
```

#### Available Channels
| Channel | Access | Description |
|---------|--------|-------------|
| `prices:EURUSD` | Public | EUR/USD live price |
| `prices:GBPUSD` | Public | GBP/USD live price |
| `prices:XAUUSD` | Public | Gold/USD live price |
| `prices:US30` | Member+ | US30 index live price |
| `prices:*` | All pairs | Subscribe to all tracked |
| `squawk:global` | Member+ | All squawk headlines |
| `squawk:high-impact` | Member+ | Filtered by impact score |
| `squawk:fed` | Free | Fed/Central bank squawk only |
| `squawk:ecb` | Member+ | ECB squawk |
| `alerts` | Auth | User-specific price alerts |

---

## 6. Database Schema

```prisma
// schema.prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  username      String    @unique
  passwordHash  String
  role          Role      @default(FREE)
  displayName   String?
  avatarUrl     String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLoginAt   DateTime?
  
  watchlist     WatchlistItem[]
  pnlEntries    PnLEntry[]
  educationProgress EducationProgress[]
  postedSignals Signal[]
  chatMessages  ChatMessage[]
  
  @@index([role])
  @@index([email])
}

enum Role {
  FREE
  MEMBER
  ANALYST
  ADMIN
}

model WatchlistItem {
  id      String   @id @default(cuid())
  user    User     @relation(fields: [userId], references: [id])
  userId  String
  pair    String   // "EURUSD", "XAUUSD", etc.
  alertAbove Float?
  alertBelow Float?
  createdAt DateTime @default(now())
  
  @@unique([userId, pair])
}

model PnLEntry {
  id        String    @id @default(cuid())
  user      User      @relation(fields: [userId], references: [id])
  userId    String
  pair      String
  direction String    // "LONG" | "SHORT"
  entry     Float
  exit      Float?
  stopLoss  Float?
  takeProfit Float?
  result    Float?    // PnL in pips
  status    String    // "OPEN" | "CLOSED" | "STOPPED"
  signalId  String?
  notes     String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  
  @@index([userId, status])
}

model Signal {
  id          String    @id @default(cuid())
  author      User      @relation(fields: [authorId], references: [id])
  authorId    String
  
  pair        String
  direction   String    // "LONG" | "SHORT"
  
  // Thesis (visible to all roles)
  thesis      String
  catalyst    String
  riskPercent Float
  
  // Execution levels (visible to MEMBER+, obscured for FREE)
  entry       Float?
  stopLoss    Float?
  takeProfit  Float?
  
  invalidation String   // "What invalidates this trade"
  status       String   // "ACTIVE" | "HIT_TP" | "HIT_SL" | "MANUAL_CLOSE"
  
  tags         String[] // ["CPI", "USD", "HIGH_IMPACT"]
  eventPair    String?  // links to calendar event
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  @@index([pair, status])
  @@index([eventPair])
}

model ChatMessage {
  id        String    @id @default(cuid())
  author    User      @relation(fields: [authorId], references: [id])
  authorId  String
  eventPair String    // "USD-CPI", "EUR-ECB" — threads by event
  content   String
  pinned    Boolean   @default(false)
  
  reactions Json?     // { "BULLISH": ["uid1", "uid2"], "BEARISH": [...] }
  
  createdAt DateTime  @default(now())
  
  @@index([eventPair, createdAt])
  @@index([authorId])
}

model EconomicEvent {
  id          String    @id @default(cuid())
  title       String
  country     String    // "USD", "EUR", "GBP", etc.
  impact      Int       // 1=low, 2=med, 3=high
  timeUTC     DateTime
  forecast    String?
  previous    String?
  actual      String?
  currency    String?   // affected currency
  source      String    @default("forex_factory")
  
  signals     Signal[]  @relation("eventPair")
  chatThreads ChatMessage[]
  
  createdAt   DateTime  @default(now())
  
  @@unique([title, timeUTC, source])
  @@index([timeUTC])
  @@index([impact])
}

model SquawkEntry {
  id        String    @id @default(cuid())
  headline  String
  source    String    // "FJ" = Financial Juice
  tags      String[]  // ["fed", "ecb", "cpi"]
  score     Int       // impact score 1-10
  hash      String    @unique // dedup hash
  timeUTC   DateTime
  createdAt DateTime  @default(now())
  
  @@index([timeUTC])
  @@index([score])
}

model EducationModule {
  id          String    @id @default(cuid())
  title       String
  description String
  content     String    // Markdown
  category    String    // "basics", "central_banks", "indicators"
  order       Int
  isPremium   Boolean   @default(false)
  youtubeUrl  String?
  createdAt   DateTime  @default(now())
}

model EducationProgress {
  id        String    @id @default(cuid())
  user      User      @relation(fields: [userId], references: [id])
  userId    String
  module    EducationModule @relation(fields: [moduleId], references: [id])
  moduleId  String
  completed Boolean   @default(false)
  completedAt DateTime?
  
  @@unique([userId, moduleId])
}
```

---

## 7. Role-Based Access Control

### 7.1 Access Matrix

| Feature | Free | Member | Analyst | Admin |
|---------|------|--------|---------|-------|
| Live prices (majors) | ✓ | ✓ | ✓ | ✓ |
| Live prices (all pairs) | — | ✓ | ✓ | ✓ |
| Economic calendar | ✓ | ✓ | ✓ | ✓ |
| Squawk (Fed tags only) | ✓ | ✓ | ✓ | ✓ |
| Squawk (full stream) | — | ✓ | ✓ | ✓ |
| Signal thesis (summary) | ✓ | ✓ | ✓ | ✓ |
| Signal levels (entry/SL/TP) | Obscured | ✓ | ✓ | ✓ |
| Chat (read) | ✓ | ✓ | ✓ | ✓ |
| Chat (post) | — | ✓ | ✓ | ✓ |
| PnL tracker | — | ✓ | ✓ | ✓ |
| Education (basics) | ✓ | ✓ | ✓ | ✓ |
| Education (premium) | — | ✓ | ✓ | ✓ |
| Create signals | — | — | ✓ | ✓ |
| Manage users | — | — | — | ✓ |
| Audit log | — | — | — | ✓ |

### 7.2 Signal Gating

FREE users see:
- Pair, direction, catalyst
- Full thesis text
- Risk %
- Status
- Invalidation condition
- Entry/SL/TP → **"[Upgrade to see levels]"**

MEMBER+ users see full signal with exact levels.

Implementation: API checks `req.user.role`, if FREE, returns `null` for sensitive fields. Client renders upgrade CTA.

---

## 8. WebSocket Architecture

### 8.1 WS Server Design
```
┌─────────────────────────────────────┐
│        WS Server (Node.js/ws)       │
│                                     │
│  ┌────────────────────────┐        │
│  │   Auth Middleware      │  JWT verify on connect
│  └──────────┬─────────────┘        │
│             │                      │
│  ┌──────────▼─────────────┐        │
│  │   Connection Manager   │  Track active connections
│  │   Map<token, ws[]>     │  by user, by channel
│  └──────────┬─────────────┘        │
│             │                      │
│  ┌──────────▼─────────────┐        │
│  │   Subscription Registry│  Which user → which channels
│  └──────────┬─────────────┘        │
│             │                      │
│  ┌──────────▼─────────────┐        │
│  │   Redis Subscriber     │  Listens to pub/sub channels
│  │   → broadcast to ws    │  → pushes to subscribed clients
│  └────────────────────────┘        │
└─────────────────────────────────────┘
```

### 8.2 Redis Pub/Sub Channels
```
redis.publish("prices:EURUSD", JSON.stringify(tick))   // all EURUSD subs get it
redis.publish("squawk:global", JSON.stringify(item))   // all squawk subs
redis.publish("alerts:user_abc123", JSON.stringify(a)) // specific user alerts
```

### 8.3 Reconnection & Heartbeat
- Server sends `ping` every 30s
- Client must respond with `pong` within 10s
- No pong → disconnect → cleanup
- Client auto-reconnects with exponential backoff (1s, 2s, 4s, max 30s)

---

## 9. Forex Factory Integration

### 9.1 Approach: Cache-Heavy Hybrid

**Primary**: Scrape Forex Factory calendar page
**Fallback**: Static bundled calendar data for common events
**Cache**: Redis with tiered TTL

```python
# Ingest Strategy (runs every 5 min via Node cron)
1. GET forex_factory.com/calendar.php
2. Parse table rows with Cheerio
3. Extract: Date, Time, Currency, Impact (colored dot), Event, Actual, Forecast, Previous
4. Normalize impact: red_dot=3, orange_dot=2, yellow_dot=1, gray=0
5. Hash each event (title + timeUTC) for dedup
6. UPSERT into PostgreSQL
7. Cache "upcoming 7 days" in Redis (TTL 1 hour)
8. Cache "all events this week" in Redis (TTL 24 hours)
```

### 9.2 Rate Limit Protection
- Max 1 scrape per 5 minutes
- Respect `robots.txt`
- Rotate User-Agent headers
- If blocked → serve cached data + display "data may be stale" badge
- If cache expired → serve fallback static data

### 9.3 Calendar Data Model in Redis
```json
{
  "cal:upcoming": [
    {
      "id": "evt_...",
      "title": "US Nonfarm Payrolls",
      "country": "USD",
      "impact": 3,
      "timeUTC": "2026-04-07T12:30:00Z",
      "forecast": "180K",
      "previous": "150K",
      "actual": null,
      "countdownSeconds": 3600,
      "tags": ["NFP", "employment", "high-impact"]
    }
  ]
}
```

---

## 10. Financial Juice Squawk Integration

### 10.1 Processing Pipeline
```
FJ WebSocket
    │
    ▼
┌──────────────────┐
│ Raw Text Line    │  "COLUMBIA: FED CUTS RATES BY 25BPS"
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Keyword Extract  │  Match against weighted dictionary
│                  │  fed=5, ecb=5, rate=4, cpi=5, nfp=5, gdp=3
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Hash + Dedup     │  SHA-256 of normalized headline
│                  │  Check Redis SET (TTL 5min)
└────────┬─────────┘
         │
         ▼  (not a dup)
┌──────────────────┐
│ Store + Publish  │  Save to Postgres (last 24h)
│                  │  Redis pub/sub to WS subscribers
└──────────────────┘
```

### 10.2 Fallback Strategy
If WS disconnects:
1. Attempt reconnect 3x with 2s backoff
2. If still down → poll FJ REST API every 30s
3. If both down → display "Squawk unavailable" with cached headlines

---

## 11. Caching Strategy

| Data | Cache Layer | TTL | Invalidation |
|------|------------|-----|-------------|
| Latest prices | Redis (string) | 1 second | Overwrite on each tick |
| Price history (1h) | Redis (list) | 1 hour | Append + trim |
| Calendar upcoming | Redis (list) | 1 hour | Refresh on scrape |
| Calendar history | Redis (list) | 24 hours | Refresh on scrape |
| Squawk headlines | Redis (list) | 2 hours | Append on new |
| Squawk dedup | Redis (set) | 5 minutes | Auto-expire |
| Signal feed | Next.js ISR | 60 seconds | On new signal POST |
| Education modules | Next.js SSG | Revalidate on change | Admin edit triggers |
| User dashboard | Redis (hash) | 30 seconds | On PnL update |

---

## 12. Third-Party Integrations

| Service | Purpose | Auth | Cost |
|---------|---------|------|------|
| Forex Factory | Economic calendar | None (scrape) | Free |
| Financial Juice | News squawk WS | API key | ~$30-50/mo |
| Twelve Data | Forex/commodity prices | API key | Free tier available |
| Vercel | Frontend hosting | Account | Free → Pro |
| Fly.io / Railway | WS server + Redis + Postgres | Account | ~$10-30/mo |

---

## 13. Deployment Topology

```
┌───────────────────────────────────────────────────┐
│                    VERCEL                          │
│  ┌─────────────────┐  ┌─────────────────────┐     │
│  │ Next.js SSR     │  │ Next.js API Routes  │     │
│  │ (Dashboard,     │  │ (/api/signals,      │     │
│  │  Calendar,      │  │  /api/calendar,     │     │
│  │  Signals, Chat) │  │  /api/auth)         │     │
│  └─────────────────┘  └──────────┬──────────┘     │
│                                  │                 │
└──────────────────────────────────┼─────────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │        RAILWAY / FLY.IO     │
                    │                             │
                    │  ┌───────────────────────┐  │
                    │  │ WebSocket Server      │  │
                    │  │ (ws:// or wss://)     │  │
                    │  │ - Price broadcast     │  │
                    │  │ - Squawk stream       │  │
                    │  │ - Alert engine        │  │
                    │  └───────────┬───────────┘  │
                    │              │              │
                    │  ┌───────────▼───────────┐  │
                    │  │ Redis (Upstash)       │  │
                    │  │ - Cache               │  │
                    │  │ - Pub/Sub             │  │
                    │  │ - Rate limiting       │  │
                    │  └───────────┬───────────┘  │
                    │              │              │
                    │  ┌───────────▼───────────┐  │
                    │  │ PostgreSQL            │  │
                    │  │ - Users, Signals,     │  │
                    │  │   Calendar, Chat      │  │
                    │  └───────────────────────┘  │
                    └─────────────────────────────┘
```

### Environment Variables
```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/vibetrading"

# Redis
REDIS_URL="redis://host:6379"

# JWT
JWT_SECRET="<strong-secret>"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_EXPIRES_IN="30d"

# Market Data
TWELVE_DATA_API_KEY="<key>"

# Financial Juice
FJ_API_KEY="<key>"
FJ_WS_URL="wss://api.financialjuice.com"

# Forex Factory
FF_CALENDAR_URL="https://nfs.faireconomy.media/ff_calendar_thisweek.xml"

# App
NEXT_PUBLIC_WS_URL="wss://ws.vibetrading.com"
NEXT_PUBLIC_SITE_URL="https://vibetrading.com"
```

---

## 14. Mobile Responsiveness Strategy

| Screen | Breakpoint | Strategy |
|--------|-----------|----------|
| Mobile | < 640px | Bottom nav, single-column, stacked cards, swipeable calendar |
| Tablet | 640-1024px | 2-column grid, persistent squawk sidebar, expandable signal cards |
| Desktop | > 1024px | 3+ column dashboard, persistent calendar sidebar, full chart views |

### Key Mobile Decisions
- Signal cards: Thesis always visible, levels require tap-to-expand (and auth check)
- Calendar: Horizontal scroll for dates, tap for event detail modal
- Squawk: Collapsible drawer from bottom, auto-dismiss after 5s
- Prices: Horizontal scrolling ticker strip, tap for detail modal
- Chat: Full-screen per thread, back button to thread list

---

## 15. Security Considerations

| Concern | Mitigation |
|---------|-----------|
| Auth hijacking | httpOnly cookies, secure flag, SameSite=strict |
| WebSocket auth | JWT in connect query, re-verify every 5 min |
| XSS | React escapes by default, sanitize user content with DOMPurify |
| CSRF | SameSite cookies, CSRF tokens on state-changing mutations |
| Rate limiting | Redis-based (100 req/min IP, 1000 req/min authenticated) |
| SQL injection | Prisma ORM parameterized queries |
| Scraping ethics | 5-min intervals, respect robots.txt, cache aggressively |
| Data integrity | PostgreSQL constraints, audit log for admin actions |

---

## 16. Performance Targets

| Metric | Target |
|--------|--------|
| TTFB (SSR pages) | < 500ms |
| WS latency (tick → render) | < 200ms |
| Calendar API response | < 100ms (cached) |
| Signal feed (ISR) | < 300ms |
| Squawk processing | < 50ms (in-memory) |
| Mobile LCP | < 2.5s |
| WS connections per server | 10,000+ |
