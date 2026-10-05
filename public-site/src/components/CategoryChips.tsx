"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, type CategoriesResponse, type TourCategory } from "@/lib/api";
import Container from "./Container";

export default function CategoryChips() {
  const [categories, setCategories] = useState<TourCategory[]>([]);

  useEffect(() => {
    let cancelled = false;
    apiFetch<CategoriesResponse>("/categories")
      .then((d) => {
        if (!cancelled) setCategories(d.categories);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="py-6 md:py-10 bg-surface">
      <Container>
        <div className="flex gap-3 overflow-x-auto no-scrollbar md:flex-wrap md:overflow-visible -mx-5 px-5 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/tours?category=${c.slug}`}
              className="shrink-0 inline-flex items-center px-4 py-2 rounded-full bg-surface-container-low text-on-surface text-sm font-body border border-outline-variant hover:bg-primary hover:text-on-primary hover:border-primary transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
