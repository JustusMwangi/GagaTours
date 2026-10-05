import { useState, useRef } from 'react';
import {
  Upload,
  MoreHorizontal,
  Download,
  Pencil,
  Trash2,
  FileText,
  Image,
  FileSpreadsheet,
  File,
} from 'lucide-react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/shared/PageHeader';
import { SearchInput } from '@/components/shared/SearchInput';
import { DataTable } from '@/components/shared/DataTable';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { usePermissions, Permissions } from '@/hooks/usePermissions';
import {
  useGetFilesQuery,
  useUploadFileMutation,
  useUpdateFileMutation,
  useDeleteFileMutation,
} from '@/services/files/filesApi';
import { filesApi } from '@/services/files/filesApi';
import { formatDate, formatFileSize } from '@/lib/utils';
import { toast } from 'sonner';
import type { FileItem } from '@/types/file';

const columns = [
  { key: 'filename', header: 'Filename' },
  { key: 'size', header: 'Size' },
  { key: 'type', header: 'Type' },
  { key: 'description', header: 'Description' },
  { key: 'uploaded', header: 'Uploaded' },
  { key: 'actions', header: '', className: 'w-[50px]' },
];

function getMimeTypeCategory(mimeType: string): { label: string; icon: typeof File } {
  if (mimeType.startsWith('image/')) return { label: 'Image', icon: Image };
  if (
    mimeType.includes('spreadsheet') ||
    mimeType.includes('excel') ||
    mimeType === 'text/csv'
  )
    return { label: 'Spreadsheet', icon: FileSpreadsheet };
  if (
    mimeType.includes('pdf') ||
    mimeType.includes('document') ||
    mimeType.includes('text/') ||
    mimeType.includes('word')
  )
    return { label: 'Document', icon: FileText };
  return { label: 'Other', icon: File };
}

function getMimeTypeFilter(category: string): string | undefined {
  switch (category) {
    case 'images':
      return 'image';
    case 'documents':
      return 'document';
    case 'spreadsheets':
      return 'spreadsheet';
    case 'other':
      return 'other';
    default:
      return undefined;
  }
}

function truncate(str: string | null, maxLength: number): string {
  if (!str) return '--';
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
}

export default function FilesPage() {
  const { hasPermission } = usePermissions();

  const [search, setSearch] = useState('');
  const [mimeFilter, setMimeFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  // Upload dialog
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadDescription, setUploadDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit dialog
  const [editTarget, setEditTarget] = useState<FileItem | null>(null);
  const [editDescription, setEditDescription] = useState('');

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState<FileItem | null>(null);

  const { data, isLoading, isFetching } = useGetFilesQuery({
    page,
    per_page: 20,
    search: search || undefined,
    mime_type: getMimeTypeFilter(mimeFilter),
  });

  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const [updateFile, { isLoading: isUpdating }] = useUpdateFileMutation();
  const [deleteFile, { isLoading: isDeleting }] = useDeleteFileMutation();

  // Use lazy query for download URL
  const [triggerGetDownloadUrl] = filesApi.endpoints.getDownloadUrl.useLazyQuery();

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    if (uploadDescription) {
      formData.append('description', uploadDescription);
    }

    try {
      await uploadFile(formData).unwrap();
      toast.success('File uploaded successfully.');
      setShowUploadDialog(false);
      setUploadDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch {
      toast.error('Failed to upload file.');
    }
  };

  const handleDownload = async (fileItem: FileItem) => {
    try {
      const result = await triggerGetDownloadUrl(fileItem.id).unwrap();
      window.open(result.download_url, '_blank');
    } catch {
      toast.error('Failed to get download URL.');
    }
  };

  const handleEditSave = async () => {
    if (!editTarget) return;
    try {
      await updateFile({
        id: editTarget.id,
        data: { description: editDescription || null },
      }).unwrap();
      toast.success('File description updated.');
      setEditTarget(null);
    } catch {
      toast.error('Failed to update file.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteFile(deleteTarget.id).unwrap();
      toast.success(`File "${deleteTarget.original_filename}" deleted.`);
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete file.');
    }
  };

  if (!hasPermission(Permissions.FILES_VIEW)) {
    return (
      <EmptyState
        title="Access Denied"
        description="You do not have permission to view files."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Files"
        description="Manage uploaded files."
        action={
          hasPermission(Permissions.FILES_UPLOAD) ? (
            <Button onClick={() => setShowUploadDialog(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          ) : undefined
        }
      />

      <div className="flex items-center gap-4">
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search files..."
          className="w-80"
        />
        <Select
          value={mimeFilter}
          onValueChange={(val) => {
            setMimeFilter(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="images">Images</SelectItem>
            <SelectItem value="documents">Documents</SelectItem>
            <SelectItem value="spreadsheets">Spreadsheets</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable<FileItem>
        columns={columns}
        data={data?.files}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage="No files found"
        emptyDescription="Upload a file to get started."
        page={data?.page}
        totalPages={data?.pages}
        onPageChange={setPage}
        renderRow={(fileItem) => {
          const category = getMimeTypeCategory(fileItem.mime_type);
          const CategoryIcon = category.icon;

          return (
            <TableRow key={fileItem.id}>
              <TableCell className="font-medium">{fileItem.original_filename}</TableCell>
              <TableCell>{formatFileSize(fileItem.size)}</TableCell>
              <TableCell>
                <Badge variant="outline" className="gap-1">
                  <CategoryIcon className="h-3 w-3" />
                  {category.label}
                </Badge>
              </TableCell>
              <TableCell>{truncate(fileItem.description, 40)}</TableCell>
              <TableCell>{formatDate(fileItem.created_at)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {hasPermission(Permissions.FILES_DOWNLOAD) && (
                      <DropdownMenuItem onClick={() => handleDownload(fileItem)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => {
                        setEditTarget(fileItem);
                        setEditDescription(fileItem.description ?? '');
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Description
                    </DropdownMenuItem>
                    {hasPermission(Permissions.FILES_DELETE) && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteTarget(fileItem)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        }}
      />

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>Select a file to upload.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-input">File</Label>
              <Input id="file-input" type="file" ref={fileInputRef} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="upload-description">Description (optional)</Label>
              <Textarea
                id="upload-description"
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                placeholder="Add a description..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUploadDialog(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Description Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Description</DialogTitle>
            <DialogDescription>
              Update the description for &quot;{editTarget?.original_filename}&quot;.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="File description..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditTarget(null)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button onClick={handleEditSave} disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete ConfirmDialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete File"
        description={`Are you sure you want to delete "${deleteTarget?.original_filename}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
