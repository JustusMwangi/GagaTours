import { Link } from 'react-router';
import {
  ArrowRight,
  Calendar,
  CalendarCheck,
  ClipboardList,
  FileSpreadsheet,
  FileText,
  HelpCircle,
  Lightbulb,
  Map,
  MessageSquare,
  Settings,
  Shield,
  Sparkles,
  UserCheck,
  Users,
} from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface TocItem {
  id: string;
  title: string;
}

const sections: TocItem[] = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'daily-loop', title: 'Your daily loop' },
  { id: 'tours', title: 'Tours' },
  { id: 'combo-conventions', title: 'Combo tours: writing conventions' },
  { id: 'customers', title: 'Customers' },
  { id: 'inquiries', title: 'Inquiries' },
  { id: 'bookings', title: 'Bookings' },
  { id: 'quotations-invoices', title: 'Quotations & invoices' },
  { id: 'system', title: 'Files, notifications, audit log' },
  { id: 'users-roles', title: 'Users & roles' },
  { id: 'settings', title: 'Settings' },
  { id: 'troubleshooting', title: 'When something goes wrong' },
];

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900/50 dark:bg-amber-950/30">
      <Lightbulb className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
      <div className="text-amber-900 dark:text-amber-100 leading-relaxed">{children}</div>
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="rounded-lg bg-muted p-4 text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">
      <code>{children}</code>
    </pre>
  );
}

function GoTo({ to, label }: { to: string; label: string }) {
  return (
    <Button asChild variant="outline" size="sm">
      <Link to={to} className="inline-flex items-center gap-2">
        {label}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </Button>
  );
}

const ITINERARY_EXAMPLE = `A short paragraph of context, optional.

Day 1: Arrival at JKIA, Nairobi
Land at Jomo Kenyatta International. Private transfer to a B&B in Karen.
Welcome dinner.

Day 2: Giraffe Centre & Karen Blixen
Morning at the Giraffe Centre. Lunch at the Talisker, then the museum.

Day 3: Drive to the Maasai Mara
Depart Nairobi by Land Cruiser through the Rift Valley...`;

