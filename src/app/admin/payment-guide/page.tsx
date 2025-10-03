
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { CheckCircle, Info, ExternalLink } from "lucide-react";

export default function PaymentGuidePage() {

    const steps = [
        {
            title: "Current Status: Dummy Payment System",
            description: "The application is currently configured with a simulated payment system. This allows you to test the complete user flow—from adding a project to the cart to 'purchasing' it—without requiring any real payment credentials or setup. When a user checks out, the system mimics a successful payment.",
        },
        {
            title: "How It Works",
            description: "The logic is handled in `src/hooks/use-cart.tsx`. When `handleDummyCheckout` is called, it simulates a 2-second delay, then adds the cart items to the user's purchased items list, clears the cart, and redirects to a success page. Sales data is still recorded in Firestore for admin tracking.",
        },
        {
            title: "Integrating a Real Payment Gateway",
            description: "To use a real payment provider like Stripe or PayU, you would need to replace the logic inside `handleDummyCheckout` with your chosen provider's SDK and API calls. This typically involves creating a server-side endpoint to generate a payment intent and redirecting the user to a checkout page.",
        },
    ];


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Payment System Guide</h1>
      <p className="text-muted-foreground">Information about the current payment setup.</p>
      
      <div className="grid gap-6">
        {steps.map((step, index) => (
           <Card key={index}>
            <CardHeader className="flex flex-row items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold mt-1">
                    <Info size={18} />
                </div>
                <div className="flex-1">
                    <CardTitle>{step.title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <p className="pl-12 text-muted-foreground">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

       <Card className="bg-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <CheckCircle className="text-green-500"/>
                <span>Ready for Testing</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-secondary-foreground">The application's dummy payment system is fully functional for testing and demonstration purposes. No further configuration is needed to simulate purchases.</p>
          </CardContent>
        </Card>
    </div>
  );
}
