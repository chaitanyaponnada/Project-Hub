
"use client";

import Link from 'next/link';
import { Code } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function Footer() {
  const [year, setYear] = useState<number | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const href = e.currentTarget.href;
    const targetId = href.split("#")[1];

    if (pathname === '/') {
      e.preventDefault();
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      e.preventDefault();
      router.push(`/#${targetId}`);
    }
  };
  
  const noFooterPaths = ['/admin', '/checkout', '/profile', '/login', '/register'];

  if (noFooterPaths.some(path => pathname.startsWith(path)) || (pathname.startsWith('/projects/') && pathname !== '/projects')) {
      return null;
  }


  return (
    <footer className="bg-muted text-muted-foreground mt-auto border-t section-gradient">
      <div className="container mx-auto px-4 py-12 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
                <Code className="h-7 w-7 text-primary" />
                <span className="font-headline text-xl font-bold text-primary">Project Hub</span>
            </Link>
            <p className="text-sm pr-4">
              Your central marketplace for high-quality projects.
            </p>
             <p className="text-xs text-muted-foreground mt-4">
              {year && <>© {year} Project Hub. All rights reserved.</>}
            </p>
          </div>
          <div className="col-span-1">
            <h4 className="font-headline font-semibold text-primary mb-4">Navigate</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#home" onClick={handleScroll} className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/projects" className="hover:text-primary transition-colors">Projects</Link></li>
              <li><Link href="#faq" onClick={handleScroll} className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="#contact" onClick={handleScroll} className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="font-headline font-semibold text-primary mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
