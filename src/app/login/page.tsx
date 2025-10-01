
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
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { NodeGarden } from "@/components/node-garden";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isAdmin } from "@/lib/firebase-services";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});


export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
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

  const adminForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "chaitanyaponnada657@gmail.com",
      password: "admin@super",
    },
  });


  async function handleLogin(values: z.infer<typeof formSchema>, forAdmin: boolean) {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      if (forAdmin) {
        const userIsAdmin = await isAdmin(userCredential.user.uid);
        if (userIsAdmin) {
          router.push('/admin');
          toast({ title: "Admin login successful!" });
        } else {
          await auth.signOut();
          toast({
            title: "Authorization Failed",
            description: "You are not authorized to access the admin panel.",
            variant: "destructive",
          });
        }
      } else {
        router.push(redirectUrl);
        toast({ title: "Login successful!" });
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
        console.error("Password reset error:", error);
         toast({
            title: "Password Reset Email Sent",
            description: "If an account with that email exists, a reset link has been sent.",
        });
    } finally {
        setIsResetting(false);
    }
}

  const renderLoginForm = (loginProvider: any, isAdminForm: boolean) => (
      <Form {...loginProvider}>
          <form onSubmit={loginProvider.handleSubmit((values) => handleLogin(values, isAdminForm))}>
            <CardContent className="space-y-4">
              <FormField
                control={loginProvider.control}
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
                control={loginProvider.control}
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
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign In
              </Button>
              
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="underline text-primary hover:text-primary/80"
                >
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
  )

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
            Sign in to continue.
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user">User</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            <TabsContent value="user">
                {renderLoginForm(form, false)}
            </TabsContent>
            <TabsContent value="admin">
                {renderLoginForm(adminForm, true)}
            </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
