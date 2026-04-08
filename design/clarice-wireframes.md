# Vibe Trading — Wireframe Descriptions

**Version**: 1.0  
**Author**: CLARICE (UI/UX Design Specialist)  
**Date**: 2026-04-05  
**Status**: Draft — Figma-Ready  

---

## Wireframe Legend

All wireframes follow the 3-second scan principle. Key data is always visible without interaction. Secondary details are progressively disclosed.

**Density scale**: 
- High: Data tables, ticker strips, calendar grids
- Medium: Signal cards, chat messages
- Low: Landing page, auth pages, pricing

---

## 1. Landing Page (/)

### 1.1 Desktop (1440px)

**Section 1: Hero** (Full viewport height, 100vh max 900px)
- Navbar: Fixed top, 64px height. Logo left ("VIBE TRADING"), nav links center (Dashboard, Calendar, Signals, Community, Pricing), auth buttons right (Login outlined, "Get Started" primary blue, h-40).
- Hero content centered, max-width 800px:
  - Eyebrow label: "MACRO-FIRST FOREX COMMUNITY" (11px uppercase, gold, letter-spacing 0.05em, centered)
  - H1: "Trade the Macro. Not the Chart." (display-xl, 64px, Inter 800, centered)
  - Subtitle: "Real-time economic calendar. Thesis-driven signals. A community that understands central banks." (body-lg, text-secondary, centered, max-width 640px)
  - CTA group (centered, gap 16px):
    - Primary: "Join Free" (button XL, blue, h-56, px-32, text-lg)
    - Secondary: "View Live Dashboard" (button XL, outline, text-blue)
  - Trust bar below CTAs (text-xs, text-tertiary, centered): "Free forever tier · No credit card required · Real-time data"

**Section 2: Live Preview Strip** (Below hero, bg-secondary, py-16)
- Section header (text-center, mb-8): "Live Market Snapshot" (heading-md)
- Horizontal scroll area (or 5-column grid at 1280px+):
  - 5 mini price cards (inline-block, no gutter):
    - EUR/USD — 1.0842 (+0.12%) — sparkline (32px)
    - GBP/USD — 1.2671 (-0.05%) — sparkline
    - XAU/USD — 2,178.50 (+0.31%) — sparkline
    - US30 — 39,245 (+0.45%) — sparkline
    - USD/JPY — 151.23 (-0.08%) — sparkline
  - Each card: bg-tertiary, border-subtle, rounded-lg, p-4
  - Pair name (body-sm, text-secondary), Price (data-md, text-primary), Change (data-xs, color-coded), Sparkline placeholder (rect with subtle line)

**Section 3: Feature Grid** (py-20, bg-primary)
- Section header (text-center, mb-12): "Built for Macro Traders" (display-sm)
- 3-column grid (gap-8):
  - Card 1: Icon `Globe` (icon-xl, blue) + "Live Macro Dashboard" (heading-sm) + Description (body-sm, text-secondary, 3 lines max)
  - Card 2: Icon `Calendar` + "Economic Calendar" + Description
  - Card 3: Icon `Zap` + "Thesis-Driven Signals" + Description
  - Card 4: Icon `MessageCircle` + "Community Chat" + Description
  - Card 5: Icon `BarChart3` + "Member Analytics" + Description
  - Card 6: Icon `GraduationCap` + "Structured Education" + Description

**Section 4: Community Showcase** (py-20, bg-secondary)
- Section header (text-center, mb-8): "What the Community Says" (display-sm)
- 3-column grid of testimonial cards (bg-tertiary, rounded-lg, p-5):
  - Quote (body-md, italic)
  - Attribution: Name + role badge (Member/Analyst) + small avatar circle
- Stats row below (flex, justify-center, gap-12):
  - "2,400+ Members" (data-lg), "847 Signals Tracked" (data-lg), "72% Win Rate" (data-lg)
  - Labels below each in body-xs, text-tertiary

**Section 5: Final CTA** (py-20, centered)
- H2: "Start Trading Smarter Today" (display-md, centered)
- Subtitle: "Free tier gives you access to live prices, the economic calendar, and community chat." (body-md, text-secondary, max-width 560px)
- CTA: "Create Free Account" (button XL, blue)
- Link below: "Already a member? Log in" (text-blue, body-sm)

