
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ShoppingBag, Loader2, Trash2, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { cartItems, removeFromCart, totalPrice, cartCount, clearCart, handlePayUCheckout, isCheckingOut } = useCart();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/cart');
    }
  }, [user, loading, router]);


  if (loading || !user) {
      return (
        <div className="flex items-center justify-center h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
  }
  
  if (cartCount === 0) {
      return (
        <div className="container mx-auto px-4 py-12 animate-fade-in">
          <h1 className="font-headline text-4xl font-bold text-primary mb-8 animate-fade-in-down">Shopping Cart</h1>
          
          <Card className="text-center p-12 border-dashed animate-fade-in-up">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="font-headline text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Looks like you haven't added any projects yet.</p>
            <Button asChild>
              <Link href="/projects">Browse Projects</Link>
            </Button>
          </Card>
        </div>
      );
  }

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
        <div className="flex justify-between items-center mb-8">
            <h1 className="font-headline text-4xl font-bold text-primary animate-fade-in-down">Shopping Cart</h1>
             <Button variant="outline" size="sm" onClick={clearCart} disabled={cartCount === 0 || isCheckingOut}>
                <Trash2 className="mr-2 h-4 w-4" /> Clear Cart
            </Button>
        </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
                <Card key={item.id} className="flex items-center p-4">
                    <div className="relative h-24 w-24 rounded-md overflow-hidden mr-4">
                        <Image src={item.imageUrls[0]} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-muted-foreground text-sm">{item.category}</p>
                        <p className="font-bold text-primary mt-1">Rs. {item.price.toFixed(2)}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} disabled={isCheckingOut}>
                        <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                    </Button>
                </Card>
            ))}
        </div>

        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <h2 className="text-2xl font-headline font-bold">Order Summary</h2>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <p className="text-muted-foreground">Subtotal</p>
                            <p className="font-semibold">Rs. {totalPrice.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-muted-foreground">Taxes</p>
                            <p className="font-semibold">Calculated at checkout</p>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                            <p>Total</p>
                            <p>Rs. {totalPrice.toFixed(2)}</p>
                        </div>
                         
                        <div className="w-full">
                           <Button onClick={handlePayUCheckout} disabled={isCheckingOut} className="w-full" size="lg">
                                {isCheckingOut ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="mr-2 h-5 w-5" />
                                        Checkout with PayU
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
      
    </div>
  );
}
