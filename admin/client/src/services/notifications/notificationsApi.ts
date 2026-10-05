import { apiSlice } from '@/store/apiSlice';
import type {
  NotificationListResponse,
  NotificationListQuery,
  UnreadCountResponse,
  MarkReadResponse,
  MarkAllReadResponse,
  NotificationPreference,
  UpdatePreferencesRequest,
} from '@/types/notification';

const notificationsApiEndpoints = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /notifications
    getNotifications: builder.query<NotificationListResponse, NotificationListQuery>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
        const queryString = searchParams.toString();
        return `/notifications/${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: [{ type: 'Notifications', id: 'LIST' }],
    }),

    // GET /notifications/unread-count
    getUnreadCount: builder.query<number, void>({
      query: () => '/notifications/unread-count',
      transformResponse: (response: UnreadCountResponse) => response.unread_count,
      providesTags: ['Notifications'],
    }),

    // PUT /notifications/:id/read
    markAsRead: builder.mutation<MarkReadResponse, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: [{ type: 'Notifications', id: 'LIST' }, 'Notifications'],
    }),

    // PUT /notifications/read-all
    markAllAsRead: builder.mutation<MarkAllReadResponse, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PUT',
      }),
      invalidatesTags: [{ type: 'Notifications', id: 'LIST' }, 'Notifications'],
    }),

    // DELETE /notifications/:id
    deleteNotification: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Notifications', id: 'LIST' }, 'Notifications'],
    }),

    // GET /notifications/preferences
    getPreferences: builder.query<NotificationPreference[], void>({
      query: () => '/notifications/preferences',
      transformResponse: (response: { preferences: NotificationPreference[] }) => response.preferences,
      providesTags: ['Notifications'],
    }),

    // PUT /notifications/preferences
    updatePreferences: builder.mutation<NotificationPreference[], UpdatePreferencesRequest>({
      query: (data) => ({
        url: '/notifications/preferences',
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: { preferences: NotificationPreference[] }) => response.preferences,
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useGetPreferencesQuery,
  useUpdatePreferencesMutation,
} = notificationsApiEndpoints;
