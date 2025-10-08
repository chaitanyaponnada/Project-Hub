
'use client';

import { ReviewForm } from '@/components/admin/review-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getReviewById } from '@/lib/firebase-services';
import type { Review } from '@/lib/placeholder-data';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function EditReviewPage({ params }: { params: { id: string } }) {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      setLoading(true);
      const fetchedReview = await getReviewById(params.id);
      setReview(fetchedReview);
      setLoading(false);
    };

    if (params.id) {
      fetchReview();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!review) {
      return <div>Review not found.</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Review</CardTitle>
        <CardDescription>Update the details for the review by "{review.reviewerName}".</CardDescription>
      </CardHeader>
      <CardContent>
        <ReviewForm review={review} />
      </CardContent>
    </Card>
  );
}
