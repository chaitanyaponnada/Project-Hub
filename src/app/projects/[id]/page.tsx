
"use client";

import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { projects } from "@/lib/placeholder-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ShoppingCart, CheckCircle, Download } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useMemo, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const project = projects.find((p) => p.id === params.id);
  const { addToCart, cartItems, purchasedItems } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/projects/' + params.id);
    }
  }, [user, loading, router, params.id]);


  const isInCart = useMemo(() => cartItems.some(item => item.id === project?.id), [cartItems, project]);
  const isPurchased = useMemo(() => purchasedItems.some(item => item.id === project?.id), [purchasedItems, project]);

  if (!project) {
    notFound();
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
          <p>Loading...</p>
      </div>
    );
  }

  // Dummy data for project files for now
  const projectFiles = [
    { name: "Source Code (ZIP)", url: "#" },
    { name: "Documentation (PDF)", url: "#" },
    { name: "Database Schema (PNG)", url: "#" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div>
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
            <h2 className="text-lg font-semibold mb-3 font-headline">Project Files</h2>
            <Card>
              <CardContent className="p-4 space-y-3">
                {projectFiles.map((file) => (
                   <div key={file.name} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                    <span>{file.name}</span>
                    <Button asChild variant="outline" size="sm" disabled={!isPurchased}>
                      <a href={file.url} download>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          
          {!isPurchased && (
            <Card className="bg-background/50">
              <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-4xl font-bold text-primary">₹{project.price}</p>
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
