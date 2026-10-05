import { useState } from 'react';
import { Link } from 'react-router';
import { MoreHorizontal, Plus, Eye } from 'lucide-react';
import { toast } from 'sonner';

import { usePermissions, Permissions } from '@/hooks/usePermissions';
import { PageHeader } from '@/components/shared/PageHeader';
import { SearchInput } from '@/components/shared/SearchInput';
import { DataTable } from '@/components/shared/DataTable';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableRow, TableCell } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

import {
  useListBookingsQuery,
  useCreateBookingMutation,
} from '@/services/bookings/bookingsApi';
import { formatDate } from '@/lib/utils';
import type { Booking, CreateBookingRequest } from '@/types/booking';

const columns = [
  { key: 'reference', header: 'Reference' },
  { key: 'customer', header: 'Customer' },
  { key: 'tour', header: 'Tour' },
  { key: 'amount', header: 'Amount' },
  { key: 'status', header: 'Status' },
  { key: 'date', header: 'Date' },
  { key: 'actions', header: '', className: 'w-[50px]' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

interface BookingFormState {
  customer_id: string;
  tour_id: string;
  number_of_adults: string;
  number_of_children: string;
  total_amount: string;
  special_requests: string;
}

const EMPTY_FORM: BookingFormState = {
  customer_id: '',
  tour_id: '',
  number_of_adults: '1',
  number_of_children: '0',
  total_amount: '',
  special_requests: '',
};

function formatCurrency(amount: number | null, currency: string): string {
  if (amount === null || amount === undefined) return '\u2014';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(amount);
}

export default function BookingsListPage() {
  const { hasPermission } = usePermissions();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<BookingFormState>({ ...EMPTY_FORM });

  const { data, isLoading, isFetching } = useListBookingsQuery({
    search: search || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    page,
    per_page: 20,
  });

  const [createBooking, { isLoading: isCreating }] = useCreateBookingMutation();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_id.trim()) {
      toast.error('Customer ID is required');
      return;
    }
    try {
      const payload: CreateBookingRequest = {
        customer_id: form.customer_id,
        tour_id: form.tour_id || undefined,
        number_of_adults: parseInt(form.number_of_adults, 10) || 1,
        number_of_children: parseInt(form.number_of_children, 10) || 0,
        total_amount: form.total_amount ? parseFloat(form.total_amount) : undefined,
        special_requests: form.special_requests || undefined,
      };
      await createBooking(payload).unwrap();
      toast.success('Booking created successfully');
      setAddOpen(false);
      setForm({ ...EMPTY_FORM });
    } catch {
      toast.error('Failed to create booking');
    }
  };

  if (!hasPermission(Permissions.BOOKINGS_VIEW)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You do not have permission to view bookings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bookings"
        description="Manage tour bookings"
        action={
          hasPermission(Permissions.BOOKINGS_MANAGE) ? (
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Booking
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
          placeholder="Search by reference..."
          className="w-full max-w-sm"
        />
        <Select
          value={statusFilter}
          onValueChange={(val) => {
            setStatusFilter(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter status" />
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

      <DataTable<Booking>
        columns={columns}
        data={data?.bookings}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage="No bookings found"
        emptyDescription="Try adjusting your search or filters."
        page={page}
        totalPages={data?.pages}
        onPageChange={setPage}
        renderRow={(booking) => (
          <TableRow key={booking.id}>
            <TableCell className="font-medium">
              <Link to={`/bookings/${booking.id}`} className="hover:underline">
                {booking.reference}
              </Link>
            </TableCell>
            <TableCell>{booking.customer_id ?? '\u2014'}</TableCell>
            <TableCell>{booking.tour_id ?? '\u2014'}</TableCell>
            <TableCell>{formatCurrency(booking.total_amount, booking.currency)}</TableCell>
            <TableCell>
              <StatusBadge status={booking.status} />
            </TableCell>
            <TableCell>{formatDate(booking.booking_date)}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-xs">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={`/bookings/${booking.id}`}>
                      <Eye className="h-4 w-4" />
                      View
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        )}
      />

      {/* Add Booking Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Booking</DialogTitle>
            <DialogDescription>
              Create a new tour booking.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-customer-id">Customer ID *</Label>
              <Input
                id="add-customer-id"
                value={form.customer_id}
                onChange={(e) => setForm((prev) => ({ ...prev, customer_id: e.target.value }))}
                placeholder="Enter customer ID"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-tour-id">Tour ID</Label>
              <Input
                id="add-tour-id"
                value={form.tour_id}
                onChange={(e) => setForm((prev) => ({ ...prev, tour_id: e.target.value }))}
                placeholder="Enter tour ID"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-adults">Adults</Label>
                <Input
                  id="add-adults"
                  type="number"
                  min="1"
                  value={form.number_of_adults}
                  onChange={(e) => setForm((prev) => ({ ...prev, number_of_adults: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-children">Children</Label>
                <Input
                  id="add-children"
                  type="number"
                  min="0"
                  value={form.number_of_children}
                  onChange={(e) => setForm((prev) => ({ ...prev, number_of_children: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-amount">Total Amount</Label>
              <Input
                id="add-amount"
                type="number"
                step="0.01"
                min="0"
                value={form.total_amount}
                onChange={(e) => setForm((prev) => ({ ...prev, total_amount: e.target.value }))}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-special-requests">Special Requests</Label>
              <Textarea
                id="add-special-requests"
                value={form.special_requests}
                onChange={(e) => setForm((prev) => ({ ...prev, special_requests: e.target.value }))}
                placeholder="Any special requests or notes..."
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create Booking'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
