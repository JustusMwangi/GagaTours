// Tour Category
export interface TourCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  is_active?: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  is_active?: boolean;
}

export interface PaginatedCategoriesResponse {
  categories: TourCategory[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

// Destination
export interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string | null;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateDestinationRequest {
  name: string;
  country?: string;
  description?: string;
  image_url?: string;
  is_active?: boolean;
}

export interface UpdateDestinationRequest {
  name?: string;
  country?: string;
  description?: string;
  image_url?: string;
  is_active?: boolean;
}

export interface PaginatedDestinationsResponse {
  destinations: Destination[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

// Brief category/destination shapes returned nested on a tour
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

// Tour
export interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  categories: TourCategoryBrief[];
  destinations: DestinationBrief[];
  price: number | null;
  currency: string;
  duration_days: number | null;
  duration_nights: number | null;
  max_group_size: number | null;
  difficulty_level: string | null;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  image_url: string | null;
  created_at: string;
}

export interface TourDetail extends Tour {
  included: string | null;
  excluded: string | null;
  itinerary: string | null;
  meta_title: string | null;
  meta_description: string | null;
  youtube_url: string | null;
  updated_at: string;
  dates: TourDate[];
  gallery: TourGalleryItem[];
}

export interface TourDate {
  id: string;
  tour_id: string;
  start_date: string;
  end_date: string;
  price_override: number | null;
  max_spots: number | null;
  spots_booked: number;
  status: 'available' | 'full' | 'cancelled';
  created_at: string;
}

export interface TourGalleryItem {
  id: string;
  tour_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

export interface CreateTourRequest {
  title: string;
  description?: string;
  short_description?: string;
  category_ids?: string[];
  destination_ids?: string[];
  price?: number;
  currency?: string;
  duration_days?: number;
  duration_nights?: number;
  max_group_size?: number;
  difficulty_level?: string;
  included?: string;
  excluded?: string;
  itinerary?: string;
  status?: string;
  featured?: boolean;
  image_url?: string;
  meta_title?: string;
  meta_description?: string;
  youtube_url?: string;
}

export type UpdateTourRequest = Partial<CreateTourRequest>;

export interface ListToursParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  category_id?: string;
  destination_id?: string;
  featured?: boolean;
}

export interface PaginatedToursResponse {
  tours: Tour[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface CreateTourDateRequest {
  start_date: string;
  end_date: string;
  price_override?: number;
  max_spots?: number;
  status?: string;
}

export type UpdateTourDateRequest = Partial<CreateTourDateRequest>;

export interface CreateGalleryItemRequest {
  image_url: string;
  caption?: string;
  sort_order?: number;
}

export interface UpdateGalleryItemRequest {
  caption?: string;
  sort_order?: number;
}
