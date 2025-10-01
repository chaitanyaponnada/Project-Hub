
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, User, ShieldCheck } from 'lucide-react';
import { getUsers, promoteToAdmin, isAdmin } from '@/lib/firebase-services';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [adminStatus, setAdminStatus] = useState<Record<string, boolean>>({});
    const { toast } = useToast();

    const fetchUsersAndAdmins = async () => {
        setIsLoading(true);
        const fetchedUsers = await getUsers();
        const adminChecks = await Promise.all(fetchedUsers.map(user => isAdmin(user.uid)));
        
        const adminStatusMap: Record<string, boolean> = {};
        fetchedUsers.forEach((user, index) => {
            adminStatusMap[user.uid] = adminChecks[index];
        });

        setUsers(fetchedUsers);
        setAdminStatus(adminStatusMap);
        setIsLoading(false);
    };
    
    useEffect(() => {
        fetchUsersAndAdmins();
    }, []);

    const getInitials = (name?: string | null) => {
        if (!name) return <User className="h-4 w-4" />;
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    const handlePromote = async (uid: string) => {
        try {
            await promoteToAdmin(uid);
            setAdminStatus(prev => ({...prev, [uid]: true}));
            toast({title: "User Promoted", description: "The user has been granted admin privileges."});
        } catch (error) {
            console.error("Failed to promote user:", error);
            toast({title: "Error", description: "Failed to promote user.", variant: "destructive"});
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>List of all registered users. You can promote users to admins here.</CardDescription>
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
                                        {user.createdAt ? format(user.createdAt.toDate(), 'PPP') : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {adminStatus[user.uid] ? (
                                            <span className="flex items-center gap-1 font-semibold text-primary"><ShieldCheck size={16}/> Admin</span>
                                        ) : (
                                            'User'
                                        )}
                                    </TableCell>
                                     <TableCell>
                                        {!adminStatus[user.uid] && (
                                            <Button size="sm" onClick={() => handlePromote(user.uid)}>
                                                Promote to Admin
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
                 {users.length === 0 && !isLoading && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No users found.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