**Footer** (bg-secondary, border-top 1px border-subtle, py-12)
- 4-column layout:
  - Col 1: Logo + brief description (body-xs, text-tertiary, 2 lines)
  - Col 2: "Product" — Dashboard, Calendar, Signals, Pricing
  - Col 3: "Community" — Telegram, YouTube, TikTok
  - Col 4: "Legal" — Terms, Privacy, Disclaimer
  - Bottom bar: "© 2026 Vibe Trading. Not financial advice." (body-xs, text-tertiary)

### 1.2 Tablet (768px)

- Hero: display-md (36px), subtext body-md, CTA buttons h-48 stacked vertically on narrow tablet
- Live Preview: 3 cards visible, rest require horizontal scroll
- Feature Grid: 2 columns instead of 3
- Testimonials: 2 columns
- Stats: single row, 3 items centered
- Footer: 2x2 grid for columns

### 1.3 Mobile (375px)

- Hero: display-sm (28px), subtext body-sm, CTA buttons full-width (w-full), stacked
- Live Preview: 2 cards visible, swipeable (snap-x)
- Feature Grid: single column, full-width cards
- Testimonials: single column, swipeable
- Stats: stacked vertically (centered)
- Footer: single column, centered text links
- No bottom nav on landing page (use regular top nav, hamburger menu)

---

## 2. Live Macro Dashboard (/dashboard)

### 2.1 Desktop (1440px)

**Layout**: 2-column with sidebar (280px left) + main content (fluid right)
- Top bar: Price ticker strip (full width, 36px height, bg-secondary, border-bottom)
  - Auto-scrolling marquee (left to right, infinite loop)
  - Each item: `PAIR PRICE CHANGE%` — 16px padding between items
  - Separator: vertical line (border-subtle, 16px height)
  - Pause on hover

**Sidebar (280px, fixed, scrollable)**:
- User mini-card (avatar circle 40px, display name body-sm, role badge below)
- Watchlist section:
  - Header: "Watchlist" (heading-sm) + "+" button (icon-sm, ghost)
  - List items (48px height each, border-bottom subtle):
    - Pair name (body-sm) | Bid (data-sm mono) | Ask (data-sm mono)
    - Change % aligned right, color-coded
    - Hover: bg-tertiary
  - "Add Pair" footer button (outline, full-width, h-40, mt-4)
- Quick Events (below watchlist):
  - Header: "Next Events" (body-sm, text-secondary, mb-2)
  - Top 3 upcoming events (compact):
    - Impact dot (8px, left) | Time (data-xs, text-tertiary) | Event name (body-xs, truncate)
    - Sorted by time, next 24h only

**Main Content Area**:
- Page Header (flex, justify-between, mb-6):
  - Title: "Macro Dashboard" (display-sm)
  - Right group: Squawk toggle (switch, "Squawk" label), Timezone selector (dropdown, "GMT" default), Refresh indicator (Zap icon, green when active)

- Row 1: Price Cards Grid (3 columns, gap-6, mb-6)
  - 3 price cards, each:
    - Header: Pair name (body-md) + Direction badge (LONG/SHORT/neutral)
    - Main price: Bid (data-xl, mono, tabular-nums)
    - Spread: Ask-Bid (data-xs, text-tertiary, mono)
    - Change: +/-X.XX% (data-sm, color-coded, right-aligned)
    - Sparkline: 32px height, full-width
    - Footer: Volume (data-xs, text-tertiary), 24h High/Low (data-xs, mono)

- Row 2: Central Bank Rates Table (full width, mb-6)
  - Table header row:
    - Bank | Rate | Last Change | Stance | Next Meeting
    - Headers: 11px, uppercase, text-secondary, bg-secondary
  - Data rows (48px height, bg-primary):
    - Federal Reserve | 5.50% | Mar 2024 ↑ | Hawkish | Jun 12
    - ECB | 4.50% | Feb 2024 → | Neutral | Apr 11
    - BOE | 5.25% | ... (repeat for 8-10 banks)
    - Rate column: data-md, mono
    - Change arrow: ↑ (green) or ↓ (red) or → (neutral)
    - Stance: Badge (Hawkish/Dovish/Neutral) — styled as pills
    - Hover: bg-tertiary

- Row 3: Event Countdown + Squawk (2 columns, 1:1 ratio, gap-6)
  - Left — "Next High-Impact Event" (card, p-5):
    - Countdown timer (data-xl, mono, centered): "02:34:15"
    - Event name (heading-md, centered): "US Non-Farm Payrolls"
    - Country flag + Impact dot
    - Forecast vs Previous (data-sm, mono, centered): "180K vs 275K"
    - Asset impact chips (EUR/USD, Gold, US30)
  - Right — "Squawk Stream" (card, p-5, scrollable max-height 240px):
    - Header: "Live Squawk" + filter dropdown (All / Fed / ECB / High Impact)
    - Messages (stacked, gap-2):
      - [Time] Tag Badge Headline (body-xs, text-secondary)
      - New messages slide in from top, highlight for 2s then normalize

