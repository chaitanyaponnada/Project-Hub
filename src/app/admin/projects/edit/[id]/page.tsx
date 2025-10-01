
'use client';

import { ProjectForm } from '@/components/admin/project-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getProjectById } from '@/lib/firebase-services';
import type { Project } from '@/lib/placeholder-data';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      const fetchedProject = await getProjectById(params.id);
      setProject(fetchedProject);
      setLoading(false);
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!project) {
      return <div>Project not found.</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Project</CardTitle>
        <CardDescription>Update the details for "{project.title}".</CardDescription>
      </CardHeader>
      <CardContent>
        <ProjectForm project={project} />
      </CardContent>
    </Card>
  );
}