const BULLETS_EXAMPLE = `- Park fees (Maasai Mara, Amboseli)
- Hot-air balloon ride with champagne breakfast
- All accommodation
- Domestic flight Nairobi to Mombasa`;

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Help"
        description="A practical guide to running the dashboard. Skim once on day one; dip back in whenever."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sticky TOC */}
        <aside className="lg:col-span-3">
          <nav className="lg:sticky lg:top-4 rounded-lg border bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">
              On this page
            </p>
            <ul className="space-y-1.5 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById(s.id)
                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="block rounded px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <div className="lg:col-span-9 space-y-6">
          {/* Welcome */}
          <Card id="welcome" className="scroll-mt-20">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <HelpCircle className="h-5 w-5" />
                <CardTitle>Welcome</CardTitle>
              </div>
              <CardDescription>
                A practical guide for the people running this dashboard. If something here doesn't match what you see on screen, the screen wins — flag it and we'll update.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                You don't need to memorize anything. The dashboard is the lobby; the real work happens in <strong>Inquiries</strong>, <strong>Bookings</strong>, and <strong>Tours</strong>. Everything else supports those three.
              </p>
            </CardContent>
          </Card>

          {/* Daily loop */}
          <Card id="daily-loop" className="scroll-mt-20">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <CalendarCheck className="h-5 w-5" />
                <CardTitle>Your daily loop</CardTitle>
              </div>
              <CardDescription>The rhythm of a typical day.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <strong>Open Inquiries</strong> — see what came in overnight from the public site.
                </li>
                <li>
                  <strong>Reply</strong> by email or WhatsApp, then convert the inquiry to a booking.
                </li>
                <li>
                  <strong>Open Bookings</strong> — track what's in flight, move statuses forward.
                </li>
                <li>
                  <strong>Generate a quotation</strong> from the booking and send it to the customer.
                </li>
                <li>
                  <strong>Generate an invoice</strong> when they commit.
                </li>
                <li>
                  Glance at <strong>Notifications</strong> for anything you missed.
                </li>
              </ol>
              <div className="flex flex-wrap gap-2 pt-1">
                <GoTo to="/inquiries" label="Open Inquiries" />
                <GoTo to="/bookings" label="Open Bookings" />
                <GoTo to="/notifications" label="Open Notifications" />
              </div>
            </CardContent>
          </Card>

          {/* Tours */}
          <Card id="tours" className="scroll-mt-20">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <Map className="h-5 w-5" />
                <CardTitle>Tours</CardTitle>
              </div>
              <CardDescription>
                A tour is the product you're selling. Customers see published tours on the public site.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <div>
                <p className="font-medium text-foreground mb-2">Anatomy of a tour</p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Title, one-line summary, featured image, long description.</li>
                  <li>Category and destination (create them inline if missing).</li>
                  <li>Pricing, currency, days/nights, max group size, difficulty.</li>
                  <li>Itinerary, what's included, what's excluded — see conventions below.</li>
                  <li>Status: <code className="text-xs">draft</code> while editing, <code className="text-xs">published</code> when ready.</li>
                  <li>After creation: add departure dates and gallery images on the detail page.</li>
                </ul>
              </div>
              <Tip>
                Keep new tours as <strong>draft</strong> until everything reads cleanly. Customers never see drafts.
              </Tip>
              <div className="flex flex-wrap gap-2">
                <GoTo to="/tours" label="Open Tours" />
                <GoTo to="/tours/create" label="Create a tour" />
                <GoTo to="/categories" label="Categories" />
                <GoTo to="/destinations" label="Destinations" />
              </div>
            </CardContent>
          </Card>

          {/* Combo conventions */}
          <Card id="combo-conventions" className="scroll-mt-20 border-primary/30">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="h-5 w-5" />
                <CardTitle>Combo tours: writing conventions</CardTitle>
              </div>
              <CardDescription>
                Two small text conventions unlock rich rendering on the public site for multi-day combo tours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 text-sm leading-relaxed">
              <div>
                <p className="font-medium text-foreground mb-2">1. Itinerary — start each day with <code className="text-xs">Day N:</code></p>
                <p className="text-muted-foreground mb-3">
                  In the <strong>Itinerary</strong> field, put each day on its own line beginning with <code className="text-xs">Day 1:</code>, <code className="text-xs">Day 2:</code>, etc. The text after the colon is the day title; the lines after are that day's body.
                </p>
                <CodeBlock>{ITINERARY_EXAMPLE}</CodeBlock>
                <p className="text-muted-foreground mt-3">
                  The public site renders this as a vertical timeline with a sticky day-jump nav at the top of the section.
                </p>
              </div>

              <div>
                <p className="font-medium text-foreground mb-2">2. Included / Excluded — start each line with <code className="text-xs">-</code></p>
                <p className="text-muted-foreground mb-3">
                  In <strong>What's Included</strong> and <strong>What's Excluded</strong>, prefix every line with a dash and a space. The public site renders these as a tidy bulleted list with green check or red cross icons.
                </p>
                <CodeBlock>{BULLETS_EXAMPLE}</CodeBlock>
                <Tip>
                  All lines or none. If even one line is missing the dash, the whole field falls back to plain prose.
                </Tip>
              </div>

              <div>
                <p className="font-medium text-foreground mb-2">A worked example</p>
                <p className="text-muted-foreground">
                  The tour titled <em>"Kenya Grand Combo: Nairobi · Mara · Amboseli · Diani"</em> uses these conventions throughout. Open it and study its Itinerary, Included, and Excluded fields before writing your next combo.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <GoTo to="/tours" label="Find the Kenya combo" />
              </div>
            </CardContent>
          </Card>

          {/* Customers */}
          <Card id="customers" className="scroll-mt-20">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <UserCheck className="h-5 w-5" />
                <CardTitle>Customers</CardTitle>
              </div>
              <CardDescription>
                People who've shown up in the system — usually because they sent an inquiry.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                You rarely create customers from scratch — they appear when their inquiry comes in. For walk-ins or referrals, the manual create is there.
              </p>
              <p>
                Each customer record holds contact details, country, dietary needs, internal notes, and their full booking history.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <GoTo to="/customers" label="Open Customers" />
              </div>
            </CardContent>
          </Card>

          {/* Inquiries */}
          <Card id="inquiries" className="scroll-mt-20">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <MessageSquare className="h-5 w-5" />
                <CardTitle>Inquiries</CardTitle>
              </div>
              <CardDescription>
                Soft leads from the public site. Your starting point.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                When a visitor clicks <em>"Book Now"</em> on a tour, they're submitting an inquiry — not a confirmed booking. That gives you a chance to confirm availability and pricing before money moves.
              </p>
              <p>
                Reply by email or WhatsApp (the system tracks the inquiry but doesn't send the reply for you yet). When the customer says yes, open the inquiry's detail page and click <strong>Convert to booking</strong>. The booking is pre-filled with their details — no copy-pasting UUIDs.
              </p>
              <Tip>
                Always prefer <strong>Convert from inquiry</strong> over manually adding a booking. The manual path requires raw IDs and is awkward.
              </Tip>
              <div className="flex flex-wrap gap-2 pt-1">
                <GoTo to="/inquiries" label="Open Inquiries" />
              </div>
            </CardContent>
          </Card>

          {/* Bookings */}
          <Card id="bookings" className="scroll-mt-20">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <Calendar className="h-5 w-5" />
                <CardTitle>Bookings</CardTitle>
              </div>
              <CardDescription>
                A real commitment: customer, tour, price, and a status that moves through the trip's lifecycle.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <div>
                <p className="font-medium text-foreground mb-2">The status lifecycle</p>
                <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                  <li><strong>pending</strong> — created, not yet confirmed.</li>
                  <li><strong>confirmed</strong> — everything checks out; deposit imminent or in.</li>
                  <li><strong>in_progress</strong> — customer is on the trip.</li>
                  <li><strong>completed</strong> — trip is done.</li>
                  <li><strong>cancelled</strong> — at any point, with notes.</li>
                </ol>
                <p className="text-muted-foreground mt-2">
                  Move the status from the booking's detail page. Each change is logged in the audit log.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-2">From a booking, you can:</p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Edit adults/children, amount, currency, special requests, notes.</li>
                  <li>Generate a <strong>quotation</strong> (refused if one already exists).</li>
                  <li>Generate an <strong>invoice</strong> (refused if one already exists).</li>
                </ul>
              </div>
              <div className="flex flex-wrap gap-2">
                <GoTo to="/bookings" label="Open Bookings" />
              </div>
            </CardContent>
          </Card>

          {/* Quotations & invoices */}
          <Card id="quotations-invoices" className="scroll-mt-20">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <FileSpreadsheet className="h-5 w-5" />
                <CardTitle>Quotations & invoices</CardTitle>
              </div>
              <CardDescription>
                A quotation proposes; an invoice collects. Both usually start from a booking.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <div>
                <p className="font-medium text-foreground mb-1">Quotations</p>
                <p>
                  Auto-numbered. Statuses: <code className="text-xs">draft → sent → accepted / declined / expired</code>. Set a <strong>valid until</strong> date so it doesn't linger.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Invoices</p>
                <p>
                  Auto-numbered. Statuses: <code className="text-xs">draft → sent → paid / overdue / cancelled</code>. Mark <strong>paid</strong> when the money lands. Online payment isn't wired yet — that's a future iteration.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <GoTo to="/quotations" label="Quotations" />
                <GoTo to="/invoices" label="Invoices" />
              </div>
            </CardContent>
          </Card>

          {/* System tools */}
          <Card id="system" className="scroll-mt-20">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <FileText className="h-5 w-5" />
                <CardTitle>Files, notifications, audit log</CardTitle>
              </div>
              <CardDescription>The supporting cast.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <div>
                <p className="font-medium text-foreground mb-1">Files</p>
                <p>
                  A shared upload area for tour images, PDFs, and internal documents. Don't upload anything sensitive without a clear retention plan.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Notifications</p>
                <p>
                  The bell icon in the header shows your unread count. The preferences page controls what you get notified about and where (in-app, email, both). Don't turn off <em>new inquiry</em> — that's the heartbeat of the business.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Audit log</p>
                <p>
                  Every meaningful action: who did what, when, on which record. You don't read this daily — you read it when something looks wrong, a customer disputes a change, or you're preparing for an audit.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <GoTo to="/files" label="Files" />
                <GoTo to="/notifications" label="Notifications" />
                <GoTo to="/notifications/preferences" label="Preferences" />
                <GoTo to="/audit" label="Audit log" />
              </div>
            </CardContent>
          </Card>

          {/* Users & roles */}
          <Card id="users-roles" className="scroll-mt-20">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <Shield className="h-5 w-5" />
                <CardTitle>Users & roles</CardTitle>
              </div>
              <CardDescription>How permissions work.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <div>
                <p className="font-medium text-foreground mb-1">Inviting staff</p>
                <p>
                  Don't share your password. Go to <strong>Users → Invite someone</strong>. They get an email with a link to set their own password.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Roles</p>
                <p>
                  Each role is a bundle of permissions. Users get the union of their roles' permissions. Standard roles: <strong>Super-admin</strong> (everything — keep this to one or two people), <strong>Admin</strong> (most things), <strong>Operator</strong> (day-to-day), <strong>Read-only</strong> (view but not edit).
                </p>
              </div>
              <Tip>
                Don't invent new roles unless you have a clear reason. Fewer is better.
              </Tip>
              <div className="flex flex-wrap gap-2 pt-1">
                <GoTo to="/users" label="Users" />
                <GoTo to="/roles" label="Roles" />
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card id="settings" className="scroll-mt-20">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <Settings className="h-5 w-5" />
                <CardTitle>Settings</CardTitle>
              </div>
              <CardDescription>Org-wide configuration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                App name, logo, primary contact email, default currency, branding tweaks. Set once at the start and rarely touch.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <GoTo to="/settings" label="Open Settings" />
              </div>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card id="troubleshooting" className="scroll-mt-20">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <ClipboardList className="h-5 w-5" />
                <CardTitle>When something goes wrong</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <div>
                <p className="font-medium text-foreground mb-1">A page won't load / I see a red error</p>
                <p>
                  Refresh first. If it persists, copy the error message exactly and send it to the developer along with the URL and what you were doing.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">A button looks frozen / nothing happens</p>
                <p>
                  Open browser dev tools (F12) → Console tab. Screenshot any red lines and send to the developer.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">I accidentally deleted something</p>
                <p>
                  Most records are soft-deleted (marked <code className="text-xs">deleted_at</code>, not removed). The developer can restore. Tell them which record and roughly when.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">I forgot my password</p>
                <p>
                  Use <strong>Forgot password</strong> on the login page. The reset link expires after a short while — use it promptly.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer note */}
          <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
              <Users className="h-4 w-4" />
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Need a human?</p>
              <p>
                If something's blocking you, ping the developer with the URL, what you were doing, and a screenshot. Most things have a fix in minutes.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
