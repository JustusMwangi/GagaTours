import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import FaqAccordion, { type FaqSection } from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQs | Book With Sheilla",
  description:
    "Everything you need to know about booking a safari or tour with Book With Sheilla. From logistics and cancellations to packing tips and our ethical travel commitments.",
};

const sidebarLinks = [
  { id: "tours", label: "Our Tours" },
  { id: "cancellations", label: "Cancellations" },
  { id: "packing", label: "What to Pack" },
  { id: "ethical", label: "Ethical Travel" },
];

const faqSections: FaqSection[] = [
  {
    id: "tours",
    title: "Safari Logistics",
    items: [
      {
        question: "What defines a curated safari experience?",
        answer:
          "Our safaris go beyond standard game drives. Each journey is limited to small groups and led by expert local guides\u2014ranging from wildlife conservationists to Maasai cultural ambassadors. We prioritise deep immersion over rapid transit, ensuring you spend meaningful time in each location rather than rushing between parks.",
      },
      {
        question: "Are international flights included?",
        answer:
          "To allow our guests the flexibility of using miles or extending their travel independently, international airfare is not included. However, all regional transfers, private charters, and internal flights within Kenya mentioned in the itinerary are fully managed and included in your booking.",
      },
      {
        question: "How many guests are on each safari?",
        answer:
          "We keep our groups intentionally small\u2014typically between 2 and 8 guests. This ensures a personal, unhurried experience at every camp and during every game drive. Private departures for families or couples are also available upon request.",
      },
      {
        question: "What accommodation standards can I expect?",
        answer:
          "We partner exclusively with lodges and tented camps that meet our rigorous standards for comfort, sustainability, and location. From luxury tented camps in the Mara to boutique lodges on the shores of Lake Naivasha, every property is hand-selected by Sheilla herself.",
      },
    ],
  },
  {
    id: "cancellations",
    title: "Flexibility & Policy",
    items: [
      {
        question: "What is your cancellation grace period?",
        answer:
          "We offer a 48-hour grace period after booking where your deposit is 100% refundable. Beyond that, cancellations made up to 90 days before departure are eligible for a 75% credit toward a future safari. Cancellations within 90 days are assessed on a case-by-case basis.",
      },
      {
        question: "Do you require travel insurance?",
        answer:
          "Yes. For the safety of all guests and to protect your investment, comprehensive travel insurance\u2014including medical evacuation coverage\u2014is mandatory for all Book With Sheilla journeys. We can provide recommendations for trusted providers upon request.",
      },
      {
        question: "Can I modify my dates after booking?",
        answer:
          "We understand plans can shift. Date changes made more than 60 days before departure are accommodated free of charge, subject to availability. Changes within 60 days may incur a rebooking fee depending on lodge and camp policies.",
      },
    ],
  },
  {
    id: "packing",
    title: "The Explorer\u2019s Wardrobe",
    items: [
      {
        question: "Is there a dress code for dinners?",
        answer:
          "We embrace \u201cSafari Chic\u201d\u2014elegant yet practical. While formal attire is never required, we recommend lightweight linens and smart-casual wear for evening meals at our partner lodges and camps. Neutral, earth-toned clothing is best for game drives.",
      },
      {
        question: "What specialised gear should I bring?",
        answer:
          "We provide high-quality binoculars and field guides. We recommend guests bring well-broken-in walking shoes, sunscreen, a wide-brimmed hat, and a quality camera. A detailed, destination-specific packing list will be sent to you 60 days before your departure.",
      },
      {
        question: "Are there luggage restrictions for bush flights?",
        answer:
          "Yes. Light aircraft transfers in Kenya typically have a 15kg soft-bag luggage limit per person. We will brief you on exact requirements well in advance and recommend the best soft-sided duffel bags for safari travel.",
      },
    ],
  },
  {
    id: "ethical",
    title: "Our Ethical Compass",
    items: [
      {
        question: "How do you support local communities?",
        answer:
          "A percentage of every booking fee goes directly to local conservancies and community development projects. We exclusively employ local guides and partner with community-owned lodges to ensure the economic benefits of tourism remain within the communities we visit.",
      },
      {
        question: "What is your carbon offset strategy?",
        answer:
          "All regional travel within our safaris is carbon-offset. We invest in verified reforestation projects in the regions we visit, including tree-planting initiatives in the Mau Forest and along the Great Rift Valley, effectively offsetting 120% of our ground and regional air transport emissions.",
      },
      {
        question: "How do you ensure ethical wildlife encounters?",
        answer:
          "We strictly adhere to park regulations and responsible viewing distances. We never support activities that exploit or disturb wildlife. Our guides are trained in ethical safari practices, and we only work with camps and conservancies that prioritise animal welfare and habitat preservation.",
      },
    ],
  },
];

