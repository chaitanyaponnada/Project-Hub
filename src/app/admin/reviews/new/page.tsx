
'use client';

import { ReviewForm } from '@/components/admin/review-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewReviewPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Add New Review</CardTitle>
            <CardDescription>Fill out the form below to add a new customer review.</CardDescription>
        </CardHeader>
        <CardContent>
            <ReviewForm />
        </CardContent>
    </Card>
  )
}
