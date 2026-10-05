"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch, type TourDetail, type TourDate } from "@/lib/api";

type ItineraryDay = { dayNumber: number; title: string; body: string };
type ParsedItinerary = { preamble: string; days: ItineraryDay[] };

function parseItineraryDays(text: string): ParsedItinerary | null {
  const regex = /^[ \t]*Day\s+(\d+)\s*:[ \t]*(.*)$/gm;
  const matches = Array.from(text.matchAll(regex));
  if (matches.length === 0) return null;

  const preamble = text.slice(0, matches[0].index ?? 0).trim();
  const days = matches.map((m, i) => {
    const start = (m.index ?? 0) + m[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index ?? text.length : text.length;
    return {
      dayNumber: Number(m[1]),
      title: m[2].trim(),
      body: text.slice(start, end).trim(),
    };
  });
  return { preamble, days };
}

function parseBulletList(text: string): string[] | null {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;
  const bulletPrefix = /^[-•*]\s+/;
  if (!lines.every((l) => bulletPrefix.test(l))) return null;
  return lines.map((l) => l.replace(bulletPrefix, "").trim()).filter(Boolean);
}

// Lenient: every non-empty line is an item, with any leading bullet/marker
// stripped. Used for What's Included / Excluded so pasted content (without
// dashes) still renders one tick/X per line.
function parseLines(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.replace(/^\s*[-–—•*·✓✔✗✘]\s*/, "").trim())
    .filter(Boolean);
}

