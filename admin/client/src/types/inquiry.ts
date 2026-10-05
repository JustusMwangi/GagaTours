export type InquiryStatus = 'new' | 'contacted' | 'quoted' | 'converted' | 'closed';

export interface Inquiry {
  id: string;
  reference: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  tour_id: string | null;
  status: InquiryStatus;
  source: string;
  travel_date: string | null;
  group_size_adults: number;
  group_size_children: number;
  created_at: string;
}

export interface InquiryDetail extends Inquiry {
  customer_id: string | null;
  message: string | null;
  flexible_dates: boolean;
  budget: number | null;
  currency: string;
  assigned_to: string | null;
  internal_notes: string | null;
  updated_at: string;
  tour: { id: string; title: string } | null;
  customer: { id: string; first_name: string; last_name: string } | null;
  assignee: { id: string; first_name: string; last_name: string } | null;
}

export interface CreateInquiryRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  tour_id?: string;
  message?: string;
  travel_date?: string;
  flexible_dates?: boolean;
  group_size_adults?: number;
  group_size_children?: number;
  budget?: number;
  currency?: string;
  source?: string;
  assigned_to?: string;
  internal_notes?: string;
}

export interface UpdateInquiryRequest extends Partial<CreateInquiryRequest> {
  status?: InquiryStatus;
}

export interface ConvertInquiryRequest {
  tour_id?: string;
  tour_date_id?: string;
  number_of_adults?: number;
  number_of_children?: number;
  total_amount?: number;
  special_requests?: string;
}

export interface ListInquiriesParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  tour_id?: string;
}

export interface PaginatedInquiriesResponse {
  inquiries: Inquiry[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}
