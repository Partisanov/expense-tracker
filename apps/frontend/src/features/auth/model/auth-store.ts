'use client';

import { create } from 'zustand';
import { setToken, removeToken, getToken } from '@/shared/lib/auth';
import type { UserProfile } from '../api/types';

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  setAuth: (token: string) => void;
  logout: () => void;
  hydrate: () => void;
  setUser: (user: UserProfile) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setAuth: (token: string) => {
    setToken(token);
    set({ token });
  },
  logout: () => {
    removeToken();
    set({ token: null, user: null });
  },
  hydrate: () => {
    const token = getToken();
    set({ token });
  },
  setUser: (user: UserProfile) => {
    set({ user });
  },
}));
