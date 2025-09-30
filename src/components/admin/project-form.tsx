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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "@/lib/placeholder-data";
import { Wand2, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateProjectTitle } from "@/ai/flows/generate-project-title";
import { generateProjectDescription } from "@/ai/flows/generate-project-description";

const projectFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  description: z.string().min(20, "Description must be at least 20 characters."),
  category: z.string({ required_error: "Please select a category." }),
  technologies: z.string().min(3, "Please list at least one technology."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  projectDetailsPrompt: z.string().min(10, "Please provide some details for AI generation.")
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export function ProjectForm() {
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      technologies: "",
      price: 0,
      projectDetailsPrompt: "",
    },
  });

  const handleGenerateTitle = async () => {
    const projectDetails = form.getValues("projectDetailsPrompt");
    if (!projectDetails) {
      form.setError("projectDetailsPrompt", { message: "Please enter some project details first." });
      return;
    }
    setIsGeneratingTitle(true);
    try {
      const result = await generateProjectTitle({ projectDetails });
      form.setValue("title", result.title, { shouldValidate: true });
      toast({ title: "Title generated successfully!", variant: "default" });
    } catch (error) {
      toast({ title: "Error generating title", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsGeneratingTitle(false);
    }
  };
  
  const handleGenerateDescription = async () => {
    const values = form.getValues();
    if (!values.projectDetailsPrompt) {
        form.setError("projectDetailsPrompt", { message: "Please enter some project details first." });
        return;
    }
    if (!values.title) {
        form.setError("title", { message: "Please provide a title or generate one first." });
        return;
    }

    setIsGeneratingDesc(true);
    try {
        const result = await generateProjectDescription({
            projectTitle: values.title,
            projectCategory: values.category,
            projectTechnologies: values.technologies,
            projectDescriptionPrompt: values.projectDetailsPrompt,
        });
        form.setValue("description", result.generatedDescription, { shouldValidate: true });
        toast({ title: "Description generated successfully!", variant: "default" });
    } catch (error) {
        toast({ title: "Error generating description", description: "Please try again.", variant: "destructive" });
    } finally {
        setIsGeneratingDesc(false);
    }
  };


  function onSubmit(data: ProjectFormValues) {
    console.log(data);
    toast({
      title: "Project Submitted!",
      description: "The new project has been saved.",
    });
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="p-4 border rounded-lg bg-muted/30 space-y-4">
                <FormField
                control={form.control}
                name="projectDetailsPrompt"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center gap-2 text-base font-headline">
                        <Sparkles className="w-5 h-5 text-accent" /> AI Content Generation
                    </FormLabel>
                    <FormDescription>
                        Provide some details about the project (features, purpose, etc.) and let AI help you write the content.
                    </FormDescription>
                    <Textarea placeholder="e.g., A social media dashboard built with React and Firebase. Allows users to connect multiple accounts and view analytics..." {...field} />
                    <FormMessage />
                    </FormItem>
                )}
                />
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button type="button" variant="outline" onClick={handleGenerateTitle} disabled={isGeneratingTitle || isGeneratingDesc}>
                        {isGeneratingTitle ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        Generate Title
                    </Button>
                    <Button type="button" variant="outline" onClick={handleGenerateDescription} disabled={isGeneratingTitle || isGeneratingDesc}>
                        {isGeneratingDesc ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        Generate Description
                    </Button>
                </div>
            </div>

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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a project category" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="100.00" {...field} />
                    </FormControl>
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
            
            <Button type="submit" disabled={isGeneratingTitle || isGeneratingDesc}>Save Project</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
