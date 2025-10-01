

"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUsers } from "@/lib/firebase-services";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type AppUser = {
  id: string;
  name: string | null;
  email: string | null;
  joined: string;
  orders: number;
  totalSpent: number;
  photoURL: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="mb-6 animate-fade-in-down">
        <h1 className="font-headline text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">View and manage all registered users.</p>
      </div>

      <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="hidden md:table-cell">Joined</TableHead>
                <TableHead className="hidden sm:table-cell">Orders</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.photoURL ?? undefined} />
                        <AvatarFallback>{user.name ? user.name.charAt(0) : 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{user.joined}</TableCell>
                  <TableCell className="hidden sm:table-cell">{user.orders}</TableCell>
                  <TableCell className="text-right font-mono">Rs. {user.totalSpent.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
            {users.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
              No users found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}