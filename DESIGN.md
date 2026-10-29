---
name: Broken Pocket Modern Fintech
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#353944'
  surface-container-lowest: '#0a0e18'
  surface-container-low: '#171b26'
  surface-container: '#1c1f2a'
  surface-container-high: '#262a35'
  surface-container-highest: '#313540'
  on-surface: '#dfe2f1'
  on-surface-variant: '#bacbbe'
  inverse-surface: '#dfe2f1'
  inverse-on-surface: '#2c303b'
  outline: '#849589'
  outline-variant: '#3b4a41'
  surface-tint: '#00e297'
  primary: '#6dffba'
  on-primary: '#003822'
  primary-container: '#00e599'
  on-primary-container: '#00613e'
  inverse-primary: '#006c46'
  secondary: '#ffb4a4'
  on-secondary: '#630e00'
  secondary-container: '#b72301'
  on-secondary-container: '#ffcdc2'
  tertiary: '#c9e9ff'
  on-tertiary: '#00354a'
  tertiary-container: '#82d2ff'
  on-tertiary-container: '#005a7b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#4dffb2'
  primary-fixed-dim: '#00e297'
  on-primary-fixed: '#002112'
  on-primary-fixed-variant: '#005234'
  secondary-fixed: '#ffdad3'
  secondary-fixed-dim: '#ffb4a4'
  on-secondary-fixed: '#3d0600'
  on-secondary-fixed-variant: '#8c1800'
  tertiary-fixed: '#c4e7ff'
  tertiary-fixed-dim: '#7bd0ff'
  on-tertiary-fixed: '#001e2c'
  on-tertiary-fixed-variant: '#004c69'
  background: '#0f131d'
  on-background: '#dfe2f1'
  surface-variant: '#313540'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 3rem
    fontWeight: '800'
    lineHeight: 3.5rem
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '800'
    lineHeight: 2.75rem
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
  label-lg:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 0.875rem
    letterSpacing: 0.04em
  data-metric:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '700'
    lineHeight: 1.75rem
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.5rem
  gutter-desktop: 2rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

The brand visualizes personal finance not as an intimidating ledger of shame, but as an energetic, empowering game of financial resilience and wealth recovery. It reframes leaky spending habits ("pockets with holes") into actionable plugs and surplus capital.

The aesthetic is **Dark Mode Modern Fintech infused with Glassmorphic Precision**. Deep, ink-like midnight backdrops set an intimate, premium stage that dramatically reduces eye strain during frequent daily logging. Vibrant neon-mint accents signal healthy liquidity, compounding recovery, and momentum, while an electric coral/crimson provides sharp, unambiguous telemetry on active leaks, budget burns, and overages.

Surfaces leverage deep slate frost, precision border radiuses, and crisp structural lighting, avoiding gratuitous noise while retaining a tactile, bespoke app feel.

## Colors

The palette balances deep dark-space immersion with high-chroma data clarity:

- **Primary (`#00E599` Electric Emerald)**: Drives positive transactions, inflow balances, target completions, primary CTAs, and active metric summaries.
- **Secondary (`#FF5733` Leak Coral)**: Reserved for expense warnings, negative cash flow anomalies, leaky category badges, and critical destructive actions.
- **Tertiary (`#38BDF8` Liquidity Sky)**: Used for comparative analytics, investment buckets, recurring subscription trackers, and informational highlights.
- **Neutral Canvas (`#0B0F19` Midnight Obsidian)**: Foundation layer for mobile screens and root frame viewports.
- **Surface Elevation (`#111827` to `#1E293B`)**: Ranks cards, bottom sheets, and interactive overlays with subtle slate tinting.
- **Functional Border (`#334155` at 50-80% opacity)**: Delivers razor-sharp containment lines against dark layers.

## Typography

The typography pairs **Plus Jakarta Sans** for expressive, geometric headers and clean structural copy with **Inter** for data tables, transaction labels, and micro-metric badges.

- **Tabular Alignment**: All currency strings, percentages, date stamps, and numerical balances must enforce `font-feature-settings: "tnum" 1` to guarantee vertical decimal alignment across multi-row transaction feeds.
- **Metric Contrast**: Primary net worth figures and daily leak counters use bold, condensed-tracking scale to emphasize priority over adjacent analytical context.
- **Hierarchy Rules**: Captions and secondary subtitles must not drop below `#94A3B8` (Slate 400) to maintain high readability against obsidian backgrounds.

## Layout & Spacing

