
'use client';

import { ProjectForm } from '@/components/admin/project-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewProjectPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Add New Project</CardTitle>
            <CardDescription>Fill out the form below to add a new project to the marketplace.</CardDescription>
        </CardHeader>
        <CardContent>
            <ProjectForm />
        </CardContent>
    </Card>
  )
}
