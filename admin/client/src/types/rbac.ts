// Permission type
export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string | null;
}

// Base role type
export interface Role {
  id: string;
  name: string;
  description: string | null;
  is_system_role: boolean;
  created_at: string;
  updated_at: string;
}

// Role with permissions and user count
export interface RoleDetail extends Role {
  permissions: Permission[];
  user_count: number;
}

// Create role request
export interface CreateRoleRequest {
  name: string;
  description?: string | null;
  permission_ids?: string[];
}

// Update role request
export interface UpdateRoleRequest {
  name?: string;
  description?: string | null;
  permission_ids?: string[];
}

// Role list response
export interface RoleListResponse {
  roles: Role[];
  total: number;
}

// Permission list response
export interface PermissionListResponse {
  permissions: Permission[];
  total: number;
}

// List permissions query params
export interface ListPermissionsParams {
  resource?: string;
}

// Assign role request
export interface AssignRoleRequest {
  role_id: string;
}

// User role assignment
export interface UserRoleAssignment {
  id: string;
  role_id: string;
  role_name: string;
  assigned_at: string;
}

// User roles response
export interface UserRolesResponse {
  user_id: string;
  roles: UserRoleAssignment[];
}

// Revoke role params
export interface RevokeRoleParams {
  userId: string;
  roleId: string;
}
