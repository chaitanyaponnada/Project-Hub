
"use client"

import { useEffect, useState } from 'react';
import UsersTable from '@/components/admin/users-table';
import { getUsers } from '@/lib/firebase-services';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await getUsers();
                setUsers(fetchedUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
                toast({
                    title: "Error",
                    description: "Could not fetch users.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [toast]);

    if (loading) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div>
            <UsersTable users={users} title="All Users" description="A list of all registered users." />
        </div>
    );
}
