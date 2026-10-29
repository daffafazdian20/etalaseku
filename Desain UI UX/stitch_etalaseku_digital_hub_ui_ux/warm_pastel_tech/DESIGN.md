---
name: Warm Pastel Tech
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#efeeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#5c3f42'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ed'
  outline: '#906e71'
  outline-variant: '#e5bdc0'
  surface-tint: '#bd0041'
  primary: '#b9003f'
  on-primary: '#ffffff'
  primary-container: '#e51152'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb2ba'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#5d5a67'
  on-tertiary: '#ffffff'
  tertiary-container: '#767380'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9dc'
  primary-fixed-dim: '#ffb2ba'
  on-primary-fixed: '#400010'
  on-primary-fixed-variant: '#910030'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#e6e0f0'
  tertiary-fixed-dim: '#c9c4d3'
  on-tertiary-fixed: '#1c1a25'
  on-tertiary-fixed-variant: '#484552'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
  cta-hover: '#E11D48'
  pastel-pink: '#FDEEF1'
  pastel-lavender: '#F3EDFD'
  pastel-mint: '#E8F8F5'
  surface-card: '#FFFFFF'
  midnight-indigo: '#1E1B4B'
  text-muted: '#64748B'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 68px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
  space-2xl: 4rem
---

## Brand & Style

This design system blends an inviting, creator-first digital academy tone with structured, high-conversion tech clarity. Inspired by fluid pastel canvas dynamics, the aesthetic balances warm organic comfort with decisive, corporate-level typographic discipline. 

### Core Characteristics
- **Welcoming & Approaching:** Eliminates cold, intimidating software tropes by relying on a comforting warm ivory foundation rather than stark laboratory whites.
- **Dynamic Pastel Canvas:** Segments complex curriculum, digital products, and workflows using organic wavy canvas planes in blush pink, lavender, and mint.
- **High-Velocity Accents:** Anchors soft backdrops with high-contrast slate navy typography and a vibrant hot-pink conversion engine.

### Movement
Playful Modern Tech. It synthesizes soft organic surface layering, floating card elevations, and pill-shaped touchpoints to cultivate confidence, creativity, and delight.

## Colors

The palette employs a multi-tiered surface system calibrated for warmth, readability, and immediate action recognition.

### Color Roles
- **Primary (`#FF2E63`):** Reserved for core conversion points, high-priority interactive CTAs, active states, and focal headline underlines. Transitions to `cta-hover` (`#E11D48`) on pointer hover.
- **Secondary (`#0F172A`):** The structural grounding tone. Applied to major headlines, dark wave footer fields, and high-contrast structural assets.
- **Tertiary (`#F3EDFD`):** Soft lavender accent canvas tone used for secondary contextual surfaces, category badges, and fluid section transitions.
- **Neutral (`#FFFDF9`):** The default root canvas tint. Provides a soothing ivory atmosphere that makes white surface cards visually float without aggressive contrast.

### Supplementary Named Roles
- **`pastel-pink` (`#FDEEF1`) & `pastel-mint` (`#E8F8F5`):** Alternating background canvas waves and thematic category badge containers.
- **`surface-card` (`#FFFFFF`):** Strictly reserved for elevated interactive panels, course cards, and modal sheets.
- **`text-muted` (`#64748B`):** Supporting paragraph body copy and secondary metadata.

## Typography

Typography pairs geometric approachability with razor-sharp functional clarity:
- **Headlines & Labels (`Plus Jakarta Sans`):** Delivers friendly curves and strong structural legibility for hero titles, section divisions, and action badges.
- **Body Text (`Inter`):** Powers long-form readability across curriculum breakdowns, product specifications, and transaction checkouts.

Editorial highlights inside primary headlines should wrap targeted words with `color: #FF2E63` and an optional hand-drawn style wave underline accent to anchor visual rhythm.

## Layout & Spacing

The layout is built upon a 12-column responsive fluid grid bounded by a max-width container of `1240px`.

### Grid & Margins
- **Desktop (≥1024px):** 12 columns, `1.5rem` gutters, `2rem` screen margins.
- **Tablet (768px - 1023px):** 8 columns, `1.25rem` gutters, `1.5rem` screen margins.
- **Mobile (<768px):** 4 columns, `1rem` gutters, `1.25rem` screen margins.

