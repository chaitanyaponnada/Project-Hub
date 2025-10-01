
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, CreditCard, Activity } from "lucide-react"

type DashboardStatsProps = {
    stats: {
        totalRevenue: number;
        subscriptions: number;
        sales: number;
        activeNow: number;
    }
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
    return (
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">Rs. {stats.totalRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                        Based on all project sales
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Users
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{stats.subscriptions}</div>
                    <p className="text-xs text-muted-foreground">
                        Total registered users
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{stats.sales}</div>
                    <p className="text-xs text-muted-foreground">
                       Total projects sold (simulated)
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{stats.activeNow}</div>
                     <p className="text-xs text-muted-foreground">
                        Currently active users (placeholder)
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
