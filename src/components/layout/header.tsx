
"use client";

import Link from "next/link";
import { Code, ShoppingCart, User, Menu, X, LogOut, CircleUser, Package } from "lucide-react";
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
import { useTheme } from "next-themes";


const baseNavLinks = [
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
  const { theme } = useTheme();
  
  const isHomePage = pathname === '/';

  const navLinks = user 
    ? [...baseNavLinks, { href: "/profile", label: "Purchased Projects" }]
    : baseNavLinks;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
  
  const showTransparentHeader = isHomePage && !isScrolled;

  const headerClasses = cn(
    "w-full transition-colors duration-300 z-50",
    isHomePage ? 'fixed top-0' : 'sticky top-0 border-b',
    showTransparentHeader ? "bg-transparent" : "bg-background/80 backdrop-blur-sm"
  );
  
  const contentColorClass = showTransparentHeader ? (theme === 'dark' ? "text-white" : "text-primary") : "text-primary";
  const navLinkColorClass = showTransparentHeader ? (theme === 'dark' ? "text-white/80 hover:text-white" : "text-foreground/80 hover:text-foreground") : "text-foreground/80 hover:text-foreground";
  const activeNavLinkColorClass = showTransparentHeader ? (theme === 'dark' ? "text-white font-semibold" : "text-primary font-semibold") : "text-primary font-semibold";


  const NavLinks = ({ className }: { className?: string }) => (
    <nav className={cn("hidden md:flex items-center gap-8 text-sm font-medium", className)}>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
              "nav-link relative",
              navLinkColorClass, 
              pathname === link.href && activeNavLinkColorClass, 
              link.label === "Purchased Projects" && "hidden lg:flex items-center"
          )}
          onClick={() => setMenuOpen(false)}
        >
          {link.label === "Purchased Projects" && <Package className="mr-2 h-4 w-4" />}
          {link.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className={headerClasses}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 mr-auto">
          <Code className={cn("h-7 w-7", contentColorClass)} />
          <span className={cn("font-headline text-xl font-bold", contentColorClass)}>Project Hub</span>
        </Link>

        <div className="flex items-center gap-3">
          <NavLinks />

          <Button variant="ghost" size="icon" className={cn("relative", navLinkColorClass)} asChild>
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
                variant={"outline"}
                size="sm" 
                asChild 
                className={cn("hidden sm:flex", showTransparentHeader && theme === 'dark' && "border-white/50 text-white bg-transparent hover:bg-white hover:text-primary")}
            >
               <Link href="/login">
                  <User className="mr-2 h-4 w-4" />
                  Login
              </Link>
            </Button>
          )}

          <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={cn("md:hidden", navLinkColorClass)}>
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
                           {link.label === "Purchased Projects" && <Package className="mr-2 h-4 w-4 inline-block" />}
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
