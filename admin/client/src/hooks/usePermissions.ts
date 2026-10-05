import { useMemo } from 'react';
import { useGetCurrentUserQuery } from '@/services/auth/authApi';

// Profile response includes roles with permissions
interface ProfileRole {
  permissions: string[];
}

/**
 * Hook to check user's effective permissions.
 *
 * Permissions are computed from all assigned roles.
 */
export function usePermissions() {
  const { data: profile, isLoading } = useGetCurrentUserQuery();

  const permissions = useMemo(() => {
    const profileWithRoles = profile as (typeof profile & { roles?: ProfileRole[] }) | undefined;
    if (!profileWithRoles?.roles) {
      return new Set<string>();
    }

    const effectivePermissions = new Set<string>();

    for (const role of profileWithRoles.roles) {
      const rolePermissions = role.permissions ?? [];
      for (const permission of rolePermissions) {
        effectivePermissions.add(permission);
      }
    }

    return effectivePermissions;
  }, [profile]);

  const hasPermission = useMemo(() => {
    return (permission: string): boolean => {
      return permissions.has(permission);
    };
  }, [permissions]);

  const hasAnyPermission = useMemo(() => {
    return (permissionList: string[]): boolean => {
      return permissionList.some(p => permissions.has(p));
    };
  }, [permissions]);

  const hasAllPermissions = useMemo(() => {
    return (permissionList: string[]): boolean => {
      return permissionList.every(p => permissions.has(p));
    };
  }, [permissions]);

  // Check if user has any role assigned (app-wide)
  const hasAnyRole = useMemo(() => {
    const profileWithRoles = profile as (typeof profile & { roles?: ProfileRole[] }) | undefined;
    return (profileWithRoles?.roles?.length ?? 0) > 0;
  }, [profile]);

  // Check if user is superadmin
  const isSuperadmin = profile?.is_superadmin ?? false;

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasAnyRole,
    isSuperadmin,
    isLoading,
  };
}

// Re-export permission constants for convenience
export { Permissions } from '@/lib/constants/permissions';
