
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Package, Download } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const { purchasedItems } = useCart();
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
        if (!name) return "U";
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    return (
        <div className="container mx-auto px-4 py-12 animate-fade-in">
            <div className="max-w-4xl mx-auto">
                <Card className="w-full mb-8 animate-fade-in-down">
                     <CardContent className="p-6 flex items-center gap-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                            <AvatarFallback className="text-3xl">{getInitials(user.displayName)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="font-headline text-3xl font-bold text-primary">{user.displayName}</h1>
                            <p className="text-muted-foreground">{user.email}</p>
                        </div>
                    </CardContent>
                </Card>

                <h2 className="font-headline text-2xl font-bold text-primary mb-6 animate-fade-in-up">My Purchased Projects</h2>

                {purchasedItems.length > 0 ? (
                    <div className="space-y-4 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                        {purchasedItems.map(item => (
                             <Card key={item.id} className="flex flex-col sm:flex-row items-center p-4">
                                <div className="relative h-32 w-full sm:h-24 sm:w-24 rounded-md overflow-hidden mr-0 sm:mr-4 mb-4 sm:mb-0">
                                    <Image src={item.imageUrls[0]} alt={item.title} fill className="object-cover" />
                                </div>
                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="font-semibold text-lg">{item.title}</h3>
                                    <p className="text-muted-foreground text-sm">{item.category}</p>
                                </div>
                                <Button asChild className="mt-4 sm:mt-0">
                                    <a href={item.downloadUrl} target="_blank" rel="noopener noreferrer">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Files
                                    </a>
                                </Button>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="text-center p-12 border-dashed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                        <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                        <h2 className="font-headline text-2xl font-semibold mb-2">No Projects Purchased</h2>
                        <p className="text-muted-foreground mb-6">Your purchased projects will appear here once you complete a checkout.</p>
                        <Button onClick={() => router.push('/projects')}>Browse Projects</Button>
                    </Card>
                )}
            </div>
        </div>
    );
}
