
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, Suspense, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, CheckCircle, Ban, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/hooks/use-cart';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

function CheckoutContent() {
    const { user, loading } = useAuth();
    const { clearCart, cartItems } = useCart();
    const router = useRouter();
    const searchParams = useSearchParams();
    const stripeStatus = searchParams.get('status');
    const gpaySessionId = searchParams.get('gpay_session_id');
    const [gpayStatus, setGpayStatus] = useState<'loading' | 'success' | 'error' | null>(gpaySessionId ? 'loading' : null);

    // Listener for Stripe redirect
    useEffect(() => {
        if (stripeStatus === 'success' && cartItems.length > 0) {
            clearCart();
        }
    }, [stripeStatus, clearCart, cartItems.length]);

    // Listener for Google Pay payment result
    useEffect(() => {
        if (gpaySessionId && user) {
            const paymentDocRef = doc(db, "customers", user.uid, "payments", gpaySessionId);
            const unsubscribe = onSnapshot(paymentDocRef, (snap) => {
                const paymentData = snap.data();
                if (paymentData?.status?.state === 'SUCCESS') {
                    setGpayStatus('success');
                    clearCart();
                    unsubscribe();
                } else if (paymentData?.status?.state === 'ERROR') {
                    setGpayStatus('error');
                    unsubscribe();
                }
            });
            return () => unsubscribe();
        }
    }, [gpaySessionId, user, clearCart]);


    if (loading || !user) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }
    
    if (stripeStatus === 'success' || gpayStatus === 'success') {
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

    if(stripeStatus === 'cancelled') {
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

    if (gpayStatus === 'error') {
        return (
            <div className="container mx-auto px-4 py-20 flex items-center justify-center">
              <Card className="max-w-md w-full text-center p-8">
                <CardContent>
                  <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />
                  <h1 className="font-headline text-2xl font-bold text-destructive mb-2">Payment Failed</h1>
                  <p className="text-muted-foreground mb-6">
                    There was an issue processing your payment. Please try again.
                  </p>
                   <Button onClick={() => router.push('/cart')} variant="outline">
                    Back to Cart
                  </Button>
                </CardContent>
              </Card>
            </div>
        )
    }


    // Default view if processing or redirecting
    return (
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
             <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="ml-4">Processing your payment...</p>
            </div>
        </div>
    )
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
