import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/services/baseQueryWithReauth';
import type {
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  AcceptInviteRequest,
  BootstrapRequest,
  BootstrapResponse,
  ApiSuccessResponse,
  User,
} from '@/types/auth';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Bootstrap'],
  endpoints: (builder) => ({
    // POST /auth/login
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // POST /auth/logout
    logout: builder.mutation<ApiSuccessResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),

    // POST /auth/logout-all
    logoutAll: builder.mutation<ApiSuccessResponse, void>({
      query: () => ({
        url: '/auth/logout-all',
        method: 'POST',
      }),
    }),

    // POST /auth/forgot-password
    forgotPassword: builder.mutation<ApiSuccessResponse, ForgotPasswordRequest>({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    // POST /auth/reset-password
    resetPassword: builder.mutation<ApiSuccessResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),

    // POST /auth/verify-email
    verifyEmail: builder.mutation<ApiSuccessResponse, VerifyEmailRequest>({
      query: (data) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body: data,
      }),
    }),

    // POST /auth/resend-verification
    resendVerification: builder.mutation<ApiSuccessResponse, void>({
      query: () => ({
        url: '/auth/resend-verification',
        method: 'POST',
      }),
    }),

    // POST /auth/accept-invite
    acceptInvite: builder.mutation<LoginResponse, AcceptInviteRequest>({
      query: (data) => ({
        url: '/auth/accept-invite',
        method: 'POST',
        body: data,
      }),
    }),

    // GET /auth/bootstrap - Check if system needs initial setup
    checkBootstrap: builder.query<{ needs_bootstrap: boolean }, void>({
      query: () => '/auth/bootstrap',
      providesTags: ['Bootstrap'],
    }),

    // POST /auth/bootstrap - Create first admin user and tenant
    bootstrap: builder.mutation<BootstrapResponse, BootstrapRequest>({
      query: (data) => ({
        url: '/auth/bootstrap',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Bootstrap'],
    }),

    // GET /users/me - Get current user profile
    getCurrentUser: builder.query<User, void>({
      query: () => '/users/me',
      providesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useLogoutAllMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useAcceptInviteMutation,
  useCheckBootstrapQuery,
  useBootstrapMutation,
  useGetCurrentUserQuery,
} = authApi;
