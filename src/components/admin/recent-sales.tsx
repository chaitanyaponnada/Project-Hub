
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Sale = {
    id: string;
    name: string;
    email: string;
    amount: number;
    avatar: {
        src: string;
        fallback: string;
    }
}

type RecentSalesProps = {
    sales: Sale[];
}

export default function RecentSales({ sales }: RecentSalesProps) {
    return (
         <Card>
            <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>
                    You made {sales.length} sales this month (Simulated).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {sales.map(sale => (
                        <div key={sale.id} className="flex items-center">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={sale.avatar.src} alt="Avatar" />
                                <AvatarFallback>{sale.avatar.fallback}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{sale.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    {sale.email}
                                </p>
                            </div>
                            <div className="ml-auto font-medium">+Rs. {sale.amount.toFixed(2)}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
