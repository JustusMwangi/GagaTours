export interface FileItem {
  id: string;
  filename: string;
  original_filename: string;
  size: number;
  mime_type: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface FileListResponse {
  files: FileItem[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface FileListQuery {
  page?: number;
  per_page?: number;
  search?: string;
  mime_type?: string;
}

export interface FileDownloadResponse {
  download_url: string;
  filename: string;
  mime_type: string;
  expires_in: number;
}

export interface FileUpdateRequest {
  description?: string | null;
}
