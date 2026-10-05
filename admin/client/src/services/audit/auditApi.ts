import { apiSlice } from '@/store/apiSlice';
import type {
  AuditLog,
  AuditLogListResponse,
  AuditLogListQuery,
  AuditLogExportQuery,
} from '@/types/audit';

const auditApiEndpoints = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /audit
    getAuditLogs: builder.query<AuditLogListResponse, AuditLogListQuery>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
        const queryString = searchParams.toString();
        return `/audit/${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: [{ type: 'Audit', id: 'LIST' }],
    }),

    // GET /audit/:id
    getAuditLog: builder.query<AuditLog, string>({
      query: (id) => `/audit/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Audit', id }],
    }),

    // GET /audit/export
    exportAuditLogs: builder.query<string, AuditLogExportQuery>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
        return {
          url: `/audit/export?${searchParams.toString()}`,
          responseHandler: (response: Response) =>
            response.blob().then((blob) => URL.createObjectURL(blob)),
        };
      },
    }),
  }),
});

export const {
  useGetAuditLogsQuery,
  useGetAuditLogQuery,
  useExportAuditLogsQuery,
  useLazyExportAuditLogsQuery,
} = auditApiEndpoints;
