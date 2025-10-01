

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CartPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

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

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <h1 className="font-headline text-4xl font-bold text-primary mb-8 animate-fade-in-down">Shopping Cart</h1>
      
      <Card className="text-center p-12 border-dashed animate-fade-in-up">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="font-headline text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Database functionality has been removed. Cart is disabled.</p>
        <Button asChild>
          <Link href="/projects">Browse Projects</Link>
        </Button>
      </Card>
      
    </div>
  );
}
