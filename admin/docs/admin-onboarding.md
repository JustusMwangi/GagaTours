# Book With Sheilla — Admin Onboarding

A practical guide for the people running the dashboard. Read it once end-to-end on your first day; after that, treat the table of contents as a quick reference.

This guide assumes you are operating the admin, not building it. If you find something here that doesn't match what you see on screen, the screen wins — tell the developer and we'll update the doc.

---

## Contents

1. [Getting in](#1-getting-in)
2. [The dashboard at a glance](#2-the-dashboard-at-a-glance)
3. [The daily loop](#3-the-daily-loop)
4. [Tours](#4-tours)
5. [Combo tours and the writing conventions](#5-combo-tours-and-the-writing-conventions)
6. [Customers](#6-customers)
7. [Inquiries — your starting point](#7-inquiries--your-starting-point)
8. [Bookings — turning interest into a trip](#8-bookings--turning-interest-into-a-trip)
9. [Quotations](#9-quotations)
10. [Invoices](#10-invoices)
11. [Files](#11-files)
12. [Notifications](#12-notifications)
13. [Users and roles](#13-users-and-roles)
14. [Settings](#14-settings)
15. [Audit log](#15-audit-log)
16. [When something goes wrong](#16-when-something-goes-wrong)

---

## 1. Getting in

The admin lives at the URL the developer shares with you (locally it's `http://localhost:8081`; in production it'll be a real domain).

**First-time login**
- Open the URL. You'll land on the **Login** page.
- Use the email and password you were given during setup.
- Forgot the password? Click **Forgot password**, enter your email, and follow the link in the email that arrives.

**Inviting other staff**
You don't share your password. Instead, go to **Users → Invite someone** and enter their email. They get an invitation email with a link to set their own password.

**Logging out**
Top-right of the sidebar — your avatar opens a menu with **Log out**. Sessions expire on their own after a while; you'll be sent back to the login page.

---

## 2. The dashboard at a glance

The first page after login. It's a quiet page on purpose — no scary numbers, just a summary and shortcuts.

What you'll see:
- A greeting and today's date.
- A few stat tiles (members, recent activity, etc.).
- Quick shortcut buttons: **Manage users**, **Invite someone**, **Roles & permissions**, **Upload a file**, **Audit log**, **App settings**.
- A widget showing the app name and basic state.

Treat the dashboard as the lobby. The real work happens in **Inquiries**, **Bookings**, and **Tours** — those are in the sidebar.

---

## 3. The daily loop

If you're new, this is the rhythm of a day:

1. **Open Inquiries** — see what came in overnight from the public site. Any with a ⚠️ status are unread.
2. **For each new inquiry**: read the customer's request, reply by email/WhatsApp, and when you're ready, **convert the inquiry into a booking**.
3. **Open Bookings** — track the bookings you have in flight. Move statuses forward as things happen (confirm → in progress → completed).
4. **Generate a quotation** from the booking and send it to the customer.
5. **Generate an invoice** when the customer commits.
6. **Check Notifications** for anything you missed.

That's 80% of the job. The remaining 20% is keeping the **Tours** catalog fresh, managing **Customers** records, and tidy admin (users, roles, settings).

---

## 4. Tours

A tour is the *product* you're selling — a Mara safari, a Diani beach week, a multi-region combo. Customers see published tours on the public site; staff manages them here.

### 4.1 Tour catalog structure

Each tour has:
- **Title** and a **short description** (the one-liner that appears on tour cards).
- A **featured image** (uploaded to MinIO storage).
- Long **description**, full **itinerary**, **included** and **excluded** lists.
- A **category** (e.g. "Wildlife Safari") and a **destination** (e.g. "Multi-region Kenya").
- **Pricing** (price + currency) and **duration** (days/nights).
- **Max group size** and **difficulty level**.
- A **status**: `draft`, `published`, or `archived`. Only **published** tours appear on the public site.
- A **featured** flag for top-of-page placement.
- A list of **available departure dates** (added on the tour detail page after creation).
- A **gallery** (extra photos beyond the featured image).
- Optional **YouTube URL** for an embedded video.
- **SEO** fields: meta title and meta description.

### 4.2 Creating a tour — step by step

1. Sidebar → **Tours** → click **Create Tour** (top-right).
2. Fill in **Basic Info**: title, the one-line summary, the featured image, and the long description.
3. **Classification**: pick a category and destination from the dropdowns. If the right option doesn't exist, click *"Can't find it? Add new category / destination"* — the dialog creates it inline and selects it for you.
4. **Pricing & Duration**: price (per adult), currency (USD/EUR/GBP/KES/TZS), days, nights, max group size, difficulty.
5. **Content**: paste the itinerary, what's included, what's excluded, and a YouTube link if you have one. The conventions for writing the itinerary and lists matter — see [§5](#5-combo-tours-and-the-writing-conventions) below.
6. **SEO**: a meta title and description for search engines (optional but worth doing).
7. **Settings**: leave status as `draft` while you're still editing. Set it to `published` only when the tour is ready for customers. Toggle **Featured Tour** if you want it pinned to the top of the listings.
8. Click **Create Tour**. You'll land on the tour detail page where you can add more.

### 4.3 After creating: dates and gallery

The detail page has tabs/sections for things you can't set at creation time:

- **Dates** — every departure window you offer (start date, end date, optional max spots, optional price override). Customers see these on the public booking sidebar.
- **Gallery** — add as many extra photos as you like. They appear in the photo carousel and lightbox.

### 4.4 Editing an existing tour

Open the tour from the list and edit fields in place. Don't be shy about flipping back to `draft` if something needs work — no customer will see it while it's a draft.

### 4.5 Categories and destinations (their own pages)

The sidebar has **Categories** and **Destinations** as separate pages. You'll mostly add new ones inline from the Create Tour form, but if you want to bulk-rename or tidy up, those pages give you a list view with edit/delete.

---

## 5. Combo tours and the writing conventions

Combo tours — multi-region itineraries like *"Nairobi · Mara · Amboseli · Diani"* — render specially on the public site **only if you write them using the conventions below**. Skip the conventions and the content still works, just as plain prose.

### 5.1 Itinerary: use `Day N:` for each day

In the **Itinerary** field, start every day on its own line with the literal text `Day N:` followed by a title:

```
A short paragraph of context, optional.

Day 1: Arrival at JKIA, Nairobi
Land at Jomo Kenyatta International. Private transfer to a quiet B&B in Karen.
Welcome dinner.

Day 2: Giraffe Centre & Karen Blixen
Morning at the Giraffe Centre. Lunch at the Talisker, then the Karen Blixen Museum.

Day 3: Drive to the Maasai Mara
Depart Nairobi by Land Cruiser through the Rift Valley...
```

When the public site sees this, it renders:
- A vertical timeline with a chip for each day,
- A jump-nav at the top (*Day 1 · 2 · 3 …*) so visitors can skip to a specific day,
- The "context paragraph" at the top as a preamble.

If you don't use `Day N:`, the itinerary renders as a single paragraph. Still readable, just less rich.

### 5.2 Included / Excluded: use `-` for each line

In the **What's Included** and **What's Excluded** fields, start every line with a dash and a space:

```
- Park fees (Maasai Mara, Amboseli)
- Hot-air balloon ride with champagne breakfast
- All accommodation
- Domestic flight Nairobi to Mombasa
```

The public site renders these as a tidy bulleted list — green check icons for *Included*, red cross icons for *Excluded*.

If any line in the field doesn't start with `-`, the whole field falls back to plain prose. So **all lines or none**.

### 5.3 A worked example: the Kenya combo

The tour titled **"Kenya Grand Combo: Nairobi · Mara · Amboseli · Diani"** is the reference example. Open it in the admin and study the Itinerary, Included, and Excluded fields. Your future combos can borrow the same structure.

---

## 6. Customers

A customer is a person who has shown up in the system — usually because they submitted an inquiry. Sometimes you'll add one manually.

What you can do:
- **List view** (`/customers`) — search by name or email, see their booking count.
- **Detail view** — full profile, contact info, booking history, internal notes.
- **Create / edit** — name, email, phone, address, country, dietary requirements, etc.

You usually don't *create* customers from scratch — they appear when their inquiry comes in. But for walk-ins or referrals, the manual create is there.

---

## 7. Inquiries — your starting point

When a visitor on the public site clicks **"Book Now"** on a tour, they're not actually booking. They submit an **inquiry** — a soft lead asking you to confirm availability and pricing. Inquiries land in `/inquiries`.

What you'll see on the list:
- Customer name, email, the tour they were looking at (if any), date submitted, status.
- A search box and status filter.

What an inquiry contains:
- Customer details (name, email, phone, country),
- The tour they were viewing (or `none` for a contact form inquiry),
- Their preferred dates (or "flexible"),
- Number of travelers,
- Special requests / message.

### 7.1 Replying

Replying is **outside the system** — email or WhatsApp the customer directly. The system tracks the inquiry but doesn't send the reply for you. (Yet.)

### 7.2 Converting an inquiry to a booking

When the customer says yes:
1. Open the inquiry's detail page.
2. Click **Convert to booking**.
3. The system creates a booking pre-filled with the customer, tour, and group size from the inquiry. You're taken to the new booking's detail page.

This is the path of least resistance — always prefer **convert from inquiry** over **manually adding a booking**. The latter requires raw customer/tour IDs which is awkward.

---

## 8. Bookings — turning interest into a trip

A booking is a real commitment: a confirmed customer, a confirmed tour, a price, and a status that moves through the trip's lifecycle.

### 8.1 The status lifecycle

Every booking has a status. The supported values, in order:

1. **pending** — created, but not yet confirmed by you (e.g. you're still checking lodge availability).
2. **confirmed** — you've confirmed everything; the deposit is in or imminent.
3. **in_progress** — the customer is on the trip right now.
4. **completed** — the trip is done.
5. **cancelled** — at any point the booking can be cancelled.

You change status from the booking's detail page using the status dropdown. Each change is logged in the audit log.

### 8.2 Editing a booking

On the detail page you can edit: number of adults / children, total amount, currency, special requests, internal notes. Save commits the change and stamps it with your user as `updated_by`.

### 8.3 Generating a quotation or invoice

Two big buttons on the booking detail page:

- **Create quotation from booking** — produces a quotation pre-filled with the booking's customer, tour, group size, amount. Refused if the booking already has a quotation.
- **Create invoice from booking** — same idea, for invoicing. Refused if an invoice already exists.

After clicking, you're taken to the new quotation/invoice page where you can fine-tune line items, terms, and download / send to the customer.

---

## 9. Quotations

A quotation is a *proposal* — what you'd charge if the customer commits. They can be created from a booking (the easy way) or directly from the Quotations page.

What a quotation has:
- A reference number (auto-generated).
- The customer and (optionally) the tour.
- Line items — what they're paying for, and how much.
- A total, a currency, a validity date.
- A status: `draft`, `sent`, `accepted`, `declined`, `expired`.

The typical flow:
1. Generate from a booking.
2. Edit line items if needed; set a **valid until** date.
3. Mark as **sent** once you've emailed the PDF/link to the customer.
4. When they accept, mark as **accepted** — that's your green light to invoice.

---

## 10. Invoices

An invoice is what gets paid. Like quotations, you usually generate them from a booking.

What an invoice has:
- An invoice number (auto-generated).
- The customer.
- Total amount, currency, due date.
- A status: `draft`, `sent`, `paid`, `overdue`, `cancelled`.

Mark as **sent** when you email it. Mark as **paid** when the money lands. The system doesn't process payments yet — that's for a future iteration.

---

## 11. Files

The **Files** page (`/files`) is your shared upload area. Use it for:
- Tour gallery images (though the tour detail page also has direct upload).
- PDF brochures.
- Internal documents (rate sheets, partner contracts).

Files are stored on MinIO (S3-compatible). Anyone with admin access can browse and download. Don't upload customer passports or anything sensitive without a clear retention plan — see the developer if you need a private bucket.

---

## 12. Notifications

The bell icon shows your unread count. The Notifications page lists what triggered each one — new inquiry, status changes, etc.

**Preferences** (`/notifications/preferences`) lets you choose what you get notified about and where (in-app, email, both). Don't turn off "new inquiry" — that's the heartbeat of the business.

---

## 13. Users and roles

Two pages:
- **Users** (`/users`) — list of staff. From here you invite new staff, see who they are, deactivate accounts, and manage their roles.
- **Roles** (`/roles`) — the permission system. Each role is a bundle of permissions like `tours.manage`, `bookings.manage`, `users.manage`. You assign roles to users; users get the union of their roles' permissions.

Standard roles to expect (the developer seeds these):
- **Super-admin** — everything. Should be one or two people, maximum.
- **Admin** — most things, but cannot manage roles or other admins.
- **Operator** — day-to-day work: inquiries, bookings, customers, tours.
- **Read-only** — view but not edit. Useful for accountants or auditors.

Don't invent new roles unless you have a clear reason. The fewer the better.

### Inviting

`/users` → **Invite someone** → enter email + pick role. They get an invitation email; clicking the link lets them set a password and log in.

### Deactivating

Open the user's detail page → toggle **Active**. Their sessions are revoked and they can't log in again. Their historical actions stay visible in the audit log.

---

## 14. Settings

Org-wide configuration. Things that live here (subject to what the developer has wired up):
- App name, logo, primary contact email.
- Default currency, default language.
- Branding tweaks.

Most of these you set once at the start and rarely touch.

---

## 15. Audit log

`/audit` — a chronological list of every meaningful action: who did what, when, on which resource. Filter by actor, action type, resource type, date range.

You don't read this daily. You read it when:
- Something looks wrong and you need to know who changed it.
- A customer disputes a price or status change.
- You're preparing for an audit (the boring kind).

Treat it as your accountability layer.

---

## 16. When something goes wrong

**A page won't load / I see a red error**
- Refresh first.
- If it persists, copy the error message exactly and send it to the developer along with the URL you were on and what you were doing.

**A customer says they got an email I didn't send / didn't get one I did send**
- Check the customer's notification preferences and the audit log first.
- If neither explains it, escalate.

**Something looks frozen / a button doesn't work**
- Open browser dev tools (F12) → Console tab. Screenshot any red lines and send to the developer.

**I accidentally deleted a tour / booking / etc.**
- Most resources have a soft-delete (the row is marked `deleted_at` rather than removed). The developer can restore it. Don't panic; tell them which record and roughly when.

**I forgot my password**
- **Forgot password** on the login page. The link expires after a short while — use it promptly.

---

*Last updated when this document was written. If the screen and this page disagree, the screen is right — please flag the difference.*