### 2.2 Tablet (768px)

- Sidebar collapses to overlay drawer (hamburger trigger in top nav)
- Top ticker: full width, no change
- Price Cards: 2 columns
- Central Bank Table: scrollable horizontal
- Event + Squawk: stacked vertically
- Main content padding: 24px

### 2.3 Mobile (375px)

- **Bottom Navigation** (5 tabs, 64px height, fixed bottom):
  - [Live] [Calendar] [Signals] [Chat] [Profile]
  - Active tab: blue icon + label, inactive: gray
  - Active tab indicator: 3px top-border
- Top ticker: simplified (scrolls horizontally, touch-to-pause)
- Sidebar hidden (accessed via Profile tab)
- Price Cards: single column, swipeable carousel (3 cards, snap center)
- Central Bank Table: horizontal scroll with sticky first column
- Event Countdown: full-width card
- Squawk: collapsible section below event card

---

## 3. Economic Calendar (/calendar)

### 3.1 Desktop (1440px)

**Layout**: Full-width page with right sidebar
- Top bar: Price ticker strip (same as dashboard, 36px)
- Page Header (mb-6, flex justify-between):
  - Left: "Economic Calendar" (display-sm) + Date range chips (Today / This Week / Next Week)
  - Right: Filter bar:
    - Impact filter (toggle pills: All / High / Medium / Low)
    - Country filter (multi-select dropdown: USD, EUR, GBP, JPY, AUD, CAD, NZD, CHF)
    - Currency filter (dropdown)

**Main Calendar Table** (full width, bg-secondary, rounded-lg):
- Table structure:
  ```
  | Time     | Country | Impact | Event                  | Forecast | Previous | Actual |
  ```
- Column widths:
  - Time: 90px (data-sm, mono, text-tertiary)
  - Country: 60px (flag emoji + 2-letter code, body-sm)
  - Impact: 40px (8px colored dot, centered)
  - Event: auto (body-sm, min 200px)
  - Forecast: 100px (data-sm, mono, text-secondary, right-aligned)
  - Previous: 100px (data-sm, mono, text-tertiary, right-aligned)
  - Actual: 100px (data-sm, mono, right-aligned)
    - Green if beats forecast
    - Red if misses forecast
    - `—` if not yet released
- Row height: 48px standard, 56px for post-event (with actuals)
- Row hover: bg-tertiary
- Grouped by date (sticky date header row, bg-elevated, 32px height, body-sm uppercase)
- Current/near event rows have subtle left border accent-blue (3px)

**Right Sidebar (320px, fixed)**:
- "Event Detail" panel (appears on row hover/click):
  - Event name (heading-md)
  - Country + Impact dot
  - Full description (body-sm, text-secondary, 4-5 lines)
  - Historical impact on affected pairs:
    - "Avg move on release: EUR/USD ±15 pips" (data-sm, mono)
  - Related threads: "Community discussing this event →" (link, blue)
- If no event selected: Placeholder showing "Click an event for details"

### 3.2 Tablet (768px)

- Right sidebar becomes bottom sheet (swipe up on row tap)
- Table: all columns shown, horizontal scroll if needed
- Filter bar: wraps to 2 rows
- Date grouping headers: sticky

### 3.3 Mobile (375px)

- Filter bar: scrollable horizontal strip (below page header)
- Table: compact layout
  - Time | Impact | Event name (no country, no forecast/previous in main view)
  - Tap row → expandable card below showing Forecast/Previous/Actual
- Right sidebar: full-screen modal on row tap
- Countdown badge on upcoming high-impact events (pill: "15m")

---

## 4. Signal/Thesis Feed (/signals)

### 4.1 Desktop (1440px)

**Layout**: Full-width feed
- Top bar: Price ticker strip (36px)
- Page Header (mb-6):
  - Title: "Signal Feed" (display-sm)
  - Filter bar: All / Active / Closed | By pair (multi-select) | By catalyst (dropdown)
  - "Create Signal" button (gold, MD, Analyst+ only, icon + "Create")

