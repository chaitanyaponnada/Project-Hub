"use client";

import { useForm, useFieldArray } from "react-hook-form";
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
import { Paperclip, PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const projectFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  description: z.string().min(20, "Description must be at least 20 characters."),
  category: z.string({ required_error: "Please select a category." }),
  technologies: z.string().min(3, "Please list at least one technology."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  files: z.array(z.object({
    name: z.string().min(1, "File name is required."),
    file: z.custom<FileList>().refine(files => files.length > 0, 'A file is required.'),
  })).min(1, "At least one project file is required."),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export function ProjectForm() {
  const { toast } = useToast();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      technologies: "",
      price: 0,
      files: [{ name: "", file: undefined }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "files"
  });

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
            
            <div>
              <FormLabel className="flex items-center gap-2 mb-4">
                <Paperclip className="w-4 h-4" /> Project Files
              </FormLabel>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <Card key={field.id} className="p-4 bg-muted/50 relative">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <FormField
                          control={form.control}
                          name={`files.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>File Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Source Code (ZIP)" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                       <FormField
                          control={form.control}
                          name={`files.${index}.file`}
                          render={({ field: { onChange, ...fieldProps } }) => (
                            <FormItem>
                              <FormLabel>File</FormLabel>
                              <FormControl>
                                <Input type="file" onChange={(e) => onChange(e.target.files)} {...fieldProps} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    </div>
                     {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 text-destructive"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                  </Card>
                ))}
              </div>
               <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => append({ name: "", file: undefined })}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Another File
              </Button>
               <FormDescription className="mt-2">
                  Upload the project source code, documentation, and any other relevant files.
               </FormDescription>
            </div>
            
            <Button type="submit">Save Project</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
