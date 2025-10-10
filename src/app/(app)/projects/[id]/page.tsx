
"use client";

import { notFound, useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ShoppingCart, CheckCircle, Download, Loader2, ArrowLeft, FileCheck2, Bolt, Phone, Mail, MessageCircle } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useMemo, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getProjectById, addPurchaseRequest } from "@/lib/firebase-services";
import type { Project } from "@/lib/placeholder-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";


const requestSchema = z.object({
  phone: z.string().min(10, "Please enter a valid phone number."),
  email: z.string().email("Please enter a valid email address."),
});

const SuccessDialog = ({ open, onOpenChange, onConfirm }: { open: boolean, onOpenChange: (open: boolean) => void, onConfirm: () => void }) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader className="items-center text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mb-2" />
                    <AlertDialogTitle>Request Submitted!</AlertDialogTitle>
                    <AlertDialogDescription>
                        Thank you for your interest! Our team will contact you shortly to finalize the purchase.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogAction onClick={onConfirm}>OK</AlertDialogAction>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default function ProjectDetailsPage() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [project, setProject] = useState<Project | null>(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  const { user, loading: authLoading } = useAuth();
  const { cartItems, addToCart, purchasedProjectIds } = useCart();
  const { toast } = useToast();
  
  const isInCart = useMemo(() => cartItems.some(item => item.id === project?.id), [cartItems, project]);
  const isPurchased = useMemo(() => purchasedProjectIds.includes(project?.id || ''), [purchasedProjectIds, project]);
  
  const form = useForm<z.infer<typeof requestSchema>>({
    resolver: zodResolver(requestSchema),
    defaultValues: { phone: "", email: user?.email || "" },
  });
  
  useEffect(() => {
    if (user) {
      form.reset({
        phone: user.phoneNumber || "",
        email: user.email || "",
      });
    }
  }, [user, form]);


  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/projects/' + id);
    }
  }, [user, authLoading, router, id]);

  useEffect(() => {
    const fetchProject = async () => {
      setLoadingProject(true);
      const foundProject = await getProjectById(id);
      if (foundProject) {
        setProject(foundProject);
      }
      setLoadingProject(false);
    };

    if(id) {
        fetchProject();
    }
  }, [id]);

  const handleBuyNow = () => {
    if (!user) {
      router.push('/login?redirect=/projects/' + id);
      return;
    }
    setShowRequestDialog(true);
  };
  
  const handleRequestSubmit = async (values: z.infer<typeof requestSchema>) => {
    if (!user || !project) return;
    setIsRequesting(true);
    try {
      await addPurchaseRequest({
        projectId: project.id,
        projectTitle: project.title,
        userId: user.uid,
        userName: user.displayName || 'N/A',
        userEmail: values.email,
        userPhone: values.phone,
      });
      setShowRequestDialog(false);
      setShowSuccessDialog(true);
    } catch(error) {
       toast({
        title: "Error Submitting Request",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
       setIsRequesting(false);
    }
  }


  if (loadingProject || authLoading || !isClient) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (!user) {
     return (
      <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  return (
    <>
    <div className="container mx-auto px-4 py-16 md:py-24 animate-fade-in">
        <div className="mb-8">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </div>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="animate-fade-in-right">
           <div className="relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {project.imageUrls.map((url, index) => (
                    <CarouselItem key={index}>
                      <Card className="overflow-hidden">
                        <div className="aspect-[3/2] relative">
                          <Image
                            src={url}
                            alt={`${project.title} - preview ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
              {project.tags && project.tags.length > 0 && (
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                    {project.tags.map(tag => (
                    <Badge key={tag} variant="destructive" className="text-sm shadow-lg">{tag}</Badge>
                    ))}
                </div>
              )}
           </div>
        </div>
        <div className="animate-fade-in-left" style={{ animationDelay: '0.2s' }}>
          <Badge variant="secondary" className="mb-2">{project.category}</Badge>
          <h1 className="font-headline text-4xl font-bold text-primary mb-4">{project.title}</h1>
          <p className="text-muted-foreground text-lg mb-6">{project.description}</p>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 font-headline">Technologies Used</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="outline">{tech}</Badge>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3 font-headline">What's Included</h2>
            <Card>
              <CardContent className="p-4 space-y-3">
                {project.includedFiles.map((file, index) => (
                   <div key={index} className="flex items-center gap-3 p-2 text-sm">
                    <FileCheck2 className="h-5 w-5 text-primary" />
                    <span>{file}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          
            <Card className="bg-muted/50">
              <CardContent className="p-6">
                 <div className="flex items-baseline gap-2 mb-6">
                    <p className="text-4xl font-bold text-primary">Rs. {project.price.toFixed(2)}</p>
                    {project.originalPrice && (
                        <p className="text-xl text-muted-foreground line-through">Rs. {project.originalPrice.toFixed(2)}</p>
                    )}
                </div>

                {isPurchased ? (
                     <Button asChild className="w-full" size="lg">
                        <a href={project.downloadUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="mr-2 h-5 w-5"/>
                            Download Project
                        </a>
                    </Button>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button 
                            variant="outline" 
                            size="lg"
                            onClick={() => addToCart(project)}
                            disabled={isInCart}
                        >
                            {isInCart ? (
                                <>
                                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                                    Added to Cart
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="mr-2 h-5 w-5"/>
                                    Add to Cart
                                </>
                            )}
                        </Button>
                        <Button size="lg" onClick={handleBuyNow}>
                             <Bolt className="mr-2 h-5 w-5"/>
                             Buy Now
                        </Button>
                    </div>
                )}
                 <div className="mt-4">
                     <Button size="lg" variant="ghost" className="w-full" onClick={() => router.push('/contact')}>
                        <MessageCircle className="mr-2 h-5 w-5"/>
                        Contact Us for Details
                     </Button>
                 </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
    
    <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Request to Purchase "{project.title}"</DialogTitle>
                <DialogDescription>
                    Please confirm your contact details below. Our team will reach out to you shortly to complete the transaction.
                </DialogDescription>
            </DialogHeader>
             <Form {...form}>
                 <form onSubmit={form.handleSubmit(handleRequestSubmit)} className="space-y-4 py-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input type="email" placeholder="you@example.com" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                             <div className="relative">
                               <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                               <Input type="tel" placeholder="+91 98765 43210" className="pl-10" {...field} />
                             </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter className="pt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isRequesting}>
                            {isRequesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Request
                        </Button>
                    </DialogFooter>
                 </form>
             </Form>
        </DialogContent>
    </Dialog>
    
    <SuccessDialog 
        open={showSuccessDialog} 
        onOpenChange={setShowSuccessDialog}
        onConfirm={() => setShowSuccessDialog(false)}
    />
    </>
  );
}
