import { apiSlice } from '@/store/apiSlice';
import type {
  UserProfile,
  UserDetail,
  PaginatedUsersResponse,
  ListUsersParams,
  UpdateProfileRequest,
  UpdateUserRequest,
  InviteUserRequest,
  InviteUserResponse,
} from '@/types/user';

const usersApiEndpoints = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /users/me
    getProfile: builder.query<UserProfile, void>({
      query: () => '/users/me',
      providesTags: ['Users'],
    }),

    // PUT /users/me
    updateProfile: builder.mutation<UserProfile, UpdateProfileRequest>({
      query: (data) => ({
        url: '/users/me',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Users'],
    }),

    // GET /users
    listUsers: builder.query<PaginatedUsersResponse, ListUsersParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page !== undefined) searchParams.set('page', String(params.page));
        if (params.per_page !== undefined) searchParams.set('per_page', String(params.per_page));
        if (params.search !== undefined) searchParams.set('search', params.search);
        if (params.is_active !== undefined) searchParams.set('is_active', String(params.is_active));
        const queryString = searchParams.toString();
        return `/users/${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: [{ type: 'Users', id: 'LIST' }],
    }),

    // GET /users/:id
    getUser: builder.query<UserDetail, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Users', id }],
    }),

    // PUT /users/:id
    updateUser: builder.mutation<UserDetail, { id: string; data: UpdateUserRequest }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),

    // DELETE /users/:id
    deactivateUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),

    // POST /users/invite
    inviteUser: builder.mutation<InviteUserResponse, InviteUserRequest>({
      query: (data) => ({
        url: '/users/invite',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useListUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeactivateUserMutation,
  useInviteUserMutation,
} = usersApiEndpoints;
