
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow, fromUnixTime } from 'date-fns';

type User = {
    uid: string;
    displayName: string;
    email: string;
    createdAt: { seconds: number; nanoseconds: number; };
};

type UsersTableProps = {
    users: User[];
    title: string;
    description?: string;
};

export default function UsersTable({ users, title, description }: UsersTableProps) {

    const formatDate = (timestamp: { seconds: number, nanoseconds: number }) => {
        if (!timestamp) return 'N/A';
        const date = fromUnixTime(timestamp.seconds);
        return formatDistanceToNow(date, { addSuffix: true });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-right">Joined</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.uid}>
                                <TableCell>
                                    <div className="font-medium">{user.displayName}</div>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell className="text-right">{formatDate(user.createdAt)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
