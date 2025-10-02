
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { CheckCircle, ExternalLink } from "lucide-react";

export default function PaymentGuidePage() {

    const steps = [
        {
            title: "Go to the Firebase Console",
            description: "Navigate to your Firebase project console to manage extensions.",
            link: "https://console.firebase.google.com/",
        },
        {
            title: "Install the Stripe Payment Extension",
            description: "Search for the 'Run Payments with Stripe' extension in the Firebase Extensions marketplace and install it. This extension automatically creates and manages customer payment information.",
            link: "https://firebase.google.com/products/extensions/stripe-payments",
        },
        {
            title: "Configure the Extension",
            description: "During installation, you'll be prompted to provide your Stripe API keys (secret and publishable). You will also configure the Firestore collections for products and customers.",
        },
        {
            title: "Set 'customers' collection in Firestore",
            description: "This application creates checkout sessions in a collection named `customers`. Ensure this matches the collection name you set when configuring the Stripe extension.",
        },
        {
            title: "Add Products and Prices in Stripe",
            description: "Go to your Stripe Dashboard and create the products that correspond to the projects in your marketplace. Make sure to set a price for each.",
        },
        {
            title: "Sync Products with Firestore",
            description: "The Stripe extension includes a tool to sync your Stripe products with a Firestore collection. Use this to make your products available to your app.",
        },
        {
            title: "Enable Cloud Functions for Firebase",
            description: "The Stripe extension uses Cloud Functions to operate. Ensure that the 'Cloud Functions for Firebase' API is enabled in your Google Cloud project.",
        },
        {
            title: "Test Your Integration",
            description: "Use Stripe's test card numbers to perform a test transaction. This will confirm that your checkout flow is working correctly from start to finish.",
        },
    ];


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Stripe Payment Integration Guide</h1>
      <p className="text-muted-foreground">Follow these steps to set up payments for your marketplace using the official Firebase Stripe extension.</p>
      
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
                <span>You're All Set!</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-secondary-foreground">Once these steps are completed, your app's checkout functionality will be fully operational. The existing code is already set up to create Stripe checkout sessions and handle the redirects.</p>
          </CardContent>
        </Card>
    </div>
  );
}
