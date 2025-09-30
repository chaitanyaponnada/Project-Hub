import { ProjectForm } from "@/components/admin/project-form";
import { projects } from "@/lib/placeholder-data";
import { notFound } from "next/navigation";

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const project = projects.find(p => p.id === params.id);

  if (!project) {
    return notFound();
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-6">
          <h1 className="font-headline text-3xl font-bold">Edit Project</h1>
          <p className="text-muted-foreground">
            Update the details for "{project.title}".
          </p>
        </header>
        <ProjectForm project={project} />
      </div>
    </div>
  );
}
