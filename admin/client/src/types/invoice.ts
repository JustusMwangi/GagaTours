export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'bank_transfer' | 'credit_card' | 'cash' | 'mpesa' | 'paypal' | 'other';
export type PaymentStatus = 'pending' | 'confirmed' | 'failed' | 'refunded';

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string | null;
  status: InvoiceStatus;
  total_amount: number;
  currency: string;
  due_date: string | null;
  issued_date: string | null;
  paid_date: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_date: string;
  reference_number: string | null;
  status: PaymentStatus;
  notes: string | null;
  created_at: string;
}

export interface InvoiceDetail extends Invoice {
  booking_id: string | null;
  quotation_id: string | null;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  notes: string | null;
  terms: string | null;
  updated_at: string;
  customer: { id: string; first_name: string; last_name: string } | null;
  booking: { id: string; reference: string } | null;
  payments: Payment[];
}

export interface CreateInvoiceRequest {
  booking_id?: string;
  quotation_id?: string;
  customer_id?: string;
  subtotal?: number;
  tax_amount?: number;
  discount_amount?: number;
  total_amount?: number;
  currency?: string;
  due_date?: string;
  notes?: string;
  terms?: string;
}

export type UpdateInvoiceRequest = Partial<CreateInvoiceRequest>;

export interface RecordPaymentRequest {
  amount: number;
  payment_method?: PaymentMethod;
  payment_date: string;
  reference_number?: string;
  notes?: string;
}

export interface ListInvoicesParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  customer_id?: string;
}

export interface PaginatedInvoicesResponse {
  invoices: Invoice[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}
