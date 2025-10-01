
"use client";

import { useEffect, useState } from "react";
import { getProjectById } from "@/lib/firebase-services";
import type { Project } from "@/lib/placeholder-data";
import { ProjectForm } from "@/components/admin/project-form";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EditProjectPage({ params }: { params: { id: string } }) {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const fetchedProject = await getProjectById(params.id);
                if (fetchedProject) {
                    setProject(fetchedProject);
                } else {
                     toast({ title: "Error", description: "Project not found.", variant: "destructive" });
                }
            } catch (error) {
                 toast({ title: "Error", description: "Failed to fetch project details.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProject();
        }
    }, [params.id, toast]);

    if (loading) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!project) {
        return <div className="text-center">Project not found.</div>;
    }

    return <ProjectForm initialData={project} />;
}
