export interface AuditLog {
  id: string;
  user_id: string;
  user_email: string | null;
  user_name: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  description: string | null;
  extra_data: Record<string, unknown> | null;
  created_at: string;
}

export interface AuditLogListResponse {
  logs: AuditLog[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface AuditLogListQuery {
  page?: number;
  per_page?: number;
  action?: string;
  resource_type?: string;
  resource_id?: string;
  user_id?: string;
  start_date?: string;
  end_date?: string;
}

export interface AuditLogExportQuery {
  format?: 'json' | 'csv';
  action?: string;
  resource_type?: string;
  user_id?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
}
