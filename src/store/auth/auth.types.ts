
export interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  role: string;
  email_verified_at: string | null;
  mobile_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  access_token: string | null;
  token_type: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}