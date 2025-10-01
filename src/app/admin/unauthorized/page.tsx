
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Ban } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
    const router = useRouter();
  return (
    <div className="container mx-auto px-4 py-20 flex items-center justify-center">
      <Card className="max-w-md w-full text-center p-8">
        <CardContent>
          <Ban className="mx-auto h-16 w-16 text-destructive mb-4" />
          <h1 className="font-headline text-2xl font-bold text-destructive mb-2">Unauthorized</h1>
          <p className="text-muted-foreground mb-6">
            You do not have permission to view this page. This area is for administrators only.
          </p>
          <Button onClick={() => router.push('/')} variant="outline">
            Go to Homepage
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
