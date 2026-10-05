import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Book With Sheilla",
  description:
    "Get in touch with Book With Sheilla. Send an inquiry about your next curated safari or tour experience across Africa.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero Header */}
      <header className="pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <span className="inline-block text-secondary font-body text-sm uppercase tracking-[0.2em] mb-4">
              Get in Touch
            </span>
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary leading-tight tracking-tight">
              Begin your next <br />
              <span className="font-normal">curated odyssey.</span>
            </h1>
          </div>
          <div className="md:col-span-4 pb-2">
            <p className="text-on-surface-variant leading-relaxed text-lg">
              Whether you&apos;re seeking a remote wilderness retreat or a
              cultural deep-dive, our team is ready to architect your journey.
            </p>
          </div>
        </div>
      </header>

      {/* Contact Grid Content */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Inquiry Form */}
          <div className="lg:col-span-7 bg-surface-container-low p-10 md:p-16 rounded-xl">
            <h2 className="text-3xl font-heading font-bold text-primary mb-10">
              Send an Inquiry
            </h2>
            <ContactForm />
          </div>

          {/* Contact Sidebar */}
          <div className="lg:col-span-5 flex flex-col gap-12">
            {/* Quick Channels */}
            <div className="space-y-8">
              {/* Email */}
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-heading font-bold text-primary text-xl">
                    Email Us
                  </h4>
                  <p className="text-on-surface-variant mt-1">
                    hello@bookwithsheilla.com
                  </p>
                  <p className="text-on-surface-variant">
                    press@bookwithsheilla.com
                  </p>
                </div>
              </div>

              {/* WhatsApp & Text */}
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-heading font-bold text-primary text-xl">
                    WhatsApp &amp; Text
                  </h4>
                  <a
                    href="https://wa.me/254759982022"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-on-surface-variant mt-1 inline-block hover:text-primary transition-colors"
                  >
                    +254 759 982022
                  </a>
                  <p className="text-secondary font-medium mt-2 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-secondary mr-2" />
                    Available 24/7 for active guests
                  </p>
                </div>
              </div>

              {/* Physical Address */}
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-heading font-bold text-primary text-xl">
                    Our Office
                  </h4>
                  <p className="text-on-surface-variant mt-1">
                    By Appointment Only
                  </p>
                  <address className="text-on-surface-variant not-italic mt-2">
                    Westlands Business Park
                    <br />
                    Nairobi, 00100
                    <br />
                    Kenya
                  </address>
                </div>
              </div>
            </div>

            {/* Concierge Spotlight Card */}
            <div className="relative overflow-hidden rounded-xl bg-primary-container p-8 text-on-primary">
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-[10px] uppercase tracking-widest font-bold mb-6">
                  Concierge Spotlight
                </span>
                <div className="flex items-center gap-4 mb-6">
                  <Image
                    src="/sheilla-profile.jpg"
                    alt="Sheilla Jepkemboi, Lead Safari Curator"
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                  />
                  <div>
                    <p className="font-heading font-bold text-white text-lg leading-tight">
                      Sheilla Jepkemboi
                    </p>
                    <p className="text-xs uppercase tracking-wider opacity-70">
                      Lead Safari Curator
                    </p>
                  </div>
                </div>
                <p className="font-heading leading-relaxed text-white mb-6">
                  &ldquo;My role is to find the soul of a destination. When you
                  inquire, you aren&apos;t talking to a computer&mdash;you&apos;re
                  talking to a curator who has personally walked the paths we
                  recommend.&rdquo;
                </p>
                <Link
                  href="/our-story"
                  className="text-white font-body text-sm uppercase tracking-widest flex items-center hover:opacity-80 transition-opacity"
                >
                  Meet the Team
                  <svg
                    className="w-4 h-4 ml-2"
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
              {/* Abstract Background Texture */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="mt-24 mb-24 px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="relative">
          <div className="h-[500px] rounded-xl overflow-hidden grayscale contrast-125 opacity-90 relative">
            <Image
              src="https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=1920&q=80"
              alt="Aerial view of Nairobi cityscape"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-primary/10" />
          </div>
          {/* Floating Glass Tag */}
          <div className="absolute bottom-8 left-8 bg-glass p-6 rounded-xl shadow-2xl max-w-xs">
            <h3 className="font-heading font-bold text-primary mb-2">
              The Global Reach
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              While our roots are in Nairobi, our network spans across East
              Africa and beyond, with dedicated logistics teams in every key
              destination.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
