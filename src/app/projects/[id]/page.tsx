
"use client";

import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { projects } from "@/lib/placeholder-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ShoppingCart, CheckCircle, Download, Loader2, Lock, ArrowLeft, FileCheck2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useMemo, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const [id, setId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setId(params.id);
  }, [params.id]);

  const project = useMemo(() => {
    if (!id) return null;
    return projects.find((p) => p.id === id) || null;
  }, [id]);
  
  const { addToCart, cartItems, purchasedItems } = useCart();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && !user && id) {
      router.push('/login?redirect=/projects/' + id);
    }
  }, [user, loading, router, id]);


  const isInCart = useMemo(() => cartItems.some(item => item.id === project?.id), [cartItems, project]);
  const isPurchased = useMemo(() => purchasedItems.some(item => item.id === project?.id), [purchasedItems, project]);

  if (!project && id) {
    notFound();
  }

  if (loading || !user || !project) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </div>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div>
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
                            data-ai-hint={project.imageHints[index]}
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
        <div>
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
          
          {isPurchased ? (
             <Card className="bg-green-100 dark:bg-green-900/30 border-green-500">
                <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <div>
                            <h3 className="font-bold text-green-800 dark:text-green-300">Project Purchased!</h3>
                            <p className="text-sm text-green-700 dark:text-green-400">You can now download the project files.</p>
                        </div>
                    </div>
                     <Button asChild size="lg">
                        <a href={project.downloadUrl} download>
                          <Download className="mr-2 h-5 w-5" />
                          Download Project
                        </a>
                      </Button>
                </CardContent>
            </Card>
          ) : (
            <Card className="bg-background/50">
              <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-primary">Rs. {project.price.toFixed(2)}</p>
                    {project.originalPrice && (
                        <p className="text-xl text-muted-foreground line-through">Rs. {project.originalPrice.toFixed(2)}</p>
                    )}
                </div>
                <Button 
                  size="lg"
                  onClick={() => addToCart(project)}
                  disabled={isInCart}
                  className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {isInCart ? (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
