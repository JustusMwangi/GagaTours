/**
 * Permission constants matching the backend RBAC system.
 *
 * Permissions follow the naming convention: resource.action
 * These must stay in sync with backend/app/core/constants.py
 */

export const Permissions = {
  // User Management
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_EDIT: 'users.edit',
  USERS_DELETE: 'users.delete',
  USERS_MANAGE_ROLES: 'users.manage_roles',

  // Role & Permission Management
  ROLES_VIEW: 'roles.view',
  ROLES_CREATE: 'roles.create',
  ROLES_EDIT: 'roles.edit',
  ROLES_DELETE: 'roles.delete',
  PERMISSIONS_VIEW: 'permissions.view',

  // Settings & Configuration
  SETTINGS_VIEW: 'settings.view',
  SETTINGS_EDIT: 'settings.edit',

  // Reports & Analytics
  REPORTS_VIEW: 'reports.view',
  REPORTS_EXPORT: 'reports.export',
  ANALYTICS_VIEW: 'analytics.view',

  // Audit Logging
  AUDIT_VIEW: 'audit.view',
  AUDIT_EXPORT: 'audit.export',

  // Notifications
  NOTIFICATIONS_VIEW: 'notifications.view',
  NOTIFICATIONS_MANAGE: 'notifications.manage',

  // File Storage
  FILES_VIEW: 'files.view',
  FILES_UPLOAD: 'files.upload',
  FILES_DOWNLOAD: 'files.download',
  FILES_DELETE: 'files.delete',

  // Tours
  TOURS_VIEW: 'tours.view',
  TOURS_MANAGE: 'tours.manage',

  // Customers
  CUSTOMERS_VIEW: 'customers.view',
  CUSTOMERS_MANAGE: 'customers.manage',

  // Bookings
  BOOKINGS_VIEW: 'bookings.view',
  BOOKINGS_MANAGE: 'bookings.manage',

  // Inquiries
  INQUIRIES_VIEW: 'inquiries.view',
  INQUIRIES_MANAGE: 'inquiries.manage',

  // Invoices
  INVOICES_VIEW: 'invoices.view',
  INVOICES_MANAGE: 'invoices.manage',

  // Quotations
  QUOTATIONS_VIEW: 'quotations.view',
  QUOTATIONS_MANAGE: 'quotations.manage',
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions];
