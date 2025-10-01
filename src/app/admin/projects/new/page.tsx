
"use client";

import { ProjectForm } from "@/components/admin/project-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
  const router = useRouter();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
           <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="text-right">
            <h1 className="font-headline text-3xl font-bold">Add New Project</h1>
            <p className="text-muted-foreground">
              Fill in the details below.
            </p>
          </div>
        </header>
        <ProjectForm />
      </div>
    </div>
  );
}
