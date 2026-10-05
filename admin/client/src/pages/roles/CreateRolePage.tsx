import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import { useCreateRoleMutation, useListPermissionsQuery } from '@/services/rbac/rbacApi';
import { createRoleSchema, type CreateRoleFormValues } from '@/lib/validations/rbac';
import type { Permission } from '@/types/rbac';

export default function CreateRolePage() {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const { data: permissionsData } = useListPermissionsQuery();
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();

  const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<string>>(new Set());

  const form = useForm<Omit<CreateRoleFormValues, 'permission_ids'>>({
    resolver: zodResolver(createRoleSchema.omit({ permission_ids: true })),
    defaultValues: {
      name: '',
      description: '',
    },
  });

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

  const togglePermission = (permissionId: string) => {
    setSelectedPermissionIds((prev) => {
      const next = new Set(prev);
      if (next.has(permissionId)) {
        next.delete(permissionId);
      } else {
        next.add(permissionId);
      }
      return next;
    });
  };

  const handleSubmit = async (values: Omit<CreateRoleFormValues, 'permission_ids'>) => {
    if (selectedPermissionIds.size === 0) {
      toast.error('Please select at least one permission');
      return;
    }

    try {
      await createRole({
        name: values.name,
        description: values.description || undefined,
        permission_ids: Array.from(selectedPermissionIds),
      }).unwrap();
      toast.success('Role created successfully');
      navigate('/roles');
    } catch {
      toast.error('Failed to create role');
    }
  };

  if (!hasPermission(Permissions.ROLES_CREATE)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You do not have permission to create roles.</p>
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
          title="Create Role"
          description="Define a new role with specific permissions."
        />
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Role Info */}
        <Card>
          <CardHeader>
            <CardTitle>Role Information</CardTitle>
            <CardDescription>Provide a name and description for the role.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-role-name">Name</Label>
              <Input
                id="create-role-name"
                placeholder="e.g. Team Manager"
                {...form.register('name')}
                aria-invalid={!!form.formState.errors.name}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-role-description">Description</Label>
              <Textarea
                id="create-role-description"
                placeholder="Describe what this role is for..."
                {...form.register('description')}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card>
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
            <CardDescription>
              Select the permissions this role should grant.
              {selectedPermissionIds.size > 0 && (
                <span className="ml-1 font-medium text-foreground">
                  ({selectedPermissionIds.size} selected)
                </span>
              )}
            </CardDescription>
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
                          checked={selectedPermissionIds.has(perm.id)}
                          onCheckedChange={() => togglePermission(perm.id)}
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

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/roles')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create Role'}
          </Button>
        </div>
      </form>
    </div>
  );
}
