import { apiSlice } from '@/store/apiSlice';
import type {
  QuotationDetail,
  PaginatedQuotationsResponse,
  ListQuotationsParams,
  CreateQuotationRequest,
  UpdateQuotationRequest,
} from '@/types/quotation';

const quotationsApiEndpoints = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /quotations/
    listQuotations: builder.query<PaginatedQuotationsResponse, ListQuotationsParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page !== undefined) searchParams.set('page', String(params.page));
        if (params.per_page !== undefined) searchParams.set('per_page', String(params.per_page));
        if (params.search !== undefined) searchParams.set('search', params.search);
        if (params.status !== undefined) searchParams.set('status', params.status);
        if (params.customer_id !== undefined) searchParams.set('customer_id', params.customer_id);
        if (params.booking_id !== undefined) searchParams.set('booking_id', params.booking_id);
        const queryString = searchParams.toString();
        return `/quotations/${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: [{ type: 'Quotations', id: 'LIST' }],
    }),

    // GET /quotations/:id
    getQuotation: builder.query<QuotationDetail, string>({
      query: (id) => `/quotations/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Quotations', id }],
    }),

    // POST /quotations/
    createQuotation: builder.mutation<QuotationDetail, CreateQuotationRequest>({
      query: (data) => ({
        url: '/quotations/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Quotations', id: 'LIST' }],
    }),

    // PUT /quotations/:id
    updateQuotation: builder.mutation<QuotationDetail, { id: string; data: UpdateQuotationRequest }>({
      query: ({ id, data }) => ({
        url: `/quotations/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Quotations', id },
        { type: 'Quotations', id: 'LIST' },
      ],
    }),

    // PUT /quotations/:id/status
    updateQuotationStatus: builder.mutation<QuotationDetail, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/quotations/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Quotations', id },
        { type: 'Quotations', id: 'LIST' },
      ],
    }),

    // POST /quotations/:id/convert-to-invoice
    convertToInvoice: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/quotations/${id}/convert-to-invoice`,
        method: 'POST',
      }),
      invalidatesTags: ['Quotations', 'Invoices'],
    }),

    // DELETE /quotations/:id
    deleteQuotation: builder.mutation<void, string>({
      query: (id) => ({
        url: `/quotations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Quotations', id: 'LIST' }],
    }),
  }),
});

export const {
  useListQuotationsQuery,
  useGetQuotationQuery,
  useCreateQuotationMutation,
  useUpdateQuotationMutation,
  useUpdateQuotationStatusMutation,
  useConvertToInvoiceMutation,
  useDeleteQuotationMutation,
} = quotationsApiEndpoints;
