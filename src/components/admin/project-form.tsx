
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Paperclip, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@/lib/placeholder-data";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { addProject, updateProject, uploadFile } from "@/lib/firebase-services";

const projectFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  description: z.string().min(20, "Description must be at least 20 characters."),
  category: z.string().min(3, "Please enter a category."),
  technologies: z.string().min(3, "Please list at least one technology."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  originalPrice: z.coerce.number().optional(),
  tags: z.string().optional(),
  imageUrls: z.string().min(1, "At least one image URL is required."),
  imageHints: z.string().min(1, "At least one image hint is required."),
  includedFiles: z.string().min(10, "Please list the files included in the download."),
  projectFile: z.custom<FileList>().optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  project?: Project;
}

export function ProjectForm({ project }: ProjectFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!project;

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      category: project?.category || "",
      technologies: project?.technologies.join(", ") || "",
      price: project?.price || 0,
      originalPrice: project?.originalPrice || undefined,
      tags: project?.tags?.join(", ") || "",
      imageUrls: project?.imageUrls.join(", ") || "",
      imageHints: project?.imageHints.join(", ") || "",
      includedFiles: project?.includedFiles?.join("\n") || "Source Code (ZIP)\nDocumentation (PDF)\nDatabase Schema (PNG)",
      projectFile: undefined,
    },
  });

  async function onSubmit(data: ProjectFormValues) {
    setIsLoading(true);

    try {
      let downloadUrl = project?.downloadUrl || "";
      if (data.projectFile && data.projectFile.length > 0) {
        const file = data.projectFile[0];
        const filePath = `projects/${Date.now()}_${file.name}`;
        downloadUrl = await uploadFile(file, filePath);
      }

      if (!isEditMode && !downloadUrl) {
          form.setError("projectFile", { message: "Project file is required for new projects." });
          setIsLoading(false);
          return;
      }

      const projectData: Omit<Project, 'id'> = {
        title: data.title,
        description: data.description,
        category: data.category,
        technologies: data.technologies.split(',').map(t => t.trim()),
        price: data.price,
        originalPrice: data.originalPrice,
        tags: data.tags?.split(',').map(t => t.trim()).filter(Boolean) || [],
        imageUrls: data.imageUrls.split(',').map(url => url.trim()),
        imageHints: data.imageHints.split(',').map(hint => hint.trim()),
        includedFiles: data.includedFiles.split('\n'),
        downloadUrl: downloadUrl,
      };

      if (isEditMode && project.id) {
        await updateProject(project.id, projectData);
      } else {
        await addProject(projectData);
      }

      toast({
        title: isEditMode ? "Project Updated!" : "Project Submitted!",
        description: `The project "${data.title}" has been ${isEditMode ? 'updated' : 'saved'}.`,
      });

      router.push('/admin/projects');
      router.refresh();

    } catch (error) {
      console.error("Failed to save project:", error);
      toast({
        title: "Save Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., AI-Powered E-commerce Platform" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the project, its features, and what makes it unique."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Web Development" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a new or existing category.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Price (Rs.)</FormLabel>
                    <FormControl>
                        <Input type="number" step="0.01" placeholder="5000.00" {...field} />
                    </FormControl>
                     <FormDescription>The final price for the project.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="originalPrice"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Original Price (Optional)</FormLabel>
                      <FormControl>
                          <Input type="number" step="0.01" placeholder="6000.00" {...field} />
                      </FormControl>
                      <FormDescription>
                          A strikethrough price to show a discount.
                      </FormDescription>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Marketing Tags (Optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. Best Seller, New" {...field} />
                        </FormControl>
                        <FormDescription>
                            Comma-separated tags like "Best Seller".
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
             </div>

            <FormField
              control={form.control}
              name="technologies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technologies</FormLabel>
                  <FormControl>
                    <Input placeholder="Comma-separated, e.g., React, Next.js, Tailwind CSS" {...field} />
                  </FormControl>
                   <FormDescription>
                    List the main technologies used in the project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrls"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URLs</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Comma-separated URLs for project images"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide direct links to your project images, separated by commas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageHints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Hints</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., code abstract, app mockup" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide comma-separated keywords for each image, in the same order as the URLs.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-6">
               <FormField
                  control={form.control}
                  name="includedFiles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Included Files</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List each file on a new line. e.g., Source Code (ZIP)"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        List all the files that the user will get in the download. This is for display purposes.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="projectFile"
                  render={({ field: { onChange, value, ...fieldProps } }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2">
                            <Paperclip className="w-4 h-4" /> Project Download File
                        </FormLabel>
                      <FormControl>
                        <Input 
                          type="file" 
                          accept=".zip,.rar,.tar"
                          onChange={(e) => onChange(e.target.files)}
                          {...fieldProps}
                        />
                      </FormControl>
                      <FormDescription>
                        {isEditMode ? "Upload a new file to replace the existing one." : "Upload the single ZIP or RAR file for the user to download."}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Update Project" : "Save Project"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
