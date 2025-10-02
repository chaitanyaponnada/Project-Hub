
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { CheckCircle, ExternalLink } from "lucide-react";

export default function PaymentGuidePage() {

    const steps = [
        {
            title: "Go to the Firebase Console",
            description: "Navigate to your Firebase project console to find and install extensions.",
            link: "https://console.firebase.google.com/",
        },
        {
            title: "Install the 'Payments with Google Pay' Extension",
            description: "In the Firebase Extensions marketplace, search for 'Payments with Google Pay' and install it. This extension handles routing payment requests to different providers.",
            link: "https://firebase.google.com/products/extensions/google-pay-payments",
        },
        {
            title: "Configure the Extension for Square",
            description: "During installation, you will be prompted for several configuration values. Set the 'Cloud Functions location', and define the 'Collection path' where your app will write payment requests (e.g., 'payments').",
        },
        {
            title: "Add Square Configuration",
            description: `You'll need to provide a JSON string for your PSP configuration. For Square, use the following format: { "environment": "Sandbox" } (or "Production" for live payments).`,
        },
        {
            title: "Set Up Square Access Token in Secret Manager",
            description: "The extension will ask for your Square access token. Provide a name for the secret (e.g., SQUARE_ACCESS_TOKEN) and the actual token value from your Square Developer Dashboard. The extension will store this securely in Google Secret Manager.",
        },
        {
            title: "Implement the Google Pay Button",
            description: "The frontend needs to use the Google Pay API to request a payment token from the user when they click 'Checkout'. This token must then be sent to the Firestore collection you configured in step 3.",
        },
        {
            title: "Test Your Integration",
            description: "Once the Google Pay button is implemented, perform a test transaction using Google Pay's test environment to ensure the entire flow is working correctly.",
        },
    ];


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Square Payment Integration Guide (via Google Pay)</h1>
      <p className="text-muted-foreground">Follow these steps to set up payments using the 'Payments with Google Pay' Firebase extension.</p>
      
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
                <span>Next Steps</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-secondary-foreground">After completing these configuration steps, the final piece is to implement the Google Pay button on the frontend to generate the payment token. The application's checkout logic has been updated to support this flow, but the UI component for Google Pay still needs to be built.</p>
          </CardContent>
        </Card>
    </div>
  );
}
