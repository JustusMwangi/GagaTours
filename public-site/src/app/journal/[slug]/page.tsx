import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Whispers of the Okavango: A Dawn Symphony | Book With Sheilla",
  description:
    "An immersive journey through the Okavango Delta at dawn. Discover the rhythm of the wilderness as we explore by mokoro through papyrus-lined channels.",
};

const article = {
  breadcrumb: { region: "Botswana", category: "Field Notes" },
  title: "Whispers of the Okavango: A Dawn Symphony",
  author: {
    name: "Sheilla Nyamwaro",
    role: "Senior Curator",
    date: "Oct 14, 2024",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=96&q=80",
  },
  heroImage:
    "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=1920&q=80",
  heroImageAlt: "Aerial view of lush green wetlands with water channels",
  heroQuote:
    "The delta does not speak in volumes; it whispers in the ripple of a reed and the distant call of a fish eagle.",
  tags: ["Conservation", "Botswana", "Photography"],
};

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800&q=80",
    alt: "Close up of an elephant's textured trunk",
  },
  {
    src: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=80",
    alt: "Brightly colored kingfisher bird on a branch",
  },
];

const relatedArticles = [
  {
    slug: "solitude-of-high-peaks",
    category: "Alps",
    title: "The Solitude of the High Peaks",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
    imageAlt: "Snow-capped mountain range at dawn",
  },
  {
    slug: "yosemite-beyond-valley",
    category: "California",
    title: "Yosemite: Beyond the Valley",
    image:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&q=80",
    imageAlt: "Granite cliffs of Yosemite National Park",
  },
  {
    slug: "spirit-of-sacred-forest",
    category: "Bali",
    title: "The Spirit of the Sacred Forest",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
    imageAlt: "Tropical Balinese temple at sunset",
  },
];

export async function generateStaticParams() {
  return [
    { slug: "whispers-of-the-okavango" },
    { slug: "capturing-golden-hour-serengeti" },
    { slug: "ancestral-wisdom-week-with-maasai" },
    { slug: "silent-guardians-congo-basin" },
    { slug: "art-of-disconnecting-luxury-safari" },
  ];
}

