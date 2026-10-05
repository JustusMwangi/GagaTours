export interface AppSettings {
  id: string;
  app_name: string;
  timezone: string;
  currency: string;
  locale: string;
  date_format: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  time_format: '12h' | '24h';
  business_name: string | null;
  business_address: string | null;
  business_phone: string | null;
  business_email: string | null;
}

export interface UpdateAppSettingsRequest {
  app_name?: string;
  timezone?: string;
  currency?: string;
  locale?: string;
  date_format?: string;
  time_format?: string;
  business_name?: string | null;
  business_address?: string | null;
  business_phone?: string | null;
  business_email?: string | null;
}

export interface DashboardStats {
  user_count: number;
  unread_notifications: number;
  recent_activity: {
    id: string;
    action: string;
    resource_type: string | null;
    user_email: string | null;
    created_at: string | null;
  }[];
}
