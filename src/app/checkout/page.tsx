
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Ban, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login?redirect=/checkout');
        }
    }, [user, loading, router]);


    if (loading || !user) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }
  return (
    <div className="container mx-auto px-4 py-20 flex items-center justify-center">
      <Card className="max-w-md w-full text-center p-8">
        <CardContent>
          <Ban className="mx-auto h-16 w-16 text-destructive mb-4" />
          <h1 className="font-headline text-2xl font-bold text-destructive mb-2">Checkout Disabled</h1>
          <p className="text-muted-foreground mb-6">
            Database functionality has been removed from this project. The checkout process is no longer available.
          </p>
          <Button onClick={() => router.push('/projects')} variant="outline">
            Browse Projects
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
