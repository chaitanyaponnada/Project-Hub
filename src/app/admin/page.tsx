
"use client"

import { useEffect, useState } from "react";
import { getProjects, getUsers, getInquiries } from "@/lib/firebase-services";
import DashboardStats from "@/components/admin/dashboard-stats";
import RecentSales from "@/components/admin/recent-sales";
import UsersTable from "@/components/admin/users-table";
import { Loader2 } from "lucide-react";
import type { Project } from "@/lib/placeholder-data";
import { User } from "firebase/auth";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        subscriptions: 0,
        sales: 0,
        activeNow: 0,
    });
    const [projects, setProjects] = useState<Project[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectsData, usersData, inquiriesData] = await Promise.all([
                    getProjects(),
                    getUsers(),
                    getInquiries(),
                ]);

                setProjects(projectsData);
                setUsers(usersData);

                const totalRevenue = projectsData.reduce((acc, p) => acc + (p.price || 0), 0);
                
                setStats({
                    totalRevenue,
                    subscriptions: usersData.length,
                    sales: projectsData.length, // Placeholder for actual sales count
                    activeNow: 0 // Placeholder
                });
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }
    
    // Simulate sales data for recent sales component
    const recentSales = projects.slice(0, 5).map((p, index) => ({
        id: p.id,
        name: `User ${index+1}`,
        email: `user${index+1}@example.com`,
        amount: p.price,
        avatar: {
            src: `https://avatar.vercel.sh/user${index+1}.png`,
            fallback: `U${index+1}`,
        }
    }));


    return (
        <div className="space-y-6">
            <DashboardStats stats={stats} />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-full lg:col-span-4">
                     <UsersTable users={users.slice(0, 10)} title="Recent Users" />
                </div>
                <div className="col-span-full lg:col-span-3">
                    <RecentSales sales={recentSales} />
                </div>
            </div>
        </div>
    );
}
