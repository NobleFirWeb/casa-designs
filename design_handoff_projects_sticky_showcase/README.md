# Handoff: Projects Sticky Showcase (homepage projects-section redesign)

## Overview
Redesign of the `.projects-section` on the Casa Designs homepage (`index.html`). It replaces the current fixed-image scroll slider (`.projects-wrapper` / `.slider-img-wrapper`) with a **sticky showcase**: a pinned image frame on the left that crossfades between five project photos as their text blocks scroll past on the right, with a `01 / 05` counter. The section header (big uppercase title + spinning "VIEW ALL DESIGNS" red badge) is kept exactly as the site's existing `.header-row` pattern.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, not production code to copy blindly. The task is to **recreate this design inside the existing Casa Designs codebase** (vanilla HTML/CSS/JS with GSAP 3 + ScrollTrigger + SplitText and Lenis smooth scroll, deployed via GitHub Pages), following its established patterns: markup into `index.html`, styles into `css/styles.css`, scroll logic into `js/gsap.js` or `js/animations.js`.

That said, `reference.html` is written in the site's own idiom (same class-naming style, same `.header-row` / `.badge-container` markup), so most of its CSS can be adapted with minor changes.

## Fidelity
**High-fidelity.** Colors, typography, spacing, and interactions are final and match the site's existing design language. Recreate pixel-perfectly at desktop; responsive behavior below 1024px is left to the developer following the site's existing media-query patterns (see notes at the end).

## What to remove
In `index.html`, inside `<section class="projects-section">`, delete the current `.projects-wrapper` block (the `.wrapper`, `.slider-img-wrapper`, and the three `.slider` sections). Keep the `.header-row` above it. In `js/gsap.js`, remove `handleImageAnimation()` and the `.slider .title` / `.slider-img` timelines. In `css/styles.css`, the `.projects-wrapper`, `.slider-img-wrapper`, `.wrapper-header/footer`, and `.slider` rules (~lines 1778–1855) become dead and can be removed.

## Screens / Views

### Section header (unchanged pattern)
Keep the existing markup and styles: `.header-row` with `min-height: 25vh`, `border-bottom: 0.5px solid #999`; `.header-left` at 75% width, `padding: 3rem 0 1.5rem 12rem`, `h2` at `4vw / 600 / uppercase / line-height 0.85 / letter-spacing -0.25vw` split into two stacked spans ("Our" / "Recent Designs") with the site's `data-anm-scroll-text-reveal` SplitText reveal; intro `p` at `1.2vw`, `max-width: 70%`, black. `.header-right` (25%) holds the existing `.badge-container` (175px) with `.spinning-text-svg` (12s linear rotation, black fill, letter-spacing 2.25px, text "VIEW ALL DESIGNS • ") around the static `.btn-red-static` (#ff0000, 120px circle, white arrow, `scale(0.95)` on hover), linking to `gallery.html`.

### Sticky showcase (new)
Two-column flex row (`align-items: stretch`) directly below the header row.

**Left media column — 50% width**
- Padding: `40px 0 40px 4.5vw` (≈64px left at 1440).
- Inside: `.showcase-frame`, `position: sticky; top: 40px; height: calc(100vh - 80px)`, `border-radius: 8px`, `overflow: hidden`, background `#111111` (visible only during crossfade).
- All five images stacked `position: absolute; inset: 0; width/height: 100%; object-fit: cover`.
  - Inactive: `opacity: 0; transform: scale(1.06)`.
  - Active: `opacity: 1; transform: scale(1)`.
  - Transition: `opacity 0.6s ease, transform 0.9s ease`.
- Counter, bottom-left of frame (`left: 28px; bottom: 24px`), white, weight 600, `text-shadow: 0 1px 8px rgba(0,0,0,0.4)`: current number at 28px, `/ 05` at 14px, 70% opacity. Current number is zero-padded (`01`…`05`).

