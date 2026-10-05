export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationChannel = 'in_app' | 'email' | 'push';
export type NotificationCategory = 'system' | 'security' | 'billing' | 'team' | 'activity';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  channel: NotificationChannel;
  is_read: boolean;
  read_at: string | null;
  sent_at: string | null;
  created_at: string;
}

export interface NotificationPreference {
  category: NotificationCategory;
  email_enabled: boolean;
  in_app_enabled: boolean;
  push_enabled: boolean;
}

export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
  unread_count: number;
}

export interface NotificationListQuery {
  page?: number;
  per_page?: number;
  is_read?: boolean;
  category?: NotificationCategory;
  type?: NotificationType;
}

export interface UnreadCountResponse {
  unread_count: number;
}

export interface MarkReadResponse {
  message: string;
  notification: Notification;
}

export interface MarkAllReadResponse {
  message: string;
  count: number;
}

export interface UpdatePreferenceRequest {
  category: NotificationCategory;
  email_enabled?: boolean;
  in_app_enabled?: boolean;
  push_enabled?: boolean;
}

export interface UpdatePreferencesRequest {
  preferences: UpdatePreferenceRequest[];
}
