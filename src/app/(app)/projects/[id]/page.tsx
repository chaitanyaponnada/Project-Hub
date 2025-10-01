
"use client";

import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ShoppingCart, CheckCircle, Download, Loader2, ArrowLeft, FileCheck2, Zap, Ban, Bolt } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useMemo, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getProjectById } from "@/lib/firebase-services";
import type { Project } from "@/lib/placeholder-data";

export default function ProjectDetailsPage({ params: { id } }: { params: { id: string } }) {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [project, setProject] = useState<Project | null>(null);
  const [loadingProject, setLoadingProject] = useState(true);
  
  const { user, loading: authLoading } = useAuth();
  const { cartItems, addToCart, buyNow, purchasedItems } = useCart();
  
  const isInCart = useMemo(() => cartItems.some(item => item.id === project?.id), [cartItems, project]);
  const isPurchased = useMemo(() => purchasedItems.some(item => item.id === project?.id), [purchasedItems, project]);

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
    <div className="container mx-auto px-4 py-12 animate-fade-in">
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
                    <div className="grid grid-cols-2 gap-4">
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
                        <Button size="lg" onClick={() => buyNow(project, '/checkout')}>
                             <Bolt className="mr-2 h-5 w-5"/>
                             Buy Now
                        </Button>
                    </div>
                )}
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