function HighlightsList({ text }: { text: string }) {
  const items = parseBulletList(text);
  if (!items) {
    return (
      <p className="text-on-surface-variant leading-relaxed whitespace-pre-line">
        {text}
      </p>
    );
  }
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-3 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30"
        >
          <span
            aria-hidden
            className="flex-none w-7 h-7 rounded-full bg-secondary-container/20 text-secondary flex items-center justify-center"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l2.39 7.36H22l-6.19 4.5 2.36 7.36L12 16.72l-6.17 4.5 2.36-7.36L2 9.36h7.61z" />
            </svg>
          </span>
          <span className="text-on-surface-variant leading-relaxed text-sm">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function FeatureList({
  text,
  variant,
}: {
  text: string;
  variant: "included" | "excluded";
}) {
  const items = parseLines(text);
  if (items.length === 0) {
    return (
      <div className="text-on-surface-variant leading-relaxed whitespace-pre-line">
        {text}
      </div>
    );
  }
  const isIncluded = variant === "included";
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span
            aria-hidden
            className={`flex-none mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
              isIncluded
                ? "bg-primary/10 text-primary"
                : "bg-error/10 text-error"
            }`}
          >
            <svg
              className="w-3 h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
            >
              {isIncluded ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              )}
            </svg>
          </span>
          <span className="text-on-surface-variant leading-relaxed">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function TourDetailPage() {
  const params = useParams<{ slug: string }>();
  const [tour, setTour] = useState<TourDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    if (!params.slug) return;
    setLoading(true); // eslint-disable-line react-hooks/set-state-in-effect -- async data fetch
    apiFetch<TourDetail>(`/tours/${params.slug}`)
      .then((data) => {
        setTour(data);
        if (data.tour_dates?.length > 0) {
          setSelectedDate(data.tour_dates[0].id);
        }
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load tour")
      )
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="pt-28 pb-24 text-center">
        <div className="inline-block w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="mt-4 text-on-surface-variant">Loading expedition...</p>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="pt-28 pb-24 text-center max-w-7xl mx-auto px-6 lg:px-8">
        <h1 className="font-heading text-4xl text-primary mb-4">
          Expedition Not Found
        </h1>
        <p className="text-on-surface-variant mb-8">
          {error || "This tour could not be found."}
        </p>
        <Link
          href="/tours"
          className="text-secondary font-heading border-b border-secondary pb-0.5"
        >
          Browse all expeditions
        </Link>
      </div>
    );
  }

  type HeroImage = { image_url: string; alt: string };
  const allImages: HeroImage[] = [
    ...(tour.featured_image_url
      ? [{ image_url: tour.featured_image_url, alt: tour.title }]
      : []),
    ...tour.gallery.map((g) => ({
      image_url: g.image_url,
      alt: g.caption || tour.title,
    })),
  ];

  return (
    <>
      <div className="pt-20 md:pt-24">
        {/* Hero Gallery */}
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 mb-8 md:mb-16">
          <div className="grid grid-cols-12 gap-3 md:gap-4 h-[260px] sm:h-[320px] md:h-[500px] lg:h-[600px]">
            {/* Main image */}
            <div className="col-span-12 lg:col-span-8 h-full relative group overflow-hidden rounded-xl bg-surface-container-low">
              {allImages[0] ? (
                <Image
                  src={allImages[0].image_url}
                  alt={allImages[0].alt}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-outline">
                  <svg
                    className="w-20 h-20"
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
              <div className="absolute bottom-6 left-6 bg-glass p-4 rounded-xl">
                {tour.destinations.length > 0 && (
                  <p className="text-primary font-body text-xs uppercase tracking-widest mb-1">
                    {tour.destinations.map((d) => d.name).join(" · ")}
                  </p>
                )}
                <h1 className="font-heading text-2xl md:text-3xl text-primary">
                  {tour.title}
                </h1>
              </div>
            </div>

            {/* Side images */}
            <div className="hidden lg:grid col-span-4 grid-rows-2 gap-4 h-full">
              {allImages[1] ? (
                <div className="relative group overflow-hidden rounded-xl bg-surface-container-low">
                  <Image
                    src={allImages[1].image_url}
                    alt={allImages[1].alt}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="33vw"
                  />
                </div>
              ) : (
                <div className="rounded-xl bg-surface-container-low" />
              )}
              <div className="relative group overflow-hidden rounded-xl bg-surface-container-low">
                {allImages[2] ? (
                  <Image
                    src={allImages[2].image_url}
                    alt={allImages[2].alt}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="33vw"
                  />
                ) : (
                  <div className="w-full h-full" />
                )}
                {allImages.length > 3 && (
                  <button
                    onClick={() => {
                      setGalleryIndex(0);
                      setGalleryOpen(true);
                    }}
                    className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="bg-surface text-primary px-4 py-2 rounded-full flex items-center gap-2 font-body text-sm">
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
                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        />
                      </svg>
                      View All Photos
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content & Sidebar */}
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 mb-12 md:mb-24">
          <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-16">
          {/* Left Column */}
          <div className="lg:col-span-8">
            {/* Tags */}
            <div className="flex items-center gap-2 md:gap-3 flex-wrap mb-4 md:mb-6">
              <span className="bg-secondary-container/10 text-secondary px-3 py-1 rounded-full text-xs font-body uppercase tracking-widest">
                {tour.duration_days} Days
                {tour.duration_nights
                  ? ` / ${tour.duration_nights} Nights`
                  : ""}
              </span>
              {tour.categories.map((cat) => (
                <span
                  key={cat.id}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-body uppercase tracking-widest"
                >
                  {cat.name}
                </span>
              ))}
              {tour.difficulty && (
                <span className="bg-tertiary-container/20 text-tertiary px-3 py-1 rounded-full text-xs font-body uppercase tracking-widest">
                  {tour.difficulty}
                </span>
              )}
            </div>

            {/* Title & Description */}
            <h2 className="font-heading text-3xl md:text-5xl text-primary mb-4 md:mb-6 leading-tight">
              {tour.title}
            </h2>
            {tour.description && (
              <p className="text-base md:text-xl text-on-surface/80 leading-relaxed font-light mb-10 md:mb-16">
                {tour.description}
              </p>
            )}

            {/* Highlights */}
            {tour.highlights && (
              <div className="mb-10 md:mb-16">
                <h3 className="font-heading text-2xl md:text-3xl text-primary pb-3 md:pb-4 mb-5 md:mb-8">
                  Highlights
                </h3>
                <HighlightsList text={tour.highlights} />
              </div>
            )}

            {/* Itinerary */}
            {tour.itinerary && (() => {
              const parsed = parseItineraryDays(tour.itinerary);
              if (!parsed) {
                return (
                  <div className="space-y-8 md:space-y-12 mb-12 md:mb-20">
                    <h3 className="font-heading text-2xl md:text-3xl text-primary pb-3 md:pb-4">
                      The Itinerary
                    </h3>
                    <div className="text-on-surface-variant leading-relaxed whitespace-pre-line">
                      {tour.itinerary}
                    </div>
                  </div>
                );
              }
              return (
                <div className="mb-12 md:mb-20">
                  <h3 className="font-heading text-2xl md:text-3xl text-primary pb-6 md:pb-8">
                    The Itinerary
                  </h3>
                  {parsed.preamble && (
                    <p className="text-on-surface-variant leading-relaxed whitespace-pre-line mb-8 md:mb-10">
                      {parsed.preamble}
                    </p>
                  )}
                  {parsed.days.length >= 3 && (
                    <nav
                      aria-label="Itinerary days"
                      className="sticky top-20 md:top-24 z-30 mb-8 md:mb-10 rounded-full bg-surface/85 backdrop-blur supports-[backdrop-filter]:bg-surface/70 border border-outline-variant/30 shadow-sm"
                    >
                      <ul className="flex gap-1.5 overflow-x-auto no-scrollbar px-2 py-2">
                        {parsed.days.map((d) => (
                          <li key={d.dayNumber} className="flex-none">
                            <a
                              href={`#day-${d.dayNumber}`}
                              onClick={(e) => {
                                e.preventDefault();
                                document
                                  .getElementById(`day-${d.dayNumber}`)
                                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
                              }}
                              className="inline-flex items-center px-3 py-1.5 rounded-full bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary text-xs font-body uppercase tracking-widest transition-colors"
                            >
                              Day {d.dayNumber}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  )}
                  <ol className="relative border-l border-primary/15 ml-3 space-y-10 md:space-y-12">
                    {parsed.days.map((d) => (
                      <li
                        key={d.dayNumber}
                        id={`day-${d.dayNumber}`}
                        className="ml-6 md:ml-10 relative scroll-mt-32 md:scroll-mt-36"
                      >
                        <span
                          aria-hidden
                          className="absolute -left-[33px] md:-left-[49px] top-1 flex items-center justify-center w-4 h-4 rounded-full bg-primary ring-4 ring-surface"
                        />
                        <p className="text-secondary font-body text-xs uppercase tracking-widest mb-2">
                          Day {d.dayNumber}
                        </p>
                        {d.title && (
                          <h4 className="font-heading text-xl md:text-2xl text-primary mb-3 leading-snug">
                            {d.title}
                          </h4>
                        )}
                        {d.body && (
                          <p className="text-on-surface-variant leading-relaxed whitespace-pre-line">
                            {d.body}
                          </p>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })()}

            {/* What's Included / Excluded */}
            {(tour.included || tour.excluded) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-12 md:mb-20">
                {tour.included && (
                  <div>
                    <h3 className="font-heading text-xl md:text-2xl text-primary mb-4 md:mb-6">
                      What&apos;s Included
                    </h3>
                    <FeatureList text={tour.included} variant="included" />
                  </div>
                )}
                {tour.excluded && (
                  <div>
                    <h3 className="font-heading text-xl md:text-2xl text-primary mb-4 md:mb-6">
                      What&apos;s Excluded
                    </h3>
                    <FeatureList text={tour.excluded} variant="excluded" />
                  </div>
                )}
              </div>
            )}

            {/* YouTube */}
            {tour.youtube_url && (
              <div className="mb-12 md:mb-20">
                <h3 className="font-heading text-2xl md:text-3xl text-primary mb-5 md:mb-8">
                  Watch the Journey
                </h3>
                <div className="aspect-video rounded-xl overflow-hidden">
                  <iframe
                    src={tour.youtube_url.replace("watch?v=", "embed/")}
                    title={tour.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Gallery grid (if more than 3 images) */}
            {allImages.length > 3 && (
              <div className="mb-12 md:mb-20">
                <h3 className="font-heading text-2xl md:text-3xl text-primary mb-5 md:mb-8">
                  Gallery
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {allImages.slice(3).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setGalleryIndex(i + 3);
                        setGalleryOpen(true);
                      }}
                      className="relative aspect-square rounded-xl overflow-hidden group"
                    >
                      <Image
                        src={img.image_url}
                        alt={img.alt}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Booking Sidebar */}
          <div className="mt-8 lg:mt-0 lg:col-span-4">
            <div className="lg:sticky lg:top-28 space-y-5 md:space-y-6">
              <div className="bg-surface-container-lowest p-5 md:p-8 rounded-xl shadow-[0_20px_40px_rgba(27,28,28,0.06)]">
                <div className="mb-6 md:mb-8">
                  <p className="text-on-surface-variant text-sm font-body uppercase tracking-widest mb-1">
                    Bespoke Expedition
                  </p>
                  <p className="font-heading text-xl md:text-2xl text-primary leading-tight">
                    Let us curate this journey around your dates, interests,
                    and group.
                  </p>
                </div>

                {/* At a glance */}
                {(() => {
                  const priceNum = tour.base_price_adult
                    ? Number(tour.base_price_adult)
                    : 0;
                  let priceLabel = "";
                  if (priceNum > 0) {
                    try {
                      priceLabel = new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: tour.currency || "USD",
                        maximumFractionDigits: 0,
                      }).format(priceNum);
                    } catch {
                      priceLabel = `${tour.currency || "USD"} ${priceNum.toFixed(0)}`;
                    }
                  }
                  const rows: { label: string; value: string }[] = [];
                  if (tour.duration_days) {
                    rows.push({
                      label: "Duration",
                      value: `${tour.duration_days} days${
                        tour.duration_nights
                          ? ` / ${tour.duration_nights} nights`
                          : ""
                      }`,
                    });
                  }
                  if (priceLabel) {
                    rows.push({ label: "From", value: priceLabel });
                  }
                  if (tour.max_group_size) {
                    rows.push({
                      label: "Group",
                      value: `Max ${tour.max_group_size} travelers`,
                    });
                  }
                  if (tour.destinations.length > 0) {
                    rows.push({
                      label: tour.destinations.length > 1 ? "Destinations" : "Destination",
                      value: tour.destinations.map((d) => d.name).join(", "),
                    });
                  }
                  if (rows.length === 0) return null;
                  return (
                    <div className="mb-6 pb-6 border-b border-outline-variant/30">
                      <p className="block text-xs font-body uppercase tracking-widest text-on-surface-variant mb-3">
                        At a Glance
                      </p>
                      <dl className="space-y-2">
                        {rows.map((r) => (
                          <div
                            key={r.label}
                            className="flex justify-between items-baseline gap-3 text-sm"
                          >
                            <dt className="text-on-surface-variant">
                              {r.label}
                            </dt>
                            <dd className="text-primary font-medium text-right">
                              {r.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  );
                })()}

                {/* Tour Dates */}
                {tour.tour_dates && tour.tour_dates.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-xs font-body uppercase tracking-widest text-on-surface-variant mb-2">
                      Available Dates
                    </label>
                    <div className="space-y-2">
                      {tour.tour_dates.map((td: TourDate) => (
                        <button
                          key={td.id}
                          onClick={() => setSelectedDate(td.id)}
                          className={`w-full text-left p-3 rounded-xl transition-all ${
                            selectedDate === td.id
                              ? "bg-primary/10 ring-1 ring-primary"
                              : "bg-surface-container-highest hover:bg-surface-container-high"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-primary">
                              {new Date(td.start_date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                }
                              )}{" "}
                              -{" "}
                              {new Date(td.end_date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <p className="text-xs text-on-surface-variant mt-1">
                            {td.available_capacity} spots remaining
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <Link
                  href={`/tours/${tour.slug}/book${selectedDate ? `?date=${selectedDate}` : ""}`}
                  className="block w-full primary-gradient text-on-primary py-4 rounded-xl font-body tracking-widest uppercase text-sm text-center hover:opacity-90 transition-opacity"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
          </div>
        </section>
      </div>

      {/* Lightbox */}
      {galleryOpen && allImages.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            onClick={() => setGalleryOpen(false)}
            className="absolute top-6 right-6 text-white/80 hover:text-white"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <button
            onClick={() =>
              setGalleryIndex(
                (galleryIndex - 1 + allImages.length) % allImages.length
              )
            }
            className="absolute left-4 text-white/80 hover:text-white"
          >
            <svg
              className="w-10 h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="relative w-full max-w-5xl aspect-[3/2] mx-16">
            <Image
              src={allImages[galleryIndex].image_url}
              alt={allImages[galleryIndex].alt}
              fill
              unoptimized
              className="object-contain"
              sizes="90vw"
            />
          </div>
          <button
            onClick={() =>
              setGalleryIndex((galleryIndex + 1) % allImages.length)
            }
            className="absolute right-4 text-white/80 hover:text-white"
          >
            <svg
              className="w-10 h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          <p className="absolute bottom-6 text-white/60 text-sm">
            {galleryIndex + 1} / {allImages.length}
          </p>
        </div>
      )}
    </>
  );
}
