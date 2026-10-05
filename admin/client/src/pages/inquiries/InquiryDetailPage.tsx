import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';

import { usePermissions, Permissions } from '@/hooks/usePermissions';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router';

import {
  useGetInquiryQuery,
  useUpdateInquiryMutation,
  useConvertInquiryMutation,
} from '@/services/inquiries/inquiriesApi';
import {
  useListToursQuery,
  useListTourDatesQuery,
} from '@/services/tours/toursApi';
import { formatDate } from '@/lib/utils';
import type { InquiryStatus, ConvertInquiryRequest } from '@/types/inquiry';

const STATUS_OPTIONS: { value: InquiryStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'converted', label: 'Converted' },
  { value: 'closed', label: 'Closed' },
];

const initialConvertForm: ConvertInquiryRequest = {
  tour_id: '',
  tour_date_id: '',
  number_of_adults: undefined,
  number_of_children: undefined,
  total_amount: undefined,
  special_requests: '',
};

export default function InquiryDetailPage() {
  const { inquiryId } = useParams<{ inquiryId: string }>();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const { data: inquiry, isLoading } = useGetInquiryQuery(inquiryId!, { skip: !inquiryId });
  const [updateInquiry, { isLoading: isUpdating }] = useUpdateInquiryMutation();
  const [convertInquiry, { isLoading: isConverting }] = useConvertInquiryMutation();

  const canManage = hasPermission(Permissions.INQUIRIES_MANAGE);

  // Management form state
  const [status, setStatus] = useState<string>('');
  const [assignedTo, setAssignedTo] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [managementInitialized, setManagementInitialized] = useState(false);

  // Convert dialog
  const [convertOpen, setConvertOpen] = useState(false);
  const [convertForm, setConvertForm] = useState<ConvertInquiryRequest>(initialConvertForm);

  // Tour + date pickers for the convert dialog
  const { data: toursPage } = useListToursQuery(
    { per_page: 100, status: 'published' },
    { skip: !convertOpen },
  );
  const tours = toursPage?.tours ?? [];
  const effectiveTourId = convertForm.tour_id || inquiry?.tour?.id || '';
  const { data: tourDates, isFetching: datesLoading } = useListTourDatesQuery(
    effectiveTourId,
    { skip: !effectiveTourId || !convertOpen },
  );
  const today = new Date().toISOString().slice(0, 10);
  const availableDates = (tourDates ?? [])
    .filter((d) => d.status !== 'cancelled' && d.end_date >= today);

  // Initialize management fields when inquiry loads
  if (inquiry && !managementInitialized) {
    setStatus(inquiry.status);
    setAssignedTo(inquiry.assigned_to ?? '');
    setInternalNotes(inquiry.internal_notes ?? '');
    setManagementInitialized(true);
  }

  const handleSaveManagement = async () => {
    if (!inquiryId) return;
    try {
      await updateInquiry({
        id: inquiryId,
        data: {
          status: status as InquiryStatus,
          assigned_to: assignedTo || undefined,
          internal_notes: internalNotes || undefined,
        },
      }).unwrap();
      toast.success('Inquiry updated successfully');
    } catch {
      toast.error('Failed to update inquiry');
    }
  };

  const handleConvert = async () => {
    if (!inquiryId) return;
    try {
      const payload: ConvertInquiryRequest = {};
      if (effectiveTourId) payload.tour_id = effectiveTourId;
      if (convertForm.tour_date_id) payload.tour_date_id = convertForm.tour_date_id;
      if (convertForm.number_of_adults) payload.number_of_adults = Number(convertForm.number_of_adults);
      if (convertForm.number_of_children) payload.number_of_children = Number(convertForm.number_of_children);
      if (convertForm.total_amount) payload.total_amount = Number(convertForm.total_amount);
      if (convertForm.special_requests) payload.special_requests = convertForm.special_requests;

      const result = await convertInquiry({ id: inquiryId, data: payload }).unwrap();
      toast.success('Inquiry converted to booking successfully');
      setConvertOpen(false);
      // Navigate to the new booking if returned
      const booking = result as { booking_id?: string };
      if (booking?.booking_id) {
        navigate(`/bookings/${booking.booking_id}`);
      }
    } catch {
      toast.error('Failed to convert inquiry');
    }
  };

  if (!hasPermission(Permissions.INQUIRIES_VIEW)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You do not have permission to view this inquiry.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Inquiry not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/inquiries')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title={`Inquiry ${inquiry.reference}`}
          description={`${inquiry.first_name} ${inquiry.last_name} — ${inquiry.email}`}
        />
        <div className="ml-auto">
          <StatusBadge status={inquiry.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name</span>
                <p className="font-medium">{inquiry.first_name} {inquiry.last_name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email</span>
                <p className="font-medium">{inquiry.email}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Phone</span>
                <p className="font-medium">{inquiry.phone ?? '—'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Customer</span>
                <p className="font-medium">
                  {inquiry.customer ? (
                    <Link
                      to={`/customers/${inquiry.customer.id}`}
                      className="text-primary hover:underline"
                    >
                      {inquiry.customer.first_name} {inquiry.customer.last_name}
                    </Link>
                  ) : (
                    '—'
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inquiry Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Inquiry Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Tour</span>
                <p className="font-medium">
                  {inquiry.tour ? (
                    <Link
                      to={`/tours/${inquiry.tour.id}`}
                      className="text-primary hover:underline"
                    >
                      {inquiry.tour.title}
                    </Link>
                  ) : (
                    '—'
                  )}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Travel Date</span>
                <p className="font-medium">{formatDate(inquiry.travel_date)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Flexible Dates</span>
                <p className="font-medium">{inquiry.flexible_dates ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Group Size</span>
                <p className="font-medium">
                  {inquiry.group_size_adults} adults, {inquiry.group_size_children} children
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Budget</span>
                <p className="font-medium">
                  {inquiry.budget
                    ? `${inquiry.currency} ${inquiry.budget.toLocaleString()}`
                    : '—'}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Source</span>
                <p className="font-medium">{inquiry.source}</p>
              </div>
            </div>
            {inquiry.message && (
              <div className="text-sm pt-2 border-t">
                <span className="text-muted-foreground">Message</span>
                <p className="font-medium mt-1 whitespace-pre-wrap">{inquiry.message}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Management Card */}
        <Card>
          <CardHeader>
            <CardTitle>Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={setStatus}
                disabled={!canManage}
              >
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="assigned_to">Assigned To (User ID)</Label>
              <Input
                id="assigned_to"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="User UUID"
                disabled={!canManage}
              />
              {inquiry.assignee && (
                <p className="text-xs text-muted-foreground">
                  Currently: {inquiry.assignee.first_name} {inquiry.assignee.last_name}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="internal_notes">Internal Notes</Label>
              <Textarea
                id="internal_notes"
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                rows={3}
                placeholder="Internal notes about this inquiry..."
                disabled={!canManage}
              />
            </div>
            {canManage && (
              <div className="flex justify-end">
                <Button onClick={handleSaveManagement} disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Convert to Booking Card */}
        {canManage && inquiry.status !== 'converted' && (
          <Card>
            <CardHeader>
              <CardTitle>Convert to Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Convert this inquiry into a confirmed booking. This will create a new booking
                and optionally a customer record if one does not already exist.
              </p>
              <Button onClick={() => setConvertOpen(true)}>
                <ArrowRightLeft className="h-4 w-4" />
                Convert to Booking
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Convert to Booking Dialog */}
      <Dialog open={convertOpen} onOpenChange={setConvertOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Convert Inquiry to Booking</DialogTitle>
            <DialogDescription>
              Provide optional details for the new booking. Leave fields empty to use defaults
              from the inquiry.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tour</Label>
              <Select
                value={effectiveTourId}
                onValueChange={(v) =>
                  setConvertForm((prev) => ({ ...prev, tour_id: v, tour_date_id: '' }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a tour" />
                </SelectTrigger>
                <SelectContent>
                  {tours.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.title}
                      {t.destinations?.length ? ` — ${t.destinations.map((d) => d.name).join(', ')}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {inquiry.tour && effectiveTourId === inquiry.tour.id && (
                <p className="text-xs text-muted-foreground">From inquiry</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Departure Date</Label>
              <Select
                value={convertForm.tour_date_id ?? ''}
                onValueChange={(v) =>
                  setConvertForm((prev) => ({ ...prev, tour_date_id: v }))
                }
                disabled={!effectiveTourId || datesLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !effectiveTourId
                        ? 'Select a tour first'
                        : datesLoading
                          ? 'Loading…'
                          : availableDates.length === 0
                            ? 'No dates scheduled'
                            : 'Choose a date'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableDates.map((d) => {
                    const left =
                      d.max_spots != null ? d.max_spots - d.spots_booked : null;
                    return (
                      <SelectItem
                        key={d.id}
                        value={d.id}
                        disabled={d.status === 'full'}
                      >
                        {formatDate(d.start_date)} – {formatDate(d.end_date)}
                        {left != null ? ` · ${left} spot${left === 1 ? '' : 's'} left` : ''}
                        {d.status === 'full' ? ' · FULL' : ''}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="convert_adults">Number of Adults</Label>
                <Input
                  id="convert_adults"
                  type="number"
                  min="1"
                  value={convertForm.number_of_adults ?? ''}
                  onChange={(e) =>
                    setConvertForm((prev) => ({
                      ...prev,
                      number_of_adults: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  placeholder={String(inquiry.group_size_adults)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="convert_children">Number of Children</Label>
                <Input
                  id="convert_children"
                  type="number"
                  min="0"
                  value={convertForm.number_of_children ?? ''}
                  onChange={(e) =>
                    setConvertForm((prev) => ({
                      ...prev,
                      number_of_children: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  placeholder={String(inquiry.group_size_children)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="convert_amount">Total Amount</Label>
              <Input
                id="convert_amount"
                type="number"
                min="0"
                step="0.01"
                value={convertForm.total_amount ?? ''}
                onChange={(e) =>
                  setConvertForm((prev) => ({
                    ...prev,
                    total_amount: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="convert_special_requests">Special Requests</Label>
              <Textarea
                id="convert_special_requests"
                value={convertForm.special_requests ?? ''}
                onChange={(e) =>
                  setConvertForm((prev) => ({ ...prev, special_requests: e.target.value }))
                }
                rows={3}
                placeholder="Any special requests for the booking..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConvertOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConvert} disabled={isConverting}>
              {isConverting ? 'Converting...' : 'Convert to Booking'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
