
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
    <Card className="h-full flex flex-col p-6 text-center">
        <CardContent className="flex-1 flex flex-col items-center justify-center p-0">
            <StarRating rating={review.rating} />
            <p className="mt-4 text-muted-foreground italic line-clamp-2 h-[40px]">
                "{review.reviewText}"
            </p>
        </CardContent>
        <div className="mt-6 flex flex-col items-center">
            <Avatar className="h-14 w-14 mb-2">
                <AvatarImage src={review.reviewerImageUrl} alt={review.reviewerName} />
                <AvatarFallback>{getInitials(review.reviewerName)}</AvatarFallback>
            </Avatar>
            <h4 className="font-semibold text-primary">{review.reviewerName}</h4>
            <p className="text-sm text-muted-foreground">
                Purchased: <span className="font-medium">{review.projectName}</span>
            </p>
        </div>
    </Card>
  );
}
