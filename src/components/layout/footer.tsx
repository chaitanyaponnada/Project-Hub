
"use client";

import Link from 'next/link';
import { Code, Github, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());
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

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-muted text-muted-foreground mt-auto border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
                <Code className="h-7 w-7 text-primary" />
                <span className="font-headline text-xl font-bold text-primary">Project Hub</span>
            </Link>
            <p className="text-sm pr-4">
              Your central marketplace for high-quality projects.
            </p>
             <p className="text-xs text-muted-foreground mt-4">
              © {year} Project Hub. All rights reserved.
            </p>
          </div>
          <div className="col-span-1">
            <h4 className="font-headline font-semibold text-primary mb-4">Navigate</h4>
            <ul className="space-y-2">
              <li><Link href="#home" onClick={handleScroll} className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/projects" className="hover:text-primary transition-colors">Projects</Link></li>
              <li><Link href="#faq" onClick={handleScroll} className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="font-headline font-semibold text-primary mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
               <li><Link href="/admin/login" className="hover:text-primary transition-colors">Admin Login</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="font-headline font-semibold text-primary mb-4">Connect</h4>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
