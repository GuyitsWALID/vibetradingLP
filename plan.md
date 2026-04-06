# Vibe Trading — Implementation Plan

**Date**: 2026-04-05  
**Author**: RUBY (Senior Software Engineer Agent)  
**Version**: 1.0

---

## Phase 1: MVP (Weeks 1-4)

> **Goal**: Live dashboard, economic calendar, basic signal feed, JWT auth, dark theme.

### Week 1: Foundation & Infrastructure

| # | Task | Estimated Effort | Dependencies | Complexity |
|---|------|-----------------|--------------|------------|
| 1.1 | Next.js 14 project scaffold with App Router | 1h | — | 🟢 Low |
| 1.2 | Tailwind CSS v3 setup with brand colors (dark/light tokens) | 1h | 1.1 | 🟢 Low |
| 1.3 | PostgreSQL + Prisma setup (local SQLite for dev) | 1h | — | 🟢 Low |
| 1.4 | Database schema migration (users, signals, calendar tables) | 2h | 1.3 | 🟡 Medium |
| 1.5 | JWT auth middleware (login, register, refresh, httpOnly cookies) | 3h | 1.4 | 🟡 Medium |
| 1.6 | Role-based access control middleware + route guards | 2h | 1.5 | 🟡 Medium |
| 1.7 | Environment config (.env.example, validation with zod) | 0.5h | — | 🟢 Low |
| 1.8 | Base layout with dark mode toggle, navbar, footer | 2h | 1.2 | 🟢 Low |

**Week 1 Total**: ~12.5h

**Deliverable**: Running Next.js app with auth, DB schema, dark theme, base layout.

---

### Week 2: Economic Calendar & Forex Factory Integration

| # | Task | Estimated Effort | Dependencies | Complexity |
|---|------|-----------------|--------------|------------|
| 2.1 | Forex Factory scraper (Cheerio, polite crawling) | 3h | — | 🟡 Medium |
| 2.2 | RSS/XML calendar parser as fallback | 1.5h | — | 🟢 Low |
| 2.3 | Calendar ingest cron job (every 5 min, Node cron) | 2h | 2.1, 2.2 | 🟡 Medium |
| 2.4 | Redis caching layer (upcoming events, dedup) | 2h | 2.3 | 🟡 Medium |
| 2.5 | /api/calendar REST endpoint with filtering | 1h | 2.4 | 🟢 Low |
| 2.6 | Calendar UI component (table, impact colors, countdown) | 3h | 1.2, 2.5 | 🟡 Medium |
| 2.7 | Timezone-aware display (user preference) | 1h | 2.6 | 🟢 Low |
| 2.8 | Fallback static calendar data (bundled JSON) | 1h | 2.1 | 🟢 Low |

**Week 2 Total**: ~14.5h

**Deliverable**: Economic calendar scraping, caching, and UI with impact colors and countdown timers.

---

### Week 3: Real-time Price Data & Dashboard

| # | Task | Estimated Effort | Dependencies | Complexity |
|---|------|-----------------|--------------|------------|
| 3.1 | WebSocket server scaffold (Node.js ws, standalone) | 2h | — | 🟡 Medium |
| 3.2 | Market data provider integration (Twelve Data WS) | 2h | — | 🟡 Medium |
| 3.3 | Price ingestion → Redis publish → WS broadcast pipeline | 3h | 3.1, 3.2 | 🔴 High |
| 3.4 | WS client hook (useWebSocket, auto-reconnect, heartbeat) | 2h | 3.3 | 🟡 Medium |
| 3.5 | Live price ticker component (top bar strip) | 2h | 1.2, 3.4 | 🟢 Low |
| 3.6 | Price card components (bid/ask, change %, color coding) | 2h | 1.2, 3.4 | 🟢 Low |
| 3.7 | Dashboard layout (grid, card arrangement) | 2h | 1.2 | 🟢 Low |
| 3.8 | /api/prices/latest endpoint (cached) | 0.5h | 3.3 | 🟢 Low |

**Week 3 Total**: ~15.5h

**Deliverable**: Real-time price streaming, live dashboard with price cards and ticker.

---

### Week 4: Signal Feed & Signal Gating

