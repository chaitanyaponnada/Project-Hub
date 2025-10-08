
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { getInquiries } from '@/lib/firebase-services';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchInquiries = async () => {
            setIsLoading(true);
            const fetchedInquiries = await getInquiries();
            setInquiries(fetchedInquiries);
            setIsLoading(false);
        };
        fetchInquiries();
    }, []);


    return (
        <Card>
            <CardHeader>
                <CardTitle>Inquiries</CardTitle>
                <CardDescription>Messages from the contact form. Reply to users via their provided email.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : inquiries.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No inquiries found.</p>
                    </div>
                ) : (
                    <ScrollArea className="h-[60vh] w-full rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>From</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Message</TableHead>
                                    <TableHead>Received</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {inquiries.map(inquiry => (
                                    <TableRow key={inquiry.id}>
                                        <TableCell className="font-medium">{inquiry.name}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <a href={`mailto:${inquiry.email}`} className="text-primary underline">{inquiry.email}</a>
                                                {inquiry.phone && <span className="text-muted-foreground">{inquiry.phone}</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-sm whitespace-pre-wrap">{inquiry.message}</TableCell>
                                        <TableCell>{inquiry.receivedAt ? format(inquiry.receivedAt.toDate(), 'PPP p') : 'N/A'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    )
}
