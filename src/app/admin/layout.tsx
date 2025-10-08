
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { Loader2, PanelLeft, LayoutDashboard, Package, Users, MessageSquare, CreditCard, LogOut, ClipboardList, Star } from 'lucide-react';
import { isAdmin } from '@/lib/firebase-services';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/projects', label: 'Projects', icon: Package },
    { href: '/admin/sales', label: 'Sales', icon: ClipboardList },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
    { href: '/admin/reviews', label: 'Reviews', icon: Star },
    { href: '/admin/payment-guide', label: 'Payment Setup', icon: CreditCard },
];

function AdminNav({ onLinkClick }: { onLinkClick?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut(auth);
        router.replace('/'); // Redirect to home page for a clean exit
        if (onLinkClick) onLinkClick();
    };

    return (
        <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b px-6">
                 <Link className="flex items-center gap-2 font-semibold" href="/">
                    <Package className="h-6 w-6" />
                    <span>Project Hub</span>
                </Link>
            </div>
            <nav className="flex-1 overflow-auto py-6">
                <div className="flex flex-col gap-4 px-4">
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onLinkClick}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                pathname.startsWith(item.href) && item.href !== '/admin' && "bg-muted text-primary",
                                pathname === item.href && item.href === '/admin' && "bg-muted text-primary"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </div>
            </nav>
             <div className="mt-auto p-4 border-t">
                <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </div>
    )
}

function AdminDashboardLayout({ children }: { children: ReactNode }) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <AdminNav />
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 md:hidden"
                            >
                                <PanelLeft className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col p-0">
                            <AdminNav onLinkClick={() => setIsSheetOpen(false)} />
                        </SheetContent>
                    </Sheet>
                    <div className="w-full flex-1">
                       {/* Can add search or other header elements here */}
                    </div>
                </header>
                <main className="flex-1 p-4 sm:p-6 overflow-x-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

// This is the main layout component that handles auth and admin checks
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // If user is not logged in, redirect to login page with a return url
      const redirectUrl = pathname.startsWith('/admin') ? '?redirect=' + pathname : '';
      router.push('/login' + redirectUrl);
      return;
    }

    // If user is logged in, check for admin privileges
    isAdmin(user.uid).then(adminStatus => {
      if (!adminStatus && pathname !== '/admin/unauthorized') {
        // If not an admin, redirect to an unauthorized page
        router.push('/admin/unauthorized');
      }
      setIsUserAdmin(adminStatus);
      setCheckingAdmin(false);
    });

  }, [user, loading, router, pathname]);
  
  if (pathname === '/admin/unauthorized') {
    return <>{children}</>;
  }

  if (loading || checkingAdmin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isUserAdmin) {
    return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
  }

  // This fallback is for non-admin users before they are redirected.
  return (
     <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
