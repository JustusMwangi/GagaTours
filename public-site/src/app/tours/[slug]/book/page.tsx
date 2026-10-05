"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { apiFetch, type TourDetail, type TourDate, type Inquiry } from "@/lib/api";

type Step = "dates" | "guests" | "review";

interface BookingFormState {
  step: Step;
  selectedDateId: string | null;
  adults: number;
  children: number;
  fullName: string;
  email: string;
  phone: string;
  message: string;
}

const STEPS: { key: Step; label: string; num: string }[] = [
  { key: "dates", label: "Dates", num: "01" },
  { key: "guests", label: "Guests", num: "02" },
  { key: "review", label: "Review", num: "03" },
];

function getStorageKey(slug: string) {
  return `booking_${slug}`;
}

function loadFormState(slug: string, urlDateId: string | null): BookingFormState {
  try {
    const raw = sessionStorage.getItem(getStorageKey(slug));
    if (raw) {
      const saved = JSON.parse(raw) as BookingFormState;
      // URL date param takes precedence if present
      if (urlDateId) saved.selectedDateId = urlDateId;
      return saved;
    }
  } catch {}
  return {
    step: "dates",
    selectedDateId: urlDateId,
    adults: 2,
    children: 0,
    fullName: "",
    email: "",
    phone: "",
    message: "",
  };
}