| # | Task | Estimated Effort | Dependencies | Complexity |
|---|------|-----------------|--------------|------------|
| 4.1 | Signal CRUD API (POST, GET list, GET by id) | 2h | 1.5, 1.6 | 🟡 Medium |
| 4.2 | Signal gating: obscure entry/SL/TP for FREE users | 1.5h | 4.1 | 🟢 Low |
| 4.3 | Signal feed UI (card layout, thesis, direction, catalyst) | 3h | 1.2 | 🟡 Medium |
| 4.4 | Signal detail page (expandable, invalidation condition) | 2h | 1.2, 4.1 | 🟡 Medium |
| 4.5 | Upgrade CTA component (for obscured fields) | 1h | 4.2 | 🟢 Low |
| 4.6 | Signal creation form (Analyst+ only) | 2h | 4.1 | 🟢 Low |
| 4.7 | Signal status management (ACTIVE → HIT_TP/HIT_SL) | 1h | 4.1 | 🟢 Low |
| 4.8 | ISR revalidation for signal feed (60s stale-while-revalidate) | 0.5h | 4.1 | 🟢 Low |

**Week 4 Total**: ~13h

**MVP Deliverable**: Complete MVP with auth, calendar, live prices, signal feed with role-based gating.

**Phase 1 Total**: ~55h

---

## Phase 2: Squawk, Community Chat, Notifications, Mobile (Weeks 5-7)

### Week 5: Financial Juice Squawk Integration

| # | Task | Estimated Effort | Dependencies | Complexity |
|---|------|-----------------|--------------|------------|
| 5.1 | Financial Juice WS client in WS server | 2h | — | 🟡 Medium |
| 5.2 | Keyword extraction & impact scoring engine | 2h | — | 🟡 Medium |
| 5.3 | Deduplication (SHA-256 hash, Redis SET with TTL) | 1h | 5.2 | 🟢 Low |
| 5.4 | Squawk publish to Redis channels | 0.5h | 5.3 | 🟢 Low |
| 5.5 | Squawk WS channel for clients (global + per-tag) | 1h | 5.4 | 🟢 Low |
| 5.6 | Squawk UI component (scrolling feed, filter by tag) | 2h | 1.2, 5.5 | 🟡 Medium |
| 5.7 | Squawk REST API (recent headlines, filtered) | 0.5h | 5.4 | 🟢 Low |
| 5.8 | Fallback REST polling on WS disconnect | 2h | 5.1 | 🟡 Medium |

**Week 5 Total**: ~11h → Squawk stream live.

---

### Week 6: Community Chat + Event Threading

| # | Task | Estimated Effort | Dependencies | Complexity |
|---|------|-----------------|--------------|------------|
| 6.1 | Chat API (GET messages by eventPair, POST message) | 2h | 1.5 | 🟡 Medium |
| 6.2 | Chat UI (threaded by event pair, pinned admin messages) | 3h | 1.2 | 🟡 Medium |
| 6.3 | Reaction system (Bullish/Bearish/Neutral/Watching) | 2h | 6.1 | 🟢 Low |
| 6.4 | Role-gated posting (Member+ only) | 0.5h | 6.1 | 🟢 Low |
| 6.5 | Real-time chat updates (WS broadcast) | 1h | 6.1 | 🟢 Low |
| 6.6 | Chat thread list (all active event threads) | 1h | 6.1 | 🟢 Low |

**Week 6 Total**: ~9.5h → Community chat with event threads live.

---

### Week 7: Member Dashboard + Education + Mobile Optimization

| # | Task | Estimated Effort | Dependencies | Complexity |
|---|------|-----------------|--------------|------------|
| 7.1 | Member dashboard layout | 2h | — | 🟢 Low |
| 7.2 | Watchlist management (CRUD, price alerts) | 3h | 3.4 | 🔴 High |
| 7.3 | PnL tracker (manual entry, chart visualization) | 4h | — | 🔴 High |
| 7.4 | Education module structure (list, detail, progress) | 3h | — | 🟡 Medium |
| 7.5 | Education progress tracking (complete, resume) | 2h | 7.4 | 🟢 Low |
| 7.6 | Mobile responsive overhaul (bottom nav, swipeable) | 4h | all above | 🔴 High |
| 7.7 | Push notification setup (PWA, web push) | 2h | 7.2 | 🟡 Medium |

**Week 7 Total**: ~20h → Full member dashboard live.

**Phase 2 Total**: ~40.5h

---

## Phase 3: Advanced Features (Weeks 8-10)

### Week 8: Analyst Verification + Advanced Analytics

| # | Task | Estimated Effort | Dependencies | Complexity |
|---|------|-----------------|--------------|------------|
| 8.1 | Analyst verification workflow (badges, reputation score) | 3h | — | 🟡 Medium |
| 8.2 | Signal performance tracking (win rate, avg pips, accuracy) | 3h | Phase 2.3 | 🟡 Medium |
| 8.3 | Intermarket correlation panel (USD vs Gold, bonds, yields) | 4h | Phase 1.3 | 🔴 High |
| 8.4 | Central bank interest rate tracker (comparison table) | 2h | — | 🟢 Low |
| 8.5 | Yield curve visualizer (chart using Recharts) | 3h | — | 🔴 High |
| 8.6 | Advanced signal filtering (by pair, catalyst, confidence) | 2h | Phase 1.4 | 🟢 Low |

