# Design System Strategy: The Elevated Explorer

## 1. Overview & Creative North Star
This design system is built upon the Creative North Star of **"The Digital Curator."** We are not building a booking engine; we are crafting a digital concierge experience. The aesthetic must feel like a high-end travel journal—asymmetrical, tactile, and deeply immersive. 

To break the "template" look, we move away from rigid, full-width blocks. Instead, we use **intentional asymmetry**: images that overlap container boundaries, typography that breaks the grid, and "white space" that isn't white, but rather a sophisticated palette of sandy beiges and warm charcoals. The goal is a layout that feels organic, like the landscapes it showcases.

## 2. Colors & Surface Philosophy
The palette is rooted in the "Safari Dusk"—deep botanical greens, scorched earths, and the soft glow of a horizon.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. We define boundaries through tonal shifts. A section using `surface-container-low` (#f6f3f2) sitting on a `surface` (#fcf9f8) background creates a sophisticated, "quiet" transition that a border would only disrupt.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine stationery and tinted glass.
- **Level 0 (Foundation):** `surface` (#fcf9f8).
- **Level 1 (Sectioning):** `surface-container-low` (#f6f3f2) for large content areas.
- **Level 2 (Interaction):** `surface-container-highest` (#e4e2e1) for interactive cards or navigation bars.
- **Nesting:** To create depth, place a `surface-container-lowest` (#ffffff) card inside a `surface-container-low` (#f6f3f2) background. This creates a "lifted" effect through color alone.

### Glass & Gradient Rule
To achieve a premium feel, use **Glassmorphism** for floating UI (e.g., navigation bars or image captions). Use `surface` at 80% opacity with a `20px` backdrop blur. 
- **Signature Texture:** For primary CTAs, use a subtle linear gradient from `primary` (#17341d) to `primary-container` (#2d4b32) at 135 degrees. This adds "soul" and prevents the buttons from looking like flat, digital stickers.

## 3. Typography
The typographic soul of this system is the tension between the timeless `notoSerif` (Heading) and the modern `plusJakartaSans` (Body).

- **Display & Headline (notoSerif):** These are your "Editorial Voices." Use `display-lg` (3.5rem) for hero titles. The high contrast of the serif evokes the feeling of a luxury magazine.
- **Title & Body (plusJakartaSans):** Designed for legibility. The geometric nature of Jakarta Sans provides a clean, modern counterpoint to the organic serifs.
- **Label (plusJakartaSans):** Use `label-md` with `0.05rem` letter-spacing for all-caps sub-headers to add an authoritative, curated feel.

## 4. Elevation & Depth
We eschew traditional "drop shadows" in favor of **Tonal Layering** and **Ambient Light**.

- **The Layering Principle:** Depth is achieved by stacking surface tokens. A `surface-container-lowest` card on a `surface-dim` background provides all the "lift" required for a premium feel.
- **Ambient Shadows:** If a shadow is required (e.g., a floating booking widget), use a diffused shadow: `box-shadow: 0 20px 40px rgba(27, 28, 28, 0.06)`. Note the use of the `on-surface` color (#1b1c1c) at a very low opacity to mimic natural shadows.
- **The "Ghost Border" Fallback:** If a container requires a border for accessibility, use the `outline-variant` token at 20% opacity. Never use 100% opaque lines.

## 5. Components

### Buttons
- **Primary:** High-contrast `primary` (#17341d) background with `on-primary` (#ffffff) text. Use `rounded-md` (0.75rem). Transition to the signature gradient on hover.
- **Secondary:** `secondary` (#904d00) with a `surface-tint` overlay on hover. These represent the "burnt orange" accent, used sparingly for conversion.
- **Tertiary:** No background. Use `notoSerif` typography with a subtle underline using the `secondary` color.

### Cards & Lists
- **Rule:** Forbid the use of divider lines. 
- **Implementation:** Separate list items using `spacing-4` (1.4rem) of vertical space. For cards, use background color shifts (`surface-container-low`) and the `xl` (1.5rem) corner radius for a soft, approachable feel.

### Input Fields
- **Styling:** Use `surface-container-highest` for the input background. No border. Use `label-md` for the floating label.
- **Focus State:** Transition the background to `surface-container-lowest` and add a 2px "Ghost Border" using the `primary` color at 40% opacity.

### Featured Image Component (Custom)
A bespoke component for this system. A high-resolution image with a `lg` (1rem) corner radius, featuring a floating "Glass" caption in the bottom-left corner using `surface-variant` at 70% opacity with a heavy backdrop-blur.

## 6. Do's and Don'ts

### Do
- **Do** allow images to break the container grid. An elephant trunk or a mountain peak should "bleed" into the next section to create movement.
- **Do** use `spacing-20` or `spacing-24` for section padding. High-end experiences require extreme breathing room.
- **Do** use "Warm Earth" tones for text. Instead of pure black, use `on-surface` (#1b1c1c).

### Don't
- **Don't** use `rounded-none`. Everything in nature has a radius; our UI should too.
- **Don't** use standard "Select" dropdowns. Create custom, full-screen "Selection Sheets" that feel like choosing from a menu at a 5-star lodge.
- **Don't** use 1px dividers. If you feel the need for a line, try using more whitespace or a subtle color shift first.