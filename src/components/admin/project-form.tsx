
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2 } from 'lucide-react';
import type { Project } from '@/lib/placeholder-data';
import { categories, defaultTags } from '@/lib/placeholder-data';
import { addProject, updateProject } from '@/lib/firebase-services';
import { useState } from 'react';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  category: z.string().min(2, 'Category is required.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  originalPrice: z.coerce.number().optional().or(z.literal('')),
  technologies: z.array(z.object({ value: z.string().min(1, "Technology cannot be empty.") })).min(1, "At least one technology is required."),
  includedFiles: z.array(z.object({ value: z.string().min(1, "File name cannot be empty.") })).min(1, "At least one included file is required."),
  tags: z.array(z.object({ value: z.string().min(1, "Tag cannot be empty.") })).optional(),
  imageUrls: z.array(z.object({ value: z.string().url("Must be a valid URL.") })).min(1, "At least one image URL is required."),
  downloadUrl: z.string().url("Must be a valid URL for the project file."),
});

type ProjectFormValues = z.infer<typeof formSchema>;

interface ProjectFormProps {
  project?: Project;
}

export function ProjectForm({ project }: ProjectFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues = project ? {
      ...project,
      technologies: project.technologies.map(value => ({ value })),
      includedFiles: project.includedFiles.map(value => ({ value })),
      tags: project.tags ? project.tags.map(value => ({ value })) : [],
      imageUrls: project.imageUrls.map(value => ({ value })),
      originalPrice: project.originalPrice || '',
  } : {
    title: '',
    description: '',
    category: '',
    price: 0,
    originalPrice: '',
    technologies: [{ value: '' }],
    includedFiles: [{value: ''}],
    tags: [],
    imageUrls: [{ value: '' }],
    downloadUrl: '',
  }

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields: techFields, append: appendTech, remove: removeTech } = useFieldArray({ control: form.control, name: "technologies" });
  const { fields: fileFields, append: appendFile, remove: removeFile } = useFieldArray({ control: form.control, name: "includedFiles" });
  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({ control: form.control, name: "tags" });
  const { fields: imageUrlFields, append: appendImageUrl, remove: removeImageUrl } = useFieldArray({ control: form.control, name: "imageUrls" });


  const onSubmit = async (data: ProjectFormValues) => {
    setIsLoading(true);

    try {
      const projectData = {
        ...data,
        technologies: data.technologies.map(t => t.value),
        includedFiles: data.includedFiles.map(f => f.value),
        tags: data.tags ? data.tags.map(t => t.value) : [],
        imageUrls: data.imageUrls.map(i => i.value),
        imageHints: [], // imageHints are deprecated as we use URLs now
        originalPrice: data.originalPrice || null,
      };

      if (project) {
        await updateProject(project.id, projectData);
        toast({ title: 'Success', description: 'Project updated successfully.' });
      } else {
        await addProject(projectData);
        toast({ title: 'Success', description: 'Project added successfully.' });
      }
      router.push('/admin/projects');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderFieldArray = (fields: any, append: any, remove: any, name: string, label: string) => (
      <div>
          <FormLabel>{label}</FormLabel>
          <div className="space-y-2 mt-2">
          {fields.map((field: any, index: number) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`${name}.${index}.value` as any}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input {...field} placeholder={`${label.slice(0,-1)} ${index + 1}`} />
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
          </div>
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ value: "" })}>
            Add {label.slice(0,-1)}
          </Button>
      </div>
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Project Title" {...field} />
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
                        <Textarea placeholder="Project Description" {...field} rows={5} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="100.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="originalPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Original Price (Optional)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="150.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                 <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
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
                  name="downloadUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project File URL (e.g., Google Drive, Dropbox link)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/download.zip" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <div className="space-y-6">
                 {renderFieldArray(techFields, appendTech, removeTech, 'technologies', 'Technologies')}
                 {renderFieldArray(fileFields, appendFile, removeFile, 'includedFiles', 'Included Files')}
                 {renderFieldArray(tagFields, appendTag, removeTag, 'tags', 'Tags')}
                 {renderFieldArray(imageUrlFields, appendImageUrl, removeImageUrl, 'imageUrls', 'Image URLs')}
            </div>
        </div>

        <Button type="submit" disabled={isLoading} size="lg">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {project ? 'Update Project' : 'Create Project'}
        </Button>
      </form>
    </Form>
  );
}
