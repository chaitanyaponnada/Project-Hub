
"use client";

import { ProjectForm } from "@/components/admin/project-form";
import { projects } from "@/lib/placeholder-data";
import { notFound, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const project = projects.find(p => p.id === params.id);
  const router = useRouter();

  if (!project) {
    return notFound();
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-headline text-3xl font-bold">Edit Project</h1>
            <p className="text-muted-foreground">
              Update the details for "{project.title}".
            </p>
          </div>
           <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </header>
        <ProjectForm project={project} />
      </div>
    </div>
  );
}
