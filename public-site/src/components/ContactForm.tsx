"use client";

import { useState, type FormEvent } from "react";
import { apiFetch } from "@/lib/api";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    destination: "",
    vision: "",
    privacyConsent: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const nameParts = formData.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || firstName;
      await apiFetch("/inquiries", {
        method: "POST",
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: formData.email,
          message: [
            formData.destination && `Preferred destination: ${formData.destination}`,
            formData.vision,
          ].filter(Boolean).join("\n\n"),
          privacy_consent: true,
        }),
      });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-on-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-heading font-bold text-primary mb-3">
          Inquiry Received
        </h3>
        <p className="text-on-surface-variant max-w-sm">
          Thank you, {formData.fullName}. A member of our team will be in touch
          within 24 hours to begin shaping your journey.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Full Name */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-body uppercase tracking-widest text-on-surface-variant">
            Full Name
          </label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fullName: e.target.value }))
            }
            placeholder="Jane Wanjiru"
            className="bg-surface-container-highest rounded-xl p-4 focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant text-on-surface border-none outline-none"
          />
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-body uppercase tracking-widest text-on-surface-variant">
            Email Address
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="jane@example.com"
            className="bg-surface-container-highest rounded-xl p-4 focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant text-on-surface border-none outline-none"
          />
        </div>
      </div>

      {/* Preferred Destination */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-body uppercase tracking-widest text-on-surface-variant">
          Preferred Destination
        </label>
        <input
          type="text"
          value={formData.destination}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, destination: e.target.value }))
          }
          placeholder="e.g. Maasai Mara, Serengeti, Okavango Delta"
          className="bg-surface-container-highest rounded-xl p-4 focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant text-on-surface border-none outline-none"
        />
      </div>

      {/* Your Vision */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-body uppercase tracking-widest text-on-surface-variant">
          Your Vision
        </label>
        <textarea
          rows={5}
          value={formData.vision}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, vision: e.target.value }))
          }
          placeholder="Tell us about the experience you're dreaming of..."
          className="bg-surface-container-highest rounded-xl p-4 focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant text-on-surface border-none outline-none resize-none"
        />
      </div>

      {/* Privacy consent */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          required
          checked={formData.privacyConsent}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, privacyConsent: e.target.checked }))
          }
          className="mt-1 w-4 h-4 accent-[#17341d] rounded"
        />
        <span className="text-sm text-on-surface-variant leading-relaxed">
          I agree to the processing of my personal data as described in the{" "}
          <a href="/privacy" className="text-primary underline">Privacy Policy</a>. *
        </span>
      </label>

      {error && (
        <p className="text-error text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting || !formData.privacyConsent}
        className="primary-gradient text-on-primary px-10 py-4 rounded-xl font-heading font-bold text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Submit Inquiry"}
      </button>
    </form>
  );
}
