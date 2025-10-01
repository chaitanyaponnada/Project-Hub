
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, Package, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { useInquiry } from "@/hooks/use-inquiry";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { purchasedItems } = useCart();
    const { inquiries } = useInquiry();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login?redirect=/profile');
        }
    }, [user, loading, router]);

    if (loading || !user) {
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
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row items-start gap-8 pt-12">
                <Card className="w-full md:w-1/4 sticky top-24">
                    <CardContent className="p-6 text-center">
                        <Avatar className="h-24 w-24 mx-auto mb-4">
                            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                            <AvatarFallback className="text-3xl">{getInitials(user.displayName)}</AvatarFallback>
                        </Avatar>
                        <h1 className="font-headline text-2xl font-bold text-primary">{user.displayName}</h1>
                        <p className="text-muted-foreground">{user.email}</p>
                    </CardContent>
                </Card>

                <div className="flex-1">
                    <Tabs defaultValue="projects" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="projects">
                                <Package className="mr-2" /> Purchased Projects
                            </TabsTrigger>
                            <TabsTrigger value="inquiries">
                                <MessageSquare className="mr-2" /> My Inquiries
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="projects" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Purchased Projects</CardTitle>
                                    <CardDescription>
                                        Here are all the projects you've purchased. You can download the files from the project detail page.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {purchasedItems.length > 0 ? (
                                        <div className="space-y-4">
                                            {purchasedItems.map(item => (
                                                <Card key={item.id} className="p-4 flex justify-between items-center">
                                                    <div>
                                                        <h3 className="font-semibold">{item.title}</h3>
                                                        <p className="text-sm text-muted-foreground">{item.category}</p>
                                                    </div>
                                                    <Button asChild variant="outline">
                                                        <Link href={`/projects/${item.id}`}>View & Download</Link>
                                                    </Button>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-center py-8">You haven't purchased any projects yet.</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="inquiries" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>My Inquiries</CardTitle>
                                    <CardDescription>A log of all the messages you've sent to us.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {inquiries.length > 0 ? (
                                        <div className="space-y-4">
                                            {inquiries.map(inquiry => (
                                                <Card key={inquiry.id} className="p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="font-semibold">Inquiry from {new Date(inquiry.date).toLocaleDateString()}</h3>
                                                        <Badge variant="outline">Submitted</Badge>
                                                    </div>
                                                    <p className="text-muted-foreground italic">"{inquiry.message}"</p>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-center py-8">You haven't sent any inquiries yet.</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
