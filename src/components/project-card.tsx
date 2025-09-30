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
      <CardHeader className="p-0">
        <div className="aspect-[3/2] relative w-full overflow-hidden">
          <Image
            src={project.imageUrls[0]}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={project.imageHints[0]}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-6">
        <Badge variant="secondary" className="mb-2">{project.category}</Badge>
        <CardTitle className="font-headline text-xl mb-2">
          {project.title}
        </CardTitle>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between items-center">
        <p className="text-2xl font-bold text-primary">
          Rs. ₹{project.price}
        </p>
        <Button asChild variant="outline">
          <span className="flex items-center">
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </span>
        </Button>
      </CardFooter>
    </>
  );

  if (isBlurred) {
    return (
      <Link href="/login">
        <Card className="relative flex flex-col overflow-hidden transition-all duration-300">
          <div className="blur-md pointer-events-none">{cardContent}</div>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4">
            <EyeOff className="h-12 w-12 mb-4" />
            <h3 className="font-headline text-xl font-bold text-center">Login to View Project</h3>
            <p className="text-center text-sm">You must be logged in to see details and purchase.</p>
          </div>
        </Card>
      </Link>
    );
  }

  return (
     <Link href={`/projects/${project.id}`}>
        <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full">
            {cardContent}
        </Card>
     </Link>
  );
}
