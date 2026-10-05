"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiFetch, type Destination } from "@/lib/api";

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Newsletter state
  const [nlEmail, setNlEmail] = useState("");
  const [nlSubmitting, setNlSubmitting] = useState(false);
  const [nlSubmitted, setNlSubmitted] = useState(false);
  const [nlError, setNlError] = useState("");

  async function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNlError("");
    setNlSubmitting(true);

    try {
      await apiFetch("/subscribe", {
        method: "POST",
        body: JSON.stringify({ email: nlEmail }),
      });
      setNlSubmitted(true);
      setNlEmail("");
    } catch {
      setNlError("Something went wrong. Please try again.");
    } finally {
      setNlSubmitting(false);
    }
  }

  useEffect(() => {
    apiFetch<{ destinations: Destination[] }>("/destinations?per_page=100")
      .then((d) => setDestinations(d.destinations))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Derive unique regions/countries for filter chips
  const regions = Array.from(
    new Set(destinations.map((d) => d.country).filter(Boolean))
  );

  const filtered = selectedRegion
    ? destinations.filter((d) => d.country === selectedRegion)
    : destinations;

  return (
    <div className="pt-20 md:pt-28 pb-12 md:pb-24">
      {/* Hero */}
      <header className="px-5 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10 md:mb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
          <div className="md:col-span-7">
            <span className="font-body text-secondary uppercase tracking-[0.3em] text-xs sm:text-sm block mb-3 md:mb-4">
              Curated Expeditions
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl text-primary leading-tight mb-5 md:mb-8">
              Where Earth Whispers Her Secrets
            </h1>
            <p className="text-base md:text-xl text-on-surface-variant max-w-xl leading-relaxed">
              From the golden plains of the Masai Mara to the skeletal beauty of
              Deadvlei, our destinations are selected for their soul, not their
              popularity.
            </p>
          </div>
        </div>
      </header>

      {/* Region Filter Chips */}
      {regions.length > 1 && (
        <section className="px-5 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-8 md:mb-16 overflow-x-auto">
          <div className="flex gap-2 md:gap-3">
            <button
              onClick={() => setSelectedRegion(null)}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-body text-sm font-medium whitespace-nowrap transition-colors ${
                !selectedRegion
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              All Regions
            </button>
            {regions.map((region) => (
              <button
                key={region}
                onClick={() =>
                  setSelectedRegion(selectedRegion === region ? null : region)
                }
                className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-body text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedRegion === region
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="mt-4 text-on-surface-variant">
            Loading destinations...
          </p>
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 px-6">
          <p className="text-on-surface-variant text-lg">
            No destinations available yet. Check back soon.
          </p>
        </div>
      )}

      {/* Destinations — Card Grid */}
      {!loading && filtered.length > 0 && (
        <section className="px-5 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-10 md:gap-y-14">
            {filtered.map((dest) => (
              <Link
                key={dest.id}
                href={`/destinations/${dest.slug}`}
                className="group block"
              >
                {/* Image */}
                <div className="relative overflow-hidden rounded-xl aspect-[4/3] mb-5 bg-gradient-to-br from-primary-container/25 to-surface-container-high">
                  {dest.image_url ? (
                    <Image
                      src={dest.image_url}
                      alt={dest.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-6">
                      <span className="font-heading text-2xl md:text-3xl text-primary/70 text-center leading-tight transition-colors group-hover:text-primary">
                        {dest.name}
                      </span>
                    </div>
                  )}
                  {/* Glass country chip */}
                  {dest.country && (
                    <span className="absolute top-4 left-4 bg-glass px-3 py-1 rounded-full text-[10px] uppercase tracking-widest text-primary font-body font-semibold">
                      {dest.country}
                    </span>
                  )}
                </div>

                {/* Text */}
                <div className="space-y-2">
                  <h3 className="font-heading text-2xl text-primary group-hover:text-secondary transition-colors leading-tight">
                    {dest.name}
                  </h3>
                  {dest.description && (
                    <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2">
                      {dest.description}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1 text-secondary font-heading text-sm pt-1">
                    Explore
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
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
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="mt-12 md:mt-24 px-5 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="bg-primary-container p-8 md:p-16 rounded-2xl text-on-primary-container">
          <h2 className="font-heading text-2xl md:text-4xl mb-3 md:mb-4">
            The Explorer&apos;s Journal
          </h2>
          <p className="text-base md:text-lg opacity-80 mb-6 md:mb-8 font-light">
            Join our inner circle for monthly stories of discovery, exclusive
            destination previews, and the art of travel.
          </p>
          {nlSubmitted ? (
            <p className="text-lg font-medium">
              Thank you for subscribing! We&apos;ll be in touch soon.
            </p>
          ) : (
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="Your email address"
                value={nlEmail}
                onChange={(e) => setNlEmail(e.target.value)}
                disabled={nlSubmitting}
                className="flex-1 bg-white/10 border-none rounded-xl text-on-primary-container placeholder:text-on-primary-container/50 focus:ring-2 focus:ring-secondary py-4 px-6 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={nlSubmitting}
                className="bg-secondary text-on-secondary px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {nlSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          )}
          {nlError && (
            <p className="text-sm mt-4 opacity-90">{nlError}</p>
          )}
        </div>
      </section>
    </div>
  );
}
