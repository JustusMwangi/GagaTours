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
  useListInquiriesQuery,
  useCreateInquiryMutation,
} from '@/services/inquiries/inquiriesApi';
import { formatDate } from '@/lib/utils';
import type { Inquiry, InquiryStatus } from '@/types/inquiry';

const columns = [
  { key: 'reference', header: 'Reference' },
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'tour', header: 'Tour' },
  { key: 'status', header: 'Status' },
  { key: 'source', header: 'Source' },
  { key: 'date', header: 'Date' },
  { key: 'actions', header: '', className: 'w-[50px]' },
];

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'converted', label: 'Converted' },
  { value: 'closed', label: 'Closed' },
];

const SOURCE_OPTIONS = [
  { value: 'website', label: 'Website' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'referral', label: 'Referral' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'other', label: 'Other' },
];

interface CreateFormState {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  tour_id: string;
  message: string;
  travel_date: string;
  group_size_adults: string;
  source: string;
}

const initialFormState: CreateFormState = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  tour_id: '',
  message: '',
  travel_date: '',
  group_size_adults: '1',
  source: 'website',
};

export default function InquiriesListPage() {
  const { hasPermission } = usePermissions();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<CreateFormState>(initialFormState);

  const statusParam = statusFilter === 'all' ? undefined : (statusFilter as InquiryStatus);

  const { data, isLoading, isFetching } = useListInquiriesQuery({
    search: search || undefined,
    status: statusParam,
    page,
    per_page: 20,
  });

  const [createInquiry, { isLoading: isCreating }] = useCreateInquiryMutation();

  const handleCreate = async () => {
    if (!form.first_name.trim() || !form.last_name.trim() || !form.email.trim()) {
      toast.error('First name, last name, and email are required');
      return;
    }
    try {
      await createInquiry({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone || undefined,
        tour_id: form.tour_id || undefined,
        message: form.message || undefined,
        travel_date: form.travel_date || undefined,
        group_size_adults: form.group_size_adults ? Number(form.group_size_adults) : undefined,
        source: form.source || undefined,
      }).unwrap();
      toast.success('Inquiry created successfully');
      setAddOpen(false);
      setForm(initialFormState);
    } catch {
      toast.error('Failed to create inquiry');
    }
  };

  const updateField = (field: keyof CreateFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (!hasPermission(Permissions.INQUIRIES_VIEW)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You do not have permission to view inquiries.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inquiries"
        description="Manage customer inquiries and leads"
        action={
          hasPermission(Permissions.INQUIRIES_MANAGE) ? (
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Inquiry
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
          placeholder="Search by name, email, or reference..."
          className="w-full max-w-sm"
        />
        <Select
          value={statusFilter}
          onValueChange={(val) => {
            setStatusFilter(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[170px]">
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

      <DataTable<Inquiry>
        columns={columns}
        data={data?.inquiries}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage="No inquiries found"
        emptyDescription="Try adjusting your search or filters."
        page={page}
        totalPages={data?.pages}
        onPageChange={setPage}
        renderRow={(inquiry) => (
          <TableRow key={inquiry.id}>
            <TableCell className="font-medium">
              <Link
                to={`/inquiries/${inquiry.id}`}
                className="text-primary hover:underline"
              >
                {inquiry.reference}
              </Link>
            </TableCell>
            <TableCell>
              {inquiry.first_name} {inquiry.last_name}
            </TableCell>
            <TableCell>{inquiry.email}</TableCell>
            <TableCell>{inquiry.tour_id ?? '—'}</TableCell>
            <TableCell>
              <StatusBadge status={inquiry.status} />
            </TableCell>
            <TableCell>{inquiry.source}</TableCell>
            <TableCell>{formatDate(inquiry.created_at)}</TableCell>
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
                    <Link to={`/inquiries/${inquiry.id}`}>
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

      {/* Add Inquiry Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Inquiry</DialogTitle>
            <DialogDescription>
              Create a new customer inquiry manually.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={form.first_name}
                  onChange={(e) => updateField('first_name', e.target.value)}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={form.last_name}
                  onChange={(e) => updateField('last_name', e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+254 700 000 000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tour_id">Tour ID</Label>
              <Input
                id="tour_id"
                value={form.tour_id}
                onChange={(e) => updateField('tour_id', e.target.value)}
                placeholder="Tour UUID (optional)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="travel_date">Travel Date</Label>
                <Input
                  id="travel_date"
                  type="date"
                  value={form.travel_date}
                  onChange={(e) => updateField('travel_date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="group_size_adults">Adults</Label>
                <Input
                  id="group_size_adults"
                  type="number"
                  min="1"
                  value={form.group_size_adults}
                  onChange={(e) => updateField('group_size_adults', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Select
                value={form.source}
                onValueChange={(val) => updateField('source', val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select source" />
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
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(e) => updateField('message', e.target.value)}
                placeholder="Customer's message or notes..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create Inquiry'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
