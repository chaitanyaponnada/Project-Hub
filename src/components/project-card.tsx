
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/placeholder-data";
import { ArrowRight, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  isBlurred?: boolean;
}

export function ProjectCard({ project, isBlurred = false }: ProjectCardProps) {
  const cardContent = (
    <>
      <CardHeader className="p-0 relative">
        <div className="aspect-[3/2] relative w-full overflow-hidden rounded-t-lg">
          <Image
            src={project.imageUrls?.[0] || `https://placehold.co/600x400?text=Image+Not+Found`}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        {project.tags && project.tags.length > 0 && (
          <div className="absolute top-2 left-2 flex gap-1 z-10">
            {project.tags.map(tag => (
              <Badge key={tag} variant="destructive" className="text-xs shadow-md">{tag}</Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <Badge variant="secondary" className="mb-2 text-xs">{project.category}</Badge>
        <CardTitle className="font-headline text-lg mb-2 leading-tight">
          {project.title}
        </CardTitle>
        <p className="text-muted-foreground text-sm line-clamp-3">
          {project.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-baseline gap-2">
            <p className="text-xl font-bold text-primary">
            Rs. {project.price.toFixed(2)}
            </p>
            {project.originalPrice && (
                <p className="text-sm text-muted-foreground line-through">
                Rs. {project.originalPrice.toFixed(2)}
                </p>
            )}
        </div>
        <Button asChild variant="outline" size="sm">
          <span className="flex items-center">
            View <ArrowRight className="ml-1.5 h-4 w-4" />
          </span>
        </Button>
      </CardFooter>
    </>
  );

  if (isBlurred) {
    return (
      <Link href="/login">
        <Card className="relative group flex flex-col overflow-hidden transition-all duration-300 h-full">
          <div className="blur-md pointer-events-none">{cardContent}</div>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4 text-center">
            <EyeOff className="h-10 w-10 mb-3" />
            <h3 className="font-headline text-lg font-bold">Login to View</h3>
            <p className="text-xs">Access details and purchase.</p>
          </div>
        </Card>
      </Link>
    );
  }

  return (
     <Link href={`/projects/${project.id}`}>
        <Card className="group flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full">
            {cardContent}
        </Card>
     </Link>
  );
}
