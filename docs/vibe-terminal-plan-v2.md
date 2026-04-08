# VIBE TERMINAL — Implementation Plan v2.0

**Date**: 2026-04-07  
**Team**: Rotten Makers (Rubio: Engineering, Gadissa: Research, Clarice: Design)  
**Project**: Vibe Trading → VIBE TERMINAL  
**Tech**: Next.js 14, Supabase (Auth + DB + Storage), Tailwind v3, Framer Motion  
**Constraint**: FREE infrastructure only. ZERO signals.

---

## Architecture Overview
- **Frontend**: Next.js 14 (App Router), Vercel.
- **Backend/DB**: Supabase (PostgreSQL, Auth, Realtime, Storage, Edge Functions).
- **Data Feeds**: Finnhub (News/Calendar), Polymarket (Fed Watch), YouTube API (Streams), Frankfurter (FX), NewsAPI.
- **Caching**: SWR/React Query + ISR. Supabase Materialized Views for heavy queries.

---

## Phase 1 — Foundation & Authentication
**Team**: Rubio (Code), Clarice (Design)

### Tasks
1. **Project Setup**: Upgrade site from landing page to dashboard app shell.
2. **Supabase Integration**: Client setup, Auth UI (Login/Signup), Middleware.
3. **Database Schema**: `profiles`, `streams`, `news_cache`, `calendar_events`.
4. **Ticker Bar**: Persistent live ticker (Frankfurter + Finnhub).

### Supabase Auth Strategy
- **Provider**: Email/Password + Google OAuth.
- **Roles**: `visitor`, `member`, `contributor`, `admin`. Stored in `user_profiles` table.
- **Middleware**: Protect `/dashboard`, `/admin`, `/articles/write`.

### Deliverables
- Working Auth flow (Login/Signup/Reset).
- Protected `/dashboard` route.
- `profiles` table synced with Auth users.

---

## Phase 2 — News & Calendar (The "Terminal" Core)
**Team**: Rubio (Code), Gadissa (API Research)

### Tasks
1. **News Feed**: Finnhub + NewsAPI aggregation into `news_cache` table.
2. **Ticker Bar**: Live top-bar ticker cycling headlines.
3. **Economic Calendar**: Finnhub calendar endpoint → DB + UI with "Why This Matters" notes.
4. **Weekly Sentiment**: Admin-posted block at top of calendar.

---

## Phase 3 — Fed Watch Tool
**Team**: Rubio (Code), Gadissa (Polymarket/FRED Research)

### Tasks
1. **Polymarket Integration**: Gamma API fetcher → `fed_probabilities` table.
2. **UI Components**: Rate gauge, meeting timeline, path chart.
3. **Fallback Logic**: CME scrape/FRED API integration.

---

## Phase 4 — Content Layer
**Team**: Clarice (Design), Rubio (Code), Gadissa (CMS Structure)

### Tasks
1. **Article System**: `articles`, `comments`, `likes`, `followers`.
2. **Rich Text Editor**: TipTap integration.
3. **Contributor Flow**: Application → Admin Approval → Verified Badge.
4. **Author Profiles**: Bio, stats, follower management.

---

## Phase 5 — Book Map (Live Streams)
**Team**: Rubio (Code)

### Tasks
1. **Live Stream Hub**: YouTube IFrame embeds for Gold, ES, NQ, etc.
2. **Admin Management**: CMS to add/update stream URLs.
3. **Status Detection**: YouTube Data API polling for LIVE/OFFLINE.

---

## Phase 6 — Trader Game Section
**Team**: Rubio (Code)

### Tasks
1. **Quiz Engine**: Question bank, session management, scoring.
2. **Leaderboard**: Global + Weekly (pg_cron reset).
3. **Gamification**: Badges, streaks, "Top Trader" profile tag.

---

## Risk & Mitigation
| Risk | Impact | Mitigation |
|------|--------|------------|
| API Rate Limits | High | Cache aggressively in Supabase. Use multiple free keys. |
| Supabase Free Tier Limits | Medium | Optimize queries. Use Edge Functions for heavy lifting. |
| YouTube API Quota | Medium | Cache stream status. Poll smartly only for "Live" channels. |
| Data Freshness | High | Realtime subscriptions for critical data (Calendar during events). |

---

## Next Steps (Immediate)
1. **Rubio**: Setup Supabase Project, Auth UI, and Database Schema.
2. **Clarice**: Design System v2 (Dark Terminal Aesthetic).
3. **Gadissa**: Confirm API endpoints for all 6 pillars and collect free keys.
