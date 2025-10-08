
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import type { Review } from "@/lib/placeholder-data";

interface ReviewCardProps {
  review: Review;
}

const StarRating = ({ rating }: { rating: number }) => {
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
                <Star
                    key={i}
                    className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`}
                />
            ))}
        </div>
    );
};


export function ReviewCard({ review }: ReviewCardProps) {
  const getInitials = (name?: string | null) => {
    if (!name) return "";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <Card className="h-full flex flex-col p-6">
        <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
                <AvatarImage src={review.reviewerImageUrl} alt={review.reviewerName} />
                <AvatarFallback>{getInitials(review.reviewerName)}</AvatarFallback>
            </Avatar>
            <div className="text-left">
                <h4 className="font-semibold text-primary">{review.reviewerName}</h4>
                 <p className="text-sm text-muted-foreground">
                    Purchased: <span className="font-medium">{review.projectName}</span>
                </p>
            </div>
        </div>
        <CardContent className="flex-1 flex flex-col items-start justify-center p-0 mt-4">
            <StarRating rating={review.rating} />
            <p className="mt-2 text-muted-foreground text-left">
                "{review.reviewText}"
            </p>
        </CardContent>
    </Card>
  );
}

    