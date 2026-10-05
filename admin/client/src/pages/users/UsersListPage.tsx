import { useState } from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MoreHorizontal, Plus, Eye, UserX } from 'lucide-react';
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

import { useListUsersQuery, useDeactivateUserMutation, useInviteUserMutation } from '@/services/users/usersApi';
import { useListRolesQuery } from '@/services/rbac/rbacApi';
import { inviteUserSchema, type InviteUserFormValues } from '@/lib/validations/users';
import { formatDate } from '@/lib/utils';
import type { UserBasic } from '@/types/user';

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'status', header: 'Status' },
  { key: 'joined', header: 'Joined' },
  { key: 'actions', header: '', className: 'w-[50px]' },
];

export default function UsersListPage() {
  const { hasPermission } = usePermissions();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [deactivateUser, setDeactivateUser] = useState<UserBasic | null>(null);

  const isActiveParam = statusFilter === 'all' ? undefined : statusFilter === 'active';

  const { data, isLoading, isFetching } = useListUsersQuery({
    search: search || undefined,
    is_active: isActiveParam,
    page,
    per_page: 20,
  });

  const [deactivateUserMutation, { isLoading: isDeactivating }] = useDeactivateUserMutation();
  const [inviteUserMutation, { isLoading: isInviting }] = useInviteUserMutation();
  const { data: rolesData } = useListRolesQuery();

  const inviteForm = useForm<InviteUserFormValues>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: '',
      role_id: undefined,
    },
  });

  const handleInvite = async (values: InviteUserFormValues) => {
    try {
      await inviteUserMutation({ email: values.email, role_id: values.role_id }).unwrap();
      toast.success('Invitation sent successfully');
      setInviteOpen(false);
      inviteForm.reset();
    } catch {
      toast.error('Failed to send invitation');
    }
  };

  const handleDeactivate = async () => {
    if (!deactivateUser) return;
    try {
      await deactivateUserMutation(deactivateUser.id).unwrap();
      toast.success('User deactivated successfully');
      setDeactivateUser(null);
    } catch {
      toast.error('Failed to deactivate user');
    }
  };

  if (!hasPermission(Permissions.USERS_VIEW)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You do not have permission to view users.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage users in your organization"
        action={
          hasPermission(Permissions.USERS_CREATE) ? (
            <Button onClick={() => setInviteOpen(true)}>
              <Plus className="h-4 w-4" />
              Invite User
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
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable<UserBasic>
        columns={columns}
        data={data?.users}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage="No users found"
        emptyDescription="Try adjusting your search or filters."
        page={page}
        totalPages={data?.pages}
        onPageChange={setPage}
        renderRow={(user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">
              {user.first_name} {user.last_name}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <StatusBadge status={user.is_active ? 'active' : 'inactive'} />
            </TableCell>
            <TableCell>{formatDate(user.created_at)}</TableCell>
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
                    <Link to={`/users/${user.id}`}>
                      <Eye className="h-4 w-4" />
                      View
                    </Link>
                  </DropdownMenuItem>
                  {hasPermission(Permissions.USERS_DELETE) && user.is_active && (
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setDeactivateUser(user)}
                    >
                      <UserX className="h-4 w-4" />
                      Deactivate
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        )}
      />

      {/* Invite User Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>
              Send an invitation email to add a new user to your organization.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={inviteForm.handleSubmit(handleInvite)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="user@example.com"
                {...inviteForm.register('email')}
                aria-invalid={!!inviteForm.formState.errors.email}
              />
              {inviteForm.formState.errors.email && (
                <p className="text-sm text-destructive">{inviteForm.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Role (optional)</Label>
              <Select
                value={inviteForm.watch('role_id') ?? ''}
                onValueChange={(val) => inviteForm.setValue('role_id', val || undefined)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {rolesData?.roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                The invited user will be assigned this role when they accept.
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setInviteOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isInviting}>
                {isInviting ? 'Sending...' : 'Send Invitation'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Deactivate Confirmation */}
      <ConfirmDialog
        open={!!deactivateUser}
        onOpenChange={(open) => !open && setDeactivateUser(null)}
        title="Deactivate User"
        description={`Are you sure you want to deactivate ${deactivateUser?.first_name} ${deactivateUser?.last_name}? They will no longer be able to sign in.`}
        confirmLabel="Deactivate"
        variant="destructive"
        isLoading={isDeactivating}
        onConfirm={handleDeactivate}
      />
    </div>
  );
}
