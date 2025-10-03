
'use client';
import { Header } from '@/components/layout/header';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const noHeaderPaths = ['/login', '/register'];

  const showHeader = !noHeaderPaths.includes(pathname) && !pathname.startsWith('/admin');
  const isHomePage = pathname === '/';

  return (
    <>
      {showHeader && <Header />}
      <main className={cn(isHomePage ? '' : 'pt-16')}>{children}</main>
    </>
  );
}
