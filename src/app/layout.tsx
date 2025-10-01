
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/hooks/use-cart';
import { AuthProvider } from '@/hooks/use-auth';
import { InquiryProvider } from '@/hooks/use-inquiry';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';

export const metadata: Metadata = {
  title: 'Project Hub',
  description: 'Your central marketplace for high-quality projects.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          'font-body antialiased'
        )}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <AuthProvider>
              <InquiryProvider>
                <CartProvider>
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Toaster />
                  <ThemeToggle />
                </CartProvider>
              </InquiryProvider>
            </AuthProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
