
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Code, Home, ShoppingCart, Users, Package, LogOut, MessageSquareWarning } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

const navLinks = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/projects", label: "Projects", icon: Package },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquareWarning },
];

export function AdminSidebar({ isMobile = false }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut(auth);
        router.push('/admin/login');
    };

    return (
        <div className={cn("hidden md:block border-r bg-background", { "block": isMobile })}>
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-16 items-center border-b px-6">
                    <Link href="/admin" className="flex items-center gap-2 font-semibold">
                        <Code className="h-6 w-6" />
                        <span>Project Hub Admin</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        {navLinks.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                    pathname === href && "bg-muted text-primary"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="mt-auto p-4">
                     <Button size="sm" className="w-full" onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </div>
        </div>
    );
}
