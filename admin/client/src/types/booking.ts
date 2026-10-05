export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  reference: string;
  customer_id: string | null;
  tour_id: string | null;
  tour_date_id: string | null;
  status: BookingStatus;
  total_amount: number | null;
  currency: string;
  number_of_adults: number;
  number_of_children: number;
  booking_date: string | null;
  created_at: string;
}

export interface BookingDetail extends Booking {
  inquiry_id: string | null;
  special_requests: string | null;
  internal_notes: string | null;
  updated_at: string;
  customer: { id: string; first_name: string; last_name: string } | null;
  tour: { id: string; title: string } | null;
  invoice: { id: string; invoice_number: string } | null;
  quotation: { id: string; reference: string } | null;
}

export interface CreateBookingRequest {
  customer_id: string;
  tour_id?: string;
  tour_date_id?: string;
  number_of_adults?: number;
  number_of_children?: number;
  total_amount?: number;
  currency?: string;
  special_requests?: string;
  internal_notes?: string;
  booking_date?: string;
}

export type UpdateBookingRequest = Partial<CreateBookingRequest>;

export interface ListBookingsParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  customer_id?: string;
  tour_id?: string;
}

export interface PaginatedBookingsResponse {
  bookings: Booking[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}
