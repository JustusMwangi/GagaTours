import { apiSlice } from '@/store/apiSlice';
import type {
  BookingDetail,
  PaginatedBookingsResponse,
  ListBookingsParams,
  CreateBookingRequest,
  UpdateBookingRequest,
} from '@/types/booking';

const bookingsApiEndpoints = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /bookings/
    listBookings: builder.query<PaginatedBookingsResponse, ListBookingsParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page !== undefined) searchParams.set('page', String(params.page));
        if (params.per_page !== undefined) searchParams.set('per_page', String(params.per_page));
        if (params.search !== undefined) searchParams.set('search', params.search);
        if (params.status !== undefined) searchParams.set('status', params.status);
        if (params.customer_id !== undefined) searchParams.set('customer_id', params.customer_id);
        if (params.tour_id !== undefined) searchParams.set('tour_id', params.tour_id);
        const queryString = searchParams.toString();
        return `/bookings/${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: [{ type: 'Bookings', id: 'LIST' }],
    }),

    // GET /bookings/:id
    getBooking: builder.query<BookingDetail, string>({
      query: (id) => `/bookings/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Bookings', id }],
    }),

    // POST /bookings/
    createBooking: builder.mutation<BookingDetail, CreateBookingRequest>({
      query: (data) => ({
        url: '/bookings/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Bookings', id: 'LIST' }],
    }),

    // PUT /bookings/:id
    updateBooking: builder.mutation<BookingDetail, { id: string; data: UpdateBookingRequest }>({
      query: ({ id, data }) => ({
        url: `/bookings/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Bookings', id },
        { type: 'Bookings', id: 'LIST' },
      ],
    }),

    // PUT /bookings/:id/status
    updateBookingStatus: builder.mutation<BookingDetail, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/bookings/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Bookings', id },
        { type: 'Bookings', id: 'LIST' },
      ],
    }),

    // POST /bookings/:id/quotation
    createQuotationFromBooking: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/bookings/${id}/quotation`,
        method: 'POST',
      }),
      invalidatesTags: ['Bookings', 'Quotations'],
    }),

    // POST /bookings/:id/invoice
    createInvoiceFromBooking: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/bookings/${id}/invoice`,
        method: 'POST',
      }),
      invalidatesTags: ['Bookings', 'Invoices'],
    }),
  }),
});

export const {
  useListBookingsQuery,
  useGetBookingQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useUpdateBookingStatusMutation,
  useCreateQuotationFromBookingMutation,
  useCreateInvoiceFromBookingMutation,
} = bookingsApiEndpoints;
