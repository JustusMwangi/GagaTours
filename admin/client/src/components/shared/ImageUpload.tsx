import { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useUploadFileMutation } from '@/services/files/filesApi';

interface ImageUploadProps {
  value: string | null | undefined;
  onChange: (url: string | undefined) => void;
  placeholder?: string;
}

export function ImageUpload({ value, onChange, placeholder = 'Upload image' }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadFile] = useUploadFileMutation();
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be under 10MB');
      return;
    }

    // Show local preview immediately
    const preview = URL.createObjectURL(file);
    setLocalPreview(preview);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadFile(formData).unwrap();

      // Store absolute URL so it works from any origin (admin, public site, etc.)
      // The public endpoint redirects to a fresh presigned MinIO URL on each request
      const apiOrigin = (import.meta.env.VITE_API_ORIGIN as string)
        || window.location.origin;
      onChange(`${apiOrigin}/api/v1/public/images/${result.id}`);
      setLocalPreview(null);

      toast.success('Image uploaded');
    } catch (err) {
      const data = (err as { data?: { message?: string } } | undefined)?.data;
      toast.error(data?.message || 'Upload failed');
      setLocalPreview(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    setLocalPreview(null);
  };

  const displayUrl = localPreview || value;

  return (
    <div>
      {displayUrl ? (
        <div className="relative inline-block">
          <img
            src={displayUrl}
            alt="Preview"
            className="h-32 w-48 rounded-md border object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -right-2 -top-2 h-6 w-6"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/40">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex h-32 w-48 items-center justify-center rounded-md border border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <Upload className="h-6 w-6" />
              <span className="text-xs">{placeholder}</span>
            </div>
          )}
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