The design system operates on an **8-point base spatial rhythm** (with 4px sub-increments for compact interactive elements).

### Screen Adaptations
- **Mobile (<640px)**: 4-column fluid layout with `margin: 1rem` (16px) and `gutter: 1rem` (16px). Single vertical stacked feed for quick thumb ergonomics, floating transaction action trigger docked at the bottom center.
- **Tablet (640px–1024px)**: 8-column layout with `margin-tablet: 2rem` (32px). Splits summary telemetry cards into a dual-column dashboard with an inline transaction history pane.
- **Desktop (>1024px)**: 12-column layout max-width constrained to `1200px` centered, utilizing `margin-desktop: 3rem` (48px). Tri-column organization: Persistent Navigation, Core Flow/Cash Matrix, and Diagnostic Insights.

## Elevation & Depth

Visual hierarchy uses **Glassmorphism blended with Layered Obsidian Elevation** rather than stark drop shadows:

1. **Canvas (Level 0)**: `#0B0F19` solid obsidian base.
2. **Card Base (Level 1)**: `#111827` overlaid with `rgba(30, 41, 59, 0.70)` backdrop blur (12px), bordered by `1px solid rgba(51, 65, 85, 0.45)`.
3. **Elevated Elements & Modals (Level 2)**: `rgba(30, 41, 59, 0.90)` backdrop blur (20px), bordered by `1px solid rgba(148, 163, 184, 0.20)` with a subtle ambient glow: `box-shadow: 0 12px 32px -4px rgba(0, 0, 0, 0.5)`.
4. **Active Hero Glow**: Crucial metrics (like "Leak Plugged" or "Monthly Surplus") cast a subtle back-projected radial highlight using `rgba(0, 229, 153, 0.12)` or `rgba(255, 87, 51, 0.12)`.

## Shapes

The interface embraces a **modern curved architectural silhouette** to soften dense financial balance sheets:

- Standard cards, sheet containers, and modal sheets leverage `rounded-xl` (1.5rem / 24px) for a tactile, friendly physical card feel.
- Interactive controls, entry forms, buttons, and pill badges use soft `rounded-lg` (1rem / 16px) or fully radiused pill profiles (9999px) for status indicators.
- Border definitions should never exceed `1px` except on focused inputs or dynamic progress bars.

## Components

### Buttons
- **Primary Action (Deposit / Save / Plug Leak)**: Vibrant Electric Mint (`#00E599`) fill with `#0B0F19` text, weight 700. Pressed state dims slightly to `#05C783` with a soft mint rim glow (`0 0 16px rgba(0, 229, 153, 0.35)`).
- **Secondary (Inspect / Breakdown)**: Translucent Slate (`rgba(30, 41, 59, 0.8)`) with `1px solid rgba(51, 65, 85, 0.6)`, text `#F8FAFC`.
- **Destructive / Alert (Report Leak / Exceed Budget)**: Coral gradient fill (`linear-gradient(135deg, #FF5733, #F43F5E)`) with white bold text.

### Financial Metric Cards
- Container built from glassmorphic slate with rounded-xl corners.
- Houses a prominent top status label, large tabular figure, and a directional micro-trend pill (e.g., `+14.2% saved` inside an emerald-tinted pill).

### Input Fields
- Dark slate fills (`#111827`) with `1px solid rgba(51, 65, 85, 0.6)`.
- Focus state switches border to `#00E599` accompanied by a `2px` subtle halo.
- Integrated currency prefix pinned in tabular mono weight for lightning-fast amount entry.

### Chips & Financial Pills
- Compact, auto-layout pills (height 28px).
- Green variant: `rgba(0, 229, 153, 0.12)` background, `#00E599` text, `1px solid rgba(0, 229, 153, 0.3)`.
- Coral variant: `rgba(255, 87, 51, 0.12)` background, `#FF5733` text, `1px solid rgba(255, 87, 51, 0.3)`.

### Transaction List Items
- Clean single-line or double-line items bounded by subtle separator borders (`rgba(51, 65, 85, 0.3)`).
- Category avatar icon on the left with circular translucent backdrop.
- Right-aligned amount column: Outflows in Slate-50 with subtle Coral signifier, inflows in solid Electric Mint (`+$240.00`).

### Checkboxes & Segmented Controls
- Segmented timefilters (Day, Week, Month, Year) housed in `#0F172A` capsules with a sliding slate indicator tile (`#1E293B`) accented by thin light borders.
