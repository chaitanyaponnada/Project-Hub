
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal, PlusCircle, Trash2, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProjects, deleteProject } from "@/lib/firebase-services";
import type { Project } from "@/lib/placeholder-data";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const fetchedProjects = await getProjects();
                setProjects(fetchedProjects);
            } catch (error) {
                console.error("Error fetching projects:", error);
                toast({
                    title: "Error",
                    description: "Could not fetch projects.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [toast]);

    const handleDeleteProject = async (projectId: string) => {
        if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;

        try {
            await deleteProject(projectId);
            setProjects(projects.filter(p => p.id !== projectId));
            toast({
                title: "Success",
                description: "Project deleted successfully."
            });
        } catch (error) {
            console.error("Error deleting project:", error);
            toast({
                title: "Error",
                description: "Could not delete project.",
                variant: "destructive"
            });
        }
    };
    
    if (loading) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }


    return (
        <Tabs defaultValue="all">
            <div className="flex items-center">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                    <Button size="sm" asChild>
                        <Link href="/admin/projects/new">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Project
                        </Link>
                    </Button>
                </div>
            </div>
            <TabsContent value="all">
                <Card>
                    <CardHeader>
                        <CardTitle>Projects</CardTitle>
                        <CardDescription>
                            Manage your projects and view their sales performance.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="hidden w-[100px] sm:table-cell">
                                        Image
                                    </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Price
                                    </TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.map((project) => (
                                    <TableRow key={project.id}>
                                        <TableCell className="hidden sm:table-cell">
                                            <Image
                                                alt="Project image"
                                                className="aspect-square rounded-md object-cover"
                                                height="64"
                                                src={project.imageUrls[0]}
                                                width="64"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {project.title}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{project.category}</Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            Rs. {project.price.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem asChild><Link href={`/admin/projects/${project.id}/edit`}><Edit className="mr-2 h-4 w-4" />Edit</Link></DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDeleteProject(project.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter>
                        <div className="text-xs text-muted-foreground">
                            Showing <strong>1-{projects.length}</strong> of <strong>{projects.length}</strong> products
                        </div>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
