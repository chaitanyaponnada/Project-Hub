
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

export function ReviewCard({ review }: ReviewCardProps) {
  const getInitials = (name?: string | null) => {
    if (!name) return "";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  const HighlightedReviewText = ({ text, highlight }: { text: string, highlight?: string }) => {
    if (!highlight) {
      return <>{text}</>;
    }
    const parts = text.split(new RegExp(`(${highlight})`, 'i'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={index} className="bg-primary/20 text-primary font-bold px-1 rounded-sm">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <Card className="h-full flex flex-col p-6 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
             <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-primary/10">
                    <AvatarImage src={review.reviewerImageUrl} alt={review.reviewerName} />
                    <AvatarFallback>{getInitials(review.reviewerName)}</AvatarFallback>
                </Avatar>
                <div>
                    <h4 className="font-semibold text-primary">{review.reviewerName}</h4>
                    <p className="text-xs text-muted-foreground">{review.reviewerDesignation}</p>
                </div>
            </div>
            <StarRating rating={review.rating} />
        </div>

        <CardContent className="flex-1 p-0 mt-2 space-y-3">
             <p className="text-muted-foreground text-sm leading-relaxed">
               <span className="text-3xl font-bold text-primary/30 mr-1">“</span>
               <HighlightedReviewText text={review.reviewText} highlight={review.highlightWord} />
               <span className="text-3xl font-bold text-primary/30 ml-1">”</span>
            </p>
             <div className="flex items-center gap-2 text-xs text-muted-foreground pt-3 border-t border-dashed">
                <ShoppingBag className="h-4 w-4 text-primary/50" />
                <span className="font-medium">Purchased:</span>
                <span className="font-semibold text-primary/80">{review.projectName}</span>
            </div>
        </CardContent>
    </Card>
  );
}
