import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { RootState } from '@/store';
import type { RefreshTokenResponse } from '@/types/auth';

const apiOrigin = (import.meta.env.VITE_API_ORIGIN as string | undefined) ?? '';
const baseUrl = `${apiOrigin}/api/v1`;

// Base query with auth token injection
const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;

    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Mutex for token refresh — prevents multiple simultaneous 401s from each
// independently calling POST /auth/refresh.
let refreshPromise: Promise<boolean> | null = null;

// Base query with token refresh logic - shared across all API slices
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401 Unauthorized response, try to refresh the token
  if (result.error && result.error.status === 401) {
    // Use mutex so only the first 401 triggers a refresh; others wait for it
    if (!refreshPromise) {
      refreshPromise = (async (): Promise<boolean> => {
        const refreshToken = (api.getState() as RootState).auth.refreshToken;
        if (!refreshToken) {
          api.dispatch({ type: 'auth/logout' });
          return false;
        }

        const refreshResult = await baseQuery(
          {
            url: '/auth/refresh',
            method: 'POST',
            body: { refresh_token: refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const tokens = refreshResult.data as RefreshTokenResponse;
          if (tokens?.access_token) {
            api.dispatch({
              type: 'auth/updateTokens',
              payload: {
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
              },
            });
            return true;
          }
        }

        api.dispatch({ type: 'auth/logout' });
        return false;
      })().finally(() => {
        refreshPromise = null;
      });
    }

    const refreshed = await refreshPromise;
    if (refreshed) {
      // Retry the original query with the new token
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};
