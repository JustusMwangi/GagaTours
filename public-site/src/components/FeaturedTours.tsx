"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiFetch, type Tour, type ToursResponse } from "@/lib/api";
import { nameSummary } from "@/lib/tour-helpers";

function ToursSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10" aria-hidden>
      <div className="md:col-span-8 rounded-md bg-surface-container-low animate-pulse aspect-[16/10]" />
      <div className="md:col-span-4 flex flex-col gap-6 md:gap-10">
        <div className="rounded-md bg-surface-container-low animate-pulse aspect-square" />
        <div className="rounded-md bg-surface-container-low animate-pulse aspect-square" />
      </div>
    </div>
  );
}

function TourImage({ tour, className, sizes }: { tour: Tour; className: string; sizes: string }) {
  if (tour.featured_image_url) {
    return (
      <Image
        src={tour.featured_image_url}
        alt={tour.title}
        fill
        unoptimized
        className={className}
        sizes={sizes}
      />
    );
  }
  return (
    <div className="w-full h-full bg-gradient-to-br from-primary-container/25 to-surface-container-high flex items-center justify-center p-6">
      <span className="font-heading text-2xl md:text-3xl text-primary/70 text-center leading-tight">
        {tour.title}
      </span>
    </div>
  );
}

export default function FeaturedTours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const featured = await apiFetch<ToursResponse>(
          "/tours?featured=true&per_page=3"
        );
        let picks = featured.tours;
        if (picks.length < 3) {
          const filler = await apiFetch<ToursResponse>(
            `/tours?per_page=${3 - picks.length}`
          );
          const seen = new Set(picks.map((t) => t.id));
          picks = [...picks, ...filler.tours.filter((t) => !seen.has(t.id))].slice(0, 3);
        }
        if (!cancelled) setTours(picks);
      } catch {
        // swallow — section just doesn't render
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <ToursSkeleton />;
  if (tours.length === 0) return null;

  const [hero, ...sides] = tours;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
      {/* Hero card */}
      <Link
        href={`/tours/${hero.slug}`}
        className="md:col-span-8 group relative overflow-hidden rounded-md bg-surface-container-low p-2"
      >
        <div className="aspect-[16/10] overflow-hidden rounded-lg relative">
          <TourImage
            tour={hero}
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 66vw"
          />
        </div>
        <div className="mt-5 md:mt-8 px-4 md:px-6 pb-4 md:pb-6">
          <div className="mb-3 md:mb-4">
            <span className="text-secondary font-body uppercase text-xs tracking-widest">
              {hero.is_featured ? "Featured Expedition" : "Curated Journey"}
            </span>
            <h3 className="text-2xl md:text-3xl font-heading text-primary mt-2 group-hover:text-secondary transition-colors">
              {hero.title}
            </h3>
          </div>
          {hero.highlights && (
            <p className="text-on-surface-variant mb-4 md:mb-6 max-w-xl line-clamp-2">
              {hero.highlights}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            {hero.duration_days && (
              <span className="flex items-center gap-1.5 text-sm bg-surface-container-highest px-3 py-1 rounded-full">
                <svg
                  className="w-4 h-4"
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
                {hero.duration_days} Days
              </span>
            )}
            {hero.destinations.length > 0 && (
              <span className="flex items-center gap-1.5 text-sm bg-surface-container-highest px-3 py-1 rounded-full">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {nameSummary(hero.destinations)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Side cards */}
      <div className="md:col-span-4 flex flex-col gap-6 md:gap-10">
        {sides.map((tour) => (
          <Link
            key={tour.id}
            href={`/tours/${tour.slug}`}
            className="group cursor-pointer"
          >
            <div className="aspect-square overflow-hidden rounded-md mb-3 md:mb-4 relative">
              <TourImage
                tour={tour}
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <h4 className="text-lg md:text-xl font-heading text-primary group-hover:text-secondary transition-colors">
              {tour.title}
            </h4>
            {tour.highlights && (
              <p className="text-on-surface-variant text-sm mt-2 line-clamp-2">
                {tour.highlights}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
