
'use client';
import { Header } from '@/components/layout/header';
import { usePathname } from 'next/navigation';

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
      <main className={isHomePage ? '' : 'flex-1'}>{children}</main>
    </>
  );
}
