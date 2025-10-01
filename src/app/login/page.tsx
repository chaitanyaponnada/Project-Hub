
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Code, Loader2, Eye, EyeOff } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { NodeGarden } from "@/components/node-garden";
import { getUserById } from "@/lib/firebase-services";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C44.57,34.933,48,29.898,48,24C48,22.659,47.862,21.35,47.611,20.083z" />
    </svg>
);


export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleLogin(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      const userDoc = await getUserById(user.uid);
      
      if (userDoc && userDoc.isAdmin) {
          toast({ title: "Admin login successful!" });
          router.push('/admin');
      } else if (userDoc) {
          toast({ title: "Login successful!" });
          router.push(redirectUrl);
      } else {
          await auth.signOut();
          toast({ title: "Login Failed", description: "No user record found.", variant: "destructive" });
      }

    } catch (error: any) {
      let friendlyMessage = "An unexpected error occurred. Please try again.";
      switch (error.code) {
          case 'auth/user-not-found':
              friendlyMessage = "No account found with this email address. Please sign up.";
              break;
          case 'auth/wrong-password':
              friendlyMessage = "Incorrect password. Please try again.";
              break;
          case 'auth/invalid-credential':
               friendlyMessage = "Incorrect email or password. Please try again.";
              break;
      }
      toast({
        title: "Login Failed",
        description: friendlyMessage,
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
        console.error("Password reset error:", error);
         toast({
            title: "Password Reset Email Sent",
            description: "If an account with that email exists, a reset link has been sent.",
        });
    } finally {
        setIsResetting(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
      // The redirect will cause the page to reload. The result is handled in the useAuth hook.
    } catch (error: any) {
      console.error("Google Sign-In error:", error);
      toast({
        title: "Google Sign-In Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsGoogleLoading(false);
    }
  }


  return (
    <div className="relative flex items-center justify-center min-h-screen bg-muted/40 p-4 overflow-hidden">
      <NodeGarden />
      <Card className="w-full max-w-sm animate-fade-in-up z-10">
        <CardHeader className="text-center pb-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 mb-4"
          >
            <Code className="h-8 w-8 text-primary" />
          </Link>
          <CardTitle className="font-headline text-2xl">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Sign in to continue to Project Hub.
          </CardDescription>
        </CardHeader>
        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)}>
                <CardContent className="space-y-4 pt-4">
                    <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignIn} disabled={isGoogleLoading || isLoading}>
                        {isGoogleLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <GoogleIcon className="mr-2 h-4 w-4" />
                        )}
                        Sign in with Google
                    </Button>

                    <div className="flex items-center space-x-2">
                        <Separator className="flex-1" />
                        <span className="text-xs text-muted-foreground">OR</span>
                        <Separator className="flex-1" />
                    </div>

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                type="email"
                                placeholder="m@example.com"
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
                                <div className="relative">
                                <Input type={showPassword ? "text" : "password"} {...field} />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:bg-transparent"
                                    onClick={() => setShowPassword((prev: boolean) => !prev)}
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
                <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                    </Button>
                    <div className="text-center text-sm">
                    Don't have an account?{" "}
                    <Link href="/register" className="underline text-primary hover:text-primary/80">
                        Sign up
                    </Link>
                    </div>
                </CardFooter>
            </form>
        </Form>
      </Card>
    </div>
  );
}
