
'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, Users, ShoppingBag, BarChart as BarChartIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { getProjects, getUsers, getSales } from "@/lib/firebase-services";
import { useEffect, useState } from "react";
import type { Project } from "@/lib/placeholder-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Date
            </span>
            <span className="font-bold text-muted-foreground">
              {label}
            </span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Revenue
            </span>
            <span className="font-bold">
              Rs. {payload[0].value.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};


export default function AdminDashboard() {
    const [stats, setStats] = useState({
        projects: 0,
        users: 0,
        revenue: 0
    });
    const [salesData, setSalesData] = useState<any[]>([]);
    const [recentSales, setRecentSales] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            const [projects, users, sales] = await Promise.all([
                getProjects(),
                getUsers(),
                getSales()
            ]);

            const totalRevenue = sales.reduce((acc, sale) => acc + sale.price, 0);

            // Process sales data for chart
            const salesByDay = sales.reduce((acc, sale) => {
                const date = format(sale.purchasedAt.toDate(), 'MMM d');
                if (!acc[date]) {
                    acc[date] = 0;
                }
                acc[date] += sale.price;
                return acc;
            }, {} as {[key: string]: number});
            
            const chartData = Object.keys(salesByDay).map(date => ({
                name: date,
                revenue: salesByDay[date]
            })).slice(-7); // Last 7 days

            setStats({
                projects: projects.length,
                users: users.length,
                revenue: totalRevenue
            });

            setSalesData(chartData);
            setRecentSales(sales.slice(0, 5)); // Last 5 sales
            setIsLoading(false);
        }
        fetchAllData();
    }, [])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {stats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All-time revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.users}</div>
            <p className="text-xs text-muted-foreground">Total registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.projects}</div>
            <p className="text-xs text-muted-foreground">Total projects listed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
            <Card className="lg:col-span-4">
                <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rs.${value}`} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
                            <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-3">
                 <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                </CardHeader>
                <CardContent>
                    {recentSales.length > 0 ? (
                        <div className="space-y-4">
                            {recentSales.map(sale => (
                                <div key={sale.id} className="flex items-center">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={sale.userPhotoURL} alt={sale.userName} />
                                        <AvatarFallback>{sale.userName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{sale.projectTitle}</p>
                                        <p className="text-sm text-muted-foreground">{sale.userEmail}</p>
                                    </div>
                                    <div className="ml-auto font-medium">+Rs.{sale.price.toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-8">
                            No sales yet.
                        </div>
                    )}
                </CardContent>
            </Card>
      </div>
    </div>
  );
}

