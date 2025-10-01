
"use client";

import { useRouter } from "next/navigation";
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
import { Code, Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required."),
});

const NodeGarden = () => {
    return (
        <div className="absolute inset-0 z-0">
            {Array.from({ length: 50 }).map((_, i) => (
                <div
                    key={i}
                    className="node"
                    style={{
                        '--size': `${Math.random() * 5 + 2}px`,
                        '--x': `${Math.random() * 100}%`,
                        '--y': `${Math.random() * 100}%`,
                        '--duration': `${Math.random() * 10 + 10}s`,
                        '--delay': `${Math.random() * -10}s`,
                    } as React.CSSProperties}
                />
            ))}
        </div>
    );
};

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(',');
  const adminPasswords = (process.env.NEXT_PUBLIC_ADMIN_PASSWORDS || "").split(',');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    // Simulate a brief delay for a better user experience
    await new Promise(resolve => setTimeout(resolve, 500));

    const adminEmailIndex = adminEmails.findIndex(email => email.trim() === values.email.trim());

    if (adminEmailIndex !== -1 && adminPasswords[adminEmailIndex] && adminPasswords[adminEmailIndex].trim() === values.password) {
      toast({ title: "Admin login successful!" });
      router.push("/admin");
    } else {
      toast({
        title: "Unauthorized",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-muted/40 p-4 overflow-hidden">
        <NodeGarden />
      <Card className="w-full max-w-sm animate-fade-in-up z-10">
        <CardHeader className="text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 mb-4"
          >
            <Code className="h-8 w-8 text-primary" />
          </Link>
          <CardTitle className="font-headline text-2xl">
            Admin Access
          </CardTitle>
          <CardDescription>
            Sign in with your authorized admin credentials.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showPassword ? "text" : "password"} {...field} />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:bg-transparent"
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                           {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardContent>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign In
              </Button>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
}
