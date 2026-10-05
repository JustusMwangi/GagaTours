import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Story | Book With Sheilla",
  description:
    "Discover the story behind Book With Sheilla — curated safari and tour experiences rooted in quiet luxury, ethical guiding, and a deep love for Africa's wild heart.",
};

export default function OurStoryPage() {
  return (
    <>
      {/* Hero Section: Editorial Intro */}
      <section className="pt-32 px-6 lg:px-8 max-w-7xl mx-auto mb-24 lg:mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7">
            <span className="font-body text-sm uppercase tracking-[0.2em] text-secondary mb-6 block">
              Our Genesis
            </span>
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl leading-tight text-primary">
              Quiet Luxury <br />
              <span className="font-normal">in the</span> Heart <br />
              <span className="font-normal text-secondary">
                of the
              </span>{" "}
              Wild.
            </h1>
          </div>
          <div className="lg:col-span-5 pb-4">
            <p className="text-xl leading-relaxed text-on-surface-variant font-light max-w-md">
              We believe true luxury isn&apos;t found in gold faucets, but in
              the silence of a savanna dawn and the profound connection to
              Africa&apos;s untouched wilderness.
            </p>
          </div>
        </div>
      </section>

      {/* The Curator: Asymmetric Image & Text Block */}
      <section className="mb-32 lg:mb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
            {/* Images */}
            <div className="col-span-1 lg:col-span-8 relative">
              <div className="aspect-[16/9] rounded-xl overflow-hidden bg-surface-container shadow-2xl relative">
                <Image
                  src="https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1200&q=80"
                  alt="Luxury safari lodge overlooking the African plains at golden hour"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>
              <div className="absolute -bottom-12 -right-12 hidden lg:block w-72 h-96 rounded-xl overflow-hidden shadow-2xl border-8 border-surface">
                <Image
                  src="https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=600&q=80"
                  alt="Curated travel accessories and binoculars on a safari journal"
                  fill
                  className="object-cover"
                  sizes="288px"
                />
              </div>
            </div>

            {/* Bio Text */}
            <div className="col-span-1 lg:col-span-4 lg:pl-6 flex flex-col justify-center mt-16 lg:mt-0">
              <h2 className="font-heading text-4xl text-primary mb-8">
                The Curator
              </h2>
              <div className="space-y-6 text-on-surface-variant leading-relaxed">
                <p>
                  Founded by Sheilla, Book With Sheilla was born from a lifetime
                  of deep immersion in Africa&apos;s most breathtaking
                  landscapes. She sought to bridge the gap between uncompromising
                  comfort and raw, authentic adventure.
                </p>
                <p>
                  With a background in luxury hospitality and an unwavering
                  passion for conservation, Sheilla curates experiences that
                  honor the earth while pampering the soul.
                </p>
                <Link
                  href="/journal"
                  className="inline-flex items-center gap-2 font-heading text-secondary hover:text-primary transition-colors border-b border-secondary/30 pb-1"
                >
                  Read Sheilla&apos;s Letter
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
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Core Philosophy */}
      <section className="bg-surface-container-low py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="font-heading text-4xl md:text-5xl text-primary mb-4">
              Our Core Philosophy
            </h2>
            <p className="font-body uppercase tracking-widest text-secondary text-sm">
              Defined by Intent, Guided by Respect
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Ethical Guiding */}
            <div className="bg-surface-container-lowest p-10 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-primary-container/10 flex items-center justify-center rounded-lg mb-8 group-hover:bg-primary-container/20 transition-colors">
                <svg
                  className="w-6 h-6 text-primary"
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
              </div>
              <h3 className="font-heading text-2xl text-primary mb-4">
                Ethical Guiding
              </h3>
              <p className="text-on-surface-variant leading-relaxed">
                We don&apos;t just show you Africa; we teach you how to see it.
                Our guides are local experts, compensated fairly and deeply
                committed to the sanctity of their homelands.
              </p>
            </div>

            {/* Conservation First - Dark elevated card */}
            <div className="primary-gradient text-on-primary p-10 rounded-xl shadow-xl transform md:-translate-y-8">
              <div className="w-12 h-12 bg-white/10 flex items-center justify-center rounded-lg mb-8">
                <svg
                  className="w-6 h-6 text-on-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="font-heading text-2xl mb-4">
                Conservation First
              </h3>
              <p className="text-on-primary/80 leading-relaxed">
                Every journey booked contributes a portion of its value to
                wildlife conservation and land restoration projects across our
                destination regions. We leave every trail better than we found
                it.
              </p>
            </div>

            {/* Quiet Luxury */}
            <div className="bg-surface-container-lowest p-10 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center rounded-lg mb-8 group-hover:bg-secondary/20 transition-colors">
                <svg
                  className="w-6 h-6 text-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="font-heading text-2xl text-primary mb-4">
                Quiet Luxury
              </h3>
              <p className="text-on-surface-variant leading-relaxed">
                No logos, no noise. We focus on the texture of hand-woven
                linens, the warmth of a bush sundowner, and the absolute privacy
                of your surroundings in Africa&apos;s finest lodges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* A Commitment to the Unseen */}
      <section className="py-24 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-center">
            {/* Tall Image with Impact Overlay */}
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 rounded-xl overflow-hidden aspect-[4/5] shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=800&q=80"
                  alt="Wildlife conservation efforts in the African wilderness"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute bottom-6 left-6 bg-glass p-6 rounded-lg max-w-xs">
                  <span className="font-body text-xs uppercase tracking-widest text-secondary block mb-2">
                    Impact Story
                  </span>
                  <p className="text-sm font-heading text-on-surface">
                    In 2025, our tours contributed to the protection of over
                    10,000 acres of critical wildlife habitat across East Africa.
                  </p>
                </div>
              </div>
              {/* Background decorative blur */}
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-0" />
            </div>

            {/* Numbered Commitment List */}
            <div className="lg:w-1/2">
              <h2 className="font-heading text-4xl md:text-5xl text-primary mb-10 leading-tight">
                A Commitment to <br />
                <span className="font-normal">the Unseen.</span>
              </h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <span className="text-4xl font-heading text-outline-variant">
                    01
                  </span>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-on-surface">
                      Sustainable Logistics
                    </h4>
                    <p className="text-on-surface-variant leading-relaxed">
                      We partner with eco-certified lodges and utilize low-impact
                      transport wherever possible, ensuring our carbon footprint
                      stays as light as a whisper across the plains.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <span className="text-4xl font-heading text-outline-variant">
                    02
                  </span>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-on-surface">
                      Community Empowerment
                    </h4>
                    <p className="text-on-surface-variant leading-relaxed">
                      By partnering exclusively with local family-owned lodges
                      and community conservancies, we ensure the economic
                      benefits of tourism stay where they are needed most.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <span className="text-4xl font-heading text-outline-variant">
                    03
                  </span>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-on-surface">
                      Radical Transparency
                    </h4>
                    <p className="text-on-surface-variant leading-relaxed">
                      Our guests receive a full impact summary at the end of
                      every expedition, detailing exactly how their journey
                      contributed to conservation and local communities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join the Inner Circle: Newsletter CTA */}
      <section className="max-w-5xl mx-auto px-6 lg:px-8 mb-24 lg:mb-32">
        <div className="bg-surface-container rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-heading text-4xl md:text-5xl text-primary mb-6">
              Join the Inner Circle
            </h2>
            <p className="text-on-surface-variant max-w-xl mx-auto mb-10 text-lg leading-relaxed">
              Subscribe to our monthly digest of rare destination insights,
              conservation updates, and exclusive safari experiences curated by
              Sheilla.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Email Address"
                className="flex-grow bg-surface-container-lowest border-none rounded-lg px-6 py-3.5 text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none placeholder:text-outline"
              />
              <button
                type="submit"
                className="primary-gradient text-on-primary px-8 py-3.5 rounded-lg font-heading font-bold hover:opacity-90 transition-opacity"
              >
                Subscribe
              </button>
            </form>
          </div>
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/felt.png')]" />
        </div>
      </section>
    </>
  );
}
