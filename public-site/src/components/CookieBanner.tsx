"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookie_consent_dismissed";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-xl rounded-xl bg-[#17341d] p-5 shadow-2xl">
        <p className="text-sm leading-relaxed text-white/90">
          This website uses only essential cookies for basic functionality (session
          management). We do not use marketing or tracking cookies.{" "}
          <Link href="/privacy" className="underline text-[#fe932c] hover:text-[#fe932c]/80">
            Privacy Policy
          </Link>
        </p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={dismiss}
            className="rounded-lg bg-white/15 px-5 py-2 text-sm font-semibold text-white hover:bg-white/25 transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
