export interface User {
  mobile_number: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

export interface Session {
  id: string;
  mobile_number: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface AuthenticatedUser {
  mobile_number: string;
  name: string;
}

export interface LoginRequest {
  mobile_number: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: AuthenticatedUser;
  error?: string;
}
