import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '\u2014';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '\u2014';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Pulls a human-readable message out of an RTK Query error. Backend APIError
// returns { error, message, errors? } \u2014 when `errors` is present (validation
// failures), surface the first offending field so the user knows what to fix.
export function getApiErrorMessage(err: unknown, fallback: string): string {
  const data = (err as { data?: { message?: string; errors?: Record<string, unknown> } } | undefined)?.data;
  if (!data) return fallback;
  if (data.errors && typeof data.errors === 'object') {
    const entries = Object.entries(data.errors);
    if (entries.length > 0) {
      const [field, raw] = entries[0];
      const label = field.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      const msg = Array.isArray(raw) ? String(raw[0]) : typeof raw === 'string' ? raw : JSON.stringify(raw);
      return `${label}: ${msg}`;
    }
  }
  return data.message || fallback;
}
