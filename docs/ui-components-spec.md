# Vibe Trading — UI Component Specifications

**Version**: 1.0  
**Author**: CLARICE (UI/UX Design Specialist)  
**Date**: 2026-04-05  
**Status**: Draft — Figma-Ready  

---

## Component Naming Convention

Format: `[Vibe][Component][Variant][State]`  
Example: `VibeButton/Primary/Default`, `VibeCard/Signal/Expanded`

All components documented below include:
- Dimensions (width, height, padding)
- Typography (font, size, weight, color)
- States (default, hover, active, focus, disabled, error)
- Behavior (interactions, animations)
- Props (React component interface)
- Accessibility notes

---

## 1. Header / Navbar

### 1.1 Top Navigation Bar (Desktop)

```
┌──────────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard Calendar Signals Community Pricing    [🌓] [🔔] [User] │
└──────────────────────────────────────────────────────────────────┘
```

**Dimensions**:
- Width: 100% (full viewport width)
- Height: 64px
- Max content width: 1280px (centered)
- Left/Right padding: 80px (>1440px), 40px (1024-1440px), 24px (<1024px)

**Left Section — Logo**:
- Text: "VIBE" (bold, 20px, tracking 0.1em) + " TRADING" (regular, 20px, text-secondary)
- Clickable → routes to home page (/)
- Width: ~160px

**Center Section — Nav Links**:
- Items: Dashboard, Calendar, Signals, Community, Pricing
- Font: body-sm (14px), weight 500, color text-secondary
- Hover: text-primary, bg-tertiary (subtle pill, 8px radius)
- Active: text-accent-blue, bottom border 3px solid accent-blue
- Padding per item: 8px 16px
- Gap between items: 8px
- Spacing between icon and label: 8px (for mobile menu items)

**Right Section — Controls**:
- Theme Toggle: icon-md (Moon/Sun), h-40 w-40, ghost button style
- Notification Bell: icon-md, h-40 w-40, ghost button, relative badge position
- User Avatar: 32px circle, bg-tertiary, border 1px border-subtle
  - First name initial if no image (body-sm, centered, text-secondary)
  - Click → dropdown menu (see Section 8)

**Responsive Behavior**:
| Viewport | Height | Nav Links | Right Controls |
|----------|--------|-----------|----------------|
| ≥1024px | 64px | Inline text links | Full (toggle, bell, avatar) |
| 768-1023px | 56px | Inline, smaller text | Toggle + avatar |
| <768px | 56px | Hidden (hamburger menu) | Logo + hamburger |

**Scroll Behavior**:
- Scrolled past 100px: background becomes `bg-primary/95` with `backdrop-blur-md`
- Subtle bottom border appears: 1px `border-subtle`

### 1.2 Mobile Hamburger Menu

**Trigger**: Hamburger icon (24px, right-aligned in header)
**Menu Panel**: Full-screen overlay, bg-primary, slide from top (200ms ease-out)
**Content**:
- Close button (top right, X icon)
- Nav items stacked vertically (48px height each)
  - Icon (24px, left) + Label (body-md) + Chevron (right)
  - Active item: bg-accent-blue-muted, text-accent-blue
- Bottom: Login/Get Started buttons (full-width, stacked)

---

## 2. Price Ticker Strip

```
│ EUR/USD 1.0842 +0.12% │ GBP/USD 1.2671 -0.05% │ XAU/USD 2178.50 +0.31% │
```

**Dimensions**:
- Width: 100vw (full viewport, no container limit)
- Height: 36px
- Position: Fixed below navbar (top: 64px)

**Content Items**:
- Pair name: body-xs (12px), font-mono, text-secondary, weight 500
- Price: data-sm (14px), font-mono, text-primary, weight 500, tabular-nums
- Change: body-xs (12px), font-mono, color-coded (green/red), weight 600
- Separator: 1px vertical line, bg-border-subtle, 20px height (centered)

