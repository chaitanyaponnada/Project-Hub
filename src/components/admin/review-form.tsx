
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import type { Review } from '@/lib/placeholder-data';
import { addReview, updateReview } from '@/lib/firebase-services';
import { useState } from 'react';
import { Slider } from '@/components/ui/slider';

const formSchema = z.object({
  reviewerName: z.string().min(2, 'Name must be at least 2 characters.'),
  reviewerDesignation: z.string().min(2, 'Designation is required.'),
  reviewerLocation: z.string().min(2, 'Location is required.'),
  reviewerImageUrl: z.string().url("Must be a valid URL."),
  projectName: z.string().min(2, 'Project name is required.'),
  reviewText: z.string().min(10, 'Review text must be at least 10 characters.'),
  rating: z.number().min(1).max(5),
  highlightWord: z.string().optional(),
  reviewTitle: z.string().optional(),
});

type ReviewFormValues = z.infer<typeof formSchema>;

interface ReviewFormProps {
  review?: Review;
}

export function ReviewForm({ review }: ReviewFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues = review ? {
      ...review,
      highlightWord: review.highlightWord || '',
      reviewTitle: review.reviewTitle || '',
  } : {
    reviewerName: '',
    reviewerDesignation: '',
    reviewerLocation: '',
    reviewerImageUrl: '',
    projectName: '',
    reviewText: '',
    rating: 5,
    highlightWord: '',
    reviewTitle: '',
  }

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: ReviewFormValues) => {
    setIsLoading(true);

    if (review) {
        await updateReview(review.id, data);
        toast({ title: 'Review Updated', description: `The review has been successfully updated.` });
    } else {
        await addReview(data);
        toast({ title: 'Review Added', description: `The new review has been successfully added.` });
    }
    router.push('/admin/reviews');
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="reviewerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reviewer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reviewerDesignation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reviewer Designation</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Student, Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="reviewerLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reviewer Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., New York, USA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="reviewerImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reviewer Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Rating: {field.value}</FormLabel>
                            <FormControl>
                                <Slider
                                    min={1}
                                    max={5}
                                    step={1}
                                    defaultValue={[field.value]}
                                    onValueChange={(value) => field.onChange(value[0])}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>
            <div className="space-y-6">
                 <FormField
                  control={form.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., AI Shopping Assistant" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reviewTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review Title (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Amazing!" {...field} />
                      </FormControl>
                       <FormDescription>A short, catchy title for the review.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="reviewText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review Text</FormLabel>
                      <FormControl>
                        <Textarea placeholder="The project was amazing..." {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="highlightWord"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Highlight Word (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., amazing" {...field} />
                      </FormControl>
                      <FormDescription>The first instance of this word will be highlighted in the review.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
        </div>

        <Button type="submit" disabled={isLoading} size="lg">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {review ? 'Update Review' : 'Create Review'}
        </Button>
      </form>
    </Form>
  );
}
