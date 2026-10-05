"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  apiFetch,
  type Destination,
  type DestinationsResponse,
} from "@/lib/api";
import Container from "./Container";
import SectionHeading from "./SectionHeading";

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
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
  );
}

function DestinationCard({ dest }: { dest: Destination }) {
  return (
    <Link
      href={`/destinations/${dest.slug}`}
      className="group relative aspect-[4/5] overflow-hidden rounded-md bg-surface-container-low"
    >
      {dest.image_url ? (
        <Image
          src={dest.image_url}
          alt={dest.name}
          fill
          unoptimized
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-container/30 to-surface-container-high flex items-center justify-center p-4">
          <span className="font-heading text-xl text-primary/70 text-center">
            {dest.name}
          </span>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 md:p-5">
        <p className="text-xs uppercase tracking-widest text-safari-amber-300 font-body">
          {dest.country}
        </p>
        <h3 className="mt-1 font-heading text-white text-lg md:text-xl leading-tight">
          {dest.name}
        </h3>
      </div>
    </Link>
  );
}

function Skeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6" aria-hidden>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="aspect-[4/5] rounded-md bg-surface-container-low animate-pulse"
        />
      ))}
    </div>
  );
}

export default function DestinationsPreview() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    apiFetch<DestinationsResponse>("/destinations")
      .then((d) => {
        if (!cancelled) setDestinations(d.destinations.slice(0, 8));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && destinations.length === 0) return null;

  return (
    <section className="py-10 md:py-24 bg-surface-container-low">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-6">
          <SectionHeading
            eyebrow="Where We Roam"
            title="Storied Destinations"
            subtitle="From the Maasai Mara to the Okavango Delta — each place chosen for the story it tells."
          />
          <Link
            href="/destinations"
            className="text-secondary font-heading border-b border-secondary pb-1 inline-flex items-center gap-2 group self-start md:self-end"
          >
            All Destinations
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <Skeleton />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {destinations.slice(0, 4).map((d) => (
              <DestinationCard key={d.id} dest={d} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
