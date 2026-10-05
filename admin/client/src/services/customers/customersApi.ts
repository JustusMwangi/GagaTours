import { apiSlice } from '@/store/apiSlice';
import type {
  CustomerDetail,
  PaginatedCustomersResponse,
  ListCustomersParams,
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from '@/types/customer';

const customersApiEndpoints = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /customers/
    listCustomers: builder.query<PaginatedCustomersResponse, ListCustomersParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page !== undefined) searchParams.set('page', String(params.page));
        if (params.per_page !== undefined) searchParams.set('per_page', String(params.per_page));
        if (params.search !== undefined) searchParams.set('search', params.search);
        if (params.source !== undefined) searchParams.set('source', params.source);
        if (params.is_active !== undefined) searchParams.set('is_active', String(params.is_active));
        const queryString = searchParams.toString();
        return `/customers/${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: [{ type: 'Customers', id: 'LIST' }],
    }),

    // GET /customers/:id
    getCustomer: builder.query<CustomerDetail, string>({
      query: (id) => `/customers/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Customers', id }],
    }),

    // POST /customers/
    createCustomer: builder.mutation<CustomerDetail, CreateCustomerRequest>({
      query: (data) => ({
        url: '/customers/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Customers', id: 'LIST' }],
    }),

    // PUT /customers/:id
    updateCustomer: builder.mutation<CustomerDetail, { id: string; data: UpdateCustomerRequest }>({
      query: ({ id, data }) => ({
        url: `/customers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Customers', id },
        { type: 'Customers', id: 'LIST' },
      ],
    }),

    // DELETE /customers/:id
    deleteCustomer: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Customers', id: 'LIST' }],
    }),
  }),
});

export const {
  useListCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customersApiEndpoints;
