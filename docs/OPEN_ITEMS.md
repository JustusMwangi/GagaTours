# Open Items — Book With Sheilla

Non-urgent work parked for later. Come back when there's bandwidth.

## Latent bugs

### Client-side sort on `/tours` only sorts the current page
**Location:** `public-site/src/app/tours/page.tsx` (`sorted` variable)

The sort dropdown calls `.sort()` on the current page's 8 tours, not the
full result set. With fewer than 9 tours total this is invisible, but the
day the catalog has more, "Duration: Longest" will show the longest tour
on the current page rather than globally.

**Fix:** push sort into the API query (`?sort=duration_desc`), add a
matching `sort` parameter to `list_tours` on the backend, and read it on
the frontend instead of client-side sorting.

**Latent until:** >8 tours exist.

### "Book" flow labels vs reality
The `/tours/[slug]/book` flow is named and labelled as a booking flow
(`Check Availability`, `Review & Reserve`, `Complete Reservation`,
`Total Investment`, `Your reservation request has been received`) but
it actually POSTs to `/inquiries` — it's already an inquiry flow,
not a booking flow. Prices have been removed from the visible UI
(cards, totals, confirmation), but the labels still talk about
reservations and bookings.

**Decision needed:** rename the user-visible labels to match reality
("Submit Inquiry", "Inquiry Received", etc.), or leave as-is because
the client prefers the "Book" framing. The session where this was
flagged left the labels alone pending that call.

**Note:** the backend `Inquiry` model still has a `total_amount`
column that used to be populated from the `budget` field in the
request body. That's now dropped from the POST, so new inquiries
will have `total_amount = NULL`. Historical inquiries still carry
their old budgets. If the admin UI shows this column, it will look
mixed.

## Larger features worth considering

### Full mockup-faithful `/destinations` page
Current `/destinations` is a flat card grid. The canonical mockup at
`ui_design/destinations_the_elevated_explorer/` groups destinations by
country into editorial sections with country-level metadata:

- Country name (e.g. Kenya)
- Country description ("The cradle of humanity...")
- Best time to visit ("July — October")
- Highlights summary ("Great Migration, Amboseli Giants")
- A featured destination rendered as a large hero image with glassmorph
  overlay, plus smaller thumbnails for the other destinations in the
  country

**Data gap:** the current `Destination` model has no country-level
metadata — country is just a string on each row, no country record
exists. To build the mockup faithfully:

1. Add `Country` model (`countries` table) with `name`, `slug`,
   `description`, `best_time_to_visit`, `highlights`, `hero_image_url`,
   `sort_order`
2. Alembic migration + seed data for Kenya (and any other countries)
3. Change `Destination.country` from `String` to FK → `countries.id`
4. Admin CRUD pages for countries (new blueprint in `admin/client`)
5. Public API: new `/countries` endpoint, or embed country metadata in
   the `/destinations` response
6. Frontend rewrite of `public-site/src/app/destinations/page.tsx` to
   render country sections

**When to build it:** worth the investment when the catalog has 3+
countries, since one-section-for-one-country collapses to something
that looks similar to the current card grid anyway.

### Admin sanity check pass
This session covered the public site's index and detail pages and a
couple of admin pages (`CreateTourPage`, `TourDetailPage`). Not yet
reviewed:

- `CategoriesPage`, `DestinationsPage` (admin list / CRUD)
- `CustomersPage`
- `BookingsPage` + detail
- `InquiriesPage` + detail
- `InvoicesPage` + detail (including payments)
- `QuotationsPage` + detail (including line items)
- `UsersPage`, `RolesPage`, `AuditPage`
- Notifications, Settings, Profile

Expected issues, based on what I found on the public side:

- **Type drift** — TypeScript types in `admin/client/src/types/*.ts`
  with fields the admin API doesn't actually return, or missing fields
  it does return
- **Response unwrapping bugs** — places that expect `T[]` but the API
  returns `{items: T[], total, page, ...}` (this is exactly the bug I
  fixed on the public tours page for categories)
- **Whitespace reaching the DB** for entities other than tours /
  categories / destinations (I only extended `_strip_str_fields` to
  those services — customers, invoices, quotations etc. still write
  untrimmed strings)

Estimate: 30–60 min per blueprint for a surface-level pass; deeper
work only where something looks actively broken.

## Client content tasks

These need the client (not code):

- **Upload hero images for 4 destinations**: Amboseli, Lake Nakuru,
  Meru, Diani. They currently render a dark-green gradient + centered
  name as a placeholder.
- **Write Tsavo East National Park description.** I cleared a
  placeholder `(Upload: red elephants, safari jeep, savannah)` during
  the data cleanup; it's now `NULL` so you can see it's missing.
- **Re-title** the tour currently called
  `horse riding in savannah with wildlife` — all lowercase, doesn't
  match the branded tone of the other titles (e.g. *Amboseli National
  Park Safari Experience*, *Maasai Mara Classic Game Drive Safari*).
- **Decide** whether `Mombasa Beach Holiday Escape (4 Days)` should
  go from `draft` → `published`. It's the only draft tour.
- **Populate `youtube_url`** on tours that have a YouTube video. The
  field is now supported end-to-end (admin form → DB → public API →
  tour detail page `Watch the Journey` section). Paste the full
  YouTube watch URL; the frontend converts it to an embed.

## Design reference

- Canonical mockups live in `ui_design/` with variants labelled
  `_the_elevated_explorer`. Use those as the north star for any
  public-site redesign work.
- Design tokens (font families, colours) are already wired into the
  Tailwind config: `font-heading` → Noto Serif, `font-body` → Plus
  Jakarta Sans, safari earth tones as CSS variables.
