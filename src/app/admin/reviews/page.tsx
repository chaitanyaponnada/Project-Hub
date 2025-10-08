
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, MoreHorizontal, Trash2, Edit, Loader2, Search, Star } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Review } from '@/lib/placeholder-data';
import { getReviews, deleteReview } from '@/lib/firebase-services';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const StarRating = ({ rating }: { rating: number }) => {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
                <Star
                    key={i}
                    className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`}
                />
            ))}
        </div>
    );
};


export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const router = useRouter();


  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      const fetchedReviews = await getReviews();
      setReviews(fetchedReviews);
      setIsLoading(false);
    };
    fetchReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    return reviews.filter(review =>
      review.reviewerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (review.projectName && review.projectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      review.reviewText.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [reviews, searchTerm]);


  const handleDeleteReview = async () => {
      if (!reviewToDelete) return;

      setIsDeleting(true);
      try {
        await deleteReview(reviewToDelete.id);
        setReviews(reviews.filter(p => p.id !== reviewToDelete.id));
        toast({ title: "Review Deleted", description: `Review by "${reviewToDelete.reviewerName}" has been deleted.` });
      } catch (error) {
        console.error("Failed to delete review:", error);
        toast({ title: "Error", description: "Failed to delete review.", variant: "destructive" });
      } finally {
        setIsDeleting(false);
        setReviewToDelete(null);
      }
  }


  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Reviews</CardTitle>
            <CardDescription>Manage your customer reviews here.</CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/reviews/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Review
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Search by name, project, or review text..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
        {isLoading ? (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        ) : filteredReviews.length === 0 ? (
             <div className="text-center py-12">
                <p className="text-muted-foreground">No reviews found.</p>
            </div>
        ) : (
        <ScrollArea className="h-[60vh] w-full rounded-md border">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Reviewer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredReviews.map((review) => (
                <TableRow key={review.id}>
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={review.reviewerImageUrl} alt={review.reviewerName} />
                                <AvatarFallback>{review.reviewerName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{review.reviewerName}</p>
                                <p className="text-xs text-muted-foreground">{review.reviewerDesignation}, {review.reviewerLocation}</p>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <StarRating rating={review.rating} />
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{review.reviewText}</TableCell>
                    <TableCell>{review.projectName}</TableCell>
                    <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/admin/reviews/edit/${review.id}`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setReviewToDelete(review)} className="text-red-500">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </ScrollArea>
        )}
      </CardContent>
       <AlertDialog open={!!reviewToDelete} onOpenChange={() => setReviewToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the review by
                "{reviewToDelete?.reviewerName}".
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteReview} disabled={isDeleting}>
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
