
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Code, Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { isAdmin } from "@/lib/firebase-services";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "chaitanyaponnada657@gmail.com",
      password: "admin@super",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      
      const userIsAdmin = await isAdmin(userCredential.user.uid);

      if (userIsAdmin) {
        router.push("/admin");
        toast({ title: "Admin login successful!" });
      } else {
        await auth.signOut();
        toast({
          title: "Login Failed",
          description: "You are not authorized to access this page.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePasswordReset() {
    if (!resetEmail) {
        toast({ title: "Email required", description: "Please enter your email address.", variant: "destructive" });
        return;
    }
    setIsResetting(true);
    try {
        await sendPasswordResetEmail(auth, resetEmail);
        toast({
            title: "Password Reset Email Sent",
            description: "If an account with that email exists, a reset link has been sent.",
        });
        setResetEmail("");
    } catch (error: any) {
        // We generally don't want to reveal if an email exists or not, but for debugging, you might log this.
        console.error("Password reset error:", error);
         toast({
            title: "Password Reset Email Sent",
            description: "If an account with that email exists, a reset link has been sent.",
        });
    } finally {
        setIsResetting(false);
    }
}

  return (
      <Card className="w-full max-w-sm">
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
            Enter your admin credentials to continue.
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
                     <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="link" className="p-0 h-auto text-xs">Forgot Password?</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Reset Password</DialogTitle>
                                    <DialogDescription>
                                        Enter your email address below. We'll send you a link to reset your password.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-2">
                                    <Input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                    />
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button onClick={handlePasswordReset} disabled={isResetting}>
                                        {isResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Send Reset Link
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign In
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
  );
}
