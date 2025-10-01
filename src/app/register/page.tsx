
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Code, Loader2, Eye, EyeOff } from "lucide-react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { NodeGarden } from "@/components/node-garden";
import { addUserToUsersCollection } from "@/lib/firebase-services";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters."),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions." }),
  }),
});

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      await updateProfile(userCredential.user, { displayName: values.name });
      
      const updatedUser = userCredential.user;

      if(updatedUser) {
        await addUserToUsersCollection(updatedUser);
        toast({ title: "Account created successfully!", description: "You will be redirected to the login page." });
        router.push("/login");
      }

    } catch (error: any) {
       console.error("Registration failed:", error);
       let friendlyMessage = "An unexpected error occurred. Please try again.";
        if (error.code === 'auth/email-already-in-use') {
            friendlyMessage = "This email is already registered. Please try logging in.";
        }
      toast({
        title: "Registration Failed",
        description: friendlyMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-muted/40 p-4 overflow-hidden">
      <NodeGarden />
      <Card className="w-full max-w-sm animate-fade-in-up z-10">
        <CardHeader className="text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <Code className="h-8 w-8 text-primary" />
          </Link>
          <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
          <CardDescription>Enter your details to get started.</CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 pt-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="m@example.com" {...field} />
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
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Accept terms and conditions
                      </FormLabel>
                      <FormDescription>
                        You agree to our <Link href="/terms-of-service" className="underline hover:text-primary">Terms of Service</Link> and <Link href="/privacy-policy" className="underline hover:text-primary">Privacy Policy</Link>.
                      </FormDescription>
                       <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
              
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline text-primary hover:text-primary/80">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