export default function FaqsPage() {
  return (
    <div className="pt-32 pb-24">
      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 lg:px-8 mb-20 text-center md:text-left">
        <span className="font-body text-sm uppercase tracking-[0.2em] text-secondary mb-4 block">
          Curated Knowledge
        </span>
        <h1 className="font-heading text-5xl md:text-7xl font-bold text-primary mb-6 leading-tight">
          Frequently Asked <br />
          <span className="font-normal">Questions</span>
        </h1>
        <p className="max-w-2xl text-on-surface-variant text-lg leading-relaxed">
          Everything you need to know about embarking on a safari with Book With
          Sheilla. From logistics to our ethical commitment.
        </p>
      </header>

      {/* FAQ Content Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Sidebar Navigation (Desktop) */}
        <aside className="lg:col-span-3 hidden lg:block">
          <div className="sticky top-32">
            <nav className="space-y-6">
              {sidebarLinks.map((link, idx) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className={`flex items-center gap-4 group transition-colors ${
                    idx === 0
                      ? "text-primary font-bold"
                      : "text-on-surface-variant hover:text-primary"
                  }`}
                >
                  <span
                    className={`h-px transition-all ${
                      idx === 0
                        ? "w-8 bg-secondary"
                        : "w-4 bg-outline-variant group-hover:w-8 group-hover:bg-secondary"
                    }`}
                  />
                  <span className="font-body uppercase tracking-widest text-xs">
                    {link.label}
                  </span>
                </a>
              ))}
            </nav>

            {/* Still Curious Card */}
            <div className="mt-20 p-8 bg-surface-container-low rounded-xl">
              <h4 className="font-heading text-xl mb-4 text-primary">
                Still Curious?
              </h4>
              <p className="text-sm text-on-surface-variant mb-6">
                Sheilla and her team are available for personalised inquiries
                about your safari.
              </p>
              <Link
                href="/contact"
                className="text-secondary font-heading border-b border-secondary pb-1 hover:text-primary hover:border-primary transition-all"
              >
                Speak with Sheilla
              </Link>
            </div>
          </div>
        </aside>

        {/* FAQ Accordions + Interstitial Image */}
        <div className="lg:col-span-9">
          {/* Render first two sections, then image break, then remaining */}
          <FaqAccordion sections={faqSections.slice(0, 2)} />

          {/* Mid-page Image Break */}
          <div className="relative py-12 my-24">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-8 h-[400px] rounded-xl overflow-hidden shadow-2xl relative">
                <Image
                  src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80"
                  alt="Wildebeest crossing the Mara river during the Great Migration"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
              </div>
              <div className="col-span-12 md:col-span-4 self-center md:-ml-12 z-10 mt-4 md:mt-0">
                <div className="bg-glass p-8 rounded-xl shadow-xl border border-white/20">
                  <h3 className="font-heading text-2xl text-primary mb-4">
                    Preparation is part of the journey.
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Our team provides a bespoke packing guide tailored to your
                    specific safari itinerary 60 days before you depart.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <FaqAccordion sections={faqSections.slice(2)} />
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="mt-32 max-w-5xl mx-auto px-6 lg:px-8">
        <div className="primary-gradient text-on-primary p-12 md:p-16 rounded-3xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container rounded-full -mr-32 -mt-32 opacity-20" />
          <h2 className="font-heading text-4xl md:text-5xl mb-8 leading-tight relative z-10">
            Can&apos;t find what you&apos;re <br />
            <span className="font-normal">looking for?</span>
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-6 relative z-10">
            <Link
              href="mailto:hello@bookwithsheilla.com"
              className="bg-secondary text-white px-10 py-4 rounded-xl font-body text-sm uppercase tracking-widest hover:brightness-110 transition-all"
            >
              Email Us
            </Link>
            <Link
              href="/contact"
              className="bg-transparent border border-on-primary/30 text-on-primary px-10 py-4 rounded-xl font-body text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Schedule a Call
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
