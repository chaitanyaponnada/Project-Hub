
"use client";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/admin/login');
            } else if (!isAdmin) {
                router.push('/admin/unauthorized');
            }
        }
    }, [user, loading, isAdmin, router]);

    if (loading || !user || !isAdmin) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                <AdminHeader />
                <main className="flex-1 p-6 bg-muted/40">
                    {children}
                </main>
            </div>
        </div>
    );
}