**Week 8 Total**: ~17h

---

### Week 9: Performance Optimization + Admin Tools

| # | Task | Estimated Effort | Dependencies | Complexity |
|---|------|-----------------|--------------|------------|
| 9.1 | React Performance: memo, shouldComponentUpdate, virtual lists | 3h | — | 🟡 Medium |
| 9.2 | API caching optimization (SWR, proper cache headers) | 2h | — | 🟢 Low |
| 9.3 | Admin panel (user management, signal approval, audit log) | 4h | — | 🟡 Medium |
| 9.4 | Calendar sync: ICS export for Google/Outlook | 2h | Phase 1.2 | 🟢 Low |
| 9.5 | Pre-event countdown webhooks (30m, 15m, 5m alerts) | 2h | Phase 1.4 | 🟡 Medium |
| 9.6 | Load testing (WS connections, API throughput) | 2h | — | 🟢 Low |

**Week 9 Total**: ~15h

---

### Week 10: Polish, Security, Deployment

| # | Task | Estimated Effort | Dependencies | Complexity |
|---|------|-----------------|--------------|------------|
| 10.1 | Security audit (input validation, rate limiting, headers) | 3h | — | 🟡 Medium |
| 10.2 | Error boundaries, fallback UIs, offline states | 2h | — | 🟢 Low |
| 10.3 | Production deployment (Vercel frontend, Railway backend) | 2h | — | 🟡 Medium |
| 10.4 | Monitoring setup (Sentry, health checks, uptime) | 2h | 10.3 | 🟢 Low |
| 10.5 | Documentation (API docs, runbooks, README) | 2h | — | 🟢 Low |
| 10.6 | Testing (Unit, E2E with Playwright, load testing) | 4h | — | 🟡 Medium |
| 10.7 | Analytics integration (Plausible/Fathom, privacy-first) | 1h | — | 🟢 Low |

**Week 10 Total**: ~16h

**Phase 3 Total**: ~48h

---

## Grand Total Effort

| Phase | Weeks | Effort |
|-------|-------|--------|
| Phase 1 (MVP) | 4 | ~55h |
| Phase 2 (Squawk + Chat + Dashboard) | 3 | ~40.5h |
| Phase 3 (Advanced) | 3 | ~48h |
| **Total** | **10** | **~143.5h** |

---

## Dependencies Map (Critical Path)

```
1.1 Next.js Scaffold ──→ 1.2 Tailwind ──→ 1.8 Base Layout
                                      └─→ 2.6 Calendar UI
                                      └─→ 3.5 Price Cards
                                      └─→ 4.3 Signal Feed

1.3 Prisma Setup ──→ 1.4 Schema ──→ 1.5 JWT Auth ──→ 1.6 RBAC
                                              └─→ 4.1 Signal CRUD
                                              └─→ 5.6 Squawk UI

2.1 FF Scraper ──→ 2.3 Cron ──→ 2.4 Cache ──→ 2.5 API ──→ Calendar

3.1 WS Server ──→ 3.2 Twelve Data ──→ 3.3 Pipeline ──→ 3.4 WS Hook

Phase 1 ──→ Phase 2 (squawk needs WS server, chat needs auth)
Phase 2 ──→ Phase 3 (dash needs watchlist, dash needs PnL)
```

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Forex Factory blocks scraping | High | High | Cache aggressively, use RSS/XML fallback, bundle static data |
| Financial Juice WS unstable | Medium | High | REST polling fallback, graceful degradation |
| Twelve Data rate limits (free) | High | Medium | Cache prices, reduce symbol count, upgrade when revenue |
| WS server scaling limits | Medium | Medium | Redis pub/sub architecture enables horizontal scaling |
| Mobile performance on data-heavy views | High | Medium | Pagination, virtual lists, defer non-critical data |
| Signal quality/reputation risk | Medium | High | Analyst-only posting, track performance transparently |

---

## Implementation Order Summary

```
1. Scaffold + Auth + DB (Week 1)
    ↓
2. Calendar Pipeline + UI (Week 2)
    ↓
3. Real-time Prices + Dashboard (Week 3)
    ↓
4. Signal Feed + Gating (Week 4) → 🎯 MVP COMPLETE
    ↓
5. Squawk Integration (Week 5)
    ↓
6. Community Chat (Week 6)
    ↓
7. Member Dashboard + Mobile (Week 7) → Phase 2 COMPLETE
    ↓
8. Advanced Analytics (Week 8)
    ↓
9. Optimization + Admin (Week 9)
    ↓
10. Polish + Deploy (Week 10) → Phase 3 COMPLETE
```