**Right text column — 50% width**
Five `.showcase-block`s, one per project:
- `min-height: 70vh`, flex column, vertically centered content, `padding: 0 6.5vw 0 5vw`, `border-bottom: 0.5px solid #999`.
- Number label `( _01 )`: 14px / 600 / letter-spacing 1px; color `#bbbbbb`, **`#ff0000` when active**, `transition: color 0.4s ease`. (Matches the nav's `( _01 )` numbering convention.)
- Title `h3`: `3vw` (≈43px at 1440) / 600 / uppercase / letter-spacing -0.1vw / line-height 0.95, `margin: 14px 0 0`.
- Description `p`: 17px / 300 / line-height 1.5 / `#333333` / `max-width: 44ch`, `margin: 20px 0 0`.
- Tag pills row (`margin-top: 28px`, gap 8px): 12px uppercase, letter-spacing 0.5px, `padding: 7px 14px`, `border: 0.5px solid #999`, `border-radius: 999px`.
- After the last block: ~120px spacer so the final project can center before the section ends.

## Content (exact copy)

| # | Title | Description | Tags | Image |
|---|-------|-------------|------|-------|
| 01 | Edge-Grain Blocks | Professional-grade butcher blocks, built from end-matched walnut and maple and engineered for a lifetime of daily use. | Walnut & Maple, Food Safe | img/portfolio1.jpg |
| 02 | Face-Grain Blocks | Showpiece serving boards that put the natural figure of each hand-selected plank front and center. | Hand-Finished, Premium Wood | img/portfolio2.jpg |
| 03 | Custom Cheese Slicers | Wire-arm slicers and charcuterie displays, handcrafted for the boldest spreads. | Charcuterie, Handcrafted | img/portfolio3.jpg |
| 04 | SF Olympic Club | A commissioned series of serving pieces for San Francisco's historic Olympic Club. | Commission, Hospitality | img/sf-club.jpg (repo: `img/sf-club.JPG`) |
| 05 | Custom Projects | One-of-a-kind commissions — furniture, restorations, and everything in between. | Bespoke, Made to Order | img/custom-cover.jpg |

## Interactions & Behavior
- **Pinning**: pure CSS `position: sticky` on the image frame (no GSAP pin needed; plays nicely with Lenis).
- **Active-project switching**: a text block becomes active when it crosses the vertical midpoint of the viewport. On change: crossfade images (opacity/scale transitions above), recolor the block's number to #ff0000, update the counter.
- **Recommended implementation**: one `ScrollTrigger.create()` per block with `start: 'top center', end: 'bottom center', onToggle: self => self.isActive && setActive(i)` — consistent with the existing `js/gsap.js` patterns. `reference.html` ships a plain scroll-listener fallback that does the same thing (`setActive(i)` toggles an `.active` class on block + image and writes the counter text).
- **Entrance reveals**: header h2/p use the site's existing `data-anm-scroll-text-reveal` SplitText mechanism (`data-anm-start="top 75%"`, `data-anm-stagger="0.1"`); no new code needed.
- **Badge hover**: existing `.btn-red-static:hover { transform: scale(0.95) }`.

## State Management
Single integer `activeIndex` (0–4), derived from scroll position. Transitions are CSS-only; JS just toggles an `.active` class and updates the counter text. Initial state: index 0 active.

## Design Tokens (all from the existing site)
- Colors: `#ffffff` background, `#000000` text, `#ff0000` accent (badge, active number), `#333333` body copy, `#999` hairline borders (0.5px), `#bbbbbb` inactive numbers, `#111111` frame backdrop.
- Type: Inter (already imported in `styles.css`). Weights 300/500/600/bold.
- Radius: 8px (image frame), 999px (pills), 50% (badge).
- Motion: crossfade 0.6s ease / scale 0.9s ease; color 0.4s ease; badge spin 12s linear; reveals use the existing SplitText `expo.out` 0.8s stagger 0.1.

## Assets
All images already exist in the repo's `img/` folder: `portfolio1.jpg`, `portfolio2.jpg`, `portfolio3.jpg`, `sf-club.JPG`, `custom-cover.jpg`. Copies are bundled in `img/` here so `reference.html` opens standalone. No new assets required.

## Files
- `reference.html` — standalone, working reference of the design (open in a browser; scroll to see the behavior). Written in the site's own class-naming idiom.
- `img/` — the five project photos (copies from the repo).

## Responsive note (developer's discretion, follow existing breakpoints 1024/768/480)
Below 1024px: stack to a single column — un-stick the frame or move it above the blocks; title `h3` to ~28–32px fixed; header falls back to the site's existing `.header-row` media queries.
