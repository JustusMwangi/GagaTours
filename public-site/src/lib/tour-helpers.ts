// Helpers for rendering a tour's (now many-to-many) categories & destinations.

interface Named {
  name: string;
}

interface HasCountry {
  country: string | null;
}

/** Compact, overflow-aware summary, e.g. "Amboseli · Nakuru +3". */
export function nameSummary(items: Named[] | undefined, max = 2): string {
  if (!items || items.length === 0) return "";
  const names = items.map((i) => i.name);
  if (names.length <= max) return names.join(" · ");
  return `${names.slice(0, max).join(" · ")} +${names.length - max}`;
}

/** First non-empty country across destinations (for the card corner badge). */
export function firstCountry(items: HasCountry[] | undefined): string | null {
  return items?.find((d) => d.country)?.country ?? null;
}
