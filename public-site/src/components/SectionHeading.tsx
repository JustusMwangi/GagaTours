export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  const alignClass = align === "center" ? "text-center" : "";
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto" : ""} ${alignClass}`}>
      {eyebrow && (
        <span className="block text-secondary font-body uppercase tracking-widest text-xs sm:text-sm mb-3 md:mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-5xl font-heading text-primary leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 md:mt-6 text-base md:text-lg text-on-surface-variant">
          {subtitle}
        </p>
      )}
    </div>
  );
}
