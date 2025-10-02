
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2, Send } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { addInquiry } from "@/lib/firebase-services";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  message: z.string().min(10, "Message must be at least 10 characters.").max(1000, "Message must not exceed 1000 characters."),
});

export default function ContactPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  useEffect(() => {
    if (user) {
        form.reset({
            name: user.displayName || '',
            email: user.email || '',
            phone: user.phoneNumber || '',
            message: ''
        })
    }
  }, [user, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      await addInquiry(values, user?.uid);
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you shortly.",
      });

      form.reset({
          ...form.getValues(),
          message: ''
      });
    } catch(e) {
       toast({
        title: "Error Sending Message",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 animate-fade-in">
        <div className="max-w-2xl mx-auto">
            <header className="text-center mb-12 animate-fade-in-down">
                <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Contact Us</h1>
                <p className="text-lg text-muted-foreground mt-2">
                    Have a question or feedback? Drop us a line!
                </p>
            </header>
            
            <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Send a Message</CardTitle>
                    <CardDescription>We typically respond within 24-48 hours.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="you@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                             <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input type="tel" placeholder="+91 98765 43210" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Your Message</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Tell us what's on your mind..."
                                                className="min-h-[150px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end">
                                <Button type="submit" disabled={isLoading} size="lg">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-5 w-5" />
                                            Send Message
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
