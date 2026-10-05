import { apiSlice } from '@/store/apiSlice';
import type {
  InquiryDetail,
  PaginatedInquiriesResponse,
  ListInquiriesParams,
  CreateInquiryRequest,
  UpdateInquiryRequest,
  ConvertInquiryRequest,
} from '@/types/inquiry';

const inquiriesApiEndpoints = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /inquiries/
    listInquiries: builder.query<PaginatedInquiriesResponse, ListInquiriesParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page !== undefined) searchParams.set('page', String(params.page));
        if (params.per_page !== undefined) searchParams.set('per_page', String(params.per_page));
        if (params.search !== undefined) searchParams.set('search', params.search);
        if (params.status !== undefined) searchParams.set('status', params.status);
        if (params.tour_id !== undefined) searchParams.set('tour_id', params.tour_id);
        const queryString = searchParams.toString();
        return `/inquiries/${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: [{ type: 'Inquiries', id: 'LIST' }],
    }),

    // GET /inquiries/:id
    getInquiry: builder.query<InquiryDetail, string>({
      query: (id) => `/inquiries/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Inquiries', id }],
    }),

    // POST /inquiries/
    createInquiry: builder.mutation<InquiryDetail, CreateInquiryRequest>({
      query: (data) => ({
        url: '/inquiries/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Inquiries', id: 'LIST' }],
    }),

    // PUT /inquiries/:id
    updateInquiry: builder.mutation<InquiryDetail, { id: string; data: UpdateInquiryRequest }>({
      query: ({ id, data }) => ({
        url: `/inquiries/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Inquiries', id },
        { type: 'Inquiries', id: 'LIST' },
      ],
    }),

    // POST /inquiries/:id/convert
    convertInquiry: builder.mutation<unknown, { id: string; data?: ConvertInquiryRequest }>({
      query: ({ id, data }) => ({
        url: `/inquiries/${id}/convert`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Inquiries', 'Bookings', 'Customers'],
    }),
  }),
});

export const {
  useListInquiriesQuery,
  useGetInquiryQuery,
  useCreateInquiryMutation,
  useUpdateInquiryMutation,
  useConvertInquiryMutation,
} = inquiriesApiEndpoints;
