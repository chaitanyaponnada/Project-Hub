
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Trash2, Reply } from 'lucide-react';
import { getInquiries, deleteInquiry, replyToInquiry } from '@/lib/firebase-services';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [inquiryToDelete, setInquiryToDelete] = useState<any | null>(null);
    const [inquiryToReply, setInquiryToReply] = useState<any | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const { toast } = useToast();
    
    const fetchInquiries = async () => {
        setIsLoading(true);
        const fetchedInquiries = await getInquiries();
        setInquiries(fetchedInquiries);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const handleDelete = async () => {
        if (!inquiryToDelete) return;
        setIsDeleting(true);
        try {
            await deleteInquiry(inquiryToDelete.id);
            setInquiries(inquiries.filter(i => i.id !== inquiryToDelete.id));
            toast({title: "Inquiry deleted."});
        } catch (error) {
            toast({title: "Error deleting inquiry.", variant: "destructive"})
        } finally {
            setIsDeleting(false);
            setInquiryToDelete(null);
        }
    }
    
    const handleMarkAsReplied = async () => {
        if (!inquiryToReply) return;
        setIsReplying(true);
        try {
            await replyToInquiry(inquiryToReply.id);
            fetchInquiries(); // Re-fetch to show the updated reply status
            toast({title: "Inquiry marked as replied."});
        } catch(error) {
            toast({title: "Error updating inquiry.", variant: "destructive"})
        } finally {
            setIsReplying(false);
            setInquiryToReply(null); // Close dialog on success
        }
    }

    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle>Inquiries</CardTitle>
                <CardDescription>Messages from the contact form. Reply to users via their email and mark as replied here.</CardDescription>
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
                                <TableHead>From</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Message</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Received</TableHead>
                                <TableHead>Actions</TableHead>
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
                                    <TableCell>
                                        {inquiry.repliedAt ? (
                                            <Badge variant="secondary" className="text-green-600 border-green-600">Replied</Badge>
                                        ) : (
                                            <Badge variant="outline">Pending</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>{inquiry.receivedAt ? format(inquiry.receivedAt.toDate(), 'PPP p') : 'N/A'}</TableCell>
                                    <TableCell className="space-x-1">
                                        <AlertDialogTrigger asChild>
                                             <Button variant="ghost" size="icon" onClick={() => setInquiryToReply(inquiry)} disabled={!!inquiry.repliedAt}>
                                                <Reply className="h-4 w-4"/>
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" onClick={() => setInquiryToDelete(inquiry)}>
                                                <Trash2 className="h-4 w-4 text-destructive"/>
                                            </Button>
                                        </AlertDialogTrigger>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
                 {inquiries.length === 0 && !isLoading && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No inquiries found.</p>
                    </div>
                )}
            </CardContent>
        </Card>
        
        {/* Reply Dialog */}
        <AlertDialog open={!!inquiryToReply} onOpenChange={() => setInquiryToReply(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Mark as Replied?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will mark the inquiry from "{inquiryToReply?.name}" as replied. Make sure you have responded to their email before confirming. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isReplying}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleMarkAsReplied} disabled={isReplying}>
                        {isReplying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Mark as Replied
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        {/* Delete Dialog */}
        <AlertDialog open={!!inquiryToDelete} onOpenChange={() => setInquiryToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will permanently delete the inquiry from "{inquiryToDelete?.name}".
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                    {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Delete
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    )
}