**Behavior**:
- Continuous horizontal scroll animation (left to right, 60 seconds per cycle)
- Pauses on hover (CSS `animation-play-state: paused`)
- Each item: min-width based on content + 32px spacing
- WebSocket-driven: Price + change update in real-time (1-3 second intervals)
- Flash animation on price change (green flash +0.01%, red flash -0.01%, 400ms)

**Data Structure (WebSocket message)**:
```json
{
  "pair": "EURUSD",
  "bid": 1.0842,
  "ask": 1.0844,
  "change": 0.12,
  "changePercent": 0.11,
  "ts": 1700000000000
}
```

**Props (React)**:
```typescript
interface PriceTickerProps {
  pairs: PriceTick[];
  autoScroll?: boolean;
  speed?: number;
  className?: string;
}
```

---

## 3. Price Card

```
┌─────────────────────────────────┐
│ EUR/USD        📈 LONG          │
│                                  │
│ 1.0842                            │
│ Spread: 1.0844 (0.2 pips)        │
│                         +0.12%   │
│ ───────────────────────────      │
│ ▂▂▃▅▇████▇▅▃▂▁                  │
│ Vol: 1.2M | H:1.0850 L:1.0830   │
└─────────────────────────────────┘
```

**Dimensions**:
- Width: Fluid (fills grid column, min 280px)
- Height: auto (~160px typical)
- Padding: 16px
- Background: bg-tertiary
- Border: 1px border-subtle, rounded-lg

**Header Row**:
- Left: Pair name (body-md, weight 600)
  - Full pair label: "EUR/USD" with slash
- Right (optional): Position badge
  - LONG: pill, bg-market-bullish-muted, text-market-bullish, 11px uppercase
  - SHORT: pill, bg-market-bearish-muted, text-market-bearish
  - Neutral: pill, bg-opacity, text-secondary

**Price Display**:
- Bid price: data-xl (28px), font-mono, weight 600, tabular-nums
  - Color: text-primary (default), green/red flash on 1s tick
- Spread label: body-xs, text-tertiary, mono, beneath price
- Change %: data-sm, right-aligned, color-coded (+ green / - red / = gray)

**Sparkline**:
- Height: 32px, full card width
- Stroke: 1.5px, color based on direction (blue neutral, green bullish, red bearish)
- Fill: Gradient from stroke color at 15% opacity to transparent (bottom)
- No grid lines, no axes
- Data points: Last 60 ticks (1-3 second resolution)

**Footer Row**:
- Volume: data-xs, font-mono, text-tertiary (e.g., "Vol: 1.2M")
- 24h High/Low: data-xs, mono (e.g., "H:1.0850 L:1.0830")
- Gap between: 16px

**States**:
| State | Appearance |
|-------|-----------|
| Default | As described above |
| Hover | Border changes to border-default, subtle scale 1.005 (200ms) |
| Watched (in watchlist) | Left border 3px accent-blue, star icon filled gold |
| Selected (dashboard card) | Border accent-blue, bg-accent-blue-muted (5% opacity) |
| Loading | Skeleton: bg-tertiary with shimmer animation, all elements covered |
| Error | Border-status-error, "Connection lost" text (body-xs, red, centered), retry button |

**Props (React)**:
```typescript
interface PriceCardProps {
  pair: string;
  bid: number;
  ask: number;
  change: number;
  changePercent: number;
  direction?: 'LONG' | 'SHORT' | null;
  sparklineData?: number[];
  volume?: string;
  high24h?: number;
  low24h?: number;
  isWatched?: boolean;
  onWatchlistToggle?: () => void;
  status?: 'connected' | 'connecting' | 'error';
}
```

---

## 4. Calendar Row

```
│ 14:30 │ 🇺🇸 │ ● │ US Core CPI m/m  │ 0.3% │ 0.4% │ 0.2% │
```

**Dimensions (per row)**:
- Height: 48px standard / 56px post-event
- Cell padding: 12px horizontal
- Row separator: 1px bottom border, border-subtle

**Column Specifications**:

| Column | Width | Content | Style |
|--------|-------|---------|-------|
| Time | 90px | "14:30" | data-sm, mono, text-tertiary, right-aligned |
| Country | 60px | "🇺🇸 USD" | body-sm, text-secondary, left-aligned |
| Impact | 40px | 8px colored dot | Centered (see impact colors below) |
| Event | auto (flex-1) | "US Core CPI m/m" | body-sm, truncate with ellipsis on overflow |
| Forecast | 100px | "0.3%" | data-sm, mono, text-secondary, right-aligned |
| Previous | 100px | "0.4%" | data-sm, mono, text-tertiary, right-aligned |
| Actual | 100px | "0.2%" | data-sm, mono, right-aligned, color-coded |

**Impact Dot Colors**:
- High: `#FF4757` (8px circle)
- Medium: `#FFA726` (8px circle)
- Low: `#78909C` (8px circle)

**Actual Value Coloring** (when post-event):
- Better than forecast (bullish for currency): text-market-bullish
- Worse than forecast (bearish for currency): text-market-bearish
- Same as forecast: text-market-neutral

**Row States**:
| State | Appearance |
|-------|-----------|
| Default | Standard row styling |
| Hover | bg-tertiary, cursor pointer |
| Current event (within 30 min) | Left border 3px accent-blue, subtle bg-accent-blue-muted (3%) |
| Ongoing (event time arrived) | Impact dot pulses (pulse-dot animation) |
| Post-event (just released, <5min) | Highlight row with bg-accent-blue-muted (5%) for 5 seconds, then normal |
| Group header | bg-elevated, 32px height, body-xs uppercase, text-tertiary, sticky top |

**Date Grouping**:
- Rows grouped by date
- Group header: "SATURDAY, APRIL 5, 2026" (body-xs, uppercase, text-tertiary)
- Sticky position when scrolling
- Separator line below header (1px, border-subtle)

**Props (React)**:
```typescript
interface CalendarRowProps {
  time: string; // "14:30"
  country: string; // "USD"
  countryCode: string; // "us" (for flag)
  impact: 'high' | 'medium' | 'low';
  event: string;
  forecast?: string;
  previous?: string;
  actual?: string | null;
  isCurrent?: boolean;
  onClick?: () => void;
}
```

---

## 5. Signal Card

```
┌─────────────────────────────────────────────────────────────┐
│ [LONG] EUR/USD                              2h ago  ● ACTIVE │
│                                                             │
│ 📊 Catalyst: US CPI misses expectations, USD weakens        │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ The US Consumer Price Index came in at 0.2% MoM,        │ │
│ │ missing the 0.3% consensus. This dovish surprise        │ │
│ │ suggests the Fed may have more room to cut rates...     │ │
│ │ ...                                                     │ │
│ │                                    [Read more ▼]        │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────┐  ┌─────────┐  ┌─────────┐                     │
│ │ Entry   │  │ Stop    │  │ Target  │                     │
│ │ 1.0850  │  │ 1.0810  │  │ 1.0920  │                     │
│ └─────────┘  └─────────┘  └─────────┘                     │
│                                                             │
│ Risk: 1.5% per trade    Invalidation: USD holds 109.50+   │
│                                                             │
│ [👤 AnalystX]  42 views · 8 responses  [★] [Expand] [↗]   │
└─────────────────────────────────────────────────────────────┘
```

**Dimensions**:
- Width: max 720px (feed column), full-width on mobile
- Padding: 20px (desktop), 16px (mobile)
- Background: bg-tertiary
- Border: 1px border-subtle, rounded-lg
- Gap between components inside: 12px

**Header**:
- Direction + Pair: body-md, weight 700
  - "LONG EUR/USD" or "SHORT GBP/USD"
- Direction Badge: pill, 4px padding, 11px uppercase, bold
  - LONG: bg-market-bullish-muted, text-market-bullish
  - SHORT: bg-market-bearish-muted, text-market-bearish
