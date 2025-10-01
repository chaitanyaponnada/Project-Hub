
import { Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
      <Ban className="w-16 h-16 text-destructive mb-4" />
      <h1 className="text-4xl font-bold mb-2">Access Denied</h1>
      <p className="text-muted-foreground mb-6">
        You do not have permission to view this page.
      </p>
      <Button asChild>
        <Link href="/">Go to Homepage</Link>
      </Button>
    </div>
  );
}
