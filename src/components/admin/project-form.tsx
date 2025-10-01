
"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from "lucide-react";
import { categories, type Project } from "@/lib/placeholder-data";
import { addProject, updateProject } from "@/lib/firebase-services";
import Image from "next/image";

const formSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters."),
    description: z.string().min(10, "Description must be at least 10 characters."),
    category: z.string({ required_error: "Please select a category." }),
    price: z.coerce.number().min(0, "Price must be a positive number."),
    originalPrice: z.coerce.number().optional(),
    tags: z.string().optional(),
    technologies: z.string().min(1, "Please enter at least one technology."),
    includedFiles: z.array(z.object({ value: z.string().min(1, "File name cannot be empty.") })).min(1, "Please add at least one included file."),
    imageUrls: z.array(z.any()).optional(), // For displaying existing images
    images: z.any().optional(), // For new image uploads
    projectFile: z.any().optional(), // Corresponds to downloadUrl/fileUrl
});

type ProjectFormValues = z.infer<typeof formSchema>;

interface ProjectFormProps {
    initialData?: Project | null;
}

export function ProjectForm({ initialData }: ProjectFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [imagePreviews, setImagePreviews] = useState<string[]>(initialData?.imageUrls || []);

    const defaultValues = initialData ? {
        ...initialData,
        technologies: initialData.technologies.join(", "),
        tags: initialData.tags?.join(", "),
        includedFiles: initialData.includedFiles.map(file => ({ value: file })),
    } : {
        title: "",
        description: "",
        price: 0,
        technologies: "",
        includedFiles: [{ value: "Full Source Code (ZIP)" }, { value: "Documentation (PDF)" }],
    };

    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });
    
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "includedFiles"
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const previews = files.map(file => URL.createObjectURL(file));
            setImagePreviews(previews);
        }
    };

    async function onSubmit(data: ProjectFormValues) {
        setIsLoading(true);
        try {
            const projectPayload = {
                title: data.title,
                description: data.description,
                category: data.category,
                price: data.price,
                originalPrice: data.originalPrice,
                tags: data.tags ? data.tags.split(",").map(tag => tag.trim()) : [],
                technologies: data.technologies.split(",").map(tech => tech.trim()),
                includedFiles: data.includedFiles.map(file => file.value),
                imageHints: [] // Placeholder
            };

            if (initialData) {
                // Update logic
                const newImages = data.images ? Array.from(data.images) : undefined;
                const newProjectFile = data.projectFile?.[0];
                await updateProject(initialData.id, projectPayload, newImages, newProjectFile);
                toast({ title: "Success", description: "Project updated successfully." });
                router.push("/admin/projects");
            } else {
                // Create logic
                if (!data.images || data.images.length === 0) {
                    toast({ title: "Error", description: "Please upload at least one image.", variant: "destructive" });
                    setIsLoading(false);
                    return;
                }
                if (!data.projectFile || data.projectFile.length === 0) {
                    toast({ title: "Error", description: "Please upload the project file.", variant: "destructive" });
                     setIsLoading(false);
                    return;
                }
                const images = Array.from(data.images);
                const projectFile = data.projectFile[0];
                await addProject(projectPayload as any, images, projectFile);
                toast({ title: "Success", description: "Project created successfully." });
                router.push("/admin/projects");
            }
        } catch (error) {
            console.error("Failed to save project:", error);
            toast({
                title: "Error",
                description: "An unexpected error occurred.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Project Details</CardTitle>
                                <CardDescription>Fill in the basic information about the project.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField control={form.control} name="title" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="description" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl><Textarea {...field} className="min-h-[120px]" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Media</CardTitle>
                                 <CardDescription>Upload project images.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        {imagePreviews.map((src, i) => (
                                            <Image key={i} src={src} alt="Preview" width={150} height={100} className="rounded-md object-cover aspect-[3/2]" />
                                        ))}
                                    </div>
                                )}
                                <FormField control={form.control} name="images" render={({ field }) => (
                                     <FormItem>
                                        <FormLabel>Project Images</FormLabel>
                                        <FormControl>
                                             <Input type="file" multiple {...form.register('images', { onChange: handleImageChange })} />
                                        </FormControl>
                                        <FormDescription>Upload one or more images for the project gallery.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle>What's Included</CardTitle>
                                 <CardDescription>List the files that will be delivered upon purchase.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                 {fields.map((field, index) => (
                                    <FormField
                                        key={field.id}
                                        control={form.control}
                                        name={`includedFiles.${index}.value`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex items-center gap-2">
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={() => append({ value: "" })}>
                                    Add Included File
                                </Button>
                            </CardContent>
                        </Card>

                    </div>

                    <div className="md:col-span-1 space-y-8">
                         <Card>
                            <CardHeader>
                                <CardTitle>Project File (fileUrl)</CardTitle>
                            </CardHeader>
                             <CardContent>
                                <FormField control={form.control} name="projectFile" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Downloadable File</FormLabel>
                                        <FormControl><Input type="file" {...form.register('projectFile')} /></FormControl>
                                        <FormDescription>Upload a .zip file containing all project assets.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                             </CardContent>
                         </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Organization</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField control={form.control} name="category" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                 <FormField control={form.control} name="technologies" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Technologies</FormLabel>
                                        <FormControl><Input {...field} placeholder="React, Next.js, etc." /></FormControl>
                                        <FormDescription>Comma-separated list of technologies.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                 <FormField control={form.control} name="tags" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tags</FormLabel>
                                        <FormControl><Input {...field} placeholder="Best Seller, New, etc." /></FormControl>
                                         <FormDescription>Comma-separated tags like "New", "Popular".</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Pricing</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField control={form.control} name="price" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price (Rs.)</FormLabel>
                                        <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                 <FormField control={form.control} name="originalPrice" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Original Price (Optional)</FormLabel>
                                        <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                                        <FormDescription>The "slashed" price to show a discount.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                     <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                     <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? "Save Changes" : "Create Project"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
