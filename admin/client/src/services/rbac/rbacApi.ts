import { apiSlice } from '@/store/apiSlice';
import type {
  Role,
  RoleDetail,
  RoleListResponse,
  PermissionListResponse,
  CreateRoleRequest,
  UpdateRoleRequest,
  ListPermissionsParams,
  AssignRoleRequest,
  UserRolesResponse,
  RevokeRoleParams,
} from '@/types/rbac';

const rbacApiEndpoints = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /rbac/roles
    listRoles: builder.query<RoleListResponse, void>({
      query: () => '/rbac/roles',
      providesTags: [{ type: 'Roles', id: 'LIST' }],
    }),

    // GET /rbac/roles/:id
    getRole: builder.query<RoleDetail, string>({
      query: (id) => `/rbac/roles/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Roles', id }],
    }),

    // POST /rbac/roles
    createRole: builder.mutation<Role, CreateRoleRequest>({
      query: (data) => ({
        url: '/rbac/roles',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Roles', id: 'LIST' }],
    }),

    // PUT /rbac/roles/:id
    updateRole: builder.mutation<Role, { id: string; data: UpdateRoleRequest }>({
      query: ({ id, data }) => ({
        url: `/rbac/roles/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Roles', id },
        { type: 'Roles', id: 'LIST' },
      ],
    }),

    // DELETE /rbac/roles/:id
    deleteRole: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/rbac/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Roles', id: 'LIST' }],
    }),

    // GET /rbac/permissions
    listPermissions: builder.query<PermissionListResponse, ListPermissionsParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.resource !== undefined) searchParams.set('resource', params.resource);
        const queryString = searchParams.toString();
        return `/rbac/permissions${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Roles'],
    }),

    // GET /rbac/users/:userId/roles
    getUserRoles: builder.query<UserRolesResponse, string>({
      query: (userId) => `/rbac/users/${userId}/roles`,
      providesTags: (_result, _error, userId) => [{ type: 'Roles', id: `user-${userId}` }],
    }),

    // POST /rbac/users/:userId/roles
    assignRoleToUser: builder.mutation<{ message: string }, { userId: string; data: AssignRoleRequest }>({
      query: ({ userId, data }) => ({
        url: `/rbac/users/${userId}/roles`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { userId }) => [{ type: 'Roles', id: `user-${userId}` }],
    }),

    // DELETE /rbac/users/:userId/roles/:roleId
    revokeRoleFromUser: builder.mutation<{ message: string }, RevokeRoleParams>({
      query: ({ userId, roleId }) => ({
        url: `/rbac/users/${userId}/roles/${roleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { userId }) => [{ type: 'Roles', id: `user-${userId}` }],
    }),
  }),
});

export const {
  useListRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useListPermissionsQuery,
  useGetUserRolesQuery,
  useAssignRoleToUserMutation,
  useRevokeRoleFromUserMutation,
} = rbacApiEndpoints;
