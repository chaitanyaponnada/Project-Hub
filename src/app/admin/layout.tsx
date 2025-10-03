
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { isAdmin } from '@/lib/firebase-services';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from '@/components/ui/sidebar';
import Link from 'next/link';
import { LayoutDashboard, Package, Users, MessageSquare, CreditCard } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/projects', label: 'Projects', icon: Package },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
    { href: '/admin/payment-guide', label: 'Payment Setup', icon: CreditCard },
];

function AdminDashboardLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut(auth);
        router.push('/login');
    };

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <h2 className="text-lg font-semibold">Admin Panel</h2>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        {navItems.map(item => (
                            <SidebarMenuItem key={item.label}>
                                <Link href={item.href}>
                                    <SidebarMenuButton isActive={pathname === item.href}>
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                    <Button variant="ghost" onClick={handleSignOut}>Sign Out</Button>
                </SidebarFooter>
            </Sidebar>
            <main className="flex-1 p-4 md:p-8 overflow-auto">
                <div className="md:hidden mb-4">
                    <SidebarTrigger />
                </div>
                {children}
            </main>
        </SidebarProvider>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else {
        isAdmin(user.uid).then(adminStatus => {
          setIsUserAdmin(adminStatus);
          setCheckingAdmin(false);
          if (!adminStatus) {
            router.push('/admin/unauthorized');
          }
        });
      }
    }
  }, [user, loading, router]);

  if (loading || checkingAdmin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isUserAdmin) {
      return (
         <div className="flex h-screen items-center justify-center">
            <p>Redirecting...</p>
        </div>
      )
  }

  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
