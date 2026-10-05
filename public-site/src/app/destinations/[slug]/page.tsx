"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch, type Destination, type Tour } from "@/lib/api";

export default function DestinationDetailPage() {
  const params = useParams<{ slug: string }>();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.slug) return;
    setLoading(true); // eslint-disable-line react-hooks/set-state-in-effect -- async data fetch

    apiFetch<Destination>(`/destinations/${params.slug}`)
      .then((dest) => {
        setDestination(dest);
        // Fetch tours for this destination
        return apiFetch<{ tours: Tour[] }>(
          `/tours?destination_id=${dest.id}&per_page=20`
        );
      })
      .then((data) => setTours(data.tours))
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Failed to load destination"
        )
      )
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="pt-28 pb-24 text-center">
        <div className="inline-block w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="mt-4 text-on-surface-variant">Loading destination...</p>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="pt-28 pb-24 text-center max-w-7xl mx-auto px-6 lg:px-8">
        <h1 className="font-heading text-4xl text-primary mb-4">
          Destination Not Found
        </h1>
        <p className="text-on-surface-variant mb-8">
          {error || "This destination could not be found."}
        </p>
        <Link
          href="/destinations"
          className="text-secondary font-heading border-b border-secondary pb-0.5"
        >
          Browse all destinations
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
        {destination.image_url ? (
          <Image
            src={destination.image_url}
            alt={destination.name}
            fill
            unoptimized
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-primary-container" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-12 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-8">
          {destination.country && (
            <span className="inline-block bg-secondary/90 text-on-secondary text-xs font-body uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              {destination.country}
            </span>
          )}
          <h1 className="font-heading text-5xl md:text-7xl text-white leading-tight mb-4">
            {destination.name}
          </h1>
          {destination.description && (
            <p className="text-white/80 text-lg max-w-2xl leading-relaxed">
              {destination.description}
            </p>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-heading text-4xl text-primary mb-6">
              Discover {destination.name}
            </h2>
            {destination.description && (
              <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
                {destination.description}
              </p>
            )}
            <div>
              <span className="font-body text-[10px] uppercase tracking-widest text-secondary">
                Country
              </span>
              <p className="font-body font-semibold text-lg text-primary">
                {destination.country}
              </p>
            </div>
          </div>
          {destination.image_url && (
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
              <Image
                src={destination.image_url}
                alt={destination.name}
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </section>

      {/* Tours for this destination */}
      {tours.length > 0 && (
        <section className="bg-surface-container-low py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-12">
              <span className="font-body text-secondary uppercase tracking-widest text-xs block mb-2">
                Curated Expeditions
              </span>
              <h2 className="font-heading text-4xl text-primary">
                Signature Journeys
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tours.map((tour) => (
                <Link
                  key={tour.id}
                  href={`/tours/${tour.slug}`}
                  className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(27,28,28,0.04)] hover:shadow-[0_20px_40px_rgba(27,28,28,0.08)] transition-shadow"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {tour.featured_image_url ? (
                      <Image
                        src={tour.featured_image_url}
                        alt={tour.title}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-outline">
                        <svg
                          className="w-12 h-12"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                    {tour.is_featured && (
                      <span className="absolute top-3 left-3 bg-secondary text-on-secondary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-xl text-primary group-hover:text-secondary transition-colors mb-2">
                      {tour.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-on-surface-variant mb-3">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {tour.duration_days} Days
                      </span>
                      {tour.categories.length > 0 && (
                        <span>{tour.categories.map((c) => c.name).join(", ")}</span>
                      )}
                    </div>
                    {tour.description && (
                      <p className="text-sm text-on-surface-variant line-clamp-2">
                        {tour.description}
                      </p>
                    )}
                    <span className="inline-block mt-4 primary-gradient text-on-primary px-5 py-2 rounded-lg text-xs font-body uppercase tracking-wider">
                      View Itinerary
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-20 text-center">
        <h2 className="font-heading text-4xl text-primary mb-4">
          Begin Your Expedition
        </h2>
        <p className="text-on-surface-variant text-lg mb-8 max-w-xl mx-auto">
          Let our specialists curate a bespoke itinerary that aligns with the
          rhythm of the wild and your personal desires.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/contact"
            className="primary-gradient text-on-primary px-8 py-3 rounded-xl text-sm font-body uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            Book Now
          </Link>
          <Link
            href="/tours"
            className="px-8 py-3 rounded-xl border border-outline-variant text-primary text-sm font-body uppercase tracking-widest hover:bg-surface-container-low transition-colors"
          >
            Browse All Tours
          </Link>
        </div>
      </section>
    </div>
  );
}
