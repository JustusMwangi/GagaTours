import Link from "next/link";
import Container from "./Container";

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-primary text-on-primary">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, var(--safari-amber-300) 0px, transparent 1.5px), radial-gradient(circle at 70% 60%, var(--safari-amber-300) 0px, transparent 1.5px)",
            backgroundSize: "48px 48px, 32px 32px",
          }}
        />
      </div>
      <Container>
        <div className="relative py-16 md:py-24 flex flex-col items-center text-center">
          <span className="text-xs sm:text-sm uppercase tracking-widest text-safari-amber-300 mb-4">
            Begin the Journey
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight max-w-3xl">
            Ready to step into the{" "}
            <span className="text-safari-amber-400">wild</span>?
          </h2>
          <p className="mt-5 md:mt-6 max-w-xl text-base md:text-lg text-white/80">
            Tell us where you want to go and we&apos;ll handcraft an itinerary —
            no templates, no rush, just your story under African skies.
          </p>
          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md bg-safari-amber-400 text-safari-brown-900 font-body font-medium hover:bg-safari-amber-300 transition-colors"
            >
              Plan a Custom Safari
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md border border-white/30 text-white font-body font-medium hover:bg-white/10 transition-colors"
            >
              Browse All Tours
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