### Section Transitions
Vertical sections transition organically rather than using linear borders. Each thematic section alternates between `#FFFDF9`, `#FDEEF1`, `#F3EDFD`, `#E8F8F5`, and the dark navy `#0F172A` footer using asymmetrical SVG wave dividers with minimum heights of `64px` on mobile and `120px` on desktop.

## Elevation & Depth

Visual hierarchy uses a layered, floating plane technique rather than dark structural shadows. Pure white cards visually detach from the warm ivory and pastel backdrops using broad, low-opacity ambient drop shadows tinted with slate.

### Elevation Levels
- **Level 0 (Flat Canvas):** Root backgrounds (`#FFFDF9`) and fluid pastel dividers (`#FDEEF1`, `#F3EDFD`, `#E8F8F5`). No shadow.
- **Level 1 (Floating Elements & Cards):** Standard course containers, metric cards, and showcase blocks (`#FFFFFF`). `box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.05), 0 4px 10px -2px rgba(15, 23, 42, 0.02);`
- **Level 2 (Hover & Interactive Focus):** Cards upon pointer hover and interactive category chips. `box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.08), 0 8px 16px -4px rgba(15, 23, 42, 0.03);` with a `-4px` vertical transform.
- **Level 3 (Sticky & Floating Utility):** Dynamic announcement bar and floating WhatsApp support widget. `box-shadow: 0 12px 32px 0 rgba(15, 23, 42, 0.12);`
- **Level 4 (Modals & Overlays):** Checkout bottom sheets, slide-overs, and lightboxes. `box-shadow: 0 25px 60px -12px rgba(15, 23, 42, 0.25);` complemented by a soft frosted backdrop (`rgba(15, 23, 42, 0.4)` with `backdrop-filter: blur(8px)`).

## Shapes

The shape vocabulary emphasizes welcoming, organic geometry through prominent pill-shaped contours and generous container radiuses.

### Geometry Guidelines
- **Buttons, Badges & Chips:** Fully pill-shaped (`border-radius: 9999px`).
- **Standard Cards & Modals:** Generous 20px to 24px (`rounded-2xl` to `rounded-3xl` equivalents) corner rounding, preventing aggressive corners and complementing the curved wave section breaks.
- **Icons & Metric Containers:** Enclosed in `16px` squircle or `9999px` circular pastel enclosures.

## Components

### Buttons
- **Primary CTA:** Pill-shaped, background `#FF2E63`, text `#FFFFFF`, font `Plus Jakarta Sans` semi-bold (`label-md` or `label-lg`). Includes subtle horizontal arrow or action glyph. Hover shifts to `#E11D48` with a smooth scale lift (`transform: translateY(-2px)`).
- **Secondary CTA:** Pill-shaped, background `#FFFFFF` or transparent, border `1.5px solid #0F172A`, text `#0F172A`. Hover shifts background to `rgba(15, 23, 42, 0.04)`.
- **Ghost CTA:** Text `#FF2E63` or `#0F172A` with an animated right arrow on hover. No container box.

### Chips & Badges
- **Pill Metric Badges:** Small floating pill containers with pure white background, subtle hairline border `rgba(15, 23, 42, 0.08)`, ambient Level 1 elevation, and leading emoji or vibrant colored dot indicators.
- **Category Filter Chips:** Pill-shaped, pastel tinted (`#FDEEF1`, `#F3EDFD`, `#E8F8F5`). Active state transitions to `#0F172A` with `#FFFFFF` text.

### Cards
- **Product & Category Cards:** Constructed on `#FFFFFF` surfaces with 20px border radius, hairline borders (`1px solid rgba(15, 23, 42, 0.04)`), and Level 1 elevation. Padding is generous (`1.5rem` to `2rem`). Contains an icon squircle at the top, a `Plus Jakarta Sans` headline, an `Inter` body description, and a pill button or link anchor at the bottom.

### Inputs & Form Fields
- **Text Inputs:** Pill-shaped for single fields (e.g., email captures) with `#FFFFFF` background, `1.5px solid #E2E8F0`, padding `0.75rem 1.25rem`. Focused state introduces a `#FF2E63` border and soft outer ring (`box-shadow: 0 0 0 3px rgba(255, 46, 99, 0.15)`).
- **Checkboxes & Radios:** Rounded-md (8px) for checkboxes, circular for radios. Inactive state uses `#E2E8F0` border; checked state fills with `#FF2E63` and white glyphs.

### Lists
- Unordered lists utilize custom rounded checkmark indicators enclosed in `#E8F8F5` circles with green checkmarks or hot-pink sparkles rather than native bullet dots.