import { apiSlice } from '@/store/apiSlice';
import type { AppSettings, UpdateAppSettingsRequest, DashboardStats } from '@/types/settings';

const settingsApiEndpoints = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAppSettings: builder.query<AppSettings, void>({
      query: () => '/settings',
      providesTags: ['Settings'],
    }),

    updateAppSettings: builder.mutation<AppSettings, UpdateAppSettingsRequest>({
      query: (data) => ({
        url: '/settings',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),

    getDashboard: builder.query<DashboardStats, void>({
      query: () => '/settings/dashboard',
      providesTags: ['Settings'],
    }),
  }),
});

export const {
  useGetAppSettingsQuery,
  useUpdateAppSettingsMutation,
  useGetDashboardQuery,
} = settingsApiEndpoints;
