"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default function DataRightsPage() {
  const [email, setEmail] = useState("");
  const [requestType, setRequestType] = useState<"export" | "deletion">("export");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch("/data-request", {
        method: "POST",
        body: JSON.stringify({
          email,
          request_type: requestType,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      if (err instanceof Error && err.message.includes("429")) {
        setError("Please wait before submitting another request.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Hero */}
      <header className="pt-32 pb-16 px-6 md:px-12 max-w-3xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-heading font-bold text-primary mb-6 tracking-tight">
          Your Data Rights
        </h1>
        <p className="text-on-surface-variant font-body text-lg max-w-2xl mx-auto leading-relaxed">
          Under the General Data Protection Regulation (GDPR), you have the right
          to access, export, or delete your personal data. Use the form below to
          submit a request.
        </p>
      </header>

      <div className="px-6 md:px-12 max-w-xl mx-auto pb-24">
        {submitted ? (
          <div className="bg-surface-container-lowest p-10 rounded-xl text-center border-l-4 border-secondary">
            <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-on-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-heading text-primary mb-3">Request Received</h2>
            <p className="text-on-surface-variant leading-relaxed">
              If we have data associated with this email address, we will process
              your request and contact you within 30 days.
            </p>
            <Link
              href="/"
              className="inline-block mt-6 text-sm text-primary underline hover:text-primary/80"
            >
              Return to homepage
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-body uppercase tracking-widest text-on-surface-variant">
                Your Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-surface-container-highest rounded-xl p-4 focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant text-on-surface border-none outline-none"
              />
            </div>

            {/* Request type */}
            <fieldset className="space-y-3">
              <legend className="text-xs font-body uppercase tracking-widest text-on-surface-variant mb-2">
                What would you like to do?
              </legend>
              <label className={`flex items-start gap-4 p-5 rounded-xl cursor-pointer transition-all ${
                requestType === "export"
                  ? "bg-surface-container-lowest ring-2 ring-primary/40"
                  : "bg-surface-container-low hover:bg-surface-container-lowest"
              }`}>
                <input
                  type="radio"
                  name="requestType"
                  value="export"
                  checked={requestType === "export"}
                  onChange={() => setRequestType("export")}
                  className="mt-1 accent-[#17341d]"
                />
                <div>
                  <p className="font-semibold text-primary text-sm">Export my data</p>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Receive a copy of all personal data we hold about you, sent to
                    your email in JSON format.
                  </p>
                </div>
              </label>
              <label className={`flex items-start gap-4 p-5 rounded-xl cursor-pointer transition-all ${
                requestType === "deletion"
                  ? "bg-surface-container-lowest ring-2 ring-primary/40"
                  : "bg-surface-container-low hover:bg-surface-container-lowest"
              }`}>
                <input
                  type="radio"
                  name="requestType"
                  value="deletion"
                  checked={requestType === "deletion"}
                  onChange={() => setRequestType("deletion")}
                  className="mt-1 accent-[#17341d]"
                />
                <div>
                  <p className="font-semibold text-primary text-sm">Delete my data</p>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Permanently anonymize or remove all personal data we hold about
                    you. Financial records may be retained in anonymized form as
                    required by law.
                  </p>
                </div>
              </label>
            </fieldset>

            {error && <p className="text-error text-sm">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full primary-gradient text-on-primary px-10 py-4 rounded-xl font-heading font-bold text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>

            <p className="text-xs text-center text-on-surface-variant/60">
              For questions about your data, contact{" "}
              <a href="mailto:hello@bookwithsheilla.com" className="underline">
                hello@bookwithsheilla.com
              </a>
            </p>
          </form>
        )}
      </div>
    </>
  );
}
