import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth } from "@/services/baseQueryWithReauth"

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Users",
    "Settings",
    "Roles",
    "Files",
    "Notifications",
    "Audit",
    "Tours",
    "TourCategories",
    "Destinations",
    "TourDates",
    "TourGallery",
    "Customers",
    "Bookings",
    "Inquiries",
    "Invoices",
    "Quotations",
  ],
  endpoints: () => ({}),
})