**Feed Column** (max-width 720px, centered):
- Signal cards stacked vertically (gap-4):
  - **Card Header** (flex, justify-between):
    - Left: Pair + Direction (body-md, bold) + Badge (LONG green / SHORT red)
    - Right: Time ago (body-xs, text-tertiary) + Status badge (ACTIVE / HIT_TP / HIT_SL)
  - **Catalyst Line** (body-sm, text-secondary, mb-2):
    - "📊 Catalyst: US CPI misses expectations, USD weakens"
  - **Thesis Block** (bg-primary, rounded, p-3, mb-3):
    - Full thesis text (body-sm, line-clamp-4, expandable)
    - "Read more" link (text-blue, body-xs)
  - **Levels Section** (grid, 3 columns, gap-3, mb-3):
    - Entry | Stop Loss | Take Profit
    - Each: label (body-xs, text-tertiary), value (data-md, mono, centered)
    - **FREE user**: Values replaced with lock icon + "Upgrade to see levels" (body-xs, text-gold, centered border with dashed border)
  - **Risk & Invalidation** (flex, justify-between, body-xs):
    - Left: "Risk: 1.5% per trade" (body-xs, text-secondary)
    - Right: "Invalidation: EUR/USD breaks below 1.0800" (text-blue, body-xs)
  - **Card Footer** (flex, justify-between, border-top subtle, pt-3):
    - Left: Author avatar (24px) + name (body-xs)
    - Right: "Expand" (text-blue, body-xs, icon chevron) | Bookmark icon | Share icon
    - Engagement: "42 views · 8 responses" (text-tertiary, body-xs)

### 4.2 Tablet (768px)

- Feed max-width: 640px
- 3-column levels stay
- Card padding: p-4 instead of p-5

### 4.3 Mobile (375px)

- Single column, full-width cards
- Levels section: 2 rows (Entry on top, SL/TP side-by-side)
- Thesis block: line-clamp-2 (shorter preview)
- Engagement metrics below expand link
- Pull-to-refresh gesture

---

## 5. Community Chat (/community)

### 5.1 Desktop (1440px)

**Layout**: 3-panel layout (like Discord/Slack)
- **Left Sidebar** (240px, fixed):
  - Header: "Event Threads" (body-sm, uppercase, p-3)
  - Search input (40px, with icon)
  - Thread list (scrollable):
    - Each thread: Impact dot + Event name (body-sm, truncated) + Unread count badge (if any)
    - Active thread: bg-tertiary, left border accent-blue
    - Pinned thread: Pushpin icon
    - "All Markets" (general discussion) at top
  - Footer: "Create Thread" button (outline, full-width)

- **Main Chat Area** (flex-1):
  - Header:
    - Thread name (heading-md) + Impact dots
    - Right: Thread participants count (icon Users + number)
  - Pinned Message Bar (bg-elevated, p-3, mb-4, rounded-md, border-left accent-blue):
    - Pin icon + "Pinned:" + Message preview (body-xs, truncate) + "Jump" link
  - Message Feed (scrollable, flex-1):
    - Messages stacked (gap-1):
      - Avatar circle (36px) | Name (body-sm, bold, color-coded by role) | Timestamp (body-xs, text-tertiary)
      - Message content (body-sm, next line)
      - Reactions row below: Bullish 👍 / Bearish 👎 / Neutral 🔄 / 👀 Watch
      - Each reaction: Pill with count
    - Date dividers: "Today, April 5" (centered, body-xs, text-tertiary, with lines on sides)
    - System messages: "Admin pinned a message" (text-tertiary, italic, body-xs, centered)
  - Message Input Bar (fixed bottom of chat, bg-secondary, border-top):
    - Text input (h-44, rounded-md, bg-tertiary, flex-1)
    - Send button (icon Send, blue, circular, h-44)
    - "Members only" label if Free user (body-xs, text-gold)

- **Right Sidebar** (280px, fixed):
  - "Active Signals" for this event (2-3 cards, compact)
  - "Related Calendar Events" (list with countdown)
  - "Thread Stats": Message count, participants, top contributors

### 5.2 Tablet (768px)

- Left sidebar: 200px, collapsible
- Right sidebar: hidden (accessed via "i" button in thread header)
- Message feed: same
- Input bar: same

### 5.3 Mobile (375px)

- Thread List: full-screen list (accessed via Chat tab bottom nav)
- Thread View: full-screen, back button in header
- Right sidebar: accessible via "i" icon, slides from right as overlay
- Input bar: fixed bottom (above tab nav)
- Avatars: 28px

---

## 6. Member Dashboard (/profile)

### 6.1 Desktop (1440px)

