import type { User } from './auth';

// Role assignment on a user profile
export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
}

// User profile from GET /users/me
export interface UserProfile extends User {
  updated_at: string;
  is_superadmin: boolean;
  roles: UserRole[];
  email_verified: boolean;
}

// Basic user from list/update endpoints
export interface UserBasic extends User {
  updated_at: string;
}

// User detail from GET /users/:id and PUT /users/:id
export interface UserDetail extends User {
  updated_at: string;
  email_verified: boolean;
  roles: { id: string; name: string }[];
}

// Update profile request
export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  current_password?: string;
  new_password?: string;
}

// List users query params
export interface ListUsersParams {
  page?: number;
  per_page?: number;
  search?: string;
  is_active?: boolean;
}

// Paginated users response
export interface PaginatedUsersResponse {
  users: UserBasic[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

// Update user request (admin)
export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  role_ids?: string[];
}

// Invite user request
export interface InviteUserRequest {
  email: string;
  role_id?: string;
}

// Invite response
export interface InviteUserResponse {
  id: string;
  email: string;
  expires_at: string;
  message: string;
}

