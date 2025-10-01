
"use client";

import Link from "next/link";
import { Code, ShoppingCart, User, Menu, X, LogOut, CircleUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from 'next/navigation';
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";


const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      // Make header opaque only after scrolling past the hero section on the homepage
      const threshold = isHomePage ? window.innerHeight * 0.8 : 10;
      setIsScrolled(window.scrollY > threshold);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  if (pathname.startsWith('/admin')) {
    return null;
  }
  
  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  const headerClasses = cn(
    "sticky top-0 z-50 w-full border-b transition-colors duration-300",
    isScrolled ? "bg-background/80 backdrop-blur-xl border-border" : "bg-transparent border-transparent",
    !isScrolled && isHomePage && "text-white"
  );

  const navLinkClasses = (href: string) => cn(
    "transition-colors",
    isScrolled || !isHomePage ? "text-foreground/80 hover:text-foreground" : "text-white/80 hover:text-white",
    pathname === href && (isScrolled || !isHomePage ? "text-primary font-semibold" : "text-white font-semibold")
  );

  const NavLinks = ({ className }: { className?: string }) => (
    <nav className={cn("flex items-center gap-6 text-sm font-medium", className)}>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={navLinkClasses(link.href)}
          onClick={() => setMenuOpen(false)}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className={headerClasses}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Code className={cn("h-7 w-7", isScrolled || !isHomePage ? "text-primary" : "text-white")} />
          <span className={cn("font-headline text-xl font-bold", isScrolled || !isHomePage ? "text-primary" : "text-white")}>Project Hub</span>
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

          {user ? (
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                        <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                    </Avatar>
                   </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.displayName}</p>
                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                     <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <CircleUser className="mr-2 h-4 w-4" />
                          <span>My Profile</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
                variant={isScrolled || !isHomePage ? "outline" : "outline"}
                size="sm" 
                asChild 
                className={cn("hidden sm:flex", !isScrolled && isHomePage && "border-white/50 text-white hover:bg-white hover:text-primary")}
            >
               <Link href="/login">
                  <User className="mr-2 h-4 w-4" />
                  Login
              </Link>
            </Button>
          )}

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
                  <nav className="flex flex-col items-start gap-4 text-lg">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "text-foreground/80 hover:text-foreground transition-colors",
                            pathname === link.href && "text-primary font-semibold"
                          )}
                          onClick={() => setMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>
                </div>
                {user ? (
                   <Button variant="outline" onClick={() => { handleSignOut(); setMenuOpen(false); }}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                  </Button>
                ) : (
                  <Button variant="outline" asChild>
                      <Link href="/login" onClick={() => setMenuOpen(false)}>
                          <User className="mr-2 h-4 w-4" />
                          Login / Register
                      </Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

    