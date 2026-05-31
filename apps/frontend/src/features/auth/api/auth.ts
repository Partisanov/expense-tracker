import { apiFetch } from '@/shared/api';
import type { AuthResponse, LoginPayload, RegisterPayload } from './types';
import type { UserProfile } from './types';

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function register(payload: RegisterPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getProfile(): Promise<UserProfile> {
  return apiFetch<UserProfile>('/auth/profile');
}
