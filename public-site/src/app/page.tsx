import Image from "next/image";
import Link from "next/link";
import HeroSearch from "@/components/HeroSearch";
import FeaturedTours from "@/components/FeaturedTours";
import CategoryChips from "@/components/CategoryChips";
import DestinationsPreview from "@/components/DestinationsPreview";
import CTABanner from "@/components/CTABanner";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[520px] md:h-screen md:min-h-[800px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-poster.jpg"
            alt="Wildlife on the Maasai Mara plains"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Sunset overlay: base darken for legibility + warm glow rising from the horizon */}
          <div className="absolute inset-0 bg-black/40 md:bg-black/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#5a1f0a]/75 via-[#b5451b]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#e8762a]/15" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <span className="hidden sm:inline-block text-white font-body uppercase tracking-widest mb-4 md:mb-6 opacity-90 text-xs sm:text-sm">
              Experience the Untamed
            </span>
            <h1 className="text-white text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-heading leading-tight mb-6 md:mb-12">
              Where the{" "}
              <span className="text-safari-amber-400">Wild</span>{" "}
              Awakens
            </h1>
          </div>
          {/* Floating Booking Widget */}
          <HeroSearch />
        </div>
      </section>

      {/* Category chips */}
      <CategoryChips />

      {/* Curated Expeditions */}
      <section className="py-10 md:py-24 bg-surface px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-20 gap-6 md:gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-heading text-primary mb-4 md:mb-6">
                Curated Expeditions
              </h2>
              <p className="text-base md:text-lg text-on-surface-variant font-body">
                Not just travels, but narratives. Each package is designed to
                immerse you in the quiet grandeur of the African wilderness.
              </p>
            </div>
            <Link
              href="/tours"
              className="text-secondary font-heading border-b border-secondary pb-1 flex items-center gap-2 group"
            >
              View All Collections
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
          </div>

          <FeaturedTours />
        </div>
      </section>

      {/* Storied Destinations */}
      <DestinationsPreview />

      {/* The Curator's Touch */}
      <section className="py-10 md:py-24 bg-surface-container-low overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
            <div className="relative z-10">
              <span className="text-secondary font-body uppercase tracking-widest block mb-3 md:mb-4 text-xs sm:text-sm">
                The Curator&apos;s Touch
              </span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading text-primary mb-5 md:mb-8 leading-tight">
                Quiet Luxury in the Heart of the Wild
              </h2>
              <div className="space-y-4 md:space-y-6 text-on-surface-variant text-base md:text-lg leading-relaxed">
                <p>
                  We believe travel is an art form. Our curators don&apos;t just
                  book rooms; they architect moments that linger long after the
                  dust has settled.
                </p>
                <p>
                  From private candle-lit dinners under the canopy of an ancient
                  Baobab to tracking the elusive leopard with the
                  continent&apos;s finest guides, we provide access to the
                  inaccessible.
                </p>
              </div>
              <div className="mt-8 md:mt-12 flex flex-col gap-4 md:gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-white shrink-0">
                    <svg
                      className="w-6 h-6"
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
                  </div>
                  <div>
                    <h5 className="font-bold text-primary">
                      Certified Ethical Guiding
                    </h5>
                    <p className="text-sm text-on-surface-variant">
                      Supporting conservation through tourism.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-white shrink-0">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-bold text-primary">
                      Seamless Logistical Support
                    </h5>
                    <p className="text-sm text-on-surface-variant">
                      Private transfers and 24/7 concierge.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Asymmetric Image Layout */}
              <div className="relative aspect-[4/5] rounded-md overflow-hidden shadow-none md:shadow-2xl z-20">
                <Image
                  src="https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&q=80"
                  alt="Interior of a luxury safari tent with view of plains"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-2/3 aspect-square rounded-md overflow-hidden shadow-xl z-30 border-8 border-surface-container-low hidden md:block">
                <Image
                  src="https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=600&q=80"
                  alt="Close up of a lioness in the grass"
                  fill
                  className="object-cover"
                  sizes="33vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10 md:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-heading text-primary">
              Echoes from the Savannah
            </h2>
            <p className="text-on-surface-variant mt-3 md:mt-4">
              Voices of those who journeyed with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Testimonial 1 */}
            <div className="bg-surface-container-lowest p-6 md:p-10 rounded-md relative">
              <svg
                className="w-10 h-10 text-tertiary-container absolute -top-4 left-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-on-surface leading-relaxed mb-6 md:mb-8 font-heading">
                &ldquo;Beyond any expectation. The level of detail in our
                Tanzanian itinerary made us feel like we were the only explorers
                on the continent.&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-dim overflow-hidden relative">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&q=80"
                    alt="Julian Thorne"
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <h6 className="font-bold text-primary">Julian Thorne</h6>
                  <p className="text-xs font-body uppercase text-on-surface-variant tracking-widest">
                    London, UK
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-surface-container-lowest p-6 md:p-10 rounded-md relative">
              <svg
                className="w-10 h-10 text-tertiary-container absolute -top-4 left-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-on-surface leading-relaxed mb-6 md:mb-8 font-heading">
                &ldquo;The conservation focus was what drew us to Book With
                Sheilla. Seeing the impact of our visit firsthand was truly
                life-changing.&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-dim overflow-hidden relative">
                  <Image
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&q=80"
                    alt="Sarah Jenkins"
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <h6 className="font-bold text-primary">Sarah Jenkins</h6>
                  <p className="text-xs font-body uppercase text-on-surface-variant tracking-widest">
                    San Francisco, USA
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-surface-container-lowest p-6 md:p-10 rounded-md relative">
              <svg
                className="w-10 h-10 text-tertiary-container absolute -top-4 left-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-on-surface leading-relaxed mb-6 md:mb-8 font-heading">
                &ldquo;Absolute perfection. The Botswana private camp was the
                most peaceful place I have ever experienced. A masterpiece of
                curation.&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-dim overflow-hidden relative">
                  <Image
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&q=80"
                    alt="Markus Weber"
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <h6 className="font-bold text-primary">Markus Weber</h6>
                  <p className="text-xs font-body uppercase text-on-surface-variant tracking-widest">
                    Berlin, Germany
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <CTABanner />
    </>
  );
}
