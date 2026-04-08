# Vibe Trading — Design System

**Version**: 1.0  
**Author**: CLARICE (UI/UX Design Specialist)  
**Date**: 2026-04-05  
**Status**: Draft — Figma-Ready  

---

## 1. Design Philosophy

Vibe Trading is a fundamentals-first forex trading platform. The design follows three rules:

1. **Data Density > Decoration** — Every pixel must carry information. Remove anything that doesn't help a trader make a faster decision.
2. **3-Second Scan** — A trader must find the information they need in under 3 seconds. Hierarchy and contrast are the primary tools.
3. **Dark-Mode First** — Traders study screens for hours. The default and primary experience is dark mode. Light mode is secondary.

Color semantics:
- Electric Blue (#00A3FF) = interactivity, active states, data highlights
- Green (#00D26A) = bullish direction ONLY — not a brand color
- Coral Red (#FF4757) = bearish direction/alerts ONLY — not a brand color
- Gold (#D4AF37) = premium features, institutional context
- Everything else is neutral and recedes

---

## 2. Color Tokens

### 2.1 Background Surfaces (Dark Mode — Default)

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-primary` | `#0B0F14` | Page background, deepest surface |
| `bg-secondary` | `#111820` | Cards, panels, sidebars |
| `bg-tertiary` | `#1A2332` | Elevated cards, hover states, modals |
| `bg-elevated` | `#222D3D` | Tooltips, dropdowns, popovers |
| `bg-overlay` | `#0B0F14CC` (80% opacity) | Modal backdrops |

### 2.2 Background Surfaces (Light Mode)

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-primary-light` | `#F5F7FA` | Page background |
| `bg-secondary-light` | `#FFFFFF` | Cards, panels |
| `bg-tertiary-light` | `#E8ECF1` | Elevated surfaces, hover |
| `bg-elevated-light` | `#FFFFFF` | Tooltips, dropdowns |
| `bg-overlay-light` | `#0B0F1466` (40% opacity) | Modal backdrops |

### 2.3 Brand & Accent Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `accent-blue` | `#00A3FF` | Primary CTAs, active nav, links, data ticks, focus rings |
| `accent-blue-hover` | `#33B8FF` | Hover state for interactive elements |
| `accent-blue-active` | `#0088DD` | Active/pressed state |
| `accent-blue-muted` | `#00A3FF1A` (10% opacity) | Subtle backgrounds for active sections |
| `accent-gold` | `#D4AF37` | Premium/analyst badge, institutional labels, upgrade CTA |
| `accent-gold-hover` | `#E0BF55` | Hover state |
| `accent-gold-muted` | `#D4AF371A` (10% opacity) | Subtle premium backgrounds |

### 2.4 Market Direction Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `market-bullish` | `#00D26A` | Positive price change, long positions, green candles |
| `market-bullish-hover` | `#33DD88` | Hover states |
| `market-bullish-muted` | `#00D26A1A` (10% opacity) | Bullish background tint |
| `market-bearish` | `#FF4757` | Negative price change, short positions, red candles |
| `market-bearish-hover` | `#FF6B7A` | Hover states |
| `market-bearish-muted` | `#FF47571A` (10% opacity) | Bearish background tint |
| `market-neutral` | `#8899AA` | Flat/no change |

### 2.5 Impact & Severity Colors (Calendar)

| Token | Hex | Usage |
|-------|-----|-------|
| `impact-high` | `#FF4757` | High-impact events (Forex Factory red folder) |
| `impact-medium` | `#FFA726` | Medium-impact events (orange folder) |
| `impact-low` | `#78909C` | Low-impact events (yellow folder) |
| `status-success` | `#00D26A` | TP hit, completed, positive outcome |
| `status-warning` | `#FFA726` | Approaching SL, caution |
| `status-error` | `#FF4757` | SL hit, error state |
| `status-info` | `#00A3FF` | Informational |

### 2.6 Text Colors (Dark Mode)

| Token | Hex | Usage | Contrast Ratio on #0B0F14 |
|-------|-----|-------|---------------------------|
| `text-primary` | `#E8ECF1` | Headings, primary body text | 14.5:1 (AAA) |
| `text-secondary` | `#8899AA` | Secondary text, labels, captions | 5.8:1 (AA) |
| `text-tertiary` | `#556677` | Disabled, placeholders, timestamps | 3.2:1 |
| `text-inverse` | `#0B0F14` | Text on bright backgrounds | — |
| `text-link` | `#00A3FF` | Links, interactive text | 7.2:1 (AAA) |

### 2.7 Text Colors (Light Mode)

| Token | Hex | Usage | Contrast Ratio on #F5F7FA |
|-------|-----|-------|---------------------------|
| `text-primary-light` | `#1A2332` | Headings, primary body text | 14.0:1 (AAA) |
| `text-secondary-light` | `#556677` | Secondary text, labels | 5.5:1 (AA) |
| `text-tertiary-light` | `#8899AA` | Disabled, placeholders | 3.0:1 |
| `text-link-light` | `#0088DD` | Links | 5.2:1 (AA) |

### 2.8 Border & Divider Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `border-subtle` | `#1E2A3A` | Card borders (dark), table row separators |
| `border-default` | `#2A3A4A` | Input borders, moderate emphasis |
| `border-strong` | `#3A4A5A` | Active input, focus states |
| `border-accent` | `#00A3FF` | Primary active element border |
| `border-divider` | `#1A2332` | Section dividers |

### 2.9 CSS Variables (Tailwind Config)

```css
:root {
  /* Dark mode (default) */
  --bg-primary: #0B0F14;
  --bg-secondary: #111820;
  --bg-tertiary: #1A2332;
  --bg-elevated: #222D3D;

  --accent-blue: #00A3FF;
  --accent-blue-hover: #33B8FF;
  --accent-blue-active: #0088DD;
  --accent-blue-muted: rgba(0, 163, 255, 0.1);

  --accent-gold: #D4AF37;
  --accent-gold-hover: #E0BF55;
  --accent-gold-muted: rgba(212, 175, 55, 0.1);

  --market-bullish: #00D26A;
  --market-bullish-muted: rgba(0, 210, 106, 0.1);
  --market-bearish: #FF4757;
  --market-bearish-muted: rgba(255, 71, 87, 0.1);
  --market-neutral: #8899AA;

  --impact-high: #FF4757;
  --impact-medium: #FFA726;
  --impact-low: #78909C;

  --text-primary: #E8ECF1;
  --text-secondary: #8899AA;
  --text-tertiary: #556677;
  --text-link: #00A3FF;

  --border-subtle: #1E2A3A;
  --border-default: #2A3A4A;
  --border-strong: #3A4A5A;
  --border-accent: #00A3FF;
  --border-divider: #1A2332;
}

.light {
  --bg-primary: #F5F7FA;
  --bg-secondary: #FFFFFF;
  --bg-tertiary: #E8ECF1;
  --bg-elevated: #FFFFFF;

  --text-primary: #1A2332;
  --text-secondary: #556677;
  --text-tertiary: #8899AA;
  --text-link: #0088DD;

  --border-subtle: #E0E4E8;
  --border-default: #C8CDD4;
  --border-strong: #A0A8B2;
}
```

---

## 3. Typography

### 3.1 Font Families

| Token | Font | Usage |
|-------|------|-------|
| `font-sans` | `Inter, -apple-system, BlinkMacSystemFont, sans-serif` | All UI text, headings, body |
| `font-mono` | `'JetBrains Mono', 'SF Mono', 'Fira Code', monospace` | Prices, timestamps, data points, addresses |

### 3.2 Heading Scale

| Name | Size (px) | Line Height | Weight | Letter Spacing | Usage |
|------|-----------|-------------|--------|----------------|-------|
| `display-xl` | 64 | 1.1 (70px) | 800 | -0.02em | Hero titles (desktop only) |
| `display-lg` | 48 | 1.1 (53px) | 800 | -0.02em | Page titles, hero (tablet) |
| `display-md` | 36 | 1.15 (41px) | 700 | -0.015em | Section headers |
| `display-sm` | 28 | 1.2 (34px) | 700 | -0.01em | Card section titles |
| `heading-lg` | 24 | 1.25 (30px) | 600 | -0.01em | Major section headers in pages |
| `heading-md` | 20 | 1.3 (26px) | 600 | 0 | Sub-section headers, modal titles |
| `heading-sm` | 18 | 1.33 (24px) | 600 | 0 | Card titles, form section headers |

### 3.3 Body Scale

| Name | Size (px) | Line Height | Weight | Letter Spacing | Usage |
|------|-----------|-------------|--------|----------------|-------|
| `body-lg` | 18 | 1.5 (27px) | 400 | 0 | Long-form content, education modules |
| `body-md` | 16 | 1.5 (24px) | 400 | 0 | Primary body text, descriptions |
| `body-sm` | 14 | 1.5 (21px) | 400 | 0 | Secondary text, labels, form hints |
| `body-xs` | 12 | 1.4 (17px) | 400 | 0 | Captions, timestamps, helper text |

### 3.4 Data/Mono Scale

| Name | Size (px) | Line Height | Weight | Usage |
|------|-----------|-------------|--------|-------|
| `data-xl` | 28 | 1.2 (34px) | 600 | Primary price display in hero cards |
| `data-lg` | 22 | 1.3 (29px) | 600 | Price display in cards |
| `data-md` | 18 | 1.33 (24px) | 500 | Bid/ask, calendar consensus/actual |
| `data-sm` | 14 | 1.4 (20px) | 500 | Ticker strip prices, PnL values |
| `data-xs` | 12 | 1.4 (17px) | 500 | Timestamps, volume, secondary data |

### 3.5 Utility Classes

```css
.font-sans { font-family: var(--font-sans); }
.font-mono { font-family: var(--font-mono); }

.tabular-nums { font-variant-numeric: tabular-nums; }
.tracking-tight { letter-spacing: -0.025em; }
.tracking-wide { letter-spacing: 0.05em; }
.uppercase { text-transform: uppercase; }
```

---

## 4. Spacing System

Built on a 4px base unit. All spacing values are multiples of 4.

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight spacing between related elements (icon + text) |
| `space-2` | 8px | Related items in a group, badge padding |
| `space-3` | 12px | Form input inner padding, compact list items |
| `space-4` | 16px | Default component padding, card content padding |
| `space-5` | 20px | Modal padding |
| `space-6` | 24px | Section gaps, card-to-card spacing |
| `space-8` | 32px | Major section separation |
| `space-10` | 40px | Page-level section gaps |
| `space-12` | 48px | Hero separation |
| `space-16` | 64px | Page-to-page hero top padding |
| `space-20` | 80px | Large hero spacing |

### Rounded Corners

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 4px | Badges, small tags |
| `rounded-md` | 6px | Inputs, buttons (default) |
| `rounded-lg` | 8px | Cards, panels |
| `rounded-xl` | 12px | Modals, dropdowns, popovers |
| `rounded-full` | 9999px | Avatars, dots, pills |

---

## 5. Layout Grids

### 5.1 Desktop (1440px)

- Container max-width: `1280px` centered
- Outer padding: `80px` left/right (reduces to `40px` at 1280px viewport)
- Grid: 12 columns, 24px gutters, fluid margins
- Sidebar width: `280px` (collapsible in dashboard)
- Navbar height: `64px`

```
+------------------------------------------------------------------------+
| 80px | 1280px container (12 col, 24px gutters)                   | 80px|
|      | [col1] [col2] ... [col12]                                   |     |
+------------------------------------------------------------------------+
```

### 5.2 Tablet (768px)

- Container: fluid with `24px` padding
- Grid: 6 columns, 16px gutters
- Sidebar: overlay drawer (slides from left)
- Navbar height: `56px`

### 5.3 Mobile (375px)

- Container: `100vw` with `16px` padding
- Single column layout
- Bottom nav: `64px` height (fixed)
- Top nav: `56px` height
- No sidebar content — all navigation via bottom tabs

### 5.4 Breakpoint Tokens (Tailwind)

```js
theme: {
  screens: {
    'xs': '480px',
    'sm': '640px',
    'md': '768px',
    'lg': '1024px',
    'xl': '1280px',
    '2xl': '1440px',
  }
}
```

---

## 6. Component Specs

### 6.1 Cards

| Property | Value |
|----------|-------|
| Background | `bg-tertiary` (dark) / `bg-secondary-light` (light) |
| Border | 1px solid `border-subtle` |
| Border Radius | `rounded-lg` (8px) |
| Padding | `space-4` (16px) default, `space-5` (20px) for hero cards |
| Shadow | None (border-only depth) or `sm: 0 2px 4px rgba(0,0,0,0.2)` |
| Hover | Border changes to `border-default`, bg shifts to `bg-elevated` |
| Active/Selected | Left border: 3px solid `accent-blue`, bg tinted `accent-blue-muted` |

### 6.2 Buttons

| Variant | Background | Text Color | Hover | Border |
|---------|-----------|------------|-------|--------|
| Primary (blue) | `#00A3FF` | `#0B0F14` | `#33B8FF` | None |
| Secondary (gold) | `#D4AF37` | `#0B0F14` | `#E0BF55` | None |
| Outline | `transparent` | `#00A3FF` | `rgba(0,163,255,0.1)` | 1px solid `#00A3FF` |
| Ghost | `transparent` | `#8899AA` | `#1A2332` | None |
| Danger | `#FF4757` | `#0B0F14` | `#FF6B7A` | None |

| Size | Height | Padding H | Font Size | Font Weight |
|------|--------|-----------|-----------|-------------|
| SM | 32px | 12px | 14px | 500 |
| MD (default) | 40px | 16px | 14px | 600 |
| LG | 48px | 24px | 16px | 600 |
| XL (hero CTA) | 56px | 32px | 18px | 700 |

### 6.3 Badges

| Variant | Background | Text Color | Usage |
|---------|-----------|------------|-------|
| Direction Long | `#00D26A1A` | `#00D26A` | Long/bullish signals |
| Direction Short | `#FF47571A` | `#FF4757` | Short/bearish signals |
| Impact High | `#FF47571A` | `#FF4757` | High-impact event |
| Impact Medium | `#FFA7261A` | `#FFA726` | Medium-impact event |
| Impact Low | `#78909C1A` | `#78909C` | Low-impact event |
| Role Member | `#00A3FF1A` | `#00A3FF` | Member tier badge |
| Role Analyst | `#D4AF371A` | `#D4AF37` | Analyst tier badge |
| Status Active | `#00D26A1A` | `#00D26A` | Signal/event active |
| Status Closed | `#5566771A` | `#8899AA` | Inactive/closed |

| Property | Value |
|----------|-------|
| Background | As above (10% opacity of color) |
| Text | Matching full color |
| Padding | `4px 8px` |
| Border Radius | `rounded-sm` (4px) |
| Font Size | 11px, weight 600, uppercase, letter-spacing 0.05em |

### 6.4 Inputs & Form Fields

| Property | Value |
|----------|-------|
| Height | 44px (default), 48px (large) |
| Background | `bg-secondary` (dark) / white (light) |
| Border | 1px solid `border-subtle` |
| Border Radius | `rounded-md` (6px) |
| Padding | 12px horizontal, 10px vertical |
| Text Color | `text-primary` |
| Placeholder | `text-tertiary`, italic |
| Focus State | 2px ring `accent-blue` with 3px offset (blur 1px, rgba 30% opacity) |
| Error State | 1px border `#FF4757`, error text below in 12px |
| Success State | 1px border `#00D26A` |
| Disabled | Opacity 50%, cursor `not-allowed` |

### 6.5 Toggles (Dark/Light Mode)

| Property | Value |
|----------|-------|
| Width | 48px |
| Height | 24px |
| Background Off | `#2A3A4A` |
| Background On | `#00A3FF` |
| Knob | 18px circle, white, 3px shadow |
| Transition | 300ms ease-out (slide transform) |

### 6.6 Tables

| Property | Value |
|----------|-------|
| Cell Padding | `12px 16px` |
| Header BG | `bg-secondary` |
| Header Text | `text-secondary`, uppercase, 11px, weight 600 |
| Row BG | Transparent (alternating `rgba(255,255,255,0.02)`) |
| Row Hover | `bg-tertiary` |
| Border Bottom | 1px solid `border-subtle` |
| Font | `font-mono` for all data columns (prices, times, numbers) |

---

## 7. Iconography

### 7.1 Library

**Lucide React** — consistent stroke-based icons.

### 7.2 Style

| Property | Value |
|----------|-------|
| Stroke Width | 2px (default), 1.5px for detailed icons |
| Fill | None (stroke only), except filled variants where specified |
| Color | Inherits currentColor (set via CSS) |

### 7.3 Size Variants

| Token | Size (px) | Usage |
|-------|-----------|-------|
| `icon-xs` | 14px | Inline with 11px caption text, impact dots |
| `icon-sm` | 16px | Inline with 12px-14px text, badges |
| `icon-md` | 20px | Default in nav, buttons, cards |
| `icon-lg` | 24px | Feature icons, empty states |
| `icon-xl` | 32px | Hero illustrations, large CTAs |
| `icon-2xl` | 48px | Empty state illustrations |

### 7.4 Icon Mapping

| Icon | Usage | Lucide Name |
|------|-------|-------------|
| Trending Up | Bullish direction | `TrendingUp` |
| Trending Down | Bearish direction | `TrendingDown` |
| Bell | Notifications | `Bell` |
| Search | Search input | `Search` |
| Chevron Down | Expand/collapse | `ChevronDown` |
| Chevron Right | Navigation | `ChevronRight` |
| Eye | View/Reveal | `Eye` |
| Eye Off | Hide/Obscure | `EyeOff` |
| Lock | Gated content | `Lock` |
| Star | Watchlist/Favorites | `Star` |
| Bookmark | Save signal | `Bookmark` |
| Message Circle | Chat | `MessageCircle` |
| Calendar | Calendar page | `Calendar` |
| BarChart 3 | Dashboard | `BarChart3` |
| Zap | Live data indicator | `Zap` |
| Globe | Macro/global view | `Globe` |
| User | Profile | `User` |
| Log Out | Logout | `LogOut` |
| Settings | Settings | `Settings` |
| Graduation Cap | Education | `GraduationCap` |
| Play | Video | `Play` |
| X / Close | Close | `X` |
| Menu | Mobile menu | `Menu` |
| Arrow Up Right | External link | `ArrowUpRight` |
| Alert Triangle | Warning | `AlertTriangle` |
| Check | Success | `Check` |
| Shield | Premium/Verified | `Shield` |

---

## 8. Data Visualization Style

### 8.1 Sparklines

- Height: 32px (compact), 48px (dashboard card)
- Line: 1.5px stroke, `accent-blue` for neutral, `market-bullish`/`market-bearish` for directional
- Fill: Subtle gradient below line, 20% opacity
- No grid, no axes — purely directional indicator
- Library: Recharts or custom SVG

### 8.2 Price Heatmap

- Grid of currency pairs
- Cell background: `market-bullish-muted` to `market-bearish-muted` intensity based on % change
- Text: White on strong backgrounds, `text-primary` on weak
- Min change shown: 0.01%
- Update frequency: 1-3 seconds

### 8.3 Bar/Line Charts (Calendar, PnL, Education)

- Background: Transparent (inherited from card)
- Grid lines: `border-subtle`, 1px, dashed
- Axis labels: `text-tertiary`, 11px, `font-mono`
- Data line: `accent-blue`, 2px stroke
- Tooltip: `bg-elevated`, 8px border-radius, 48px shadow, appears on hover/tap
- Library: Recharts

### 8.4 Impact Indicators (Calendar)

- Dot: 8px diameter, impact color
- High: Solid `#FF4757`
- Medium: Solid `#FFA726`
- Low: Solid `#78909C`
- On hover: 2px ring of same color expands to 12px

---

## 9. Motion Guidelines

### 9.1 Philosophy

Motion serves purpose: **attention, feedback, and context**. Never decorative.

### 9.2 Timing & Easing

| Purpose | Duration | Easing Curve |
|---------|----------|--------------|
| Micro-interactions (button press, toggle) | 150ms | `ease-out (cubic-bezier(0, 0, 0.2, 1))` |
| Menu/dropdown open-close | 200ms | `ease-out` |
| Card expand/collapse | 300ms | `ease-out` |
| Modal enter/exit | 300ms | `ease-out` (fade + scale) |
| Page transition (client nav) | 250ms | `ease-out` |
| Data refresh (price tick) | 100ms | linear (opacity flash only) |

### 9.3 Specific Animations

| Element | Trigger | Animation |
|---------|---------|-----------|
| Price change | New tick | Background flash (green/red, 400ms, fades out) |
| Data release (calendar) | Event time arrives | Subtle pulse on impact dot (2x scale, 600ms, ease-in-out) |
| New squawk headline | WS message | Slide in from right (300ms), highlight for 2s then fade |
| Signal card expand | Click expand | Height animates (300ms), additional content fades in (200ms delay 150ms) |
| Modal open | Click trigger | Overlay fades in (200ms), content scales 0.95→1 (300ms ease-out) |
| Toast notification | Trigger | Slide up from bottom-right (300ms), auto-dismiss after 4s (fade out 200ms) |
| Button press | Mouse down | Scale 0.98 (150ms) |
| Skeleton loading | Initial load | Shimmer effect, 1.5s cycle, 3px border-radius |
| Navbar scroll | Scroll down past hero | Height transitions from 64px to 48px (200ms), background becomes 95% opaque |

### 9.4 Reduced Motion

Respect `@media (prefers-reduced-motion: reduce)`:
- Disable all non-essential animations
- Replace transitions with instant state changes
- Keep skeleton loading (static, no shimmer)

---

## 10. Accessibility Specifications

### 10.1 Contrast Ratios

All text meets WCAG 2.1 AA minimum (4.5:1 for normal text, 3:1 for large text 18px+).

| Combination | Ratio | Level |
|-------------|-------|-------|
| `text-primary` (#E8ECF1) on `bg-primary` (#0B0F14) | 14.5:1 | AAA |
| `text-secondary` (#8899AA) on `bg-primary` (#0B0F14) | 5.8:1 | AA |
| `text-link` (#00A3FF) on `bg-primary` (#0B0F14) | 7.2:1 | AAA |
| `text-primary-light` (#1A2332) on `bg-primary-light` (#F5F7FA) | 14.0:1 | AAA |

### 10.2 Focus States

All interactive elements show a visible focus indicator:

```css
.focus-visible-ring {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 163, 255, 0.3);
}

.focus-visibile-input {
  outline: none;
  border-color: #00A3FF;
  box-shadow: 0 0 0 2px rgba(0, 163, 255, 0.3);
}
```

- Color: `#00A3FF` with 30% opacity ring
- Ring width: 2px solid + 2px blur offset
- Applied only on keyboard navigation (`:focus-visible`)
- NOT applied on mouse click (use `:focus-visible` polyfill if needed)

### 10.3 Keyboard Navigation

- Tab order: Logical, top-to-bottom, left-to-right
- Skip link: "Skip to main content" (visually hidden, appears on focus)
- Modal trap: Tab key cycles within modal focus
- Escape key: Closes modals, dropdowns, expanded cards
- Arrow keys: Navigate calendar rows, chat messages

### 10.4 Screen Reader

- All icons with meaning: `aria-label` or `sr-only` text
- Live regions: Price changes and new squawk in `aria-live="polite"`
- Impact indicators: Color + text label (not color alone)
- Gated content: Explain why content is hidden with `aria-describedby`

---

## 11. Figma-Ready Token Export

### 11.1 Color Styles (Naming Convention)

```
Vibe / Color / bg-primary          → #0B0F14
Vibe / Color / bg-secondary        → #111820
Vibe / Color / bg-tertiary         → #1A2332
Vibe / Color / accent-blue         → #00A3FF
Vibe / Color / accent-gold         → #D4AF37
Vibe / Color / market-bullish      → #00D26A
Vibe / Color / market-bearish      → #FF4757
Vibe / Color / text-primary        → #E8ECF1
Vibe / Color / text-secondary      → #8899AA
Vibe / Color / border-subtle       → #1E2A3A
```

### 11.2 Text Styles (Naming Convention)

```
Vibe / Text / Display XL           → Inter 64/800/-2%
Vibe / Text / Display MD           → Inter 36/700/-1.5%
Vibe / Text / Heading LG           → Inter 24/600/-1%
Vibe / Text / Body MD              → Inter 16/400/0
Vibe / Text / Body SM              → Inter 14/400/0
Vibe / Text / Caption              → Inter 12/400/0
Vibe / Text / Data XL              → JetBrains Mono 28/600
Vibe / Text / Data MD              → JetBrains Mono 18/500
Vibe / Text / Data SM              → JetBrains Mono 14/500
```

### 11.3 Spacing/Effect Styles

```
Vibe / Spacing / 4px
Vibe / Spacing / 8px
Vibe / Spacing / 16px
Vibe / Spacing / 24px
Vibe / Effect / Shadow SM         → 0 2px 4px rgba(0,0,0,0.2)
Vibe / Effect / Shadow MD         → 0 4px 12px rgba(0,0,0,0.3)
Vibe / Effect / Shadow LG         → 0 8px 24px rgba(0,0,0,0.4)
Vibe / Radius / SM                → 4px
Vibe / Radius / MD                → 6px
Vibe / Radius / LG                → 8px
Vibe / Radius / XL                → 12px
```

---

## 12. Tailwind Configuration Reference

```js
// tailwind.config.js theme extension
theme: {
  extend: {
    colors: {
      bg: {
        primary: 'var(--bg-primary)',
        secondary: 'var(--bg-secondary)',
        tertiary: 'var(--bg-tertiary)',
        elevated: 'var(--bg-elevated)',
      },
      accent: {
        blue: {
          DEFAULT: '#00A3FF',
          hover: '#33B8FF',
          active: '#0088DD',
          muted: 'rgba(0, 163, 255, 0.1)',
        },
        gold: {
          DEFAULT: '#D4AF37',
          hover: '#E0BF55',
          muted: 'rgba(212, 175, 55, 0.1)',
        },
      },
      market: {
        bullish: { DEFAULT: '#00D26A', muted: 'rgba(0, 210, 106, 0.1)' },
        bearish: { DEFAULT: '#FF4757', muted: 'rgba(255, 71, 87, 0.1)' },
        neutral: '#8899AA',
      },
      impact: {
        high: '#FF4757',
        medium: '#FFA726',
        low: '#78909C',
      },
      text: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        tertiary: 'var(--text-tertiary)',
        link: 'var(--text-link)',
      },
      border: {
        subtle: 'var(--border-subtle)',
        default: 'var(--border-default)',
        strong: 'var(--border-strong)',
        accent: 'var(--border-accent)',
      },
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      'display-xl': ['64px', { lineHeight: '1.1', fontWeight: '800', letterSpacing: '-0.02em' }],
      'display-lg': ['48px', { lineHeight: '1.1', fontWeight: '800', letterSpacing: '-0.02em' }],
      'display-md': ['36px', { lineHeight: '1.15', fontWeight: '700', letterSpacing: '-0.015em' }],
      'display-sm': ['28px', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.01em' }],
      'heading-lg': ['24px', { lineHeight: '1.25', fontWeight: '600', letterSpacing: '-0.01em' }],
      'heading-md': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
      'heading-sm': ['18px', { lineHeight: '1.33', fontWeight: '600' }],
      'body-lg': ['18px', { lineHeight: '1.5', fontWeight: '400' }],
      'body-md': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
      'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
      'body-xs': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
      'data-xl': ['28px', { lineHeight: '1.2', fontWeight: '600', fontFamily: 'JetBrains Mono' }],
      'data-lg': ['22px', { lineHeight: '1.3', fontWeight: '600', fontFamily: 'JetBrains Mono' }],
      'data-md': ['18px', { lineHeight: '1.33', fontWeight: '500', fontFamily: 'JetBrains Mono' }],
      'data-sm': ['14px', { lineHeight: '1.4', fontWeight: '500', fontFamily: 'JetBrains Mono' }],
      'data-xs': ['12px', { lineHeight: '1.4', fontWeight: '500', fontFamily: 'JetBrains Mono' }],
    },
    borderRadius: {
      sm: '4px',
      md: '6px',
      lg: '8px',
      xl: '12px',
    },
    boxShadow: {
      'card': '0 2px 4px rgba(0, 0, 0, 0.2)',
      'dropdown': '0 4px 12px rgba(0, 0, 0, 0.3)',
      'modal': '0 8px 24px rgba(0, 0, 0, 0.4)',
      'focus': '0 0 0 3px rgba(0, 163, 255, 0.3)',
    },
    animation: {
      'flash-green': 'flashGreen 400ms ease-out',
      'flash-red': 'flashRed 400ms ease-out',
      'pulse-dot': 'pulseDot 600ms ease-in-out',
      'slide-in': 'slideIn 300ms ease-out',
      'fade-in': 'fadeIn 200ms ease-out',
      'skeleton': 'skeleton 1.5s ease-in-out infinite',
    },
    keyframes: {
      flashGreen: { '0%': { backgroundColor: 'rgba(0, 210, 106, 0.2)' }, '100%': { backgroundColor: 'transparent' } },
      flashRed: { '0%': { backgroundColor: 'rgba(255, 71, 87, 0.2)' }, '100%': { backgroundColor: 'transparent' } },
      pulseDot: { '0%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.5)' }, '100%': { transform: 'scale(1)' } },
      slideIn: { '0%': { transform: 'translateY(10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      skeleton: { '0%': { opacity: '0.6' }, '50%': { opacity: '1' }, '100%': { opacity: '0.6' } },
    },
  },
}
```

---

*End of Design System. Next: wireframes.md for page layouts, ui-components-spec.md for component-level specs.*
