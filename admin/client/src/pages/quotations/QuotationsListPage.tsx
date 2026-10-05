import { useState } from 'react';
import { Link } from 'react-router';
import { MoreHorizontal, Plus, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { usePermissions, Permissions } from '@/hooks/usePermissions';
import { PageHeader } from '@/components/shared/PageHeader';
import { SearchInput } from '@/components/shared/SearchInput';
import { DataTable } from '@/components/shared/DataTable';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
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
  useListQuotationsQuery,
  useCreateQuotationMutation,
  useDeleteQuotationMutation,
} from '@/services/quotations/quotationsApi';
import { useListCustomersQuery } from '@/services/customers/customersApi';
import { useListToursQuery } from '@/services/tours/toursApi';
import { formatDate } from '@/lib/utils';
import type { Quotation, QuotationStatus } from '@/types/quotation';

const columns = [
  { key: 'reference', header: 'Reference' },
  { key: 'customer', header: 'Customer' },
  { key: 'tour', header: 'Tour' },
  { key: 'amount', header: 'Amount' },
  { key: 'status', header: 'Status' },
  { key: 'valid_until', header: 'Valid Until' },
  { key: 'actions', header: '', className: 'w-[50px]' },
];

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'expired', label: 'Expired' },
  { value: 'converted', label: 'Converted' },
];

interface CreateFormState {
  customer_id: string;
  tour_id: string;
  total_amount: string;
  currency: string;
  valid_until: string;
  notes: string;
}

const initialCreateForm: CreateFormState = {
  customer_id: '',
  tour_id: '',
  total_amount: '',
  currency: 'USD',
  valid_until: '',
  notes: '',
};

export default function QuotationsListPage() {
  const { hasPermission } = usePermissions();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Quotation | null>(null);
  const [form, setForm] = useState<CreateFormState>(initialCreateForm);

  const statusParam = statusFilter === 'all' ? undefined : (statusFilter as QuotationStatus);

  const { data, isLoading, isFetching } = useListQuotationsQuery({
    search: search || undefined,
    status: statusParam,
    page,
    per_page: 20,
  });

  const [createQuotation, { isLoading: isCreating }] = useCreateQuotationMutation();
  const [deleteQuotation, { isLoading: isDeleting }] = useDeleteQuotationMutation();

  // Load customers and tours for the create dialog selectors
  const { data: customersData } = useListCustomersQuery(
    { page: 1, per_page: 100 },
    { skip: !createOpen },
  );
  const { data: toursData } = useListToursQuery(
    { page: 1, per_page: 100 },
    { skip: !createOpen },
  );

  const handleCreate = async () => {
    try {
      await createQuotation({
        customer_id: form.customer_id || undefined,
        tour_id: form.tour_id || undefined,
        total_amount: form.total_amount ? parseFloat(form.total_amount) : undefined,
        currency: form.currency || undefined,
        valid_until: form.valid_until || undefined,
        notes: form.notes || undefined,
      }).unwrap();
      toast.success('Quotation created successfully');
      setCreateOpen(false);
      setForm(initialCreateForm);
    } catch {
      toast.error('Failed to create quotation');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteQuotation(deleteTarget.id).unwrap();
      toast.success('Quotation deleted successfully');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete quotation');
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  if (!hasPermission(Permissions.QUOTATIONS_VIEW)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You do not have permission to view quotations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quotations"
        description="Manage quotations and proposals"
        action={
          hasPermission(Permissions.QUOTATIONS_MANAGE) ? (
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Quotation
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
          <SelectTrigger className="w-[160px]">
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

      <DataTable<Quotation>
        columns={columns}
        data={data?.quotations}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage="No quotations found"
        emptyDescription="Try adjusting your search or filters, or create a new quotation."
        page={page}
        totalPages={data?.pages}
        onPageChange={setPage}
        renderRow={(quotation) => (
          <TableRow key={quotation.id}>
            <TableCell className="font-medium">
              <Link
                to={`/quotations/${quotation.id}`}
                className="text-primary hover:underline"
              >
                {quotation.reference}
              </Link>
            </TableCell>
            <TableCell>
              {quotation.customer_id ? quotation.customer_id.slice(0, 8) + '...' : '\u2014'}
            </TableCell>
            <TableCell>
              {quotation.tour_id ? quotation.tour_id.slice(0, 8) + '...' : '\u2014'}
            </TableCell>
            <TableCell>{formatAmount(quotation.total_amount, quotation.currency)}</TableCell>
            <TableCell>
              <StatusBadge status={quotation.status} />
            </TableCell>
            <TableCell>{formatDate(quotation.valid_until)}</TableCell>
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
                    <Link to={`/quotations/${quotation.id}`}>
                      <Eye className="h-4 w-4" />
                      View
                    </Link>
                  </DropdownMenuItem>
                  {hasPermission(Permissions.QUOTATIONS_MANAGE) && (
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setDeleteTarget(quotation)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        )}
      />

      {/* Create Quotation Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Quotation</DialogTitle>
            <DialogDescription>
              Create a new quotation for a customer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Customer</Label>
              <Select
                value={form.customer_id}
                onValueChange={(val) => setForm((prev) => ({ ...prev, customer_id: val }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customersData?.customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.first_name} {c.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tour</Label>
              <Select
                value={form.tour_id}
                onValueChange={(val) => setForm((prev) => ({ ...prev, tour_id: val }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a tour" />
                </SelectTrigger>
                <SelectContent>
                  {toursData?.tours.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-amount">Total Amount</Label>
                <Input
                  id="create-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={form.total_amount}
                  onChange={(e) => setForm((prev) => ({ ...prev, total_amount: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-currency">Currency</Label>
                <Select
                  value={form.currency}
                  onValueChange={(val) => setForm((prev) => ({ ...prev, currency: val }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="KES">KES</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-valid-until">Valid Until</Label>
              <Input
                id="create-valid-until"
                type="date"
                value={form.valid_until}
                onChange={(e) => setForm((prev) => ({ ...prev, valid_until: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-notes">Notes</Label>
              <Textarea
                id="create-notes"
                placeholder="Additional notes..."
                rows={3}
                value={form.notes}
                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create Quotation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Quotation"
        description={`Are you sure you want to delete quotation "${deleteTarget?.reference}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
