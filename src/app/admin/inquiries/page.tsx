
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';

export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [inquiryToDelete, setInquiryToDelete] = useState<any | null>(null);
    const [inquiryToReply, setInquiryToReply] = useState<any | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
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
    
    const handleReply = async () => {
        if (!inquiryToReply || !replyText) return;
        setIsReplying(true);
        try {
            await replyToInquiry(inquiryToReply.id, replyText);
            fetchInquiries(); // Re-fetch to show the updated reply status
            toast({title: "Reply sent."});
            setInquiryToReply(null); // Close dialog on success
        } catch(error) {
            toast({title: "Error sending reply.", variant: "destructive"})
        } finally {
            setIsReplying(false);
            setReplyText('');
        }
    }

    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle>Inquiries</CardTitle>
                <CardDescription>Messages from the contact form.</CardDescription>
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
                                <TableHead>Email</TableHead>
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
                                    <TableCell>{inquiry.email}</TableCell>
                                    <TableCell className="max-w-sm whitespace-pre-wrap">{inquiry.message}</TableCell>
                                    <TableCell>
                                        {inquiry.reply ? (
                                            <span className="text-green-600 font-medium">Replied</span>
                                        ) : (
                                            <span className="text-yellow-600 font-medium">Pending</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{inquiry.receivedAt ? format(inquiry.receivedAt.toDate(), 'PPP p') : 'N/A'}</TableCell>
                                    <TableCell className="space-x-1">
                                        <Dialog onOpenChange={(open) => { if(!open) setInquiryToReply(null); }}>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="icon" onClick={() => { setInquiryToReply(inquiry); setReplyText(inquiry.reply || ''); }}>
                                                    <Reply className="h-4 w-4"/>
                                                </Button>
                                            </DialogTrigger>
                                        </Dialog>
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
        <Dialog open={!!inquiryToReply} onOpenChange={(open) => { if(!open) setInquiryToReply(null); }}>
             <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reply to {inquiryToReply?.name}</DialogTitle>
                    <DialogDescription>Your reply will be visible to the user on their profile page.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm font-semibold mb-2">Original Message:</p>
                    <blockquote className="border-l-2 pl-4 text-sm text-muted-foreground mb-4 whitespace-pre-wrap">{inquiryToReply?.message}</blockquote>
                    <Textarea
                        placeholder="Type your reply here..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={6}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setInquiryToReply(null)} disabled={isReplying}>Cancel</Button>
                    <Button onClick={handleReply} disabled={isReplying || !replyText}>
                        {isReplying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Reply
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

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