- Time Ago: body-xs, text-tertiary (e.g., "2h ago")
- Status Badge: pill with dot prefix
  - ACTIVE: green dot (6px) + "ACTIVE" (11px, uppercase)
  - HIT_TP: green dot + "TP HIT"
  - HIT_SL: red dot + "SL HIT"
  - MANUAL_CLOSE: gray dot + "CLOSED"

**Catalyst Line**:
- Icon + text label: body-sm, text-secondary
- Font: 14px, regular weight
- Max 1 line, no truncation

**Thesis Block**:
- Background: bg-primary (darker than card), rounded-md, padding 12px
- Text: body-sm, line-clamp-4 (desktop), line-clamp-2 (mobile)
- "Read more" toggle (text-accent-blue, body-xs, bottom-right, with chevron ↓)
- Expand animation: height transitions 300ms, content fade-in 200ms with 150ms delay
- Expanded state: "Show less ▲" replaces "Read more ▼"

**Levels Section** (3-column grid, gap-12px):
- Each cell: bg-primary (darker), rounded-md, padding 12px, centered text
  - Label: body-xs, uppercase, text-tertiary, weight 600, letter-spacing 0.05em
  - Value: data-lg (22px), font-mono, weight 600 (for Member+), white
- Risk:Reward ratio shown below if all 3 levels present

**FREE User Level Gating**:
- Instead of values: Lock icon (icon-md, gold, centered) + text
  - "Upgrade to see exact levels" (body-xs, text-accent-gold)
- Dashed border around level cells (1px, border-accent-gold)
- Entire section has subtle bg-gold-muted (3% opacity) overlay
- Click opens pricing page or triggers upgrade modal

**Risk & Invalidation Line**:
- Font: body-xs, text-secondary
- Risk: "Risk: X.X% per trade"
- Invalidation: colored blue (text-accent-blue) for emphasis
- Layout: flex justify-between, responsive to stack on mobile

**Footer**:
- Border-top: 1px, border-subtle, padding-top 12px
- Left: Author avatar (24px circle) + display name (body-xs, weight 500)
- Center: Engagement stats (body-xs, text-tertiary): "42 views · 8 responses"
- Right:
  - Bookmark toggle (icon-sm, hover: fill gold)
  - Expand button (text-accent-blue, body-xs)
  - Share button (icon-sm, ghost)

**Expanded State** (after clicking Expand):
- Additional content slides down:
  - Full macro context paragraph
  - Intermarket correlation notes
  - Related calendar events list
  - Admin notes (if Analyst+ role)
- "Collapse" button replaces "Expand"
- Smooth height animation (300ms)

**Props (React)**:
```typescript
interface SignalCardProps {
  id: string;
  pair: string;
  direction: 'LONG' | 'SHORT';
  catalyst: string;
  thesis: string;
  entry?: number;
  stopLoss?: number;
  takeProfit?: number;
  riskPercent: number;
  invalidation: string;
  status: 'ACTIVE' | 'HIT_TP' | 'HIT_SL' | 'MANUAL_CLOSE';
  author: { name: string; avatarUrl?: string; role: string };
  timestamp: Date;
  views: number;
  responses: number;
  isBookmarked?: boolean;
  userRole: 'FREE' | 'MEMBER' | 'ANALYST' | 'ADMIN';
  onBookmark?: () => void;
  onExpand?: () => void;
}
```

---

## 6. Chat Message

```
┌────────────────────────────────────────────────────────────┐
│ [Avatar] AnalystX  ·  14:32 GMT                           │
│                                                             │
│ The CPI miss is likely to push EUR/USD higher.              │
│ Watch for 1.0850 as the first resistance.                   │
│                                                             │
│ [🐂 12] [🐻 3] [🔄 1] [👀 5]                               │
└────────────────────────────────────────────────────────────┘
```

**Dimensions**:
- Width: 100% of container
- Padding: 8px 12px
- Min-height: 48px (single line), auto (multi-line)
- Gap between components: 4px

