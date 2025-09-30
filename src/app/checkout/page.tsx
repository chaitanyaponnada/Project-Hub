"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
        router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <p>Loading...</p>
            </div>
        );
    }
  return (
    <div className="container mx-auto px-4 py-20 flex items-center justify-center">
      <Card className="max-w-md w-full text-center p-8">
        <CardContent>
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h1 className="font-headline text-2xl font-bold text-primary mb-2">Checkout Placeholder</h1>
          <p className="text-muted-foreground mb-6">
            This is a placeholder for the checkout process. In a real application, this is where you would integrate a payment gateway like Stripe.
          </p>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
