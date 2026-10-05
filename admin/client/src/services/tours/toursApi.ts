import { apiSlice } from '@/store/apiSlice';
import type {
  TourDetail,
  PaginatedToursResponse,
  ListToursParams,
  CreateTourRequest,
  UpdateTourRequest,
  TourCategory,
  PaginatedCategoriesResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  Destination,
  PaginatedDestinationsResponse,
  CreateDestinationRequest,
  UpdateDestinationRequest,
  TourDate,
  CreateTourDateRequest,
  UpdateTourDateRequest,
  TourGalleryItem,
  CreateGalleryItemRequest,
  UpdateGalleryItemRequest,
} from '@/types/tour';

const toursApiEndpoints = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /tours/
    listTours: builder.query<PaginatedToursResponse, ListToursParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page !== undefined) searchParams.set('page', String(params.page));
        if (params.per_page !== undefined) searchParams.set('per_page', String(params.per_page));
        if (params.search !== undefined) searchParams.set('search', params.search);
        if (params.status !== undefined) searchParams.set('status', params.status);
        if (params.category_id !== undefined) searchParams.set('category_id', params.category_id);
        if (params.destination_id !== undefined) searchParams.set('destination_id', params.destination_id);
        if (params.featured !== undefined) searchParams.set('featured', String(params.featured));
        const queryString = searchParams.toString();
        return `/tours/${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: [{ type: 'Tours', id: 'LIST' }],
    }),

    // GET /tours/:id
    getTour: builder.query<TourDetail, string>({
      query: (id) => `/tours/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Tours', id }],
    }),

    // POST /tours/
    createTour: builder.mutation<TourDetail, CreateTourRequest>({
      query: (data) => ({
        url: '/tours/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Tours', id: 'LIST' }],
    }),

    // PUT /tours/:id
    updateTour: builder.mutation<TourDetail, { id: string; data: UpdateTourRequest }>({
      query: ({ id, data }) => ({
        url: `/tours/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Tours', id },
        { type: 'Tours', id: 'LIST' },
      ],
    }),

    // DELETE /tours/:id
    deleteTour: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/tours/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Tours', id: 'LIST' }],
    }),

    // GET /tours/categories/
    listCategories: builder.query<PaginatedCategoriesResponse, void>({
      query: () => '/tours/categories/',
      providesTags: [{ type: 'TourCategories', id: 'LIST' }],
    }),

    // POST /tours/categories/
    createCategory: builder.mutation<TourCategory, CreateCategoryRequest>({
      query: (data) => ({
        url: '/tours/categories/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'TourCategories', id: 'LIST' }],
    }),

    // PUT /tours/categories/:id
    updateCategory: builder.mutation<TourCategory, { id: string; data: UpdateCategoryRequest }>({
      query: ({ id, data }) => ({
        url: `/tours/categories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [{ type: 'TourCategories', id: 'LIST' }],
    }),

    // DELETE /tours/categories/:id
    deleteCategory: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/tours/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'TourCategories', id: 'LIST' }],
    }),

    // GET /tours/destinations/
    listDestinations: builder.query<PaginatedDestinationsResponse, void>({
      query: () => '/tours/destinations/',
      providesTags: [{ type: 'Destinations', id: 'LIST' }],
    }),

    // POST /tours/destinations/
    createDestination: builder.mutation<Destination, CreateDestinationRequest>({
      query: (data) => ({
        url: '/tours/destinations/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Destinations', id: 'LIST' }],
    }),

    // PUT /tours/destinations/:id
    updateDestination: builder.mutation<Destination, { id: string; data: UpdateDestinationRequest }>({
      query: ({ id, data }) => ({
        url: `/tours/destinations/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [{ type: 'Destinations', id: 'LIST' }],
    }),

    // DELETE /tours/destinations/:id
    deleteDestination: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/tours/destinations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Destinations', id: 'LIST' }],
    }),

    // GET /tours/:tourId/dates/
    listTourDates: builder.query<TourDate[], string>({
      query: (tourId) => `/tours/${tourId}/dates/`,
      providesTags: ['TourDates'],
    }),

    // POST /tours/:tourId/dates/
    createTourDate: builder.mutation<TourDate, { tourId: string; data: CreateTourDateRequest }>({
      query: ({ tourId, data }) => ({
        url: `/tours/${tourId}/dates/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['TourDates', 'Tours'],
    }),

    // PUT /tours/:tourId/dates/:dateId
    updateTourDate: builder.mutation<TourDate, { tourId: string; dateId: string; data: UpdateTourDateRequest }>({
      query: ({ tourId, dateId, data }) => ({
        url: `/tours/${tourId}/dates/${dateId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['TourDates', 'Tours'],
    }),

    // DELETE /tours/:tourId/dates/:dateId
    deleteTourDate: builder.mutation<{ message: string }, { tourId: string; dateId: string }>({
      query: ({ tourId, dateId }) => ({
        url: `/tours/${tourId}/dates/${dateId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TourDates', 'Tours'],
    }),

    // GET /tours/:tourId/gallery/
    listGallery: builder.query<TourGalleryItem[], string>({
      query: (tourId) => `/tours/${tourId}/gallery/`,
      providesTags: ['TourGallery'],
    }),

    // POST /tours/:tourId/gallery/
    addGalleryItem: builder.mutation<TourGalleryItem, { tourId: string; data: CreateGalleryItemRequest }>({
      query: ({ tourId, data }) => ({
        url: `/tours/${tourId}/gallery/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['TourGallery', 'Tours'],
    }),

    // PUT /tours/:tourId/gallery/:imageId
    updateGalleryItem: builder.mutation<TourGalleryItem, { tourId: string; imageId: string; data: UpdateGalleryItemRequest }>({
      query: ({ tourId, imageId, data }) => ({
        url: `/tours/${tourId}/gallery/${imageId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['TourGallery'],
    }),

    // DELETE /tours/:tourId/gallery/:imageId
    deleteGalleryItem: builder.mutation<{ message: string }, { tourId: string; imageId: string }>({
      query: ({ tourId, imageId }) => ({
        url: `/tours/${tourId}/gallery/${imageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TourGallery', 'Tours'],
    }),
  }),
});

export const {
  useListToursQuery,
  useGetTourQuery,
  useCreateTourMutation,
  useUpdateTourMutation,
  useDeleteTourMutation,
  useListCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useListDestinationsQuery,
  useCreateDestinationMutation,
  useUpdateDestinationMutation,
  useDeleteDestinationMutation,
  useListTourDatesQuery,
  useCreateTourDateMutation,
  useUpdateTourDateMutation,
  useDeleteTourDateMutation,
  useListGalleryQuery,
  useAddGalleryItemMutation,
  useUpdateGalleryItemMutation,
  useDeleteGalleryItemMutation,
} = toursApiEndpoints;
