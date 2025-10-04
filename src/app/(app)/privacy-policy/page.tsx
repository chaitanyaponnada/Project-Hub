
"use client";

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function PrivacyPolicyPage() {
  const router = useRouter();
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    // Set date string only on the client-side to avoid hydration mismatch
    setLastUpdated(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  return (
    <div className="bg-background animate-fade-in">
      <section className="py-24 md:py-32 bg-muted/30 relative">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">Privacy Policy</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Your privacy is important to us.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl prose prose-lg dark:prose-invert">
          {lastUpdated ? <p><em>Last updated: {lastUpdated}</em></p> : <div className="h-6 w-48 bg-muted rounded-md animate-pulse mb-4" />}
          
          <h2>1. Introduction</h2>
          <p>Project Hub ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services (collectively, the "Service").</p>

          <h2>2. Information We Collect</h2>
          <p>We may collect personal information that you provide directly to us, such as when you create an account, make a purchase, or contact us. This information may include:</p>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Password</li>
            <li>Payment information (processed by a third-party)</li>
          </ul>
          <p>We also collect non-personal information automatically as you navigate through the site, such as usage details, IP addresses, and information collected through cookies.</p>

          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, operate, and maintain our Service</li>
            <li>Process your transactions and manage your orders</li>
            <li>Improve, personalize, and expand our Service</li>
            <li>Communicate with you, including for customer service and to send you updates</li>
            <li>Prevent fraudulent activity</li>
          </ul>

          <h2>4. Sharing Your Information</h2>
          <p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except in the following circumstances:</p>
          <ul>
            <li>With trusted third-party service providers who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.</li>
<li>To comply with legal obligations, protect our rights, and enforce our policies.</li>
          </ul>

          <h2>5. Data Security</h2>
          <p>We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems and are required to keep the information confidential.</p>

          <h2>6. Your Data Rights</h2>
          <p>You have the right to access, update, or delete the personal information we have on you. You can do this by accessing your account settings or by contacting us directly.</p>

          <h2>7. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
          
          <h2>8. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please <a href="/contact">contact us</a>.</p>
        </div>
      </section>
    </div>
  );
}

    
