"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, type Destination } from "@/lib/api";

export default function HeroSearch() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [destination, setDestination] = useState("");

  useEffect(() => {
    apiFetch<{ destinations: Destination[] }>("/destinations?per_page=100")
      .then((d) => setDestinations(d.destinations))
      .catch(() => {});
  }, []);

  function handleSearch() {
    const params = new URLSearchParams();
    if (destination) params.set("destination_id", destination);
    const qs = params.toString();
    router.push(`/tours${qs ? `?${qs}` : ""}`);
  }

  return (
    <div className="bg-surface md:bg-glass border border-outline-variant md:border-0 p-5 sm:p-8 md:p-10 rounded-md md:rounded-xl max-w-3xl md:shadow-[0_20px_40px_rgba(27,28,28,0.06)]">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 md:gap-6 items-end">
        {/* Destination */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-body uppercase tracking-widest text-on-surface-variant">
            Destination
          </label>
          <div className="flex items-center gap-3 bg-surface-container-highest p-4 rounded-lg">
            <svg
              className="w-5 h-5 text-primary shrink-0"
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
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface font-medium w-full text-sm appearance-none cursor-pointer"
            >
              <option value="">Where to?</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="primary-gradient text-on-primary px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Find Journeys
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
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