**Layout**: Dashboard grid (responsive masonry, 3 columns)
- Top bar: Price ticker (36px)
- Page Header (mb-6):
  - Left: "Welcome back, [Name]" (display-sm) + Subtitle (body-sm, text-secondary: "You have 2 active signals and 1 high-impact event today")
  - Right: Settings gear icon + Profile menu dropdown

**Dashboard Grid** (3 columns, gap-6):
- **Card 1: Watchlist** (spans 2 columns):
  - Header: "My Watchlist" + "Edit" link
  - Table: Pair | Bid | Ask | Change% | Alert (bell icon)
  - 6-8 rows max, scrollable
  - Quick actions on each row: Star (remove), Set alert
- **Card 2: Active Signals** (spans 1 column):
  - Header: "Active Signals" + count badge
  - Compact list:
    - Direction badge + pair (body-sm)
    - Entry/SL/TP (data-xs, mono)
    - Status indicator (colored dot + "ACTIVE")
    - "View Details" link
- **Card 3: PnL Summary** (spans 1 column):
  - Mini chart (bar or line, 120px height)
  - "This Week: +45 pips" (data-lg, bullish/bearish color)
  - Sub-metrics: "Win Rate: 68%" | "Avg Pips: +12" | "Trades: 15"
  - "View Full History" link
- **Card 4: Education Progress** (spans 1 column):
  - Progress bar (blue fill, bg-secondary track, 8px tall, full-width)
  - "4 of 12 modules completed" (body-sm)
  - Current module: "Central Bank Policy Cycle" (body-md, bold)
  - Progress percentage: "33%" (data-md, blue)
  - "Continue Learning" button (outline, sm)
- **Card 5: Calendar Sync** (spans 1 column):
  - Next 3 events listed (compact)
  - "Export to Google Calendar" button (outline, sm)
  - "ICS Download" link

### 6.2 Tablet (768px)

- Grid becomes 2 columns
- Cards maintain relative sizes (watchlist still 2-col)

### 6.3 Mobile (375px)

- Grid becomes single column
- Cards stack vertically
- PnL chart: 96px height
- Profile tab in bottom nav serves as dashboard entry

---

## 7. Auth Pages (/login, /register)

### 7.1 Desktop (1440px)

**Layout**: Split screen (50/50)
- **Left Panel** (50%, bg-secondary):
  - Centered vertically and horizontally
  - Card (max-width 400px):
    - Logo (centered, mb-6)
    - Page title: "Welcome Back" or "Create Account" (display-sm, centered)
    - Subtitle (body-sm, text-secondary, centered, mb-6)
    - Form fields (stacked, gap-4):
      - Email input (full-width, h-44)
      - Password input (full-width, h-44, with show/hide eye icon)
      - Register only: Username input, Confirm password
    - "Forgot Password?" link (text-blue, body-sm, right-aligned, register page omits)
    - Submit button (primary, full-width, h-44, mb-4)
    - Divider line with "OR" text (centered, body-xs, text-tertiary)
    - Social auth: "Continue with Google" (outline, full-width, with Google icon)
    - Footer text: Link to other page ("New here? Create account" / "Already have an account? Log in")
    - Validation states:
      - Error: Red border, red error text below field (12px)
      - Success: Green border
      - Loading: Button spinner, disabled state
- **Right Panel** (50%, bg-primary):
  - Decorative content (non-interactive):
    - Large abstract market pattern or yield curve illustration
    - Overlay text: "Trade the Macro. Not the Chart." (display-md, white)
    - Feature bullets (body-sm, white 80% opacity, with check icons):
      - ✓ Real-time economic calendar
      - ✓ Thesis-driven signals from analysts
      - ✓ Community of 2,400+ macro traders

### 7.2 Tablet (768px)

- Split remains but narrower form panel (480px max)
- Right panel: simplified to solid color with centered quote

### 7.3 Mobile (375px)

- Single column (no right panel)
- Form card: full-width, top-aligned with padding
- Logo reduced to 32px (from 48px)
- Social auth stacked vertically
- Footer links at bottom with padding

---

## 8. Pricing Page (/pricing)

### 8.1 Desktop (1440px)

- Top bar: None (minimal header with logo only for focus)
- Hero Section (centered, py-16):
  - "Choose Your Edge" (display-md, centered)
  - "From free community access to professional-grade analysis." (body-md, text-secondary, centered, mb-12)

