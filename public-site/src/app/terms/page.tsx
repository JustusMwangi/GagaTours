import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Legal & Privacy | Book With Sheilla",
  description:
    "Transparency is at the heart of our curated expeditions. Learn how we protect your journey and your data.",
};

export default function TermsPage() {
  return (
    <>
      {/* Hero Header */}
      <header className="pt-32 pb-20 px-6 md:px-12 max-w-5xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-heading font-bold text-primary mb-6 tracking-tight">
          Legal &amp; Privacy
        </h1>
        <p className="text-on-surface-variant font-body text-lg max-w-2xl mx-auto leading-relaxed">
          Transparency is at the heart of our curated expeditions. Here you&apos;ll
          find how we protect your journey and your data.
        </p>
      </header>

      <div className="px-6 md:px-12 max-w-5xl mx-auto pb-24">
        {/* Bento Grid Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <a
            href="#terms-of-service"
            className="md:col-span-2 bg-surface-container-low p-8 rounded-xl flex flex-col justify-between hover:shadow-lg transition-shadow"
          >
            <div>
              <h2 className="text-3xl font-heading text-primary mb-4">
                Terms of Service
              </h2>
              <p className="text-on-surface-variant leading-relaxed mb-6">
                The governing principles for every booking, expedition, and
                digital interaction with Book With Sheilla.
              </p>
            </div>
            <div className="flex items-center text-secondary font-semibold group">
              <span>Jump to Section</span>
              <svg
                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </a>
          <Link
            href="/privacy"
            className="bg-primary text-on-primary p-8 rounded-xl hover:shadow-lg transition-shadow"
          >
            <svg
              className="w-10 h-10 mb-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <h2 className="text-2xl font-heading mb-4">Privacy Policy</h2>
            <p className="opacity-80 text-sm leading-relaxed">
              How we collect, use, and safeguard your personal information
              under GDPR.
            </p>
          </Link>
        </div>

        {/* Terms of Service Section */}
        <section id="terms-of-service" className="scroll-mt-32">
          <div className="flex items-center space-x-4 mb-8">
            <div className="h-px bg-outline-variant flex-grow" />
            <span className="font-body text-xs uppercase tracking-[0.2em] text-secondary">
              Terms of Service
            </span>
            <div className="h-px bg-outline-variant flex-grow" />
          </div>

          <div className="space-y-12">
            {/* Booking & Expeditions */}
            <div className="bg-surface-container-low p-10 rounded-xl relative overflow-hidden">
              <svg
                className="absolute -top-4 -right-4 w-36 h-36 text-primary/5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M5 17.59L15.59 7H9V5h10v10h-2V8.41L6.41 19 5 17.59z" />
              </svg>
              <h3 className="text-2xl font-heading text-primary mb-6">
                Booking &amp; Expeditions
              </h3>
              <div className="space-y-8">
                <div>
                  <h4 className="font-bold text-primary mb-2 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-secondary mr-3 shrink-0" />
                    Deposit and Payments
                  </h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed pl-5">
                    A 30% non-refundable deposit is required at the time of
                    booking to secure exclusive lodge availability and private
                    guides. Final payment is due 90 days prior to departure.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-primary mb-2 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-secondary mr-3 shrink-0" />
                    Cancellation Policy
                  </h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed pl-5">
                    Expeditions cancelled within 60 days of departure are subject
                    to a 50% cancellation fee. Cancellations within 30 days are
                    non-refundable due to pre-committed logistical costs.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-primary mb-2 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-secondary mr-3 shrink-0" />
                    Traveler Responsibility
                  </h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed pl-5">
                    By booking with Book With Sheilla, you acknowledge that
                    travel to remote destinations involves inherent risks. Travel
                    insurance is mandatory for all guests.
                  </p>
                </div>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="p-10 border-2 border-surface-container-highest rounded-xl">
              <h3 className="text-2xl font-heading text-primary mb-4">
                Intellectual Property
              </h3>
              <p className="text-on-surface-variant leading-relaxed font-body">
                All content, photography, and curated itineraries featured on
                this platform are the exclusive property of Book With Sheilla.
                Reproduction or unauthorized use of our signature travel designs
                is strictly prohibited.
              </p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <div className="mt-24 bg-tertiary-container text-on-surface p-12 rounded-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-lg">
            <h3 className="text-3xl font-heading mb-4">
              Questions regarding our terms?
            </h3>
            <p className="text-on-surface-variant">
              Our legal concierge is available to clarify any aspect of our
              privacy standards or booking conditions.
            </p>
          </div>
          <Link
            href="/contact"
            className="bg-primary text-on-primary px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all whitespace-nowrap"
          >
            Contact Legal Counsel
          </Link>
        </div>
      </div>
    </>
  );
}
