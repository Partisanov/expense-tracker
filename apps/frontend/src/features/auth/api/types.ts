export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
}

export interface AuthResponse {
  accessToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}
