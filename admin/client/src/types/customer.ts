export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  nationality: string | null;
  source: string;
  is_active: boolean;
  created_at: string;
}

export interface CustomerDetail extends Customer {
  passport_number: string | null;
  address: string | null;
  notes: string | null;
  updated_at: string;
}

export interface CreateCustomerRequest {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  nationality?: string;
  passport_number?: string;
  address?: string;
  notes?: string;
  source?: string;
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {
  is_active?: boolean;
}

export interface ListCustomersParams {
  page?: number;
  per_page?: number;
  search?: string;
  source?: string;
  is_active?: boolean;
}

export interface PaginatedCustomersResponse {
  customers: Customer[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}
