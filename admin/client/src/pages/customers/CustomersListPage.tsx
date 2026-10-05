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

import {
  useListCustomersQuery,
  useCreateCustomerMutation,
  useDeleteCustomerMutation,
} from '@/services/customers/customersApi';
import type { Customer, CreateCustomerRequest } from '@/types/customer';

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'phone', header: 'Phone' },
  { key: 'source', header: 'Source' },
  { key: 'status', header: 'Status' },
  { key: 'actions', header: '', className: 'w-[50px]' },
];

const SOURCE_OPTIONS = [
  { value: 'all', label: 'All Sources' },
  { value: 'direct', label: 'Direct' },
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'agent', label: 'Agent' },
  { value: 'social_media', label: 'Social Media' },
];

const EMPTY_FORM: CreateCustomerRequest = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  nationality: '',
  source: 'direct',
};

export default function CustomersListPage() {
  const { hasPermission } = usePermissions();
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [form, setForm] = useState<CreateCustomerRequest>({ ...EMPTY_FORM });

  const { data, isLoading, isFetching } = useListCustomersQuery({
    search: search || undefined,
    source: sourceFilter === 'all' ? undefined : sourceFilter,
    page,
    per_page: 20,
  });

  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
  const [deleteCustomer, { isLoading: isDeleting }] = useDeleteCustomerMutation();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name.trim() || !form.last_name.trim()) {
      toast.error('First name and last name are required');
      return;
    }
    try {
      await createCustomer({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email || undefined,
        phone: form.phone || undefined,
        nationality: form.nationality || undefined,
        source: form.source || undefined,
      }).unwrap();
      toast.success('Customer created successfully');
      setAddOpen(false);
      setForm({ ...EMPTY_FORM });
    } catch {
      toast.error('Failed to create customer');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCustomer(deleteTarget.id).unwrap();
      toast.success('Customer deleted successfully');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete customer');
    }
  };

  if (!hasPermission(Permissions.CUSTOMERS_VIEW)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You do not have permission to view customers.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage your customer database"
        action={
          hasPermission(Permissions.CUSTOMERS_MANAGE) ? (
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Customer
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
          placeholder="Search by name or email..."
          className="w-full max-w-sm"
        />
        <Select
          value={sourceFilter}
          onValueChange={(val) => {
            setSourceFilter(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter source" />
          </SelectTrigger>
          <SelectContent>
            {SOURCE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable<Customer>
        columns={columns}
        data={data?.customers}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage="No customers found"
        emptyDescription="Try adjusting your search or filters."
        page={page}
        totalPages={data?.pages}
        onPageChange={setPage}
        renderRow={(customer) => (
          <TableRow key={customer.id}>
            <TableCell className="font-medium">
              <Link to={`/customers/${customer.id}`} className="hover:underline">
                {customer.first_name} {customer.last_name}
              </Link>
            </TableCell>
            <TableCell>{customer.email ?? '\u2014'}</TableCell>
            <TableCell>{customer.phone ?? '\u2014'}</TableCell>
            <TableCell className="capitalize">{customer.source.replace('_', ' ')}</TableCell>
            <TableCell>
              <StatusBadge status={customer.is_active ? 'active' : 'inactive'} />
            </TableCell>
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
                    <Link to={`/customers/${customer.id}`}>
                      <Eye className="h-4 w-4" />
                      View
                    </Link>
                  </DropdownMenuItem>
                  {hasPermission(Permissions.CUSTOMERS_MANAGE) && (
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setDeleteTarget(customer)}
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

      {/* Add Customer Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Customer</DialogTitle>
            <DialogDescription>
              Create a new customer record.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-first-name">First Name *</Label>
                <Input
                  id="add-first-name"
                  value={form.first_name}
                  onChange={(e) => setForm((prev) => ({ ...prev, first_name: e.target.value }))}
                  placeholder="First name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-last-name">Last Name *</Label>
                <Input
                  id="add-last-name"
                  value={form.last_name}
                  onChange={(e) => setForm((prev) => ({ ...prev, last_name: e.target.value }))}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-email">Email</Label>
              <Input
                id="add-email"
                type="email"
                value={form.email ?? ''}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="customer@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-phone">Phone</Label>
              <Input
                id="add-phone"
                value={form.phone ?? ''}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 234 567 890"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-nationality">Nationality</Label>
              <Input
                id="add-nationality"
                value={form.nationality ?? ''}
                onChange={(e) => setForm((prev) => ({ ...prev, nationality: e.target.value }))}
                placeholder="e.g. American"
              />
            </div>
            <div className="space-y-2">
              <Label>Source</Label>
              <Select
                value={form.source ?? 'direct'}
                onValueChange={(val) => setForm((prev) => ({ ...prev, source: val }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {SOURCE_OPTIONS.filter((o) => o.value !== 'all').map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create Customer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Customer"
        description={`Are you sure you want to delete ${deleteTarget?.first_name} ${deleteTarget?.last_name}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
