
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Search } from 'lucide-react';
import { getSales } from '@/lib/firebase-services';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function AdminSalesPage() {
    const [sales, setSales] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchSales = async () => {
            setIsLoading(true);
            const fetchedSales = await getSales();
            setSales(fetchedSales);
            setIsLoading(false);
        };
        fetchSales();
    }, []);

    const filteredSales = useMemo(() => {
        return sales.filter(sale =>
            sale.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sale.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (sale.userName && sale.userName.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [sales, searchTerm]);
    
     const totalRevenue = useMemo(() => {
        return filteredSales.reduce((acc, sale) => acc + sale.price, 0);
    }, [filteredSales]);


    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
                    <div>
                        <CardTitle>Sales Transactions</CardTitle>
                        <CardDescription>A complete log of all project sales.</CardDescription>
                    </div>
                     <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total Revenue (Filtered)</p>
                        <p className="text-2xl font-bold">Rs. {totalRevenue.toLocaleString()}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                 <div className="mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search by project, user, or email..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Project</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSales.map(sale => (
                                    <TableRow key={sale.id}>
                                        <TableCell className="font-medium">{sale.projectTitle}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={sale.userPhotoURL} />
                                                    <AvatarFallback>{sale.userName?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span>{sale.userName || 'N/A'}</span>
                                                    <span className="text-xs text-muted-foreground">{sale.userEmail}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">Rs. {sale.price.toFixed(2)}</Badge>
                                        </TableCell>
                                        <TableCell>{sale.purchasedAt ? format(sale.purchasedAt.toDate(), 'PPP p') : 'N/A'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                )}
                 {filteredSales.length === 0 && !isLoading && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No sales found matching your criteria.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
