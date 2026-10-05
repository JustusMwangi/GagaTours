"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  apiFetch,
  type Tour,
  type TourCategory,
  type Destination,
  type ToursResponse,
} from "@/lib/api";
import { nameSummary, firstCountry } from "@/lib/tour-helpers";

const sortOptions = [
  { label: "Most Recommended", value: "recommended" },
  { label: "Duration: Longest", value: "duration_desc" },
  { label: "Duration: Shortest", value: "duration_asc" },
];

export default function ToursPage() {
  return (
    <Suspense>
      <ToursContent />
    </Suspense>
  );
}

function ToursContent() {
  const searchParams = useSearchParams();
  const [tours, setTours] = useState<Tour[]>([]);
  const [categories, setCategories] = useState<TourCategory[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters — pre-select destination from URL if present
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(
    searchParams.get("destination_id")
  );
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchTours = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), per_page: "8" });
      if (search) params.set("search", search);
      if (selectedCategory) params.set("category_id", selectedCategory);
      if (selectedDestination) params.set("destination_id", selectedDestination);
      if (sortBy) params.set("sort", sortBy);

      const data = await apiFetch<ToursResponse>(`/tours?${params}`);
      setTours(data.tours);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tours");
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedCategory, selectedDestination, sortBy]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  // Load categories and destinations once
  useEffect(() => {
    apiFetch<{ categories: TourCategory[] }>("/categories")
      .then((d) => setCategories(d.categories))
      .catch(() => {});
    apiFetch<{ destinations: Destination[] }>("/destinations?per_page=100")
      .then((d) => setDestinations(d.destinations))
      .catch(() => {});
  }, []);

  // Reset to page 1 when filters or sort change
  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory, selectedDestination, sortBy]);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedDestination(null);
    setSearch("");
  };

  const hasFilters = !!selectedCategory || !!selectedDestination || !!search;

  const filtersContent = (
    <div className="space-y-6 lg:space-y-10">
      {/* Search */}
      <div>
        <h3 className="font-body text-sm uppercase tracking-widest text-secondary font-bold mb-4 lg:mb-6">
          Search
        </h3>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tours..."
          className="w-full bg-surface-container-highest text-sm px-4 py-3 rounded-lg text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <h3 className="font-body text-sm uppercase tracking-widest text-secondary font-bold mb-4 lg:mb-6">
            Category
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === cat.id ? null : cat.id
                  )
                }
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedCategory === cat.id
                    ? "bg-primary/10 border border-primary text-primary"
                    : "border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Destinations — grouped by country */}
      {destinations.length > 0 && (
        <div>
          <h3 className="font-body text-sm uppercase tracking-widest text-secondary font-bold mb-4 lg:mb-6">
            Destination
          </h3>
          <div className="space-y-6">
            {Object.entries(
              destinations.reduce<Record<string, Destination[]>>((acc, d) => {
                const country = d.country || "Other";
                (acc[country] ||= []).push(d);
                return acc;
              }, {})
            )
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([country, dests]) => (
                <div key={country}>
                  <h4 className="font-heading text-base text-primary mb-3">
                    {country}
                  </h4>
                  <div className="space-y-3 pl-1 border-l border-outline-variant/40">
                    {dests.map((dest) => (
                      <label
                        key={dest.id}
                        className="flex items-center group cursor-pointer pl-3"
                      >
                        <input
                          type="radio"
                          name="destination"
                          checked={selectedDestination === dest.id}
                          onChange={() =>
                            setSelectedDestination(
                              selectedDestination === dest.id ? null : dest.id
                            )
                          }
                          className="rounded-full border-outline-variant text-primary focus:ring-primary h-4 w-4"
                        />
                        <span className="ml-3 text-sm text-on-surface-variant group-hover:text-primary transition-colors">
                          {dest.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Clear Filters */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-secondary font-heading border-b border-secondary pb-0.5"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="pt-20 md:pt-28 pb-12 md:pb-24 px-5 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <header className="mb-8 md:mb-16">
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-primary mb-3 md:mb-4 leading-tight">
          Curated Expeditions
        </h1>
        <p className="text-on-surface-variant max-w-2xl text-base md:text-lg">
          Discover the untamed beauty of East Africa through our hand-picked
          collection of immersive safari experiences.
        </p>
      </header>

      {/* Mobile filter toggle */}
      <button
        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
        className="lg:hidden flex items-center gap-2 mb-6 text-sm font-semibold text-primary"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
      </button>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Sidebar Filters — Desktop */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-28">{filtersContent}</div>
        </aside>

        {/* Sidebar Filters — Mobile */}
        {mobileFiltersOpen && (
          <aside className="lg:hidden bg-surface-container-low rounded-xl p-6">
            {filtersContent}
          </aside>
        )}

        {/* Results */}
        <div className="flex-1">
          {/* Results bar */}
          <div className="flex items-center justify-between mb-6 md:mb-10 pb-4 md:pb-6">
            <p className="text-on-surface-variant">
              Showing{" "}
              <span className="font-semibold text-primary">
                {total} bespoke {total === 1 ? "journey" : "journeys"}
              </span>
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-on-surface-variant">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none focus:ring-0 font-semibold text-primary cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="mt-4 text-on-surface-variant">
                Loading expeditions...
              </p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="text-center py-20">
              <p className="text-error text-lg mb-4">{error}</p>
              <button
                onClick={fetchTours}
                className="text-secondary font-heading border-b border-secondary pb-0.5"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && tours.length === 0 && (
            <div className="text-center py-20">
              <p className="text-on-surface-variant text-lg">
                No expeditions match your filters.
              </p>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-secondary font-heading border-b border-secondary pb-0.5"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Tour Cards Grid */}
          {!loading && !error && tours.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                {tours.map((tour) => (
                  <Link
                    key={tour.id}
                    href={`/tours/${tour.slug}`}
                    className="group cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded-xl aspect-[4/5] mb-4 md:mb-6 bg-surface-container-low">
                      {tour.featured_image_url ? (
                        <Image
                          src={tour.featured_image_url}
                          alt={tour.title}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-outline">
                          <svg
                            className="w-16 h-16"
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
                      {firstCountry(tour.destinations) && (
                        <div className="absolute top-4 left-4 bg-glass px-3 py-1 rounded-full text-[10px] uppercase tracking-widest text-primary font-body font-semibold">
                          {firstCountry(tour.destinations)}
                        </div>
                      )}
                      {tour.is_featured && (
                        <div className="absolute top-4 right-4 bg-glass px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase text-primary">
                          Featured
                        </div>
                      )}
                      {tour.highlights && (
                        <div className="absolute bottom-6 left-6 bg-glass p-4 rounded-xl w-4/5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                          <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">
                            Highlights
                          </p>
                          <p className="text-sm text-primary line-clamp-3">
                            {tour.highlights}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-heading text-2xl text-primary group-hover:text-secondary transition-colors">
                        {tour.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                        <span className="flex items-center gap-1">
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
                          {tour.duration_days} Days
                        </span>
                        {tour.destinations.length > 0 && (
                          <span className="flex items-center gap-1">
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
                            {nameSummary(tour.destinations)}
                          </span>
                        )}
                      </div>
                      {tour.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {tour.categories.map((cat) => (
                            <span
                              key={cat.id}
                              className="bg-surface-container-highest text-on-surface-variant text-[11px] uppercase tracking-wide px-2.5 py-0.5 rounded-full"
                            >
                              {cat.name}
                            </span>
                          ))}
                        </div>
                      )}
                      {tour.description && (
                        <p className="text-on-surface-variant line-clamp-2">
                          {tour.description}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 md:mt-20 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-12 h-12 flex items-center justify-center rounded-full border border-outline-variant text-primary hover:bg-primary/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-5 h-5"
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors ${
                          p === page
                            ? "bg-primary text-on-primary"
                            : "border border-outline-variant text-primary hover:bg-primary/5"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-12 h-12 flex items-center justify-center rounded-full border border-outline-variant text-primary hover:bg-primary/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-5 h-5"
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
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