**Author Info**:
- Avatar: 36px circle (32px on mobile), bg-tertiary, initials if no image
- Display Name: body-sm, weight 600
  - Admin/Analyst names: text-accent-gold
  - Member names: text-accent-blue
  - Free/Default names: text-primary
- Timestamp: body-xs, text-tertiary, mono (e.g., "14:32")
- Role Badge (optional): pill next to name for Analyst/Admin
  - "ANALYST" (gold, 10px uppercase)
  - "ADMIN" (blue, 10px uppercase)

**Message Content**:
- Font: body-sm (14px), regular weight, line-height 1.5
- Max width: 600px (prevents overly long lines on wide screens)
- Links: text-accent-blue, underline on hover
- Code mentions: font-mono, bg-primary, px-2, py-1, rounded-sm (e.g., `1.0850`)
- Mentions: text-accent-blue, bg-accent-blue-muted (e.g., @username)
- New messages: slide-in animation (200ms from bottom)
- Pinned messages: bg-elevated, border-left 3px accent-blue, pin icon

**Reactions Row**:
- Horizontal stack of reaction pills
- Each pill: 4px 8px padding, rounded-full, bg-primary (subtle), border 1px border-subtle
- Emoji + count (body-xs)
- Hover: bg-tertiary
- Click: Add user's reaction (count increments, highlight pill with color ring)
- Available reactions: 🐂 (Bullish), 🐻 (Bearish), 🔄 (Neutral), 👀 (Watching)
- "Add reaction" button: + icon, appears when hover row

**Props (React)**:
```typescript
interface ChatMessageProps {
  id: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
    role: 'FREE' | 'MEMBER' | 'ANALYST' | 'ADMIN';
  };
  content: string;
  timestamp: Date;
  isPinned?: boolean;
  reactions: {
    type: 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'WATCHING';
    count: number;
    userHasReacted?: boolean;
  }[];
  onReaction?: (type: string) => void;
  onReply?: () => void;
}
```

---

## 7. Dashboard Grid Layout

### 7.1 Grid System

```
┌─────────────────────────────────────────────────────┐
│ Welcome back, [Name]                    [⚙️] [▼]    │
├──────────────────────┬──────────────┬───────────────┤
│                      │              │               │
│  Watchlist           │   Active     │   PnL         │
│  (2 columns)         │   Signals    │   Summary     │
│                      │              │               │
├──────────────────────┼──────────────┼───────────────┤
│                      │              │               │
│  Education           │  Calendar    │  (empty/cta)  │
│  Progress            │  Sync        │               │
│                      │              │               │
└──────────────────────┴──────────────┴───────────────┘
```

### 7.2 Breakpoint Behavior

| Breakpoint | Columns | Card Sizing | Gap |
|-----------|---------|-------------|-----|
| ≥1280px (xl) | 3 columns | Watchlist spans 2 | 24px |
| 1024-1279px (lg) | 3 columns | All single col | 20px |
| 768-1023px (md) | 2 columns | All single col | 16px |
| <768px (sm) | 1 column | Stack vertically | 16px |

### 7.3 Card Base (Dashboard Card Shell)

- Background: bg-tertiary
- Border: 1px border-subtle, rounded-lg
- Padding: 20px
- Header: flex justify-between, mb-16px
  - Title: heading-sm (18px, weight 600)
  - Action link/button: text-accent-blue, body-xs
- Content: varies by card type
- Footer (optional): border-top subtle, pt-12px, action link

### 7.4 Dashboard Card Variants

| Card | Min Width | Min Height | Content |
|------|-----------|------------|---------|
| Watchlist | 520px | 200px | Table (see Calendar row specs adapted) |
| Active Signals | 280px | 200px | Mini signal list (compact, no thesis) |
| PnL Summary | 280px | 200px | Chart + stats |
| Education Progress | 280px | 160px | Progress bar + module info |
| Calendar Sync | 280px | 160px | Event list + export buttons |

---

