

"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (!loading && !user) {
            router.push('/login?redirect=/profile');
        }
    }, [user, loading, router]);

    if (!isClient || loading || !user) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }
    
    const getInitials = (name?: string | null) => {
        if (!name) return "";
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    return (
        <div className="container mx-auto px-4 py-12 animate-fade-in">
            <div className="flex flex-col items-center justify-center pt-12">
                <Card className="w-full max-w-sm text-center animate-fade-in-up">
                     <CardHeader>
                        <Avatar className="h-24 w-24 mx-auto mb-4">
                            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                            <AvatarFallback className="text-3xl">{getInitials(user.displayName)}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="font-headline text-2xl font-bold text-primary">{user.displayName}</CardTitle>
                        <CardDescription className="text-muted-foreground">{user.email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="text-center p-8 text-muted-foreground">
                            <UserIcon className="mx-auto h-12 w-12 mb-4" />
                            <p>Profile page is a work in progress.</p>
                             <p className="text-sm">Database functionality has been removed.</p>
                       </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
