import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { usePermissions, Permissions } from '@/hooks/usePermissions';
import { PageHeader } from '@/components/shared/PageHeader';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useGetUserQuery, useUpdateUserMutation } from '@/services/users/usersApi';
import {
  useGetUserRolesQuery,
  useListRolesQuery,
  useAssignRoleToUserMutation,
  useRevokeRoleFromUserMutation,
} from '@/services/rbac/rbacApi';
import { updateUserSchema, type UpdateUserFormValues } from '@/lib/validations/users';
import { formatDate, formatDateTime } from '@/lib/utils';

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const { data: user, isLoading: isLoadingUser } = useGetUserQuery(userId!, { skip: !userId });
  const { data: userRolesData, isLoading: isLoadingRoles } = useGetUserRolesQuery(userId!, { skip: !userId });
  const { data: rolesData } = useListRolesQuery();

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [assignRole, { isLoading: isAssigning }] = useAssignRoleToUserMutation();
  const [revokeRole, { isLoading: isRevoking }] = useRevokeRoleFromUserMutation();

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [revokeTarget, setRevokeTarget] = useState<{ roleId: string; roleName: string } | null>(null);

  const canEdit = hasPermission(Permissions.USERS_EDIT);
  const canManageRoles = hasPermission(Permissions.USERS_MANAGE_ROLES);

  const profileForm = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    values: user
      ? {
          first_name: user.first_name,
          last_name: user.last_name,
          is_active: user.is_active,
        }
      : undefined,
  });

  const handleUpdateProfile = async (values: UpdateUserFormValues) => {
    if (!userId) return;
    try {
      await updateUser({
        id: userId,
        data: {
          first_name: values.first_name,
          last_name: values.last_name,
          is_active: values.is_active,
        },
      }).unwrap();
      toast.success('User updated successfully');
    } catch {
      toast.error('Failed to update user');
    }
  };

  const handleAssignRole = async () => {
    if (!userId || !selectedRoleId) return;
    try {
      await assignRole({
        userId,
        data: {
          role_id: selectedRoleId,
        },
      }).unwrap();
      toast.success('Role assigned successfully');
      setAssignDialogOpen(false);
      setSelectedRoleId('');
    } catch {
      toast.error('Failed to assign role');
    }
  };

  const handleRevokeRole = async () => {
    if (!userId || !revokeTarget) return;
    try {
      await revokeRole({
        userId,
        roleId: revokeTarget.roleId,
      }).unwrap();
      toast.success('Role revoked successfully');
      setRevokeTarget(null);
    } catch {
      toast.error('Failed to revoke role');
    }
  };

  if (!hasPermission(Permissions.USERS_VIEW)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You do not have permission to view this user.</p>
      </div>
    );
  }

  if (isLoadingUser) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">User not found.</p>
      </div>
    );
  }

  const fullName = `${user.first_name} ${user.last_name}`.trim();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/users')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title={fullName}
          description={user.email}
        />
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                {canEdit ? 'Update the user\'s profile details.' : 'View the user\'s profile details.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(handleUpdateProfile)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      {...profileForm.register('first_name')}
                      disabled={!canEdit}
                      aria-invalid={!!profileForm.formState.errors.first_name}
                    />
                    {profileForm.formState.errors.first_name && (
                      <p className="text-sm text-destructive">{profileForm.formState.errors.first_name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      {...profileForm.register('last_name')}
                      disabled={!canEdit}
                      aria-invalid={!!profileForm.formState.errors.last_name}
                    />
                    {profileForm.formState.errors.last_name && (
                      <p className="text-sm text-destructive">{profileForm.formState.errors.last_name.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    id="is_active"
                    checked={profileForm.watch('is_active')}
                    onCheckedChange={(checked) => profileForm.setValue('is_active', checked, { shouldDirty: true })}
                    disabled={!canEdit}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Joined: {formatDate(user.created_at)}</span>
                  <span>Last updated: {formatDateTime(user.updated_at)}</span>
                </div>

                {canEdit && (
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isUpdating || !profileForm.formState.isDirty}>
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Role Assignments</CardTitle>
                  <CardDescription>Manage the roles assigned to this user.</CardDescription>
                </div>
                {canManageRoles && (
                  <Button onClick={() => setAssignDialogOpen(true)} size="sm">
                    <Plus className="h-4 w-4" />
                    Assign Role
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingRoles ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : !userRolesData?.roles || userRolesData.roles.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No roles assigned to this user.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      <TableHead>Scope</TableHead>
                      <TableHead>Assigned</TableHead>
                      {canManageRoles && <TableHead className="w-[50px]" />}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userRolesData.roles.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.role_name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Global</Badge>
                        </TableCell>
                        <TableCell>{formatDate(assignment.assigned_at)}</TableCell>
                        {canManageRoles && (
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() =>
                                setRevokeTarget({
                                  roleId: assignment.role_id,
                                  roleName: assignment.role_name,
                                })
                              }
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                              <span className="sr-only">Revoke role</span>
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Assign Role Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Assign a role to {fullName}. The role will apply across the application.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
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
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignRole} disabled={!selectedRoleId || isAssigning}>
              {isAssigning ? 'Assigning...' : 'Assign Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Role Confirmation */}
      <ConfirmDialog
        open={!!revokeTarget}
        onOpenChange={(open) => !open && setRevokeTarget(null)}
        title="Revoke Role"
        description={`Are you sure you want to revoke the "${revokeTarget?.roleName}" role from ${fullName}?`}
        confirmLabel="Revoke"
        variant="destructive"
        isLoading={isRevoking}
        onConfirm={handleRevokeRole}
      />
    </div>
  );
}
