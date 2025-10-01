
"use client";

import { ProjectForm } from "@/components/admin/project-form";
import { getProjectById } from "@/lib/firebase-services";
import type { Project } from "@/lib/placeholder-data";
import { notFound, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProject = async () => {
      const fetchedProject = await getProjectById(params.id);
      if (fetchedProject) {
        setProject(fetchedProject);
      }
      setLoading(false);
    };
    fetchProject();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!project) {
    return notFound();
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
           <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="text-right">
            <h1 className="font-headline text-3xl font-bold">Edit Project</h1>
            <p className="text-muted-foreground">
              Update the details for "{project.title}".
            </p>
          </div>
        </header>
        <ProjectForm project={project} />
      </div>
    </div>
  );
}
