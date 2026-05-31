'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Receipt,
  FolderOpen,
  Menu,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { useAuthStore } from '@/features/auth/model';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/expenses', label: 'Expenses', icon: Receipt },
  { href: '/categories', label: 'Categories', icon: FolderOpen },
];

function NavLinks({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 px-2">
      {navItems.map((item) => {
        const isActive =
          item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function UserProfile() {
  const user = useAuthStore((s) => s.user);
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <div className="flex items-center gap-3 px-2">
      <Avatar size="sm">
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col overflow-hidden">
        <span className="truncate text-sm font-medium">
          {user?.name ?? 'User'}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {user?.email ?? ''}
        </span>
      </div>
    </div>
  );
}

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-4 py-4">
        <Receipt className="size-5 text-primary" />
        <span className="text-lg font-bold">Expenses</span>
      </div>
      <Separator />
      <div className="flex-1 py-4">
        <NavLinks onClick={onLinkClick} />
      </div>
      <Separator />
      <div className="flex flex-col gap-2 p-4">
        <UserProfile />
        <Button
          variant="ghost"
          size="sm"
          className="justify-start text-muted-foreground"
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
        >
          <LogOut className="mr-2 size-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export function AppSidebar() {
  return (
    <>
      <aside className="hidden w-60 shrink-0 border-r bg-card md:block">
        <SidebarContent />
      </aside>
      <MobileSidebar />
    </>
  );
}

function MobileSidebar() {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger render={<Button variant="ghost" size="icon-sm" className="fixed left-3 top-3 z-40" />}>
          <Menu className="size-5" />
          <span className="sr-only">Toggle menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-60 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </div>
  );
}
