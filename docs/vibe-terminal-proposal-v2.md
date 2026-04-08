# VIBE TERMINAL Framework v2.0

VIBE TERMINAL
Product & Feature Framework  |  Full Tech Team Brief  |  v2.0
Prepared by:  Vibe Trading
Audience:  Trader Community — Internal Tech Team
Version:  1.0  —  Updated Build Specification
Status:  Final Framework & Instruction Document
Budget:  USD $0  —  Free APIs & Free Tier Infrastructure Only
1.  Executive Summary
VIBE TERMINAL is built by Vibe Trading to become the single destination every serious trader bookmarks. It replaces FinancialJuice, ForexFactory, CME FedWatch, and every other scattered tool with one clean, fast, community-powered platform. The product is content-led, data-driven, and built entirely on free infrastructure.
HARD RULE — There are ZERO signals on this platform. No trade calls, no buy/sell alerts, no signal rooms. This is a news, data, analysis, education, and community product only.
2.  Platform Pillars — Overview
#
Pillar
Replaces / Purpose
1
Book Map — Live Stream Hub
Free YouTube live stream consolidation for major assets
2
Finance Headlines — News Feed
Replaces FinancialJuice.com — multi-source real-time feed
3
Economic Calendar
Replaces ForexFactory calendar — with analyst notes & sentiment
4
Fed Watch Tool
Replaces CME FedWatch — free rate probability monitor
5
Article & Analysis Section
Official Vibe Trading analysis + verified community articles
6
Trader Game Section
Knowledge quizzes, leaderboard, community competition
PILLAR 1  BOOK MAP — LIVE STREAM HUB
Purpose: Consolidate free YouTube live streams for major assets so traders never have to hunt for a stream.
What to Build:
A dedicated 'Live Markets' page with embedded YouTube live stream players.
Asset coverage at launch: Gold (XAUUSD), S&P 500 Futures (ES), Nasdaq Futures (NQ), Crude Oil (CL), EUR/USD, BTC/USD.
Each stream card shows: asset name, ticker, session status badge (LIVE / REPLAY / OFFLINE), and the embedded player.
Grid layout: 2–3 columns. Click any card to expand to full-width focus mode.
Stream cards display the source channel name (e.g. Bookmap Official, Trader TV Live).
Admin panel: founder updates YouTube stream URLs without a code deploy — stored in DB.
Tech Instructions:
Use YouTube IFrame API for embedding. No paid service required.
Embed format: https://www.youtube.com/embed/{LIVE_STREAM_ID}?autoplay=1&mute=1
Store stream metadata (asset, YouTube URL, order, active toggle) in Supabase — manageable from admin dashboard.
Use YouTube Data API v3 (free: 10,000 units/day) to poll stream status every 5 minutes. Show 'Offline' placeholder when stream is not live.
Mobile: single-column stack. Streams load lazily to preserve bandwidth.
Do NOT build a custom order book visualiser. The YouTube stream IS the content.
PILLAR 2  FINANCE HEADLINES — NEWS FEED
Purpose: Replace FinancialJuice with a faster, cleaner, multi-source real-time financial news feed.
What to Build:
Real-time news feed page with headlines pulled and aggregated from multiple free sources.
Persistent live ticker bar at the top of every page across the entire site.
Each news card: Headline | Source | Time (relative) | Asset tag | Impact badge (High / Medium / Low).
Filter bar: by asset class (Forex, Indices, Commodities, Crypto, Macro) and by impact level.
'BREAKING' flash tag auto-applied when headlines contain high-urgency keywords: Fed, CPI, NFP, rate decision, emergency, war, default.
Sentiment tag on each story: Bullish / Bearish / Neutral — auto-assigned by keyword engine.
Free Data Sources:
Source
Free Limit
Best Used For
NewsAPI.org
100 req/day
General financial headlines
Finnhub.io
60 calls/min
Forex news, economic data
Alpha Vantage
25 calls/day
Supplemental market news
Frankfurter.app
Unlimited
Live FX rates for ticker
CFTC.gov
Unlimited (public)
COT reports weekly
Tech Instructions:
Backend aggregation service pulls all sources every 60–120 seconds and stores in DB — prevents front-end rate limit hits.
De-duplicate headlines: fuzzy title match > 85% similarity = discard duplicate.
Auto-tag each headline with a keyword dictionary: currencies, assets, and impact-level keywords.
Ticker bar on all pages: cycle 20 most recent headlines left-to-right, refresh every 60 seconds via WebSocket or polling.
Cache news aggressively. Serve from DB, not directly from APIs.
PILLAR 3  ECONOMIC CALENDAR
Purpose: A best-in-class economic calendar that goes beyond ForexFactory — with analyst context notes and a weekly sentiment read so traders understand WHY each event matters.
What to Build:
Full-page Economic Calendar — the primary tool traders open every Sunday and Monday morning.
Weekly view (Mon–Fri) as default. Toggle to daily view or monthly view.
Each event row shows: Time (user's local timezone) | Currency flag | Event name | Impact badge | Previous | Forecast | Actual.
Impact colour coding: Red = High, Orange = Medium, Yellow = Low. Grey = non-market-moving.
Actual data auto-updates the moment it drops — no manual refresh needed. Use Finnhub webhook or 60-second polling during event window.
Timezone selector: dropdown with all major trading timezones (EST, GMT, CET, JST, AEST).
Personal watchlist: trader can star events to pin them to a 'My Calendar' view.
Alert system: in-app + optional email alert X minutes before a watched event fires.
The Differentiator — Why This Matters Notes:
Every HIGH-impact event on the calendar has an expandable 'Why This Matters' note. This is hand-written by Vibe Trading (founder or approved analysts) and stored in the DB. It is a 2–4 sentence plain-English explanation of what the event measures and why traders care. No other free calendar does this. This is a retention feature.
Example — NFP note: 'Non-Farm Payrolls measures the number of jobs added in the US economy. Strong prints typically strengthen the USD and push equities higher. A miss can trigger sharp USD selloffs. Traders watch this as a leading indicator of Fed policy direction.'
Notes are editable by admin at any time via the CMS dashboard.
Notes can be short (2 sentences) or detailed (4–5 sentences) depending on event significance.
Weekly Sentiment Block:
At the top of the calendar page, above the event rows, display a 'Vibe Trading Weekly Sentiment' card. This is posted once per week (Sunday evening) by the founder. It contains:
Overall market sentiment for the week: RISK-ON / RISK-OFF / MIXED (displayed as a colour badge).
2–3 sentence written context: what to watch, key themes, and how the calendar events tie together.
Example: 'This is a high-impact week. CPI Tuesday and Fed decision Wednesday create a binary risk environment. Expect volatility in USD pairs and Gold. Risk-off bias unless CPI surprises to the downside.'
This card is the first thing a trader reads when they open the calendar. It sets the context.
Admin posts this from the dashboard. It is stored in DB with a publish date. Previous weeks are archived.
Tech Instructions:
Economic calendar data source: Finnhub /calendar/economic endpoint (free). Cache and refresh every 15 minutes.
Fallback source: Investing.com calendar scrape (use carefully, respect robots.txt) or Trading Economics free API.
'Why This Matters' notes: stored in a separate Supabase table (event_name, note_text, last_updated, author). Join to calendar events by event name matching.
Weekly Sentiment card: its own Supabase table (week_start_date, sentiment_label, sentiment_text, author). Query the most recent entry for the current week.
Actual data update: during event windows (15 min before and after), increase polling to every 30 seconds for that specific event row.
Mobile: collapse Previous/Forecast/Actual into a tap-to-expand row to keep the table clean on small screens.
PILLAR 4  FED WATCH TOOL
Purpose: Give traders a free, real-time view of Federal Reserve rate expectations — the same intelligence the CME FedWatch tool provides, built without paying CME a cent.
What This Tool Shows:
Current Federal Funds Rate (target range, e.g. 4.25% – 4.50%).
Probability of a rate HIKE, HOLD, or CUT at each upcoming FOMC meeting — displayed as percentage bars.
FOMC meeting date countdown: 'Next meeting in X days.'
Rate path chart: visual timeline showing the market-implied rate path over the next 12 months.
Historical rate decisions table: last 12 FOMC meetings — decision, rate change, vote split.
Free Data Sources — Two Options (build both, use primary, fall back to secondary):
Option A — Polymarket API (Primary):
Polymarket is a prediction market that prices Fed rate outcomes in real-time using crowd probability.
API endpoint: https://gamma-api.polymarket.com/markets — query Fed rate markets by keyword.
Completely free. No API key required for public market data.
Pull the relevant FOMC meeting markets (search for 'Fed rate' or 'FOMC' in market titles).
Parse 'outcomePrices' array: each value = implied probability for that outcome (hold / cut 25bps / cut 50bps / hike).
Refresh: poll every 5 minutes. Display last-updated timestamp prominently so traders know data is live.
Label clearly: 'Probabilities sourced from Polymarket prediction markets.'
Option B — CME FedWatch Scrape / SOFR Futures (Fallback):
CME publishes FedWatch probabilities on their public website. Scrape https://www.cmegroup.com/markets/interest-rates/cme-fedwatch-tool.html — parse the probability table from the page HTML.
Alternative: use SOFR 30-Day futures implied rates (free via Alpha Vantage or Quandl FRED API) to back-calculate rate probabilities mathematically.
FRED API (Federal Reserve Economic Data) is completely free and has no rate limits for basic queries. Use for current Fed Funds Rate: endpoint FEDFUNDS.
Fallback logic: if Polymarket data is stale (> 30 min old), auto-switch to CME scrape data and display a source indicator.
What to Build — UI Components:
Rate Probability Gauge: horizontal bar chart for the next FOMC meeting. Bars = Hold %, Cut 25bps %, Cut 50bps %, Hike % — colour coded green/red/grey.
Meeting Calendar strip: all 8 FOMC meetings for the year shown as a horizontal timeline. Click any meeting to see its probability breakdown.
Rate Path Chart: line chart showing the implied Fed Funds Rate at each meeting date based on current market pricing.
Current Rate display: large, prominent. Shows current target range. Shows last change date and amount.
Historical Decisions table: date | decision | change | vote split (e.g. 11-0, 9-2). Data sourced from FRED API.
Vibe Trading Fed Note: a short editorial note from the founder on the current Fed narrative — same concept as the Calendar sentiment note. Updated after each FOMC meeting or major Fed speech.
Tech Instructions:
Polymarket primary fetch: GET https://gamma-api.polymarket.com/markets?search=fed+rate&active=true — filter for active FOMC markets, parse outcomePrices.
FRED API for current rate and historical decisions: https://api.stlouisfed.org/fred/series/observations?series_id=FEDFUNDS&api_key=YOUR_KEY&limit=24 — FRED API keys are free, unlimited educational use.
Cache all Fed Watch data in Supabase. Serve to the frontend from DB, not direct API calls.
Rate path chart: use Chart.js or Recharts (both free, open source). No paid charting library.
Label all probability data with source and timestamp. Traders must know when data was last refreshed.
Store the Vibe Trading Fed Note in its own DB table — same pattern as the Calendar sentiment note.
PILLAR 5  ARTICLE & ANALYSIS SECTION
Purpose: The credibility engine of VIBE TERMINAL. Vibe Trading posts official analysis. Verified community analysts post their own work. This becomes the editorial heart of the platform.
Two Sub-Sections:
Vibe Trading Official — posts by the founder only. Flagship content. Displayed prominently on homepage.
Community Articles — posts by verified TMS community members approved as contributors.
What to Build:
Article listing page with two tabs: 'Official' and 'Community'.
Each article card: Title | Author + Verified badge | Date | Category tag | Read time | Thumbnail.
Full article page: rich text body, embedded TradingView chart, author bio box, comment section, like/upvote.
Article categories: Technical Analysis, Fundamental Analysis, Trade Recap, Market Psychology, Education, Weekly Outlook.
Rich text editor: TipTap (open source, free). Supports headings, bold/italic, lists, image upload, TradingView embed.
Author profile page: bio, photo, all articles, follower count, Follow button.
Followers receive in-app notification and optional email when a followed author posts.
Featured Article system: admin pins up to 3 articles to the homepage hero section.
Access Control:
Visitors: read-only. Free Members: read + comment + like + follow. Contributors: all + publish (approval required). Admin: full control.
Contributor Approval Flow:
User submits application: name, trading background, sample writing.
Founder reviews in admin dashboard — approve or deny.
Approved users get Verified Analyst badge on profile and all articles.
Tech Instructions:
Auth and roles in Supabase: visitor / member / contributor / admin.
TradingView embed: accept share URL from author, auto-convert to iframe.
Image uploads: Supabase Storage (1GB free). Compress images client-side before upload.
Full-text article search: Supabase built-in full-text search — no paid search service.
Email notifications: Resend.com (3,000 free emails/month).
PILLAR 6  TRADER GAME SECTION
Purpose: Gamify trader education. Community members compete via trading knowledge quizzes, building a leaderboard and driving daily return visits.
Core Concept:
10 questions per session, drawn from a pool tagged by difficulty (Easy / Medium / Hard) and topic. Players earn points on correctness and speed. Global and weekly leaderboards rank all players. No signals. No financial advice. Pure knowledge.
What to Build:
Game lobby: leaderboard, your rank, 'Play Now' button, recent results.
Session flow: 10 questions, one at a time, 30-second countdown timer per question.
Question types: Multiple choice (4 options), True/False, Fill-in-the-blank (for numeric answers like pip values).
Difficulty mix per session: 4 Easy + 4 Medium + 2 Hard (admin configurable).
Scoring: +10 pts correct. +5 speed bonus if answered under 10 seconds. No penalty for wrong answers.
After each question: correct answer reveal, brief explanation, % of players who got it right.
End-of-session screen: score, rank change, breakdown, Play Again / Challenge a Friend.
Leaderboard & Competition:
Global leaderboard: top 100 players by all-time total points.
Weekly leaderboard: resets every Monday. Winner earns 'Top Trader' badge on profile.
Personal stats: games played, average score, best score, strongest topic, weakest topic.
Streaks: consecutive daily play streak displayed on profile.
Question Bank:
Admin dashboard for founder to add, edit, delete questions.
Each question: text, 4 options, correct answer, explanation, topic tag, difficulty tag.
Minimum 200 questions before launch. Target 500+.
Topics: Forex basics, Technical Analysis, Candlestick patterns, Economic indicators, Risk management, Trading psychology, Order types, Market structure, Commodities, Indices.
Tech Instructions:
Questions in Supabase. Session query: N random questions by difficulty using Supabase RPC random().
Session state: managed client-side. Write to DB only at session end — do not call DB per question.
Leaderboard table: user_id, total_points, weekly_points. Update on session end.
Weekly reset: Supabase pg_cron job zeroes weekly_points every Monday 00:00 UTC.
Anti-cheat: randomise answer order on each render. Cap at 20 sessions per user per day.
Phase 2 — Challenge Mode: head-to-head 10-question match between two community members.
3.  Platform-Wide Rules & Constraints
Hard Rules — Non-Negotiable:
ZERO signals anywhere: no trade calls, no buy/sell alerts, no signal rooms, not in articles, not in the game, not anywhere.
ZERO paid data feeds: all sources must remain on free tiers. Cache aggressively before considering upgrades.
ZERO third-party comment systems: build natively in Supabase — own all data.
ALL probability/prediction data (Fed Watch) must be clearly labelled with source and last-updated timestamp.
Design Principles:
Dark mode as default. The platform must feel like a professional trading terminal, not a blog.
Speed first. News, calendar, and Fed Watch must load fast. Use caching aggressively.
Mobile responsive. A significant portion of the Vibe Trading community is mobile.
Minimalist navigation. Every feature reachable in 2 clicks from the homepage.
Vibe Trading brand voice: confident, direct, community-first. Not corporate.
4.  Full Tech Stack — All Free
Layer
Technology
Why
Frontend
Next.js (React)
Fast, SEO-friendly, Vercel auto-deploy
Hosting
Vercel
Free tier, global CDN, GitHub integration
Database + Auth
Supabase
Postgres + Auth + Storage + Realtime + pg_cron
Rich Text Editor
TipTap
Open source, free, highly customisable
Charts
TradingView Widgets
Free embed, professional-grade charts
Rate Charts
Recharts / Chart.js
Open source, free — Fed Watch rate path
News Primary
Finnhub.io + NewsAPI
Free tiers sufficient for launch phase
FX Rates
Frankfurter.app
Completely free, no API key needed
Fed Watch Primary
Polymarket Gamma API
Free, no key, real-time crowd probabilities
Fed Watch Fallback
FRED API (St. Louis Fed)
Free, unlimited, official Fed data
Economic Calendar
Finnhub /calendar
Free calendar endpoint with event data
YouTube Streams
YouTube IFrame API
Free — powers the Book Map pillar
Email
Resend.com
3,000 free emails/month
Scheduling
Supabase pg_cron
Free — weekly leaderboard resets
* You can use as your liking*
5.  Recommended Build Phases
Phase 1 — Foundation:  Next.js + Supabase setup, auth, navigation shell, persistent ticker bar. Deliver: working skeleton with login/register.
Phase 2 — News & Calendar:  Finance Headlines feed + Economic Calendar with Why This Matters notes + Weekly Sentiment card. Deliver: traders can use VIBE TERMINAL instead of FinancialJuice and ForexFactory immediately.
Phase 3 — Fed Watch Tool:  Polymarket + FRED integration, rate probability gauge, FOMC meeting timeline, rate path chart, Vibe Trading Fed Note. Deliver: replaces CME FedWatch.
Phase 4 — Content Layer:  Article section (Official + Community), contributor approval flow, author profiles, follow system, TipTap editor. Deliver: editorial credibility established.
Phase 5 — Book Map:  YouTube stream hub, admin URL management, live/offline detection. Deliver: daily live session destination.
Phase 6 — Game Section:  Quiz engine, question bank (200+ questions loaded), scoring, leaderboard, weekly reset. Deliver: community competition and daily return visits.
Phase 7 — Polish & Growth:  Mobile optimisation, SEO, performance audit, email notifications, push notifications, challenge mode, social sharing.
6.  Closing Note to the Tech Team
VIBE TERMINAL is Vibe Trading's gift to the trader community. Every feature exists to answer one question: does this make a trader better prepared for tomorrow? Build it fast, build it clean, build it dark. The community is watching.
No signals. No noise. Just vibes.