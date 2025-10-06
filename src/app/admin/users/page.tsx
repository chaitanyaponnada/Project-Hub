
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, User, ShieldCheck, Eye } from 'lucide-react';
import { getUsers, getSalesByUserId } from '@/lib/firebase-services';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [userSales, setUserSales] = useState<any[]>([]);
    const [loadingSales, setLoadingSales] = useState(false);
    
    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            const fetchedUsers = await getUsers();
            setUsers(fetchedUsers);
            setIsLoading(false);
        };
        fetchUsers();
    }, []);
    
    useEffect(() => {
        if (selectedUser) {
            const fetchUserSales = async () => {
                setLoadingSales(true);
                const sales = await getSalesByUserId(selectedUser.uid);
                setUserSales(sales);
                setLoadingSales(false);
            };
            fetchUserSales();
        }
    }, [selectedUser]);


    const getInitials = (name?: string | null) => {
        if (!name) return <User className="h-4 w-4" />;
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>List of all registered users. Click "View Details" to see their purchase history.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Date Joined</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map(user => (
                                    <TableRow key={user.uid}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar>
                                                    <AvatarImage src={user.photoURL} />
                                                    <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{user.displayName || 'N/A'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            {user.createdAt?.toDate ? format(user.createdAt.toDate(), 'PPP') : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            {user.isAdmin ? (
                                                <span className="flex items-center gap-1 font-semibold text-primary"><ShieldCheck size={16}/> Admin</span>
                                            ) : (
                                                'User'
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                )}
                 {users.length === 0 && !isLoading && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No users found.</p>
                    </div>
                )}
            </CardContent>
        </Card>
        
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Purchase History for {selectedUser?.displayName}</DialogTitle>
                    <DialogDescription>{selectedUser?.email}</DialogDescription>
                </DialogHeader>
                 <div className="mt-4">
                    {loadingSales ? (
                        <div className="flex items-center justify-center h-24">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : userSales.length > 0 ? (
                        <ScrollArea className="h-[300px] pr-4">
                            <div className="space-y-4">
                                {userSales.map(sale => (
                                    <div key={sale.id} className="flex justify-between items-center p-3 bg-muted rounded-md">
                                        <div>
                                            <p className="font-medium">{sale.projectTitle}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {sale.purchasedAt?.toDate ? format(sale.purchasedAt.toDate(), 'PPP') : 'N/A'}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-primary">Rs. {sale.price.toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    ) : (
                         <div className="text-center text-muted-foreground py-12">
                            <p>This user has not purchased any projects.</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
        </>
    )
}
