// User type matching backend User model
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_superadmin?: boolean;
  created_at: string;
}

// Auth state for Redux
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// API Response types
export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface AcceptInviteRequest {
  token: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface BootstrapRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface BootstrapResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

// Generic API response wrapper
export interface ApiSuccessResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
