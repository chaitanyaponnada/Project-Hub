"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, CheckCircle, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/use-cart';

function CheckoutContent() {
    const { user, loading } = useAuth();
    const { addPurchasedItems, clearCart, cartItems } = useCart();
    const router = useRouter();
    const searchParams = useSearchParams();
    const status = searchParams.get('status');

    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login?redirect=/checkout');
        }
    }, [user, loading, router]);
    
    useEffect(() => {
        if (status === 'success' && cartItems.length > 0) {
            addPurchasedItems(cartItems);
            clearCart();
        }
    }, [status, addPurchasedItems, clearCart, cartItems]);


    if (loading || !user || isProcessing) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }
    
    if (status === 'success') {
         return (
            <div className="container mx-auto px-4 py-20 flex items-center justify-center">
              <Card className="max-w-md w-full text-center p-8">
                <CardContent>
                  <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                  <h1 className="font-headline text-2xl font-bold text-primary mb-2">Payment Successful!</h1>
                  <p className="text-muted-foreground mb-6">
                    Thank you for your purchase! Your project files are now available in your profile.
                  </p>
                  <div className="flex gap-4 justify-center">
                     <Button onClick={() => router.push('/profile')}>Go to Profile</Button>
                     <Button onClick={() => router.push('/projects')} variant="outline">
                        Browse More Projects
                     </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
    }

    if(status === 'cancelled') {
        return (
            <div className="container mx-auto px-4 py-20 flex items-center justify-center">
              <Card className="max-w-md w-full text-center p-8">
                <CardContent>
                  <Ban className="mx-auto h-16 w-16 text-destructive mb-4" />
                  <h1 className="font-headline text-2xl font-bold text-destructive mb-2">Payment Cancelled</h1>
                  <p className="text-muted-foreground mb-6">
                    Your checkout process was cancelled. Your cart has been saved.
                  </p>
                   <Button onClick={() => router.push('/cart')} variant="outline">
                    Back to Cart
                  </Button>
                </CardContent>
              </Card>
            </div>
        )
    }

  return (
     <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <Card className="max-w-md w-full text-center p-8">
            <CardHeader>
                <CardTitle>Checkout</CardTitle>
                <CardDescription>This is a placeholder checkout page.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-6">
                    In a real application, this page would integrate a payment provider like Stripe.
                    Clicking "Confirm Purchase" will simulate a successful transaction.
                </p>
                <Button onClick={() => {
                    setIsProcessing(true);
                    setTimeout(() => {
                         router.push('/checkout?status=success');
                         setIsProcessing(false);
                    }, 1500)
                }}>
                    Confirm Purchase
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
