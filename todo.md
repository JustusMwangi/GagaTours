# Public-site theme + homepage refresh

Bring the African-safari-wildlife feel from `/home/pierre/projects/safari/draft` to
`public-site/`, leverage unused public APIs on the homepage, and tighten mobile density.

Phases are ordered to de-risk: theme first (tokens for new sections), primitives next
(less boilerplate in new sections), new sections, then a single targeted mobile pass.

---

## Phase 1 — Theme transplant ✅

- [x] **#1 Add OKLCH safari scales to globals.css** — copy 30 tokens from `safari/draft/src/app/globals.css` (`safari-green-50..900`, `safari-amber-50..900`, `safari-brown-50..900`). Additive only.
- [x] **#2 Re-point Material container tokens** — `--color-primary*`, `--color-secondary*`, `--color-tertiary*` point into the new scales. Surfaces stay. _Blocked by #1._
- [x] **#3 Swap heading font Noto Serif → Playfair Display** — in `layout.tsx`. Body font unchanged.
- [x] **#4 Golden-italic accent on hero headline** — `<span className="text-safari-amber-400 italic">Wild</span>` inside "Where the Wild Awakens". _Blocked by #1._

## Phase 2 — Shared primitives ✅

- [x] **#5 `<Container>` component** — `max-w-7xl mx-auto px-5 sm:px-6 lg:px-8`. Stop inlining the same wrapper in 4+ places.
- [x] **#6 `<SectionHeading>` component** — `{eyebrow, title, subtitle}` props. Used by every new homepage section.

## Phase 3 — Homepage sections (live API data) ✅

- [x] **#7 Tighten `<FeaturedTours />` query** — `/tours?featured=true&per_page=3` directly instead of fetching 12 and client-sorting. Add a fallback fetch for non-featured if <3 returned.
- [x] **#8 `<CategoryChips />`** — horizontal scrollable pills from `GET /categories`. Sits below hero. _Blocked by #1, #5._
- [x] **#9 `<DestinationsPreview />`** — 4–6 photo cards from `GET /destinations`. Sits between FeaturedTours and Curator's Touch. _Blocked by #1, #5, #6._
- [x] **#10 `<CTABanner />`** — static closer before footer. "Ready to step into the wild?" + two buttons. _Blocked by #1, #5._

## Phase 4 — Lean mobile pass ✅

- [x] **#11 Hero height + headline on mobile** — `h-screen min-h-[800px]` → `h-[70vh] min-h-[520px] md:h-screen md:min-h-[800px]`. Drop one type tier on `< sm`. Hide eyebrow on `< sm`.
- [x] **#12 Kill HeroSearch `bg-glass` on mobile** — solid `bg-surface` + thin border on `< md`, glassmorphism only on desktop.
- [x] **#13 Card radii** — `rounded-xl` → `rounded-md` on testimonial + featured card wrappers.
- [x] **#14 Strip soft shadows on mobile** — `shadow-xl/2xl` → `shadow-none md:shadow-xl`.
- [x] **#15 Tighten section padding on mobile** — `py-12 md:py-24` → `py-10 md:py-24`.

## Phase 5 — Ship

- [ ] **#16 Local build** — `npm run build` in `public-site` (admin client untouched but verify). _Blocked by #1–#15._
- [ ] **#17 Commit + push to `main`** — _Blocked by #16._
- [ ] **#18 Deploy to VPS** — pull, rebuild `public-site` image, `up -d public-site`, verify HTTP 200 on `https://bookwithsheilla.com`. _Blocked by #17._

---

## Deliberate non-goals (for this pass)

- No admin client UI changes
- No backend changes
- No Heroicons → Lucide swap (deferred; not load-bearing for the safari vibe)
- No texture/paper-grain overlay (revisit after seeing the OKLCH palette live)
- No copy or structure changes to "Curator's Touch" or testimonials
- No new admin features (Destinations editor, category management)