## 8. Notification Badge & Dropdown

### 8.1 Notification Bell Icon

**Dimensions**:
- Icon: 20px (icon-md)
- Click area: 40x40px (ghost button)
- Badge: 16x16px circle, bg-status-error, white text, 10px bold font
- Position: top-right of bell icon (offset -4px, -4px)
- Badge shows only when count > 0
- Badge max: "99+" if over 99 notifications

**States**:
| State | Appearance |
|-------|-----------|
| Default | gray icon (text-secondary) |
| Unread | Badge with count |
| Hover | icon changes to text-primary, bg-tertiary pill |
| Click | Dropdown menu opens, badge clears |

### 8.2 Notification Dropdown

**Dimensions**:
- Width: 360px
- Max-height: 480px (scrollable)
- Position: top-right, below bell icon (8px gap)
- Background: bg-elevated, border 1px border-subtle, rounded-xl, shadow-dropdown
- Animation: fade-in + scale from 0.95 (200ms ease-out)

**Content Structure**:
- Header: "Notifications" (heading-sm) + "Mark all read" link (body-xs, blue, right-aligned)
- Divider: 1px border-subtle
- List of notifications (max 10, scrollable):
  - Each item: 48px height, px-12px, py-8px
    - Icon (left, 16px, colored by type)
      - Signal alert: trending icon, blue
      - Event reminder: calendar icon, orange
      - Squawk alert: zap icon, red
      - Chat reply: message icon, green
    - Text (flex-1):
      - Title (body-sm): "US CPI released in 15 minutes"
      - Time (body-xs, text-tertiary): "2 min ago"
    - Unread indicator: 6px dot, bg-accent-blue (left edge)
  - Hover: bg-tertiary
- Footer: "View all notifications" link (body-sm, full-width, text-accent-blue, py-8px, border-top subtle)
- Empty state: "No notifications" (body-sm, text-tertiary, centered, with Bell icon 32px above)

**Props (React)**:
```typescript
interface NotificationDropdownProps {
  notifications: NotificationItem[];
  unreadCount: number;
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onViewAll?: () => void;
  isOpen: boolean;
  onClose: () => void;
}

interface NotificationItem {
  id: string;
  type: 'signal_alert' | 'event_reminder' | 'squawk_alert' | 'chat_reply' | 'system';
  title: string;
  description?: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}
```

---

## 9. Auth Forms

### 9.1 Login Form

**Overall Layout**: Centered card, max-width 400px
- Card: bg-tertiary, border 1px border-subtle, rounded-xl, p-24px, shadow-card

**Form Fields**:

| Field | Type | Validation | Error Message |
|-------|------|-----------|---------------|
| Email | email | Required, valid format | "Please enter a valid email address" |
| Password | password | Required, min 8 chars | "Password must be at least 8 characters" |

**Input Field Full Spec**:
- Height: 44px
- Background: bg-secondary
- Border: 1px border-subtle, rounded-md
- Padding: 12px horizontal
- Text: body-md (16px), text-primary
- Placeholder: text-tertiary, italic
- Label: body-sm, text-secondary, 8px above input
- Focus: border-accent-blue, 2px ring outside (rgba(0,163,255,0.2))

**Password Field Extras**:
- Show/Hide toggle: Eye icon (20px), absolute right, 12px from edge, ghost button
- Text color: text-primary (visible), text-tertiary (hidden state placeholder)