export default function BookingFlowPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tour, setTour] = useState<TourDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saved = loadFormState(params.slug ?? "", searchParams.get("date"));
  const [step, setStep] = useState<Step>(saved.step);
  const [selectedDateId, setSelectedDateId] = useState<string | null>(
    saved.selectedDateId
  );
  const [adults, setAdults] = useState(saved.adults);
  const [children, setChildren] = useState(saved.children);

  // Guest fields
  const [fullName, setFullName] = useState(saved.fullName);
  const [email, setEmail] = useState(saved.email);
  const [phone, setPhone] = useState(saved.phone);
  const [message, setMessage] = useState(saved.message);
  const [privacyConsent, setPrivacyConsent] = useState(false);

  // Persist form state to sessionStorage on change
  const saveFormState = useCallback(() => {
    if (!params.slug) return;
    const state: BookingFormState = {
      step, selectedDateId, adults, children, fullName, email, phone, message,
    };
    try {
      sessionStorage.setItem(getStorageKey(params.slug), JSON.stringify(state));
    } catch {}
  }, [params.slug, step, selectedDateId, adults, children, fullName, email, phone, message]);

  useEffect(() => {
    saveFormState();
  }, [saveFormState]);

  useEffect(() => {
    if (!params.slug) return;
    apiFetch<TourDetail>(`/tours/${params.slug}`)
      .then((data) => {
        setTour(data);
        if (!selectedDateId && data.tour_dates?.length > 0) {
          setSelectedDateId(data.tour_dates[0].id);
        }
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load tour")
      )
      .finally(() => setLoading(false));
  }, [params.slug, selectedDateId]);

  if (loading) {
    return (
      <div className="pt-28 pb-24 text-center">
        <div className="inline-block w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="pt-28 pb-24 text-center max-w-7xl mx-auto px-6 lg:px-8">
        <h1 className="font-heading text-4xl text-primary mb-4">
          Tour Not Found
        </h1>
        <Link
          href="/tours"
          className="text-secondary font-heading border-b border-secondary pb-0.5"
        >
          Browse all expeditions
        </Link>
      </div>
    );
  }

  const activeTourDate: TourDate | undefined = tour.tour_dates?.find(
    (d) => d.id === selectedDateId
  );

  const canProceedFromDates = !!selectedDateId;
  const canProceedFromGuests =
    fullName.trim().length > 0 && email.trim().length > 0;

  const handleSubmit = async () => {
    if (!tour) return;
    setSubmitting(true);
    setError(null);
    try {
      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || firstName;
      const inquiry = await apiFetch<Inquiry>("/inquiries", {
        method: "POST",
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone || undefined,
          tour_id: tour.id,
          travel_date: activeTourDate?.start_date || undefined,
          group_size_adults: adults,
          group_size_children: children || undefined,
          message: message || undefined,
          privacy_consent: true,
        }),
      });
      sessionStorage.removeItem(getStorageKey(params.slug));
      router.push(`/tours/${params.slug}/book/confirmed?inquiry=${inquiry.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit inquiry"
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-12">
          {/* Progress */}
          <div className="flex items-center gap-4 text-xs font-body tracking-widest uppercase">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex items-center gap-4">
                {i > 0 && (
                  <span className="w-8 h-[1px] bg-outline-variant" />
                )}
                <button
                  onClick={() => {
                    if (s.key === "dates") setStep("dates");
                    if (s.key === "guests" && canProceedFromDates)
                      setStep("guests");
                    if (
                      s.key === "review" &&
                      canProceedFromDates &&
                      canProceedFromGuests
                    )
                      setStep("review");
                  }}
                  className={
                    step === s.key
                      ? "text-primary font-bold"
                      : "text-on-surface-variant/40"
                  }
                >
                  {s.num} {s.label}
                </button>
              </div>
            ))}
          </div>

          {/* Step 1: Dates */}
          {step === "dates" && (
            <section className="space-y-10">
              <header>
                <h1 className="text-4xl md:text-5xl font-heading mb-4">
                  Confirm your journey.
                </h1>
                <p className="text-on-surface-variant max-w-lg leading-relaxed">
                  Choose the window of your escape. Our curated itineraries are
                  designed around the rhythms of the wild.
                </p>
              </header>

              {/* Date selection */}
              {tour.tour_dates && tour.tour_dates.length > 0 ? (
                <div className="bg-surface-container-low p-8 rounded-xl space-y-4">
                  <label className="block text-xs font-body tracking-widest text-on-surface-variant uppercase mb-4">
                    Available Departures
                  </label>
                  {tour.tour_dates.map((td) => (
                    <button
                      key={td.id}
                      onClick={() => setSelectedDateId(td.id)}
                      className={`w-full text-left p-4 rounded-xl transition-all ${
                        selectedDateId === td.id
                          ? "bg-surface-container-lowest ring-2 ring-primary/40"
                          : "bg-surface-container-lowest/50 hover:bg-surface-container-lowest"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-primary">
                            {new Date(td.start_date).toLocaleDateString(
                              "en-US",
                              { month: "long", day: "numeric" }
                            )}{" "}
                            &mdash;{" "}
                            {new Date(td.end_date).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-xs text-on-surface-variant mt-1">
                            {td.available_capacity} spots remaining
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-surface-container-low p-8 rounded-xl">
                  <p className="text-on-surface-variant">
                    No dates currently available. Please contact us for custom
                    scheduling.
                  </p>
                </div>
              )}

              {/* Travelers */}
              <div className="bg-surface-container-low p-8 rounded-xl space-y-6">
                <label className="block text-xs font-body tracking-widest text-on-surface-variant uppercase">
                  Travelers
                </label>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-body tracking-widest text-on-surface-variant uppercase mb-2 ml-1">
                      Adults
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors"
                      >
                        -
                      </button>
                      <span className="text-lg font-medium text-primary w-8 text-center">
                        {adults}
                      </span>
                      <button
                        onClick={() => setAdults(adults + 1)}
                        className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-body tracking-widest text-on-surface-variant uppercase mb-2 ml-1">
                      Children
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors"
                      >
                        -
                      </button>
                      <span className="text-lg font-medium text-primary w-8 text-center">
                        {children}
                      </span>
                      <button
                        onClick={() => setChildren(children + 1)}
                        className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep("guests")}
                disabled={!canProceedFromDates}
                className="primary-gradient text-on-primary px-10 py-4 rounded-xl font-body tracking-widest uppercase text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue to Guest Details
              </button>
            </section>
          )}

          {/* Step 2: Guest Info */}
          {step === "guests" && (
            <section className="space-y-10">
              <header>
                <h1 className="text-4xl md:text-5xl font-heading mb-4">
                  Guest Information
                </h1>
                <p className="text-on-surface-variant max-w-lg leading-relaxed">
                  Tell us about the travelers embarking on this journey.
                </p>
              </header>

              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-body tracking-widest text-on-surface-variant uppercase ml-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Julian Montgomery"
                    className="w-full bg-surface-container-low border-none rounded-xl p-4 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-body tracking-widest text-on-surface-variant uppercase ml-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="j.montgomery@example.com"
                      className="w-full bg-surface-container-low border-none rounded-xl p-4 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-body tracking-widest text-on-surface-variant uppercase ml-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+254 700 000000"
                      className="w-full bg-surface-container-low border-none rounded-xl p-4 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-body tracking-widest text-on-surface-variant uppercase ml-1">
                    Special Requests
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    placeholder="Dietary requirements, celebrations, accessibility needs..."
                    className="w-full bg-surface-container-low border-none rounded-xl p-4 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/40 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep("dates")}
                  className="px-8 py-4 rounded-xl border border-outline-variant text-primary font-body tracking-widest uppercase text-sm hover:bg-surface-container-low transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("review")}
                  disabled={!canProceedFromGuests}
                  className="primary-gradient text-on-primary px-10 py-4 rounded-xl font-body tracking-widest uppercase text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue to Review
                </button>
              </div>
            </section>
          )}

          {/* Step 3: Review & Submit */}
          {step === "review" && (
            <section className="space-y-10">
              <header>
                <h1 className="text-4xl md:text-5xl font-heading mb-4">
                  Review Your Inquiry
                </h1>
                <p className="text-on-surface-variant max-w-lg leading-relaxed">
                  Review your details and submit your inquiry. Our team will
                  get back to you within 24 hours with a curated quote.
                </p>
              </header>

              {/* Review details */}
              <div className="bg-surface-container-low p-8 rounded-xl space-y-6">
                <div>
                  <p className="text-xs font-body tracking-widest text-on-surface-variant uppercase mb-1">
                    Guest
                  </p>
                  <p className="font-medium text-primary">{fullName}</p>
                  <p className="text-sm text-on-surface-variant">
                    {email}
                    {phone && ` | ${phone}`}
                  </p>
                </div>
                {activeTourDate && (
                  <div>
                    <p className="text-xs font-body tracking-widest text-on-surface-variant uppercase mb-1">
                      Dates
                    </p>
                    <p className="font-medium text-primary">
                      {new Date(
                        activeTourDate.start_date
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      &mdash;{" "}
                      {new Date(activeTourDate.end_date).toLocaleDateString(
                        "en-US",
                        { month: "long", day: "numeric", year: "numeric" }
                      )}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-body tracking-widest text-on-surface-variant uppercase mb-1">
                    Travelers
                  </p>
                  <p className="font-medium text-primary">
                    {adults} {adults === 1 ? "Adult" : "Adults"}
                    {children > 0 &&
                      `, ${children} ${children === 1 ? "Child" : "Children"}`}
                  </p>
                </div>
                {message && (
                  <div>
                    <p className="text-xs font-body tracking-widest text-on-surface-variant uppercase mb-1">
                      Special Requests
                    </p>
                    <p className="text-on-surface-variant">{message}</p>
                  </div>
                )}
              </div>

              {error && (
                <p className="text-error text-sm">{error}</p>
              )}

              {/* Privacy consent */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacyConsent}
                  onChange={(e) => setPrivacyConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-[#17341d] rounded"
                />
                <span className="text-sm text-on-surface-variant leading-relaxed">
                  I agree to the processing of my personal data as described in the{" "}
                  <Link href="/privacy" className="text-primary underline">Privacy Policy</Link>{" "}
                  and accept the{" "}
                  <Link href="/terms" className="text-primary underline">Terms of Service</Link>. *
                </span>
              </label>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep("guests")}
                  className="px-8 py-4 rounded-xl border border-outline-variant text-primary font-body tracking-widest uppercase text-sm hover:bg-surface-container-low transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !privacyConsent}
                  className="primary-gradient text-on-primary px-10 py-4 rounded-xl font-body tracking-widest uppercase text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit Inquiry"}
                </button>
              </div>
              <p className="text-xs text-on-surface-variant/60">
                Our team will reach out within 24 hours with a curated quote
                tailored to your group and dates.
              </p>
            </section>
          )}
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 space-y-6">
            <div className="bg-surface-container-low rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(27,28,28,0.06)]">
              {/* Summary image */}
              <div className="relative h-48 overflow-hidden">
                {tour.featured_image_url ? (
                  <Image
                    src={tour.featured_image_url}
                    alt={tour.title}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-container-high" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-heading">{tour.title}</h3>
                  <p className="text-xs uppercase tracking-widest font-body opacity-80">
                    {tour.duration_days} Days
                    {tour.duration_nights
                      ? ` / ${tour.duration_nights} Nights`
                      : ""}
                    {tour.categories.length > 0
                      ? ` \u2022 ${tour.categories.map((c) => c.name).join(", ")}`
                      : ""}
                  </p>
                </div>
              </div>

              {/* Summary content */}
              <div className="p-8 space-y-6">
                {activeTourDate && (
                  <div className="flex items-center gap-4 py-4 border-b border-outline-variant/20">
                    <div className="flex-1">
                      <p className="text-xs font-body tracking-widest text-on-surface-variant uppercase">
                        Dates
                      </p>
                      <p className="text-sm font-medium">
                        {new Date(
                          activeTourDate.start_date
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        &mdash;{" "}
                        {new Date(activeTourDate.end_date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-xs font-body tracking-widest text-on-surface-variant uppercase">
                        Guests
                      </p>
                      <p className="text-sm font-medium">
                        {adults} {adults === 1 ? "Adult" : "Adults"}
                        {children > 0 && `, ${children} ${children === 1 ? "Child" : "Children"}`}
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-6 mt-4 border-t border-outline-variant/40">
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Submit your details and our team will get back to you
                    within 24 hours with a curated quote for your party.
                  </p>
                </div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-surface-container-lowest rounded-xl flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-secondary flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span className="text-xs font-body uppercase tracking-wider leading-tight">
                  Protected Booking
                </span>
              </div>
              <div className="p-5 bg-surface-container-lowest rounded-xl flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-secondary flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xs font-body uppercase tracking-wider leading-tight">
                  100% Carbon Neutral
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
