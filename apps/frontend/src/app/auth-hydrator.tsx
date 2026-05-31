'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/model';

export function AuthHydrator({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <>{children}</>;
}
