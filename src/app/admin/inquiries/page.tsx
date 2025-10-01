
"use client";

import { useEffect, useState } from "react";
import { getInquiries, deleteInquiry } from "@/lib/firebase-services";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type Inquiry = {
    id: string;
    name: string;
    email: string;
    message: string;
    receivedAt: { seconds: number; nanoseconds: number };
};

export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchInquiries = async () => {
            try {
                const data = await getInquiries();
                setInquiries(data as Inquiry[]);
            } catch (error) {
                console.error("Error fetching inquiries:", error);
                toast({
                    title: "Error",
                    description: "Failed to fetch inquiries.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchInquiries();
    }, [toast]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this inquiry?")) return;

        try {
            await deleteInquiry(id);
            setInquiries(inquiries.filter(inq => inq.id !== id));
            toast({
                title: "Inquiry Deleted",
                description: "The inquiry has been successfully deleted.",
            });
        } catch (error) {
            console.error("Error deleting inquiry:", error);
            toast({
                title: "Error",
                description: "Failed to delete the inquiry.",
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Contact Inquiries</CardTitle>
                    <CardDescription>Messages submitted through the contact form.</CardDescription>
                </CardHeader>
            </Card>
            {inquiries.length > 0 ? (
                inquiries.map(inquiry => (
                    <Card key={inquiry.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">{inquiry.name}</CardTitle>
                                    <CardDescription>{inquiry.email}</CardDescription>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {inquiry.receivedAt ? format(new Date(inquiry.receivedAt.seconds * 1000), "PPp") : 'N/A'}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">{inquiry.message}</p>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(inquiry.id)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </Button>
                        </CardFooter>
                    </Card>
                ))
            ) : (
                <Card className="text-center p-12 border-dashed">
                    <p>No inquiries found.</p>
                </Card>
            )}
        </div>
    );
}
