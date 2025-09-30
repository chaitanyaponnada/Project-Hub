"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShoppingBag } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CartPage() {
  const { cartItems, removeFromCart, totalPrice, cartCount } = useCart();
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
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-headline text-4xl font-bold text-primary mb-8">Shopping Cart</h1>
      {cartCount > 0 ? (
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="flex items-center p-4">
                <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-md overflow-hidden mr-4 flex-shrink-0">
                  <Image
                    src={item.imageUrls[0]}
                    alt={item.title}
                    fill
                    className="object-cover"
                    data-ai-hint={item.imageHints[0]}
                  />
                </div>
                <div className="flex-1">
                  <h2 className="font-headline font-semibold text-lg">{item.title}</h2>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                  <p className="text-lg font-bold text-primary mt-2">₹{item.price}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.title} from cart`}>
                  <Trash2 className="h-5 w-5 text-destructive" />
                </Button>
              </Card>
            ))}
          </div>

          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="font-headline">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>Calculated at checkout</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <Card className="text-center p-12 border-dashed">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="font-headline text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Looks like you haven't added any projects yet.</p>
          <Button asChild>
            <Link href="/">Browse Projects</Link>
          </Button>
        </Card>
      )}
    </div>
  );
}
