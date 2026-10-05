import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Journal | Book With Sheilla",
  description:
    "Curated stories from the edge of the wilderness. From technical wildlife photography guides to the quiet philosophy of conservation.",
};

const featuredArticle = {
  slug: "capturing-golden-hour-serengeti",
  category: "Photography Masterclass",
  title: "Capturing the Golden Hour in the Serengeti",
  excerpt:
    "Mastering light in the vast African plains requires more than just technical skill -- it requires an intimate understanding of the landscape's rhythm.",
  image:
    "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80",
  imageAlt: "Close up of a majestic lioness in golden grass at sunset",
};

const articles = [
  {
    slug: "ancestral-wisdom-week-with-maasai",
    category: "Culture",
    title: "Ancestral Wisdom: A Week with the Maasai",
    excerpt:
      "Discover the delicate balance between ancient traditions and modern conservation efforts in the heart of the Mara.",
    readTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1504432842672-1a79f78e4084?w=600&q=80",
    imageAlt: "Traditional Maasai warrior standing in the sunset",
  },
  {
    slug: "silent-guardians-congo-basin",
    category: "Conservation",
    title: "The Silent Guardians of the Congo Basin",
    excerpt:
      "An in-depth look at the front lines of forest elephant protection and the rangers who risk it all.",
    readTime: "12 min read",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80",
    imageAlt: "Ethereal mist rising from a deep green rainforest",
    elevated: true,
  },
  {
    slug: "art-of-disconnecting-luxury-safari",
    category: "Travel Tips",
    title: "The Art of Disconnecting: A Luxury Safari Guide",
    excerpt:
      "How to find true solitude in the world's most remote high-end wilderness retreats.",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=600&q=80",
    imageAlt: "Luxury safari lodge interior with open view to wilderness",
  },
];

const archiveCategories = [
  {
    title: "Sustainability: Beyond the Buzzword",
    description:
      "Exploring how high-end travel is pivoting to regenerative models that protect local ecosystems for generations to come.",
    type: "text" as const,
  },
  {
    title: "The Horizon Series",
    image:
      "https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=600&q=80",
    imageAlt: "Silhouetted giraffes walking against a vibrant orange sunrise",
    type: "image" as const,
  },
  {
    title: "Tactile Nature",
    image:
      "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&q=80",
    imageAlt: "Close up of elephant skin showing detailed grey textures",
    type: "image" as const,
  },
];

export default function JournalPage() {
  return (
    <>
      {/* Hero Editorial */}
      <header className="pt-32 pb-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8">
          <div className="max-w-3xl">
            <span className="text-secondary font-body uppercase tracking-[0.2em] text-sm mb-4 block">
              Field Notes &amp; Observations
            </span>
            <h1 className="text-6xl md:text-8xl font-heading font-bold text-primary leading-tight">
              The Journal
            </h1>
          </div>
          <div className="max-w-md pb-4 border-l-2 border-secondary/20 pl-8">
            <p className="text-on-surface-variant font-body leading-relaxed">
              Curated stories from the edge of the wilderness. From technical
              wildlife photography guides to the quiet philosophy of
              conservation.
            </p>
          </div>
        </div>
      </header>

      {/* Featured Article */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-32">
        <div className="relative grid grid-cols-1 md:grid-cols-12 gap-0 items-center">
          <div className="md:col-span-8 z-10">
            <div className="relative group overflow-hidden rounded-xl shadow-2xl">
              <div className="aspect-[16/9] relative">
                <Image
                  src={featuredArticle.image}
                  alt={featuredArticle.imageAlt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>
          <div className="md:col-span-5 md:-ml-24 z-20 mt-8 md:mt-0">
            <div className="bg-surface-container-low p-12 rounded-xl backdrop-blur-xl shadow-xl">
              <span className="text-secondary font-body text-xs uppercase tracking-widest mb-4 block">
                {featuredArticle.category}
              </span>
              <h2 className="text-4xl font-heading font-bold text-primary mb-6 leading-tight">
                {featuredArticle.title}
              </h2>
              <p className="text-on-surface-variant mb-8 line-clamp-3">
                {featuredArticle.excerpt}
              </p>
              <Link
                href={`/journal/${featuredArticle.slug}`}
                className="inline-flex items-center text-primary font-heading font-bold group"
              >
                Read Article
                <svg
                  className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-2"
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
          </div>
        </div>
      </section>

      {/* Article Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {articles.map((article) => (
            <article
              key={article.slug}
              className={`flex flex-col group ${article.elevated ? "md:-mt-12" : ""}`}
            >
              <Link
                href={`/journal/${article.slug}`}
                className="overflow-hidden rounded-xl mb-8 bg-surface-container-low block"
              >
                <div className="aspect-[4/5] relative">
                  <Image
                    src={article.image}
                    alt={article.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </Link>
              <span className="text-secondary font-body text-xs uppercase tracking-widest mb-3">
                {article.category}
              </span>
              <h3 className="text-2xl font-heading font-bold text-primary mb-4 leading-snug">
                {article.title}
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                {article.excerpt}
              </p>
              <div className="mt-auto pt-4 border-t border-outline-variant/30 flex justify-between items-center">
                <span className="text-xs text-on-surface-variant font-body uppercase">
                  {article.readTime}
                </span>
                <Link href={`/journal/${article.slug}`}>
                  <svg
                    className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 17L17 7M17 7H7M17 7v10"
                    />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="mt-32 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-surface-container-low rounded-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none flex items-center justify-center">
            <svg
              className="w-64 h-64 text-primary rotate-12"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 2H6c-1.206 0-3 .799-3 3v14c0 2.201 1.794 3 3 3h15v-2H6.012C5.55 19.988 5 19.806 5 19s.55-.988 1.012-1H21V4c0-1.103-.897-2-2-2zm0 14H5V5c0-.806.55-.988 1-1h13v12z" />
            </svg>
          </div>
          <div className="p-16 relative z-10 text-center">
            <h2 className="text-4xl font-heading font-bold text-primary mb-4">
              Join the Inner Circle
            </h2>
            <p className="text-on-surface-variant max-w-xl mx-auto mb-10 font-body">
              Receive monthly dispatches from the field, exclusive photography
              tips, and early access to curated expeditions.
            </p>
            <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-surface-container-highest border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition-all"
              />
              <button
                type="submit"
                className="bg-primary text-on-primary px-10 py-4 rounded-xl font-body font-bold hover:shadow-lg transition-all active:scale-95"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Archive Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-32 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Text Card */}
          <div className="md:col-span-2 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between min-h-[400px]">
            <div>
              <span className="text-secondary font-body text-xs uppercase tracking-widest mb-4 block">
                Archive Selection
              </span>
              <h3 className="text-3xl font-heading font-bold text-primary mb-4">
                {archiveCategories[0].title}
              </h3>
              <p className="text-on-surface-variant">
                {archiveCategories[0].description}
              </p>
            </div>
            <Link
              href="/journal"
              className="text-primary font-bold uppercase text-xs tracking-widest flex items-center group"
            >
              Explore Archive
              <svg
                className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
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

          {/* Image Cards */}
          {archiveCategories
            .filter((c) => c.type === "image")
            .map((card) => (
              <div
                key={card.title}
                className="md:col-span-1 rounded-xl overflow-hidden relative group min-h-[400px]"
              >
                <Image
                  src={card.image!}
                  alt={card.imageAlt!}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h4 className="text-white font-heading font-bold text-xl">
                    {card.title}
                  </h4>
                </div>
              </div>
            ))}
        </div>
      </section>
    </>
  );
}
