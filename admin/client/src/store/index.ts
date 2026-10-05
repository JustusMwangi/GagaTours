import { configureStore } from "@reduxjs/toolkit"
import { apiSlice } from "./apiSlice"
import { authApi } from "@/services/auth/authApi"
// Import service files so their injectEndpoints() calls execute
import "@/services/users/usersApi"
import "@/services/rbac/rbacApi"
import "@/services/settings/settingsApi"
import "@/services/notifications/notificationsApi"
import "@/services/audit/auditApi"
import "@/services/files/filesApi"
import "@/services/tours/toursApi"
import "@/services/customers/customersApi"
import "@/services/bookings/bookingsApi"
import "@/services/inquiries/inquiriesApi"
import "@/services/invoices/invoicesApi"
import "@/services/quotations/quotationsApi"
import authReducer from "@/features/auth/authSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(authApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
