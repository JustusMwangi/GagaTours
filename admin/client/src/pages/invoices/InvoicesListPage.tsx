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
  useListInvoicesQuery,
  useCreateInvoiceMutation,
} from '@/services/invoices/invoicesApi';
import { formatDate } from '@/lib/utils';
import type { Invoice, InvoiceStatus } from '@/types/invoice';

const columns = [
  { key: 'invoice_number', header: 'Invoice #' },
  { key: 'customer', header: 'Customer' },
  { key: 'amount', header: 'Amount' },
  { key: 'status', header: 'Status' },
  { key: 'due_date', header: 'Due Date' },
  { key: 'issued_date', header: 'Issued' },
  { key: 'actions', header: '', className: 'w-[50px]' },
];

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'paid', label: 'Paid' },
  { value: 'partially_paid', label: 'Partially Paid' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'cancelled', label: 'Cancelled' },
];

interface CreateFormState {
  customer_id: string;
  subtotal: string;
  tax_amount: string;
  discount_amount: string;
  total_amount: string;
  currency: string;
  due_date: string;
  notes: string;
}

const initialFormState: CreateFormState = {
  customer_id: '',
  subtotal: '',
  tax_amount: '0',
  discount_amount: '0',
  total_amount: '',
  currency: 'USD',
  due_date: '',
  notes: '',
};

function formatAmount(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function InvoicesListPage() {
  const { hasPermission } = usePermissions();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<CreateFormState>(initialFormState);

  const statusParam = statusFilter === 'all' ? undefined : (statusFilter as InvoiceStatus);

  const { data, isLoading, isFetching } = useListInvoicesQuery({
    search: search || undefined,
    status: statusParam,
    page,
    per_page: 20,
  });

  const [createInvoice, { isLoading: isCreating }] = useCreateInvoiceMutation();

  const handleCreate = async () => {
    if (!form.customer_id.trim()) {
      toast.error('Customer ID is required');
      return;
    }
    try {
      await createInvoice({
        customer_id: form.customer_id,
        subtotal: form.subtotal ? Number(form.subtotal) : undefined,
        tax_amount: form.tax_amount ? Number(form.tax_amount) : undefined,
        discount_amount: form.discount_amount ? Number(form.discount_amount) : undefined,
        total_amount: form.total_amount ? Number(form.total_amount) : undefined,
        currency: form.currency || undefined,
        due_date: form.due_date || undefined,
        notes: form.notes || undefined,
      }).unwrap();
      toast.success('Invoice created successfully');
      setAddOpen(false);
      setForm(initialFormState);
    } catch {
      toast.error('Failed to create invoice');
    }
  };

  const updateField = (field: keyof CreateFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (!hasPermission(Permissions.INVOICES_VIEW)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You do not have permission to view invoices.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="Manage invoices and track payments"
        action={
          hasPermission(Permissions.INVOICES_MANAGE) ? (
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" />
              Create Invoice
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
          placeholder="Search by invoice number..."
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

      <DataTable<Invoice>
        columns={columns}
        data={data?.invoices}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage="No invoices found"
        emptyDescription="Try adjusting your search or filters."
        page={page}
        totalPages={data?.pages}
        onPageChange={setPage}
        renderRow={(invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">
              <Link
                to={`/invoices/${invoice.id}`}
                className="text-primary hover:underline"
              >
                {invoice.invoice_number}
              </Link>
            </TableCell>
            <TableCell>{invoice.customer_id ?? '—'}</TableCell>
            <TableCell>{formatAmount(invoice.total_amount, invoice.currency)}</TableCell>
            <TableCell>
              <StatusBadge status={invoice.status} />
            </TableCell>
            <TableCell>{formatDate(invoice.due_date)}</TableCell>
            <TableCell>{formatDate(invoice.issued_date)}</TableCell>
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
                    <Link to={`/invoices/${invoice.id}`}>
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

      {/* Create Invoice Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
            <DialogDescription>
              Create a new invoice for a customer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <div className="space-y-2">
              <Label htmlFor="customer_id">Customer ID *</Label>
              <Input
                id="customer_id"
                value={form.customer_id}
                onChange={(e) => updateField('customer_id', e.target.value)}
                placeholder="Customer UUID"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subtotal">Subtotal</Label>
                <Input
                  id="subtotal"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.subtotal}
                  onChange={(e) => updateField('subtotal', e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax_amount">Tax Amount</Label>
                <Input
                  id="tax_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.tax_amount}
                  onChange={(e) => updateField('tax_amount', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discount_amount">Discount Amount</Label>
                <Input
                  id="discount_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.discount_amount}
                  onChange={(e) => updateField('discount_amount', e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_amount">Total Amount</Label>
                <Input
                  id="total_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.total_amount}
                  onChange={(e) => updateField('total_amount', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={form.currency}
                  onChange={(e) => updateField('currency', e.target.value)}
                  placeholder="USD"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={form.due_date}
                  onChange={(e) => updateField('due_date', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Invoice notes..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create Invoice'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
