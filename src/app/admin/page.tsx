
'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, Users, ShoppingBag, MessageSquare } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getProjects, getUsers, getInquiries } from "@/lib/firebase-services";
import { useEffect, useState } from "react";
import type { Project } from "@/lib/placeholder-data";

const data = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
];


export default function AdminDashboard() {
    const [stats, setStats] = useState({
        projects: 0,
        users: 0,
        inquiries: 0,
        revenue: 0 // Placeholder
    });

    useEffect(() => {
        const fetchStats = async () => {
            const projects = await getProjects();
            const users = await getUsers();
            const inquiries = await getInquiries();
            setStats({
                projects: projects.length,
                users: users.length,
                inquiries: inquiries.length,
                revenue: 12550 // Placeholder
            })
        }
        fetchStats();
    }, [])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {stats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.users}</div>
            <p className="text-xs text-muted-foreground">+10 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.projects}</div>
            <p className="text-xs text-muted-foreground">+5 this month</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.inquiries}</div>
            <p className="text-xs text-muted-foreground">2 unread messages</p>
          </CardContent>
        </Card>
      </div>

      <Card>
          <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="hsl(var(--primary))" />
                </BarChart>
            </ResponsiveContainer>
          </CardContent>
      </Card>
    </div>
  );
}
