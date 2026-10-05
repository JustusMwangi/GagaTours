import { apiSlice } from '@/store/apiSlice';
import type {
  InvoiceDetail,
  Payment,
  PaginatedInvoicesResponse,
  ListInvoicesParams,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  RecordPaymentRequest,
} from '@/types/invoice';

const invoicesApiEndpoints = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /invoices/
    listInvoices: builder.query<PaginatedInvoicesResponse, ListInvoicesParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page !== undefined) searchParams.set('page', String(params.page));
        if (params.per_page !== undefined) searchParams.set('per_page', String(params.per_page));
        if (params.search !== undefined) searchParams.set('search', params.search);
        if (params.status !== undefined) searchParams.set('status', params.status);
        if (params.customer_id !== undefined) searchParams.set('customer_id', params.customer_id);
        const queryString = searchParams.toString();
        return `/invoices/${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: [{ type: 'Invoices', id: 'LIST' }],
    }),

    // GET /invoices/:id
    getInvoice: builder.query<InvoiceDetail, string>({
      query: (id) => `/invoices/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Invoices', id }],
    }),

    // POST /invoices/
    createInvoice: builder.mutation<InvoiceDetail, CreateInvoiceRequest>({
      query: (data) => ({
        url: '/invoices/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Invoices', id: 'LIST' }],
    }),

    // PUT /invoices/:id
    updateInvoice: builder.mutation<InvoiceDetail, { id: string; data: UpdateInvoiceRequest }>({
      query: ({ id, data }) => ({
        url: `/invoices/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Invoices', id },
        { type: 'Invoices', id: 'LIST' },
      ],
    }),

    // PUT /invoices/:id/status
    updateInvoiceStatus: builder.mutation<InvoiceDetail, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/invoices/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Invoices', id },
        { type: 'Invoices', id: 'LIST' },
      ],
    }),

    // POST /invoices/:id/payments/
    recordPayment: builder.mutation<Payment, { id: string; data: RecordPaymentRequest }>({
      query: ({ id, data }) => ({
        url: `/invoices/${id}/payments/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Invoices', id },
        { type: 'Invoices', id: 'LIST' },
      ],
    }),

    // PUT /invoices/payments/:paymentId/confirm
    confirmPayment: builder.mutation<Payment, string>({
      query: (paymentId) => ({
        url: `/invoices/payments/${paymentId}/confirm`,
        method: 'PUT',
      }),
      invalidatesTags: ['Invoices'],
    }),

    // GET /invoices/:id/payments/
    listPayments: builder.query<Payment[], string>({
      query: (id) => `/invoices/${id}/payments/`,
      providesTags: (_result, _error, id) => [{ type: 'Invoices', id }],
    }),
  }),
});

export const {
  useListInvoicesQuery,
  useGetInvoiceQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useUpdateInvoiceStatusMutation,
  useRecordPaymentMutation,
  useConfirmPaymentMutation,
  useListPaymentsQuery,
} = invoicesApiEndpoints;
