const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api/v1/public";

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// ── Types ──────────────────────────────────────────────────────────────

export interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  highlights: string | null;
  itinerary: string | null;
  base_price_adult: string;
  base_price_child: string | null;
  currency: string;
  duration_days: number;
  duration_nights: number | null;
  difficulty: string | null;
  max_group_size: number | null;
  youtube_url: string | null;
  featured_image_url: string | null;
  status: string;
  is_featured: boolean;
  categories: TourCategoryBrief[];
  destinations: DestinationBrief[];
  created_at: string;
  updated_at: string;
}

export interface TourCategoryBrief {
  id: string;
  name: string;
  slug: string;
}

export interface DestinationBrief {
  id: string;
  name: string;
  slug: string;
  country: string | null;
}

export interface TourDetail extends Tour {
  included: string | null;
  excluded: string | null;
  meta_title: string | null;
  meta_description: string | null;
  gallery: TourGalleryItem[];
  tour_dates: TourDate[];
}

export interface TourGalleryItem {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

export interface TourDate {
  id: string;
  tour_id: string;
  start_date: string;
  end_date: string;
  total_capacity: number;
  booked_count: number;
  available_capacity: number;
  price_adult_override: string | null;
  price_child_override: string | null;
  status: string;
}

export interface TourCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
}

export interface Inquiry {
  id: string;
  contact_name: string;
  contact_email: string | null;
  contact_phone: string | null;
  tour_id: string | null;
  preferred_date: string | null;
  group_size_adults: number | null;
  group_size_children: number | null;
  total_amount: string | null;
  currency: string | null;
  message: string | null;
  status: string | null;
  created_at: string | null;
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  per_page: number;
  pages: number;
  [key: string]: T[] | number;
}

export interface ToursResponse {
  tours: Tour[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface DestinationsResponse {
  destinations: Destination[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface CategoriesResponse {
  categories: TourCategory[];
}