**Pricing Cards** (3 columns, centered, gap-6, max-width 1080px):
- **Card 1: Free** (bg-tertiary, border-subtle, rounded-xl, p-6):
  - "Free" (heading-lg, mb-2)
  - Price: "$0/forever" (data-xl, mono, text-primary, mb-4)
  - Description: "Everything you need to start trading macro" (body-sm, text-secondary, mb-6)
  - Feature list (stacked, gap-2, mb-6):
    - ✓ Live prices (major pairs only)
    - ✓ Economic calendar
    - ✓ Signal thesis (no levels)
    - ✓ Chat (read only)
    - ✓ Basic education modules
    - ✗ Full squawk stream
    - ✗ PnL tracker
    - ✗ Create signals
  - CTA: "Get Started Free" (outline, full-width, h-44)

- **Card 2: Member** (bg-tertiary, border-accent 2px, rounded-xl, p-6, relative, recommended):
  - "Most Popular" ribbon (top-left corner, blue bg, white text, 11px)
  - "Member" (heading-lg, mb-2)
  - Price: "$29/month" (data-xl, mono, text-primary, mb-1)
  - "or $290/year (save 17%)" (body-xs, text-secondary, mb-4)
  - Description: "Full access to the trading community" (body-sm, mb-6)
  - Feature list (same format, ✓ for all Free + additional):
    - — Everything in Free, plus:
    - ✓ Full squawk stream
    - ✓ Signal levels (entry/SL/TP)
    - ✓ Chat (post + reactions)
    - ✓ Premium education
    - ✓ PnL tracker
    - ✓ Watchlist with price alerts
    - ✗ Create signals
    - ✗ Analyst verification
  - CTA: "Start Free Trial" (primary blue, full-width, h-44)

- **Card 3: Analyst** (bg-tertiary, bordered gold 1px, rounded-xl, p-6):
  - "Analyst" (heading-lg, mb-2, gold text)
  - Price: "$99/month" (data-xl, mono, text-primary, mb-1)
  - "or $990/year" (body-xs, text-secondary, mb-4)
  - Description: "For verified analysts who share signals" (body-sm, mb-6)
  - Feature list (all features ✓):
    - — Everything in Member, plus:
    - ✓ Create and publish signals
    - ✓ Analyst badge + profile
    - ✓ Performance tracking dashboard
    - ✓ Priority support
    - ✓ API access
    - ✓ Private community channel
  - CTA: "Apply for Analyst" (gold accent, full-width, h-44, bg-gold text-dark)

**Comparison Table** (below cards, full width, mt-16):
- Full comparison grid with all features as rows and tiers as columns
- Checkmark icons (green) and X icons (gray)
- Sticky first column (feature names)
- Hover highlight on row
- "Start comparing" link for mobile users (expands to table on click)

**FAQ Section** (mt-16, max-width 720px, centered):
- Accordion items (6-8 questions):
  - "Can I upgrade/downgrade anytime?" (heading-sm, clickable)
  - Answer (body-sm, text-secondary, expandable below)
  - Chevron icon rotates on expand
  - Divider between items

**Final CTA** (py-12, centered):
- "Questions? Join our Telegram channel and ask." (body-md, text-secondary)
- Telegram link (blue, with Telegram icon)

### 8.2 Tablet (768px)

- Pricing cards: side-by-side, narrower (may need horizontal scroll or stack 2+1)
- Compare table: horizontal scroll
- FAQ: same

### 8.3 Mobile (375px)

- Pricing cards: stacked vertically, full-width
- "Compare all features" toggle below cards (expands to scrollable table)
- FAQ: collapsible, single column
- Annual/monthly toggle switch at top of pricing cards
  - Toggle with label: "Monthly" | "Annually (save 17%)"

---

## Common Navigation Patterns

### Global Top Navbar (Desktop)
```
[Logo] Dashboard Calendar Signals Community Pricing [Theme Toggle] [Bell] [User Avatar]
```
- Height: 64px
- Sticky top, bg-primary with backdrop-blur on scroll
- Active page: blue underline (3px, bottom)
- Notification bell: badge count in red dot
- User avatar: dropdown on click (Profile, Settings, Logout)

### Mobile Bottom Navigation
```
[📊 Live] [📅 Calendar] [⚡ Signals] [💬 Chat] [👤 Profile]
```
- Height: 64px, fixed bottom
- Icons: 24px (Lucide), labels: 10px body-xs
- Active: icon and label in blue, 3px top border indicator
- Non-active: gray (#556677)

---

*End of Wireframe Descriptions. All interactive states and responsive behaviors documented. See ui-components-spec.md for pixel-level component specifications.*