export default async function JournalEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      {/* Hero Header */}
      <header className="pt-24 lg:pt-32 px-6 lg:px-0">
        <div className="max-w-[75ch] mx-auto mb-8">
          {/* Breadcrumb */}
          <span className="font-body text-secondary uppercase tracking-[0.2em] text-xs font-bold mb-4 block">
            {article.breadcrumb.category} / {article.breadcrumb.region}
          </span>

          {/* Title */}
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-primary leading-tight font-bold tracking-tight">
            {article.title}
          </h1>

          {/* Author Byline */}
          <div className="mt-8 flex items-center space-x-4 border-t border-outline-variant/20 pt-8">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-highest relative">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div>
              <p className="font-body text-sm font-bold text-on-surface">
                {article.author.name}
              </p>
              <p className="font-body text-xs text-on-surface-variant uppercase tracking-wider">
                {article.author.role} &bull; {article.author.date}
              </p>
            </div>
          </div>
        </div>

        {/* Full-width Hero Image */}
        <div className="relative h-[50vh] lg:h-[70vh] mb-20">
          <div className="absolute inset-0 bg-primary/10 z-10" />
          <Image
            src={article.heroImage}
            alt={article.heroImageAlt}
            fill
            className="object-cover"
            sizes="100vw"
            loading="eager"
          />
          {/* Glassmorphism Quote */}
          <div className="absolute bottom-12 left-6 lg:left-12 z-20 max-w-sm p-6 bg-surface-container-high/70 backdrop-blur-xl rounded-xl">
            <p className="font-heading text-primary text-lg leading-relaxed">
              &ldquo;{article.heroQuote}&rdquo;
            </p>
          </div>
        </div>
      </header>

      {/* Article Body */}
      <article className="max-w-[75ch] mx-auto px-6 lg:px-0 pb-24 space-y-12">
        {/* Opening Paragraph with Drop Cap */}
        <p className="text-xl md:text-2xl font-body text-on-surface-variant leading-relaxed font-light first-letter:text-7xl first-letter:font-heading first-letter:float-left first-letter:mr-4 first-letter:text-primary">
          The sun had not yet breached the horizon when we slipped the mokoro
          into the glassy skin of the channel. In the Okavango, silence is never
          truly empty. It is a dense, vibrating presence, woven from the
          microscopic clicking of insects and the rhythmic splash of a
          poler&apos;s wooden staff.
        </p>

        <p className="text-lg leading-relaxed text-on-surface">
          To explore this landscape is to participate in an ancient dialogue. We
          moved through narrow arteries of water, flanked by papyrus stands that
          towered twice our height. The air smelled of damp earth and wild
          jasmine -- a scent so specific it felt like a geographical marker. Our
          guide, Kaelo, pointed to a cluster of water lilies. &ldquo;They only
          open for the sun,&rdquo; he whispered, &ldquo;just like the heart of
          the delta.&rdquo;
        </p>

        {/* Pull Quote */}
        <div className="my-12 py-16 px-8 bg-surface-container-low rounded-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-12 lg:-mx-40">
          <div className="flex-1">
            <h2 className="font-heading text-3xl lg:text-4xl text-primary leading-tight">
              &ldquo;Luxury here isn&apos;t measured in thread counts, but in
              the proximity to the wild and the absolute absence of digital
              noise.&rdquo;
            </h2>
          </div>
          <div className="w-full md:w-1/2 aspect-[4/3] rounded-xl overflow-hidden shadow-xl rotate-2 relative">
            <Image
              src="https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&q=80"
              alt="Luxury safari tent interior with warm lighting"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        </div>

        <p className="text-lg leading-relaxed text-on-surface">
          By mid-morning, we reached a hidden lagoon where a family of elephants
          had gathered. We watched from the safety of the reeds as a calf
          mimicked its mother, testing the strength of its trunk against a
          cluster of lush grass. It was a scene of profound intimacy, a reminder
          that we were merely guests in a world that operates on a clock far
          older than our own.
        </p>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
          {galleryImages.map((img, i) => (
            <div
              key={img.src}
              className={`rounded-xl overflow-hidden relative aspect-square ${i === 1 ? "mt-12 md:mt-24" : ""}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>

        <p className="text-lg leading-relaxed text-on-surface">
          As we returned to the lodge, the sky turned a bruised purple, then a
          fiery copper. This is the &ldquo;Safari Dusk&rdquo; we talk about --
          the moment when the landscape transforms from a playground of light
          into a sanctuary of shadows. Book With Sheilla&apos;s ethos has always
          been about these transitions. Not just seeing the destination, but
          feeling the shift in the atmosphere.
        </p>

        {/* Tags and Share */}
        <div className="border-t border-outline-variant/20 pt-12 mt-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex flex-wrap gap-3">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-surface-container-highest rounded-full text-xs font-body uppercase tracking-widest text-on-surface-variant"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <p className="font-body text-sm uppercase tracking-widest text-on-surface-variant">
              Share this journey:
            </p>
            <button className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant hover:bg-primary hover:text-on-primary transition-all">
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
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant hover:bg-primary hover:text-on-primary transition-all">
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      <section className="bg-surface-container-low py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="font-body text-secondary uppercase tracking-[0.2em] text-xs font-bold mb-4 block">
                Keep Exploring
              </span>
              <h2 className="font-heading text-4xl text-primary font-bold">
                More from the Journal
              </h2>
            </div>
            <Link
              href="/journal"
              className="font-heading text-primary border-b border-secondary pb-1 hover:text-secondary transition-colors"
            >
              View all entries
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((related) => (
              <Link
                key={related.slug}
                href={`/journal/${related.slug}`}
                className="group cursor-pointer block"
              >
                <div className="aspect-[4/5] overflow-hidden rounded-xl mb-6 relative">
                  <Image
                    src={related.image}
                    alt={related.imageAlt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="font-body text-secondary uppercase tracking-widest text-xs font-bold">
                  {related.category}
                </span>
                <h3 className="font-heading text-2xl text-primary mt-2 group-hover:text-secondary transition-colors">
                  {related.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto primary-gradient rounded-xl p-12 lg:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
          <div className="relative z-10">
            <h2 className="font-heading text-3xl md:text-5xl text-on-primary mb-6">
              Receive our seasonal dispatch
            </h2>
            <p className="font-body text-on-primary/70 text-lg mb-10 max-w-xl mx-auto">
              Join a curated list of global explorers and receive editorial
              stories, exclusive early access to tours, and field notes from our
              scouts.
            </p>
            <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 bg-white/10 border-none rounded-xl text-on-primary placeholder:text-on-primary/50 focus:ring-2 focus:ring-secondary py-4 px-6"
              />
              <button
                type="submit"
                className="bg-secondary text-on-primary px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
