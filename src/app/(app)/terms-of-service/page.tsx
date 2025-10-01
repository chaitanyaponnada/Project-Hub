"use client";

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function TermsOfServicePage() {
  const router = useRouter();

  return (
    <div className="bg-background animate-fade-in">
      <section className="py-24 md:py-32 bg-muted/30 relative">
         <div className="absolute top-8 left-8">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </div>
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">Terms of Service</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Please read these terms carefully before using our services.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl prose prose-lg dark:prose-invert">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using Project Hub ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you may not access the Service.</p>

          <h2>2. Description of Service</h2>
          <p>Project Hub provides a marketplace for users to purchase and download B.Tech project source code, documentation, and other related materials ("Projects"). All projects are intended for educational and personal use.</p>

          <h2>3. Licensing and Use of Projects</h2>
          <p>Upon purchase, you are granted a non-exclusive, non-transferable license to use the purchased Project for personal, educational, and portfolio purposes. You may not redistribute, resell, or use the Projects for commercial purposes without explicit permission.</p>

          <h2>4. User Accounts</h2>
          <p>To access certain features of the Service, you must register for an account. You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p>

          <h2>5. Payments and Refunds</h2>
          <p>All payments are processed through a secure third-party payment processor. Due to the digital nature of our products, all sales are final and non-refundable. Please review project details carefully before making a purchase.</p>

          <h2>6. Intellectual Property</h2>
          <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Project Hub and its licensors. Our trademarks may not be used in connection with any product or service without our prior written consent.</p>

          <h2>7. Limitation of Liability</h2>
          <p>In no event shall Project Hub, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
          
          <h2>8. Changes to Terms</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice prior to any new terms taking effect. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>

          <h2>9. Contact Us</h2>
          <p>If you have any questions about these Terms, please <a href="/contact">contact us</a>.</p>
        </div>
      </section>
    </div>
  );
}
