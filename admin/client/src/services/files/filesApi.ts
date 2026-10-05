import { apiSlice } from '@/store/apiSlice';
import type {
  FileItem,
  FileListResponse,
  FileListQuery,
  FileDownloadResponse,
  FileUpdateRequest,
} from '@/types/file';

const filesApiEndpoints = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // POST /files
    uploadFile: builder.mutation<FileItem, FormData>({
      query: (formData) => ({
        url: '/files',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Files', id: 'LIST' }],
    }),

    // GET /files
    getFiles: builder.query<FileListResponse, FileListQuery>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page !== undefined) searchParams.set('page', String(params.page));
        if (params.per_page !== undefined) searchParams.set('per_page', String(params.per_page));
        if (params.search !== undefined) searchParams.set('search', params.search);
        if (params.mime_type !== undefined) searchParams.set('mime_type', params.mime_type);
        const queryString = searchParams.toString();
        return `/files${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: [{ type: 'Files', id: 'LIST' }],
    }),

    // GET /files/:id
    getFile: builder.query<FileItem, string>({
      query: (id) => `/files/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Files', id }],
    }),

    // PATCH /files/:id
    updateFile: builder.mutation<FileItem, { id: string; data: FileUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/files/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Files', id },
        { type: 'Files', id: 'LIST' },
      ],
    }),

    // GET /files/:id/download
    getDownloadUrl: builder.query<FileDownloadResponse, string>({
      query: (id) => `/files/${id}/download`,
    }),

    // DELETE /files/:id
    deleteFile: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/files/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Files', id: 'LIST' }],
    }),
  }),
});

export const {
  useUploadFileMutation,
  useGetFilesQuery,
  useGetFileQuery,
  useUpdateFileMutation,
  useGetDownloadUrlQuery,
  useDeleteFileMutation,
} = filesApiEndpoints;

// Export for direct endpoint access (used by FilesPage.tsx for lazy queries)
export { filesApiEndpoints as filesApi };
