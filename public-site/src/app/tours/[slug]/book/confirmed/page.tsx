"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { apiFetch, type TourDetail, type Inquiry } from "@/lib/api";

export default function BookingConfirmedPage() {
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const [tour, setTour] = useState<TourDetail | null>(null);
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    if (!params.slug) return;
    apiFetch<TourDetail>(`/tours/${params.slug}`)
      .then(setTour)
      .catch(() => {});
  }, [params.slug]);

  useEffect(() => {
    const inquiryId = searchParams.get("inquiry");
    if (!inquiryId) return;
    apiFetch<Inquiry>(`/inquiries/${inquiryId}`)
      .then(setInquiry)
      .catch(() => {});
  }, [searchParams]);

  return (
    <div className="pt-28 pb-24">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-secondary" />
              <span className="text-xs font-body uppercase tracking-widest text-secondary font-bold">
                Inquiry Received
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-heading text-primary leading-tight mb-6">
              Your expedition{" "}
              <span>awaits you.</span>
            </h1>
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-md mb-10">
              We are thrilled to begin curating your upcoming journey. Your
              inquiry has been received and our team will reach out within 24
              hours with a tailored quote.
            </p>
          </div>

          {tour?.featured_image_url && (
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={tour.featured_image_url}
                  alt={tour.title}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Summary + What's Next */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Journey Summary */}
          <div className="lg:col-span-3 bg-surface-container-low p-10 rounded-xl">
            <h2 className="font-heading text-2xl text-primary mb-8">
              Journey Summary
            </h2>
            {(tour || inquiry) && (
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-xs font-body tracking-widest text-secondary uppercase mb-1">
                    Destination
                  </p>
                  <p className="font-medium text-primary text-lg">
                    {tour?.title}
                  </p>
                  {tour && tour.destinations.length > 0 && (
                    <p className="text-sm text-on-surface-variant">
                      {tour.destinations.map((d) => d.name).join(" · ")}
                    </p>
                  )}
                </div>
                {inquiry?.preferred_date ? (
                  <div>
                    <p className="text-xs font-body tracking-widest text-secondary uppercase mb-1">
                      Departure
                    </p>
                    <p className="font-medium text-primary text-lg">
                      {new Date(inquiry.preferred_date).toLocaleDateString(
                        "en-US",
                        { month: "long", day: "numeric", year: "numeric" }
                      )}
                    </p>
                    {tour && (
                      <p className="text-sm text-on-surface-variant">
                        {tour.duration_days} Days
                        {tour.duration_nights
                          ? `, ${tour.duration_nights} Nights`
                          : ""}
                      </p>
                    )}
                  </div>
                ) : tour ? (
                  <div>
                    <p className="text-xs font-body tracking-widest text-secondary uppercase mb-1">
                      Duration
                    </p>
                    <p className="font-medium text-primary text-lg">
                      {tour.duration_days} Days
                      {tour.duration_nights
                        ? `, ${tour.duration_nights} Nights`
                        : ""}
                    </p>
                  </div>
                ) : null}
                {inquiry?.group_size_adults ? (
                  <div>
                    <p className="text-xs font-body tracking-widest text-secondary uppercase mb-1">
                      Travelers
                    </p>
                    <p className="font-medium text-primary text-lg">
                      {inquiry.group_size_adults}{" "}
                      {inquiry.group_size_adults === 1 ? "Adult" : "Adults"}
                      {inquiry.group_size_children
                        ? `, ${inquiry.group_size_children} ${inquiry.group_size_children === 1 ? "Child" : "Children"}`
                        : ""}
                    </p>
                  </div>
                ) : tour && tour.categories.length > 0 ? (
                  <div>
                    <p className="text-xs font-body tracking-widest text-secondary uppercase mb-1">
                      {tour.categories.length > 1 ? "Categories" : "Category"}
                    </p>
                    <p className="font-medium text-primary">
                      {tour.categories.map((c) => c.name).join(", ")}
                    </p>
                  </div>
                ) : null}
              </div>
            )}

            {/* Guest details */}
            {inquiry && (
              <div className="mt-8 pt-8 border-t border-outline-variant/20">
                <p className="text-xs font-body tracking-widest text-secondary uppercase mb-4">
                  Inquiry Contact
                </p>
                <div className="space-y-1">
                  <p className="font-medium text-primary">
                    {inquiry.contact_name}
                  </p>
                  {inquiry.contact_email && (
                    <p className="text-sm text-on-surface-variant">
                      {inquiry.contact_email}
                    </p>
                  )}
                  {inquiry.contact_phone && (
                    <p className="text-sm text-on-surface-variant">
                      {inquiry.contact_phone}
                    </p>
                  )}
                </div>
                {inquiry.message && (
                  <div className="mt-4">
                    <p className="text-xs font-body tracking-widest text-on-surface-variant uppercase mb-1">
                      Special Requests
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      {inquiry.message}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* What's Next */}
          <div className="lg:col-span-2 bg-primary p-10 rounded-xl text-on-primary">
            <h2 className="font-heading text-2xl mb-8">
              What&apos;s Next?
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="w-8 h-8 rounded-full bg-on-primary/10 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </span>
                <div>
                  <h4 className="font-bold mb-1">Check your inbox</h4>
                  <p className="text-sm opacity-80">
                    A confirmation email with your inquiry details has been
                    sent.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="w-8 h-8 rounded-full bg-on-primary/10 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </span>
                <div>
                  <h4 className="font-bold mb-1">Curator Consultation</h4>
                  <p className="text-sm opacity-80">
                    Your dedicated travel curator will call you within 24 hours
                    to tailor your experience.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="w-8 h-8 rounded-full bg-on-primary/10 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </span>
                <div>
                  <h4 className="font-bold mb-1">Packing List</h4>
                  <p className="text-sm opacity-80">
                    Start exploring our curated selection of safari essentials.
                  </p>
                </div>
              </div>
            </div>
            <Link
              href="/journal"
              className="mt-8 block w-full text-center bg-on-primary/10 hover:bg-on-primary/20 py-3 rounded-xl text-xs font-body uppercase tracking-widest transition-colors"
            >
              View Digital Journal
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
        <div className="bg-surface-container-low rounded-xl p-12">
          <h2 className="font-heading text-3xl text-primary mb-4">
            Sharing the spirit of exploration.
          </h2>
          <p className="text-on-surface-variant mb-8">
            While we prepare for your arrival, why not explore our latest journal
            entries on conservation and the heritage of the Serengeti?
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/"
              className="primary-gradient text-on-primary px-8 py-3 rounded-xl text-xs font-body uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Go to Home
            </Link>
            <Link
              href="/journal"
              className="px-8 py-3 rounded-xl border border-outline-variant text-primary text-xs font-body uppercase tracking-widest hover:bg-surface-container-high transition-colors"
            >
              Explore Journal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
