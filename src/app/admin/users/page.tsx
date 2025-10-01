
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, User } from 'lucide-react';
import { getUsers } from '@/lib/firebase-services';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            const fetchedUsers = await getUsers();
            setUsers(fetchedUsers);
            setIsLoading(false);
        };
        fetchUsers();
    }, []);

    const getInitials = (name?: string | null) => {
        if (!name) return <User className="h-4 w-4" />;
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>List of all registered users.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Date Joined</TableHead>
                                <TableHead>Last Sign-in</TableHead>
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
                                        {user.createdAt ? format(user.createdAt.toDate(), 'PPP') : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {user.lastSignInTime ? format(user.lastSignInTime.toDate(), 'PPP p') : 'N/A'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    )
}
