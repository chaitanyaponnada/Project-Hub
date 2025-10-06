
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { DollarSign, Users, ShoppingBag, Calendar as CalendarIcon, ArrowRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getProjects, getUsers, getSales } from "@/lib/firebase-services";
import { useEffect, useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, subDays } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { cn } from "@/lib/utils";


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
    const [stats, setStats] = useState({ projects: 0, users: 0, revenue: 0 });
    const [allSales, setAllSales] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subDays(new Date(), 6),
        to: new Date(),
    });

    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            const [projects, users, sales] = await Promise.all([
                getProjects(),
                getUsers(),
                getSales()
            ]);
            
            setAllSales(sales);
            setStats({
                projects: projects.length,
                users: users.length,
                revenue: sales.reduce((acc, sale) => acc + sale.price, 0)
            });
            setIsLoading(false);
        }
        fetchAllData();
    }, [])

    const { chartData, recentSales } = useMemo(() => {
        if (!dateRange?.from || !dateRange?.to) {
            return { chartData: [], recentSales: [] };
        }

        const filteredSales = allSales.filter(sale => {
            const saleDate = sale.purchasedAt.toDate();
            return saleDate >= dateRange.from! && saleDate <= dateRange.to!;
        });

        const salesByDay = filteredSales.reduce((acc, sale) => {
            const date = format(sale.purchasedAt.toDate(), 'MMM d');
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date] += sale.price;
            return acc;
        }, {} as {[key: string]: number});
        
        const dataForChart = Object.keys(salesByDay).map(date => ({
            name: date,
            revenue: salesByDay[date]
        }));

        return {
            chartData: dataForChart,
            recentSales: filteredSales.slice(0, 5)
        };
    }, [allSales, dateRange]);


    const handlePresetChange = (value: string) => {
        const now = new Date();
        if (value === '7d') {
            setDateRange({ from: subDays(now, 6), to: now });
        } else if (value === '30d') {
            setDateRange({ from: subDays(now, 29), to: now });
        } else if (value === '90d') {
             setDateRange({ from: subDays(now, 89), to: now });
        }
    };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
            <Select onValueChange={handlePresetChange} defaultValue="7d">
                <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                    <SelectItem value="90d">Last 90 Days</SelectItem>
                </SelectContent>
            </Select>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn("w-[280px] justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                            dateRange.to ? (
                                <>
                                    {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(dateRange.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
      </div>
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
                    <CardDescription>
                        Showing revenue for the selected date range.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
                 <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Recent Sales</CardTitle>
                        <CardDescription>Sales from the selected period.</CardDescription>
                    </div>
                     <Button asChild variant="outline" size="sm">
                        <Link href="/admin/sales">
                            View All <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {recentSales.length > 0 ? (
                        <div className="space-y-4">
                            {recentSales.map(sale => (
                                <div key={sale.id} className="flex items-center">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={sale.userPhotoURL} alt={sale.userName} />
                                        <AvatarFallback>{sale.userName?.charAt(0)}</AvatarFallback>
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
                            No sales in this period.
                        </div>
                    )}
                </CardContent>
            </Card>
      </div>
    </div>
  );
}
