# Araby Style Guide

Design system and responsive guidelines for the Araby Islamic API landing page.

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--night` | `#0D1117` | Primary background |
| `--deep` | `#111820` | Secondary background |
| `--card` | `#161E28` | Card backgrounds |
| `--border` | `rgba(255,255,255,0.06)` | Subtle borders |
| `--gold` | `#C9A84C` | Primary accent, CTAs |
| `--gold-light` | `#E8C97A` | Hover states, highlights |
| `--gold-dim` | `rgba(201,168,76,0.15)` | Subtle gold backgrounds |
| `--teal` | `#2A7F7F` | Secondary accent |
| `--teal-light` | `#3AAFAF` | Secondary highlights |
| `--text` | `#E8E8E4` | Body text |
| `--muted` | `#8A8F9A` | Secondary text, labels |
| `--white` | `#FFFFFF` | Headings, emphasis |

## Typography

### Font Families
- **Urbanist** (`font-urbanist`): Primary font for headings and UI
- **Cairo** (`font-cairo`): Arabic text support
- **Amiri** (`font-amiri`): Quranic/classical Arabic text

### Font Sizes (Desktop → Mobile)
| Element | Desktop | Mobile |
|---------|---------|--------|
| Hero title | 64px | 36px |
| Section title | 40px | 28px |
| Section subtitle | 18px | 15px |
| Body text | 16px | 14px |
| Labels/Eyebrow | 11-12px | 11px |
| Buttons | 14-16px | 13-14px |

## Spacing

### Section Padding
- **Desktop**: `96px 40px` (top/bottom, left/right)
- **Mobile**: `64px 20px`

### Component Spacing
- Card padding: `24px` desktop, `16px` mobile
- Grid gaps: `48px` desktop, `32px` mobile
- Element margins: Scale down by ~30% on mobile

## Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| Mobile | `≤768px` | Phones, small tablets |
| Tablet | `769px - 1024px` | Tablets, small laptops |
| Desktop | `>1024px` | Laptops, desktops |

## Mobile-Specific Guidelines

### Layout
1. **Single column layouts**: All multi-column grids collapse to single column
2. **Stack elements vertically**: Side-by-side elements should stack
3. **Full-width buttons**: CTAs should span container width
4. **Reduced horizontal padding**: Use `20px` instead of `40px`

### Navigation
- Use hamburger menu icon (☰) for mobile nav
- Slide-in menu from right side
- Menu items stack vertically with `16px` spacing
- Language switcher visible in mobile menu

### Cards & Containers
- Reduce border-radius from `16px` to `12px`
- Remove complex shadows, use subtle borders
- Stack card content vertically
- Reduce internal padding by 30%

### Forms & Inputs
- Full-width inputs on mobile
- Larger touch targets: minimum `44px` height
- Stack label above input (not inline)
- Select dropdowns: native appearance on iOS/Android

### Images & Media
- Use `object-fit: cover` for responsive images
- Max-width: 100% to prevent overflow
- Consider lazy loading for performance

### Touch Interactions
- Minimum touch target: `44x44px`
- Increase button padding for easier tapping
- Remove hover-only effects, use active states
- Add `touch-action: manipulation` to prevent zoom

## Component Patterns

### Buttons

```css
/* Primary Button */
background: var(--gold);
color: var(--night);
padding: 12px 28px;  /* Desktop */
padding: 10px 20px;  /* Mobile */
border-radius: 8px;
font-weight: 600;

/* Secondary Button */
background: transparent;
border: 1px solid var(--gold);
color: var(--gold);
```

### Cards

```css
background: var(--card);
border: 1px solid var(--border);
border-radius: 16px;  /* Desktop */
border-radius: 12px;  /* Mobile */
padding: 24px;  /* Desktop */
padding: 16px;  /* Mobile */
```

### Section Headers

```css
/* Eyebrow */
font-size: 11px;
letter-spacing: 2px;
text-transform: uppercase;
color: var(--gold);

/* Title */
font-size: 40px;  /* Desktop */
font-size: 28px;  /* Mobile */
color: var(--white);
font-weight: 700;

/* Description */
font-size: 18px;  /* Desktop */
font-size: 15px;  /* Mobile */
color: var(--muted);
max-width: 600px;
```

## RTL Support (Arabic)

When `dir="rtl"`:
- Text aligns right
- Flex direction reverses
- Margins/paddings swap (use logical properties)
- Icons flip horizontally where appropriate

```css
/* Use logical properties */
margin-inline-start: 16px;  /* Instead of margin-left */
padding-inline-end: 12px;   /* Instead of padding-right */
```

## Animations

### Allowed Animations
- Subtle fade-ins (opacity transitions)
- Gentle slide-ups on scroll
- Soft pulsing for loading states
- Glow effects for highlights

### Animation Guidelines
- Duration: 0.2s-0.4s for UI, 0.6s-1.2s for reveals
- Easing: `ease-out` or `power3.out`
- Reduce motion on `prefers-reduced-motion`
- Disable complex animations on mobile for performance

## Accessibility

1. Color contrast ratio: minimum 4.5:1 for text
2. Focus states visible on all interactive elements
3. Skip navigation links for screen readers
4. Proper heading hierarchy (h1 → h2 → h3)
5. Alt text for all images
6. ARIA labels for icon-only buttons

## Performance Tips

1. Use CSS variables for theming
2. Avoid deep nesting in selectors
3. Minimize use of `!important`
4. Use `will-change` sparingly
5. Lazy load images below the fold
6. Defer non-critical animations
