"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { apiFetch, type DestinationsResponse } from "@/lib/api";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    apiFetch<DestinationsResponse>("/destinations?per_page=100")
      .then((d) => {
        const unique = Array.from(
          new Set(d.destinations.map((x) => x.country).filter(Boolean))
        ).sort();
        setCountries(unique);
      })
      .catch(() => {});
  }, []);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await apiFetch("/subscribe", {
        method: "POST",
        body: JSON.stringify({ email, privacy_consent: true }),
      });
      setSubmitted(true);
      setEmail("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <footer className="bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.jpg"
                alt="Book With Sheilla"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover ring-1 ring-primary/15"
              />
              <span className="text-2xl font-heading text-primary">
                Book With Sheilla
              </span>
            </Link>
            <p className="mt-4 text-sm text-on-surface-variant max-w-xs leading-relaxed">
              Crafting immersive wildlife experiences for the modern explorer. We
              believe in travel that respects the land and enriches the soul.
            </p>
          </div>

          {/* Destinations — derived from active countries */}
          {countries.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold tracking-[0.05rem] uppercase text-on-surface mb-4">
                Destinations
              </h4>
              <ul className="space-y-3">
                {countries.map((country) => (
                  <li key={country}>
                    <Link
                      href="/destinations"
                      className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                    >
                      {country}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Experience */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.05rem] uppercase text-on-surface mb-4">
              Experience
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Safari Tours", href: "/tours" },
                { label: "Our Story", href: "/our-story" },
                { label: "Journal", href: "/journal" },
                { label: "FAQs", href: "/faqs" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.05rem] uppercase text-on-surface mb-4">
              Newsletter
            </h4>
            <p className="text-sm text-on-surface-variant mb-4">
              Curated stories from the field, delivered monthly.
            </p>
            {submitted ? (
              <p className="text-sm text-primary font-medium">
                Thank you for subscribing!
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                    className="flex-1 bg-surface-container-highest text-sm px-4 py-2.5 rounded-lg text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={submitting || !newsletterConsent}
                    className="primary-gradient text-on-primary p-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    aria-label="Subscribe"
                  >
                    {submitting ? (
                      <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                    ) : (
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
                    )}
                  </button>
                </div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newsletterConsent}
                    onChange={(e) => setNewsletterConsent(e.target.checked)}
                    className="mt-0.5 w-3.5 h-3.5 accent-[#17341d] rounded"
                  />
                  <span className="text-[11px] text-on-surface-variant leading-snug">
                    I agree to receive the newsletter and accept the{" "}
                    <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
                  </span>
                </label>
              </form>
            )}
            {error && (
              <p className="text-sm text-error mt-2">{error}</p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 md:mt-12 md:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant">
          <p>
            &copy; {new Date().getFullYear()} Book With Sheilla. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/data-rights"
              className="hover:text-primary transition-colors"
            >
              Data Rights
            </Link>
            <Link
              href="/contact"
              className="hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
