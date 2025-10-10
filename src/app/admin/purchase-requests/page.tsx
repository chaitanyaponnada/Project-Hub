
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Mail, Phone, Check } from 'lucide-react';
import { getPurchaseRequests, updatePurchaseRequestStatus } from '@/lib/firebase-services';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { PurchaseRequest } from '@/lib/placeholder-data';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from '@/components/ui/select';

export default function AdminPurchaseRequestsPage() {
    const [requests, setRequests] = useState<PurchaseRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    
    useEffect(() => {
        const fetchRequests = async () => {
            setIsLoading(true);
            try {
                const fetchedRequests = await getPurchaseRequests();
                setRequests(fetchedRequests);
            } catch (e) {
                console.error(e);
                toast({
                    title: "Error",
                    description: "Could not fetch purchase requests.",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchRequests();
    }, [toast]);
    
    const handleStatusChange = async (requestId: string, status: 'pending' | 'contacted') => {
        // Optimistically update the UI
        setRequests(prev => prev.map(req => req.id === requestId ? { ...req, status } : req));

        try {
            await updatePurchaseRequestStatus(requestId, status);
            toast({
                title: "Status Updated",
                description: "The request status has been updated.",
            });
        } catch(e) {
            console.error(e);
             toast({
                title: "Update Failed",
                description: "Could not update the status. Please try again.",
                variant: "destructive"
            });
            // Revert UI change on failure
            setRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: status === 'pending' ? 'contacted' : 'pending' } : req));
        }
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>Purchase Requests</CardTitle>
                <CardDescription>Requests from users interested in buying a project.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No purchase requests found.</p>
                    </div>
                ) : (
                    <ScrollArea className="h-[60vh] w-full rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Project</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requests.map(request => (
                                    <TableRow key={request.id}>
                                        <TableCell className="font-medium">{request.projectTitle}</TableCell>
                                        <TableCell>{request.userName}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <a href={`mailto:${request.userEmail}`} className="flex items-center gap-2 text-primary underline">
                                                    <Mail size={14}/> {request.userEmail}
                                                </a>
                                                <a href={`tel:${request.userPhone}`} className="flex items-center gap-2 text-primary underline">
                                                    <Phone size={14}/> {request.userPhone}
                                                </a>
                                            </div>
                                        </TableCell>
                                        <TableCell>{request.requestedAt ? format(request.requestedAt.toDate(), 'PPP p') : 'N/A'}</TableCell>
                                        <TableCell>
                                            <Select
                                                defaultValue={request.status}
                                                onValueChange={(value: 'pending' | 'contacted') => handleStatusChange(request.id, value)}
                                            >
                                                <SelectTrigger className={cn("w-[120px]", request.status === 'pending' ? 'text-destructive' : 'text-green-600')}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="contacted">Contacted</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
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
