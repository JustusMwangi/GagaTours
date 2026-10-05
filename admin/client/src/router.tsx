import { createBrowserRouter, Navigate } from "react-router"
import App from "./App"
import NotFound from "./pages/NotFound"

// Auth pages
import LoginPage from "./pages/auth/LoginPage"
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage"
import ResetPasswordPage from "./pages/auth/ResetPasswordPage"
import VerifyEmailPage from "./pages/auth/VerifyEmailPage"
import AcceptInvitePage from "./pages/auth/AcceptInvitePage"
import SetupPage from "./pages/auth/SetupPage"

// Layout and guards
import ProtectedRoute from "./components/auth/ProtectedRoute"
import PublicRoute from "./components/auth/PublicRoute"
import AppLayout from "./components/layout/AppLayout"

// Pages
import DashboardPage from "./pages/dashboard/DashboardPage"

// User Management
import UsersListPage from "./pages/users/UsersListPage"
import UserDetailPage from "./pages/users/UserDetailPage"
import ProfilePage from "./pages/profile/ProfilePage"

// RBAC
import RolesListPage from "./pages/roles/RolesListPage"
import RoleDetailPage from "./pages/roles/RoleDetailPage"
import CreateRolePage from "./pages/roles/CreateRolePage"

// Settings
import SettingsPage from "./pages/settings/SettingsPage"

// Notifications
import NotificationsPage from "./pages/notifications/NotificationsPage"
import NotificationPreferencesPage from "./pages/notifications/NotificationPreferencesPage"

// Audit
import AuditLogsPage from "./pages/audit/AuditLogsPage"

// Files
import FilesPage from "./pages/files/FilesPage"

// Tours
import ToursListPage from "./pages/tours/ToursListPage"
import CreateTourPage from "./pages/tours/CreateTourPage"
import TourDetailPage from "./pages/tours/TourDetailPage"
import CategoriesPage from "./pages/tours/CategoriesPage"
import DestinationsPage from "./pages/tours/DestinationsPage"

// Customers
import CustomersListPage from "./pages/customers/CustomersListPage"
import CustomerDetailPage from "./pages/customers/CustomerDetailPage"

// Bookings
import BookingsListPage from "./pages/bookings/BookingsListPage"
import BookingDetailPage from "./pages/bookings/BookingDetailPage"

// Inquiries
import InquiriesListPage from "./pages/inquiries/InquiriesListPage"
import InquiryDetailPage from "./pages/inquiries/InquiryDetailPage"

// Invoices
import InvoicesListPage from "./pages/invoices/InvoicesListPage"
import InvoiceDetailPage from "./pages/invoices/InvoiceDetailPage"

// Quotations
import QuotationsListPage from "./pages/quotations/QuotationsListPage"
import QuotationDetailPage from "./pages/quotations/QuotationDetailPage"

// Help
import HelpPage from "./pages/help/HelpPage"

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      // Index redirect
      { index: true, element: <Navigate to="/login" replace /> },

      // Public routes (redirect to dashboard if authenticated)
      {
        path: "login",
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      // Auth utility routes (accessible regardless of auth status)
      { path: "forgot-password", Component: ForgotPasswordPage },
      { path: "reset-password", Component: ResetPasswordPage },
      { path: "verify-email", Component: VerifyEmailPage },
      { path: "accept-invite", Component: AcceptInvitePage },
      { path: "setup", Component: SetupPage },

      // Protected routes with AppLayout
      {
        element: (
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: "dashboard", Component: DashboardPage },

          // User Management
          { path: "users", Component: UsersListPage },
          { path: "users/:userId", Component: UserDetailPage },
          { path: "profile", Component: ProfilePage },

          // RBAC
          { path: "roles", Component: RolesListPage },
          { path: "roles/create", Component: CreateRolePage },
          { path: "roles/:roleId", Component: RoleDetailPage },

          // Settings
          { path: "settings", Component: SettingsPage },

          // Notifications
          { path: "notifications", Component: NotificationsPage },
          { path: "notifications/preferences", Component: NotificationPreferencesPage },

          // Audit
          { path: "audit", Component: AuditLogsPage },

          // Files
          { path: "files", Component: FilesPage },

          // Tours
          { path: "tours", Component: ToursListPage },
          { path: "tours/create", Component: CreateTourPage },
          { path: "tours/:tourId", Component: TourDetailPage },
          { path: "categories", Component: CategoriesPage },
          { path: "destinations", Component: DestinationsPage },

          // Customers
          { path: "customers", Component: CustomersListPage },
          { path: "customers/:customerId", Component: CustomerDetailPage },

          // Bookings
          { path: "bookings", Component: BookingsListPage },
          { path: "bookings/:bookingId", Component: BookingDetailPage },

          // Inquiries
          { path: "inquiries", Component: InquiriesListPage },
          { path: "inquiries/:inquiryId", Component: InquiryDetailPage },

          // Invoices
          { path: "invoices", Component: InvoicesListPage },
          { path: "invoices/:invoiceId", Component: InvoiceDetailPage },

          // Quotations
          { path: "quotations", Component: QuotationsListPage },
          { path: "quotations/:quotationId", Component: QuotationDetailPage },

          // Help
          { path: "help", Component: HelpPage },
        ],
      },

      // 404
      { path: "*", Component: NotFound },
    ],
  },
])
