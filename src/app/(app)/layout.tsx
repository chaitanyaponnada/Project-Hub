
'use client';
import { Header } from '@/components/layout/header';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Footer } from '@/components/layout/footer';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const noHeaderFooterPaths = ['/login', '/register'];
  const isFullScreenPage = noHeaderFooterPaths.includes(pathname);
  const isHomePage = pathname === '/';
  
  const noFooterPaths = ['/admin', '/checkout', '/contact', '/projects/'];
  const showFooter = !isFullScreenPage && !noFooterPaths.some(path => pathname.startsWith(path));

  return (
    <>
      {!isFullScreenPage && <Header />}
      <main className={cn(isHomePage ? '' : 'pt-16')}>{children}</main>
      {showFooter && <Footer />}
    </>
  );
}
