"use client";

import Link from "next/link";
import { Code, ShoppingCart, User, Menu, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { usePathname } from 'next/navigation';


const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/admin", label: "Admin", admin: true },
];

export function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const NavLinks = ({ className }: { className?: string }) => (
    <nav className={cn("flex items-center gap-6 text-sm font-medium", className)}>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-foreground/80 hover:text-foreground transition-colors flex items-center gap-1",
            pathname === link.href && "text-primary font-semibold"
          )}
          onClick={() => setMenuOpen(false)}
        >
          {link.admin && <ShieldCheck className="h-4 w-4 text-accent" />}
          {link.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Code className="h-7 w-7 text-primary" />
          <span className="font-headline text-xl font-bold text-primary">Project Hub</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <NavLinks />
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                  {cartCount}
                </span>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>

          <Button variant="outline" size="sm" asChild className="hidden sm:flex">
             <Link href="/login">
                <User className="mr-2 h-4 w-4" />
                Login
            </Link>
          </Button>

          <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-sm">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between border-b pb-4">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                        <Code className="h-7 w-7 text-primary" />
                        <span className="font-headline text-xl font-bold text-primary">Project Hub</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setMenuOpen(false)}>
                        <X className="h-6 w-6" />
                        <span className="sr-only">Close menu</span>
                    </Button>
                </div>
                <div className="flex-1 mt-6">
                  <NavLinks className="flex-col items-start gap-4 text-lg" />
                </div>
                <Button variant="outline" asChild>
                    <Link href="/login" onClick={() => setMenuOpen(false)}>
                        <User className="mr-2 h-4 w-4" />
                        Login / Register
                    </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
