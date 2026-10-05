"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "already" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }
    apiFetch<{ message: string }>(`/unsubscribe/${token}`)
      .then((data) => {
        if (data.message?.includes("already")) {
          setStatus("already");
        } else {
          setStatus("success");
        }
      })
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="pt-32 pb-24 px-6 max-w-lg mx-auto text-center">
      {status === "loading" && (
        <div className="inline-block w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      )}

      {status === "success" && (
        <>
          <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-on-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-heading font-bold text-primary mb-4">
            Unsubscribed
          </h1>
          <p className="text-on-surface-variant leading-relaxed mb-8">
            You have been successfully unsubscribed from our newsletter.
            You will no longer receive emails from us.
          </p>
          <Link
            href="/"
            className="text-sm text-primary underline hover:text-primary/80"
          >
            Return to homepage
          </Link>
        </>
      )}

      {status === "already" && (
        <>
          <h1 className="text-3xl font-heading font-bold text-primary mb-4">
            Already Unsubscribed
          </h1>
          <p className="text-on-surface-variant leading-relaxed mb-8">
            This email address is already unsubscribed from our newsletter.
          </p>
          <Link
            href="/"
            className="text-sm text-primary underline hover:text-primary/80"
          >
            Return to homepage
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <h1 className="text-3xl font-heading font-bold text-primary mb-4">
            Invalid Link
          </h1>
          <p className="text-on-surface-variant leading-relaxed mb-8">
            This unsubscribe link is invalid or has expired. If you&apos;d like to
            unsubscribe, please contact us at{" "}
            <a href="mailto:hello@bookwithsheilla.com" className="text-primary underline">
              hello@bookwithsheilla.com
            </a>.
          </p>
          <Link
            href="/"
            className="text-sm text-primary underline hover:text-primary/80"
          >
            Return to homepage
          </Link>
        </>
      )}
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="pt-32 pb-24 px-6 max-w-lg mx-auto text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
