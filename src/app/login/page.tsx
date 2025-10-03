
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
import { signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useState, Suspense } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { NodeGarden } from "@/components/node-garden";
import { getUserById, addUserToUsersCollection } from "@/lib/firebase-services";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const isMobile = useIsMobile();

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
          // This case should ideally not happen if registration is enforced
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
          case 'auth/invalid-credential':
               friendlyMessage = "Incorrect email or password. Please try again.";
              break;
          case 'auth/invalid-api-key':
                friendlyMessage = "Firebase API key is invalid. Please check your configuration.";
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

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userDoc = await getUserById(user.uid);
      
      if (!userDoc) {
        await addUserToUsersCollection(user);
      }

      const updatedUserDoc = await getUserById(user.uid);

      if (updatedUserDoc && updatedUserDoc.isAdmin) {
          toast({ title: "Admin login successful!" });
          router.push('/admin');
      } else {
          toast({ title: "Login successful!" });
          router.push(redirectUrl);
      }

    } catch (error: any) {
      let friendlyMessage = "An unexpected error occurred during Google Sign-In. Please try again.";
      if (error.code === 'auth/popup-closed-by-user') {
        friendlyMessage = "The sign-in window was closed. Please try again.";
      } else if (error.code === 'auth/cancelled-popup-request') {
        // Do nothing, user cancelled.
        return;
      }
      toast({
        title: "Google Sign-In Failed",
        description: friendlyMessage,
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  }

  async function handlePasswordReset() {
    if (!resetEmail) {
        toast({ title: "Email required", description: "Please enter your email address.", variant: "destructive" });
        return;
    }
    setIsResetting(true);
    setIsResetDialogOpen(false); 
    try {
        await sendPasswordResetEmail(auth, resetEmail);
        setShowResetConfirmation(true);
    } catch (error: any) {
        console.error("Password reset error:", error);
        setShowResetConfirmation(true);
    } finally {
        setIsResetting(false);
        setResetEmail("");
    }
  }

  return (
    <>
    <div className="relative flex items-center justify-center min-h-screen bg-muted/40 p-4 overflow-hidden">
      {!isMobile && <NodeGarden />}
      <Card className="w-full max-w-sm animate-fade-in-up z-10">
        <CardHeader className="text-center">
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
                                <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
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
                     <div className="relative w-full">
                        <Separator />
                        <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                            OR CONTINUE WITH
                        </span>
                    </div>

                    <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading}>
                         {isGoogleLoading ? (
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                         ) : (
                          <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 261.8 0 120.8 109.8 8 244 8c66.8 0 126 25.5 169.1 65.5l-69.2 67.3c-24.6-23.5-58.9-38.1-99.9-38.1-82.6 0-149.7 67.5-149.7 150.3s67.1 150.3 149.7 150.3c95.2 0 132.3-73.3 135.8-109.5H244V261.8h244z"></path>
                          </svg>
                         )}
                        Google
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
    
    <AlertDialog open={showResetConfirmation} onOpenChange={setShowResetConfirmation}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Password Reset Email Sent</AlertDialogTitle>
            <AlertDialogDescription>
                If an account with that email exists, a reset link has been sent. <span className="border-b border-destructive">Please check spam if you don't see it in your inbox.</span>
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogAction onClick={() => setShowResetConfirmation(false)}>OK</AlertDialogAction>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}


export default function LoginPage() {
  return (
    <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
