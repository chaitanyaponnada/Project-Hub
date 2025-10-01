

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
import { Badge } from "@/components/ui/badge";
import { getInquiries } from "@/lib/firebase-services";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type { Inquiry } from "@/hooks/use-inquiry";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
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
        <h1 className="font-headline text-3xl font-bold">User Inquiries</h1>
        <p className="text-muted-foreground">Messages submitted through the contact form.</p>
      </div>

      <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead className="hidden md:table-cell">Received</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell>
                      <div>
                        <p className="font-medium">{inquiry.name}</p>
                        <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                      </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">{inquiry.receivedAt}</Badge>
                  </TableCell>
                  <TableCell className="max-w-sm">
                    <p className="truncate">{inquiry.message}</p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {inquiries.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
              No inquiries found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
