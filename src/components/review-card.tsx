
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, ShoppingBag } from "lucide-react";
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
                    className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`}
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
    <Card className="h-full flex flex-col p-6 text-left">
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border-2 border-primary/10">
                    <AvatarImage src={review.reviewerImageUrl} alt={review.reviewerName} />
                    <AvatarFallback>{getInitials(review.reviewerName)}</AvatarFallback>
                </Avatar>
                <div>
                    <h4 className="font-semibold text-primary">{review.reviewerName}</h4>
                    <p className="text-sm text-muted-foreground">{review.reviewerDesignation}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{review.reviewerLocation}</span>
                    </div>
                </div>
            </div>
            <StarRating rating={review.rating} />
        </div>
        <CardContent className="flex-1 p-0 mt-4 space-y-2">
            <p className="text-muted-foreground text-sm line-clamp-3">
                "{review.reviewText}"
            </p>
             <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-dashed">
                <ShoppingBag className="h-4 w-4 text-primary/50" />
                <span className="font-medium">Purchased:</span>
                <span className="font-semibold text-primary/80">{review.projectName}</span>
            </div>
        </CardContent>
    </Card>
  );
}
