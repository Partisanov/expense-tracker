'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/model';
import { getProfile } from '@/features/auth/api';
import { AppSidebar } from '@/widgets';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace('/login');
      return;
    }
    if (!user) {
      getProfile()
        .then(setUser)
        .catch(() => {
          router.replace('/login');
        });
    }
  }, [token, user, setUser, router]);

  if (!token) return null;

  return (
    <div className="flex min-h-svh">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
