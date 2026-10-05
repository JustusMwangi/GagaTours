import { useState } from 'react';
import { MoreHorizontal, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { usePermissions, Permissions } from '@/hooks/usePermissions';
import { ImageUpload } from '@/components/shared/ImageUpload';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
  useListDestinationsQuery,
  useCreateDestinationMutation,
  useUpdateDestinationMutation,
  useDeleteDestinationMutation,
} from '@/services/tours/toursApi';
import type { Destination } from '@/types/tour';

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'country', header: 'Country' },
  { key: 'status', header: 'Status' },
  { key: 'actions', header: '', className: 'w-[50px]' },
];

interface DestinationFormState {
  name: string;
  country: string;
  description: string;
  image_url: string;
  is_active: boolean;
}

const emptyForm: DestinationFormState = {
  name: '',
  country: '',
  description: '',
  image_url: '',
  is_active: true,
};

export default function DestinationsPage() {
  const { hasPermission } = usePermissions();
  const canManage = hasPermission(Permissions.TOURS_MANAGE);

  const { data, isLoading, isFetching } = useListDestinationsQuery();
  const [createDestination, { isLoading: isCreating }] = useCreateDestinationMutation();
  const [updateDestination, { isLoading: isUpdating }] = useUpdateDestinationMutation();
  const [deleteDestination, { isLoading: isDeleting }] = useDeleteDestinationMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [form, setForm] = useState<DestinationFormState>(emptyForm);
  const [deleteDest, setDeleteDest] = useState<Destination | null>(null);

  const openCreate = () => {
    setEditingDest(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (dest: Destination) => {
    setEditingDest(dest);
    setForm({
      name: dest.name,
      country: dest.country ?? '',
      description: dest.description ?? '',
      image_url: dest.image_url ?? '',
      is_active: dest.is_active,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      if (editingDest) {
        await updateDestination({
          id: editingDest.id,
          data: {
            name: form.name,
            country: form.country || undefined,
            description: form.description || undefined,
            image_url: form.image_url || undefined,
            is_active: form.is_active,
          },
        }).unwrap();
        toast.success('Destination updated');
      } else {
        await createDestination({
          name: form.name,
          country: form.country || undefined,
          description: form.description || undefined,
          image_url: form.image_url || undefined,
          is_active: form.is_active,
        }).unwrap();
        toast.success('Destination created');
      }
      setDialogOpen(false);
    } catch {
      toast.error(editingDest ? 'Failed to update destination' : 'Failed to create destination');
    }
  };

  const handleDelete = async () => {
    if (!deleteDest) return;
    try {
      await deleteDestination(deleteDest.id).unwrap();
      toast.success('Destination deleted');
      setDeleteDest(null);
    } catch {
      toast.error('Failed to delete destination');
    }
  };

  if (!hasPermission(Permissions.TOURS_VIEW)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You do not have permission to view destinations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Destinations"
        description="Manage tour destinations"
        action={
          canManage ? (
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Add Destination
            </Button>
          ) : undefined
        }
      />

      <DataTable<Destination>
        columns={columns}
        data={data?.destinations}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage="No destinations found"
        emptyDescription="Create your first destination to get started."
        page={1}
        totalPages={1}
        onPageChange={() => {}}
        renderRow={(dest) => (
          <TableRow key={dest.id}>
            <TableCell className="font-medium">{dest.name}</TableCell>
            <TableCell>{dest.country ?? '\u2014'}</TableCell>
            <TableCell>
              <StatusBadge status={dest.is_active ? 'active' : 'inactive'} />
            </TableCell>
            <TableCell>
              {canManage && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-xs">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(dest)}>
                      <Pencil className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setDeleteDest(dest)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </TableCell>
          </TableRow>
        )}
      />

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDest ? 'Edit Destination' : 'Add Destination'}</DialogTitle>
            <DialogDescription>
              {editingDest
                ? 'Update the destination details below.'
                : 'Fill in the details to create a new destination.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dest-name">Name</Label>
              <Input
                id="dest-name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Serengeti National Park"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dest-country">Country</Label>
              <Input
                id="dest-country"
                value={form.country}
                onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                placeholder="e.g. Tanzania"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dest-desc">Description</Label>
              <Textarea
                id="dest-desc"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Optional description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              <ImageUpload
                value={form.image_url || undefined}
                onChange={(url) => setForm((p) => ({ ...p, image_url: url ?? '' }))}
                placeholder="Upload image"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="dest-active"
                checked={form.is_active}
                onCheckedChange={(checked) => setForm((p) => ({ ...p, is_active: checked }))}
              />
              <Label htmlFor="dest-active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isCreating || isUpdating}>
              {(isCreating || isUpdating)
                ? 'Saving...'
                : editingDest
                  ? 'Update'
                  : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteDest}
        onOpenChange={(open) => !open && setDeleteDest(null)}
        title="Delete Destination"
        description={`Are you sure you want to delete "${deleteDest?.name}"? Tours using this destination will be unlinked.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
