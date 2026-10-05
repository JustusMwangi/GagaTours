import { useState } from 'react';
import { Link } from 'react-router';
import { MoreHorizontal, Plus, Eye, Trash2, Shield } from 'lucide-react';
import { toast } from 'sonner';

import { usePermissions, Permissions } from '@/hooks/usePermissions';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableRow, TableCell } from '@/components/ui/table';

import { useListRolesQuery, useDeleteRoleMutation } from '@/services/rbac/rbacApi';
import type { Role } from '@/types/rbac';

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'description', header: 'Description' },
  { key: 'type', header: 'Type' },
  { key: 'actions', header: '', className: 'w-[50px]' },
];

export default function RolesListPage() {
  const { hasPermission } = usePermissions();
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

  const { data, isLoading, isFetching } = useListRolesQuery();
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteRole(deleteTarget.id).unwrap();
      toast.success('Role deleted successfully');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete role');
    }
  };

  if (!hasPermission(Permissions.ROLES_VIEW)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You do not have permission to view roles.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Manage roles and their associated permissions"
        action={
          hasPermission(Permissions.ROLES_CREATE) ? (
            <Button asChild>
              <Link to="/roles/create">
                <Plus className="h-4 w-4" />
                Create Role
              </Link>
            </Button>
          ) : undefined
        }
      />

      <DataTable<Role>
        columns={columns}
        data={data?.roles}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage="No roles found"
        emptyDescription="Create a role to get started with access control."
        renderRow={(role) => (
          <TableRow key={role.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                {role.name}
              </div>
            </TableCell>
            <TableCell className="max-w-[300px]">
              <span className="line-clamp-1 text-muted-foreground">
                {role.description || 'No description'}
              </span>
            </TableCell>
            <TableCell>
              {role.is_system_role ? (
                <Badge variant="secondary">System</Badge>
              ) : (
                <Badge variant="outline">Custom</Badge>
              )}
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
                    <Link to={`/roles/${role.id}`}>
                      <Eye className="h-4 w-4" />
                      View
                    </Link>
                  </DropdownMenuItem>
                  {hasPermission(Permissions.ROLES_DELETE) && !role.is_system_role && (
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setDeleteTarget(role)}
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Role"
        description={`Are you sure you want to delete the "${deleteTarget?.name}" role? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
