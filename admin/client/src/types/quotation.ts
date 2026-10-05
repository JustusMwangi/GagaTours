export type QuotationStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired' | 'converted';
export type QuotationItemType = 'service' | 'accommodation' | 'transport' | 'activity' | 'other';

export interface QuotationItem {
  id: string;
  description: string;
  item_type: QuotationItemType;
  quantity: number;
  unit_price: number;
  total_price: number;
  sort_order: number;
}

export interface Quotation {
  id: string;
  reference: string;
  customer_id: string | null;
  booking_id: string | null;
  tour_id: string | null;
  status: QuotationStatus;
  total_amount: number;
  currency: string;
  valid_until: string | null;
  created_at: string;
}

export interface QuotationDetail extends Quotation {
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  notes: string | null;
  terms: string | null;
  updated_at: string;
  customer: { id: string; first_name: string; last_name: string } | null;
  booking: { id: string; reference: string } | null;
  tour: { id: string; title: string } | null;
  items: QuotationItem[];
}

export interface QuotationItemRequest {
  description: string;
  item_type?: QuotationItemType;
  quantity?: number;
  unit_price: number;
  total_price: number;
  sort_order?: number;
}

export interface CreateQuotationRequest {
  booking_id?: string;
  customer_id?: string;
  tour_id?: string;
  subtotal?: number;
  tax_amount?: number;
  discount_amount?: number;
  total_amount?: number;
  currency?: string;
  valid_until?: string;
  notes?: string;
  terms?: string;
  items?: QuotationItemRequest[];
}

export type UpdateQuotationRequest = Partial<CreateQuotationRequest>;

export interface ListQuotationsParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  customer_id?: string;
  booking_id?: string;
}

export interface PaginatedQuotationsResponse {
  quotations: Quotation[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}