**Submit Button**:
- Full width, h-44, rounded-md
- Default: bg-accent-blue, hover bg-accent-blue-hover, active bg-accent-blue-active
- Text: body-md (16px), weight 600, text-dark (#0B0F14)
- Loading state: Spinner (20px, white) + "Signing in..." text, disabled
- Error state: bg-status-error, "Invalid email or password"

**Links**:
- "Forgot password?" — body-sm, text-accent-blue, right-aligned below fields
- "Don't have an account? [Sign up]" — body-sm, text-tertiary, centered, link in blue
- Divider: "OR" line (body-xs, text-tertiary, centered, with horizontal rules on sides)
- Social: "Continue with Google" — outline button, full-width, Google icon + text

**Validation States**:
| State | Input Border | Error Text | Icon |
|-------|-------------|------------|------|
| Default | border-subtle | None | None |
| Focus (valid) | border-accent-blue + blue ring | None | None |
| Focus (invalid) | border-status-error + red ring (rgba(255,71,87,0.2)) | Red, 12px, below input | AlertTriangle icon (14px, right inside input) |
| Success | border-success + green ring | None | Check icon (14px, right inside input) |
| Disabled | border-subtle, opacity 50% | None | None |

**Props (React)**:
```typescript
interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => Promise<void>;
  onForgotPassword?: () => void;
  onSocialLogin?: (provider: 'google') => void;
  isLoading?: boolean;
  serverError?: string;
}
```

### 9.2 Register Form

**Additional Fields**:
| Field | Type | Validation | Error Message |
|-------|------|-----------|---------------|
| Username | text | Required, 3-20 chars, alphanumeric | "Username must be 3-20 characters" |
| Display Name | text | Optional, 2-50 chars | None (optional) |
| Password | password | Required, min 8 chars, 1 uppercase, 1 number | "Password too weak" |
| Confirm Password | password | Must match Password | "Passwords do not match" |

**Password Strength Indicator**:
- 4-segment bar below password field (400x4px, gap 4px)
- Segments fill and change color based on strength:
  - 0 segments: Empty
  - 1 segment red: Weak (< 8 chars or no variety)
  - 2 segments orange: Fair (8 chars + 1 variety)
  - 3 segments yellow: Good (8+ chars, upper + number)
  - 4 segments green: Strong (8+ chars, upper + number + special)
- Label below: "Weak" / "Fair" / "Good" / "Strong" (12px, matching color)

---

## 10. Pricing Comparison Table

### 10.1 Tier Cards (Above Table)
See wireframes.md Section 8. Card specifications follow the card base (Section 7.3).

**CTA Button Variants for Pricing Cards**:

| Tier | Button | Variant | Background |
|------|--------|---------|-----------|
| Free | "Get Started Free" | Outline | transparent, border-subtle |
| Member | "Start Free Trial" | Primary bg-accent-blue | — |
| Analyst | "Apply for Analyst" | Gold | bg-accent-gold, text-dark (#0B0F14) |

### 10.2 Full Comparison Table

**Layout**:
- Width: 100% (scrollable horizontally on small screens)
- Sticky first column (feature names)
- 3 data columns: Free, Member, Analyst

**Header Row**:
- Height: 64px
- Background: bg-elevated
- Border bottom: 2px border-subtle
- First cell: empty (sticky)
- Tier cells:
  - Tier name: heading-sm (18px, weight 600)
  - Price: data-md (mono, text-primary) below name
  - CTA button: button-sm (32px height)
  - Recommended column (Member): top border 3px accent-blue

**Data Rows**:
- Height: 48px
- Alternating background: none (transparent), hover bg-tertiary
- Border bottom: 1px border-subtle
- First cell (feature name): body-sm, weight 500
  - Sub-categories have indented group headers (heading-sm, uppercase, bg-secondary, 40px height)
- Tier cells: centered content (checkmark icon or dash)
  - ✓: icon-md (20px), text-market-bullish
  - ✗: icon-md (20px), text-tertiary (not bold, just a dash)
  - Limited access: "Partial" label (body-xs, text-secondary) with tooltip

**Category Group Headers**:
- Full row, bg-secondary, 40px height
- Text: body-xs, uppercase, weight 600, letter-spacing 0.05em, text-secondary
- Example: "— MARKET DATA —"

**Responsive (Mobile)**:
- Table replaced by expandable "Compare all features" accordion
- Opens to scrollable table with pinch-zoom
- Or: vertical comparison (feature by feature, 3 columns per row)

**Props (React)**:
```typescript
interface PricingComparisonProps {
  tiers: PricingTier[];
  features: FeatureCategory[];
  onSelectTier: (tierId: string) => void;
  selectedTier?: string;
  billingCycle: 'monthly' | 'annual';
}

interface PricingTier {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  description: string;
  cta: string;
  recommended?: boolean;
}

interface FeatureCategory {
  name: string;
  features: {
    name: string;
    free: boolean | string; // string for partial access text
    member: boolean;
    analyst: boolean;
  }[];
}
```

---

## 11. Additional Components

### 11.1 Skeleton Loading

Used for all data-heavy components (price cards, calendar, signals, chat).

**Appearance**:
- Shape matches the element it replaces
- Background: bg-secondary
- Shimmer overlay: animated gradient (transparent → rgba(255,255,255,0.08) → transparent)
- Animation: 1.5s cycle, ease-in-out infinite
- Border-radius matches the target element

**Examples**:
- Price card skeleton: card outline, with shimmer blocks for pair name (60% width), price (40%), sparkline area, footer text
- Calendar row skeleton: 4 shimmer blocks (time 20%, event 50%, forecast 15%, actual 15%)
- Signal card skeleton: card outline, shimmer blocks for header, thesis (full width), levels (3 blocks), footer

### 11.2 Empty States

Used when no data is available (no watchlist items, no active signals, no chat messages).

**Layout**: Centered, vertical
- Icon: icon-2xl (48px), text-tertiary, centered
- Title: heading-md (20px), weight 600, centered, mb-2
- Description: body-sm, text-secondary, centered, mb-6
- CTA: button-md (or link) centered

**Example (Empty Watchlist)**:
```
┌─────────────────────────────┐
│           ⭐               │
│                             │
│   No watchlist items        │
│   Add currency pairs to     │
│   track their live prices   │
│                             │
│   [+ Add Pairs]             │
└─────────────────────────────┘
```

### 11.3 Toast Notifications

**Dimensions**:
- Width: 360px (desktop), full-width minus 32px padding (mobile)
- Padding: 12px 16px
- Background: bg-elevated, border-left 4px colored
- Border-radius: rounded-md
- Shadow: shadow-dropdown

**Types**:
| Type | Border Color | Icon | Usage |
|------|-------------|------|-------|
| Success | status-success | Check (green) | Action completed |
| Error | status-error | X (red) | Action failed |
| Warning | impact-medium | AlertTriangle | Caution/info |
| Info | accent-blue | Info (blue) | General information |

**Behavior**:
- Position: bottom-right corner (desktop), full-width bar bottom (mobile, above tab nav)
- Enter animation: slide up (300ms ease-out)
- Exit animation: fade out (200ms)
- Auto-dismiss: 4 seconds (slide out after fade)
- Manual dismiss: X icon top-right (16px, ghost)
- Maximum 3 toasts stacked (8px gap between)

### 11.4 Modal / Dialog

**Overlay**:
- Background: bg-overlay (rgba(11,15,20,0.8)), fixed, full viewport
- Animation: fade in (200ms)

**Dialog Box**:
- Width: max 520px (desktop), 90% viewport width (mobile)
- Background: bg-elevated, border 1px border-subtle, rounded-xl
- Shadow: shadow-modal
- Animation: scale 0.95→1 + fade in (300ms ease-out)
- Header: flex justify-between, pb-16px
  - Title: heading-lg (24px, weight 600)
  - Close button: X icon (20px), ghost, right-aligned

**Content**: Flexible (forms, confirmation, details)
**Footer**: Border-top subtle, pt-16px, flex justify-end, gap-12px
- Cancel: ghost button
- Confirm: primary button (or role-specific)

**Keyboard**:
- Escape key: closes modal
- Tab: traps focus within dialog
- Focus: first interactive element auto-focused on open

---

*End of UI Component Specifications. All components are designed for the dark-mode-first trader UI with data density prioritized over decoration. See design-system.md for global tokens, wireframes.md for page-level layouts.*
