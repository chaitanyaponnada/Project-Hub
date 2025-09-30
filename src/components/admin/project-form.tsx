
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

const projectFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  description: z.string().min(20, "Description must be at least 20 characters."),
  category: z.string().min(3, "Please enter a category."),
  technologies: z.string().min(3, "Please list at least one technology."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  originalPrice: z.coerce.number().optional(),
  tags: z.string().optional(),
  includedFiles: z.string().min(10, "Please list the files included in the download."),
  projectFile: z.instanceof(FileList).optional(),
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
      includedFiles: project?.includedFiles?.join("\n") || "Source Code (ZIP)\nDocumentation (PDF)\nDatabase Schema (PNG)",
      projectFile: undefined,
    },
  });

  async function onSubmit(data: ProjectFormValues) {
    setIsLoading(true);
    console.log(data);

    // In a real app, you would handle file upload here.
    if (!isEditMode && (!data.projectFile || data.projectFile.length === 0)) {
        form.setError("projectFile", { message: "Project file is required." });
        setIsLoading(false);
        return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: isEditMode ? "Project Updated!" : "Project Submitted!",
      description: `The project "${data.title}" has been ${isEditMode ? 'updated' : 'saved'}.`,
    });
    
    setIsLoading(false);
    
    // In a real app, you would have API calls here to save/update the data.
    // Since we're using placeholder data, we'll just navigate back.
    router.push('/admin/projects');
    router.refresh(); // To reflect changes if data was from a real backend
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
                  render={({ field: { onChange, ...fieldProps } }) => (
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
                        Upload the single ZIP or RAR file for the user to download.
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
