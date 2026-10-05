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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableRow, TableCell } from '@/components/ui/table';

import {
  useListToursQuery,
  useDeleteTourMutation,
  useListCategoriesQuery,
} from '@/services/tours/toursApi';
import type { Tour } from '@/types/tour';

const columns = [
  { key: 'title', header: 'Title' },
  { key: 'category', header: 'Category' },
  { key: 'destination', header: 'Destination' },
  { key: 'price', header: 'Price' },
  { key: 'status', header: 'Status' },
  { key: 'actions', header: '', className: 'w-[50px]' },
];

export default function ToursListPage() {
  const { hasPermission } = usePermissions();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [deleteTour, setDeleteTour] = useState<Tour | null>(null);

  const { data, isLoading, isFetching } = useListToursQuery({
    search: search || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    category_id: categoryFilter === 'all' ? undefined : categoryFilter,
    page,
    per_page: 20,
  });

  const { data: categoriesData } = useListCategoriesQuery();
  const [deleteTourMutation, { isLoading: isDeleting }] = useDeleteTourMutation();

  const handleDelete = async () => {
    if (!deleteTour) return;
    try {
      await deleteTourMutation(deleteTour.id).unwrap();
      toast.success('Tour deleted successfully');
      setDeleteTour(null);
    } catch {
      toast.error('Failed to delete tour');
    }
  };

  if (!hasPermission(Permissions.TOURS_VIEW)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You do not have permission to view tours.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tours"
        description="Manage your tour packages"
        action={
          hasPermission(Permissions.TOURS_MANAGE) ? (
            <Button asChild>
              <Link to="/tours/create">
                <Plus className="h-4 w-4" />
                Create Tour
              </Link>
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
          placeholder="Search tours..."
          className="w-full max-w-sm"
        />
        <Select
          value={statusFilter}
          onValueChange={(val) => {
            setStatusFilter(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={categoryFilter}
          onValueChange={(val) => {
            setCategoryFilter(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categoriesData?.categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable<Tour>
        columns={columns}
        data={data?.tours}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage="No tours found"
        emptyDescription="Try adjusting your search or filters, or create a new tour."
        page={page}
        totalPages={data?.pages}
        onPageChange={setPage}
        renderRow={(tour) => (
          <TableRow key={tour.id}>
            <TableCell className="font-medium">
              <Link to={`/tours/${tour.id}`} className="hover:underline">
                {tour.title}
              </Link>
            </TableCell>
            <TableCell>
              {tour.categories.length ? tour.categories.map((c) => c.name).join(', ') : '\u2014'}
            </TableCell>
            <TableCell>
              {tour.destinations.length ? tour.destinations.map((d) => d.name).join(', ') : '\u2014'}
            </TableCell>
            <TableCell>
              {tour.price != null
                ? `${tour.currency} ${tour.price.toLocaleString()}`
                : '\u2014'}
            </TableCell>
            <TableCell>
              <StatusBadge status={tour.status} />
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
                    <Link to={`/tours/${tour.id}`}>
                      <Eye className="h-4 w-4" />
                      View
                    </Link>
                  </DropdownMenuItem>
                  {hasPermission(Permissions.TOURS_MANAGE) && (
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setDeleteTour(tour)}
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

      <ConfirmDialog
        open={!!deleteTour}
        onOpenChange={(open) => !open && setDeleteTour(null)}
        title="Delete Tour"
        description={`Are you sure you want to delete "${deleteTour?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
