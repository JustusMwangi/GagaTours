import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, FileText, Receipt } from 'lucide-react';
import { toast } from 'sonner';

import { usePermissions, Permissions } from '@/hooks/usePermissions';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  useGetBookingQuery,
  useUpdateBookingMutation,
  useUpdateBookingStatusMutation,
  useCreateQuotationFromBookingMutation,
  useCreateInvoiceFromBookingMutation,
} from '@/services/bookings/bookingsApi';
import type { BookingStatus, UpdateBookingRequest } from '@/types/booking';
import { formatDate, formatDateTime } from '@/lib/utils';

const STATUS_OPTIONS: { value: BookingStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

function formatCurrency(amount: number | null, currency: string): string {
  if (amount === null || amount === undefined) return '\u2014';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(amount);
}

export default function BookingDetailPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission(Permissions.BOOKINGS_MANAGE);

  const { data: booking, isLoading } = useGetBookingQuery(bookingId!, { skip: !bookingId });
  const [updateBooking, { isLoading: isUpdating }] = useUpdateBookingMutation();
  const [updateBookingStatus, { isLoading: isUpdatingStatus }] = useUpdateBookingStatusMutation();
  const [createQuotation, { isLoading: isCreatingQuotation }] = useCreateQuotationFromBookingMutation();
  const [createInvoice, { isLoading: isCreatingInvoice }] = useCreateInvoiceFromBookingMutation();

  const [formOverrides, setFormOverrides] = useState<Partial<UpdateBookingRequest> | null>(null);
  const [statusOverride, setStatusOverride] = useState<string | null>(null);

  const form: UpdateBookingRequest = formOverrides ?? {
    number_of_adults: booking?.number_of_adults,
    number_of_children: booking?.number_of_children,
    total_amount: booking?.total_amount ?? undefined,
    currency: booking?.currency,
    special_requests: booking?.special_requests ?? '',
    internal_notes: booking?.internal_notes ?? '',
  };
  const isDirty = formOverrides !== null;
  const statusValue = statusOverride ?? booking?.status ?? '';

  const updateField = <K extends keyof UpdateBookingRequest>(key: K, value: UpdateBookingRequest[K]) => {
    setFormOverrides((prev) => ({ ...form, ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!bookingId) return;
    try {
      await updateBooking({
        id: bookingId,
        data: {
          number_of_adults: form.number_of_adults,
          number_of_children: form.number_of_children,
          total_amount: form.total_amount,
          currency: form.currency,
          special_requests: form.special_requests || undefined,
          internal_notes: form.internal_notes || undefined,
        },
      }).unwrap();
      toast.success('Booking updated successfully');
      setFormOverrides(null);
    } catch {
      toast.error('Failed to update booking');
    }
  };

  const handleStatusUpdate = async () => {
    if (!bookingId || !statusValue || statusValue === booking?.status) return;
    try {
      await updateBookingStatus({ id: bookingId, status: statusValue }).unwrap();
      toast.success('Booking status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleCreateQuotation = async () => {
    if (!bookingId) return;
    try {
      await createQuotation(bookingId).unwrap();
      toast.success('Quotation created from booking');
    } catch {
      toast.error('Failed to create quotation');
    }
  };

  const handleCreateInvoice = async () => {
    if (!bookingId) return;
    try {
      await createInvoice(bookingId).unwrap();
      toast.success('Invoice created from booking');
    } catch {
      toast.error('Failed to create invoice');
    }
  };

  if (!hasPermission(Permissions.BOOKINGS_VIEW)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You do not have permission to view this booking.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Booking not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/bookings')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title={`Booking ${booking.reference}`}
          description={`Created ${formatDate(booking.created_at)}`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Booking Info Card (read-only) */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Reference</p>
              <p className="text-sm">{booking.reference}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <StatusBadge status={booking.status} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Booking Date</p>
              <p className="text-sm">{formatDate(booking.booking_date)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Created</p>
              <p className="text-sm">{formatDateTime(booking.created_at)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Customer</p>
              {booking.customer ? (
                <Link
                  to={`/customers/${booking.customer.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  {booking.customer.first_name} {booking.customer.last_name}
                </Link>
              ) : (
                <p className="text-sm text-muted-foreground">{'\u2014'}</p>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Tour</p>
              <p className="text-sm">{booking.tour?.title ?? '\u2014'}</p>
            </div>
            {booking.inquiry_id && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Inquiry</p>
                <p className="text-sm text-muted-foreground">{booking.inquiry_id}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Details Card (editable) */}
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="adults">Adults</Label>
                <Input
                  id="adults"
                  type="number"
                  min="1"
                  value={form.number_of_adults ?? 1}
                  onChange={(e) => updateField('number_of_adults', parseInt(e.target.value, 10) || 1)}
                  disabled={!canEdit}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="children">Children</Label>
                <Input
                  id="children"
                  type="number"
                  min="0"
                  value={form.number_of_children ?? 0}
                  onChange={(e) => updateField('number_of_children', parseInt(e.target.value, 10) || 0)}
                  disabled={!canEdit}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total_amount">Total Amount</Label>
                <Input
                  id="total_amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.total_amount ?? ''}
                  onChange={(e) => updateField('total_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
                  disabled={!canEdit}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={form.currency ?? 'USD'}
                  onChange={(e) => updateField('currency', e.target.value)}
                  disabled={!canEdit}
                  placeholder="USD"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="special_requests">Special Requests</Label>
              <Textarea
                id="special_requests"
                value={(form.special_requests as string) ?? ''}
                onChange={(e) => updateField('special_requests', e.target.value)}
                disabled={!canEdit}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="internal_notes">Internal Notes</Label>
              <Textarea
                id="internal_notes"
                value={(form.internal_notes as string) ?? ''}
                onChange={(e) => updateField('internal_notes', e.target.value)}
                disabled={!canEdit}
                rows={3}
              />
            </div>
            {canEdit && (
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isUpdating || !isDirty}>
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Update */}
            {canEdit && (
              <div className="space-y-3">
                <Label>Update Status</Label>
                <div className="flex items-center gap-2">
                  <Select value={statusValue} onValueChange={setStatusOverride}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleStatusUpdate}
                    disabled={isUpdatingStatus || statusValue === booking.status}
                    size="sm"
                  >
                    {isUpdatingStatus ? 'Updating...' : 'Update'}
                  </Button>
                </div>
              </div>
            )}

            {/* Quotation */}
            <div className="space-y-3">
              <Label>Quotation</Label>
              {booking.quotation ? (
                <Link
                  to={`/quotations/${booking.quotation.id}`}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <FileText className="h-4 w-4" />
                  {booking.quotation.reference}
                </Link>
              ) : canEdit ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCreateQuotation}
                  disabled={isCreatingQuotation}
                >
                  <FileText className="h-4 w-4" />
                  {isCreatingQuotation ? 'Creating...' : 'Create Quotation'}
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">No quotation linked</p>
              )}
            </div>

            {/* Invoice */}
            <div className="space-y-3">
              <Label>Invoice</Label>
              {booking.invoice ? (
                <Link
                  to={`/invoices/${booking.invoice.id}`}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Receipt className="h-4 w-4" />
                  {booking.invoice.invoice_number}
                </Link>
              ) : canEdit ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCreateInvoice}
                  disabled={isCreatingInvoice}
                >
                  <Receipt className="h-4 w-4" />
                  {isCreatingInvoice ? 'Creating...' : 'Create Invoice'}
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">No invoice linked</p>
              )}
            </div>

            {/* Display amount summary */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Guests</span>
                <span>{booking.number_of_adults} adults, {booking.number_of_children} children</span>
              </div>
              <div className="flex items-center justify-between text-sm font-medium">
                <span className="text-muted-foreground">Total</span>
                <span>{formatCurrency(booking.total_amount, booking.currency)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
