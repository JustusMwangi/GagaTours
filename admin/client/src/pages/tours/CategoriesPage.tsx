import { useState } from 'react';
import { MoreHorizontal, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { usePermissions, Permissions } from '@/hooks/usePermissions';
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
  useListCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '@/services/tours/toursApi';
import type { TourCategory } from '@/types/tour';

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'slug', header: 'Slug' },
  { key: 'status', header: 'Status' },
  { key: 'actions', header: '', className: 'w-[50px]' },
];

interface CategoryFormState {
  name: string;
  description: string;
  is_active: boolean;
}

const emptyForm: CategoryFormState = {
  name: '',
  description: '',
  is_active: true,
};

export default function CategoriesPage() {
  const { hasPermission } = usePermissions();
  const canManage = hasPermission(Permissions.TOURS_MANAGE);

  const { data, isLoading, isFetching } = useListCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TourCategory | null>(null);
  const [form, setForm] = useState<CategoryFormState>(emptyForm);
  const [deleteCat, setDeleteCat] = useState<TourCategory | null>(null);

  const openCreate = () => {
    setEditingCategory(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (cat: TourCategory) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      description: cat.description ?? '',
      is_active: cat.is_active,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          data: {
            name: form.name,
            description: form.description || undefined,
            is_active: form.is_active,
          },
        }).unwrap();
        toast.success('Category updated');
      } else {
        await createCategory({
          name: form.name,
          description: form.description || undefined,
          is_active: form.is_active,
        }).unwrap();
        toast.success('Category created');
      }
      setDialogOpen(false);
    } catch {
      toast.error(editingCategory ? 'Failed to update category' : 'Failed to create category');
    }
  };

  const handleDelete = async () => {
    if (!deleteCat) return;
    try {
      await deleteCategory(deleteCat.id).unwrap();
      toast.success('Category deleted');
      setDeleteCat(null);
    } catch {
      toast.error('Failed to delete category');
    }
  };

  if (!hasPermission(Permissions.TOURS_VIEW)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You do not have permission to view categories.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tour Categories"
        description="Organize tours by category"
        action={
          canManage ? (
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          ) : undefined
        }
      />

      <DataTable<TourCategory>
        columns={columns}
        data={data?.categories}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage="No categories found"
        emptyDescription="Create your first tour category to get started."
        page={1}
        totalPages={1}
        onPageChange={() => {}}
        renderRow={(cat) => (
          <TableRow key={cat.id}>
            <TableCell className="font-medium">{cat.name}</TableCell>
            <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
            <TableCell>
              <StatusBadge status={cat.is_active ? 'active' : 'inactive'} />
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
                    <DropdownMenuItem onClick={() => openEdit(cat)}>
                      <Pencil className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setDeleteCat(cat)}
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
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'Update the category details below.'
                : 'Fill in the details to create a new category.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Name</Label>
              <Input
                id="cat-name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Safari Tours"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea
                id="cat-desc"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Optional description"
                rows={3}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="cat-active"
                checked={form.is_active}
                onCheckedChange={(checked) => setForm((p) => ({ ...p, is_active: checked }))}
              />
              <Label htmlFor="cat-active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isCreating || isUpdating}>
              {(isCreating || isUpdating)
                ? 'Saving...'
                : editingCategory
                  ? 'Update'
                  : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteCat}
        onOpenChange={(open) => !open && setDeleteCat(null)}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteCat?.name}"? Tours using this category will be unlinked.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
