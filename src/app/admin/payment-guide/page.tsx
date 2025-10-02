
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { CheckCircle, ExternalLink } from "lucide-react";

export default function PaymentGuidePage() {

    const steps = [
        {
            title: "Sign up for a PayU Merchant Account",
            description: "If you don't have one already, create a merchant account on the PayU website.",
            link: "https://payu.in/",
        },
        {
            title: "Get Your Merchant Key and Salt",
            description: "Navigate to your PayU dashboard, find the 'Integration Details' section (usually under 'Account' or 'Settings'), and copy your Merchant Key and Salt.",
        },
        {
            title: "Add Credentials to Environment File",
            description: "Open the `.env` file in the root of your project. You will see two placeholders: `PAYU_KEY` and `PAYU_SALT`. Replace the placeholder text with the actual Key and Salt you copied from your PayU dashboard.",
        },
        {
            title: "Understand the Test Environment",
            description: "The integration is currently configured to use PayU's test environment ('https://test.payu.in/_payment'). This allows you to use PayU's test card numbers and credentials to simulate transactions without using real money.",
        },
        {
            title: "Test the Checkout Flow",
            description: "Add a project to your cart and click the 'Checkout with PayU' button. You will be redirected to the PayU test page to complete a mock payment.",
        },
        {
            title: "Go Live",
            description: "When you are ready for real transactions, you will need to update the form action URL in `src/hooks/use-cart.tsx` from `https://test.payu.in/_payment` to PayU's live endpoint: `https://secure.payu.in/_payment`.",
        },
    ];


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">PayU Payment Integration Guide</h1>
      <p className="text-muted-foreground">Follow these steps to set up payments using your PayU merchant account.</p>
      
      <div className="grid gap-6">
        {steps.map((step, index) => (
           <Card key={index}>
            <CardHeader className="flex flex-row items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold mt-1">
                    {index + 1}
                </div>
                <div className="flex-1">
                    <CardTitle>{step.title}</CardTitle>
                    {step.link && (
                         <a href={step.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                            Go to Link <ExternalLink size={14}/>
                        </a>
                    )}
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
                <span>Integration Complete</span>
            </CardTitle>
          </Header>
          <CardContent>
            <p className="text-secondary-foreground">The application is now fully configured for a custom PayU integration. Once you add your credentials to the `.env` file, the payment flow will be active and ready for testing.</p>
          </CardContent>
        </Card>
    </div>
  );
}
