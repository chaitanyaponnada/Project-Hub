import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-6">
          <h1 className="font-headline text-3xl font-bold">Add New Project</h1>
          <p className="text-muted-foreground">
            Fill in the details below. Use the AI tools to generate a title and description.
          </p>
        </header>
        <ProjectForm />
      </div>
    </div>
  );
}
