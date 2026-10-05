import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { usePermissions, Permissions } from '@/hooks/usePermissions';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useGetRoleQuery, useUpdateRoleMutation, useListPermissionsQuery } from '@/services/rbac/rbacApi';
import { updateRoleSchema, type UpdateRoleFormValues } from '@/lib/validations/rbac';
import type { Permission } from '@/types/rbac';

export default function RoleDetailPage() {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const { data: role, isLoading: isLoadingRole } = useGetRoleQuery(roleId!, { skip: !roleId });
  const { data: permissionsData } = useListPermissionsQuery();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();

  const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<string> | null>(null);

  // Initialize permission IDs from role data
  const effectivePermissionIds = useMemo(() => {
    if (selectedPermissionIds !== null) return selectedPermissionIds;
    if (role?.permissions) {
      return new Set(role.permissions.map((p) => p.id));
    }
    return new Set<string>();
  }, [role, selectedPermissionIds]);

  // Group permissions by resource
  const permissionsByResource = useMemo(() => {
    if (!permissionsData?.permissions) return new Map<string, Permission[]>();
    const grouped = new Map<string, Permission[]>();
    for (const perm of permissionsData.permissions) {
      const group = grouped.get(perm.resource) ?? [];
      group.push(perm);
      grouped.set(perm.resource, group);
    }
    return grouped;
  }, [permissionsData]);

  const canEdit = hasPermission(Permissions.ROLES_EDIT) && !role?.is_system_role;

  const detailsForm = useForm<UpdateRoleFormValues>({
    resolver: zodResolver(updateRoleSchema),
    values: role
      ? {
          name: role.name,
          description: role.description ?? '',
        }
      : undefined,
  });

  const handleUpdateDetails = async (values: UpdateRoleFormValues) => {
    if (!roleId) return;
    try {
      await updateRole({
        id: roleId,
        data: {
          name: values.name,
          description: values.description,
        },
      }).unwrap();
      toast.success('Role updated successfully');
    } catch {
      toast.error('Failed to update role');
    }
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissionIds((prev) => {
      const current = prev ?? new Set(role?.permissions.map((p) => p.id) ?? []);
      const next = new Set(current);
      if (next.has(permissionId)) {
        next.delete(permissionId);
      } else {
        next.add(permissionId);
      }
      return next;
    });
  };

  const handleSavePermissions = async () => {
    if (!roleId) return;
    try {
      await updateRole({
        id: roleId,
        data: {
          permission_ids: Array.from(effectivePermissionIds),
        },
      }).unwrap();
      toast.success('Permissions updated successfully');
      setSelectedPermissionIds(null);
    } catch {
      toast.error('Failed to update permissions');
    }
  };

  const hasPermissionChanges = useMemo(() => {
    if (selectedPermissionIds === null) return false;
    const original = new Set(role?.permissions.map((p) => p.id) ?? []);
    if (original.size !== selectedPermissionIds.size) return true;
    for (const id of selectedPermissionIds) {
      if (!original.has(id)) return true;
    }
    return false;
  }, [selectedPermissionIds, role]);

  if (!hasPermission(Permissions.ROLES_VIEW)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You do not have permission to view roles.</p>
      </div>
    );
  }

  if (isLoadingRole) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!role) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Role not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/roles')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title={role.name}
          description={
            role.is_system_role
              ? 'This is a system role and cannot be modified.'
              : 'Manage role details and permissions.'
          }
        />
        {role.is_system_role && (
          <Badge variant="secondary" className="ml-2">System</Badge>
        )}
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Role Details</CardTitle>
              <CardDescription>
                {canEdit ? 'Update the role name and description.' : 'View the role details.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={detailsForm.handleSubmit(handleUpdateDetails)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role-name">Name</Label>
                  <Input
                    id="role-name"
                    {...detailsForm.register('name')}
                    disabled={!canEdit}
                    aria-invalid={!!detailsForm.formState.errors.name}
                  />
                  {detailsForm.formState.errors.name && (
                    <p className="text-sm text-destructive">{detailsForm.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role-description">Description</Label>
                  <Textarea
                    id="role-description"
                    {...detailsForm.register('description')}
                    disabled={!canEdit}
                    rows={3}
                  />
                </div>
                {canEdit && (
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isUpdating || !detailsForm.formState.isDirty}>
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Permissions</CardTitle>
                  <CardDescription>
                    {canEdit
                      ? 'Select the permissions this role should have.'
                      : 'View the permissions assigned to this role.'}
                  </CardDescription>
                </div>
                {canEdit && hasPermissionChanges && (
                  <Button onClick={handleSavePermissions} disabled={isUpdating} size="sm">
                    {isUpdating ? 'Saving...' : 'Save Permissions'}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {Array.from(permissionsByResource.entries()).map(([resource, permissions]) => (
                  <div key={resource}>
                    <h3 className="text-sm font-semibold capitalize mb-3">
                      {resource.replace(/_/g, ' ')}
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {permissions.map((perm) => (
                        <label
                          key={perm.id}
                          className="flex items-start gap-3 rounded-md border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <Checkbox
                            checked={effectivePermissionIds.has(perm.id)}
                            onCheckedChange={() => togglePermission(perm.id)}
                            disabled={!canEdit}
                          />
                          <div className="space-y-0.5">
                            <p className="text-sm font-medium leading-none">
                              {perm.action.replace(/_/g, ' ')}
                            </p>
                            {perm.description && (
                              <p className="text-xs text-muted-foreground">{perm.description}</p>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
