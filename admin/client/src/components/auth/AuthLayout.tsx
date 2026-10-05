import type { ReactNode } from 'react';
import { Link } from 'react-router';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen lg:flex lg:flex-row">
      {/* Left branding panel */}
      <div className="relative overflow-hidden bg-[#1c1917] text-white p-8 lg:p-12 lg:w-[520px] lg:shrink-0 lg:sticky lg:top-0 lg:h-screen lg:flex lg:flex-col lg:justify-between">
        {/* Decorative gradient mesh — top right corner */}
        <div
          className="pointer-events-none absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full opacity-20"
          style={{
            background:
              'radial-gradient(circle at center, #0f766e 0%, transparent 70%)',
          }}
        />
        {/* Secondary subtle blob — bottom left */}
        <div
          className="pointer-events-none absolute -bottom-40 -left-40 h-[360px] w-[360px] rounded-full opacity-[0.07]"
          style={{
            background:
              'radial-gradient(circle at center, #0f766e 0%, transparent 70%)',
          }}
        />

        {/* Top content */}
        <div className="relative z-10 space-y-10">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Book With Sheilla"
              className="h-11 w-11 rounded-full object-cover ring-1 ring-white/15"
            />
            <span className="font-display text-2xl font-bold text-white">
              Book With Sheilla
            </span>
          </Link>

          {/* Tagline */}
          <div className="space-y-4 lg:pt-4">
            <h1 className="font-display text-3xl lg:text-4xl font-bold leading-tight text-white">
              Run the journey,
              <br />
              not the paperwork.
            </h1>
            <p className="text-base leading-relaxed text-stone-400 max-w-sm">
              Manage tours, bookings, inquiries and customers — all in one place.
            </p>
          </div>
        </div>

        {/* Feature highlights -- desktop only */}
        <div className="relative z-10 hidden lg:flex flex-col gap-5 pt-12">
          <div className="flex items-center gap-3 text-stone-400">
            <span className="block h-1.5 w-1.5 shrink-0 rounded-full bg-[#0f766e]" />
            <span className="text-sm">Tours, bookings and inquiries</span>
          </div>
          <div className="flex items-center gap-3 text-stone-400">
            <span className="block h-1.5 w-1.5 shrink-0 rounded-full bg-[#0f766e]" />
            <span className="text-sm">Role-based access control</span>
          </div>
          <div className="flex items-center gap-3 text-stone-400">
            <span className="block h-1.5 w-1.5 shrink-0 rounded-full bg-[#0f766e]" />
            <span className="text-sm">Audit logging and notifications</span>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="relative z-10 flex flex-1 items-start lg:items-center justify-center px-4 pb-10 pt-8 lg:py-12 bg-background">
        {/* Mobile: card with shadow overlaying the dark panel; Desktop: clean, no shadow */}
        <div className="w-full max-w-md -mt-6 lg:mt-0 bg-white p-8 rounded-2xl shadow-lg lg:shadow-none lg:bg-transparent lg:rounded-none">
          {children}
        </div>
      </div>
    </div>
  );
}
